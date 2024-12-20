import React, { useState } from "react";
import { TextField, Button, Typography, Box, Stack } from "@mui/material";
import { register } from "../../services/api"; // Import your register API function
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom v6

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState<string>("");

  const navigate = useNavigate(); // Hook to navigate after successful registration

  // Handle form field changes
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(""); // Reset error state on new submission

    try {
      const response = await register(formData); // Send the registration request
      // Redirect to login or dashboard upon successful registration
      navigate("/"); // Redirect to login page after successful registration
    } catch (err) {
      setError("Error during registration. Please try again.");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "auto", padding: 3 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Register
      </Typography>

      {error && (
        <Typography color="error" align="center" gutterBottom>
          {error}
        </Typography>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="First Name"
            name="firstName"
            fullWidth
            value={formData.firstName}
            onChange={handleChange}
          />
          <TextField
            label="Last Name"
            name="lastName"
            fullWidth
            value={formData.lastName}
            onChange={handleChange}
          />
          <TextField
            label="Username"
            name="username"
            fullWidth
            value={formData.username}
            onChange={handleChange}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            value={formData.password}
            onChange={handleChange}
          />
          <Button type="submit" variant="contained" fullWidth>
            Register
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default Register;
