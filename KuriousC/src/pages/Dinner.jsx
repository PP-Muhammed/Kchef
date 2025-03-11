// src/pages/Dinner.jsx
import React, { useEffect, useState } from "react";
import { searchRecipes, fetchRecipeDetails } from "../api/apiService";
import "./MealPage.css";
import FoodDetailModal from "../components/FoodDetailModal";
import { useSaved } from "../context/Savedcontext";

const Dinner = () => {
  const [foods, setFoods] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { savedItems, addItem, removeItem } = useSaved();

  useEffect(() => {
    const fetchDinnerRecipes = async () => {
      try {
        const recipes = await searchRecipes("dinner"); // Use "dinner" as the search query
        setFoods(recipes);
      } catch (error) {
        console.error("Error fetching dinner recipes:", error);
      }
    };

    fetchDinnerRecipes();
  }, []);

  const handleFoodClick = async (id) => {
    try {
      const details = await fetchRecipeDetails(id);
      details.videoLink = `https://www.youtube.com/results?search_query=${details.title}+recipe`;
      setSelectedFood(details);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching recipe details:", error);
    }
  };

  const handleToggleSave = (food) => {
    const isAlreadySaved = savedItems.some((item) => item.id === food.id);
    if (isAlreadySaved) {
      removeItem(food.id);
    } else {
      addItem(food);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFood(null);
  };

  return (
    <div className="meal-page">
      <h1>Dinner Items</h1>
      <div className="food-grid">
        {foods.map((food) => {
          const isSaved = savedItems.some((item) => item.id === food.id);
          return (
            <div key={food.id} className="food-card">
              <img src={food.image} alt={food.title} />
              <h3>{food.title}</h3>
              <div className="button-group">
                <button
                  style={{ marginRight: "10px" }}
                  onClick={() => handleFoodClick(food.id)}
                >
                  View Details
                </button>
                <button onClick={() => handleToggleSave(food)}>
                  {isSaved ? "Saved" : "Save"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {isModalOpen && selectedFood && (
        <FoodDetailModal food={selectedFood} onClose={closeModal} />
      )}
    </div>
  );
};

export default Dinner;