import db from "../configs/db.config.js";

const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }
    const addCategoryQuery =
      "INSERT INTO categories (name, created_at) VALUES (?, NOW())";
    db.query(addCategoryQuery, [name], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ error: "Inserting data error in categories table" });
      }
      return res.status(201).json({
        status: "Success",
        data: { category_id: result.insertId, name, created_at: new Date() },
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await new Promise((resolve, reject) => {
      db.query(
        "SELECT category_id, name, created_at FROM categories",
        (error, results) => {
          if (error) return reject(error);
          resolve(results);
        }
      );
    });
    if (categories.length === 0) {
      return res.status(404).json({ error: "No categories found" });
    }
    res.status(200).json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { category_id } = req.params;
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }
    const updateQuery = "UPDATE categories SET name = ? WHERE category_id = ?";
    db.query(updateQuery, [name, category_id], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ error: "Updating data error in categories table" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Category not found" });
      }
      return res.status(200).json({
        status: "Success",
        data: { category_id: parseInt(category_id), name },
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { category_id } = req.params;
    // Check if category is used by any products
    const checkQuery =
      "SELECT COUNT(*) as count FROM products WHERE category_id = ?";
    db.query(checkQuery, [category_id], (checkErr, checkResult) => {
      if (checkErr) {
        console.error("Database error:", checkErr);
        return res.status(500).json({ error: "Error checking category usage" });
      }
      if (checkResult[0].count > 0) {
        return res
          .status(400)
          .json({ error: "Cannot delete category used by products" });
      }

      const deleteQuery = "DELETE FROM categories WHERE category_id = ?";
      db.query(deleteQuery, [category_id], (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return res
            .status(500)
            .json({ error: "Deleting data error in categories table" });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Category not found" });
        }
        return res.status(200).json({ status: "Success" });
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export { addCategory, getCategories, updateCategory, deleteCategory };
