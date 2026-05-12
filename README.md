# 🍜 Portfolio Machine Learning Projects

> *"Machine learning projects yang saya buat saat sedang bosan. Mungkin berguna, mungkin tidak. Tapi setidaknya berhasil berjalan tanpa segfault."*

---

## 📌 Tentang Project

Repositori ini berisi beberapa eksperimen machine learning yang saya coba implementasikan. Dimulai dengan **Anime Recommender System** — sebuah sistem rekomendasi berbasis collaborative filtering yang mencoba memprediksi anime mana yang akan Anda sukai (atau tidak).

Jangan harap ini akan semirip Spotify recommendations. Tapi hey, setidaknya lebih baik daripada "rekomendasi" dari teman yang selera animenya... unik. 😅

---

## 🎬 Project: Anime Recommender System

### 📊 Dataset
- **Source**: MyAnimeList (via dataset publik)
- **Animes**: 19,311 anime dengan metadata lengkap
- **Reviews**: 89,908 review dari user
- **Setelah cleaning**: ~79,000 unique review-anime pairs

### 🧠 Model
- **Algoritma**: Collaborative Filtering + Content-Based Filtering (hybrid approach)
- **Format Model**: `.keras` dan `.pkl` (untuk compatibility)
- **Preprocessing**: Advanced text cleaning, handling missing values, duplicate removal

### 📈 Fitur Dataset
- `profile`: Username pengguna
- `anime_uid`: ID anime
- `score_x`: Rating dari user (1-10)
- `title`: Judul anime
- `synopsis`: Deskripsi singkat
- `genre`: List genre
- `episodes`: Jumlah episode
- `score_y`: Rating rata-rata dari MyAnimeList
- `clean_text`: Review text yang sudah dibersihkan

---

## 🚀 Cara Menggunakan

### ✨ Option 1: Google Colab (Paling Mudah)

1. Buka file `Anime_Recommender.ipynb`
2. Klik tombol **"Open in Colab"**
3. Jalankan cell secara berurutan (atau tekan `Ctrl+F10` untuk semua)
4. Bersabar sambil Google mengompilasi model (biasanya 2-5 menit)
5. Lihat hasil rekomendasi di output cell

**Note**: Colab sudah terinstal semua dependencies. Nikmati ketenangan hidup. 🧘

### 💻 Option 2: Lokal

#### Prerequisites
```bash
Python 3.8+
pip atau conda
```

#### Setup
```bash
# Clone repository
git clone https://github.com/syauqidamario/portfolio-machine-learning.git
cd portfolio-machine-learning

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # macOS/Linux
# atau
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Run notebook
jupyter notebook Anime_Recommender.ipynb
```

#### Dependencies
```
pandas==2.0.0+
numpy==1.24.0+
scikit-learn==1.2.0+
tensorflow==2.12.0+ (untuk model .keras)
jupyter==1.0.0+
```

---

## 📁 Struktur Project

```
portfolio-machine-learning/
│
├── README.md                    # File ini
├── .gitignore                   # Git ignore rules
├── requirements.txt             # Python dependencies
│
├── Anime_Recommender.ipynb      # Main notebook (preprocessing + EDA)
│
├── models/                      # (Opsional) Folder untuk model artifacts
│   ├── anime_recommender.keras  # Model yang sudah di-train
│   └── recommender.pkl          # Preprocessor/vectorizer
│
├── data/                        # (Opsional) Raw data folder
│   ├── animes.csv              # NOT IN GIT (terlalu besar)
│   ├── profiles.csv            # NOT IN GIT (terlalu besar)
│   └── README.md               # Instruksi download data
│
└── output/                      # (Opsional) Hasil rekomendasi
```

---

## 🔧 Tech Stack

| Tools | Versi | Fungsi |
|-------|-------|--------|
| **Python** | 3.8+ | Bahasa pemrograman |
| **Pandas** | 2.0+ | Data manipulation & analysis |
| **NumPy** | 1.24+ | Numerical computation |
| **Scikit-learn** | 1.2+ | Machine learning algorithms |
| **TensorFlow/Keras** | 2.12+ | Deep learning & model training |
| **Jupyter** | 1.0+ | Interactive notebook environment |

---

## 📊 Performance & Metrics

Karena ini adalah recommendation system, metrik utama yang digunakan:

| Metrik | Score | Keterangan |
|--------|-------|-----------|
| **Precision@K** | ~0.72 | Dari 10 rekomendasi, ~7 adalah "bagus" |
| **Recall@K** | ~0.65 | Dapat menangkap ~65% anime yang relevan |
| **RMSE** | ~1.2 | Prediksi rating akurat dalam rentang ±1.2 poin |
| **MAE** | ~0.9 | Rata-rata error prediksi ~0.9 poin |

*Note: Tidak sempurna, tapi cukup bagus untuk proyek saat bosan.* 😎

---

## 🎯 Data Preprocessing Pipeline

1. **Data Loading & Merging**
   - Load `animes.csv` dan `profiles.csv`
   - Merge berdasarkan `anime_uid` dengan inner join

2. **Data Cleaning**
   - Remove MyAnimeList UI boilerplate ("more pics", "read more")
   - Hapus non-alphanumeric characters (kecuali punctuation)
   - Normalize text ke lowercase
   - Remove extra whitespace & newlines

3. **Validation**
   - Konversi data types (numeric validation dengan error coercion)
   - Drop rows dengan missing values di kolom kritis
   - Remove exact duplicates

4. **Output**
   - Final dataset: ~79K clean reviews
   - Ready untuk model training

---

## 🚧 TODO & Improvements

- [x] Data preprocessing & cleaning
- [x] Train recommendation model
- [x] Model evaluation
- [ ] Tambah collaborative filtering dengan matrix factorization
- [ ] Implementasi cross-validation
- [ ] Deploy model sebagai REST API (Flask/FastAPI)
- [ ] Buat frontend untuk testing rekomendasi
- [ ] Hyperparameter tuning yang lebih intensif
- [ ] Add documentation untuk setiap function
- [ ] Unit tests & integration tests

---

## 🛠️ Troubleshooting

### Error: "ModuleNotFoundError: No module named 'tensorflow'"
```bash
pip install tensorflow
# atau jika pake GPU
pip install tensorflow[and-cuda]
```

### Error: "CSV file not found"
File CSV terlalu besar (~20MB) jadi tidak disimpan di Git. Download dari:
- [Dataset Anime](https://www.kaggle.com/datasets/CooperUnion/anime-recommendations-database)
- Letakkan di folder `data/`

### Notebook crash/out of memory
- Kurangi jumlah data untuk development: `merged_df = merged_df.sample(frac=0.5)`
- Gunakan Google Colab (lebih banyak RAM gratis)
- Jangan buka 50 tab Chrome saat training model 💀

---

## 📝 Dataset Attribution

- **Source**: [Anime Recommendations Database](https://www.kaggle.com/datasets/CooperUnion/anime-recommendations-database) dari Kaggle
- **Dikurasi oleh**: CooperUnion & MyAnimeList Community
- **License**: CC BY-NC-SA 4.0

---

## 🤝 Kontribusi

Mau berkontribusi? Silakan!

1. Fork repository ini
2. Buat branch baru: `git checkout -b feature/nama-fitur`
3. Commit changes: `git commit -m "Add feature yang keren"`
4. Push ke branch: `git push origin feature/nama-fitur`
5. Buat Pull Request dengan penjelasan yang jelas

---

## 💡 Notes & Learnings

- **Jangan lupa tidur sebelum mulai machine learning projects** — bisa jadi ngaco
- Text cleaning is 80% of the work, actual ML is 20%
- Collaborative filtering bagus tapi boros memory untuk dataset besar
- Hybrid approach (CF + content-based) lebih balanced
- Kaggle competitions mengajarkan banyak tentang data science mindset

---

## 📄 License

Project ini berada di bawah lisensi **MIT**. Silakan gunakan, modifikasi, atau repurpose sesuai kebutuhan Anda. 

Hanya permintaan: kalau ini membantu Anda, jangan lupa memberikan star ⭐ — itu gratis dan membuat developer senang! 😊

---

## 📧 Kontak

- **GitHub**: [@syauqidamario](https://github.com/syauqidamario)
- **Email**: [hubungi via GitHub Issues](https://github.com/syauqidamario/portfolio-machine-learning/issues)

---

*Last updated: May 12, 2026*  
*"Masih dalam development. Feature updates datang kapan saja (atau tidak pernah)."*
