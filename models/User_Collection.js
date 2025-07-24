const mongoose = require('mongoose');

// VENDOR SCHEMA
const vendorSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  pass: { type: String, required: true },
  collection_name: { type: String, required: true },

  shopName: { type: String },
  location: {
    address: { type: String },
    pincode: { type: String },
    lat: { type: Number },
    lng: { type: Number }
  },

  contactNumber: { type: String },

  prices: {
    A4: {
      color: { type: Number },
      black_white: { type: Number }
    },
    A3: {
      color: { type: Number },
      black_white: { type: Number }
    },
    A5: {
      color: { type: Number },
      black_white: { type: Number }
    },
    A6: {
      color: { type: Number },
      black_white: { type: Number }
    },
    water_color_print: { type: Number },
    photo_print: {
      passport: { type: Number },
      "4x6": { type: Number },
      "5x7": { type: Number },
      "8x10": { type: Number }
    },
    spiral_binding: {
      up_to_50_pages: { type: Number },
      up_to_100_pages: { type: Number },
      up_to_200_pages: { type: Number },
      above_200_pages: { type: Number }
    },
    lamination: {
      A4: { type: Number },
      A3: { type: Number },
      ID_card: { type: Number }
    },
    scanning: {
      per_page: { type: Number }
    },
    xerox: {
      black_white: { type: Number },
      color: { type: Number }
    },
    certificate_printing: {
      basic: { type: Number },
      premium: { type: Number }
    },
    visiting_cards: {
      basic: { type: Number },
      premium: { type: Number }
    },
    book_binding: {
      soft_cover: { type: Number },
      hard_cover: { type: Number }
    }
  },

  services: {
    colorPrinting: { type: Boolean, default: true },
    blackWhitePrinting: { type: Boolean, default: true },
    photoPrinting: { type: Boolean, default: false },
    spiralBinding: { type: Boolean, default: false },
    lamination: { type: Boolean, default: false },
    scanning: { type: Boolean, default: false },
    xerox: { type: Boolean, default: true },
    certificatePrinting: { type: Boolean, default: false },
    visitingCardPrinting: { type: Boolean, default: false },
    bookBinding: { type: Boolean, default: false },
  },

  openHours: {
    open: { type: String },
    close: { type: String }
  },

  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// CUSTOMER SCHEMA
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  pass: { type: String, required: true }
});

// ✅ Use existing model if already compiled
const Vendor = mongoose.models.Vendor || mongoose.model('Vendor', vendorSchema, 'vendors');
const User = mongoose.models.User || mongoose.model('User', userSchema, 'users');

module.exports = { Vendor, User };
