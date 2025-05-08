from fastai.vision.all import *
from pathlib import Path

# Load trained model
learn = load_learner("C:/Users/muzam/Desktop/fs/backend/data/food-101/models/food101_resnet50.pkl")

# Function to predict image class
def predict_image(img_path):
    pred, pred_idx, probs = learn.predict(img_path)
    return {"prediction": pred, "confidence": probs[pred_idx].item()}

# Test the model
if __name__ == '__main__':
    test_image = "./1084.jpg"  # Change path
    result = predict_image(test_image)
    print(result)