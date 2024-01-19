    import express from "express";
    import multer from "multer";
    import {
    addBlog,
    addComment,
    deleteBlog,
    getAllBlogs,
    getById,
    getByUserId,
    toggleLike,
    updateBlog,
    } from "../controllers/blog-controller";

    const blogRouter = express.Router();

    // Configure multer for file uploads
    const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // the folder where files will be stored
    },
    filename: function (req, file, cb) {
        // Naming the file - you can adjust this as per your requirement
        cb(null, Date.now() + "-" + file.originalname);
    },
    });

    const upload = multer({ storage: storage });

    // Apply multer middleware to the '/add' route for handling image uploads
    blogRouter.post('/add', upload.array('files', 10), addBlog);

    // Other routes
    blogRouter.get("/", getAllBlogs);
    blogRouter.put("/update/:id", updateBlog);
    blogRouter.get("/:id", getById);
    blogRouter.delete("/:id", deleteBlog);
    blogRouter.get("/user/:id", getByUserId);

    // In blog-routes.js (routes)
    blogRouter.post("/:id/comment", addComment);
    blogRouter.post("/:id/like", toggleLike);

    export default blogRouter;
