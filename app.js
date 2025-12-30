const { useState, useEffect } = React;
// Lấy các thành phần giao diện đã được tách ra từ file giao-dien.js
const { Home, Detail } = window.AppComponents;

function App() {
  // --- QUẢN LÝ TRẠNG THÁI (STATE) ---
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeTab, setActiveTab] = useState('vocab');
  
  // Khởi tạo dữ liệu từ localStorage hoặc dữ liệu mẫu
  const [words, setWords] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('words'));
    return (saved && saved.length > 0) ? saved : (window.DATA_WORDS || []);
  });
  
  const [sentences, setSentences] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('sentences'));
    return (saved && saved.length > 0) ? saved : (window.DATA_SENTENCES || []);
  });

  // Trạng thái giao diện
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({ word: '', type: 'Noun', meaning: '', image: '', english: '', vietnamese: '' });
  
  // Trạng thái tìm kiếm
  const [homeSearchQuery, setHomeSearchQuery] = useState('');
  const [homeSearchVisible, setHomeSearchVisible] = useState(false);
  const [detailSearchQuery, setDetailSearchQuery] = useState('');
  const [detailSearchVisible, setDetailSearchVisible] = useState(false);
  
  // Trạng thái học tập (Quiz)
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});

  // --- LƯU TRỮ DỮ LIỆU ---
  useEffect(() => {
    localStorage.setItem('words', JSON.stringify(words));
    localStorage.setItem('sentences', JSON.stringify(sentences));
  }, [words, sentences]);

  // --- LOGIC XỬ LÝ DỮ LIỆU ---
  const handleAddItem = (e) => {
    e.preventDefault();
    const id = Date.now().toString();
    const itemToAdd = { ...newItem, id, category: selectedCategory.id };
    
    if (activeTab === 'vocab') {
      setWords([...words, itemToAdd]);
    } else {
      setSentences([...sentences, itemToAdd]);
    }
    
    // Reset form
    setNewItem({ word: '', type: 'Noun', meaning: '', image: '', english: '', vietnamese: '' });
    setIsAddingItem(false);
  };

  // --- RENDER GIAO DIỆN ---
  return (
    <div className="min-h-screen bg-black text-zinc-100 pb-10 font-sans selection:bg-blue-500/30">
      {selectedCategory ? (
        <Detail 
          selectedCategory={selectedCategory}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          words={words}
          sentences={sentences}
          detailSearchQuery={detailSearchQuery}
          setDetailSearchQuery={setDetailSearchQuery}
          detailSearchVisible={detailSearchVisible}
          setDetailSearchVisible={setDetailSearchVisible}
          isQuizMode={isQuizMode}
          setIsQuizMode={setIsQuizMode}
          setIsAddingItem={setIsAddingItem}
          quizAnswers={quizAnswers}
          setQuizAnswers={setQuizAnswers}
          onBack={() => { 
            setSelectedCategory(null); 
            setDetailSearchVisible(false); 
            setDetailSearchQuery('');
            setQuizAnswers({});
          }}
        />
      ) : (
        <Home 
          categories={window.DATA_CATEGORIES || []}
          words={words}
          sentences={sentences}
          homeSearchQuery={homeSearchQuery}
          setHomeSearchQuery={setHomeSearchQuery}
          homeSearchVisible={homeSearchVisible}
          setHomeSearchVisible={setHomeSearchVisible}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            window.scrollTo(0, 0);
          }}
        />
      )}

      {/* MODAL THÊM MỚI */}
      {isAddingItem && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-zinc-900 w-full max-w-md rounded-[32px] p-8 border border-zinc-800 shadow-2xl animate-in slide-in-from-bottom duration-300 relative">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-xl font-black italic tracking-tighter uppercase">Thêm {activeTab === 'vocab' ? 'Từ vựng' : 'Mẫu câu'}</h2>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Chủ đề: {selectedCategory?.title}</p>
              </div>
              <button onClick={() => setIsAddingItem(false)} className="p-2 bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors">
                <window.LearningLogic.Icons.X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddItem} className="space-y-6">
              {activeTab === 'vocab' ? (
                <>
                  {/* Nhập từ vựng */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Từ vựng (English)</label>
                    <input 
                      required 
                      autoFocus
                      placeholder="Gõ từ tiếng Anh..." 
                      className="w-full bg-black border border-zinc-800 rounded-2xl p-4 outline-none focus:border-blue-500 transition-all text-white font-medium" 
                      value={newItem.word} 
                      onChange={e=>setNewItem({...newItem, word: e.target.value})} 
                    />
                  </div>

                  {/* Bộ chọn loại từ hiện sẵn 4 nút (Thay thế select) */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Loại từ (Word Type)</label>
                    <div className="grid grid-cols-4 gap-2 bg-black border border-zinc-800 p-1.5 rounded-2xl">
                      {['Noun', 'Verb', 'Adj', 'Adv'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setNewItem({ ...newItem, type: type })}
                          className={`py-3 rounded-xl text-[11px] font-black transition-all duration-200 ${
                            newItem.type === type
                              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 scale-[1.02]'
                              : 'text-zinc-500 hover:text-zinc-300'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Nhập nghĩa */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Nghĩa tiếng Việt</label>
                    <input 
                      required 
                      placeholder="Nghĩa của từ..." 
                      className="w-full bg-black border border-zinc-800 rounded-2xl p-4 outline-none focus:border-blue-500 transition-all text-white font-medium" 
                      value={newItem.meaning} 
                      onChange={e=>setNewItem({...newItem, meaning: e.target.value})} 
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Mẫu câu (English)</label>
                    <textarea required placeholder="Câu tiếng Anh..." className="w-full bg-black border border-zinc-800 rounded-2xl p-4 outline-none focus:border-green-500 min-h-[100px] text-white" value={newItem.english} onChange={e=>setNewItem({...newItem, english: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Dịch tiếng Việt</label>
                    <textarea required placeholder="Bản dịch tiếng Việt..." className="w-full bg-black border border-zinc-800 rounded-2xl p-4 outline-none focus:border-green-500 text-white" value={newItem.vietnamese} onChange={e=>setNewItem({...newItem, vietnamese: e.target.value})} />
                  </div>
                </>
              )}

              <button type="submit" className="w-full bg-white text-black font-black py-5 rounded-[22px] active:scale-95 transition-all shadow-xl shadow-white/5 hover:bg-zinc-200 uppercase tracking-widest text-sm">
                Lưu vào hệ thống
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);