import { generateToken, verifyToken } from "../config/jwt.config.js";
import {Vendor} from "../models/User_Collection.js"
import mongoose from "mongoose";


const sendCookie = async (req, res) => {
  const email_token = generateToken("yashwanth.lumia535@gmail.com");
  const type_token = generateToken("user" );
  const user_id = generateToken("688875c11653a45ef3ded5c0");

  const userData = {
    email: email_token,
    type: type_token,
    user_id: user_id
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