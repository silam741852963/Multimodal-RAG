import json
import os
import ijson
from decimal import Decimal

def convert_decimal(obj):
    """Recursively convert Decimal objects to float within a JSON-like object."""
    if isinstance(obj, list):
        return [convert_decimal(item) for item in obj]
    elif isinstance(obj, dict):
        return {key: convert_decimal(value) for key, value in obj.items()}
    elif isinstance(obj, Decimal):
        return float(obj)
    return obj

def save_json(data, output_file):
    """Save a JSON file."""
    with open(output_file, 'w', encoding='utf-8') as file:
        json.dump(data, file, indent=4)

def chunk_json(data_file, output_folder, chunk_size_mb=5):
    """
    Split JSON data into smaller chunks for easier HTTP transmission.
    
    :param data_file: Path to the JSON file to be chunked.
    :param output_folder: Directory to save the chunked JSON files.
    :param chunk_size_mb: Maximum size (in MB) for each chunk file.
    """
    # Convert chunk size to bytes
    estimated_chunk_size = chunk_size_mb * 1024 * 1024  # Convert MB to bytes
    chunked_data = []
    chunk_index = 1
    current_size = 0
    
    # Make sure the output directory exists
    os.makedirs(output_folder, exist_ok=True)
    
    # Stream JSON items from the data file
    with open(data_file, 'r', encoding='utf-8') as file:
        # Parse JSON items in the "data" array one by one
        for item in ijson.items(file, "data.item"):
            # Convert Decimal values to float within the item
            item = convert_decimal(item)
            
            # Estimate size of the current item by encoding it to JSON
            item_size = len(json.dumps(item).encode('utf-8'))
            
            # If adding the item would exceed the chunk size, save the current chunk
            if current_size + item_size > estimated_chunk_size:
                # Save current chunk
                chunk_filename = os.path.join(output_folder, f"cleaned_data_chunk_{chunk_index}.json")
                save_json({"data": chunked_data}, chunk_filename)
                print(f"Saved chunk {chunk_index} with approximately {current_size / (1024 * 1024):.2f} MB.")
                
                # Reset for the next chunk
                chunked_data = []
                current_size = 0
                chunk_index += 1
            
            # Add item to the current chunk
            chunked_data.append(item)
            current_size += item_size

    # Save any remaining data as the last chunk
    if chunked_data:
        chunk_filename = os.path.join(output_folder, f"cleaned_data_chunk_{chunk_index}.json")
        save_json({"data": chunked_data}, chunk_filename)
        print(f"Saved chunk {chunk_index} with approximately {current_size / (1024 * 1024):.2f} MB.")

# Parameters
data_file = "../data/cleaned_All_Beauty.json"
output_folder = "../data/chunked_data"
chunk_size_mb = 5  # Define chunk size in MB

# Run the chunking function
chunk_json(data_file, output_folder, chunk_size_mb)
