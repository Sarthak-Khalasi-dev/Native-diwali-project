const mongoose = require('mongoose');

const settlementSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
      index: true
    },
    payer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true // The person paying back
    },
    payee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true // The person receiving the payment
    },
    amount: {
      type: Number,
      required: [true, 'Please specify the settlement amount'],
      min: [0.01, 'Settlement amount must be greater than 0']
    },
    paymentMethod: {
      type: String,
      enum: ['UPI', 'Cash', 'Bank Transfer', 'Other'],
      default: 'UPI'
    },
    date: {
      type: Date,
      default: Date.now
    },
    notes: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Settlement', settlementSchema);
