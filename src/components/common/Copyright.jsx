import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {"Copyright © "}
      <Link color="inherit" href="https://career-cupid.netlify.app/">
        Career Cupid
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
