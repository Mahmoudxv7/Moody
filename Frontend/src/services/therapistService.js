import API from "./api";

// Get all therapists
export const getTherapists = async () => {
  const response = await API.get("/therapists");
  return response.data;
};

// Assign a therapist to the logged in user
export const assignTherapist = async (therapistID) => {
  const response = await API.post("/therapists/assign", { therapistID });
  return response.data;
};

// Get all patients assigned to the logged in therapist
export const getAssignedPatients = async () => {
  const response = await API.get("/therapists/patients");
  return response.data;
};

// Get assignment for a specific user
export const getAssignment = async (userId) => {
  const response = await API.get(`/therapists/assignment/${userId}`);
  return response.data;
};
