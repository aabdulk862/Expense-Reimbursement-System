import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  Divider,
  FormControl,
} from "@mui/material";
import {
  getAllReimbursements,
  getPendingReimbursements,
  resolveReimbursement,
} from "../../services/api";
import { Reimbursement } from "../../types";

export const ManagerReimbursementList: React.FC = () => {
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>([]);
  const [resolving, setResolving] = useState<{ [key: number]: string }>({});
  const [view, setView] = useState<"all" | "pending">("pending"); // New state to toggle between views

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data;
        if (view === "pending") {
          data = await getPendingReimbursements(); // Fetch only pending reimbursements
        } else {
          data = await getAllReimbursements(); // Fetch all reimbursements
        }
        setReimbursements(data);
      } catch (err) {
        console.error("Error fetching reimbursements:", err);
      }
    };

    fetchData();
  }, [view, resolving]); // Re-fetch data whenever view changes

  const handleResolveChange = (reimId: number, status: string) => {
    setResolving((prev) => ({ ...prev, [reimId]: status }));
  };

  const submitResolution = async (reimId: number) => {
    try {
      const status = resolving[reimId];

      // Ensure status is valid
      if (status !== "APPROVED" && status !== "DENIED") {
        console.error("Invalid status");
        return; // Prevent request if the status is invalid
      }

      const updatedReimbursement = await resolveReimbursement(reimId, status);
      setReimbursements((prev) =>
        prev.map((reimbursement) =>
          reimbursement.reimId === reimId ? updatedReimbursement : reimbursement
        )
      );
      setResolving((prev) => {
        const { [reimId]: _, ...rest } = prev; // Remove resolved entry
        return rest;
      });
    } catch (error) {
      console.error("Error resolving reimbursement:", error);
    }
  };

  return (
    <Box sx={{ maxWidth: "600px", margin: "0 auto", p: 3 }}>
      <Typography variant="h5" align="center" sx={{ mb: 3 }}>
        Reimbursement List
      </Typography>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <Select
          value={view}
          onChange={(e) => setView(e.target.value as "all" | "pending")}
          displayEmpty
          sx={{ width: "200px", margin: "0 auto" }}
        >
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="all">All</MenuItem>
        </Select>
      </FormControl>
      <Divider sx={{ mb: 2 }} />
      {reimbursements.length === 0 ? (
        <Typography variant="body1" align="center">
          No reimbursements found.
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
              <strong>UserId:</strong> {reimbursement.userId}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Amount:</strong> ${reimbursement.amount}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              <strong>Status:</strong> {reimbursement.status}
            </Typography>

            {reimbursement.status === "PENDING" && (
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <Select
                  value={resolving[reimbursement.reimId] || ""}
                  onChange={(e) =>
                    handleResolveChange(reimbursement.reimId, e.target.value)
                  }
                  size="small"
                  sx={{ minWidth: 120 }}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Resolve
                  </MenuItem>
                  <MenuItem value="APPROVED">Approve</MenuItem>
                  <MenuItem value="DENIED">Deny</MenuItem>
                </Select>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => submitResolution(reimbursement.reimId)}
                  disabled={!resolving[reimbursement.reimId]} // Disable if no selection
                >
                  Submit
                </Button>
              </Box>
            )}
          </Box>
        ))
      )}
    </Box>
  );
};
