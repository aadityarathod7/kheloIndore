const mongoose = require('mongoose');
const CoachSlotSchema = mongoose.Schema({
  coachId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Coach",
    required: true,
  },
  start_date: { type: Date, default:null },
  end_date: { type: Date, default:null },
  slots: [
    {
      start_time: { type: String, required: true },
      end_time: { type: String, required: true },
      price: { type: Number, required: true },
      isBooked: { type: Boolean, default: false },
    },
  ],
  status: {
    type: Boolean,
    default: false,
  },
  package_type:String,
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
},
updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
},
created_at: {
    type: Date,
    default: Date.now
},
updated_at: {
    type: Date,
    default: null
}
});

module.exports = mongoose.model('CoachSlot',CoachSlotSchema);
 