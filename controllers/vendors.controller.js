// GET /vendors/locations
import { Vendor } from "../models/User_Collection.js";
import { generateToken, verifyToken } from "../config/jwt.config.js";
import mongoose from 'mongoose';

const getLocations = async (req, res) => {
  try {
    console.log("received cookies", Object.keys(req.cookies));
    const userDataCookie = req.cookies.userData;
    if (!userDataCookie) {
      return res.status(401).json({ success: false, message: "No auth token" });
    }

    const userData = JSON.parse(userDataCookie);
    const decodedToken = verifyToken(userData.email);

    const email = decodedToken?.userId;
    if (!email) {
      console.log("❌ [updateProfile] Invalid token: userId not found");
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const vendors = await Vendor.find({}, {
      shopName: 1,
      location: 1,
      _id: 1
    });
    
    const currentVendor = await Vendor.findOne({ email }, {
      shopName: 1,
      location: 1,
      _id: 1
    });
  
    if (!currentVendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }
  
    res.json({
  vendors: vendors.map(v => ({
    vendorId: v._id.toString(), // ✅ Send as vendorId
    shopName: v.shopName,
    location: v.location
  })),
  currentVendor: currentVendor ? {
    vendorId: currentVendor._id.toString(),
    shopName: currentVendor.shopName,
    location: currentVendor.location
  } : null
});
  
  } catch (err) {
    console.error("❌ Error fetching vendor locations:", err);
    res.status(500).json({ error: "Error fetching vendor locations" });
  }
}

const getVendors = async (req, res) => {
  try {
        const vendors = await Vendor.find();
        res.json({
          success: true,
          vendors: vendors,
          total: vendors.length
        });
      } catch (err) {
    console.error("❌ Error fetching vendors:", err);
    res.status(500).json({ success: false, error: "Error fetching vendors" });
  }
}

const getVendorById = async (req, res) => {
  console.log("inside the getVendor controller");
  try {
    const { id } = req.params;
    console.log(id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid vendor ID format");
      return res.status(400).json({ message: "Invalid vendor ID format" });
    }

    const vendor = await Vendor.findById(id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    console.log("vendor id data sent");
    res.status(200).json({ success:true,vendor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Haversine formula to calculate distance between two lat/lng points
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance; // Distance in kilometers
};

const getNearestVendors = async (req, res) => {
  try {
    const { userLat, userLng } = req.body;

    if (!userLat || !userLng) {
      return res.status(400).json({ success: false, message: "User latitude and longitude are required." });
    }

    const vendors = await Vendor.find({});

    const vendorsWithDistance = vendors.map(vendor => {
      if (vendor.location && vendor.location.lat && vendor.location.lng) {
        const distance = calculateDistance(
          userLat,
          userLng,
          vendor.location.lat,
          vendor.location.lng
        );
        return { ...vendor.toObject(), distance };
      } else {
        return { ...vendor.toObject(), distance: Infinity }; // Vendors without location will be at the end
      }
    });

    vendorsWithDistance.sort((a, b) => a.distance - b.distance);

    res.status(200).json({ success: true, vendors: vendorsWithDistance });
  } catch (error) {
    console.error("❌ Error fetching nearest vendors:", error);
    res.status(500).json({ success: false, message: "Error fetching nearest vendors", error: error.message });
  }
};

export { getLocations, getVendors, getVendorById, getNearestVendors };


