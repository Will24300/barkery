import db from "../configs/db.config.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
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
                <img src="http://localhost:8082${
                  item.product_image_url
                }" alt="${
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
  }
};

const sendOrderStatusUpdateEmail = async (
  customerEmail,
  customerName,
  orderId,
  status
) => {
  const mailOptions = {
    from: `"Barkery" <${process.env.EMAIL_USER}>`,
    to: customerEmail,
    subject: `Order #${orderId} Status Update`,
    html: `
      <h2>Order Status Update</h2>
      <p>Dear ${customerName},</p>
      <p>The status of your order (ID: ${orderId}) has been updated to <strong>${status}</strong>.</p>
      <p>Thank you for shopping with Barkery!</p>
    `,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Status update email sent to ${customerEmail}`);
  } catch (error) {
    console.error("Error sending status update email:", error);
  }
};

const createOrder = async (req, res) => {
  try {
    const { user_id, total_amount, delivery_address, order_items } = req.body;
    if (
      !user_id ||
      !total_amount ||
      !delivery_address ||
      !order_items ||
      !Array.isArray(order_items)
    ) {
      return res
        .status(400)
        .json({ error: "Missing required fields or invalid order items" });
    }

    // Validate order items
    const orderItemErrors = [];
    order_items.forEach((item, index) => {
      const missingFields = [];
      if (!item.product_id) missingFields.push("product_id");
      if (!item.quantity) missingFields.push("quantity");
      if (
        item.price_at_purchase === undefined ||
        item.price_at_purchase === null
      )
        missingFields.push("price_at_purchase");
      if (!item.product_image_url) missingFields.push("product_image_url");
      if (!item.product_name) missingFields.push("product_name");

      if (missingFields.length > 0) {
        orderItemErrors.push(
          `Item ${index + 1} is missing required fields: ${missingFields.join(
            ", "
          )}`
        );
      } else if (isNaN(parseFloat(item.price_at_purchase))) {
        orderItemErrors.push(
          `Item ${index + 1}: price_at_purchase must be a valid number`
        );
      } else if (typeof item.quantity !== "number" || item.quantity < 1) {
        orderItemErrors.push(
          `Item ${index + 1}: quantity must be a positive number`
        );
      }
    });

    if (orderItemErrors.length > 0) {
      console.log("Order validation errors:", orderItemErrors);
      return res.status(400).json({
        error: "Invalid order item data",
        details: orderItemErrors,
        receivedData: {
          user_id,
          total_amount,
          delivery_address,
          order_items: order_items.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price_at_purchase: item.price_at_purchase,
            product_image_url: item.product_image_url ? "present" : "missing",
            product_name: item.product_name ? "present" : "missing",
          })),
        },
      });
    }

    // Verify user exists and fetch email, name
    const userQuery = `SELECT email, CONCAT(first_name, ' ', last_name) AS customer_name FROM users WHERE user_id = ?`;
    const user = await new Promise((resolve, reject) => {
      db.query(userQuery, [user_id], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
    if (!user) {
      return res.status(400).json({ error: "Invalid user_id" });
    }
    const { email: customer_email, customer_name } = user;
    // Verify products exist
    const productIds = order_items.map((item) => item.product_id);
    const productCheckQuery = `SELECT product_id, name FROM products WHERE product_id IN (?)`;
    const products = await new Promise((resolve, reject) => {
      db.query(productCheckQuery, [productIds], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    const existingProductIds = products.map((p) => p.product_id);
    const invalidProductIds = productIds.filter(
      (id) => !existingProductIds.includes(id)
    );
    if (invalidProductIds.length > 0) {
      return res.status(400).json({
        error: `Invalid product IDs: ${invalidProductIds.join(", ")}`,
      });
    }
    // Map product names for email
    const productNameMap = products.reduce((acc, p) => {
      acc[p.product_id] = p.name;
      return acc;
    }, {});
    const enrichedOrderItems = order_items.map((item) => ({
      ...item,
      product_name: productNameMap[item.product_id],
    }));
    db.beginTransaction((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to start transaction" });
      }
      const createOrderQuery = `
        INSERT INTO orders (user_id, total_amount, status, delivery_address, created_at)
        VALUES (?, ?, 'pending', ?, NOW())
      `;
      const orderData = [user_id, total_amount, delivery_address];
      db.query(createOrderQuery, orderData, (orderErr, orderResult) => {
        if (orderErr) {
          console.error("Order insertion error:", orderErr);
          return db.rollback(() => {
            res
              .status(500)
              .json({ error: "Inserting data error in orders table" });
          });
        }
        const orderId = orderResult.insertId;
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
        db.query(orderItemsQuery, [orderItemsData], async (itemsErr) => {
          if (itemsErr) {
            console.error("Order items insertion error:", itemsErr);
            return db.rollback(() => {
              res
                .status(500)
                .json({ error: "Inserting data error in order_items table" });
            });
          }
          await sendOrderConfirmationEmail(
            customer_email,
            customer_name,
            orderId,
            enrichedOrderItems,
            total_amount,
            delivery_address
          );
          db.commit((commitErr) => {
            if (commitErr) {
              return db.rollback(() => {
                res.status(500).json({ error: "Failed to commit transaction" });
              });
            }
            res.status(201).json({
              status: "Success",
              data: { order_id: orderId },
            });
          });
        });
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getOrders = async (req, res) => {
  try {
    const userId = req.user_id; // Extracted from token
    const query = `
      SELECT 
        o.order_id,
        o.user_id,
        o.total_amount,
        o.status,
        o.delivery_address,
        o.created_at,
        u.email AS customer_email,
        CONCAT(u.first_name, ' ', u.last_name) AS customer_name,
        oi.product_id,
        oi.quantity,
        oi.price_at_purchase,
        oi.product_image_url,
        p.name AS product_name
      FROM orders o
      JOIN users u ON o.user_id = u.user_id
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.product_id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `;
    const orders = await new Promise((resolve, reject) => {
      db.query(query, [userId], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    const formattedOrders = orders.reduce((acc, row) => {
      const order = acc.find((o) => o.order_id === row.order_id);
      const orderItem = {
        product_id: row.product_id,
        quantity: row.quantity,
        price_at_purchase: row.price_at_purchase,
        product_image_url: row.product_image_url,
        product_name: row.product_name,
      };
      if (order) {
        order.order_items.push(orderItem);
      } else {
        acc.push({
          order_id: row.order_id,
          user_id: row.user_id,
          total_amount: row.total_amount,
          status: row.status,
          delivery_address: row.delivery_address,
          created_at: row.created_at,
          customer_email: row.customer_email,
          customer_name: row.customer_name,
          order_items: row.product_id ? [orderItem] : [],
        });
      }
      return acc;
    }, []);
    if (formattedOrders.length === 0) {
      return res.status(404).json({ error: "No orders found" });
    }
    res.status(200).json({ orders: formattedOrders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const query = `
      SELECT 
        o.order_id,
        o.user_id,
        o.total_amount,
        o.status,
        o.delivery_address,
        o.created_at,
        u.email AS customer_email,
        CONCAT(u.first_name, ' ', u.last_name) AS customer_name,
        oi.product_id,
        oi.quantity,
        oi.price_at_purchase,
        oi.product_image_url,
        p.name AS product_name
      FROM orders o
      JOIN users u ON o.user_id = u.user_id
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.product_id
      ORDER BY o.created_at DESC
    `;
    const orders = await new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    const formattedOrders = orders.reduce((acc, row) => {
      const order = acc.find((o) => o.order_id === row.order_id);
      const orderItem = {
        product_id: row.product_id,
        quantity: row.quantity,
        price_at_purchase: row.price_at_purchase,
        product_image_url: row.product_image_url,
        product_name: row.product_name,
      };
      if (order) {
        order.order_items.push(orderItem);
      } else {
        acc.push({
          order_id: row.order_id,
          user_id: row.user_id,
          total_amount: row.total_amount,
          status: row.status,
          delivery_address: row.delivery_address,
          created_at: row.created_at,
          customer_email: row.customer_email,
          customer_name: row.customer_name,
          order_items: row.product_id ? [orderItem] : [],
        });
      }
      return acc;
    }, []);
    if (formattedOrders.length === 0) {
      return res.status(200).json({ orders: [] });
    }
    res.status(200).json({ orders: formattedOrders });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { order_id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }
    const validStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }
    const getOrderQuery = `
      SELECT u.email AS customer_email, CONCAT(u.first_name, ' ', u.last_name) AS customer_name
      FROM orders o
      JOIN users u ON o.user_id = u.user_id
      WHERE o.order_id = ?
    `;
    const order = await new Promise((resolve, reject) => {
      db.query(getOrderQuery, [order_id], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    const updateQuery = `
      UPDATE orders 
      SET status = ?
      WHERE order_id = ?
    `;
    db.query(updateQuery, [status, order_id], async (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ error: "Updating data error in orders table" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Order not found" });
      }
      await sendOrderStatusUpdateEmail(
        order.customer_email,
        order.customer_name,
        order_id,
        status
      );
      return res.status(200).json({
        status: "Success",
        data: { order_id: parseInt(order_id), status },
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { order_id } = req.params;
    db.beginTransaction((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to start transaction" });
      }
      const deleteItemsQuery = `DELETE FROM order_items WHERE order_id = ?`;
      db.query(deleteItemsQuery, [order_id], (itemsErr) => {
        if (itemsErr) {
          return db.rollback(() => {
            res
              .status(500)
              .json({ error: "Deleting data error in order_items table" });
          });
        }
        const deleteOrderQuery = `DELETE FROM orders WHERE order_id = ?`;
        db.query(deleteOrderQuery, [order_id], (orderErr, result) => {
          if (orderErr) {
            return db.rollback(() => {
              res
                .status(500)
                .json({ error: "Deleting data error in orders table" });
            });
          }
          if (result.affectedRows === 0) {
            return db.rollback(() => {
              res.status(404).json({ error: "Order not found" });
            });
          }
          db.commit((commitErr) => {
            if (commitErr) {
              return db.rollback(() => {
                res.status(500).json({ error: "Failed to commit transaction" });
              });
            }
            res.status(200).json({ status: "Success" });
          });
        });
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export { createOrder, getOrders, getAllOrders, updateOrder, deleteOrder };
