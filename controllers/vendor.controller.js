const { Vendor } = require("../models/User_Collection");
const { verifyToken } = require("../config/jwt");

const updateProfile = async (req, res) => {
  try {
    console.log("⏳ [updateProfile] Request received");

    const userDataCookie = req.cookies.userData;
    if (!userDataCookie) {
      console.log("❌ [updateProfile] Cookie not found");
      return res.status(401).json({ success: false, message: "No auth token" });
    }

    const userData = JSON.parse(userDataCookie);
    console.log("✅ [updateProfile] Parsed cookie:", userData);

    const decodedToken = verifyToken(userData.email);
    console.log("✅ [updateProfile] Decoded token:", decodedToken);

    const email = decodedToken?.userId;
    if (!email) {
      console.log("❌ [updateProfile] Invalid token: userId not found");
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const existingVendor = await Vendor.findOne({ email });
    if (!existingVendor) {
      console.log("❌ [updateProfile] Vendor not found for email:", email);
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    console.log("✅ [updateProfile] Vendor found:", existingVendor.email);

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
    const userDataCookie = req.cookies.userData;
    if (!userDataCookie) {
      console.log("cookie not found");
      return res.status(401).json({ success: false, message: "No auth token" });
    }
    const userData = JSON.parse(userDataCookie);
    const email = verifyToken(userData.email).userId;
    if (!email) return res.status(401).json({ success: false, message: "Invalid token" });
    const vendor = await Vendor.findOne({ email });
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });
    res.json({ success: true, vendor });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { updateProfile, getProfile };