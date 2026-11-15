const express = require('express');
const router = express.Router();
const {
  createGroup,
  getGroups,
  getGroupById,
  addGroupExpense,
  settleDebt
} = require('../controllers/groupController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getGroups)
  .post(createGroup);

router.route('/:id')
  .get(getGroupById);

router.route('/:id/expenses')
  .post(addGroupExpense);

router.route('/:id/settle')
  .post(settleDebt);

module.exports = router;
