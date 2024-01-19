import React from "react";
import { Typography, Box } from "@mui/material";
import homeBackground from "../assets/Home_bg.jpg";

const Home = () => {
  const homeStyle = {
    backgroundImage: `url(${homeBackground})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    textAlign: "center",
  };

  const fontStyle = {
    fontFamily: "Lucida Handwriting, sans-serif", // Changed font to Cursive
    fontSize: "1.9rem", // Reduced font size
    fontWeight: "bold",
    lineHeight: 1.2,
    margin: "6cm  0.5cm 1cm", // Added margin to increase spacing
  };

  const welcomeText =
    "Unleash Your Creativity, Share Your Stories: Welcome to Our Personal Blog Odyssey!";

  return (
    <Box sx={homeStyle}>
      <Typography sx={fontStyle}>{welcomeText}</Typography>
    </Box>
  );
};

export default Home;
