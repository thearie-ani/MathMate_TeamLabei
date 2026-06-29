import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
      index: true, // ✅ keep only ONE index definition
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // never return password
    },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },

    bio: {
      type: String,
      default: "",
      maxlength: 300,
    },

    avatar: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastSeen: {
      type: Date,
      default: Date.now,
    },

    learningStreak: {
      current: { type: Number, default: 0 },
      longest: { type: Number, default: 0 },
      lastActiveDate: { type: Date, default: null },
    },

    passwordResetToken: {
      type: String,
      select: false,
    },

    passwordResetExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// index

userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ lastSeen: -1 });

// dayStreak for user

userSchema.methods.updateStreak = function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const last = this.learningStreak.lastActiveDate
    ? new Date(this.learningStreak.lastActiveDate)
    : null;

  if (last) {
    last.setHours(0, 0, 0, 0);

    const diffDays = (today - last) / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      this.learningStreak.current += 1;
    } else if (diffDays > 1) {
      this.learningStreak.current = 1;
    }
  } else {
    this.learningStreak.current = 1;
  }

  if (this.learningStreak.current > this.learningStreak.longest) {
    this.learningStreak.longest = this.learningStreak.current;
  }

  this.learningStreak.lastActiveDate = today;
};


import crypto from 'crypto';

userSchema.methods.createPasswordResetToken = function () {

  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 15 * 60 * 1000;

  return resetToken;
};



userSchema.virtual("avatarUrl").get(function () {
  return (
    this.avatar?.url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      this.username
    )}&background=6366f1&color=fff`
  );
});

// default user


const User = mongoose.model("User", userSchema);
export default User;