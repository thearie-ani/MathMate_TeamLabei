import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
    },

    password: {
      type: String,
      minlength: 6,
      select: false,
    },

    profile: {
        name: {
            type: String,
            default: " "
        },

        avatar: {
        type: String,
        default: "",
        },

        bio: {
        type: String,
        default: "",
        },

    },


    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },

    provider: {
      type: String,
      enum: ["local", "google", "facebook"],
      default: "local",
    },

    providerId: {
      type: String,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    refreshToken: {
      type: String,
    },

    resetPasswordToken: String,

    resetPasswordExpires: Date,

    verificationToken: String,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;