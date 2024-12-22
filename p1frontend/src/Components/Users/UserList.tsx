import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";
import { getUsers, deleteUser, updateUserRole } from "../../services/api";
import { User } from "../../types";

const VALID_ROLES = ["manager", "employee"]; // Define valid roles

export const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingRole, setEditingRole] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };

    fetchUsers();
  }, [users]);

  const handleRoleChange = (userId: number, newRole: string) => {
    setEditingRole((prev) => ({ ...prev, [userId]: newRole }));
  };

  const saveRoleChange = async (userId: number) => {
    try {
      const newRole = editingRole[userId];
      await updateUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((user) =>
          user.userId === userId ? { ...user, role: newRole } : user
        )
      );
      setEditingRole((prev) => {
        const { [userId]: _, ...rest } = prev; // Remove the edited user from editingRole
        return rest;
      });
    } catch (error) {
      console.error("Failed to update user role", error);
    }
  };

  return (
    <Box sx={{ maxWidth: "600px", margin: "0 auto", p: 3 }}>
      <Typography variant="h5" align="center" sx={{ mb: 3 }}>
        User Management
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {users.map((user) => (
        <Box
          key={user.userId}
          sx={{
            p: 3,
            mb: 2,
            border: "1px solid #ccc",
            borderRadius: 2,
            backgroundColor: "#f9f9f9",
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            {user.username}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Name:</strong> {user.firstName} {user.lastName}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            <strong>Current Role:</strong>{" "}
            {VALID_ROLES.includes(user.role) ? user.role : "Invalid Role"}
          </Typography>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
            <Select
              value={
                VALID_ROLES.includes(editingRole[user.userId] || user.role)
                  ? editingRole[user.userId] || user.role
                  : ""
              }
              onChange={(e) => handleRoleChange(user.userId, e.target.value)}
              size="small"
              sx={{ minWidth: 120 }}
              displayEmpty
            >
              {VALID_ROLES.map((role) => (
                <MenuItem key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </MenuItem>
              ))}
            </Select>
            <Button
              variant="contained"
              color="primary"
              onClick={() => saveRoleChange(user.userId)}
              disabled={!editingRole[user.userId]} // Disable if no role is selected
            >
              Save
            </Button>
          </Box>
          <Button
            variant="contained"
            color="error"
            onClick={() => deleteUser(user.userId)}
          >
            Delete
          </Button>
        </Box>
      ))}
    </Box>
  );
};
