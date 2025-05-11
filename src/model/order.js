const orderSchema = new mongoose.Schema(
    {
        address: { type: String, required: true },
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String },
        description: { type: String },
        note: { type: String },
        code: { type: String, required: true, unique: true },
        total: { type: Number, required: true },
        isPending: { type: Boolean, default: true },
        shipment: { type: String },
        payment: { type: String },
        shipDate: { type: Date },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        orderStatus: [
            { type: mongoose.Schema.Types.ObjectId, ref: "orderStatus" },
        ],
        vouchers: [{ type: mongoose.Schema.Types.ObjectId, ref: "voucher" }],
    },
    { timestamps: true }
);
