import React, { useEffect, useState } from "react";
import { Box, Typography, Divider } from "@mui/material";
import { getAllReimbursements } from "../../services/api";
import { Reimbursement } from "../../types";

export const ManagerReimbursementList: React.FC = () => {
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllReimbursements();
        setReimbursements(data);
      } catch (err) {
        console.error("Error fetching reimbursements:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ maxWidth: "600px", margin: "0 auto", p: 3 }}>
      <Typography variant="h5" align="center" sx={{ mb: 3 }}>
        All Reimbursements
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
      ))}
    </Box>
  );
};
