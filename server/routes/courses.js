const express = require("express");
const mongoose = require("mongoose");

const Course = require("../models/Course");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Check whether the logged-in user is an admin.
async function adminOnly(req, res, next) {
  try {
    const user = await User.findById(req.userId).select("role");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Please sign in again.",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can manage courses.",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
}

// GET /api/courses
// Get all published courses.
router.get("/", async (req, res, next) => {
  try {
    const courses = await Course.find({ published: true })
      .select("-__v")
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/courses/:slug
// Get one published course and its resources.
router.get("/:slug", async (req, res, next) => {
  try {
    const course = await Course.findOne({
      slug: req.params.slug.toLowerCase(),
      published: true,
    }).select("-__v");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    res.json({
      success: true,
      course,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/courses
// Admin only: create a course.
router.post("/", authMiddleware, adminOnly, async (req, res, next) => {
  try {
    const {
      title,
      slug,
      description,
      category,
      level,
      duration,
      thumbnail,
      resources,
      published,
    } = req.body;

    if (
      !title?.trim() ||
      !slug?.trim() ||
      !description?.trim() ||
      !category?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Title, slug, description, and category are required.",
      });
    }

    const course = await Course.create({
      title,
      slug: slug.toLowerCase().trim(),
      description,
      category,
      level,
      duration,
      thumbnail,
      resources,
      published,
      createdBy: req.userId,
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully.",
      course,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A course with this slug already exists.",
      });
    }

    next(error);
  }
});

// PUT /api/courses/:id
// Admin only: update a course.
router.put("/:id", authMiddleware, adminOnly, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID.",
      });
    }

    const allowedFields = [
      "title",
      "slug",
      "description",
      "category",
      "level",
      "duration",
      "thumbnail",
      "resources",
      "published",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] =
          field === "slug" && typeof req.body[field] === "string"
            ? req.body[field].toLowerCase().trim()
            : req.body[field];
      }
    }

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    res.json({
      success: true,
      message: "Course updated successfully.",
      course,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "That course slug is already in use.",
      });
    }

    next(error);
  }
});

// DELETE /api/courses/:id
// Admin only: delete a course.
router.delete("/:id", authMiddleware, adminOnly, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID.",
      });
    }

    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    res.json({
      success: true,
      message: "Course deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
});

// Handle unexpected route errors.
router.use((error, req, res, next) => {
  console.error("Courses API error:", error.message);

  if (res.headersSent) {
    return next(error);
  }

  res.status(500).json({
    success: false,
    message: "A server error occurred while processing courses.",
  });
});

module.exports = router;