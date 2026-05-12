# 📊 Dataset Information

## Anime Recommender Dataset

### Source
- **Primary Source**: [Kaggle - Anime Recommendations Database](https://www.kaggle.com/datasets/CooperUnion/anime-recommendations-database)
- **License**: CC BY-NC-SA 4.0

### Dataset Files

#### 1. `animes.csv` (~12 MB)
Contains metadata for 19,311 anime titles with the following columns:
- `uid`: Unique anime ID
- `title`: Anime title
- `synopsis`: Plot summary
- `genre`: Genre list
- `episodes`: Number of episodes
- `aired`: Air date range
- `score`: MyAnimeList average rating
- `scored_by`: Number of users who rated
- `img_url`: Poster image URL
- `link`: MyAnimeList link

**Size**: 12,073,332 bytes (~12 MB)

#### 2. `profiles.csv` (~8.6 MB)
Contains user review data with the following columns:
- `profile`: Username
- `uid`: Anime ID being reviewed
- `score`: User's rating (1-10)
- `text`: Review text
- `scores`: Detailed scoring breakdown
- Other metadata

**Size**: 8,664,114 bytes (~8.6 MB)

### How to Download

#### Option 1: From Kaggle (Recommended)
```bash
# Install Kaggle CLI
pip install kaggle

# Download dataset (requires Kaggle API credentials)
kaggle datasets download -d CooperUnion/anime-recommendations-database
unzip anime-recommendations-database.zip

# Move files to data folder
mkdir -p data
mv animes.csv data/
mv rating_complete.csv data/profiles.csv  # Note: file is named rating_complete.csv in Kaggle
```

#### Option 2: Manual Download
1. Go to: https://www.kaggle.com/datasets/CooperUnion/anime-recommendations-database
2. Click "Download" button
3. Extract the zip file
4. Place `animes.csv` and `rating_complete.csv` (rename to `profiles.csv`) in the `data/` folder

#### Option 3: Using Google Drive (If you have it stored there)
```bash
# Place the CSV files in data/ folder
mkdir -p data
# Then copy your CSV files there
```

### Dataset Placement

After downloading, place the CSV files in this structure:
```
portfolio-machine-learning/
└── data/
    ├── animes.csv
    └── profiles.csv
```

### Why Not in Git?

These files are **excluded from Git** because:
- ❌ Too large (20 MB combined) - exceeds GitHub's reasonable file size
- ❌ Binary/large files bloat repository history
- ✅ Publicly available on Kaggle
- ✅ Can be downloaded on-demand
- ✅ Keeps repository lightweight & cloneable

### Attribution

- **Dataset**: Anime Recommendations Database
- **Source**: [MyAnimeList](https://myanimelist.net/)
- **Curated by**: CooperUnion
- **License**: CC BY-NC-SA 4.0

Please respect the license and give credit if you use this data in your projects.

---

**Last Updated**: May 12, 2026
