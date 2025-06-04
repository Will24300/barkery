import bcrypt from "bcrypt";
import express from "express";
import db from "../configs/db.config.js";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
// import nodemailer from "nodemailer";
// import crypto from "crypto";
import roles from "../middlewares/roles.js";

const app = express();
app.use(cookieParser());
const saltRounds = 10; // Used for bcrypt hashing

const verifyAdmin = async (req, res) => {
  const checkSuperAdminQuery = "SELECT id FROM admin LIMIT 1";

  db.query(checkSuperAdminQuery, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.length > 0) {
      return res.json({ error: "Superadmin is already registered." });
    }
    res.json({ message: "No superadmin registered yet." });
  });
};

const signup = async (req, res) => {
  const { first_name, last_name, phonenumber, email, password } = req.body;

  if (!first_name || !last_name || !phonenumber || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // First, check if any user exists
    const checkUsersQuery = "SELECT COUNT(*) as count FROM users";

    db.query(checkUsersQuery, async (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      const isFirstUser = result[0].count === 0;
      const role = isFirstUser ? "admin" : "customer";
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Check if email already exists
      const checkEmailQuery = "SELECT user_id FROM users WHERE email = ?";
      db.query(checkEmailQuery, [email], (err, emailResult) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Database error" });
        }

        if (emailResult.length > 0) {
          return res.status(400).json({ error: "Email already registered" });
        }

        // Insert new user
        const insertQuery = `
          INSERT INTO users (first_name, last_name, phonenumber, email, password, role) 
          VALUES (?, ?, ?, ?, ?, ?)`;

        db.query(
          insertQuery,
          [first_name, last_name, phonenumber, email, hashedPassword, role],
          (err, result) => {
            if (err) {
              console.error("Error creating user:", err);
              return res
                .status(500)
                .json({ error: "Error creating user account" });
            }
            return res.status(201).json({
              message: `User registered successfully as ${role}!`,
              role: role,
            });
          }
        );
      });
    });
  } catch (error) {
    console.error("Error during signup:", error);
    return res
      .status(500)
      .json({ error: "Internal server error during signup" });
  }
};

const login = async (req, res) => {
  const { email, password, isAdmin } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Determine which table to query based on isAdmin flag
    const table = isAdmin ? "admin" : "users";
    const role = isAdmin ? roles.ADMIN : roles.USER;

    const query = `SELECT user_id, password FROM ${table} WHERE email = ?`;

    db.query(query, [email], async (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length === 0) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { email, role, id: user.id },
        process.env.JWT_SECRET || "jwt-secret-key",
        { expiresIn: "1d" }
      );

      return res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        })
        .status(200)
        .json({
          message: "Successfully logged in!",
          role,
          user: {
            id: user.user_id,
            email,
            firstName: user.first_name,
            lastName: user.last_name,
            role,
          },
          token,
        });
    });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ error: "Internal server error during login" });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    return res
      .status(500)
      .json({ error: "Failed to log out. Please try again." });
  }
};

export { verifyAdmin, signup, login, logout };
