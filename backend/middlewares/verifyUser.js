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

      if (decoded.email && decoded.role) {
        // Check if the user's role is allowed
        const normalizedRole = decoded.role.toLowerCase();
        const normalizedAllowedRoles = allowedRoles.map((role) =>
          role.toLowerCase()
        );
        if (!normalizedAllowedRoles.includes(normalizedRole)) {
          return res.status(403).json({ Error: "Forbidden" });
        }

        // Attach email and role to the request object
        req.email = decoded.email;
        req.role = normalizedRole;

        next();
      } else {
        return res.status(403).json({ Error: "Invalid token payload" });
      }
    });
  };
}

export default verifyUser;
