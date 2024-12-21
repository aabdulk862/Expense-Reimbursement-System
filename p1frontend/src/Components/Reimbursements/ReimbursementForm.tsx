import React, { useState } from "react";
import { Box, TextField, Button, Typography, Divider } from "@mui/material";
import { createReimbursement } from "../../services/api";
import { useNavigate } from "react-router-dom";

export const ReimbursementForm: React.FC = () => {
  const [formData, setFormData] = useState({ description: "", amount: "" });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); // Reset error state

    try {
      await createReimbursement(formData); // Call API to create reimbursement
      navigate("/employee"); // Redirect to employee dashboard after success
    } catch (error) {
      console.error("Failed to create reimbursement", error);
      setError("Failed to create reimbursement. Please try again.");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 600,
        mx: "auto",
        p: 4,
        mt: 4,
        backgroundColor: "#f5f5f5",
        borderRadius: 2,
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold", mb: 3 }}
      >
        Create Reimbursement
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Button
        variant="outlined"
        color="primary"
        onClick={() => navigate("/employee")}
        sx={{ mb: 2 }}
      >
        Back
      </Button>
      {error && (
        <Typography
          variant="body2"
          color="error"
          gutterBottom
          sx={{ textAlign: "center" }}
        >
          {error}
        </Typography>
      )}
      <TextField
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
        variant="outlined"
      />
      <TextField
        label="Amount"
        name="amount"
        type="number"
        value={formData.amount}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
        variant="outlined"
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 3, py: 1 }}
      >
        Submit
      </Button>
    </Box>
  );
};
