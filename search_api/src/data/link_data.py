import json
from collections import defaultdict

def load_jsonl(file_path):
    """Load a JSONL file into a list of dictionaries."""
    data = []
    with open(file_path, 'r', encoding='utf-8') as file:
        for line in file:
            data.append(json.loads(line.strip()))
    return data

def save_jsonl(data, file_path):
    """Save a list of dictionaries to a JSONL file."""
    with open(file_path, 'w', encoding='utf-8') as file:
        for entry in data:
            file.write(json.dumps(entry) + '\n')

def link_data(metadata_file, reviews_file, output_file):
    # Load data from both files
    metadata = load_jsonl(metadata_file)
    reviews = load_jsonl(reviews_file)

    # Create a lookup dictionary for metadata using 'parent_asin'
    metadata_lookup = {item["parent_asin"]: item for item in metadata}

    # Create a defaultdict to store reviews grouped by 'parent_asin'
    grouped_reviews = defaultdict(list)
    for review in reviews:
        parent_asin = review.get("parent_asin")
        grouped_reviews[parent_asin].append(review)

    # Link the reviews with their corresponding metadata
    linked_data = []
    for parent_asin, product_metadata in metadata_lookup.items():
        linked_entry = {
            "product_metadata": product_metadata,
            "reviews": grouped_reviews.get(parent_asin, [])
        }
        linked_data.append(linked_entry)

    # Save the linked data to a new JSONL file
    save_jsonl(linked_data, output_file)
    print(f"Linked data saved to {output_file}")

# File paths
metadata_file = "../data/meta_All_Beauty.jsonl"
reviews_file = "../data/All_Beauty.jsonl"
output_file = "../data/linked_All_Beauty.jsonl"

# Run the linking function
link_data(metadata_file, reviews_file, output_file)
