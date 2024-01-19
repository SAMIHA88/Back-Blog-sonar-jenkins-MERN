  import React, { useState } from "react";
  import {
    AppBar,
    Typography,
    Toolbar,
    Box,
    Button,
    Tabs,
    Tab,
  } from "@mui/material";
  import { Link } from "react-router-dom";
  import { useDispatch, useSelector } from "react-redux";
  import { authActions } from "../store";
  import { useStyles } from "./utils";
  import logo from "../assets/logoOurTrip.png"; // Import your logo image

  const Header = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state) => state.isLoggedIn);
    const [value, setValue] = useState(); // Make sure to set value state

    const buttonStyle = {
      margin: 1,
      borderRadius: 3, // Adjusted border radius
      marginTop: 1,
      width: "100%",
      backgroundColor: "#03e9f4", // Button color
      "&:hover": {
        backgroundColor: "#fff", // Hover color
        color: "#03e9f4",
      },
    };

    return (
      <AppBar
        position="sticky"
        sx={{
          background: "linear-gradient(90deg, #ffffff 10%, #336B87 30%)",
        }}
      >
        <Toolbar>
          <Box display="flex" alignItems="center">
            <img src={logo} alt="Logo" style={{ height: 40, marginRight: 10 }} />
          </Box>
          <Box display="flex" marginLeft={"auto"} marginRight="auto">
            <Tabs
              textColor="inherit"
              value={value}
              onChange={(e, val) => setValue(val)}
            >
              <Tab
                className={classes.font1}
                component={Link}
                to="/home"
                label="Home"
              />
              <Tab
                className={classes.font1}
                component={Link}
                to="/blogs"
                label="All Blogs"
              />
              <Tab
                className={classes.font1}
                component={Link}
                to="/myBlogs"
                label="My Blogs"
              />
              <Tab
                className={classes.font1}
                component={Link}
                to="/blogs/add"
                label="Add Blog"
              />
            </Tabs>
          </Box>
          <Box display="flex" marginLeft="auto">
            {!isLoggedIn && (
              <>
                <Button
                  component={Link}
                  to="/auth"
                  variant="contained"
                  sx={buttonStyle}
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/auth"
                  variant="contained"
                  sx={buttonStyle}
                >
                  Signup
                </Button>
              </>
            )}
            {isLoggedIn && (
              <Button
                onClick={() => dispatch(authActions.logout())}
                component={Link}
                to="/auth"
                variant="contained"
                sx={buttonStyle}
              >
                Logout
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    );
  };

  export default Header;
