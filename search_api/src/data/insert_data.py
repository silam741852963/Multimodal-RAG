import json
import http.client
import os
import time
import ssl
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Retrieve connection details from environment variables
ZILLIZ_HOST = os.getenv("ZILLIZ_HOST")
ZILLIZ_API_KEY = os.getenv("ZILLIZ_API_KEY")
ZILLIZ_ENDPOINT = os.getenv("ZILLIZ_INSERT_ENDPOINT")
ZILLIZ_COLLECTION = os.getenv("ZILLIZ_COLLECTION")

# Headers for HTTP requests
headers = {
    'Authorization': f"Bearer {ZILLIZ_API_KEY}",
    'Accept': "application/json",
    'Content-Type': "application/json"
}

def send_chunk_to_db(chunk_data):
    """Send a JSON chunk to the database with retry and error handling."""
    payload = json.dumps({
        "collectionName": ZILLIZ_COLLECTION,
        "data": chunk_data["data"]
    })
    
    attempts = 0
    max_attempts = 3
    while attempts < max_attempts:
        try:
            # Set up connection for each attempt
            conn = http.client.HTTPSConnection(ZILLIZ_HOST, timeout=30)
            conn.request("POST", ZILLIZ_ENDPOINT, payload, headers)
            res = conn.getresponse()
            data = res.read()
            
            # Log response status
            print(f"Status: {res.status}, Response: {data.decode('utf-8')}")
            conn.close()
            break  # Exit retry loop on success
        except (http.client.HTTPException, ssl.SSLEOFError) as e:
            print(f"Error sending chunk: {e}")
            attempts += 1
            time.sleep(2)  # Wait before retrying
            conn.close()
            if attempts == max_attempts:
                print("Failed to send chunk after multiple attempts.")
        except Exception as e:
            print(f"Unexpected error: {e}")
            break  # Exit loop for unexpected errors

def process_chunks(input_folder):
    """Read each JSON chunk file and send it to the database."""
    chunk_files = sorted([f for f in os.listdir(input_folder) if f.endswith('.json')])
    
    for chunk_file in chunk_files:
        chunk_path = os.path.join(input_folder, chunk_file)
        
        # Read the chunk file
        with open(chunk_path, 'r', encoding='utf-8') as file:
            chunk_data = json.load(file)
        
        # Send the chunk data to the database
        print(f"Sending {chunk_file} to the database...")
        send_chunk_to_db(chunk_data)
        print(f"{chunk_file} processed successfully.")

# Path to the folder containing the chunked JSON files
input_folder = "../data/chunked_data"

# Process and send each chunk to the database
process_chunks(input_folder)
