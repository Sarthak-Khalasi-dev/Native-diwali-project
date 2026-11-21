const mongoose = require('mongoose');

const groupExpenseSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Please enter a description for the expense'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    amount: {
      type: Number,
      required: [true, 'Please enter an amount'],
      min: [0.01, 'Amount must be greater than 0']
    },
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    category: {
      type: String,
      enum: ['Food & Drinks', 'Dining Out', 'Rent & Bills', 'Rent & Utilities', 'Groceries', 'Travel', 'Travel / Fuel', 'Entertainment', 'Shopping', 'General'],
      default: 'General'
    },
    date: {
      type: Date,
      default: Date.now
    },
    // The split list indicates how much each member owes for this bill
    splits: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        owedAmount: {
          type: Number,
          required: true
        },
        isSettled: {
          type: Boolean,
          default: false
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('GroupExpense', groupExpenseSchema);
