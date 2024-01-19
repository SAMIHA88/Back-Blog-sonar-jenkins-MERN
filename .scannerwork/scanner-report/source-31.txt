import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Blog from "./Blog";
import IconButton from '@mui/material/IconButton';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import "../assets/Blogs.css"; 
import { Box, Card, CardContent, CardHeader, CardMedia, Typography } from "@mui/material";

const UserBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/blog/user/${userId}`);
        if (res.data && res.data.user && Array.isArray(res.data.user.blogs)) {
          setBlogs(res.data.user.blogs);
        } else {
          console.log("No blogs found or incorrect data format.");
        }
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    };

    fetchBlogs();
  }, [userId]);

  const handleBlogClick = async (blogId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/blog/${blogId}`);
      setSelectedBlog(response.data.blog);
    } catch (error) {
      console.error("Error fetching blog details:", error);
    }
  };

  const handleBackToList = () => {
    setSelectedBlog(null);
  };

  const deleteRequest = async (blogId) => {
    try {
      await axios.delete(`http://localhost:5000/api/blog/${blogId}`);
      setBlogs(blogs.filter(blog => blog._id !== blogId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = (blogId) => {
    deleteRequest(blogId);
  };

  const handleEdit = (blogId) => {
    navigate(`/myBlogs/${blogId}`);
  };

  return (
    <div>
      {blogs.map((blog) => (
        <Card key={blog._id} sx={{ maxWidth: 1000, ml: 28 , mt:5 }}>
          <CardHeader
            action={
              <Box>
                <IconButton onClick={() => handleEdit(blog._id)} aria-label="edit blog">
                  <ModeEditOutlineIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(blog._id)} aria-label="delete blog">
                  <DeleteForeverIcon />
                </IconButton>
              </Box>
            }
            title={blog.title}
            
          />
          <CardMedia
            component="img"
            height="194"
            image={blog.images.length > 0 ? `http://localhost:5000/${blog.images[0]}` : 'defaultImage.jpg'} // Replace 'defaultImage.jpg' with an actual placeholder
            alt={blog.title}
          />
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              {blog.description}
            </Typography>
          </CardContent>
          
        </Card>
      ))}
    </div>
  );
};

export default UserBlogs;
