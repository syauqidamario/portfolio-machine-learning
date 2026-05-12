import { useState } from 'react';

function App() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [view, setView] = useState('search'); // 'search' atau 'catalog'
  const [currentPage, setCurrentPage] = useState(1);

  // Fungsi ambil data katalog (Explore All)
  const fetchCatalog = async (page) => {
    setIsLoading(true);
    setView('catalog'); // Pastikan view pindah ke katalog
    setResults([]); // Bersihkan hasil lama
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/animes?page=${page}&limit=12`);
      const data = await response.json();
      setResults(data.data); 
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetch catalog:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi Pencarian Utama
  const handleSearch = async (e, customQuery = null) => {
    if (e) e.preventDefault();
    setView('search'); // Pindah ke view search saat mencari
    
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

  const handleSurpriseMe = () => {
    const vibes = ["Anime underrated", "Isekai aneh", "Horror ngeri", "Romance nangis", "Action jantan"];
    const randomVibe = vibes[Math.floor(Math.random() * vibes.length)];
    setQuery(randomVibe);
    handleSearch(null, randomVibe);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans pb-20">
      
      {/* Header Section */}
      <header className="pt-20 pb-12 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
          The Symbiotic Recommender
        </h1>
        
        {/* Navigasi Tab */}
        <div className="flex justify-center gap-4 mt-8">
          <button 
            onClick={() => { setView('search'); setResults([]); }}
            className={`px-6 py-2 rounded-full font-bold transition-all ${view === 'search' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            🔍 AI Search
          </button>
          <button 
            onClick={() => fetchCatalog(1)}
            className={`px-6 py-2 rounded-full font-bold transition-all ${view === 'catalog' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            📚 Explore Database
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4">
        
        {/* Tampilkan Search Bar hanya jika view === 'search' */}
        {view === 'search' && (
          <form onSubmit={handleSearch} className="relative flex items-center mb-16 max-w-4xl mx-auto">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Contoh: Action comedy yang bikin ngakak..."
              className="w-full bg-slate-800/50 border border-slate-700 rounded-full py-4 pl-6 pr-44 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-lg"
            />
            <div className="absolute right-2 flex items-center gap-2">
              <button type="button" onClick={handleSurpriseMe} className="p-2.5 text-2xl hover:scale-125 transition-transform">🎲</button>
              <button type="submit" disabled={isLoading} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-full transition-all disabled:opacity-50">
                {isLoading ? 'Mencari...' : 'Jelajahi'}
              </button>
            </div>
          </form>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
          </div>
        )}

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {results.map((anime) => (
            <div key={anime.id} className="bg-slate-800/40 rounded-2xl p-4 border border-slate-700/50 hover:bg-slate-800/80 transition-all group flex flex-col shadow-xl">
              <div className="h-64 w-full rounded-xl bg-slate-700 mb-4 overflow-hidden relative">
                <img src={anime.img_url} alt={anime.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={(e) => { e.target.src = 'https://via.placeholder.com/400x600?text=No+Image'; }} />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded">
                  ★ {anime.score}
                </div>
              </div>
              <h3 className="text-md font-bold text-white mb-1 line-clamp-1 group-hover:text-blue-400">{anime.title}</h3>
              <p className="text-[10px] text-blue-400 font-bold mb-2 uppercase">{anime.genre}</p>
              
              {/* Progress Bar (Hanya muncul di search mode agar unik) */}
              {view === 'search' && (
                <div className="mt-auto pt-2">
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-slate-500">AI MATCH</span>
                    <span className="text-emerald-400 font-bold">{anime.ai_match}</span>
                  </div>
                  <div className="w-full bg-slate-700 h-1 rounded-full">
                    <div className="bg-emerald-500 h-1 rounded-full" style={{ width: `${(anime.ai_match/10)*100}%` }}></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pagination Control - Hanya muncul di view catalog */}
        {view === 'catalog' && !isLoading && (
          <div className="flex justify-center items-center gap-6 mt-12">
            <button 
              disabled={currentPage === 1}
              onClick={() => fetchCatalog(currentPage - 1)}
              className="px-6 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 disabled:opacity-30 transition-all"
            >
              ← Previous
            </button>
            <span className="font-bold text-blue-400">Page {currentPage}</span>
            <button 
              onClick={() => fetchCatalog(currentPage + 1)}
              className="px-6 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-all"
            >
              Next →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;