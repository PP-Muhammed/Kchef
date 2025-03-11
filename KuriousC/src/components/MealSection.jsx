// MealSection.jsx
import React, { useEffect, useRef, useState } from "react";
import "./meal.css";
import { Link } from "react-router-dom";

const MealSection = ({ title, description, imageSrc, reverse, animation }) => {
  const [isVisible, setIsVisible] = useState(true);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setTimeout(() => {
            setIsVisible(false);
          }, 100);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className={`meal-section ${title.toLowerCase()} ${
        reverse ? "reverse" : ""
      } ${!isVisible ? "slide-out" : ""}`}
      data-aos={animation}
    >
      <div className="content">
        {!reverse && (
          <img src={imageSrc} alt={title} className="meal-image" />
        )}
        <div className="text">
          <h2>{title}</h2>
          <p>{description}</p>
          <Link to={`/${title.toLowerCase()}`}>
            <button className="view-button">View Items</button>
          </Link>
        </div>
        {reverse && (
          <img src={imageSrc} alt={title} className="meal-image" />
        )}
      </div>
    </div>
  );
};

export default MealSection;