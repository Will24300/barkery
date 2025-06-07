import db from "../configs/db.config.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // Use TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOrderConfirmationEmail = async (
  customerEmail,
  customerName,
  orderId,
  orderItems,
  totalAmount,
  deliveryAddress
) => {
  const mailOptions = {
    from: `"Barkery" <${process.env.EMAIL_USER}>`,
    to: customerEmail,
    subject: `Order Confirmation - Order #${orderId}`,
    html: `
      <h2>Thank You for Your Order, ${customerName}!</h2>
      <p>Your order (ID: ${orderId}) has been successfully placed.</p>
      <h3>Order Details</h3>
      <ul>
        ${orderItems
          .map(
            (item) => `
              <li>
                <img src="${item.product_image_url}" alt="${
              item.product_name
            }" style="width: 50px; height: 50px;" />
                <strong>${item.product_name}</strong>: ${
              item.quantity
            } x $${item.price_at_purchase.toFixed(2)}
              </li>
            `
          )
          .join("")}
      </ul>
      <p><strong>Total Amount:</strong> $${totalAmount.toFixed(2)}</p>
      <p><strong>Delivery Address:</strong> ${deliveryAddress}</p>
      <p>You will receive another email when your order is shipped.</p>
      <p>Thank you for shopping with Barkery!</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Confirmation email sent to ${customerEmail}`);
  } catch (error) {
    console.error("Error sending email:", error);
    // Log but don't throw to avoid failing the order
  }
};

const createOrder = async (req, res) => {
  try {
    const {
      user_id,
      total_amount,
      delivery_address,
      customer_email,
      customer_name,
      order_items,
    } = req.body;

    // Log incoming request for debugging
    console.log("Received order data:", req.body);

    // Validate input
    if (
      !total_amount ||
      !delivery_address ||
      !customer_email ||
      !customer_name ||
      !order_items ||
      !Array.isArray(order_items)
    ) {
      console.error("Validation failed: Missing required fields");
      return res
        .status(400)
        .json({ Error: "Missing required fields or invalid order items" });
    }

    // Validate order items
    for (const item of order_items) {
      if (
        !item.product_id ||
        !item.quantity ||
        !item.price_at_purchase ||
        !item.product_image_url ||
        !item.product_name
      ) {
        console.error("Invalid order item:", item);
        return res.status(400).json({ Error: "Invalid order item data" });
      }
    }

    // Start a transaction
    db.beginTransaction((err) => {
      if (err) {
        console.error("Transaction start error:", err);
        return res.status(500).json({ Error: "Failed to start transaction" });
      }

      // Insert into orders table
      const createOrderQuery = `
  INSERT INTO orders (user_id, total_amount, status, delivery_address, created_at)
  VALUES (?, ?, 'pending', ?, NOW())
`;
      const orderData = [user_id || null, total_amount, delivery_address];

      db.query(createOrderQuery, orderData, (orderErr, orderResult) => {
        if (orderErr) {
          console.error("Order insertion error:", orderErr);
          return db.rollback(() => {
            res
              .status(500)
              .json({ Error: "Inserting data error in orders table" });
          });
        }

        const orderId = orderResult.insertId;

        // Prepare order items for insertion
        const orderItemsQuery = `
    INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase, product_image_url)
    VALUES ?
  `;
        const orderItemsData = order_items.map((item) => [
          orderId,
          item.product_id,
          item.quantity,
          item.price_at_purchase,
          item.product_image_url,
        ]);

        // Insert into order_items table
        db.query(
          orderItemsQuery,
          [orderItemsData],
          async (itemsErr, itemsResult) => {
            if (itemsErr) {
              console.error("Order items insertion error:", itemsErr);
              return db.rollback(() => {
                res
                  .status(500)
                  .json({ Error: "Inserting data error in order_items table" });
              });
            }

            // Send confirmation email (non-blocking)
            sendOrderConfirmationEmail(
              customer_email,
              customer_name,
              orderId,
              order_items,
              total_amount,
              delivery_address
            ).catch((emailError) => {
              console.error("Email sending failed:", emailError);
            });

            // Commit transaction
            db.commit((commitErr) => {
              if (commitErr) {
                console.error("Transaction commit error:", commitErr);
                return db.rollback(() => {
                  res
                    .status(500)
                    .json({ Error: "Failed to commit transaction" });
                });
              }

              return res.status(201).json({
                Status: "Success",
                order_id: orderId,
              });
            });
          }
        );
      });
    });
  } catch (error) {
    console.error("Error creating order:", error);
    if (!res.headersSent) {
      res.status(500).json({ Error: "Server error: " + error.message });
    }
  }
};

const getOrders = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ Error: "Unauthorized" });
    }

    const orders = await new Promise((resolve, reject) => {
      const query = `
        SELECT 
          o.order_id,
          o.total_amount,
          o.status,
          o.delivery_address,
          o.created_at,
          oi.order_item_id,
          oi.product_id,
          oi.quantity,
          oi.price_at_purchase,
          oi.product_image_url,
          p.name AS product_name
        FROM orders o
        LEFT JOIN order_items oi ON o.order_id = oi.order_id
        LEFT JOIN products p ON oi.product_id = p.product_id
        WHERE o.user_id = ?
      `;
      db.query(query, [userId], (error, results) => {
        if (error) {
          return reject(error);
        }
        const ordersMap = results.reduce((acc, row) => {
          if (!acc[row.order_id]) {
            acc[row.order_id] = {
              order_id: row.order_id,
              total_amount: row.total_amount,
              status: row.status,
              delivery_address: row.delivery_address,
              created_at: row.created_at,
              order_items: [],
            };
          }
          if (row.order_item_id) {
            acc[row.order_id].order_items.push({
              order_item_id: row.order_item_id,
              product_id: row.product_id,
              product_name: row.product_name,
              quantity: row.quantity,
              price_at_purchase: row.price_at_purchase,
              product_image_url: row.product_image_url,
            });
          }
          return acc;
        }, {});
        resolve(Object.values(ordersMap));
      });
    });

    if (orders.length === 0) {
      return res.status(404).json({ Error: "No orders found" });
    }

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ Error: "Failed to fetch orders" });
  }
};

export { createOrder, getOrders };
