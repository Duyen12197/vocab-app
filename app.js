const { useState, useMemo, useRef, useEffect } = React;

// --- 1. ĐỊNH NGHĨA SVG TRỰC TIẾP (FIXED) ---
const ChevronRight = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;
const ChevronLeft = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>;
const Plus = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>;
const ImageIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>;
const Volume2 = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>;
const X = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>;
const SearchIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const MessageSquare = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const TypeIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>;
const ShieldCheck = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>;
const CameraIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>;

// --- 2. DỮ LIỆU ---
const CATEGORIES = [
  { id: '1', title: 'Giao tiếp cơ bản', count: 5, icon: '💬', color: 'bg-blue-500' },
  { id: '2', title: 'Công nghệ & AI', count: 5, icon: '💻', color: 'bg-zinc-600' },
  { id: '3', title: 'Du lịch & Khám phá', count: 5, icon: '🌍', color: 'bg-green-500' },
  { id: '4', title: 'Kinh doanh & Tài chính', count: 5, icon: '📈', color: 'bg-orange-500' },
  { id: '5', title: 'Ẩm thực & Nhà hàng', count: 5, icon: '🍕', color: 'bg-red-500' },
  { id: '6', title: 'Sức khỏe & Y tế', count: 5, icon: '🏥', color: 'bg-pink-500' },
  { id: '7', title: 'Gia đình & Bạn bè', count: 5, icon: '👨‍👩‍👧', color: 'bg-indigo-500' },
  { id: '8', title: 'Giáo dục & Trường học', count: 5, icon: '📚', color: 'bg-yellow-600' },
  { id: '9', title: 'Nghề nghiệp & Việc làm', count: 5, icon: '💼', color: 'bg-amber-700' },
  { id: '10', title: 'Thể thao & Giải trí', count: 5, icon: '⚽', color: 'bg-teal-500' },
];

const WORD_TYPES = ['Noun', 'Verb', 'Adj', 'Adv'];

function App() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeTab, setActiveTab] = useState('vocab');
  const [words, setWords] = useState([
    { id: 'w1', word: 'Greeting', type: 'Noun', meaning: 'Lời chào hỏi', category: '1', image: 'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?w=400' },
  ]);
  const [sentences, setSentences] = useState([
    { id: 's1', english: 'Nice to meet you!', vietnamese: 'Rất vui được gặp bạn!', category: '1' },
  ]);
  
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({ word: '', type: 'Noun', meaning: '', image: '', english: '', vietnamese: '' });
  const [homeSearchVisible, setHomeSearchVisible] = useState(false);
  const [homeSearchQuery, setHomeSearchQuery] = useState('');
  const [innerSearchVisible, setInnerSearchVisible] = useState(false);
  const [innerSearchQuery, setInnerSearchQuery] = useState('');
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});

  const homeSearchInputRef = useRef(null);
  const innerSearchInputRef = useRef(null);

  const speak = (text) => {
    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => { if (homeSearchVisible && homeSearchInputRef.current) homeSearchInputRef.current.focus(); }, [homeSearchVisible]);
  useEffect(() => { if (innerSearchVisible && innerSearchInputRef.current) innerSearchInputRef.current.focus(); }, [innerSearchVisible]);

  const handleAddItem = (e) => {
    e.preventDefault();
    const id = Date.now().toString();
    const catId = selectedCategory?.id || '1';
    if (activeTab === 'vocab') {
      setWords([...words, { ...newItem, id, category: catId }]);
    } else {
      setSentences([...sentences, { ...newItem, id, category: catId }]);
    }
    setIsAddingItem(false);
    setNewItem({ word: '', type: 'Noun', meaning: '', image: '', english: '', vietnamese: '' });
  };

  const categoriesWithCount = useMemo(() => {
    return CATEGORIES.map(cat => ({
      ...cat,
      wordCount: words.filter(w => w.category === cat.id).length,
      sentenceCount: sentences.filter(s => s.category === cat.id).length
    }));
  }, [words, sentences]);

  const homeSearchResults = useMemo(() => {
    const q = homeSearchQuery.toLowerCase().trim();
    return categoriesWithCount.filter(cat => !q || cat.title.toLowerCase().includes(q));
  }, [homeSearchQuery, categoriesWithCount]);

  const renderHome = () => (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white italic">Learn English</h1>
          <p className="text-zinc-500 text-sm">Minimalist Interface</p>
        </div>
        <div className="flex items-center gap-2">
          {homeSearchVisible && (
            <input 
              ref={homeSearchInputRef} type="text" placeholder="Tìm..." 
              className="bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-4 text-white outline-none w-40 sm:w-64"
              value={homeSearchQuery} onChange={(e) => setHomeSearchQuery(e.target.value)}
            />
          )}
          <button onClick={() => setHomeSearchVisible(!homeSearchVisible)} className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500">
            {homeSearchVisible ? <X /> : <SearchIcon />}
          </button>
        </div>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {homeSearchResults.map((cat) => (
          <button key={cat.id} onClick={() => setSelectedCategory(cat)} className="flex items-center p-4 bg-zinc-900 rounded-2xl border border-zinc-800 text-left">
            <div className={`${cat.color} w-12 h-12 rounded-xl flex items-center justify-center text-xl`}>{cat.icon}</div>
            <div className="flex-1 ml-4">
              <h3 className="text-white font-bold">{cat.title}</h3>
              <div className="flex gap-3 mt-1 text-zinc-500 text-[10px] uppercase font-bold">
                <span className="flex items-center gap-1"><TypeIcon /> {cat.wordCount}</span>
                <span className="flex items-center gap-1"><MessageSquare /> {cat.sentenceCount}</span>
              </div>
            </div>
            <ChevronRight />
          </button>
        ))}
      </div>
    </div>
  );

  const renderDetail = () => {
    const q = innerSearchQuery.toLowerCase().trim();
    const filteredWords = words.filter(w => w.category === selectedCategory.id && (w.word.toLowerCase().includes(q) || w.meaning.toLowerCase().includes(q)));
    const filteredSentences = sentences.filter(s => s.category === selectedCategory.id && (s.english.toLowerCase().includes(q) || s.vietnamese.toLowerCase().includes(q)));

    return (
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-2 mb-6">
          <button onClick={() => setSelectedCategory(null)} className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400"><ChevronLeft /></button>
          <div className="flex bg-zinc-900 p-1 rounded-2xl border border-zinc-800 flex-1 max-w-sm">
            <button onClick={() => setActiveTab('vocab')} className={`flex-1 py-2 rounded-xl text-xs font-black ${activeTab === 'vocab' ? 'bg-zinc-800 text-blue-500' : 'text-zinc-500'}`}>TỪ VỰNG</button>
            <button onClick={() => setActiveTab('sentences')} className={`flex-1 py-2 rounded-xl text-xs font-black ${activeTab === 'sentences' ? 'bg-zinc-800 text-green-500' : 'text-zinc-500'}`}>MẪU CÂU</button>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsQuizMode(!isQuizMode)} className={`p-3 rounded-2xl border ${isQuizMode ? 'bg-orange-600 text-white' : 'bg-zinc-900 text-zinc-500'}`}><ShieldCheck /></button>
            <button onClick={() => setIsAddingItem(true)} className="bg-blue-600 p-3 rounded-2xl text-white"><Plus /></button>
          </div>
        </div>

        <div className={activeTab === 'vocab' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>
          {activeTab === 'vocab' ? filteredWords.map(item => (
            <div key={item.id} className="bg-zinc-900 p-4 rounded-3xl border border-zinc-800 flex gap-4">
               <div className="w-20 h-20 rounded-xl bg-zinc-800 overflow-hidden flex-none">
                  {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-zinc-700"><ImageIcon /></div>}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-blue-400 font-black">{item.type}</span>
                    <button onClick={() => speak(item.word)} className="text-blue-500"><Volume2 /></button>
                  </div>
                  <h3 className="text-lg font-bold text-white">{item.word}</h3>
                  <p className="text-zinc-500 text-sm">{item.meaning}</p>
                </div>
            </div>
          )) : filteredSentences.map(item => (
            <div key={item.id} className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 flex justify-between items-center gap-4">
              <div className="flex-1">
                <p className="text-white font-bold">{item.english}</p>
                <p className="text-zinc-500 text-xs italic">{item.vietnamese}</p>
              </div>
              <button onClick={() => speak(item.english)} className="text-green-500"><Volume2 /></button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {selectedCategory ? renderDetail() : renderHome()}
      {isAddingItem && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 w-full max-w-md rounded-3xl p-6 border border-zinc-800">
             <div className="flex justify-between mb-4"><h2 className="font-bold">Thêm mới</h2><button onClick={()=>setIsAddingItem(false)}><X/></button></div>
             <form onSubmit={handleAddItem} className="space-y-4">
                <input className="w-full bg-zinc-800 p-3 rounded-xl outline-none" placeholder="Tiếng Anh" onChange={e => setNewItem({...newItem, word: e.target.value, english: e.target.value})} />
                <input className="w-full bg-zinc-800 p-3 rounded-xl outline-none" placeholder="Tiếng Việt" onChange={e => setNewItem({...newItem, meaning: e.target.value, vietnamese: e.target.value})} />
                <button className="w-full py-4 bg-blue-600 rounded-xl font-bold">Lưu lại</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
