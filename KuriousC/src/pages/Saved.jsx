import React, { useState } from "react";
import { useSaved } from "../context/Savedcontext";
import { fetchRecipeDetails } from "../api/apiService";
import "./MealPage.css";
import FoodDetailModal from "../components/FoodDetailModal";

const Saved = () => {
  const { savedItems, removeItem } = useSaved();
  const [selectedFood, setSelectedFood] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = async (id) => {
    try {
      const details = await fetchRecipeDetails(id); // Fetch details for the saved item
      setSelectedFood(details);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching recipe details:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFood(null);
  };

  return (
    <div className="meal-page">
      <h1>Saved Recipes</h1>
      {savedItems.length === 0 ? (
        <p>No items saved yet!</p>
      ) : (
        <div className="food-grid">
          {savedItems.map((item) => (
            <div key={item.id} className="food-card">
              <img src={item.image} alt={item.title} />
              <h3>{item.title}</h3>
              <div className="button-group">
                <button
                  style={{ marginRight: "10px" }}
                  onClick={() => handleViewDetails(item.id)}
                >
                  View Details
                </button>
                <button onClick={() => removeItem(item.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {isModalOpen && selectedFood && (
        <FoodDetailModal food={selectedFood} onClose={closeModal} />
      )}
    </div>
  );
};

export default Saved;