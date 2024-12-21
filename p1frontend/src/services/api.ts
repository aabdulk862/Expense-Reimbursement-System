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
export const getReimbursements = () => API.get("/reimbursements/my-reimbursements");

// Create a new reimbursement
export const createReimbursement = async (data: {
  description: string;
  amount: string;
}) => {
  return await axios.post(`${API_BASE_URL}/reimbursements/create`, data, {
    withCredentials: true, // Ensures cookies are sent for session authentication
  });
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

// Resolve reimbursement (approve/deny)
export const resolveReimbursement = (id: number, data: { status: string }) =>
  API.put(`/reimbursements/resolve/${id}`, data);  // PUT request for resolving the reimbursement


// Delete a user
export const deleteUser = (id: number) => API.delete(`/users/${id}`);
