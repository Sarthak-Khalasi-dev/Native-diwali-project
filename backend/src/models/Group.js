const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Group name is required'],
      trim: true,
      maxlength: [60, 'Group name cannot exceed 60 characters']
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    category: {
      type: String,
      enum: ['Trip', 'Trip & Vacation', 'Flatmates / Home', 'Couple', 'Couple / Friends', 'Event / Party', 'Work', 'Office', 'Project / College', 'Other'],
      default: 'Flatmates / Home'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        joinedAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Group', groupSchema);
