// src/models/Token.js
const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: String,
    type: {
      type: String,
      enum: ["refresh", "reset"],
    },
    expireAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Token", tokenSchema);