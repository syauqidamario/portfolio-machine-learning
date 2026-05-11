from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import tensorflow as tf
import pickle
import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, SpatialDropout1D, Conv1D, MaxPooling1D, LSTM, Dense, Dropout
from tensorflow.keras.preprocessing.sequence import pad_sequences

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def build_and_load_model():
    print("Membangun ulang struktur The Muscle...")
    model = Sequential([
        # Kita tambahkan input_shape di sini agar model langsung "terbentuk"
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
    
    # --- JURUS PEMANASAN ---
    # Kita panggil build() secara manual agar model siap menerima bobot
    model.build(input_shape=(None, 150)) 
    
    try:
        # Sekarang suntikkan bobotnya
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

@app.post("/api/recommend")
async def get_recommendations(request: SearchQuery):
    if model is None: return {"error": "Model tidak siap"}
    
    # Preprocessing (maxlen 150 sesuai log error sebelumnya)
    sequences = tokenizer.texts_to_sequences([request.query])
    padded = pad_sequences(sequences, maxlen=150)
    
    # Prediksi
    prediction = model.predict(padded)
    score = float(np.round(prediction[0][0] * 10, 2))
    
    return [
        {"id": 1, "title": f"Rekomendasi Utama: {request.query}", "score": min(score, 10.0), "genre": "AI Prediction Result"},
        {"id": 2, "title": "Gintama (Simulated)", "score": 9.5, "genre": "Action, Comedy"},
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)