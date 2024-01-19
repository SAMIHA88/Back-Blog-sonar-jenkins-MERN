import mongoose from "mongoose";

const Schema = mongoose.Schema;

const blogSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: [{ type: String }], // Array of image paths
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  comments: [{
    text: String,
    user: { type: mongoose.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
  }],
  likes: [{ type: mongoose.Types.ObjectId, ref: "User" }],
});

export default mongoose.model("Blog", blogSchema);
