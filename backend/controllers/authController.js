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
  const { first_name, last_name, phonenumber, email, password, isAdmin } = req.body;

  if (!first_name || !last_name || !phonenumber || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    if (isAdmin) {
      // Check if admin already exists
      const checkAdminQuery = "SELECT id FROM admin WHERE email = ?";
      db.query(checkAdminQuery, [email], async (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Database error" });
        }
        
        if (result.length > 0) {
          return res.status(400).json({ error: "Admin with this email already exists" });
        }

        // Create new admin
        const query = "INSERT INTO admin (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)";
        db.query(query, [first_name, last_name, email, hashedPassword, roles.ADMIN], (err) => {
          if (err) {
            console.error("Error creating admin:", err);
            return res.status(500).json({ error: "Error creating admin account" });
          }
          return res.status(201).json({ message: "Admin registered successfully!" });
        });
      });
    } else {
      // Create regular user
      const query = "INSERT INTO resto (first_name, last_name, phonenumber, email, password, role) VALUES (?, ?, ?, ?, ?, ?)";
      db.query(query, [first_name, last_name, phonenumber, email, hashedPassword, roles.USER], (err) => {
        if (err) {
          console.error("Error creating user:", err);
          return res.status(500).json({ error: "Error creating user account" });
        }
        return res.status(201).json({ message: "User registered successfully!" });
      });
    }
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({ error: "Internal server error during signup" });
  }
};

const login = async (req, res) => {
  const { email, password, isAdmin } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Determine which table to query based on isAdmin flag
    const table = isAdmin ? 'admin' : 'resto';
    const role = isAdmin ? roles.ADMIN : roles.USER;
    
    const query = `SELECT id, password FROM ${table} WHERE email = ?`;
    
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
        process.env.JWT_SECRET || 'jwt-secret-key',
        { expiresIn: '1d' }
      );

      return res
        .cookie("token", token, { 
          httpOnly: true, 
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        })
        .status(200)
        .json({
          message: "Successfully logged in!",
          role,
          user: {
            id: user.id,
            email,
            firstName: user.first_name,
            lastName: user.last_name,
            role
          }
        });
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error during login" });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token", { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ error: "Failed to log out. Please try again." });
  }
};

export { verifyAdmin, signup, login, logout };
