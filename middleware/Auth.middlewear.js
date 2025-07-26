import { verifyToken } from "../config/jwt.config.js";

const authMiddleware = (req, res, next) => {
  console.log("🔐 Inside Authentication Middleware");
  try {
    const userDataCookie = req.cookies.userData;
    if (!userDataCookie) {
      console.log("❌ No userData cookie found");
      return res.status(401).json({ 
        success: false, 
        message: "No authentication cookie found" 
      });
    }

    const userData = JSON.parse(userDataCookie);
    const emailDecoded = verifyToken(userData.email);
    
    if (!emailDecoded) {
      console.log("❌ Invalid email token");
      return res.status(401).json({ 
        success: false, 
        message: "Invalid email token" 
      });
    }

    req.user = { email: emailDecoded.userId };
    console.log("✅ Authentication successful for:", emailDecoded.userId);
    next();
  } catch (error) {
    console.error("🔥 Authentication error:", error);
    return res.status(401).json({ 
      success: false, 
      message: "Authentication failed" 
    });
  }
};

export default authMiddleware;
