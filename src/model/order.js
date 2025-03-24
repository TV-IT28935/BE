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
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    orderStatusList: [
      { type: mongoose.Schema.Types.ObjectId, ref: "orderStatus" },
    ],
    voucherList: [{ type: mongoose.Schema.Types.ObjectId, ref: "voucher" }],
    shipment: { type: String },
    payment: { type: String },
    shipDate: { type: Date },
  },
  { timestamps: true }
);
