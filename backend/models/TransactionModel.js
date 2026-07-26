const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        transaction_id: {
            type: String,
           
        },
        merchantTransaction_id: {
            type: String,

        },
        amount: {
            type: Number,
           
        },
        paymentStatus: {
            type: String,        
        },
        paymentState: {
            type: String,     
        },
        paymentMethod: {
            type: String, 
        },
        paymentFor: {
             type: String,
        },
        batch_id: {
            type: String,
        },
        slotsBooked: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Slot",
        
            },
          ],
          slotsBook: {
            type: [String], // Change to accept an array of strings (dates)
            required: true
          },
        date: { type: Date },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema)
// module.exports = mongoose.model("UserDetailsAtPayment", userDetailsAtPaymentSchema);