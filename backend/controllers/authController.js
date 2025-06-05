import bcrypt from "bcrypt";
import express from "express";
import db from "../configs/db.config.js";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import verifyUser from "../middlewares/verifyUser.js";

const app = express();
app.use(cookieParser());
const saltRounds = 10;

const verifyAdmin = async (req, res) => {
  const checkSuperAdminQuery =
    "SELECT id FROM users WHERE role = 'admin' LIMIT 1";

  db.query(checkSuperAdminQuery, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ Error: "Database error" });
    }

    if (result.length > 0) {
      return res.json({ Error: "Admin is already registered." });
    }
    res.json({ message: "No admin registered yet." });
  });
};

const signup = async (req, res) => {
  const { first_name, last_name, phonenumber, email, password, role } =
    req.body;

  if (!first_name || !last_name || !phonenumber || !email || !password) {
    return res.status(400).json({ Error: "All fields are required" });

    const validRoles = ["admin", "customer", "delivery"];
    const userRole = validRoles.includes(role?.toLowerCase())
      ? role.toLowerCase()
      : "customer";

    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Check if email already exists
      const checkEmailQuery = "SELECT user_id FROM users WHERE email = ?";
      db.query(checkEmailQuery, [email], (err, emailResult) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ Error: "Database error" });
        }

        if (emailResult.length > 0) {
          return res.status(400).json({ Error: "Email already registered" });
        }

        // Insert new user
        const insertQuery = `
        INSERT INTO users (first_name, last_name, phonenumber, email, password, role) 
        VALUES (?, ?, ?, ?, ?, ?)`;

        db.query(
          insertQuery,
          [first_name, last_name, phonenumber, email, hashedPassword, userRole],
          (err, result) => {
            if (err) {
              console.error("Error creating user:", err);
              return res
                .status(500)
                .json({ Error: "Error creating user account" });
            }
            return res.status(201).json({
              message: `User registered successfully as ${userRole}!`,
              role: userRole,
            });
          }
        );
      });
    } catch (error) {
      console.error("Error during signup:", error);
      return res
        .status(500)
        .json({ Error: "Internal server error during signup" });
    }
  }
};
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ Error: "Email and password are required" });
  }

  try {
    const query = `SELECT user_id, first_name, last_name, email, password, role FROM users WHERE email = ?`;

    db.query(query, [email], async (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ Error: "Database error" });
      }

      if (results.length === 0) {
        return res.status(401).json({ Error: "Invalid email or password" });
      }

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ Error: "Invalid email or password" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.user_id, email: user.email, role: user.role },
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
          role: user.role,
          user: {
            id: user.user_id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            role: user.role,
          },
          token,
        });
    });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ Error: "Internal server error during login" });
  }
};

const verify = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ valid: false, Error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "jwt-secret-key"
    );
    return res.status(200).json({ valid: true, user: decoded });
  } catch (error) {
    return res.status(401).json({ valid: false, Error: "Invalid token" });
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
      .json({ Error: "Failed to log out. Please try again." });
  }
};

// Example protected routes
app.get("/api/admin/data", verifyUser("admin"), (req, res) => {
  res.json({ message: "Admin data access granted", role: req.role });
});

app.get("/api/delivery/data", verifyUser("delivery"), (req, res) => {
  res.json({ message: "Delivery data access granted", role: req.role });
});

export { verifyAdmin, signup, login, verify, logout };
