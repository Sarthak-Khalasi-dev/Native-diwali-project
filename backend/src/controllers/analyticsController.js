const Expense = require('../models/Expense');
const User = require('../models/User');

// @desc    Get dashboard analytics, category breakdown & budget status
// @route   GET /api/analytics/dashboard
// @access  Private
exports.getDashboardStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    // Current month expenses
    const monthlyItems = await Expense.find({
      user: req.user.id,
      date: { $gte: startOfMonth, $lte: endOfMonth }
    });

    let totalExpense = 0;
    let totalIncome = 0;
    const categoryTotals = {};

    monthlyItems.forEach(item => {
      if (item.type === 'expense') {
        totalExpense += item.amount;
        categoryTotals[item.category] = (categoryTotals[item.category] || 0) + item.amount;
      } else if (item.type === 'income') {
        totalIncome += item.amount;
      }
    });

    const categoryBreakdown = Object.keys(categoryTotals).map(cat => ({
      category: cat,
      amount: categoryTotals[cat],
      percentage: totalExpense > 0 ? Math.round((categoryTotals[cat] / totalExpense) * 100) : 0
    }));

    // Budget utilization
    const budget = user.monthlyBudget || 20000;
    const budgetUsedPercentage = budget > 0 ? Math.round((totalExpense / budget) * 100) : 0;
    const remainingBudget = Math.max(0, budget - totalExpense);

    let budgetStatus = 'safe'; // 'safe', 'warning', 'exceeded'
    if (budgetUsedPercentage >= 100) {
      budgetStatus = 'exceeded';
    } else if (budgetUsedPercentage >= 80) {
      budgetStatus = 'warning';
    }

    // Recent 5 transactions
    const recentTransactions = await Expense.find({ user: req.user.id })
      .sort({ date: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalIncome,
          totalExpense,
          netBalance: totalIncome - totalExpense,
          monthlyBudget: budget,
          remainingBudget,
          budgetUsedPercentage,
          budgetStatus,
          currency: user.currency || '₹'
        },
        categoryBreakdown,
        recentTransactions
      }
    });
  } catch (error) {
    next(error);
  }
};
