from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import tensorflow as tf
import pickle
import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, SpatialDropout1D, Conv1D, MaxPooling1D, LSTM, Dense, Dropout
from tensorflow.keras.preprocessing.sequence import pad_sequences
import pandas as pd
import random

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- LOAD DATASET ---
try:
    df_anime = pd.read_csv('animes.csv')
    df_anime['score'] = pd.to_numeric(df_anime['score'], errors='coerce')
    df_anime = df_anime.dropna(subset=['score'])    
    print(f"✅ Dataset dimuat: {len(df_anime)} anime tersedia.")
except Exception as e:
    print(f"⚠️ Gagal memuat dataset: {e}")
    df_anime = pd.DataFrame([{"title": "Data Not Found", "score": 0, "genre": "None"}])

def build_and_load_model():
    print("Membangun ulang struktur The Muscle...")
    model = Sequential([
        Embedding(input_dim=15000, output_dim=64, input_length=150),
        SpatialDropout1D(0.2),
        Conv1D(filters=128, kernel_size=5, activation='relu'),
        MaxPooling1D(pool_size=4),
        Dropout(0.2),
        LSTM(64),
        Dense(32, activation='relu'),
        Dropout(0.4),
        Dense(1, activation='linear')
    ])
    
    model.build(input_shape=(None, 150)) 
    
    try:
        model.load_weights('anime_weights.weights.h5')
        with open('tokenizer.pkl', 'rb') as handle:
            tokenizer = pickle.load(handle)
        print("✅ KONFIRMASI: Struktur Terbentuk & Bobot Disuntikkan! AI Siap.")
        return model, tokenizer
    except Exception as e:
        print(f"❌ Gagal menyuntikkan bobot: {e}")
        return None, None

model, tokenizer = build_and_load_model()

class SearchQuery(BaseModel):
    query: str

# --- ENDPOINT 1: REKOMENDASI AI ---
@app.post("/api/recommend")
async def get_recommendations(request: SearchQuery):
    if model is None or tokenizer is None:
        return {"error": "Model belum siap"}

    sequences = tokenizer.texts_to_sequences([request.query])
    padded = pad_sequences(sequences, maxlen=150) 
    prediction = model.predict(padded)
    final_score = max(0, min(float(prediction[0][0]) * 10, 10.0))

    keywords = request.query.lower().split()
    synonyms = {
        "jantan": ["shounen", "action", "military", "super power"],
        "cowok": ["shounen", "seinen"],
        "sedih": ["drama", "romance", "slice of life"],
        "serem": ["horror", "supernatural", "thriller"],
        "lucu": ["comedy", "parody"],
        "santai": ["slice of life", "iyashikei", "school"]
    }

    expanded_keywords = list(keywords)
    for word in keywords:
        if word in synonyms:
            expanded_keywords.extend(synonyms[word])
    
    def is_genre_match(row_genre):
        if not isinstance(row_genre, str): return False
        return any(word in row_genre.lower() for word in expanded_keywords)

    mask = df_anime['genre'].apply(is_genre_match)
    df_filtered = df_anime[mask].copy()

    if df_filtered.empty:
        df_filtered = df_anime.copy()

    df_filtered['diff'] = (df_filtered['score'] - final_score).abs()
    
    candidates = (
        df_filtered.sort_values('diff')
        .drop_duplicates(subset=['title']) 
        .head(30) 
    )
    
    recommendations = candidates.sample(min(3, len(candidates)))

    results = []
    for i, row in recommendations.iterrows():
        genre_clean = row['genre']
        if isinstance(genre_clean, str):
            genre_clean = genre_clean.replace("[", "").replace("]", "").replace("'", "").replace('"', "")

        results.append({
            "id": int(i),
            "title": row['title'],
            "score": float(row['score']),
            "genre": genre_clean,
            "img_url": str(row['img_url']) if pd.notna(row['img_url']) else None, 
            "synopsis": str(row['synopsis']) if pd.notna(row['synopsis']) else "No synopsis available.",
            "ai_match": round(final_score, 2)
        })

    return results

# --- ENDPOINT 2: KATALOG DATABASE (FIXED INDENTATION) ---
@app.get("/api/animes")
async def get_all_animes(page: int = 1, limit: int = 12):
    start = (page - 1) * limit
    end = start + limit
    
    total_data = len(df_anime)
    sliced_df = df_anime.iloc[start:end]
    
    animes = []
    for i, row in sliced_df.iterrows():
        genre_clean = row['genre']
        if isinstance(genre_clean, str):
            genre_clean = genre_clean.replace("[", "").replace("]", "").replace("'", "").replace('"', "")
            
        animes.append({
            "id": int(i),
            "title": row['title'],
            "score": float(row['score']),
            "genre": genre_clean,
            "img_url": str(row['img_url']) if pd.notna(row['img_url']) else None,
            "synopsis": str(row['synopsis']) if pd.notna(row['synopsis']) else "No synopsis available."
        })
        
    return {
        "total": total_data,
        "page": page,
        "limit": limit,
        "data": animes
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)