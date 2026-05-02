import API from "./api";

// Get all motivation quotes
export const getQuotes = async () => {
  const response = await API.get("/quotes");
  return response.data;
};

// Get a random motivation quote
export const getRandomQuote = async () => {
  const response = await API.get("/quotes/random");
  return response.data;
};

// Create a new quote
export const createQuote = async (quoteData) => {
  const response = await API.post("/quotes", quoteData);
  return response.data;
};
