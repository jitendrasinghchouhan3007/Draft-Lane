import mongoose from "mongoose";
import Blog from "../backend/models/blog.js";

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
}

export default async function handler(req, res) {
  await connectDB();

  // 👉 GET all blogs
  if (req.method === "GET") {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    return res.status(200).json(blogs);
  }

  // 👉 CREATE blog
  if (req.method === "POST") {
    try {
      const blog = await Blog.create(req.body);
      return res.status(201).json(blog);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}