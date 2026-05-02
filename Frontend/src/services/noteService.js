import API from "./api";

// Create a new therapist note
export const createNote = async (noteData) => {
  const response = await API.post("/notes", noteData);
  return response.data;
};

// Get all notes for logged in therapist
export const getNotes = async () => {
  const response = await API.get("/notes");
  return response.data;
};

// Get a single note by ID
export const getNoteById = async (id) => {
  const response = await API.get(`/notes/${id}`);
  return response.data;
};

// Update a note
export const updateNote = async (id, noteData) => {
  const response = await API.put(`/notes/${id}`, noteData);
  return response.data;
};

// Delete a note
export const deleteNote = async (id) => {
  const response = await API.delete(`/notes/${id}`);
  return response.data;
};
