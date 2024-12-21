import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Reimbursement } from "../../types"; // Your Reimbursement type
import { getReimbursementsForUser } from "../../services/api";

export const ReimbursementDetail: React.FC = () => {
  const { id } = useParams(); // Get the reimbursement ID from the URL params
  const [reimbursement, setReimbursement] = useState<Reimbursement | null>(
    null
  );

  useEffect(() => {
    if (id) {
      const fetchReimbursement = async () => {
        try {
          const response = await getReimbursementsForUser(); // Assuming this API exists
          setReimbursement(response.data);
        } catch (error) {
          console.error("Failed to fetch reimbursement details", error);
        }
      };

      fetchReimbursement();
    }
  }, [id]);

  if (!reimbursement) {
    return <div>Loading...</div>; // Show loading state while fetching
  }

  return (
    <div>
      <h3>Reimbursement Details</h3>
      <p>Description: {reimbursement.description}</p>
      <p>Amount: {reimbursement.amount}</p>
      <p>Status: {reimbursement.status}</p>
      {/* Add other details you want to display */}
    </div>
  );
};
