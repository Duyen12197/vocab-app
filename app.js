const { useState, useMemo, useRef, useEffect } = React;

// --- 1. SVG ICONS (Đồng bộ iOS Style) ---
const ChevronRight = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;
const ChevronLeft = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>;
const Plus = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>;
const ImageIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>;
const Volume2 = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>;
const X = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>;
const SearchIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const MessageSquare = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const TypeIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>;
const ShieldCheck = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>;

// --- 2. DATA (10 Chủ đề đồng bộ tên file assets) ---
const CATEGORIES = [
  { id: '1', title: 'Gia đình', subtitle: 'Family', icon: './assets/gia-dinh.png' },
  { id: '2', title: 'Bản thân', subtitle: 'Myself', icon: './assets/ban-than.png' },
  { id: '3', title: 'Số đếm & thời gian', subtitle: 'Numbers & Time', icon: './assets/so-dem-thoi-gian.png' },
  { id: '4', title: 'Màu sắc & hình dạng', subtitle: 'Colors & Shapes', icon: './assets/mau-sac-hinh-dang.png' },
  { id: '5', title: 'Đồ vật xung quanh', subtitle: 'Objects', icon: './assets/do-vat-xung-quanh.png' },
  { id: '6', title: 'Nhà cửa', subtitle: 'House', icon: './assets/nha-cua.png' },
  { id: '7', title: 'Thức ăn & đồ uống', subtitle: 'Food & Drink', icon: './assets/thuc-an-do-uong.png' },
  { id: '8', title: 'Mua sắm', subtitle: 'Shopping', icon: './assets/mua-sam.png' },
  { id: '9', title: 'Giao thông', subtitle: 'Transportation', icon: './assets/giao-thong.png' },
  { id: '10', title: 'Sức khỏe', subtitle: 'Health', icon: './assets/suc-khoe.png' },
];

const WORD_TYPES = ['Noun', 'Verb', 'Adj', 'Adv'];

function App() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeTab, setActiveTab] = useState('vocab');
  const [words, setWords] = useState(() => JSON.parse(localStorage.getItem('words')) || []);
  const [sentences, setSentences] = useState(() => JSON.parse(localStorage.getItem('sentences')) || []);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({ word: '', type: 'Noun', meaning: '', image: '', english: '', vietnamese: '' });
  
  const [homeSearchQuery, setHomeSearchQuery] = useState('');
  const [homeSearchVisible, setHomeSearchVisible] = useState(false);
  const [detailSearchQuery, setDetailSearchQuery] = useState('');
  const [detailSearchVisible, setDetailSearchVisible] = useState(false);

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
    const voice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Samantha')) || voices.find(v => v.lang.startsWith('en'));
    if (voice) utterance.voice = voice;
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const checkAnswer = (id, original) => {
    const input = (quizAnswers[id] || '').trim().toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
    const target = original.trim().toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
    if (!input) return 'neutral';
    return input === target ? 'correct' : 'incorrect';
  };

  const renderHome = () => {
    const q = homeSearchQuery.toLowerCase().trim();
    const filteredCats = CATEGORIES.filter(c => !q || c.title.toLowerCase().includes(q) || c.subtitle.toLowerCase().includes(q));

    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-in">
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter text-white">LEARN ENGLISH</h1>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Smart Education</p>
          </div>
          <div className="flex items-center gap-2">
            {homeSearchVisible && (
              <input autoFocus placeholder="Tìm..." className="bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-4 text-sm text-white outline-none w-32 focus:border-blue-500 transition-all" value={homeSearchQuery} onChange={e => setHomeSearchQuery(e.target.value)} />
            )}
            <button onClick={() => setHomeSearchVisible(!homeSearchVisible)} className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400">
              {homeSearchVisible ? <X /> : <SearchIcon />}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCats.map(cat => (
            <button key={cat.id} onClick={() => setSelectedCategory(cat)} className="flex items-center p-4 bg-zinc-900/50 rounded-[28px] border border-zinc-800 hover:border-zinc-700 transition-all text-left group">
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700 shadow-xl">
                <img src={cat.icon} className="w-full h-full object-cover" onError={e => { e.target.style.display='none'; e.target.parentNode.innerHTML='📚'; }} />
              </div>
              <div className="flex-1 ml-4 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-bold truncate pr-2 text-lg">{cat.title}</h3>
                  <div className="flex gap-2 text-zinc-500 text-[10px] font-black uppercase shrink-0">
                    <span className="flex items-center gap-1"><TypeIcon /> {words.filter(w=>w.category===cat.id).length}</span>
                    <span className="flex items-center gap-1"><MessageSquare /> {sentences.filter(s=>s.category===cat.id).length}</span>
                  </div>
                </div>
                <p className="text-zinc-500 text-xs font-medium italic mt-0.5">{cat.subtitle}</p>
              </div>
              <div className="ml-2 text-zinc-700 group-hover:text-zinc-400"><ChevronRight /></div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderDetail = () => {
    const q = detailSearchQuery.toLowerCase().trim();
    const filteredWords = words.filter(w => w.category === selectedCategory.id && (!q || w.word.toLowerCase().includes(q) || w.meaning.toLowerCase().includes(q)));
    const filteredSentences = sentences.filter(s => s.category === selectedCategory.id && (!q || s.english.toLowerCase().includes(q) || s.vietnamese.toLowerCase().includes(q)));

    return (
      <div className="max-w-4xl mx-auto px-4 py-4 animate-in">
        {/* THANH ĐIỀU HƯỚNG ĐỒNG BỘ HÌNH 4 */}
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => { setSelectedCategory(null); setDetailSearchVisible(false); }} className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400"><ChevronLeft /></button>
          
          <div className="flex bg-zinc-900 p-1 rounded-2xl border border-zinc-800 flex-1 relative overflow-hidden">
            {detailSearchVisible ? (
              <div className="flex items-center w-full px-2">
                <div className="text-zinc-500 mr-2"><SearchIcon /></div>
                <input autoFocus placeholder="Tìm nhanh..." className="bg-transparent text-white text-xs font-bold outline-none w-full" value={detailSearchQuery} onChange={e => setDetailSearchQuery(e.target.value)} />
                <button onClick={() => { setDetailSearchVisible(false); setDetailSearchQuery(''); }} className="text-zinc-500"><X /></button>
              </div>
            ) : (
              <>
                <button onClick={() => setActiveTab('vocab')} className={`flex-1 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${activeTab === 'vocab' ? 'bg-zinc-800 text-blue-500' : 'text-zinc-500'}`}>TỪ VỰNG</button>
                <button onClick={() => setActiveTab('sentences')} className={`flex-1 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${activeTab === 'sentences' ? 'bg-zinc-800 text-green-500' : 'text-zinc-500'}`}>MẪU CÂU</button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!detailSearchVisible && (
              <button onClick={() => setDetailSearchVisible(true)} className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500"><SearchIcon /></button>
            )}
            <button onClick={() => setIsQuizMode(!isQuizMode)} className={`p-3 rounded-2xl border transition-all ${isQuizMode ? 'bg-orange-600 border-orange-600 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}><ShieldCheck /></button>
            <button onClick={() => setIsAddingItem(true)} className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-900/40"><Plus /></button>
          </div>
        </div>

        {/* DANH SÁCH */}
        <div className={activeTab === 'vocab' ? "grid grid-cols-1 sm:grid-cols-2 gap-4 pb-24" : "flex flex-col gap-4 pb-24"}>
          {activeTab === 'vocab' ? filteredWords.map(item => {
            const status = checkAnswer(item.id, item.word);
            return (
              <div key={item.id} className={`bg-zinc-900/50 p-4 rounded-[28px] border transition-all flex gap-4 ${isQuizMode && status === 'correct' ? 'border-green-500' : isQuizMode && status === 'incorrect' ? 'border-red-500' : 'border-zinc-800'}`}>
                <div className="w-20 h-20 rounded-2xl bg-zinc-800 overflow-hidden shrink-0 border border-zinc-800">
                  {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-zinc-800"><ImageIcon /></div>}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                   <div className="flex justify-between items-start">
                     <span className="text-[10px] text-blue-500 font-black uppercase">{item.type}</span>
                     <button onClick={() => speak(item.word)} className="text-zinc-500 hover:text-white transition-colors"><Volume2 /></button>
                   </div>
                   {isQuizMode ? (
                     <input className={`w-full bg-black border rounded-xl px-3 py-1.5 text-sm font-bold mt-1 outline-none ${status==='correct'?'border-green-500 text-green-400':'border-zinc-700'}`} placeholder="Gõ từ..." value={quizAnswers[item.id]||''} onChange={e=>setQuizAnswers({...quizAnswers,[item.id]:e.target.value})} />
                   ) : <h3 className="text-white font-bold text-lg truncate leading-tight">{item.word}</h3>}
                   <p className="text-zinc-500 text-sm truncate">{item.meaning}</p>
                </div>
              </div>
            );
          }) : filteredSentences.map(item => {
            const status = checkAnswer(item.id, item.english);
            return (
              <div key={item.id} className={`bg-zinc-900/50 p-5 rounded-3xl border transition-all flex justify-between items-center gap-4 ${isQuizMode && status === 'correct' ? 'border-green-500' : isQuizMode && status === 'incorrect' ? 'border-red-500' : 'border-zinc-800'}`}>
                <div className="flex-1 min-w-0">
                  {isQuizMode ? (
                    <>
                      <p className="text-zinc-500 text-xs italic mb-2">"{item.vietnamese}"</p>
                      <textarea rows="1" className="w-full bg-black border border-zinc-700 rounded-xl p-3 text-sm font-bold text-white outline-none resize-none" placeholder="Dịch sang tiếng Anh..." value={quizAnswers[item.id]||''} onChange={e=>setQuizAnswers({...quizAnswers,[item.id]:e.target.value})} />
                    </>
                  ) : (
                    <>
                      <p className="text-white font-bold text-lg leading-tight">{item.english}</p>
                      <p className="text-zinc-500 text-sm mt-1 italic">{item.vietnamese}</p>
                    </>
                  )}
                </div>
                <button onClick={() => speak(item.english)} className="p-4 bg-zinc-800 rounded-2xl text-green-500"><Volume2 /></button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 pb-10">
      {selectedCategory ? renderDetail() : renderHome()}
      {isAddingItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-zinc-900 w-full max-w-md rounded-[32px] p-8 border border-zinc-800 animate-in">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black uppercase tracking-tighter">THÊM MỚI</h2>
                <button onClick={()=>setIsAddingItem(false)} className="p-2 bg-zinc-800 rounded-full text-zinc-500"><X /></button>
             </div>
             <form onSubmit={(e) => { e.preventDefault(); const id=Date.now().toString(); if(activeTab==='vocab') setWords([...words,{...newItem,id,category:selectedCategory.id}]); else setSentences([...sentences,{id,english:newItem.english,vietnamese:newItem.vietnamese,category:selectedCategory.id}]); setIsAddingItem(false); setNewItem({word:'',type:'Noun',meaning:'',image:'',english:'',vietnamese:''}); }} className="space-y-4">
               {activeTab==='vocab'?(
                 <>
                   <input required className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl p-4 text-white outline-none focus:border-blue-500" placeholder="Từ tiếng Anh" value={newItem.word} onChange={e=>setNewItem({...newItem,word:e.target.value})} />
                   <div className="flex gap-2">
                     {WORD_TYPES.map(t=><button key={t} type="button" onClick={()=>setNewItem({...newItem,type:t})} className={`flex-1 py-2 rounded-xl text-[10px] font-black border ${newItem.type===t?'bg-blue-600 border-blue-600 text-white':'border-zinc-700 text-zinc-500'}`}>{t}</button>)}
                   </div>
                   <input required className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl p-4 text-white outline-none focus:border-blue-500" placeholder="Nghĩa tiếng Việt" value={newItem.meaning} onChange={e=>setNewItem({...newItem,meaning:e.target.value})} />
                   <input className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl p-4 text-white outline-none text-xs" placeholder="Link ảnh (không bắt buộc)" value={newItem.image} onChange={e=>setNewItem({...newItem,image:e.target.value})} />
                 </>
               ):(
                 <>
                   <textarea required className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl p-4 text-white outline-none min-h-[100px]" placeholder="Câu tiếng Anh" value={newItem.english} onChange={e=>setNewItem({...newItem,english:e.target.value})} />
                   <textarea required className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl p-4 text-white outline-none" placeholder="Nghĩa tiếng Việt" value={newItem.vietnamese} onChange={e=>setNewItem({...newItem,vietnamese:e.target.value})} />
                 </>
               )}
               <button className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-all">Lưu dữ liệu</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
