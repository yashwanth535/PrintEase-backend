const {verifyToken} = require("../config/jwt.config");

const authMiddleware = (req, res, next) => {
  console.log("🔐 Inside Authentication Middleware");
  try {
    const userDataCookie = req.cookies.userData;
    if (!userDataCookie) {
      console.log("❌ Cookie not found");
      return res.status(401).json({ authenticated: false, message: "No authentication cookie found" });
    }

    const userData = JSON.parse(userDataCookie);
    const typeDecoded = verifyToken(userData.type);
    const emailDecoded = verifyToken(userData.email);
    const dbDecoded = verifyToken(userData.database);

    if (!typeDecoded || !emailDecoded || !dbDecoded) {
      console.log("❌ Invalid token");
      return res.status(401).json({ authenticated: false, message: "Invalid token" });
    }

    // Attach to request object
    req.user = {
      email: emailDecoded.userId,
      db: dbDecoded.userId,
      role: typeDecoded.userId, // assuming userId holds role
    };

    console.log("✅ Auth success for",emailDecoded.userId);
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(500).json({ authenticated: false, message: "Internal error" });
  }
};

module.exports = authMiddleware;
