import React, { createContext, useContext, useState, useEffect } from "react";

const SavedContext = createContext();

export const useSaved = () => useContext(SavedContext);

export const SavedProvider = ({ children }) => {
  const [savedItems, setSavedItems] = useState([]);

  // Load saved items from local storage on initialization
  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem("savedItems")) || [];
    setSavedItems(storedItems);
  }, []);

  // Update local storage whenever savedItems changes
  useEffect(() => {
    localStorage.setItem("savedItems", JSON.stringify(savedItems));
  }, [savedItems]);

  const addItem = (item) => {
    if (!savedItems.find((savedItem) => savedItem.id === item.id)) {
      setSavedItems((prev) => [...prev, item]);
    }
  };

  const removeItem = (id) => {
    setSavedItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <SavedContext.Provider value={{ savedItems, addItem, removeItem }}>
      {children}
    </SavedContext.Provider>
  );
};