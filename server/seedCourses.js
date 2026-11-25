const dns = require("node:dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const mongoose = require("mongoose");
const Course = require("./models/Course");
const courses = [
  {
    title: "HTML Fundamentals",
    slug: "html-fundamentals",
    description:
      "Learn HTML elements, headings, links, images, forms, and semantic page structure.",
    category: "Web Development",
    level: "Beginner",
    duration: "4 hours",
    resources: [
      {
        title: "MDN HTML Guide",
        type: "documentation",
        url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content",
        description: "Learn how to structure web pages with HTML.",
      },
      {
        title: "HTML Practice",
        type: "practice",
        url: "https://www.w3schools.com/html/",
        description: "Study examples and practise HTML.",
      },
    ],
  },
  {
    title: "Python Programming Basics",
    slug: "python-programming-basics",
    description:
      "Start with variables, data types, conditions, loops, lists, functions, and problem solving.",
    category: "Programming",
    level: "Beginner",
    duration: "8 hours",
    resources: [
      {
        title: "Official Python Tutorial",
        type: "documentation",
        url: "https://docs.python.org/3/tutorial/",
        description: "Read the official Python language tutorial.",
      },
      {
        title: "Python Exercises",
        type: "practice",
        url: "https://www.w3schools.com/python/",
        description: "Learn Python with examples and exercises.",
      },
    ],
  },
  {
    title: "Data Structures and Algorithms",
    slug: "data-structures-algorithms",
    description:
      "Understand arrays, searching, sorting, linked lists, recursion, and algorithm complexity.",
    category: "Computer Science",
    level: "Beginner",
    duration: "12 hours",
    resources: [
      {
        title: "GeeksforGeeks DSA Tutorial",
        type: "article",
        url: "https://www.geeksforgeeks.org/dsa/dsa-tutorial-learn-data-structures-and-algorithms/",
        description: "Study common data structures and algorithms.",
      },
      {
        title: "VisuAlgo",
        type: "other",
        url: "https://visualgo.net/en",
        description: "Explore visual demonstrations of algorithms.",
      },
    ],
  },
];

async function seedCourses() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from server/.env");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB.");

    for (const course of courses) {
      await Course.updateOne(
        { slug: course.slug },
        { $setOnInsert: course },
        { upsert: true, runValidators: true }
      );
    }

    console.log("Sample courses added or already exist.");
  } catch (error) {
    console.error("Course seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedCourses();