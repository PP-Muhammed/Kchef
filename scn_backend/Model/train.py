from fastai.vision.all import *
from pathlib import Path
import torch

def train():
    # Ensure GPU is used
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    # Print GPU message only once
    if torch.cuda.is_available():
        print(f"Using GPU: {torch.cuda.get_device_name(0)}")

    # Define dataset path
    path = Path("C:/Users/muzam/Desktop/fs/backend/data/food-101")

    # Create DataLoaders with optimizations
    dls = ImageDataLoaders.from_folder(
        path, valid_pct=0.2, item_tfms=Resize(224),
        bs=32, num_workers=0  # Set num_workers=0 to avoid multiprocessing issues
    ).to(device)

    # Load model and move it to GPU
    learn = vision_learner(dls, resnet50, metrics=error_rate).to_fp16()
    learn.model = learn.model.to(device)

    # Try loading checkpoint if available
    try:
        learn.load('food101_checkpoint')
        print("Checkpoint loaded. Resuming training...")
    except:
        print("No checkpoint found. Starting training from scratch...")

    # 🔧 Avoid NaN issues by setting a valid learning rate
    learn.lr_find()
    learn.fine_tune(5, base_lr=3e-3)

    # Save checkpoint after training
    learn.save('food101_checkpoint')
    print("Checkpoint saved successfully!")

    # Save final trained model
    learn.export('food101_resnet50.pkl')
    print("Model saved successfully!")

# ✅ Use this to fix multiprocessing error on Windows
if __name__ == '__main__':
    train()
