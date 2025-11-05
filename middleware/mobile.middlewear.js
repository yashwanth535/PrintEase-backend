import { verifyToken } from "../config/jwt.config.js";

const mobileMiddleware = (req, res, next) => {
  console.log("📱 Inside Mobile Authentication Middleware");

  try {
    // 1️⃣ Get the token from Authorization header
    const userData = req.body; // get the JSON object
    if (!userData) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }
    // console.log(userData);
    // 2️⃣ Extract token
    const emailDecoded = verifyToken(userData.email);
    const typeDecoded = verifyToken(userData.type);
    const user_idDecoded = verifyToken(userData.user_id);

    if (!emailDecoded) {
      console.log("❌ Invalid token");
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // 4️⃣ Attach decoded user info to req
    req.user = { 
      email: emailDecoded.userId,
      type : typeDecoded.userId,
      id:user_idDecoded.userId
    };

    console.log("✅ Mobile Authentication successful for:", emailDecoded.userId);
    next();
  } catch (error) {
    console.error("🔥 Authentication error:", error);
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

export default mobileMiddleware;
