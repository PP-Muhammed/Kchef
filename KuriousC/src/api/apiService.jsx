// src/api/apiService.js

import axios from "axios";

// Spoonacular API base URL and your API key
const API_BASE_URL = "https://api.spoonacular.com/recipes";
const API_KEY = "631edc75f6674cb6af453dc2ca33e0a8";

// Fetch recipes by a query (e.g., "tea", "lunch", "dinner")
export const searchRecipes = async (query) => {
  const response = await axios.get(
    `${API_BASE_URL}/complexSearch?query=${query}&apiKey=${API_KEY}`
  );
  return response.data.results;
};

// Fetch recipe details by ID
export const fetchRecipeDetails = async (id) => {
  const response = await axios.get(
    `${API_BASE_URL}/${id}/information?apiKey=${API_KEY}`
  );
  return response.data;
};