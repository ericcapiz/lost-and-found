const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      url: {
        type: String,
        default: "", // Optional
      },
      publicId: {
        type: String,
        default: "", // Optional
      },
    },
    coverPic: {
      url: {
        type: String,
        default: "", // Optional
      },
      publicId: {
        type: String,
        default: "", // Optional
      },
    },
    city: {
      type: String,
      required: false, // Optional
    },
    state: {
      type: String,
      required: false, // Optional
    },
    postCount: {
      type: Number,
      default: 0,
    },
    resolvedCount: {
      type: Number,
      default: 0,
    },
    unresolvedCount: {
      type: Number,
      default: 0,
    },
    lastViewedNotifications: {
      type: Date,
      default: Date.now,
    },
    notificationCount: {
      type: Number,
      default: 0,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
