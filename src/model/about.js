import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, maxLength: 50 },
    content: { type: String },
    imageUrl: { type: String },
    deletedAt: { type: Date },
  },
  { timestamps: true } // Tự động tạo createdAt và updatedAt
);

const About = mongoose.model("about", aboutSchema);

export default About;
