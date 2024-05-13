// 1. Define the Rejection Schema
const mongoose = require("mongoose");

const rejectionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
  rejectedUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming your user model is named 'User'
    },
  ],
});

// 2. Create the Rejection Model
const Rejection = mongoose.model("Rejection", rejectionSchema);

export default Rejection;
