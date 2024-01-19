import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  Typography,
  TextField,
  Button,
} from '@mui/material';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useStyles } from './utils';

const Blog = ({ title, description, images, isUser, id, onBlogClick }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [likes, setLikes] = useState([]);
  const [likedByUser, setLikedByUser] = useState(false);
  const [userProfile, setUserProfile] = useState({ name: '', profilePicture: '' });
  const [expanded, setExpanded] = useState(false);

  const handleInteraction = (e) => {
    e.stopPropagation(); // Prevents triggering the parent's onClick event
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    handleInteraction(e);
    addComment();
  };

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/blog/${id}`);
        setComments(response.data.blog.comments);
        setLikes(response.data.blog.likes);
        const userId = localStorage.getItem('userId');
        setLikedByUser(response.data.blog.likes.includes(userId));

        if (userId) {
          axios.get(`http://localhost:5000/api/user/${userId}`)
              .then(response => {
                  setUserProfile({
                    name: response.data.name,
                    profilePicture: response.data.profilePicture // Assuming this is the field name
                  });
              })
              .catch(error => console.error('Error fetching user data:', error));
        }
      } catch (error) {
        console.error('Error fetching blog data:', error);
      }
    };

    fetchBlogData();
  }, [id]);

  const handleEdit = () => {
    navigate(`/myBlogs/${id}`);
  };

  const handleBlogClick = () => {
    if (onBlogClick) {
      onBlogClick(id);
    } else {
      setExpanded(prev => !prev);
    }
  };

  const deleteRequest = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/blog/${id}`);
      navigate('/blogs');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = () => {
    deleteRequest();
  };

  const addComment = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.post(`http://localhost:5000/api/blog/${id}/comment`, {
        text: newComment,
        userId
      });
      setComments(response.data.blog.comments);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const toggleLike = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.post(`http://localhost:5000/api/blog/${id}/like`, {
        userId
      });
      setLikes(response.data.blog.likes);
      setLikedByUser(!likedByUser);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <div>
      <Card
        sx={{
          width: '70%',
          margin: 'auto',
          mt: 2,
          padding: 2,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: '10px',
          transition: 'transform 0.3s',
          ':hover': {
            transform: 'scale(1.02)',
          },
        }}
      >
         {isUser && (
          <Box display='flex'>
            <IconButton onClick={(e) => { handleInteraction(e); handleEdit(); }} sx={{ marginLeft: 'auto', color: '#336B87' }}>
              <ModeEditOutlineIcon />
            </IconButton>
            <IconButton onClick={(e) => { handleInteraction(e); handleDelete(); }} sx={{ color: '#336B87' }}>
              <DeleteForeverIcon />
            </IconButton>
          </Box>
        )}
        <CardHeader
          avatar={ 
            <Avatar
              className={classes.font}
              src={userProfile.profilePicture} // Display the profile picture
              sx={{
                bgcolor: userProfile.profilePicture ? 'transparent' : '#336B87',
                shape: 'hexagon',
                borderRadius: 5,
              }}
              aria-label='recipe'
            >
              {!userProfile.profilePicture && userProfile.name.charAt(0)}
            </Avatar>
          }
          title={
            <Typography
              variant='h6'
              onClick={handleBlogClick}
              style={{
                cursor: 'pointer',
                color: '#333',
              }}
            >
              {title}
            </Typography>
          }
        />
        {images.map((imageURL, index) => (
          <CardMedia
            key={index}
            component='img'
            height='250'
            image={`http://localhost:5000/${imageURL}`}
            alt={`Blog Image ${index}`}
            sx={{ borderRadius: '10px', marginTop: 2 }}
          />
        ))}
        <CardContent onClick={handleBlogClick}>
          <IconButton onClick={(e) => { handleInteraction(e); toggleLike(); }} sx={{ color: likedByUser ? 'red' : 'grey' }}>
            {likedByUser ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
          <span>{likes.length} Likes</span>
          <div onClick={handleInteraction}> {/* This div wraps the comment section */}
            <TextField
              label='New Comment'
              variant='outlined'
              fullWidth
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onClick={handleInteraction}
            />
            <Button onClick={handleAddComment}>Add Comment</Button>
            {comments.map((comment, index) => (
              <Typography key={index}>{comment.user.name} : {comment.text}</Typography>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Blog;
