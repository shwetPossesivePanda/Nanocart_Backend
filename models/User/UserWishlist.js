const mongoose = require("mongoose");

const WishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "userId is required"],
      unique: true, // Ensure one wishlist per user
    },
    items: [
      {
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Item",
          required: [true, "itemId is required"],
        },
        color: {
          type: String,
          required: [true, "color is required"],
          trim: true,
        },
      },
    ],
  },
  {
    timestamps: true, 
  }
);

// Index for efficient querying of wishlist items
WishlistSchema.index({ "items.itemId": 1, "items.color": 1 });

const UserWishlist = mongoose.model("UserWishlist", WishlistSchema);

module.exports = UserWishlist;