import API from "./api";

// Get all users
export const getAllUsers = async () => {
  const response = await API.get("/users");
  return response.data;
};

// Get user by ID
export const getUserById = async (id) => {
  const response = await API.get(`/users/${id}`);
  return response.data;
};

// Update user profile
export const updateUser = async (id, userData) => {
  const response = await API.put(`/users/${id}`, userData);
  return response.data;
};

// Delete user
export const deleteUser = async (id) => {
  const response = await API.delete(`/users/${id}`);
  return response.data;
};
