import { Vendor } from "../models/User_Collection.js";
import { generateToken, verifyToken } from "../config/jwt.config.js";
import { Order } from '../models/order.js';

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

const getVendorDashboardStats = async (req, res) => {
  try {
    const vendorId = req.user.id;

    const orders = await Order.find({ vendorId });

    const totalOrders = orders.length;
    const completedOrders = orders.filter(order => order.status === 'completed').length;
    const pendingOrders = orders.filter(order => order.status !== 'completed' && order.status !== 'cancelled').length;

    const totalEarnings = orders.reduce((sum, order) => sum + order.totalPrice, 0);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyEarnings = orders.reduce((sum, order) => {
      const orderDate = new Date(order.createdAt);
      if (orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear) {
        return sum + order.totalPrice;
      }
      return sum;
    }, 0);

    const averageOrderValue = totalOrders > 0 ? (totalEarnings / totalOrders).toFixed(2) : 0;

    // For popular services, a more complex aggregation would be needed. For now, returning an empty array.
    const popularServices = []; 

    const recentOrders = orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5) // Get the 5 most recent orders
      .map(order => ({
        id: order._id,
        service: order.color ? (order.color + ' printing') : 'B/W printing', // Placeholder for service type
        status: order.status,
        amount: order.totalPrice,
      }));

    res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        completedOrders,
        pendingOrders,
        totalEarnings,
        monthlyEarnings,
        averageOrderValue,
        popularServices,
        recentOrders,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching vendor dashboard stats:", error);
    res.status(500).json({ success: false, message: "Error fetching dashboard stats", error: error.message });
  }
};

export { updateProfile, getProfile, sendCookie, getVendorDashboardStats };