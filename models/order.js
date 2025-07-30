import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  fileUrl: { type: String, required: true },            // Link to file (PDF etc.)
  totalPrice: { type: Number, required: true },         // Final price
  pages: { type: Number, required: true },              // Page count
  color: { type: Boolean, default: false },             // Color or B/W
  sets: { type: Number, required: true },               // Number of sets
  size: { type: String, enum: ['A4', 'A5', 'A6'] },      // Size of paper
  binding: { type: String, enum: ['none', 'soft', 'hard'], default: 'none' },
  notes: { type: String, default: "" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },

  status: {
    type: String,
    enum: ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },

  // Payment fields
  paymentOrderId: { type: String },
  paymentSessionId: { type: String },
  cfOrderId: { type: String },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'failed', 'cancelled'],
    default: 'pending'
  },
  paidAt: { type: Date },

  createdAt: { type: Date, default: Date.now }
});


const Order = mongoose.models.Order || mongoose.model('Order', orderSchema, 'orders');

export {Order};
