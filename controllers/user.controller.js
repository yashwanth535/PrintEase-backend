import { generateToken, verifyToken } from "../config/jwt.config.js";
import { Vendor, User } from "../models/User_Collection.js"
import mongoose from "mongoose";


const sendCookie = async (req, res) => {
  const email_token = generateToken("yashwanth.lumia535@gmail.com");
  const type_token = generateToken("user" );
  const user_id = generateToken(process.env.user_id);

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



const getFavourites = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate('favourites');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, vendors: user.favourites });
  } catch (error) {
    console.error('Error fetching favourites:', error);
    res.status(500).json({ success: false, message: 'Error fetching favourites', error: error.message });
  }
};

const addFavourite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { vendorId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(vendorId)) {
      return res.status(400).json({ success: false, message: 'Invalid vendorId' });
    }

    const vendorExists = await Vendor.exists({ _id: vendorId });
    if (!vendorExists) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    await User.findByIdAndUpdate(userId, { $addToSet: { favourites: vendorId } });
    const user = await User.findById(userId).populate('favourites');
    res.status(200).json({ success: true, message: 'Vendor added to favourites', vendors: user.favourites });
  } catch (error) {
    console.error('Error adding favourite:', error);
    res.status(500).json({ success: false, message: 'Error adding favourite', error: error.message });
  }
};

const removeFavourite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { vendorId } = req.params;

    await User.findByIdAndUpdate(userId, { $pull: { favourites: vendorId } });
    const user = await User.findById(userId).populate('favourites');
    res.status(200).json({ success: true, message: 'Vendor removed from favourites', vendors: user.favourites });
  } catch (error) {
    console.error('Error removing favourite:', error);
    res.status(500).json({ success: false, message: 'Error removing favourite', error: error.message });
  }
};

const getLogsNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user.id, 'logs notifications');
    if (!user) return res.status(404).json({ success:false, message:'User not found'});
    res.status(200).json({ success:true, logs:user.logs.reverse(), notifications:user.notifications.reverse() });
  } catch(err){
    console.error('Error fetching logs:', err);
    res.status(500).json({ success:false, message:'Error fetching logs', error:err.message});
  }
};

export { sendCookie, getFavourites, addFavourite, removeFavourite, getLogsNotifications };