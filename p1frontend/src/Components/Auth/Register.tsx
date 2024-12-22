import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Stack,
  Paper,
  Grid,
} from "@mui/material";
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
  const [registrationSuccess, setRegistrationSuccess] = useState(false); // State to track registration success

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
      await register(formData); // Send the registration request
      setRegistrationSuccess(true); // Set success state
    } catch (err) {
      setError("Error during registration. Please try again.");
    }
  };

  const handleLoginRedirect = () => {
    navigate("/"); // Redirect to the login page
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", padding: 3 }}>
      <Paper sx={{ padding: 3, boxShadow: 3 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Register
        </Typography>

        {error && (
          <Typography color="error" align="center" gutterBottom>
            {error}
          </Typography>
        )}

        {!registrationSuccess ? (
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="First Name"
                name="firstName"
                fullWidth
                value={formData.firstName}
                onChange={handleChange}
                variant="outlined"
              />
              <TextField
                label="Last Name"
                name="lastName"
                fullWidth
                value={formData.lastName}
                onChange={handleChange}
                variant="outlined"
              />
              <TextField
                label="Username"
                name="username"
                fullWidth
                value={formData.username}
                onChange={handleChange}
                variant="outlined"
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                fullWidth
                value={formData.password}
                onChange={handleChange}
                variant="outlined"
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                color="primary"
                sx={{ padding: 1 }}
              >
                Register
              </Button>
            </Stack>
          </form>
        ) : (
          <Box
            sx={{
              backgroundColor: "#e0f7fa",
              padding: 3,
              borderRadius: 2,
              boxShadow: 2,
              textAlign: "center",
              marginTop: 3,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              🎉 Registration Successful!
            </Typography>
            <Typography variant="body2" sx={{ mb: 3 }}>
              Your account has been created successfully. Please click the
              button below to log in.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleLoginRedirect}
              sx={{ padding: 1, width: "100%" }}
            >
              Go to Login
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Register;
