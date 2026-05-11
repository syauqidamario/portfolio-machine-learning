import { useState } from 'react';

function App() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);

  // Fungsi Pencarian Utama
  const handleSearch = async (e, customQuery = null) => {
    // Jika dipicu tombol Jelajahi (form submit), cegah refresh halaman
    if (e) e.preventDefault();
    
    const searchQuery = customQuery || query;
    if (!searchQuery) return;
    
    setIsLoading(true);
    setResults([]); 

    try {
      const response = await fetch('http://127.0.0.1:8000/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Gagal menghubungi AI:", error);
      alert("Backend belum nyala atau ada error!");
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi Surprise Me - Harus ditaruh SEBELUM return
  const handleSurpriseMe = () => {
    const vibes = [
      "Anime underrated yang seru banget",
      "Isekai aneh tapi menarik",
      "Horror yang bikin gak bisa tidur",
      "Kisah cinta segitiga yang rumit",
      "Pertarungan robot raksasa di luar angkasa",
      "Vibe sore hari yang tenang dan damai",
      "Anime jantan banget",
      "Romance yang bikin nangis"
    ];
    const randomVibe = vibes[Math.floor(Math.random() * vibes.length)];
    setQuery(randomVibe);
    
    // Langsung jalankan pencarian dengan query baru tersebut
    handleSearch(null, randomVibe);
  };

  // UI ditaruh paling bawah dalam fungsi App
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans pb-20">
      
      {/* Header Section */}
      <header className="pt-20 pb-12 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
          The Symbiotic Recommender
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Ketik genre atau *vibe* cerita yang sedang ingin kamu tonton. AI kami akan memindai ribuan ulasan untuk menemukan mahakarya yang tepat.
        </p>
      </header>

      {/* Search Bar Section */}
      <main className="max-w-4xl mx-auto px-4">
        <form onSubmit={handleSearch} className="relative flex items-center mb-16">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Contoh: Action comedy yang bikin ngakak..."
            className="w-full bg-slate-800/50 border border-slate-700 rounded-full py-4 pl-6 pr-44 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-lg"
          />
          
          <div className="absolute right-2 flex items-center gap-2">
            {/* Tombol Dadu */}
            <button
              type="button"
              onClick={handleSurpriseMe}
              className="p-2.5 text-2xl hover:scale-125 transition-transform"
              title="Surprise Me"
            >
              🎲
            </button>
            
            {/* Tombol Jelajahi */}
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-full transition-all disabled:opacity-50"
            >
              {isLoading ? 'Mencari...' : 'Jelajahi'}
            </button>
          </div>
        </form>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
          </div>
        )}

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map((anime) => (
            <div key={anime.id} className="bg-slate-800/40 rounded-2xl p-5 border border-slate-700/50 hover:bg-slate-800/80 transition-all group flex flex-col shadow-xl">
              <div className="h-72 w-full rounded-xl bg-slate-700 mb-4 overflow-hidden relative shadow-inner">
                {anime.img_url ? (
                  <img src={anime.img_url} alt={anime.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={(e) => { e.target.src = 'https://via.placeholder.com/400x600?text=No+Image'; }} />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-500">No Image</div>
                )}
                <div className="absolute top-2 right-2 bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md">
                  Ranked: {anime.score}
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors line-clamp-1">{anime.title}</h3>
              <p className="text-[10px] uppercase tracking-widest text-blue-400 font-bold mb-2">{anime.genre}</p>
              <p className="text-xs text-slate-400 mb-4 line-clamp-3 italic leading-relaxed">{anime.synopsis || "No synopsis available."}</p>
              
              <div className="mt-auto pt-4 border-t border-slate-700/50">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">AI Confidence</span>
                  <span className="text-lg font-bold text-emerald-400">{anime.score}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-1.5">
                  <div className="bg-gradient-to-r from-emerald-500 to-emerald-300 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${(anime.score / 10) * 100}%` }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;