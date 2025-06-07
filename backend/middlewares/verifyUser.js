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
        // Check if the user's role is allowed
        const normalizedRole = decoded.role.toString().toLowerCase();
        const normalizedAllowedRoles = allowedRoles.map((role) =>
          role.toString().toLowerCase()
        );

        if (!normalizedAllowedRoles.includes(normalizedRole)) {
          return res.status(403).json({
            Error: "Forbidden",
            details: `Role '${decoded.role}' is not authorized for this resource`,
          });
        }

        // Attach user info to the request object
        req.email = decoded.email;
        req.role = normalizedRole;
        req.user = { email: decoded.email, role: normalizedRole };

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
