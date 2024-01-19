import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { authActions } from "../store";
import { useNavigate } from "react-router-dom";
import background1 from "../assets/background1.jpg";
import background2 from "../assets/background2.jpg";
import background3 from "../assets/background3.jpg";

const Auth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isSignup, setIsSignup] = useState(false);
  const [backgroundImages] = useState([background1, background2, background3]);
  const [backgroundIndex, setBackgroundIndex] = useState(0);

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const sendRequest = async (type = "login") => {
    try {
      const res = await axios.post(`http://localhost:5000/api/user/${type}`, {
        name: inputs.name,
        email: inputs.email,
        password: inputs.password,
      });

      const data = res.data;
      console.log(data);
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(inputs);
    if (isSignup) {
      sendRequest("signup")
        .then((data) => localStorage.setItem("userId", data.user._id))
        .then(() => dispatch(authActions.login()))
        .then(() => navigate("/blogs"));
    } else {
      sendRequest()
        .then((data) => localStorage.setItem("userId", data.user._id))
        .then(() => dispatch(authActions.login()))
        .then(() => navigate("/home"));
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setBackgroundIndex((prev) => (prev === backgroundImages.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [backgroundImages.length]);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      style={{
        backgroundImage: `url(${backgroundImages[backgroundIndex]})`,
        backgroundSize: "cover",
        transition: "background-image 1s ease-in-out",
      }}
    >
      <Box
        maxWidth={400}
        width="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        boxShadow="0px 0px 10px rgba(0, 0, 0, 0.1)"
        padding={3}
        borderRadius={5}
        style={{
          background: "rgba(0, 0, 0, 0.7)",
          color: "#fff",
          position: "relative",
        }}
      >
        <Typography
          variant="h4"
          marginBottom={3}
          style={{
            color: "#fff",
            textAlign: "center", // Center align text
            margin: "0 0 30px", // Adjust margin
          }}
        >
          {isSignup ? "Sign up" : "Log in"}
        </Typography>
        {isSignup && (
          <TextField
            name="name"
            onChange={handleChange}
            value={inputs.name}
            placeholder="Full Name"
            margin="normal"
            fullWidth
            InputProps={{
              style: {
                color: "#fff",
                borderBottom: "1px solid #fff", // Add bottom border
              },
            }}
          />
        )}
        <TextField
          name="email"
          onChange={handleChange}
          value={inputs.email}
          type="email"
          placeholder="Email"
          margin="normal"
          fullWidth
          InputProps={{
            style: {
              color: "#fff",
              borderBottom: "1px solid #fff",
            },
          }}
        />
        <TextField
          name="password"
          onChange={handleChange}
          value={inputs.password}
          type="password"
          placeholder="Password"
          margin="normal"
          fullWidth
          InputProps={{
            style: {
              color: "#fff",
              borderBottom: "1px solid #fff",
            },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{
            borderRadius: 3,
            marginTop: 3,
            width: "100%",
            backgroundColor: "#03e9f4",
            "&:hover": {
              backgroundColor: "#fff",
              color: "#03e9f4",
            },
          }}
          color="primary"
          onClick={handleSubmit}
        >
          Submit
        </Button>
        <Button
          onClick={() => setIsSignup(!isSignup)}
          sx={{
            borderRadius: 3,
            marginTop: 2,
            color: "#03e9f4",
            position: "relative",
            display: "inline-block",
            textDecoration: "none",
            textTransform: "uppercase",
            overflow: "hidden",
            transition: ".5s",
            letterSpacing: "4px",
          }}
          color="primary"
        >
          {isSignup ? "Switch to Login" : "Switch to Signup"}
          <span
            style={{
              position: "absolute",
              display: "block",
            }}
          >
            <span
              style={{
                top: 0,
                left: "-100%",
                width: "100%",
                height: "2px",
                background: "linear-gradient(90deg, transparent, #03e9f4)",
                animation: "btn-anim1 1s linear infinite",
              }}
            ></span>
            <span
              style={{
                top: "-100%",
                right: 0,
                width: "2px",
                height: "100%",
                background: "linear-gradient(180deg, transparent, #03e9f4)",
                animation: "btn-anim2 1s linear infinite",
                animationDelay: ".25s",
              }}
            ></span>
            <span
              style={{
                bottom: 0,
                right: "-100%",
                width: "100%",
                height: "2px",
                background: "linear-gradient(270deg, transparent, #03e9f4)",
                animation: "btn-anim3 1s linear infinite",
                animationDelay: ".5s",
              }}
            ></span>
            <span
              style={{
                bottom: "-100%",
                left: 0,
                width: "2px",
                height: "100%",
                background: "linear-gradient(360deg, transparent, #03e9f4)",
                animation: "btn-anim4 1s linear infinite",
                animationDelay: ".75s",
              }}
            ></span>
          </span>
        </Button>
      </Box>
    </Box>
  );
};

export default Auth;