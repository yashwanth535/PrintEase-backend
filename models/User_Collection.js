
const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  pass: { type: String, required: true }
});

// Create the User model
const Vendor = mongoose.model('Vendor', vendorSchema, 'vendors');

const customerSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  pass: { type: String, required: true }
});

// Create the User model
const Customer = mongoose.model('Customer', customerSchema , 'customers');

// Export the User model
module.exports = { Vendor, Customer };
