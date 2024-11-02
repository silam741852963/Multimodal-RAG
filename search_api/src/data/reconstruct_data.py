import json

def load_jsonl(file_path):
    """Load a JSONL file into a list of dictionaries."""
    data = []
    with open(file_path, 'r', encoding='utf-8') as file:
        for line in file:
            data.append(json.loads(line.strip()))
    return data

def save_json(data, output_file):
    """Save the data to a JSON file."""
    with open(output_file, 'w', encoding='utf-8') as file:
        json.dump(data, file, indent=4)

def safe_truncate(value, max_length):
    """Safely truncate a string value to the specified max length."""
    if value is None:
        return None
    return value[:max_length]

def safe_list_truncate(data_list, max_size):
    """Safely truncate a list to the specified max size."""
    if data_list is None:
        return []
    return data_list[:max_size]

def reconstruct_data(linked_data):
    """Reconstruct the linked data into the desired format."""
    transformed_data = {
        "collectionName": "AmazonProduct",
        "data": []
    }

    for entry in linked_data:
        product_metadata = entry.get("product_metadata", {})
        reviews = entry.get("reviews", [])

        # Transform and truncate data to fit the constraints
        transformed_entry = {
            "embed_image": None,  # Placeholder for 768-D float vector
            "main_category": safe_truncate(product_metadata.get("main_category"), 50),  # VARCHAR(50)
            "title": safe_truncate(product_metadata.get("title"), 200),  # VARCHAR(200)
            "average_rating": float(product_metadata.get("average_rating", 0)),  # FLOAT
            "rating_number": int(product_metadata.get("rating_number", 0)),  # INT32
            "features": safe_list_truncate(product_metadata.get("features", []), 30),  # Array<VARCHAR(200)>[30]
            "description": safe_list_truncate(product_metadata.get("description", []), 30),  # Array<VARCHAR(200)>[30]
            "images_thumb": safe_list_truncate(
                [img.get("thumb") for img in product_metadata.get("images", [])], 10
            ),  # Array<VARCHAR(100)>[10]
            "images_large": safe_list_truncate(
                [img.get("large") for img in product_metadata.get("images", [])], 10
            ),  # Array<VARCHAR(100)>[10]
            "store": safe_truncate(product_metadata.get("store"), 100),  # VARCHAR(100)
            "parent_asin": safe_truncate(product_metadata.get("parent_asin"), 15),  # VARCHAR(15)
            "reviews_title": safe_list_truncate([safe_truncate(review.get("title"), 100) for review in reviews], 5),  # Array<VARCHAR(100)>[5]
            "reviews_text": safe_list_truncate([safe_truncate(review.get("text"), 1000) for review in reviews], 5),  # Array<VARCHAR(1000)>[5]
            "reviews_rating": safe_list_truncate([float(review.get("rating", 0)) for review in reviews], 5),  # Array<FLOAT>[5]
            "reviews_timestamp": safe_list_truncate([int(review.get("timestamp", 0)) for review in reviews], 5),  # Array<INT64>[5]
            "reviews_verified_purchase": safe_list_truncate([review.get("verified_purchase", False) for review in reviews], 5),  # Array<BOOL>[5]
            "reviews_helpful_vote": safe_list_truncate([int(review.get("helpful_vote", 0)) for review in reviews], 5)  # Array<INT32>[5]
        }

        # Add the transformed entry to the final dataset
        transformed_data["data"].append(transformed_entry)

    return transformed_data

# Load the linked data from JSONL
linked_data_file = "../data/linked_All_Beauty.jsonl"
linked_data = load_jsonl(linked_data_file)

# Reconstruct the data
reconstructed_data = reconstruct_data(linked_data)

# Save the reconstructed data to a new JSON file
output_file = "../data/reconstructed_data.json"
save_json(reconstructed_data, output_file)

print(f"Reconstructed data saved to {output_file}")
