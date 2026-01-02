const { useState, useEffect } = React;
// Lấy các thành phần giao diện đã được tách ra từ file giao-dien.js
const { Home, Detail } = window.AppComponents;

function App() {
  // --- 1. QUẢN LÝ TRẠNG THÁI (STATE) ---
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeTab, setActiveTab] = useState('vocab');
  const [isFlashcardMode, setIsFlashcardMode] = useState(false);
  
  // Khởi tạo dữ liệu từ localStorage hoặc dữ liệu mẫu
  const [words, setWords] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('words'));
    return (saved && saved.length > 0) ? saved : (window.DATA_WORDS || []);
  });
  
  const [sentences, setSentences] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('sentences'));
    return (saved && saved.length > 0) ? saved : (window.DATA_SENTENCES || []);
  });
  // Thêm State lưu điểm số
  const [score, setScore] = React.useState({ correct: 0, incorrect: 0 });

  //Thêm State để quản lý việc thu âm
  const [isListening, setIsListening] = React.useState(false);

  // Trạng thái giao diện Form và Sửa đổi
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState(null); 
  const [newItem, setNewItem] = useState({ word: '', type: 'Noun', meaning: '', image: '', english: '', vietnamese: '' });
  
  // Trạng thái tìm kiếm
  const [homeSearchQuery, setHomeSearchQuery] = useState('');
  const [homeSearchVisible, setHomeSearchVisible] = useState(false);
  const [detailSearchQuery, setDetailSearchQuery] = useState('');
  const [detailSearchVisible, setDetailSearchVisible] = useState(false);
  
  // Trạng thái nút quay lại đầu trang
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Trạng thái học tập (Quiz)
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});

  // --- 2. TỰ ĐỘNG LƯU DỮ LIỆU ---
  useEffect(() => {
    localStorage.setItem('words', JSON.stringify(words));
    localStorage.setItem('sentences', JSON.stringify(sentences));
  }, [words, sentences]);

  // --- 3. THEO DÕI SỰ KIỆN CUỘN TRANG ---
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- 4. LOGIC XỬ LÝ ẢNH (FileReader) ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItem({ ...newItem, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // --- 5. LOGIC XỬ LÝ DỮ LIỆU (Thêm/Sửa/Xóa) ---
  
  // Hàm mở form để sửa
  const handleStartEdit = (item) => {
    setEditingItem(item);
    setNewItem(item); 
    setIsAddingItem(true);
  };

  // Hàm Xóa mục 
  const handleDeleteItem = () => {
    if (window.confirm(`Bạn có chắc muốn xóa ${activeTab === 'vocab' ? 'từ' : 'câu'} này không?`)) {
      if (activeTab === 'vocab') {
        setWords(words.filter(w => w.id !== editingItem.id));
      } else {
        setSentences(sentences.filter(s => s.id !== editingItem.id));
      }
      closeAndResetForm();
    }
  };

  // Hàm Lưu (Save/Update)
  const handleSaveItem = (e) => {
    e.preventDefault();
    if (editingItem) {
      // Logic Cập nhật
      if (activeTab === 'vocab') {
        setWords(words.map(w => w.id === editingItem.id ? { ...newItem } : w));
      } else {
        setSentences(sentences.map(s => s.id === editingItem.id ? { ...newItem } : s));
      }
    } else {
      // Logic Thêm mới
      const id = Date.now().toString();
      const itemToAdd = { ...newItem, id, category: selectedCategory.id };
      if (activeTab === 'vocab') setWords([...words, itemToAdd]);
      else setSentences([...sentences, itemToAdd]);
    }
    closeAndResetForm();
  };

  const closeAndResetForm = () => {
    setEditingItem(null);
    setNewItem({ word: '', type: 'Noun', meaning: '', image: '', english: '', vietnamese: '' });
    setIsAddingItem(false);
  };

  // --- 6. RENDER GIAO DIỆN ---
  return (
    <div className="min-h-screen bg-black text-zinc-100 pb-10 font-sans selection:bg-blue-500/30">
      {selectedCategory ? (
        <Detail 
          isFlashcardMode={isFlashcardMode}
          setIsFlashcardMode={setIsFlashcardMode}
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
          onEdit={handleStartEdit} 
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

      {/* MODAL THÊM/SỬA MỚI */}
      {isAddingItem && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[200] flex items-end sm:items-center justify-center p-4">
          <div className="bg-zinc-900 w-full max-w-md rounded-[32px] p-8 border border-zinc-800 shadow-2xl animate-in slide-in-from-bottom duration-300 relative overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-xl font-black italic tracking-tighter uppercase">
                  {editingItem ? 'Cập nhật' : 'Thêm'} {activeTab === 'vocab' ? 'Từ vựng' : 'Mẫu câu'}
                </h2>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Chủ đề: {selectedCategory?.title}</p>
              </div>
              <button onClick={() => { setIsAddingItem(false); setEditingItem(null); }} className="p-2 bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors">
                <window.LearningLogic.Icons.X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSaveItem} className="space-y-6">
              {activeTab === 'vocab' ? (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Từ vựng (English)</label>
                    <input required autoFocus placeholder="Gõ từ tiếng Anh..." className="w-full bg-black border border-zinc-800 rounded-2xl p-4 outline-none focus:border-blue-500 transition-all text-white font-medium" value={newItem.word} onChange={e=>setNewItem({...newItem, word: e.target.value})} />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Loại từ (Word Type)</label>
                    <div className="grid grid-cols-4 gap-2 bg-black border border-zinc-800 p-1.5 rounded-2xl">
                      {['Noun', 'Verb', 'Adj', 'Adv'].map((type) => (
                        <button key={type} type="button" onClick={() => setNewItem({ ...newItem, type: type })} className={`py-3 rounded-xl text-[11px] font-black transition-all duration-200 ${newItem.type === type ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 scale-[1.02]' : 'text-zinc-500 hover:text-zinc-300'}`}>
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Nghĩa tiếng Việt</label>
                    <input required placeholder="Nghĩa của từ..." className="w-full bg-black border border-zinc-800 rounded-2xl p-4 outline-none focus:border-blue-500 transition-all text-white font-medium" value={newItem.meaning} onChange={e=>setNewItem({...newItem, meaning: e.target.value})} />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Hình ảnh (Link hoặc Tải lên)</label>
                    <div className="flex gap-2">
                      <input placeholder="Dán link ảnh..." className="flex-1 bg-black border border-zinc-800 rounded-2xl p-4 outline-none focus:border-blue-500 text-white text-sm" value={newItem.image} onChange={e=>setNewItem({...newItem, image: e.target.value})} />
                      <label className="bg-zinc-800 p-4 rounded-2xl cursor-pointer hover:bg-zinc-700 transition-colors flex items-center justify-center">
                        <window.LearningLogic.Icons.ImageIcon size={20} />
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                      </label>
                    </div>
                    {newItem.image && (
                      <div className="mt-2 relative group w-20 h-20">
                        <img src={newItem.image} className="w-20 h-20 object-cover rounded-xl border border-zinc-800" />
                        <button type="button" onClick={() => setNewItem({...newItem, image: ''})} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          <window.LearningLogic.Icons.X size={12} />
                        </button>
                      </div>
                    )}
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

              {/* NÚT ĐIỀU KHIỂN */}
              <div className="flex flex-col gap-3">
                <button type="submit" className="w-full bg-white text-black font-black py-5 rounded-[22px] active:scale-95 transition-all shadow-xl shadow-white/5 hover:bg-zinc-200 uppercase tracking-widest text-sm">
                  {editingItem ? 'Cập nhật hệ thống' : 'Lưu vào hệ thống'}
                </button>

                {editingItem && (
                  <button 
                    type="button" 
                    onClick={handleDeleteItem}
                    className="w-full bg-red-500/10 text-red-500 font-bold py-4 rounded-[22px] active:scale-95 transition-all hover:bg-red-500/20 uppercase tracking-widest text-[11px] flex items-center justify-center gap-2"
                  >
                    <window.LearningLogic.Icons.X size={14} />
                    Xóa mục này khỏi máy
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NÚT QUAY LẠI ĐẦU TRANG */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-2 z-[100] p-2.5 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-xl text-zinc-500 hover:text-white shadow-2xl active:scale-90 transition-all animate-in fade-in zoom-in duration-300"
          title="Quay lại đầu trang"
        >
          <window.LearningLogic.Icons.ArrowUp size={18} />
        </button>
      )}
    </div>
  );
} // <--- Dấu đóng hàm App quan trọng

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
