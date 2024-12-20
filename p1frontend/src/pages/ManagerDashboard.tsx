import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
} from "@mui/material";
import {
  getReimbursements,
  logout,
  resolveReimbursement,
} from "../services/api"; // assuming you have api service for fetching and resolving reimbursements
import { Reimbursement } from "../types"; // assuming you have a type defined for Reimbursement
import { useNavigate } from "react-router-dom";

export const ManagerDashboard: React.FC = () => {
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch all reimbursements when the component mounts
    const fetchReimbursements = async () => {
      try {
        const response = await getReimbursements(); // fetching all reimbursements from the API
        setReimbursements(response.data);
      } catch (error) {
        console.error("Failed to fetch reimbursements", error);
      }
    };

    fetchReimbursements();
  }, []);

  const handleResolve = async (id: number, status: string) => {
    try {
      // Sending the updated status to the backend via PUT request
      const updatedReimbursement = await resolveReimbursement(id, { status });

      // Update the local state with the updated reimbursement
      setReimbursements(
        reimbursements.map((reimbursement) =>
          reimbursement.reimId === id
            ? { ...reimbursement, status }
            : reimbursement
        )
      );
    } catch (error) {
      console.error("Failed to resolve reimbursement", error);
    }
  };

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
        Manager Dashboard
      </Typography>
      <Button variant="contained" color="primary" onClick={handleLogout}>
        Logout
      </Button>
      <Box mb={3}>
        <Button variant="contained" color="primary">
          Manage Users
        </Button>
      </Box>

      <Typography variant="h5" gutterBottom>
        All Reimbursements
      </Typography>

      <Box>
        {reimbursements.map((reimbursement) => (
          <Card key={reimbursement.reimId} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">{reimbursement.description}</Typography>
              <Typography variant="body2">
                Amount: ${reimbursement.amount}
              </Typography>
              <Typography variant="body2">
                Status: {reimbursement.status}
              </Typography>

              {reimbursement.status === "PENDING" && (
                <Box mt={2}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() =>
                      handleResolve(reimbursement.reimId, "APPROVED")
                    }
                  >
                    Approve
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() =>
                      handleResolve(reimbursement.reimId, "DENIED")
                    }
                    sx={{ ml: 2 }}
                  >
                    Deny
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
};
