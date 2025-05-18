import mongoose from "mongoose";

const userDetailSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minLength: 5,
            maxLength: 50,
        },
        username: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 50,
        },
        avatar: {
            type: String,
        },
        fullName: {
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
        gender: {
            type: String,
            default: "",
            maxLength: 255,
        },
        address: {
            type: String,
            default: "",
            maxLength: 255,
        },
        birthday: {
            type: String,
            default: "",
            maxLength: 255,
        },

        userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    },
    {
        timestamps: true,
    }
);

const UserDetail = mongoose.model("userDetail", userDetailSchema);

export default UserDetail;
