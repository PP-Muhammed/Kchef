import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";
import Navbar from "./components/Navbar";
import "./App.css";
import Logo from "./components/Logo";
import MealSection from "./components/MealSection";
import Breakfast from "./pages/Breakfast";
import Lunch from "./pages/Lunch";
import Tea from "./pages/Tea";
import Dinner from "./pages/Dinner";
import Search from "./pages/Search";
import breakfastImg from "./assets/breakfast.jpg";
import lunchImg from "./assets/lunch.jpeg";
import dinnerImg from "./assets/dinner.jpg";
import teaImg from "./assets/teatime.jpeg";
import Saved from "./pages/Saved";
import chatbotIcon from "./assets/chat-bot.png"; // Import the chatbot icon
import Chatbot from "./pages/Chatbot";
import Foodscanner from "./pages/Foodscanner";

const App = () => {
  useEffect(() => {
    Aos.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const meals = [
    {
      title: "BREAKFAST",
      description:
        "Breakfast is the first meal of the day, providing essential energy and nutrients after an overnight fast. It supports metabolism, enhances focus, and sets a positive tone for the day.",
      imageSrc: breakfastImg,
      animation: "fade-up",
    },
    {
      title: "LUNCH",
      description:
        "Lunch is the mid-day meal that replenishes energy and sustains productivity during the day. It includes a balance of carbohydrates, proteins, and vegetables.",
      imageSrc: lunchImg,
      animation: "fade-up",
      reverse: true,
    },
    {
      title: "TEA",
      description:
        "Tea serves as a refreshing pause and is typically paired with snacks like biscuits, sandwiches, or pastries. Snacks are small portions of food consumed between meals, providing quick energy and satisfying hunger.",
      imageSrc: teaImg,
      animation: "fade-up",
    },
    {
      title: "DINNER",
      description:
        "Dinner includes a variety of dishes, such as proteins, vegetables, and grains, tailored to individual or cultural preferences. Dinner is also a time for family or social gatherings in many traditions.",
      imageSrc: dinnerImg,
      animation: "fade-up",
      reverse: true,
    },
  ];

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Logo />
        <Routes>
          <Route
            path="/"
            element={
              <>
                {meals.map((meal, index) => (
                  <MealSection
                    key={index}
                    title={meal.title}
                    description={meal.description}
                    imageSrc={meal.imageSrc}
                    reverse={meal.reverse}
                    animation={meal.animation}
                  />
                ))}
              </>
            }
          />
          <Route path="/breakfast" element={<Breakfast />} />
          <Route path="/lunch" element={<Lunch />} />
          <Route path="/tea" element={<Tea />} />
          <Route path="/dinner" element={<Dinner />} />
          <Route path="/search" element={<Search />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/chatbot" element={<Chatbot/>} />
          <Route path="/foodscanner" element={<Foodscanner/>} />
        </Routes>
        <ChatbotIcon /> {/* Add Chatbot Icon */}
      </div>
    </Router>
  );
};

const ChatbotIcon = () => {
  const navigate = useNavigate();

  const handleChatbotClick = () => {
    navigate("/chatbot"); // Redirect to chatbot page
  };

  return (
    <div className="chatbot-icon" onClick={handleChatbotClick}>
      <img src={chatbotIcon} alt="Chatbot Icon" />
    </div>
  );
};

export default App;