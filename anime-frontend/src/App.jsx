import { useState } from 'react';

function App() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);

  // Data palsu meniru output model AI kamu yang super akurat
  const dummyResults = [
    { id: 1, title: "Gintama'", score: 9.38, genre: "Action, Comedy, Sci-Fi" },
    { id: 2, title: "Kimi no Na wa.", score: 9.20, genre: "Drama, Romance, Supernatural" },
    { id: 3, title: "Koe no Katachi", score: 9.15, genre: "Drama, School, Shounen" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query) return;
    
    setIsLoading(true);
    setResults([]); // Kosongkan hasil sebelumnya

    // Simulasi waktu AI berpikir selama 1.5 detik
    setTimeout(() => {
      setResults(dummyResults);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-blue-500 selection:text-white pb-20">
      
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
            className="w-full bg-slate-800/50 border border-slate-700 rounded-full py-4 pl-6 pr-32 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-lg"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Mencari...' : 'Jelajahi'}
          </button>
        </form>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
          </div>
        )}

        {/* Results Grid - Dibuat lega dan tidak saling berdempetan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map((anime) => (
            <div 
              key={anime.id} 
              className="bg-slate-800/40 rounded-2xl p-5 border border-slate-700/50 hover:bg-slate-800/80 transition-colors group flex flex-col"
            >
              {/* Placeholder gambar cover (pakai gradien CSS biar elegan) */}
              <div className="h-48 w-full rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 mb-4 flex items-center justify-center shadow-inner">
                <span className="text-slate-500 font-medium">Cover Image</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                {anime.title}
              </h3>
              <p className="text-sm text-slate-400 mb-4 flex-grow">
                {anime.genre}
              </p>
              
              {/* Score Bar */}
              <div className="mt-auto">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">AI Prediksi</span>
                  <span className="text-lg font-bold text-emerald-400">{anime.score}</span>
                </div>
                {/* Visualisasi skor dalam bentuk bar */}
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-emerald-400 h-2 rounded-full" 
                    style={{ width: `${(anime.score / 10) * 100}%` }}
                  ></div>
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