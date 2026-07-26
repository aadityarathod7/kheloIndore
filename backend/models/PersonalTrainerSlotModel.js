const mongoose  = require('mongoose');

const PTSchema = mongoose.Schema({
  trainerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PersonalTrainer",
    require: true,
  },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  slots: [
    {
      start_time: { type: String, required: true },
      end_time: { type: String, required: true },
      price: { type: Number, required: true },
      isBooked: { type: Boolean, default: false },
    },
  ],
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
},
updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
},
status: {
  type: Boolean,
  default: false,
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

module.exports = mongoose.model('PersonalTrainerSlot',PTSchema)