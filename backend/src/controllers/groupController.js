const Group = require('../models/Group');
const GroupExpense = require('../models/GroupExpense');
const Settlement = require('../models/Settlement');
const User = require('../models/User');

// @desc    Create a new group
// @route   POST /api/groups
// @access  Private
exports.createGroup = async (req, res, next) => {
  try {
    const { name, description, category, memberEmails = [] } = req.body;

    // Find member IDs from emails
    const memberUsers = await User.find({ email: { $in: memberEmails.map(e => e.toLowerCase()) } });
    const members = [{ user: req.user.id, joinedAt: new Date() }];

    memberUsers.forEach(u => {
      if (u._id.toString() !== req.user.id) {
        members.push({ user: u._id, joinedAt: new Date() });
      }
    });

    const group = await Group.create({
      name,
      description,
      category: category || 'Flatmates / Home',
      createdBy: req.user.id,
      members
    });

    res.status(201).json({
      success: true,
      data: group
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's groups
// @route   GET /api/groups
// @access  Private
exports.getGroups = async (req, res, next) => {
  try {
    const groups = await Group.find({ 'members.user': req.user.id })
      .populate('members.user', 'name email')
      .populate('createdBy', 'name email')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: groups.length,
      data: groups
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single group details with expenses and calculated balances
// @route   GET /api/groups/:id
// @access  Private
exports.getGroupById = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('members.user', 'name email avatar')
      .populate('createdBy', 'name email');

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    const expenses = await GroupExpense.find({ group: group._id })
      .populate('paidBy', 'name email')
      .populate('splits.user', 'name email')
      .sort({ date: -1 });

    const settlements = await Settlement.find({ group: group._id })
      .populate('payer', 'name email')
      .populate('payee', 'name email')
      .sort({ date: -1 });

    // Calculate balances between members: net balance = paid - owed
    const balances = {};
    group.members.forEach(m => {
      balances[m.user._id.toString()] = {
        user: m.user,
        netBalance: 0
      };
    });

    expenses.forEach(exp => {
      const payerId = exp.paidBy._id.toString();
      if (balances[payerId]) {
        balances[payerId].netBalance += exp.amount;
      }
      exp.splits.forEach(split => {
        const debtorId = split.user._id.toString();
        if (balances[debtorId]) {
          balances[debtorId].netBalance -= split.owedAmount;
        }
      });
    });

    // Adjust for settlements
    settlements.forEach(settle => {
      const payerId = settle.payer._id.toString();
      const payeeId = settle.payee._id.toString();
      if (balances[payerId]) balances[payerId].netBalance += settle.amount;
      if (balances[payeeId]) balances[payeeId].netBalance -= settle.amount;
    });

    res.status(200).json({
      success: true,
      data: {
        group,
        expenses,
        settlements,
        balances: Object.values(balances)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add expense to group
// @route   POST /api/groups/:id/expenses
// @access  Private
exports.addGroupExpense = async (req, res, next) => {
  try {
    const { title, amount, category, splitType = 'equal', customSplits } = req.body;
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    let splits = [];
    if (splitType === 'equal') {
      const splitAmount = parseFloat((amount / group.members.length).toFixed(2));
      splits = group.members.map(m => ({
        user: m.user,
        owedAmount: splitAmount
      }));
    } else if (customSplits && Array.isArray(customSplits)) {
      splits = customSplits;
    }

    const expense = await GroupExpense.create({
      group: group._id,
      title,
      amount,
      paidBy: req.user.id,
      category: category || 'General',
      splits
    });

    res.status(201).json({
      success: true,
      data: expense
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Record a debt settlement between two members
// @route   POST /api/groups/:id/settle
// @access  Private
exports.settleDebt = async (req, res, next) => {
  try {
    const { payeeId, amount, paymentMethod, notes } = req.body;

    const settlement = await Settlement.create({
      group: req.params.id,
      payer: req.user.id,
      payee: payeeId,
      amount,
      paymentMethod: paymentMethod || 'UPI',
      notes: notes || 'Settled via SplitFlow'
    });

    res.status(201).json({
      success: true,
      data: settlement
    });
  } catch (error) {
    next(error);
  }
};
