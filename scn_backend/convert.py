from fastai.vision.all import *
import torch

# Load FastAI model
learner = load_learner("food101_resnet50.pkl")

# Save as PyTorch state_dict
torch.save(learner.model.state_dict(), "food101_resnet50_converted.pth")

print("Model converted successfully!")