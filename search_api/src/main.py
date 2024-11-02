import os
import json
import torch
from flask import Flask, request, jsonify
from FlagEmbedding.visual.modeling import Visualized_BGE
from dotenv import load_dotenv
import http.client
from werkzeug.utils import secure_filename
from flask_cors import CORS

# Load environment variables
load_dotenv()
ZILLIZ_HOST = os.getenv("ZILLIZ_HOST")
ZILLIZ_API_KEY = os.getenv("ZILLIZ_API_KEY")
ZILLIZ_SEARCH_ENDPOINT = os.getenv("ZILLIZ_SEARCH_ENDPOINT")
MODEL_NAME = os.getenv("MODEL_NAME")
MODEL_PATH = os.getenv("MODEL_PATH")

# Initialize the encoder model
class Encoder:
    def __init__(self, model_name: str, model_path: str):
        self.model = Visualized_BGE(model_name_bge=model_name, model_weight=model_path)
        self.model.eval()

    def encode_query(self, image_path: str, text: str) -> list[float]:
        with torch.no_grad():
            query_emb = self.model.encode(image=image_path, text=text)
        return query_emb.tolist()[0]

encoder = Encoder(MODEL_NAME, MODEL_PATH)

# Initialize the Flask app
app = Flask(__name__)
CORS(app)

def send_query_to_db(query_vec, limit):
    """Send the embedding query to the database with a specified limit."""
    conn = http.client.HTTPSConnection(ZILLIZ_HOST)
    payload = json.dumps({
        "collectionName": "Product",
        "data": [query_vec],
        "limit": limit,
        "outputFields": ["*"]
    })
    headers = {
        'Authorization': f"Bearer {ZILLIZ_API_KEY}",
        'Accept': "application/json",
        'Content-Type': "application/json"
    }
    conn.request("POST", ZILLIZ_SEARCH_ENDPOINT, payload, headers)
    res = conn.getresponse()
    data = res.read()
    conn.close()
    return data.decode("utf-8")

@app.route('/search', methods=['POST'])
def search():
    """API endpoint for searching with an image and text query."""
    if 'image' not in request.files or 'text' not in request.form:
        return jsonify({"error": "Image file and text query are required."}), 400
    
    image = request.files['image']
    query_text = request.form['text']
    
    # Optional limit parameter
    limit = int(request.form.get('limit', 10))  # Default to 10 if limit not provided
    
    # Save the image temporarily
    image_filename = secure_filename(image.filename)
    temp_image_path = os.path.join("temp", image_filename)
    os.makedirs("temp", exist_ok=True)
    image.save(temp_image_path)
    
    # Generate the embedding
    query_vec = encoder.encode_query(image_path=temp_image_path, text=query_text)
    
    # Clean up the temporary file
    os.remove(temp_image_path)
    
    # Send the embedding to the database and get results
    response = send_query_to_db(query_vec, limit)
    
    return jsonify(json.loads(response))

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
