import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

function verifyUser(...allowedRoles) {
  console.log("Verifying user...");
  return (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ Error: "You are not authenticated" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error("JWT verification error:", err.message);
        return res.status(403).json({ Error: "Token is not valid" });
      }

      // Check if decoded token has required fields
      if (!decoded || !decoded.email || !decoded.role) {
        console.error("Invalid token payload:", { decoded });
        return res.status(403).json({
          Error: "Invalid token: Missing required fields",
          details: "Token must contain email and role",
        });
      }

      try {
        const userRole = decoded.role.toString().toLowerCase();

        // If no roles are specified, allow access
        if (!allowedRoles || allowedRoles.length === 0) {
          req.email = decoded.email;
          req.role = userRole;
          req.user = { email: decoded.email, role: userRole };
          return next();
        }

        // Normalize roles for comparison
        const normalizedAllowedRoles = allowedRoles
          .filter((role) => role) // Filter out any undefined/null roles
          .map((role) => role.toString().toLowerCase());

        // Check if the user's role is in the allowed roles
        if (!normalizedAllowedRoles.includes(userRole)) {
          return res.status(403).json({
            Error: "Forbidden",
            details: `Role '${decoded.role}' is not authorized for this resource`,
          });
        }

        // Attach user info to the request object
        req.email = decoded.email;
        req.role = userRole;
        req.user = { email: decoded.email, role: userRole };

        next();
      } catch (error) {
        console.error("Error processing token:", error);
        return res.status(500).json({
          Error: "Internal server error during authentication",
        });
      }
    });
  };
}

export default verifyUser;
