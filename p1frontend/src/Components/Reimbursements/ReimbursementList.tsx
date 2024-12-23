import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  
  Select,
  MenuItem,
  Divider,
} from "@mui/material";
import { Reimbursement } from "../../types";
import { getPendingReimbursementsForUser, getReimbursements } from "../../services/api"; // Update API call

export const ReimbursementList: React.FC = () => {
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>([]);
  const [view, setView] = useState<"all" | "pending">("pending");

  useEffect(() => {
    const fetchReimbursements = async () => {
      try {
        let response;

        if (view === "pending") {
          // Fetch pending reimbursements from the backend
          response = await getPendingReimbursementsForUser(); // Call the updated API endpoint
        } else {
          // Fetch all reimbursements (optional logic for this)
          response = await getReimbursements(); // You can implement this function as well
        }

        setReimbursements(response.data);
      } catch (error) {
        console.error("Failed to fetch reimbursements", error);
      }
    };

    fetchReimbursements();
  }, [view]); // Re-run the fetch when view changes

  return (
    <Box sx={{ maxWidth: "600px", margin: "0 auto", p: 3 }}>
      <Typography variant="h5" align="center" sx={{ mb: 3 }}>
        My Reimbursements
      </Typography>

      <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
        <Select
          value={view}
          onChange={(e) => setView(e.target.value as "all" | "pending")}
          displayEmpty
          sx={{ width: "200px" }}
        >
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="all">All</MenuItem>
        </Select>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {reimbursements.length === 0 ? (
        <Typography variant="body1" align="center">
          No {view === "pending" ? "pending" : ""} reimbursements found.
        </Typography>
      ) : (
        reimbursements.map((reimbursement) => (
          <Box
            key={reimbursement.reimId}
            sx={{
              p: 3,
              mb: 2,
              border: "1px solid #ccc",
              borderRadius: 2,
              backgroundColor: "#f9f9f9",
            }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              {reimbursement.description}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Amount:</strong> ${reimbursement.amount}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              <strong>Status:</strong> {reimbursement.status}
            </Typography>
          </Box>
        ))
      )}
    </Box>
  );
};
