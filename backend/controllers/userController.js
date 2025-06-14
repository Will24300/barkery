import db from "../configs/db.config.js";

const getUserData = async (req, res) => {
  try {
    const email = req.email; // Extracted from token
    const query = `SELECT user_id, first_name, last_name, email, phonenumber, role FROM users WHERE email = ?`;
    db.query(query, [email], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ error: "Database error while fetching user" });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json({ user: results[0] });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const query = `SELECT user_id, first_name, last_name, email, phonenumber, role FROM users`;
    const users = await new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    if (users.length === 0) {
      return res.status(404).json({ error: "No users found" });
    }
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { first_name, last_name, email, phonenumber, role } = req.body;
    if (!first_name || !last_name || !email || !phonenumber || !role) {
      return res
        .status(400)
        .json({
          error:
            "First name, last name, email, phonenumber, and role are required",
        });
    }
    const validRoles = ["customer", "delivery", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role value" });
    }
    const updateQuery = `
      UPDATE users 
      SET first_name = ?, last_name = ?, email = ?, phonenumber = ?, role = ?
      WHERE user_id = ?
    `;
    db.query(
      updateQuery,
      [first_name, last_name, email, phonenumber, role, user_id],
      (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return res
            .status(500)
            .json({ error: "Updating data error in users table" });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json({
          status: "Success",
          data: {
            user_id: parseInt(user_id),
            first_name,
            last_name,
            email,
            phonenumber,
            role,
          },
        });
      }
    );
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const checkRoleQuery = `SELECT role FROM users WHERE user_id = ?`;
    db.query(checkRoleQuery, [user_id], (checkErr, checkResult) => {
      if (checkErr) {
        console.error("Database error:", checkErr);
        return res.status(500).json({ error: "Error checking user role" });
      }
      if (checkResult.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      if (checkResult[0].role === "admin") {
        return res.status(403).json({ error: "Cannot delete admin user" });
      }
      const deleteQuery = `DELETE FROM users WHERE user_id = ?`;
      db.query(deleteQuery, [user_id], (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return res
            .status(500)
            .json({ error: "Deleting data error in users table" });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json({ status: "Success" });
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export { getUserData, getAllUsers, updateUser, deleteUser };
