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
        print("✅ AI Siap: Bobot disuntikkan.")
        return model, tokenizer
    except Exception as e:
        print(f"❌ Gagal load model: {e}")
        return None, None

model, tokenizer = build_and_load_model()

class SearchQuery(BaseModel):
    query: str
    algo: str = "hybrid"

# --- ENDPOINT 1: REKOMENDASI ---
@app.post("/api/recommend")
async def get_recommendations(request: SearchQuery):
    if model is None or tokenizer is None:
        return {"error": "Model belum siap"}

    # Filter Genre & Sinonim
    keywords = request.query.lower().split()
    synonyms = {
        "crying": ["drama", "romance", "slice of life"],
        "hard": ["drama", "thriller", "action"],
        "fight": ["action", "martial arts", "shounen"],
        "scary": ["horror", "thriller", "supernatural"],
        "jantan": ["shounen", "action", "military"],
        "cowok": ["shounen", "seinen"],
        "sedih": ["drama", "romance"],
        "serem": ["horror", "thriller"],
        "lucu": ["comedy"],
        "santai": ["slice of life", "iyashikei"]
    }
    expanded = list(keywords)
    for w in keywords:
        if w in synonyms: expanded.extend(synonyms[w])
    
    mask = df_anime['genre'].apply(lambda x: any(word in str(x).lower() for word in expanded) if pd.notna(x) else False)
    df_filtered = df_anime[mask].copy()
    if df_filtered.empty: df_filtered = df_anime.copy()

    # Pemilihan Algoritma
    if request.algo == "top_rated":
        candidates = df_filtered.sort_values('score', ascending=False).drop_duplicates(subset=['title']).head(30)
        ai_match_val = "N/A (Rating)"
    else:
        seq = tokenizer.texts_to_sequences([request.query])
        padded = pad_sequences(seq, maxlen=150) 
        pred = model.predict(padded)
        final_score = max(0, min(float(pred[0][0]) * 10, 10.0))
        ai_match_val = round(final_score, 2)
        df_filtered['diff'] = (df_filtered['score'] - final_score).abs()
        candidates = df_filtered.sort_values('diff').drop_duplicates(subset=['title']).head(30)

    recommendations = candidates.sample(min(4, len(candidates)))
    results = []
    for i, row in recommendations.iterrows():
        genre = str(row['genre']).replace("[", "").replace("]", "").replace("'", "")
        results.append({
            "id": int(i), "title": row['title'], "score": float(row['score']),
            "genre": genre, "img_url": str(row['img_url']) if pd.notna(row['img_url']) else None,
            "synopsis": str(row['synopsis']) if pd.notna(row['synopsis']) else "No synopsis.",
            "ai_match": ai_match_val
        })
    # PAKSA PRINT DI SINI (Pastikan indentasinya sejajar dengan 'return')
    print("\n" + "="*30)
    print(f"ALGO USED   : {request.algo}")
    print(f"QUERY       : {request.query}")
    print(f"AI MATCH SC : {ai_match_val}")
    print(f"TOP RESULTS : {[r['title'] for r in results]}")
    print("="*30 + "\n")
    return results

# --- ENDPOINT 2: KATALOG ---
@app.get("/api/animes")
async def get_all_animes(page: int = 1, limit: int = 12):
    start, end = (page - 1) * limit, page * limit
    sliced_df = df_anime.iloc[start:end]
    animes = []
    for i, row in sliced_df.iterrows():
        genre = str(row['genre']).replace("[", "").replace("]", "").replace("'", "")
        animes.append({
            "id": int(i), "title": row['title'], "score": float(row['score']),
            "genre": genre, "img_url": str(row['img_url']) if pd.notna(row['img_url']) else None,
            "synopsis": str(row['synopsis']) if pd.notna(row['synopsis']) else "No synopsis."
        })
    return {"total": len(df_anime), "page": page, "data": animes}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)