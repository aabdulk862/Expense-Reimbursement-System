import React, { useEffect, useState } from "react";
import { Box, Typography, Button, TextField, Divider } from "@mui/material";
import { Reimbursement } from "../../types";
import {
  getReimbursements,
  updateReimbursementDescription,
} from "../../services/api";

export const ReimbursementList: React.FC = () => {
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>([]);
  const [editMode, setEditMode] = useState<{ [key: number]: boolean }>({});
  const [editedDescriptions, setEditedDescriptions] = useState<{
    [key: number]: string;
  }>({});

  useEffect(() => {
    const fetchReimbursements = async () => {
      try {
        const response = await getReimbursements();
        setReimbursements(response.data);
      } catch (error) {
        console.error("Failed to fetch reimbursements", error);
      }
    };

    fetchReimbursements();
  }, []);

  const toggleEditMode = (reimId: number, currentDescription: string) => {
    setEditMode((prev) => ({ ...prev, [reimId]: !prev[reimId] }));
    setEditedDescriptions((prev) => ({
      ...prev,
      [reimId]: currentDescription,
    }));
  };

  const handleDescriptionChange = (reimId: number, newDescription: string) => {
    setEditedDescriptions((prev) => ({ ...prev, [reimId]: newDescription }));
  };

  const saveDescription = async (reimId: number) => {
    try {
      const updatedDescription = editedDescriptions[reimId];
      await updateReimbursementDescription(reimId, updatedDescription);
      setReimbursements((prev) =>
        prev.map((reimbursement) =>
          reimbursement.reimId === reimId
            ? { ...reimbursement, description: updatedDescription }
            : reimbursement
        )
      );
      setEditMode((prev) => ({ ...prev, [reimId]: false }));
    } catch (error) {
      console.error("Failed to update reimbursement", error);
    }
  };

  return (
    <Box sx={{ maxWidth: "600px", margin: "0 auto", p: 3 }}>
      <Typography variant="h5" align="center" sx={{ mb: 3 }}>
        Reimbursements
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {reimbursements.map((reimbursement) => (
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
          {editMode[reimbursement.reimId] ? (
            <>
              <TextField
                fullWidth
                value={editedDescriptions[reimbursement.reimId] || ""}
                onChange={(e) =>
                  handleDescriptionChange(reimbursement.reimId, e.target.value)
                }
                label="Edit Description"
                variant="outlined"
                size="small"
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => saveDescription(reimbursement.reimId)}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() =>
                    toggleEditMode(
                      reimbursement.reimId,
                      reimbursement.description
                    )
                  }
                >
                  Cancel
                </Button>
              </Box>
            </>
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
                size="small"
                onClick={() =>
                  toggleEditMode(
                    reimbursement.reimId,
                    reimbursement.description
                  )
                }
              >
                Edit
              </Button>
            </>
          )}
        </Box>
      ))}
    </Box>
  );
};
