const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Please provide an expense title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    amount: {
      type: Number,
      required: [true, 'Please provide an amount'],
      min: [0.01, 'Amount must be greater than 0']
    },
    type: {
      type: String,
      enum: ['expense', 'income'],
      default: 'expense'
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: [
        'Food & Dining',
        'Groceries',
        'Transportation',
        'Housing & Rent',
        'Bills & Utilities',
        'Entertainment',
        'Shopping',
        'Healthcare',
        'Education',
        'Salary',
        'Investments',
        'Freelance / Side Gig',
        'Other'
      ],
      default: 'Other'
    },
    date: {
      type: Date,
      default: Date.now,
      index: true
    },
    paymentMethod: {
      type: String,
      enum: ['UPI / QR', 'Cash', 'Credit / Debit Card', 'Net Banking', 'Other'],
      default: 'UPI / QR'
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [300, 'Notes cannot exceed 300 characters'],
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Expense', expenseSchema);
