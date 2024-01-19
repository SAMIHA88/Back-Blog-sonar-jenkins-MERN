import mongoose from "mongoose";
import Blog from "../model/Blog";
import User from "../model/User";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Set your desired upload directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

//likes
export const toggleLike = async (req, res, next) => {
  const blogId = req.params.id;
  const userId = req.body.userId;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  let blog;
  try {
    blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }

    const index = blog.likes.findIndex((id) => id.toString() === userId.toString());

    if (index === -1) {
      // Like the blog
      blog.likes.push(userId);
    } else {
      // Unlike the blog
      blog.likes.splice(index, 1);
    }

    await blog.save();

  } catch (err) {
    return res.status(500).json({ message: err.message || "Internal Server Error" });
  }

  return res.status(200).json({ blog });
};

//

export const getAllBlogs = async (req, res, next) => {
  let blogs;
  try {
    blogs = await Blog.find().populate("user");
  } catch (err) {
    return res.status(500).json({ message: err.message || "Internal Server Error" });
  }
  if (!blogs) {
    return res.status(404).json({ message: "No Blogs Found" });
  }
  
  return res.status(200).json({ blogs });
};

export const addBlog = async (req, res, next) => {
  const { title, description, user } = req.body;
  const images = req.files.map(file => file.path); // Array of image paths

  try {
    // Find the existing user by ID
    const existingUser = await User.findById(user);
    if (!existingUser) {
      return res.status(400).json({ message: "Unable to find user by this ID" });
    }
    
    // Create a new blog instance
    const blog = new Blog({
      title,
      description,
      images, // Save the array of paths
      user,
    });

    // Save the blog instance to MongoDB
    const savedBlog = await blog.save();

    // Optionally push the saved blog to the user's blogs array
    existingUser.blogs.push(savedBlog);
    await existingUser.save();

    // Send a response back to the client with the saved blog
    res.status(201).json({ blog: savedBlog });
  } catch (err) {
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

//comment
export const addComment = async (req, res, next) => {
  const blogId = req.params.id;
  const { text, userId } = req.body;

  if (!text || !userId) {
    return res.status(400).json({ message: "Comment text and user ID are required." });
  }

  let blog;
  try {
    blog = await Blog.findByIdAndUpdate(
      blogId,
      { $push: { comments: { text, user: userId } } },
      { new: true }
    ).populate('comments.user', 'name');
    
    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message || "Internal Server Error" });
  }

  return res.status(200).json({ blog });
};
const _addBlog = async (req, res, next) => {
  const { title, description, user } = req.body;
  const image = req.file; // Retrieve the image file from the request

  let existingUser;
  try {
    existingUser = await User.findById(user);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Internal Server Error" });
  }
  if (!existingUser) {
    return res.status(400).json({ message: "Unable TO FInd User By This ID" });
  }
  const blog = new Blog({
    title,
    description,
    image: image.path, // Save the path of the uploaded image
    user,
  });
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await blog.save({ session });
    existingUser.blogs.push(blog);
    await existingUser.save({ session });
    await session.commitTransaction();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message || "Error while saving the blog" });
  }

  return res.status(200).json({ blog });
};

export const updateBlog = async (req, res, next) => {
  const { title, description } = req.body;
  const blogId = req.params.id;
  let blog;
  try {
    blog = await Blog.findByIdAndUpdate(blogId, {
      title,
      description,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Internal Server Error" });
  }
  if (!blog) {
    return res.status(500).json({ message: "Unable To Update The Blog" });
  }
  return res.status(200).json({ blog });
};

export const getById = async (req, res, next) => {
  const id = req.params.id;
  let blog;
  try {
    blog = await Blog.findById(id);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Internal Server Error" });
  }
  if (!blog) {
    return res.status(404).json({ message: "No Blog Found" });
  }
  return res.status(200).json({ blog });
};

export const deleteBlog = async (req, res, next) => {
  const id = req.params.id;

  let blog;
  try {
    blog = await Blog.findByIdAndRemove(id).populate("user");
    await blog.user.blogs.pull(blog);
    await blog.user.save();
  } catch (err) {
    console.log(err);
  }
  if (!blog) {
    return res.status(500).json({ message: "Unable To Delete" });
  }
  return res.status(200).json({ message: "Successfully Delete" });
};

export const getByUserId = async (req, res, next) => {
  const userId = req.params.id;
  console.log("Fetching blogs for user ID:", userId);
  let userBlogs;
  try {
    userBlogs = await User.findById(userId).populate("blogs");
    console.log("Found user blogs:", userBlogs);
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ message: err.message || "Internal Server Error" });
  }
  if (!userBlogs) {
    return res.status(404).json({ message: "No Blog Found" });
  }
  return res.status(200).json({ user: userBlogs });
};
