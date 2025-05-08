from fastapi import FastAPI, File, UploadFile
import requests
from fastapi.middleware.cors import CORSMiddleware
from fastai.vision.all import load_learner, PILImage
import io
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load trained FastAI model
MODEL_PATH = "food101_resnet50.pkl"
learn = load_learner(MODEL_PATH)

# API Setup
app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://kuriouschef.netlify.app", "http://localhost:5173"],  # Allow both deployed and local frontend
    allow_credentials=True,
    allow_methods=["POST", "GET"],  # Add GET if needed
    allow_headers=["*"],
)

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    try:
        image = PILImage.create(io.BytesIO(await file.read()))
        pred, pred_idx, probs = learn.predict(image)
        confidence = probs[pred_idx].item()

        # Fetch detailed recipe
        recipe = get_recipe(pred)

        return {
            "food": pred,
            "confidence": confidence,
            "recipe": recipe  # Now includes ingredients & instructions
        }

    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")
        return {"error": str(e)}

def get_recipe(food_name):
    API_KEY = "631edc75f6674cb6af453dc2ca33e0a8"  # Spoonacular API Key

    # Step 1: Find a Recipe ID
    search_url = f"https://api.spoonacular.com/recipes/complexSearch?query={food_name}&apiKey={API_KEY}"
    
    try:
        search_response = requests.get(search_url).json()
        
        if "results" in search_response and search_response["results"]:
            recipe_id = search_response["results"][0]["id"]  # Extract recipe ID

            # Step 2: Get Recipe Details (ingredients, instructions)
            details_url = f"https://api.spoonacular.com/recipes/{recipe_id}/information?apiKey={API_KEY}&includeNutrition=false"
            details_response = requests.get(details_url).json()

            # Extract relevant details
            title = details_response["title"]
            ingredients = [ingredient["original"] for ingredient in details_response["extendedIngredients"]]
            instructions = details_response["instructions"] or "No instructions available."

            return {
                "title": title,
                "ingredients": ingredients,
                "instructions": instructions
            }

        logger.error("No recipe found for the given food name.")
        return {"error": "No recipe found."}

    except Exception as e:
        logger.error(f"API Error: {str(e)}")
        return {"error": f"API Error: {str(e)}"}

# Run server: uvicorn backend:app --reloadfrom fastapi import FastAPI, File, UploadFile
import requests
from fastapi.middleware.cors import CORSMiddleware
from fastai.vision.all import load_learner, PILImage
import io

# Load trained FastAI model
MODEL_PATH = "food101_resnet50.pkl"
learn = load_learner(MODEL_PATH)

# API Setup
app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://kuriouschef.netlify.app", "http://localhost:5173"],  # Allow both deployed and local frontend
    allow_credentials=True,
    allow_methods=["POST", "GET"],  # Add GET if needed
    allow_headers=["*"],
)

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    try:
        image = PILImage.create(io.BytesIO(await file.read()))
        pred, pred_idx, probs = learn.predict(image)
        confidence = probs[pred_idx].item()

        # Fetch detailed recipe
        recipe = get_recipe(pred)

        return {
            "food": pred,
            "confidence": confidence,
            "recipe": recipe  # Now includes ingredients & instructions
        }

    except Exception as e:
        return {"error": str(e)}


def get_recipe(food_name):
    API_KEY = "631edc75f6674cb6af453dc2ca33e0a8"  # Spoonacular API Key

    # Step 1: Find a Recipe ID
    search_url = f"https://api.spoonacular.com/recipes/complexSearch?query={food_name}&apiKey={API_KEY}"
    
    try:
        search_response = requests.get(search_url).json()
        
        if "results" in search_response and search_response["results"]:
            recipe_id = search_response["results"][0]["id"]  # Extract recipe ID

            # Step 2: Get Recipe Details (ingredients, instructions)
            details_url = f"https://api.spoonacular.com/recipes/{recipe_id}/information?apiKey={API_KEY}&includeNutrition=false"
            details_response = requests.get(details_url).json()

            # Extract relevant details
            title = details_response["title"]
            ingredients = [ingredient["original"] for ingredient in details_response["extendedIngredients"]]
            instructions = details_response["instructions"] or "No instructions available."

            return {
                "title": title,
                "ingredients": ingredients,
                "instructions": instructions
            }

        return {"error": "No recipe found."}

    except Exception as e:
        return {"error": f"API Error: {str(e)}"}

# Run server: uvicorn backend:app --reload
