import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
  font: {
    fontFamily: "Roboto !important",
    color: "#336B87",
  },
  font1: {
    fontFamily: "Montserrat, sans-serif !important",
    transition: "transform 0.2s ease-in-out",
    "&:hover": {
      color: "#000",
      transform: "scale(1.1)",
    },
  },
  whiteBorder: {
    borderColor: "#336B87  !important",
  },
  
});
