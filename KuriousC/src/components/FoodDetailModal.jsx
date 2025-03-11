// src/components/FoodDetailModal.jsx
import React from "react";
import "./FoodDetailModal.css";

const FoodDetailModal = ({ food, onClose }) => {
  if (!food) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // Prevent closing modal on inner click
      >
        <span className="close-button" onClick={onClose}>
          &times;
        </span>
        <h2>{food.title}</h2>
        <img src={food.image} alt={food.title} />
        <h3>Calories:</h3>
        <p>
          {food.nutrition?.nutrients?.find((n) => n.name === "Calories")?.amount
            ? `${food.nutrition.nutrients.find((n) => n.name === "Calories").amount} kcal`
            : "Calories information not available."}
        </p>
        <h3>Ingredients:</h3>
        <ul>
          {food.extendedIngredients.map((ingredient, index) => (
            <li key={index}>{ingredient.original}</li>
          ))}
        </ul>
        <h3>Instructions:</h3>
        <p>{food.instructions || "No instructions available."}</p>
        {food.sourceUrl && (
          <div>
            <h3>Source:</h3>
            <a href={food.sourceUrl} target="_blank" rel="noopener noreferrer">
              View Full Recipe
            </a>
          </div>
        )}
        {food.videoLink && (
          <div>
            <h3>Video Tutorial:</h3>
            <a href={food.videoLink} target="_blank" rel="noopener noreferrer">
              Watch Preparation Video
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodDetailModal;