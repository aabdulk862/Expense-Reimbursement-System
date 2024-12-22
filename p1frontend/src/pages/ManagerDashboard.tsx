import React, { useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Divider,
  Tabs,
  Tab,
} from "@mui/material";
import { useNavigate, Routes, Route } from "react-router-dom";
import { ReimbursementList } from "../Components/Reimbursements/ReimbursementList";
import { ManagerReimbursementList } from "../Components/Reimbursements/ManagerReimbursementList";
import { ReimbursementDetail } from "../Components/Reimbursements/ReimbursementDetail";
import { UserList } from "../Components/Users/UserList";

export const ManagerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0); // 0 for ReimbursementList, 1 for ManagerReimbursementList

  const handleLogout = async () => {
    try {
      // Perform logout actions
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: 4,
        p: 3,
        backgroundColor: "#f5f5f5",
        borderRadius: 2,
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography
        variant="h3"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold", mb: 3 }}
      >
        Manager Dashboard
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 4 }}
      >
        <Button
          variant="contained"
          color="error"
          size="large"
          onClick={handleLogout}
          sx={{ px: 3 }}
        >
          Logout
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate("/create-reimbursements")}
          sx={{ px: 3 }}
        >
          Create New Reimbursement
        </Button>
      </Box>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        centered
        sx={{ mb: 4 }}
      >
        <Tab label="My Reimbursements" />
        <Tab label="All Reimbursements" />
        <Tab label="User Management" />
      </Tabs>
      <Box sx={{ mt: 3 }}>
        {activeTab === 0 && <ReimbursementList />}
        {activeTab === 1 && <ManagerReimbursementList />}
        {activeTab === 2 && <UserList />}
      </Box>
    </Container>
  );
};
