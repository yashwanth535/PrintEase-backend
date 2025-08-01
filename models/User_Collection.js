import mongoose from 'mongoose';
const vendorSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  pass: { type: String, required: true },

  shopName: { type: String },
  location: {
    address: { type: String },
    pincode: { type: String },
    lat: { type: Number }, 
    lng: { type: Number }
  },

  contactNumber: { type: String },

  prices: {
    color: {
      A4: { type: Number },
      A5: { type: Number },
      A6: { type: Number }
    },
    black_white: {
      A4: { type: Number },
      A5: { type: Number },
      A6: { type: Number }
    },
    binding: {
      soft: { type: Number },
      hard: { type: Number }
    }
  },

  services: {
    colorPrinting: { type: Boolean, default: true },
    blackWhitePrinting: { type: Boolean, default: true },
    binding: { type: Boolean, default: true }
  },

  openHours: {
    open: { type: String },
    close: { type: String }
  },

  isVerified: { type: Boolean, default: false },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],

  createdAt: { type: Date, default: Date.now }
});


// CUSTOMER SCHEMA
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  pass: { type: String, required: true },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]
});

// ✅ Use existing model if already compiled
const Vendor = mongoose.models.Vendor || mongoose.model('Vendor', vendorSchema, 'vendors');
const User = mongoose.models.User || mongoose.model('User', userSchema, 'users');

export { Vendor, User };
