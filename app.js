const { useState, useMemo, useRef, useEffect } = React;

// --- 1. SVG ICONS ---
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

// --- 2. DATA ---
const CATEGORIES = [
  { id: '1', title: 'Gia đình', subtitle: 'Family', icon: './assets/gia-dinh.png', color: 'bg-indigo-500' },
  { id: '2', title: 'Bản thân', subtitle: 'Myself', icon: './assets/ban-than.png', color: 'bg-blue-500' },
  { id: '3', title: 'Số đếm & thời gian', subtitle: 'Numbers & Time', icon: './assets/so-dem-thoi-gian.png', color: 'bg-zinc-600' },
  { id: '4', title: 'Màu sắc & hình dạng', subtitle: 'Colors & Shapes', icon: './assets/mau-sac-hinh-dang.png', color: 'bg-orange-500' },
  { id: '5', title: 'Đồ vật xung quanh', subtitle: 'Objects', icon: './assets/do-vat-xung-quanh.png', color: 'bg-amber-700' },
  { id: '6', title: 'Nhà cửa', subtitle: 'House', icon: './assets/nha-cua.png', color: 'bg-yellow-600' },
  { id: '7', title: 'Thức ăn & đồ uống', subtitle: 'Food & Drink', icon: './assets/thuc-an-do-uong.png', color: 'bg-red-500' },
  { id: '8', title: 'Mua sắm', subtitle: 'Shopping', icon: './assets/mua-sam.png', color: 'bg-pink-500' },
  { id: '9', title: 'Giao thông', subtitle: 'Transportation', icon: './assets/giao-thong.png', color: 'bg-teal-500' },
  { id: '10', title: 'Sức khỏe', subtitle: 'Health', icon: './assets/suc-khoe.png', color: 'bg-green-500' },
];

const WORD_TYPES = ['Noun', 'Verb', 'Adj', 'Adv'];

function App() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeTab, setActiveTab] = useState('vocab');
  const [words, setWords] = useState(() => JSON.parse(localStorage.getItem('words')) || []);
  const [sentences, setSentences] = useState(() => JSON.parse(localStorage.getItem('sentences')) || []);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({ word: '', type: 'Noun', meaning: '', image: '', english: '', vietnamese: '' });
  const [homeSearchVisible, setHomeSearchVisible] = useState(false);
  const [homeSearchQuery, setHomeSearchQuery] = useState('');
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});

  useEffect(() => {
    localStorage.setItem('words', JSON.stringify(words));
    localStorage.setItem('sentences', JSON.stringify(sentences));
  }, [words, sentences]);

  const speak = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new window.SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Samantha') || v.name.includes('Google'))) || voices.find(v => v.lang.startsWith('en'));
    if (englishVoice) utterance.voice = englishVoice;
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    const id = Date.now().toString();
    const catId = selectedCategory.id;
    if (activeTab === 'vocab') {
      setWords([...words, { ...newItem, id, category: catId }]);
    } else {
      setSentences([...sentences, { id, english: newItem.english, vietnamese: newItem.vietnamese, category: catId }]);
    }
    setIsAddingItem(false);
    setNewItem({ word: '', type: 'Noun', meaning: '', image: '', english: '', vietnamese: '' });
  };

  const checkAnswer = (id, original) => {
    const input = (quizAnswers[id] || '').trim().toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
    const target = original.trim().toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
    if (!input) return 'neutral';
    return input === target ? 'correct' : 'incorrect';
  };

  const renderHome = () => {
    const q = homeSearchQuery.toLowerCase().trim();
    const filteredCats = CATEGORIES.filter(cat => !q || cat.title.toLowerCase().includes(q) || cat.subtitle.toLowerCase().includes(q));

    return (
      <div className="max-w-7xl mx-auto px-4 py-6 animate-in">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter">EngViet</h1>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Tung Doan App</p>
          </div>
          <div className="flex items-center gap-2">
            {homeSearchVisible && (
              <input 
                autoFocus type="text" placeholder="Tìm chủ đề..." 
                className="bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-4 text-white outline-none w-40 focus:border-blue-500 transition-all text-sm"
                value={homeSearchQuery} onChange={(e) => setHomeSearchQuery(e.target.value)}
              />
            )}
            <button onClick={() => setHomeSearchVisible(!homeSearchVisible)} className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500">
              {homeSearchVisible ? <X /> : <SearchIcon />}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredCats.map((cat) => (
            <button key={cat.id} onClick={() => setSelectedCategory(cat)} className="flex items-center p-4 bg-zinc-900 rounded-[24px] border border-zinc-800 hover:border-zinc-700 transition-all text-left group">
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-zinc-800 flex items-center justify-center shrink-0 shadow-lg border border-zinc-800">
                {cat.icon.includes('.') ? (
                  <img src={cat.icon} className="w-full h-full object-cover" onError={(e) => { e.target.style.display='none'; e.target.parentNode.innerHTML='📚'; }} />
                ) : <span className="text-2xl">{cat.icon}</span>}
              </div>
              <div className="flex-1 ml-4 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-bold truncate pr-2 text-lg">{cat.title}</h3>
                  <div className="flex gap-2 text-zinc-500 text-[10px] font-black shrink-0 uppercase">
                    <span className="flex items-center gap-1"><TypeIcon /> {words.filter(w=>w.category===cat.id).length}</span>
                    <span className="flex items-center gap-1"><MessageSquare /> {sentences.filter(s=>s.category===cat.id).length}</span>
                  </div>
                </div>
                <p className="text-zinc-500 text-sm font-medium italic mt-0.5">{cat.subtitle}</p>
              </div>
              <div className="ml-2 text-zinc-700 group-hover:text-zinc-400 transition-colors"><ChevronRight /></div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderDetail = () => {
    const filteredWords = words.filter(w => w.category === selectedCategory.id);
    const filteredSentences = sentences.filter(s => s.category === selectedCategory.id);

    return (
      <div className="max-w-7xl mx-auto px-4 py-4 animate-in">
        <div className="flex items-center justify-between gap-2 mb-6">
          <button onClick={() => { setSelectedCategory(null); setIsQuizMode(false); }} className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400"><ChevronLeft /></button>
          <div className="flex bg-zinc-900 p-1 rounded-2xl border border-zinc-800 flex-1 max-w-sm">
            <button onClick={() => { setActiveTab('vocab'); setQuizAnswers({}); }} className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${activeTab === 'vocab' ? 'bg-zinc-800 text-blue-500' : 'text-zinc-500'}`}>TỪ VỰNG</button>
            <button onClick={() => { setActiveTab('sentences'); setQuizAnswers({}); }} className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${activeTab === 'sentences' ? 'bg-zinc-800 text-green-500' : 'text-zinc-500'}`}>MẪU CÂU</button>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { setIsQuizMode(!isQuizMode); setQuizAnswers({}); }} className={`p-3 rounded-2xl border transition-all ${isQuizMode ? 'bg-orange-600 text-white' : 'bg-zinc-900 text-zinc-500'}`}><ShieldCheck /></button>
            <button onClick={() => setIsAddingItem(true)} className="bg-blue-600 p-3 rounded-2xl text-white"><Plus /></button>
          </div>
        </div>

        <div className={activeTab === 'vocab' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-20" : "grid grid-cols-1 md:grid-cols-2 gap-4 pb-20"}>
          {activeTab === 'vocab' ? filteredWords.map(item => {
            const status = checkAnswer(item.id, item.word);
            return (
              <div key={item.id} className={`bg-zinc-900 p-4 rounded-[28px] border transition-all flex gap-4 ${isQuizMode && status === 'correct' ? 'border-green-500 bg-green-500/5' : isQuizMode && status === 'incorrect' ? 'border-red-500 bg-red-500/5' : 'border-zinc-800'}`}>
                <div className="w-20 h-20 rounded-2xl bg-zinc-800 overflow-hidden shrink-0 border border-zinc-800">
                  {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-zinc-700"><ImageIcon /></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-blue-400 font-black uppercase tracking-wider">{item.type}</span>
                    <button onClick={() => speak(item.word)} className="text-blue-500 p-1 hover:bg-zinc-800 rounded-full transition-colors"><Volume2 /></button>
                  </div>
                  {isQuizMode ? (
                    <input 
                      className={`w-full bg-black border rounded-xl px-3 py-2 text-sm font-bold outline-none transition-all ${status === 'correct' ? 'border-green-500 text-green-400' : status === 'incorrect' ? 'border-red-500 text-red-400' : 'border-zinc-700 text-white focus:border-blue-500'}`}
                      placeholder="Gõ từ tiếng Anh..."
                      value={quizAnswers[item.id] || ''}
                      onChange={(e) => setQuizAnswers({...quizAnswers, [item.id]: e.target.value})}
                    />
                  ) : <h3 className="text-lg font-bold text-white truncate">{item.word}</h3>}
                  <p className="text-zinc-500 text-sm mt-1">{item.meaning}</p>
                </div>
              </div>
            )
          }) : filteredSentences.map(item => {
            const status = checkAnswer(item.id, item.english);
            return (
              <div key={item.id} className={`bg-zinc-900 p-5 rounded-3xl border transition-all flex justify-between items-center gap-4 ${isQuizMode && status === 'correct' ? 'border-green-500 bg-green-500/5' : isQuizMode && status === 'incorrect' ? 'border-red-500 bg-red-500/5' : 'border-zinc-800'}`}>
                <div className="flex-1 min-w-0">
                  {isQuizMode ? (
                    <div className="space-y-2">
                      <p className="text-zinc-400 text-xs italic">"{item.vietnamese}"</p>
                      <textarea 
                        rows="1" 
                        className={`w-full bg-black border rounded-2xl p-3 text-sm font-bold outline-none resize-none ${status === 'correct' ? 'border-green-500 text-green-400' : status === 'incorrect' ? 'border-red-500 text-red-400' : 'border-zinc-700 text-white'}`}
                        placeholder="Dịch sang tiếng Anh..."
                        value={quizAnswers[item.id] || ''}
                        onChange={(e) => setQuizAnswers({...quizAnswers, [item.id]: e.target.value})}
                      />
                    </div>
                  ) : (
                    <>
                      <p className="text-white font-bold leading-tight text-lg">{item.english}</p>
                      <p className="text-zinc-500 text-sm italic mt-1">{item.vietnamese}</p>
                    </>
                  )}
                </div>
                <button onClick={() => speak(item.english)} className={`p-3 rounded-2xl ${status === 'correct' ? 'bg-green-500 text-white' : 'bg-zinc-800 text-green-500'}`}><Volume2 /></button>
              </div>
            )
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans">
      {selectedCategory ? renderDetail() : renderHome()}
      
      {isAddingItem && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-zinc-900 w-full max-w-md rounded-[32px] p-8 border border-zinc-800 shadow-2xl animate-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black uppercase tracking-tight">Thêm {activeTab==='vocab'?'Từ Vựng':'Mẫu Câu'}</h2>
              <button onClick={() => setIsAddingItem(false)} className="p-2 bg-zinc-800 rounded-full text-zinc-500"><X/></button>
            </div>
            <form onSubmit={handleAddItem} className="space-y-4">
              {activeTab === 'vocab' ? (
                <>
                  <input required className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl p-4 text-white outline-none focus:border-blue-500" placeholder="Từ tiếng Anh" value={newItem.word} onChange={e => setNewItem({...newItem, word: e.target.value})} />
                  <div className="flex gap-2">
                    {WORD_TYPES.map(t => <button key={t} type="button" onClick={()=>setNewItem({...newItem, type:t})} className={`flex-1 py-2 rounded-xl text-[10px] font-black border ${newItem.type===t?'bg-blue-600 border-blue-600 text-white':'border-zinc-700 text-zinc-500'}`}>{t}</button>)}
                  </div>
                  <input required className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl p-4 text-white outline-none focus:border-blue-500" placeholder="Nghĩa tiếng Việt" value={newItem.meaning} onChange={e => setNewItem({...newItem, meaning: e.target.value})} />
                  <input className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl p-4 text-white outline-none focus:border-blue-500 text-sm" placeholder="Link ảnh (không bắt buộc)" value={newItem.image} onChange={e => setNewItem({...newItem, image: e.target.value})} />
                </>
              ) : (
                <>
                  <textarea required className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl p-4 text-white outline-none focus:border-green-500 min-h-[100px]" placeholder="Câu tiếng Anh" value={newItem.english} onChange={e => setNewItem({...newItem, english: e.target.value})} />
                  <textarea required className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl p-4 text-white outline-none focus:border-green-500" placeholder="Nghĩa tiếng Việt" value={newItem.vietnamese} onChange={e => setNewItem({...newItem, vietnamese: e.target.value})} />
                </>
              )}
              <button className={`w-full py-5 rounded-2xl font-black text-white shadow-xl transition-transform active:scale-95 ${activeTab==='vocab'?'bg-blue-600 shadow-blue-900/20':'bg-green-600 shadow-green-900/20'}`}>LƯU DỮ LIỆU</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
