import { generateToken, verifyToken } from "../config/jwt.config.js";

const sendCookie = async (req, res) => {
  const email = "yashwanth.lumia535@gmail.com";
  const emailBase = email.replace(/[@.]/g, '_');
  const collectionName = `${emailBase}_user`;

  const email_token = generateToken(email);
  const collection_token = generateToken(collectionName);
  const userData = {
    email: email_token,
    database: collection_token,
    type: generateToken("user"),
  };

  res.cookie("userData", JSON.stringify(userData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
  });

  res.sendStatus(200); // ✅ send only status, no body
};

export { sendCookie };