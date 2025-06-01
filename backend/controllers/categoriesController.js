import db from "../configs/db.config.js";

const addCategory = async (req, res) => {
  try {
    const addCategoryQuery =
      "INSERT INTO categories (name) VALUES (?)";


    const Data = [
   req.body.name
    ];

    db.query(addCategoryQuery, [Data], (err, result) => {
      if (err)
        return res.json({ Error: "Inserting data error in items table" });
      return res.json({ Status: "Success" });
    });
  } catch (error) {
    res.status(500).json({ Error: "Server error" });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await new Promise((resolve, reject) => {
      db.query("SELECT * FROM categories", (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });

    if (categories.length === 0) {
      return res.status(404).json({ error: "No categories found." });
    }

    res.status(200).json({ categories });
    // getItems.data.items;
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Failed to fetch courses." });
  }
};

export { addCategory, getCategories };
