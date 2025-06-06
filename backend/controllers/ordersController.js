import db from "../configs/db.config.js";

const createOrder = async (req, res) => {
  try {
    const { user_id, total_amount, delivery_address, order_items } = req.body;

    // Validate input
    if (
      !total_amount ||
      !delivery_address ||
      !order_items ||
      !Array.isArray(order_items)
    ) {
      return res
        .status(400)
        .json({ Error: "Missing required fields or invalid order items" });
    }

    // Start a transaction
    db.beginTransaction((err) => {
      if (err) {
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
          db.rollback(() => {
            return res
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
        db.query(orderItemsQuery, [orderItemsData], (itemsErr, itemsResult) => {
          if (itemsErr) {
            db.rollback(() => {
              return res
                .status(500)
                .json({ Error: "Inserting data error in order_items table" });
            });
          }

          // Commit transaction
          db.commit((commitErr) => {
            if (commitErr) {
              db.rollback(() => {
                return res
                  .status(500)
                  .json({ Error: "Failed to commit transaction" });
              });
            }

            // TODO: Implement email confirmation logic here
            // You can use Nodemailer or an email service like SendGrid
            // Example: sendOrderConfirmationEmail(user_email, orderId, order_items);

            return res.status(200).json({
              Status: "Success",
              order_id: orderId,
            });
          });
        });
      });
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ Error: "Server error" });
  }
};

const getOrders = async (req, res) => {
  try {
    const userId = req.user?.id; // Assuming you have middleware to extract user ID from token
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
        // Group order items by order
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
