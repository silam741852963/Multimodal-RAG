import json
import requests
import os
import re
from concurrent.futures import ThreadPoolExecutor, as_completed

def load_json(file_path):
    """Load a JSON file and return its contents."""
    with open(file_path, 'r', encoding='utf-8') as file:
        return json.load(file)

def save_image(image_url, file_name):
    """Download and save an image from a URL."""
    try:
        response = requests.get(image_url, timeout=10)
        response.raise_for_status()
        with open(file_name, 'wb') as file:
            file.write(response.content)
        print(f"Image successfully downloaded and saved as {file_name}")
    except requests.exceptions.RequestException as e:
        print(f"Failed to download {file_name}: {e}")

def sanitize_filename(filename):
    """Sanitize filename by removing non-alphanumeric characters and truncating if necessary."""
    return re.sub(r'[^\w\-_\.]', '_', filename)[:50]  # Limit filename length for safety

def download_image_task(item, output_folder):
    """Download the first large image for a single product item."""
    parent_asin = item.get("parent_asin", "unknown")
    title = item.get("title", "unknown")

    # Get the first large image URL, if available
    images_large = item.get("images_large", [])
    if images_large:
        image_url = images_large[0]
        # Generate a meaningful filename
        title_snippet = sanitize_filename(title)  # Sanitize title for filename
        file_name = f"{output_folder}/{parent_asin}_{title_snippet}.jpg"
        
        # Download the image
        save_image(image_url, file_name)
    else:
        print(f"No large image found for product {parent_asin}")

def download_images(data_file, output_folder="../data/images", max_workers=10):
    """Download images for each product in the JSON data using multithreading."""
    # Load JSON data
    data = load_json(data_file)
    
    # Create output directory if it doesn't exist
    os.makedirs(output_folder, exist_ok=True)

    # Using ThreadPoolExecutor for concurrent downloads
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        # Submit a download task for each item
        futures = [executor.submit(download_image_task, item, output_folder) for item in data.get("data", [])]
        
        # Track completion of tasks
        for future in as_completed(futures):
            future.result()  # Will raise any exceptions caught during the download

# File path to reconstructed data
data_file = "../data/reconstructed_All_Beauty.json"

# Run the download function with multithreading
download_images(data_file)
