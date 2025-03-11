import React, { useState } from "react";
import axios from "axios";
import { Button, CircularProgress, Typography, Card, CardContent } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import "./FoodScanner.css"; 

const Foodscanner = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file)); 
    setError(""); 
  };

  const handleUpload = async () => {
    if (!image) return setError("⚠️ Please upload an image first.");
    
    setLoading(true);
    setResult(null);
    setError("");

    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await axios.post("http://127.0.0.1:8000/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(response.data);
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("❌ Failed to analyze image. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="food-scanner-container">
      <Card className="scanner-card">
        <CardContent>
          <Typography variant="h4" className="title">🍔 Food Scanner</Typography>

          <input
            type="file"
            id="upload-input"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
          
          <label htmlFor="upload-input">
            <Button variant="contained" component="span" startIcon={<UploadFileIcon />} className="upload-btn">
              Choose Image
            </Button>
          </label>

          {preview && <img src={preview} alt="Preview" className="preview-image" />}

          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<CloudUploadIcon />} 
            onClick={handleUpload} 
            disabled={loading} 
            className="scan-btn"
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Scan Food"}
          </Button>

          {error && <Typography variant="body1" className="error">{error}</Typography>}

          {result && (
            <div className="result-section">
              <Typography variant="h5">🍽️ Detected: {result.food}</Typography>
              <Typography variant="h6">🔍 Confidence: {(result.confidence * 100).toFixed(2)}%</Typography>
              <Typography variant="h6">📜 Recipe: {result.recipe?.title}</Typography>

              {result.recipe?.ingredients && (
                <>
                  <Typography variant="h6">🛒 Ingredients:</Typography>
                  <ul>
                    {result.recipe.ingredients.map((ing, index) => (
                      <li key={index}>{ing}</li>
                    ))}
                  </ul>
                </>
              )}

              {result.recipe?.instructions && (
                <>
                  <Typography variant="h6">👨‍🍳 Instructions:</Typography>
                  <div dangerouslySetInnerHTML={{ __html: result.recipe.instructions }} />
                </>
              )}

              {/* YouTube Video Button */}
              {result.recipe?.video_url && (
                <Button 
                  variant="contained" 
                  color="secondary" 
                  startIcon={<PlayCircleOutlineIcon />} 
                  className="video-btn"
                  href={result.recipe.video_url} 
                  target="_blank"
                >
                  Watch Recipe Video
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Foodscanner;
