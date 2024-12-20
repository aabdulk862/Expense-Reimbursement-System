import React, { useEffect, useState } from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { getReimbursements, logout } from "../services/api"; // assuming you have an api service for fetching reimbursements
import { Reimbursement } from "../types"; // assuming you have a type defined for ReimbursementDTO
import { useNavigate } from "react-router-dom";

export const EmployeeDashboard: React.FC = () => {
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch reimbursements when the component mounts
    const fetchReimbursements = async () => {
      try {
        const response = await getReimbursements(); // fetching reimbursements from the API
        setReimbursements(response.data);
      } catch (error) {
        console.error("Failed to fetch reimbursements", error);
      }
    };

    fetchReimbursements();
  }, []);

  const handleLogout = async () => {
    try {
      // Call the logout function to invalidate the session
      await logout();

      // Clear user data from localStorage
      localStorage.removeItem("userId");
      localStorage.removeItem("role");

      // Redirect to the login page
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        Employee Dashboard
      </Typography>
      <Button variant="contained" color="primary" onClick={handleLogout}>
        Logout
      </Button>
      <Box mb={3}>
        <Button variant="contained" color="primary">
          Create New Reimbursement
        </Button>
      </Box>

      <Typography variant="h5" gutterBottom>
        Your Reimbursements
      </Typography>

      <Box>
        {reimbursements.map((reimbursement) => (
          <Box
            key={reimbursement.reimId}
            p={2}
            mb={2}
            border={1}
            borderRadius={2}
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Typography variant="h6">{reimbursement.description}</Typography>
            <Typography variant="body2">
              Amount: ${reimbursement.amount}
            </Typography>
            <Typography variant="body2">
              Status: {reimbursement.status}
            </Typography>
          </Box>
        ))}
      </Box>
    </Container>
  );
};
