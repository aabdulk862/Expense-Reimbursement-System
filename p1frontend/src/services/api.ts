import axios from "axios";

const API_BASE_URL = "http://localhost:4444"; // Ensure this matches your backend URL

// Axios instance with configuration
export const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Ensures cookies are sent for session-based authentication
});

// Login function
export const login = async (username: string, password: string) => {
  const response = await API.post("/auth/login", { username, password }); // Correct the variable name
  return response.data; // Return response data
};

export const logout = async () => {
  const response = await API.post("/auth/logout");
  return response.data;
};

// Register function
export const register = async (data: {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}) => {
  const response = await API.post("/users/register", data);
  return response.data; // Assuming it returns the created user data or a success message
};

// Get all reimbursements
export const getReimbursements = () =>
  API.get("/reimbursements/my-reimbursements");

// Create a new reimbursement
export const createReimbursement = async (reimbursementData: {
  description: string;
  amount: string;
}) => {
  try {
    const response = await API.post(
      "/reimbursements/create",
      reimbursementData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating reimbursement:", error);
    throw error;
  }
};

export const getReimbursementsForUser = async () => {
  try {
    const response = await API.get("/reimbursements/my-reimbursements");
    return response.data;
  } catch (error) {
    console.error("Error fetching reimbursements:", error);
    throw error;
  }
};

// Update reimbursement description
export const updateReimbursementDescription = async (
  reimId: number,
  description: string
) => {
  try {
    const response = await API.patch(`/reimbursements/update/${reimId}`, {
      description,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating reimbursement description:", error);
    throw error;
  }
};

export const getAllReimbursements = async () => {
  const response = await API.get("/reimbursements");
  return response.data;
};

export const getUsers = async () => {
  return await API.get("/users");
};

export const deleteUser = async (userId: number) => {
  return await API.delete(`/users/delete/${userId}`);
};

export const updateUserRole = async (targetUserId: number, newRole: string) => {
  return await API.patch("/users/update-role", {
    targetUserId,
    newRole,
  });
};

// Resolve reimbursement (approve/deny)
export const resolveReimbursement = async (reimId: number, status: string) => {
  try {
    const payload = { status };
    const response = await API.patch(
      `/reimbursements/resolve/${reimId}`,
      payload
    );
    return response.data; // Return the updated reimbursement data
  } catch (error) {
    console.error("Failed to resolve reimbursement:", error);
    throw error; // Re-throw the error for further handling
  }
};

export const getPendingReimbursements = async () => {
  try {
    const response = await API.get("/reimbursements/pending");
    return response.data; // Assuming the response is a list of ReimbursementDTO
  } catch (error) {
    console.error("Error fetching pending reimbursements:", error);
    throw error;
  }
};

