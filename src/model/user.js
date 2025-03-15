import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minLength: 5,
      maxLength: 50,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
      maxLength: 60,
    },
    username: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
    },
    avatar: {
      type: String,
      default: "",
      maxLength: 255,
    },
    phone: {
      type: String,
      required: true,
      minLength: 10,
      maxLength: 10,
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "role",
    },
    positionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "position",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "banned"],
      default: "active",
    },
    isOnline: {
      type: Boolean,
      default: false,
    },

    introduce: {
      type: String,
      default: "",
    },
    verifyOtp: {
      type: String,
      default: "",
    },
    verifyOtpExpireAt: {
      type: Number,
      default: 0,
    },
    resetOtp: {
      type: String,
      default: "",
    },
    resetOtpExpireAt: {
      type: Number,
      default: 0,
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     return next();
//   }
//   const salt = bcrypt.genSaltSync(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// userSchema.methods.isPasswordMatched = async function (enterPassword) {
//   return await bcrypt.compare(enterPassword, this.password);
// };

// userSchema.methods.createPasswordResetToken = async function () {
//   const resetToken = crypto.randomBytes(32).toString("hex");
//   this.passwordResetToken = crypto
//     .createHash("sha256")
//     .update(resetToken)
//     .digest("hex");
//   this.passwordResetExpires = Date.now() + 30 * 60 * 1000;
//   return resetToken;
// };

const User = mongoose.model("user", userSchema);

export default User;
