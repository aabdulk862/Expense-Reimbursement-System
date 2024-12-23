import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Divider,
  TextField,
  Button, // Added missing import for Button
} from "@mui/material";
import { Reimbursement } from "../../types";
import {
  getPendingReimbursementsForUser,
  getReimbursements,
  updateReimbursementDescription,
} from "../../services/api"; // Removed duplicate import

export const ReimbursementList: React.FC = () => {
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>([]);
  const [view, setView] = useState<"all" | "pending">("pending");
  const [editingReimId, setEditingReimId] = useState<number | null>(null);
  const [newDescription, setNewDescription] = useState<string>("");

  useEffect(() => {
    const fetchReimbursements = async () => {
      try {
        let response;

        if (view === "pending") {
          response = await getPendingReimbursementsForUser();
        } else {
          response = await getReimbursements();
        }

        setReimbursements(response.data);
      } catch (error) {
        console.error("Failed to fetch reimbursements", error);
      }
    };

    fetchReimbursements();
  }, [view]);

  const handleEditDescription = (
    reimId: number,
    currentDescription: string
  ) => {
    setEditingReimId(reimId);
    setNewDescription(currentDescription);
  };

  const handleSaveDescription = async (reimId: number) => {
    try {
      await updateReimbursementDescription(reimId, newDescription);
      setEditingReimId(null); // Stop editing mode
    } catch (error) {
      console.error("Error saving reimbursement description", error);
    }
  };

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
            {editingReimId === reimbursement.reimId ? (
              <Box>
                <TextField
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  fullWidth
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleSaveDescription(reimbursement.reimId)}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setEditingReimId(null)} // Cancel editing
                  sx={{ ml: 2 }}
                >
                  Cancel
                </Button>
              </Box>
            ) : (
              <>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {reimbursement.description}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Amount:</strong> ${reimbursement.amount}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  <strong>Status:</strong> {reimbursement.status}
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() =>
                    handleEditDescription(
                      reimbursement.reimId,
                      reimbursement.description
                    )
                  }
                >
                  Edit Description
                </Button>
              </>
            )}
          </Box>
        ))
      )}
    </Box>
  );
};
