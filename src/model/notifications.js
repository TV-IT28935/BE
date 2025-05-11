import mongoose from "mongoose";

const notificationsSchema = new mongoose.Schema(
    {
        content: {
            type: String,
        },
        order: { type: mongoose.Schema.Types.ObjectId, ref: "order" },
        type: {
            type: String,
        },
        read: {
            type: Boolean,
        },
        deliver: {
            type: Boolean,
        },
    },
    { timestamps: true }
);

const Notification = mongoose.model("notification", notificationsSchema);
export default Notification;
