import json
import torch
from FlagEmbedding.visual.modeling import Visualized_BGE
import os
from tqdm import tqdm
from glob import glob
import re
from concurrent.futures import ThreadPoolExecutor, as_completed

class Encoder:
    def __init__(self, model_name: str, model_path: str):
        self.model = Visualized_BGE(model_name_bge=model_name, model_weight=model_path)
        self.model.eval()

    def encode_image(self, image_path: str) -> list[float]:
        with torch.no_grad():
            query_emb = self.model.encode(image=image_path)
        return query_emb.tolist()[0]

def sanitize_filename(filename):
    """Sanitize filename by removing non-alphanumeric characters and truncating if necessary."""
    return re.sub(r'[^\w\-_\.]', '_', filename)[:50]  # Limit filename length for safety

def load_json(file_path):
    """Load a JSON file and return its contents."""
    with open(file_path, 'r', encoding='utf-8') as file:
        return json.load(file)

def save_json(data, output_file):
    """Save the data to a JSON file."""
    with open(output_file, 'w', encoding='utf-8') as file:
        json.dump(data, file, indent=4)

def embed_image_task(encoder, image_path):
    """Generate an embedding for a single image."""
    try:
        embedding = encoder.encode_image(image_path)
        return os.path.basename(image_path), embedding
    except Exception as e:
        print(f"Failed to generate embedding for {image_path}. Error: {e}")
        return os.path.basename(image_path), None

def generate_image_embeddings(data_file, image_folder, model_name, model_path, output_file, max_workers=4):
    # Load JSON data
    data = load_json(data_file)
    
    # Initialize encoder model
    encoder = Encoder(model_name, model_path)
    
    # Get list of image files
    image_files = glob(os.path.join(image_folder, "*.jpg"))
    image_dict = {}

    # Use ThreadPoolExecutor for concurrent processing
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        # Submit tasks to the executor
        futures = {executor.submit(embed_image_task, encoder, image_path): image_path for image_path in image_files}

        # Track progress with tqdm
        for future in tqdm(as_completed(futures), total=len(futures), desc="Generating image embeddings"):
            image_filename, embedding = future.result()
            if embedding is not None:
                image_dict[image_filename] = embedding

    # Embed images into corresponding JSON entries
    for item in data.get("data", []):
        parent_asin = item.get("parent_asin", "unknown")
        title = item.get("title", "unknown")
        
        # Generate the image filename based on `parent_asin` and sanitized title snippet
        title_snippet = sanitize_filename(title)
        image_filename = f"{parent_asin}_{title_snippet}.jpg"
        
        # Add embedding if the image exists in `image_dict`
        item["embed_image"] = image_dict.get(image_filename, None)
    
    # Save updated data with embeddings added
    save_json(data, output_file)
    print(f"Updated data with embeddings saved to {output_file}")

# Parameters
data_file = "../data/reconstructed_All_Beauty.json"
image_folder = "../data/images"
model_name = "BAAI/bge-base-en-v1.5"
model_path = "../models/Visualized_base_en_v1.5.pth"
output_file = "../data/reconstructed_All_Beauty_with_embeddings.json"

# Run the function
generate_image_embeddings(data_file, image_folder, model_name, model_path, output_file)
