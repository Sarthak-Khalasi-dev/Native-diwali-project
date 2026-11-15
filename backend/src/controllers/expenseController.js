const Expense = require('../models/Expense');

// @desc    Get all personal expenses for user with filters
// @route   GET /api/expenses
// @access  Private
exports.getExpenses = async (req, res, next) => {
  try {
    const { category, type, startDate, endDate, limit = 50 } = req.query;
    let query = { user: req.user.id };

    if (category) query.category = category;
    if (type) query.type = type;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const expenses = await Expense.find(query)
      .sort({ date: -1 })
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new personal expense or income
// @route   POST /api/expenses
// @access  Private
exports.createExpense = async (req, res, next) => {
  try {
    const { title, amount, type, category, date, paymentMethod, notes } = req.body;

    const expense = await Expense.create({
      user: req.user.id,
      title,
      amount,
      type: type || 'expense',
      category: category || 'Other',
      date: date || Date.now(),
      paymentMethod: paymentMethod || 'UPI / QR',
      notes: notes || ''
    });

    res.status(201).json({
      success: true,
      data: expense
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an expense
// @route   PUT /api/expenses/:id
// @access  Private
exports.updateExpense = async (req, res, next) => {
  try {
    let expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    if (expense.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this expense' });
    }

    expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: expense
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
exports.deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    if (expense.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this expense' });
    }

    await expense.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Expense removed successfully'
    });
  } catch (error) {
    next(error);
  }
};
