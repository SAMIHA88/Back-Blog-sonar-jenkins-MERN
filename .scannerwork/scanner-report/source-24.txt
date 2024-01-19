// AddBlog.js
import React, { useState, useRef } from 'react';
import { Box, Button, InputLabel, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useStyles } from './utils';
import background from '../assets/background1.jpg';
import ImportExportIcon from '@mui/icons-material/ImportExport';

const labelStyles = { mb: 1, mt: 2, fontSize: '24px', fontWeight: 'bold' };

const AddBlog = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    title: '',
    description: '',
    images: [], // This should be an array to hold multiple images
  });

  const fileInputRef = useRef(null);
  const [fileAdded, setFileAdded] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === 'images') {
      setInputs({ ...inputs, [e.target.name]: e.target.files });
      setFileAdded(e.target.files.length > 0);
    } else {
      setInputs({ ...inputs, [e.target.name]: e.target.value });
    }
  };

  const sendRequest = async () => {
    const formData = new FormData();
    formData.append('title', inputs.title);
    formData.append('description', inputs.description);
    formData.append('user', localStorage.getItem('userId'));
    for (const key of Object.keys(inputs.images)) {
      formData.append('files', inputs.images[key]);
    }

    try {
      const res = await axios.post('http://localhost:5000/api/blog/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    } catch (err) {
      console.error('Error while adding the blog:', err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendRequest()
      .then((data) => {
        console.log(data);
        navigate('/blogs');
      });
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <form onSubmit={handleSubmit}>
        <Box
          border={3}
          borderColor="#336B87"
          borderRadius={10}
          boxShadow="5px 5px 10px #ccc"
          padding={10}
          width={"100%"}
          position="inherit"
          alignItems={"center"}
          style={{
            background: "rgba(0, 0, 0, 0.55)",
            marginLeft: "-80px",
          }}
        >
          <Typography
            className={classes.font}
            fontWeight={"bold"}
            padding={3}
            color="#336B87"
            variant="h2"
            textAlign={"center"}
          >
            Post Your Blog
          </Typography>
          <InputLabel
            className={classes.font}
            sx={{ color: "#336B87", ...labelStyles, borderColor: "#fff" }}
          >
            Title
          </InputLabel>
          <TextField
            className={classes.font}
            name="title"
            onChange={handleChange}
            value={inputs.title}
            margin="auto"
            variant="outlined"
            InputProps={{
              classes: {
                notchedOutline: classes.whiteBorder,
              },
            }}
            sx={{
              width: "100%",
              "& input": {
                color: "white",
              },
            }}
          />
          <InputLabel
            className={classes.font}
            sx={{ color: "#336B87", ...labelStyles, borderColor: "#fff" }}
          >
            Description
          </InputLabel>
          <TextField
            className={classes.font}
            name="description"
            onChange={handleChange}
            value={inputs.description}
            margin="auto"
            variant="outlined"
            InputProps={{
              classes: {
                notchedOutline: classes.whiteBorder,
              },
            }}
            sx={{
              width: "100%",
              "& textarea": {
                color: "white",
              },
            }}
            multiline
            rows={4}
          />
          <InputLabel
            className={classes.font}
            sx={{ color: "#336B87", ...labelStyles, borderColor: "#fff" }}
          >
            Image
          </InputLabel>
          <Button
            variant="contained"
            color="primary"
            component="span"
            onClick={handleButtonClick}
            sx={{
              width: "100%",
              height: "3rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {fileAdded ? 'FILES ADDED' : 'ADD FILES'}
            <ImportExportIcon sx={{ marginLeft: '0.5rem' }} />
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            name="images"
            onChange={handleChange}
            accept="image/*"
            multiple
            style={{ display: 'none' }}
          />
          <Button
            sx={{
              mt: 2,
              borderRadius: 4,
              backgroundColor: "#336B87",
              "&:hover": {
                backgroundColor: "#5588A3",
              },
              margin: "auto",
              display: "block",
            }}
            variant="contained"
            color="primary"
            type="submit"
          >
            Share
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default AddBlog;
