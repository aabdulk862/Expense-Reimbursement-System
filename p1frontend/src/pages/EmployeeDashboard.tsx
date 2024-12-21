import { Container, Typography, Button, Box, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ReimbursementList } from "../Components/Reimbursements/ReimbursementList";

export const EmployeeDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Simulate logout logic
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
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
        Employee Dashboard
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
      <ReimbursementList />
    </Container>
  );
};
