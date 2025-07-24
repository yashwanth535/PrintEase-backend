// GET /vendors/locations
const {Vendor} = require("../models/User_Collection");
const { generateToken,verifyToken } = require("../config/jwt.config");

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

module.exports = {
  getLocations
};

