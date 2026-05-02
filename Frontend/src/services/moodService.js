import API from "./api";

// Create a new mood entry
export const createMoodEntry = async (moodData) => {
  const response = await API.post("/moods", moodData);
  return response.data;
};

// Get all mood entries for logged in user
export const getMoodEntries = async () => {
  const response = await API.get("/moods");
  return response.data;
};

// Get a single mood entry by ID
export const getMoodEntryById = async (id) => {
  const response = await API.get(`/moods/${id}`);
  return response.data;
};

// Update a mood entry
export const updateMoodEntry = async (id, moodData) => {
  const response = await API.put(`/moods/${id}`, moodData);
  return response.data;
};

// Delete a mood entry
export const deleteMoodEntry = async (id) => {
  const response = await API.delete(`/moods/${id}`);
  return response.data;
};

// Get monthly mood report
export const getMonthlyReport = async (month, year) => {
  const response = await API.get(`/moods/report?month=${month}&year=${year}`);
  return response.data;
};