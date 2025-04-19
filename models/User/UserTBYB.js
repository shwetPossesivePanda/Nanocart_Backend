const mongoose = require("mongoose");

const TBYBSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  images: [
    {
      image: {
        type: String,
        required: true,
      },
      TBYBImage: {
        type: String,
        required: true,
      },
      uploadedAt: {
        type: Date,
        default: Date.now,  // Stores the time when the image was uploaded
      },
    },
  ],
});

module.exports = mongoose.model("TBYB", TBYBSchema);
