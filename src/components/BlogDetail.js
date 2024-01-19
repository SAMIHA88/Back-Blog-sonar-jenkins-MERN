import React, { useEffect, useState } from "react";
import { Button, InputLabel, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useStyles } from "./utils";
import background from "../assets/background1.jpg";

const labelStyles = { mb: 1, mt: 2, fontSize: "24px", fontWeight: "bold" };

const BlogDetail = () => {
  const navigate = useNavigate();
  const [blog, setBlog] = useState();
  const classes = useStyles();
  const id = useParams().id;

  const [inputs, setInputs] = useState({});
  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const fetchDetails = async () => {
    const res = await axios
      .get(`http://localhost:5000/api/blog/${id}`)
      .catch((err) => console.log(err));
    const data = await res.data;
    return data;
  };

  useEffect(() => {
    fetchDetails().then((data) => {
      setBlog(data.blog);
      setInputs({
        title: data.blog.title,
        description: data.blog.description,
      });
    });
  }, [id]);

  const sendRequest = async () => {
    const res = await axios
      .put(`http://localhost:5000/api/blog/update/${id}`, {
        title: inputs.title,
        description: inputs.description,
      })
      .catch((err) => console.log(err));

    const data = await res.data;
    return data;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(inputs);
    sendRequest()
      .then((data) => console.log(data))
      .then(() => navigate("/myBlogs/"));
  };

  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {inputs && (
        <form onSubmit={handleSubmit}>
          <Box
            border={3}
            borderColor="#336B87"
            borderRadius={10}
            boxShadow="10px 10px 20px #ccc"
            padding={10}
            margin={"auto"}
            marginTop={3}
            display="flex"
            flexDirection={"column"}
            width={"80%"}
            style={{
              background: "rgba(0, 0, 0, 0.55)",
            }}
          >
            <Typography
              fontWeight={"bold"}
              padding={3}
              color="#336B87"
              variant="h2"
              textAlign={"center"}
              className={classes.font}
            >
              Update The Blog
            </Typography>
            <InputLabel sx={{ ...labelStyles, color: "#336B87" }}>
              Title
            </InputLabel>
            <TextField
              name="title"
              onChange={handleChange}
              value={inputs.title}
              margin="auto"
              variant="outlined"
              sx={{
                "& input": {
                  color: "white",
                  fontFamily: "Lucida Sans", // Set the font family
                },
              }}
              className={classes.font}
            />
            <InputLabel sx={{ ...labelStyles, color: "#336B87" }}>
              Description
            </InputLabel>
            <TextField
              name="description"
              onChange={handleChange}
              value={inputs.description}
              margin="auto"
              variant="outlined"
              sx={{
                "& input": {
                  color: "white",
                  fontFamily: "Lucida Sans", // Set the font family
                },
              }}
              className={classes.font}
            />

            <Button
              sx={{
                mt: 2,
                borderRadius: 4,
                backgroundColor: "#336B87",
                "&:hover": {
                  backgroundColor: "#5588A3",
                },
              }}
              variant="contained"
              color="primary"
              type="submit"
            >
              Update
            </Button>
          </Box>
        </form>
      )}
    </div>
  );
};

export default BlogDetail;

