import { useState } from 'react';

function App() {
  const [query, setQuery] = useState('');
  const [algo, setAlgo] = useState('hybrid');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [view, setView] = useState('search'); 
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAnime, setSelectedAnime] = useState(null);

  const fetchCatalog = async (page) => {
    setIsLoading(true); setView('catalog'); setResults([]);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/animes?page=${page}&limit=12`);
      const data = await res.json();
      setResults(data.data); setCurrentPage(page);
    } catch (err) { console.error(err); } finally { setIsLoading(false); }
  };

  const handleSearch = async (e, customQuery = null) => {
    if (e) e.preventDefault(); setView('search');
    const q = customQuery || query;
    if (!q) return;
    setIsLoading(true); setResults([]);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, algo: algo }),
      });
      const data = await res.json();
      setResults(data);
    } catch (err) { alert("Backend Error!"); } finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans pb-20">
      <header className="pt-20 pb-12 text-center">
        <h1 className="text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">The Symbiotic Recommender</h1>
        <div className="flex justify-center gap-4 mt-8">
          <button onClick={() => {setView('search'); setResults([]);}} className={`px-6 py-2 rounded-full font-bold ${view==='search'?'bg-blue-600 shadow-lg shadow-blue-500/30':'bg-slate-800'}`}>🔍 Search</button>
          <button onClick={() => fetchCatalog(1)} className={`px-6 py-2 rounded-full font-bold ${view==='catalog'?'bg-emerald-600 shadow-lg shadow-emerald-500/30':'bg-slate-800'}`}>📚 Explore</button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4">
        {view === 'search' && (
          <form onSubmit={handleSearch} className="relative flex items-center mb-16 max-w-4xl mx-auto gap-2">
            <select value={algo} onChange={(e)=>setAlgo(e.target.value)} className="bg-slate-800 border border-slate-700 rounded-full px-4 py-4 text-xs font-bold text-blue-400 outline-none hover:bg-slate-700 transition-all">
              <option value="hybrid">🧠 AI Hybrid</option>
              <option value="top_rated">⭐ Top Rated</option>
            </select>
            <input type="text" value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Vibe anime hari ini..." className="flex-1 bg-slate-800/50 border border-slate-700 rounded-full py-4 px-6 text-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            <button type="submit" disabled={isLoading} className="bg-blue-600 px-8 py-4 rounded-full font-bold hover:bg-blue-500 disabled:opacity-50">Jelajahi</button>
          </form>
        )}

        {isLoading && <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div></div>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {results.map((anime) => (
            <div key={anime.id} onClick={()=>setSelectedAnime(anime)} className="bg-slate-800/40 rounded-2xl p-4 border border-slate-700/50 hover:border-blue-500/50 transition-all cursor-pointer group">
              <img src={anime.img_url} className="h-64 w-full object-cover rounded-xl mb-4 group-hover:scale-105 transition-transform" onError={(e)=>e.target.src='https://via.placeholder.com/400x600'} />
              <h3 className="font-bold text-white line-clamp-1">{anime.title}</h3>
              <p className="text-[10px] text-blue-400 font-bold uppercase">{anime.genre}</p>
              {view === 'search' && <div className="mt-4 text-[10px] font-bold text-emerald-400 uppercase tracking-widest border-t border-slate-700 pt-2">AI Match: {anime.ai_match}</div>}
            </div>
          ))}
        </div>

        {view === 'catalog' && !isLoading && (
          <div className="flex justify-center items-center gap-8 mt-12">
            <button disabled={currentPage===1} onClick={()=>fetchCatalog(currentPage-1)} className="p-2 disabled:opacity-20">← Prev</button>
            <span className="font-bold text-blue-400">Page {currentPage}</span>
            <button onClick={()=>fetchCatalog(currentPage+1)} className="p-2">Next →</button>
          </div>
        )}

        {/* MODAL DETAIL */}
        {selectedAnime && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl overflow-hidden relative flex flex-col md:flex-row">
              <button onClick={()=>setSelectedAnime(null)} className="absolute top-4 right-4 bg-slate-800 p-2 rounded-full z-10">✕</button>
              <img src={selectedAnime.img_url} className="md:w-1/3 object-cover" />
              <div className="p-8 md:w-2/3">
                <h2 className="text-2xl font-bold mb-2">{selectedAnime.title}</h2>
                <p className="text-blue-400 text-xs font-bold mb-4">{selectedAnime.genre}</p>
                <p className="text-slate-400 text-sm mb-6 line-clamp-6">{selectedAnime.synopsis}</p>
                <button onClick={()=>window.open(`https://myanimelist.net/anime/${selectedAnime.id}`)} className="w-full py-3 bg-blue-600 rounded-xl font-bold">MAL Profile</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;