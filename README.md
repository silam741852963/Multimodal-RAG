# Multimodal-RAG

This repository contains a multimodal retrieval-augmented generation (RAG) project utilizing text and image-based queries for retrieving and displaying products. The backend uses Milvus, a high-performance vector database, to store and query embeddings generated from text and image inputs. The frontend is built with Next.js for a responsive web interface.

## Features
- Multimodal search (text and image) to enhance retrieval accuracy.
- Uses Milvus for vector similarity search.
- Integrated with BAAI's `bge-base-en-v1.5` model for embedding generation.
- Built-in authentication using Kinde for user login.

## Project Structure
- **Backend**: Flask API to handle embedding generation, Milvus integration, and multimodal search.
- **Frontend**: Next.js application providing a responsive UI for search and result display.

## Setup

### 1. Clone the Repository
```bash
git clone https://github.com/silam741852963/Multimodal-RAG.git
cd Multimodal-RAG
```

### 2. Backend Setup (search_api folder)

Install Python dependencies:
```bash
pip install -r requirements.txt
```

Load embedding model:
```bash
git clone https://github.com/FlagOpen/FlagEmbedding.git
pip install -e FlagEmbedding
```
```bash
wget https://huggingface.co/BAAI/bge-visualized/resolve/main/Visualized_base_en_v1.5.pth
```

Environment Variables: Create a .env file in the backend directory with the following content:
```
ZILLIZ_HOST=
ZILLIZ_API_KEY=
ZILLIZ_INSERT_ENDPOINT=
ZILLIZ_COLLECTION=
ZILLIZ_SEARCH_ENDPOINT=
MODEL_NAME="BAAI/bge-base-en-v1.5"
MODEL_PATH=
```

Run the Backend Server:
```bash
python main.py
```

The frontend will start on http://localhost:5000.

### 3. Frontend Setup (multimodal-rag-app folder)

Install Node dependecies:
```bash
npm i --peer-legacy-deps
```

Environment Variables: Create a .env.local file in the frontend directory with the following content:
```
KINDE_CLIENT_ID=
KINDE_CLIENT_SECRET=
KINDE_ISSUER_URL=
KINDE_SITE_URL=http://localhost:3000
KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000
KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/search
```

Build and Start the Frontend:
```bash
npm run build
npm run start
```

The frontend will start on http://localhost:3000.

## Usage

With both backend and frontend running, navigate to http://localhost:3000 in your browser. Log in using Kinde and start performing text and image-based product searches.



