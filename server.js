const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Blog = require("./models/Blog");

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 MongoDB Atlas connection
mongoose
  .connect("mongodb://127.0.0.1:27017/blogdb")
  .then(() => console.log("MongoDB connected (local)"))
  .catch(err => console.error(err));

// =======================
// CREATE blog
// POST /blogs
// =======================
app.post("/blogs", async (req, res) => {
  try {
    const { title, body, author } = req.body;

    if (!title || !body) {
      return res.status(400).json({ message: "Title and body are required" });
    }

    const blog = new Blog({ title, body, author });
    const savedBlog = await blog.save();

    res.status(201).json(savedBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// =======================
// READ all blogs
// GET /blogs
// =======================
app.get("/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// =======================
// READ blog by ID
// GET /blogs/:id
// =======================
app.get("/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(blog);
  } catch (error) {
    res.status(400).json({ message: "Invalid ID" });
  }
});

// =======================
// UPDATE blog
// PUT /blogs/:id
// =======================
app.put("/blogs/:id", async (req, res) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(updatedBlog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// =======================
// DELETE blog
// DELETE /blogs/:id
// =======================
app.delete("/blogs/:id", async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);

    if (!deletedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Invalid ID" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});