import { Vendor } from "../models/User_Collection.js";
import { generateToken, verifyToken } from "../config/jwt.config.js";

const updateProfile = async (req, res) => {
  try {
    console.log("⏳ [updateProfile] Request received");
    const email = req.user.email;

    const existingVendor = await Vendor.findOne({ email });

    // Deep merge function
    const deepMerge = (target, source) => {
      for (let key in source) {
        if (
          source[key] &&
          typeof source[key] === "object" &&
          !Array.isArray(source[key])
        ) {
          target[key] = deepMerge(target[key] || {}, source[key]);
        } else {
          target[key] = source[key];
        }
      }
      return target;
    };

    // Build update object
    const update = {};
    if (req.body.shopName !== undefined) update.shopName = req.body.shopName;
    if (req.body.collection_name !== undefined) update.collection_name = req.body.collection_name;
    if (req.body.contactNumber !== undefined) update.contactNumber = req.body.contactNumber;
    if (req.body.isVerified !== undefined) update.isVerified = req.body.isVerified;
    if (req.body.paymentOptions !== undefined) update.paymentOptions = req.body.paymentOptions;
    if (req.body.openHours !== undefined) update.openHours = req.body.openHours;
    if (req.body.prices !== undefined) update.prices = req.body.prices;
    if (req.body.services !== undefined) update.services = req.body.services;
    if (req.body.location !== undefined) update.location = req.body.location;

    console.log("🛠 [updateProfile] Incoming update data:", update);

    // Merge
    const mergedData = deepMerge(existingVendor.toObject(), update);
    console.log("🔧 [updateProfile] Merged data to be saved:", mergedData);

    const updatedVendor = await Vendor.findOneAndUpdate(
      { email },
      mergedData,
      { new: true }
    );

    console.log("✅ [updateProfile] Vendor updated:", updatedVendor);

    res.json({ success: true, vendor: updatedVendor });
  } catch (err) {
    console.error("🔥 [updateProfile] Server error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



const getProfile = async (req, res) => {
  try {
    const email = req.user.email;
    if (!email) return res.status(401).json({ success: false, message: "Invalid token" });
    const vendor = await Vendor.findOne({ email });
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });
    res.json({ success: true, vendor });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const sendCookie = async (req, res) => {
  const email_token = generateToken("yashwanth.lumia535@gmail.com");
  const type_token = generateToken("vendor" );
  const user_id = generateToken(process.env.vendor_id);

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


export { updateProfile, getProfile, sendCookie };