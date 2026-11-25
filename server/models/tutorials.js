
const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    codeExample: {
      type: String,
      default: "",
    },
    order: {
      type: Number,
      required: true,
      min: 1,
    },
    duration: {
      type: Number,
      default: 5,
      min: 1,
    },
  },
  { _id: true }
);

const tutorialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    published: {
      type: Boolean,
      default: false,
    },
    lessons: {
      type: [lessonSchema],
      default: [],
    },
  },
  { timestamps: true }
);

tutorialSchema.index({ category: 1, published: 1 });

module.exports = mongoose.model("Tutorial", tutorialSchema);
