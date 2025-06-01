import db from "../configs/db.config.js";

const addProducts = async (req, res) => {
  try {
    // First insert the product
    const addProductQuery = `
      INSERT INTO products (name, description, category_id, total_price) 
      VALUES (?, ?, ?, ?)
    `;

    const productData = [
      req.body.name,
      req.body.description,
      req.body.category_id,
      req.body.total_price,
    ];

    db.query(addProductQuery, productData, (err, productResult) => {
      if (err) {
        return res.json({ Error: "Inserting data error in products table" });
      }

      // Then insert the image if provided
      if (req.file) {
        const imagePath = `/uploads/${req.file.filename}`;
        const productId = productResult.insertId;

        const addImageQuery = `
          INSERT INTO images (product_id, url) 
          VALUES (?, ?)
        `;

        db.query(addImageQuery, [productId, imagePath], (imageErr) => {
          if (imageErr) {
            return res.json({ Error: "Inserting image error in images table" });
          }
          return res.json({
            Status: "Success",
            productId: productId,
          });
        });
      } else {
        return res.json({
          Status: "Success (no image uploaded)",
          productId: productResult.insertId,
        });
      }
    });
  } catch (error) {
    res.status(500).json({ Error: "Server error" });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await new Promise((resolve, reject) => {
      const query = `
        SELECT 
          p.product_id, 
          p.name, 
          p.description, 
          p.total_price, 
          p.created_at,
          c.name AS category_name,
          i.url AS image_url
        FROM products p
        JOIN categories c ON p.category_id = c.category_id
        LEFT JOIN images i ON p.product_id = i.product_id
        GROUP BY p.product_id
      `;

      db.query(query, (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });

    if (products.length === 0) {
      return res.status(404).json({ error: "No products found." });
    }

    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products." });
  }
};

export { addProducts, getProducts };
