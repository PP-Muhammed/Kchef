import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { searchRecipes, fetchRecipeDetails } from "../api/apiService";
import { useSaved } from "../context/Savedcontext";
import FoodDetailModal from "../components/FoodDetailModal";
import "./Search.css"; // Include a CSS file specific to search styles

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [calories, setCalories] = useState(3000);
  const [time, setTime] = useState(180);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { savedItems, addItem } = useSaved();

  const suggestions = ["Burger", "Pizza", "Biriyani", "Pasta", "Cake"];

  const fetchRecipes = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const recipes = await searchRecipes(query);
      const filteredRecipes = recipes.filter(
        (item) =>
          (item.nutrition?.calories || 3000) <= calories &&
          (item.readyInMinutes || 180) <= time
      );
      setResults(filteredRecipes);
      setShowFilters(true);
    } catch (err) {
      setError("Failed to fetch recipes. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      fetchRecipes(searchTerm);
    }
  };

  const handleSuggestionClick = (term) => {
    setSearchTerm(term);
    fetchRecipes(term);
  };

  const handleFoodClick = async (id) => {
    try {
      const details = await fetchRecipeDetails(id);
      setSelectedFood(details);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Error fetching recipe details:", err);
    }
  };

  const handleSave = (food) => {
    const isAlreadySaved = savedItems.some((item) => item.id === food.id);
    if (!isAlreadySaved) {
      addItem(food);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFood(null);
  };

  return (
    <div className="search-page">
      {/* <h1>KURIOUSCHEF</h1> */}

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by ingredients / food"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button className="search-button" onClick={handleSearch}>
          <FaSearch size={20} />
        </button>
      </div>

      {/* Suggestions */}
      <div className="suggestions">
        {suggestions.map((item, index) => (
          <button
            key={index}
            className="suggestion-button"
            onClick={() => handleSuggestionClick(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && <p>Loading recipes...</p>}

      {/* Error State */}
      {error && <p className="error-message">{error}</p>}

      {/* Filter Sidebar */}
      {/* {showFilters && (
        <div className="filter-sidebar">
          <h3>Filter</h3>
          <div className="slider-container">
            <label>Calories: {calories} kcal</label>
            <input
              type="range"
              min="0"
              max="3000"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
            />
          </div>
          <div className="slider-container">
            <label>Cook Time: {time} mins</label>
            <input
              type="range"
              min="0"
              max="180"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>
      )} */}

      {/* Results Section */}
      <div className="food-grid">
        {results.length > 0 ? (
          results.map((recipe) => (
            <div key={recipe.id} className="food-card">
              <img
                src={recipe.image || "https://via.placeholder.com/150"}
                alt={recipe.title}
              />
              <h3>{recipe.title}</h3>
              <p>Calories: {recipe.nutrition?.calories || "N/A"}</p>
              <p>Cook Time: {recipe.readyInMinutes || "N/A"} mins</p>
              {recipe.sourceUrl && (
                <a
                  href={recipe.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="prep-video-link"
                >
                  Watch Preparation Video
                </a>
              )}
              <div className="button-group">
                <button
                  onClick={() => handleFoodClick(recipe.id)}
                  className="details-button"
                >
                  Show Details
                </button>
                <button
                  onClick={() => handleSave(recipe)}
                  className="save-button"
                >
                  Save
                </button>
              </div>
            </div>
          ))
        ) : (
          !loading && <p>No results found. Try searching for something else.</p>
        )}
      </div>

      {/* Food Details Modal */}
      {isModalOpen && selectedFood && (
        <FoodDetailModal food={selectedFood} onClose={closeModal} />
      )}
    </div>
  );
};

export default Search;
