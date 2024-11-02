import json
import os
import re
import ijson
from decimal import Decimal

def sanitize_filename(filename):
    """Sanitize filename by removing non-alphanumeric characters and truncating if necessary."""
    return re.sub(r'[^\w\-_\.]', '_', filename)[:50]  # Limit filename length for safety

class DecimalEncoder(json.JSONEncoder):
    """Custom JSON encoder that converts Decimal objects to float."""
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return super().default(obj)

def save_json(data, output_file):
    """Save the data to a JSON file using DecimalEncoder for Decimal values."""
    with open(output_file, 'w', encoding='utf-8') as file:
        json.dump(data, file, indent=4, cls=DecimalEncoder)

def clean_data(data_file, image_folder, output_file):
    """Filter out entries with errors in the embed_image field and delete corresponding images."""
    cleaned_data = {"data": []}

    # Stream the large JSON file with ijson
    with open(data_file, 'r', encoding='utf-8') as file:
        # Parse JSON items in "data" array one by one
        for item in ijson.items(file, "data.item"):
            embed_image = item.get("embed_image", None)
            parent_asin = item.get("parent_asin", "unknown")
            title = item.get("title", "unknown")

            # Check if embed_image is None or an empty list, consider it an error and delete the image
            if not embed_image:
                title_snippet = sanitize_filename(title)
                image_filename = f"{parent_asin}_{title_snippet}.jpg"
                image_path = os.path.join(image_folder, image_filename)

                # Delete the image file if it exists
                if os.path.exists(image_path):
                    os.remove(image_path)
                    print(f"Deleted image: {image_path}")
                else:
                    print(f"Image not found, skipping delete: {image_path}")
            else:
                # If embed_image is valid, add entry to cleaned data
                cleaned_data["data"].append(item)

    # Save the cleaned data to a new JSON file using DecimalEncoder
    save_json(cleaned_data, output_file)
    print(f"Cleaned data saved to {output_file}")

# Parameters
data_file = "../data/reconstructed_All_Beauty_with_embeddings.json"
image_folder = "../data/images"
output_file = "../data/cleaned_data.json"

# Run the cleaning function
clean_data(data_file, image_folder, output_file)
