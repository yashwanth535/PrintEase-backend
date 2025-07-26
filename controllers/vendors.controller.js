// GET /vendors/locations
import { Vendor } from "../models/User_Collection.js";
import { generateToken, verifyToken } from "../config/jwt.config.js";

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
    const { 
      service, 
      userLat, 
      userLng, 
      maxDistance = 50 // Default 50km radius
    } = req.query;

    let query = { isVerified: true }; // Only show verified vendors

    // Filter by service if provided
    if (service) {
      query[`services.${service}`] = true;
    }

    const vendors = await Vendor.find(query, {
      shopName: 1,
      location: 1,
      prices: 1,
      services: 1,
      openHours: 1,
      contactNumber: 1,
      email: 1,
      _id: 1
    });

    // Calculate distances and sort if user location is provided
    let vendorsWithDistance = vendors;
    if (userLat && userLng) {
      vendorsWithDistance = vendors.map(vendor => {
        if (vendor.location && vendor.location.lat && vendor.location.lng) {
          const distance = calculateDistance(
            parseFloat(userLat), 
            parseFloat(userLng), 
            vendor.location.lat, 
            vendor.location.lng
          );
          return {
            ...vendor.toObject(),
            distance: distance
          };
        }
        return {
          ...vendor.toObject(),
          distance: null
        };
      });

      // Sort by distance (ascending)
      vendorsWithDistance.sort((a, b) => {
        if (a.distance === null && b.distance === null) return 0;
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });

      // Filter by max distance
      vendorsWithDistance = vendorsWithDistance.filter(vendor => 
        vendor.distance === null || vendor.distance <= maxDistance
      );
    }

    res.json({
      success: true,
      vendors: vendorsWithDistance,
      total: vendorsWithDistance.length
    });
  } catch (err) {
    console.error("❌ Error fetching vendors:", err);
    res.status(500).json({ success: false, error: "Error fetching vendors" });
  }
}

// Helper function to calculate distance between two points using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  return distance;
}

const getVendorById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const vendor = await Vendor.findById(id, {
      shopName: 1,
      location: 1,
      prices: 1,
      services: 1,
      openHours: 1,
      contactNumber: 1,
      email: 1,
      _id: 1
    });

    if (!vendor) {
      return res.status(404).json({ 
        success: false, 
        message: "Vendor not found" 
      });
    }

    res.json({
      success: true,
      vendor: vendor
    });
  } catch (err) {
    console.error("❌ Error fetching vendor:", err);
    res.status(500).json({ success: false, error: "Error fetching vendor" });
  }
};

export { getLocations, getVendors, getVendorById };


