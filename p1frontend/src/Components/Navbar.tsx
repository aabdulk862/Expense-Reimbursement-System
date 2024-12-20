import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";

const Navbar: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate(); // Hook for programmatic navigation

  // Check localStorage on page load to update the login state
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("role");

    if (userId && role) {
      setIsLoggedIn(true);
      setUserRole(role);
    } else {
      setIsLoggedIn(false);
      setUserRole(null);
    }
  }, []); // Empty dependency array ensures this runs only once on component mount

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Employment Reimbursement System
        </Typography>

        <Box>
          <>
            <Button color="inherit" component={Link} to="/">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
          </>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
