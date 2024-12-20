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
export const createReimbursement = (data: {
  description: string;
  amount: number;
}) => API.post("/reimbursements", data);

// Update reimbursement description
export const updateReimbursement = (
  id: number,
  data: { description: string }
) => API.patch(`/reimbursements/${id}`, data);

// Resolve reimbursement (approve/deny)
export const resolveReimbursement = (id: number, data: { status: string }) =>
  API.put(`/reimbursements/resolve/${id}`, data);  // PUT request for resolving the reimbursement


// Delete a user
export const deleteUser = (id: number) => API.delete(`/users/${id}`);
