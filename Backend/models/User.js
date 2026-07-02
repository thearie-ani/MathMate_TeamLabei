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
      require: [true, "Gmail is required!"],
      unique: true,
      sparse: true,
      lowercase: true,
    },

    password: {
      type: String,
      minlength: 6,
      require: [true, "Password is required"]
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


    resetPasswordToken: String,

    resetPasswordExpires: Date,

  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;