import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Box, Alert } from "@mui/material";
import { login } from "../../services/api";

export const Login: React.FC = () => {
  const [loginCredentials, setLoginCredentials] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLoginCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      const user = await login(
        loginCredentials.username,
        loginCredentials.password
      );

      // Store user data in localStorage
      localStorage.setItem("userId", user.id);
      localStorage.setItem("role", user.role);

      // Redirect to the appropriate dashboard
      navigate(user.role === "manager" ? "/manager" : "/employee");
    } catch (err) {
      setError("Invalid username or password.");
      console.log(err);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 400,
        margin: "auto",
        marginTop: 8,
        padding: 4,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "#fff",
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Login
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          name="username"
          value={loginCredentials.username}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={loginCredentials.password}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
        />

        {error && (
          <Alert severity="error" sx={{ marginTop: 2 }}>
            {error}
          </Alert>
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 3 }}
        >
          Login
        </Button>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 3 }}
          onClick={() => navigate("/register")}
        >
          Register
        </Button>
      </form>
    </Box>
  );
};
