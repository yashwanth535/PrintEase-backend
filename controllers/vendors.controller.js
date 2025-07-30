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
      _id: 0
    });
    
    const currentVendor = await Vendor.findOne({ email }, {
      shopName: 1,
      location: 1,
      _id: 0
    });
  
    if (!currentVendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }
  
    res.json({
      vendors,
      currentVendor
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

export { getLocations, getVendors, getVendorById };


