import db from "../configs/db.config.js";

const addProduct = async (req, res) => {
  try {
    const { name, description, category_id, total_price } = req.body;
    if (!name || !category_id || !total_price) {
      return res
        .status(400)
        .json({ error: "Name, category, and price are required" });
    }
    const addProductQuery = `
      INSERT INTO products (name, description, category_id, total_price) 
      VALUES (?, ?, ?, ?)
    `;
    const productData = [name, description, category_id, total_price];
    db.query(addProductQuery, productData, (err, productResult) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ error: "Inserting data error in products table" });
      }
      const productId = productResult.insertId;
      if (req.file) {
        const imagePath = `/Uploads/${req.file.filename}`;
        const addImageQuery = `
          INSERT INTO images (product_id, url) 
          VALUES (?, ?)
        `;
        db.query(addImageQuery, [productId, imagePath], (imageErr) => {
          if (imageErr) {
            console.error("Database error:", imageErr);
            return res
              .status(500)
              .json({ error: "Inserting image error in images table" });
          }
          return res.status(201).json({
            status: "Success",
            data: {
              product_id: productId,
              name,
              description,
              category_id,
              total_price,
              image_url: imagePath,
            },
          });
        });
      } else {
        return res.status(201).json({
          status: "Success",
          data: {
            product_id: productId,
            name,
            description,
            category_id,
            total_price,
          },
        });
      }
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error" });
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
          c.category_id,
          i.url AS image_url
        FROM products p
        JOIN categories c ON p.category_id = c.category_id
        LEFT JOIN images i ON p.product_id = i.product_id
        GROUP BY p.product_id
      `;
      db.query(query, (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
    if (products.length === 0) {
      return res.status(404).json({ error: "No products found" });
    }
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { product_id } = req.params;
    const { name, description, category_id, total_price } = req.body;
    if (!name || !category_id || !total_price) {
      return res
        .status(400)
        .json({ error: "Name, category, and price are required" });
    }
    const updateProductQuery = `
      UPDATE products 
      SET name = ?, description = ?, category_id = ?, total_price = ?
      WHERE product_id = ?
    `;
    db.query(
      updateProductQuery,
      [name, description, category_id, total_price, product_id],
      (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return res
            .status(500)
            .json({ error: "Updating data error in products table" });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Product not found" });
        }
        if (req.file) {
          const imagePath = `/Uploads/${req.file.filename}`;
          const updateImageQuery = `
          INSERT INTO images (product_id, url) VALUES (?, ?)
          ON DUPLICATE KEY UPDATE url = ?
        `;
          db.query(
            updateImageQuery,
            [product_id, imagePath, imagePath],
            (imageErr) => {
              if (imageErr) {
                console.error("Database error:", imageErr);
                return res
                  .status(500)
                  .json({ error: "Updating image error in images table" });
              }
              return res.status(200).json({
                status: "Success",
                data: {
                  product_id: parseInt(product_id),
                  name,
                  description,
                  category_id,
                  total_price,
                  image_url: imagePath,
                },
              });
            }
          );
        } else {
          return res.status(200).json({
            status: "Success",
            data: {
              product_id: parseInt(product_id),
              name,
              description,
              category_id,
              total_price,
            },
          });
        }
      }
    );
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { product_id } = req.params;
    const deleteQuery = "DELETE FROM products WHERE product_id = ?";
    db.query(deleteQuery, [product_id], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ error: "Deleting data error in products table" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Product not found" });
      }
      return res.status(200).json({ status: "Success" });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export { addProduct, getProducts, updateProduct, deleteProduct };
