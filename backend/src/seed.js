const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Expense = require('./models/Expense');
const Group = require('./models/Group');
const GroupExpense = require('./models/GroupExpense');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/splitflow');
    console.log('[Seed] Connected to MongoDB');

    // Clean existing data
    await User.deleteMany();
    await Expense.deleteMany();
    await Group.deleteMany();
    await GroupExpense.deleteMany();

    // Create Demo Users
    const user1 = await User.create({
      name: 'Sarthak Khalasi',
      email: 'sarthak@splitflow.com',
      password: 'password123',
      monthlyBudget: 25000,
      currency: '₹'
    });

    const user2 = await User.create({
      name: 'Aman Sharma',
      email: 'aman@splitflow.com',
      password: 'password123',
      monthlyBudget: 20000,
      currency: '₹'
    });

    const user3 = await User.create({
      name: 'Rohan Patel',
      email: 'rohan@splitflow.com',
      password: 'password123',
      monthlyBudget: 22000,
      currency: '₹'
    });

    console.log('[Seed] Users created');

    // Create Sample Expenses for User 1
    await Expense.create([
      {
        user: user1._id,
        title: 'Monthly Salary Credit',
        amount: 45000,
        type: 'income',
        category: 'Salary',
        paymentMethod: 'Net Banking'
      },
      {
        user: user1._id,
        title: 'Apartment Rent Share',
        amount: 8500,
        type: 'expense',
        category: 'Housing & Rent',
        paymentMethod: 'UPI / QR'
      },
      {
        user: user1._id,
        title: 'Supermarket Grocery Run',
        amount: 2350,
        type: 'expense',
        category: 'Groceries',
        paymentMethod: 'UPI / QR'
      },
      {
        user: user1._id,
        title: 'Weekend Dinner with Friends',
        amount: 1450,
        type: 'expense',
        category: 'Food & Dining',
        paymentMethod: 'Credit / Debit Card'
      },
      {
        user: user1._id,
        title: 'Electricity & Wi-Fi Bill',
        amount: 1200,
        type: 'expense',
        category: 'Bills & Utilities',
        paymentMethod: 'UPI / QR'
      }
    ]);

    console.log('[Seed] Sample expenses created');

    // Create Sample Group
    const group = await Group.create({
      name: 'Flat 402 Roommates',
      description: 'Shared household groceries, bills, and maid expenses',
      category: 'Flatmates / Home',
      createdBy: user1._id,
      members: [
        { user: user1._id },
        { user: user2._id },
        { user: user3._id }
      ]
    });

    // Create Sample Group Expense
    await GroupExpense.create({
      group: group._id,
      title: 'Groceries & Water Cans',
      amount: 1500,
      paidBy: user1._id,
      category: 'Groceries',
      splits: [
        { user: user1._id, owedAmount: 500 },
        { user: user2._id, owedAmount: 500 },
        { user: user3._id, owedAmount: 500 }
      ]
    });

    console.log('[Seed] Sample group and expenses created successfully');
    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error]`, error);
    process.exit(1);
  }
};

seedData();
