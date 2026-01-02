const { Icons } = window.LearningLogic;

window.AppComponents = {
  // --- MÀN HÌNH TRANG CHỦ ---
  Home: ({ 
    categories, words, sentences, homeSearchQuery, setHomeSearchQuery, 
    homeSearchVisible, setHomeSearchVisible, onSelectCategory 
  }) => {
    const q = homeSearchQuery.toLowerCase().trim();
    const filteredCats = categories.filter(c => 
      !q || c.title.toLowerCase().includes(q) || c.subtitle.toLowerCase().includes(q)
    );

    return (
      <div className="max-w-[1600px] mx-auto px-4 py-8 animate-in">
        <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-md py-4 -mt-8 mb-8 flex items-center justify-between h-[80px]">
          <div>
            <h1 className="text-2xl font-black italic tracking-tighter text-white uppercase leading-none">Learn English</h1>
            <p className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.3em] mt-1">Smart Education</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {homeSearchVisible && (
              <input 
                autoFocus 
                placeholder="Tìm chủ đề..." 
                className="bg-zinc-900 border border-zinc-800 rounded-2xl py-2 px-4 text-sm text-white outline-none w-48 focus:border-blue-500 transition-all" 
                value={homeSearchQuery} 
                onChange={e => setHomeSearchQuery(e.target.value)} 
              />
            )}
            <button 
              onClick={() => setHomeSearchVisible(!homeSearchVisible)} 
              className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400 hover:text-white transition-colors shrink-0"
            >
              {homeSearchVisible ? <Icons.X /> : <Icons.SearchIcon />}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-4">
          {filteredCats.map(cat => (
            <button key={cat.id} onClick={() => onSelectCategory(cat)} className="flex items-center p-4 bg-zinc-900/50 rounded-[28px] border border-zinc-800 hover:border-zinc-700 transition-all text-left group">
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700 shadow-xl">
                <img src={cat.icon} className="w-full h-full object-cover" onError={e => { e.target.style.display='none'; e.target.parentNode.innerHTML='📚'; }} />
              </div>
              <div className="flex-1 ml-4 min-w-0">
                <h3 className="text-white font-bold truncate text-lg leading-tight">{cat.title}</h3>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-zinc-500 text-xs font-medium italic truncate">{cat.subtitle}</p>
                  <div className="flex gap-2 text-zinc-600 text-[10px] font-black uppercase shrink-0 ml-2">
                    <span className="flex items-center gap-1"><Icons.TypeIcon className="w-3 h-3"/> {words.filter(w=>w.category===cat.id).length}</span>
                    <span className="flex items-center gap-1"><Icons.MessageSquare className="w-3 h-3"/> {sentences.filter(s=>s.category===cat.id).length}</span>
                  </div>
                </div>
              </div>
              <div className="ml-2 text-zinc-700 group-hover:text-zinc-400 transition-transform group-hover:translate-x-1 shrink-0">
                <Icons.ChevronRight />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  },

// --- MÀN HÌNH CHI TIẾT ---
  Detail: (props) => {
    const { 
      selectedCategory, activeTab, setActiveTab, words, sentences, 
      detailSearchQuery, setDetailSearchQuery, detailSearchVisible, setDetailSearchVisible,
      isQuizMode, setIsQuizMode, setIsAddingItem, onEdit, 
      isFlashcardMode, setIsFlashcardMode,
      quizAnswers, setQuizAnswers, onBack 
    } = props;

    const q = (detailSearchQuery || "").toLowerCase().trim();
    const filteredWords = words.filter(w => w.category === selectedCategory.id && (!q || w.word.toLowerCase().includes(q) || w.meaning.toLowerCase().includes(q)));
    const filteredSentences = sentences.filter(s => s.category === selectedCategory.id && (!q || s.english.toLowerCase().includes(q) || s.vietnamese.toLowerCase().includes(q)));

    const checkAnswer = (input, original) => {
      if (!input) return 'pending';
      return input.toLowerCase().trim() === original.toLowerCase().trim() ? 'correct' : 'incorrect';
    };

    const speak = (text) => {
      window.speechSynthesis.cancel();
      const msg = new SpeechSynthesisUtterance(text);
      msg.lang = 'en-US';
      window.speechSynthesis.speak(msg);
    };

    return (
      // Thêm class detail-main-container để quản lý chiều ngang iPhone
      <div className="max-w-[1600px] mx-auto px-1.5 py-4 animate-in detail-main-container">
        {/* Header giữ nguyên logic cũ, chỉ thêm pt- cho Dynamic Island */}
        <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-md py-4 -mt-4 mb-6 flex items-center gap-2 pt-[env(safe-area-inset-top,16px)]">
          <button onClick={onBack} className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400 hover:text-white shrink-0">
            <Icons.ChevronLeft />
          </button>
          
          <div className="flex bg-zinc-900 p-1 rounded-2xl border border-zinc-800 flex-1 relative overflow-hidden h-[52px] items-center">
            {detailSearchVisible ? (
              <div className="flex items-center w-full px-2">
                <div className="text-zinc-500 mr-2 shrink-0"><Icons.SearchIcon size={18} /></div>
                <input autoFocus placeholder="Tìm nhanh..." className="bg-transparent text-white text-sm font-bold outline-none w-full py-2" value={detailSearchQuery} onChange={e => setDetailSearchQuery(e.target.value)} />
                <button onClick={() => { setDetailSearchVisible(false); setDetailSearchQuery(''); }} className="text-zinc-500 shrink-0"><Icons.X /></button>
              </div>
            ) : (
              <div className="flex w-full gap-1">
                <button onClick={() => setActiveTab('vocab')} className={`flex-1 flex items-center justify-center py-2.5 rounded-xl transition-all ${activeTab === 'vocab' ? 'bg-zinc-800 text-blue-500 shadow-inner' : 'text-zinc-600'}`}>
                  <Icons.TypeIcon size={20} strokeWidth={2.5} />
                </button>
                <button onClick={() => setActiveTab('sentences')} className={`flex-1 flex items-center justify-center py-2.5 rounded-xl transition-all ${activeTab === 'sentences' ? 'bg-zinc-800 text-green-500 shadow-inner' : 'text-zinc-600'}`}>
                  <Icons.MessageSquare size={20} strokeWidth={2.5} />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {!detailSearchVisible && (
              <button onClick={() => setDetailSearchVisible(true)} className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-white shrink-0">
                <Icons.SearchIcon size={20} />
              </button>
            )}
            <button onClick={() => setIsFlashcardMode(true)} className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-yellow-500 hover:bg-yellow-500/10 transition-all shrink-0">
              <Icons.Layers size={20} />
            </button>
            <button onClick={() => setIsQuizMode(!isQuizMode)} className={`p-3 rounded-2xl border transition-all shrink-0 ${isQuizMode ? 'bg-orange-600 border-orange-600 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>
              <Icons.ShieldCheck size={20} />
            </button>
            <button onClick={() => setIsAddingItem(true)} className="bg-blue-600 p-3 rounded-2xl text-white active:scale-90 transition-transform shrink-0 shadow-lg shadow-blue-900/20">
              <Icons.Plus size={20} />
            </button>
          </div>
        </div>

        {/* Thêm class responsive-grid để ép 1 cột trên iPhone */}
        <div className={`grid gap-2 pb-24 responsive-grid ${activeTab === 'vocab' ? 'grid-cols-[repeat(auto-fill,minmax(320x,1fr))]' : 'grid-cols-[repeat(auto-fill,minmax(320px,1fr))]'}`}>
          {activeTab === 'vocab' ? filteredWords.map(item => {
            const status = checkAnswer(quizAnswers[item.id], item.word);
            return (
              <div key={item.id} className={`bg-zinc-900/50 p-4 rounded-[28px] border transition-all flex gap-4 items-center h-[120px] ${isQuizMode && status === 'correct' ? 'border-green-500 bg-green-500/5' : isQuizMode && status === 'incorrect' ? 'border-red-500 bg-red-500/5' : 'border-zinc-800'}`}>
                <div className="w-20 h-20 rounded-2xl bg-zinc-800 overflow-hidden shrink-0 border border-zinc-800">
                  {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-zinc-700"><Icons.ImageIcon /></div>}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                   <span className="text-[10px] text-blue-500 font-black uppercase mb-0.5">{item.type}</span>
                   {isQuizMode ? (
                     <input className={`w-full bg-black border rounded-xl px-3 py-1.5 text-sm font-bold outline-none ${status==='correct'?'border-green-500 text-green-400':'border-zinc-700 text-white'}`} placeholder="Gõ từ..." value={quizAnswers[item.id]||''} onChange={e=>setQuizAnswers({...quizAnswers,[item.id]:e.target.value})} />
                   ) : (
                     <h3 className="text-white font-bold text-lg truncate">{item.word}</h3>
                   )}
                   <div className="flex items-center justify-between mt-1">
                      <p className="text-zinc-500 text-sm truncate pr-2">{item.meaning}</p>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => onEdit(item)} className="text-zinc-600 hover:text-yellow-500 p-1 shrink-0"><Icons.Edit size={16} /></button>
                        <button onClick={() => window.LearningLogic.copyToClipboard(item.word)} className="text-zinc-600 hover:text-blue-500 p-1 shrink-0"><Icons.Copy size={16} /></button>
                        <button onClick={() => speak(item.word)} className="text-zinc-500 hover:text-white p-1 shrink-0"><Icons.Volume2 size={18} /></button>
                      </div>
                   </div>
                </div>
              </div>
            );
          }) : filteredSentences.map(item => {
            const status = checkAnswer(quizAnswers[item.id], item.english);
            return (
              <div key={item.id} className={`bg-zinc-900/50 p-4 rounded-[28px] border transition-all flex items-center h-[110px] gap-4 ${isQuizMode && status === 'correct' ? 'border-green-500 bg-green-500/5' : isQuizMode && status === 'incorrect' ? 'border-red-500 bg-red-500/5' : 'border-zinc-800'}`}>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  {isQuizMode ? (
                    <textarea rows="1" className={`w-full bg-black border rounded-xl p-2.5 text-sm font-bold outline-none resize-none ${status==='correct'?'border-green-500 text-green-400':'border-zinc-700 text-white'}`} placeholder="Dịch câu..." value={quizAnswers[item.id]||''} onChange={e=>setQuizAnswers({...quizAnswers,[item.id]:e.target.value})} />
                  ) : (
                    <p className="text-white font-bold text-lg break-words whitespace-normal">{item.english}</p>
                  )}
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-zinc-500 text-sm italic truncate pr-2">{item.vietnamese}</p>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => onEdit(item)} className="text-zinc-600 hover:text-yellow-500 p-1 shrink-0"><Icons.Edit size={16} /></button>
                      <button onClick={() => window.LearningLogic.copyToClipboard(item.english)} className="text-zinc-600 hover:text-blue-500 p-1 shrink-0"><Icons.Copy size={16} /></button>
                      <button onClick={() => speak(item.english)} className="text-zinc-500 hover:text-white p-1 shrink-0"><Icons.Volume2 size={18} /></button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        

        <FlashcardModal 
          isOpen={isFlashcardMode} 
          onClose={() => setIsFlashcardMode(false)} 
          items={activeTab === 'vocab' ? filteredWords : filteredSentences}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
      
    );
  }
}





const FlashcardModal = ({ isOpen, onClose, items }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [userInput, setUserInput] = React.useState('');
  const [checkStatus, setCheckStatus] = React.useState('pending');
  const [studyMode, setStudyMode] = React.useState('learn');
  const [score, setScore] = React.useState({ correct: 0, incorrect: 0 });
  const [isListening, setIsListening] = React.useState(false);
  const [audioLevel, setAudioLevel] = React.useState(0);

  const currentItem = items[currentIndex];
  const englishText = currentItem?.word || currentItem?.english || "";
  const vietnameseText = currentItem?.meaning || currentItem?.vietnamese || "";

  const speak = (text) => {
    if (!text || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'en-US';
    msg.rate = 0.9;
    window.speechSynthesis.speak(msg);
  };

  const handleCheckText = (e) => {
    if (e) e.preventDefault();
   // Hàm làm sạch: Chuyển chữ thường, xóa tất cả dấu câu đặc biệt
    const clean = (str) => (str || '').toLowerCase().trim().replace(/[.,?\/#!$%\^&\*;:{}=\-_`~()]/g, "").replace(/\s+/g, " ");
    
    // So sánh chuỗi đã được làm sạch
    const isCorrect = clean(userInput) === clean(englishText);
    if (isCorrect) {
      setCheckStatus('correct');
      setScore(p => ({ ...p, correct: p.correct + 1 }));
      speak(englishText);
      setTimeout(() => nextCard(), 1200);
    } else {
      setCheckStatus('incorrect');
      setScore(p => ({ ...p, incorrect: p.incorrect + 1 }));
    }
  };

  const handleVoiceTest = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 64;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setCheckStatus('pending');
        const updateLevel = () => {
          if (!window.isRec) { setAudioLevel(0); return; }
          analyser.getByteFrequencyData(dataArray);
          setAudioLevel((dataArray.reduce((a, b) => a + b) / dataArray.length) * 2);
          requestAnimationFrame(updateLevel);
        };
        window.isRec = true;
        updateLevel();
      };

      recognition.onend = () => {
        setIsListening(false);
        window.isRec = false;
        stream.getTracks().forEach(t => t.stop());
      };

      recognition.onresult = (event) => {
        const resultRaw = event.results[0][0].transcript;
        
        // Hàm làm sạch giống hệt bên trên
        const clean = (str) => (str || '').toLowerCase().trim().replace(/[.,?\/#!$%\^&\*;:{}=\-_`~()]/g, "").replace(/\s+/g, " ");
        
        const result = clean(resultRaw);
        const target = clean(englishText);
        
        setUserInput(resultRaw); // Vẫn hiển thị nguyên văn câu bạn vừa nói

        if (result === englishText.toLowerCase().trim()) {
          setCheckStatus('correct');
          setScore(p => ({ ...p, correct: p.correct + 1 }));
          speak(englishText);
          setTimeout(() => nextCard(), 1500);
        } else {
          setCheckStatus('incorrect');
          setScore(p => ({ ...p, incorrect: p.incorrect + 1 }));
        }
      };
      recognition.start();
    } catch (err) { alert("Cấp quyền Micro để dùng tính năng này!"); }
  };

  const nextCard = () => {
    if (currentIndex < items.length - 1) setCurrentIndex(prev => prev + 1);
  };

  React.useEffect(() => {
    setUserInput('');
    setCheckStatus('pending');
    setIsFlipped(false);
    if (isOpen && (studyMode === 'learn' || studyMode === 'listen')) {
      speak(englishText);
    }
  }, [currentIndex, studyMode, isOpen]);

  if (!isOpen || !currentItem) return null;

  return (
    <div className="fixed inset-0 bg-black z-[1000] flex flex-col iphone-optimized-modal backdrop-blur-3xl overflow-hidden">
      
      {/* HEADER: Tối ưu khoảng cách cho Dynamic Island */}
      <div className="w-full px-6 flex justify-between items-center h-16 shrink-0">
        <div className="text-zinc-500 font-bold text-xs uppercase tracking-widest">
          {currentIndex + 1} / {items.length}
        </div>
        <div className="flex gap-3">
          <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-500 text-xs font-bold">✓ {score.correct}</div>
          <div className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-red-500 text-xs font-bold">✕ {score.incorrect}</div>
        </div>
        <button onClick={onClose} className="p-2 bg-zinc-800 rounded-full text-white active:scale-90">
          <Icons.X size={18}/>
        </button>
      </div>

      {/* MODE SELECTOR: Giữ nguyên các chế độ cũ */}
      <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-2xl mx-6 mb-4 shrink-0 overflow-x-auto no-scrollbar">
        {[
          { id: 'learn', icon: <Icons.Layers size={18}/> },
          { id: 'listen', icon: <Icons.Volume2 size={18}/> },
          { id: 'meaning', icon: <Icons.BookA size={18}/> },
          { id: 'image', icon: <Icons.ImageIcon size={18}/> },
          { id: 'voice_test', icon: <Icons.Mic size={18}/> }
        ].map(mode => (
          <button 
            key={mode.id}
            onClick={() => setStudyMode(mode.id)}
            className={`flex-1 flex justify-center py-3 rounded-xl transition-all ${studyMode === mode.id ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-600'}`}
          >
            {mode.icon}
          </button>
        ))}
      </div>

      {/* CARD: Tối ưu tỉ lệ hiển thị cho màn hình dài (Flex-grow) */}
      <div className="flex-1 flex items-center justify-center px-6 perspective-1000">
        <div 
          className="relative w-full aspect-[3/4] max-h-[450px] transition-all duration-500 shadow-2xl"
          style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* FRONT */}
          <div className="absolute inset-0 bg-zinc-900 border border-zinc-800 rounded-[40px] flex flex-col items-center justify-center p-8 backface-hidden">
            <button 
              onClick={(e) => { e.stopPropagation(); speak(englishText); }}
              className="absolute top-6 right-6 p-4 bg-zinc-800 hover:bg-zinc-700 rounded-full text-blue-400"
            >
              <Icons.Volume2 size={24} />
            </button>

            {studyMode === 'voice_test' ? (
              <div className="flex flex-col items-center text-center gap-6">
                 <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-red-500/20 blur-xl animate-pulse" 
                         style={{ transform: `scale(${1 + audioLevel/50})`, transition: 'transform 0.1s' }} />
                    <div className="text-4xl font-black text-white mb-2 leading-tight">{englishText}</div>
                 </div>
                 <div className="text-lg text-zinc-500 font-medium italic">{vietnameseText}</div>
                 <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${isListening ? 'bg-red-500 text-white animate-bounce' : 'bg-zinc-800 text-zinc-400'}`}>
                    {isListening ? "Hãy đọc ngay..." : "Sẵn sàng thu âm"}
                 </div>
              </div>
            ) : (
              <div className="text-center">
                {studyMode === 'learn' && <div className="text-5xl font-black text-white leading-tight">{englishText}</div>}
                {studyMode === 'listen' && <Icons.Volume2 size={80} className="text-blue-500 animate-bounce" />}
                {studyMode === 'meaning' && <div className="text-4xl font-bold text-green-500 leading-tight">{vietnameseText}</div>}
                {studyMode === 'image' && (currentItem.image ? <img src={currentItem.image} className="w-56 h-56 object-cover rounded-3xl" /> : <Icons.ImageIcon size={80} className="text-zinc-800" />)}
              </div>
            )}
            
            <p className="absolute bottom-8 text-zinc-600 text-[10px] font-bold uppercase tracking-widest">Bấm thẻ để xem đáp án</p>
          </div>

          {/* BACK */}
          <div className="absolute inset-0 bg-blue-600 rounded-[40px] flex flex-col items-center justify-center p-8 backface-hidden shadow-2xl" style={{ transform: 'rotateY(180deg)' }}>
            <div className="text-white/60 text-xs font-bold uppercase mb-2">Ý nghĩa</div>
            <div className="text-4xl font-black text-white text-center mb-6 leading-tight">{vietnameseText}</div>
            <div className="h-1 w-12 bg-white/20 rounded-full mb-6" />
            <div className="text-2xl font-bold text-white/90">{englishText}</div>
            <p className="absolute bottom-8 text-white/50 text-[10px] font-bold uppercase tracking-widest">Chạm để quay lại</p>
          </div>
        </div>
      </div>

      {/* INPUT & CONTROL: Đưa vào Thumb-zone (Sát đáy cho ngón cái) */}
      <div className="w-full px-6 pt-4 pb-8 thumb-zone shrink-0 bg-black/50">
        {studyMode === 'voice_test' ? (
          <div className="flex flex-col items-center gap-4">
             <div className={`w-full p-4 rounded-3xl border-2 text-center text-lg font-bold transition-all min-h-[64px] flex items-center justify-center ${
                checkStatus === 'correct' ? 'border-green-500 bg-green-500/10 text-green-500' :
                checkStatus === 'incorrect' ? 'border-red-500 bg-red-500/10 text-red-500 animate-shake' : 'border-zinc-800 text-zinc-500 bg-zinc-900/50'
             }`}>
                {userInput || "Kết quả sẽ hiện ở đây..."}
             </div>
             <button 
                onClick={(e) => { e.stopPropagation(); handleVoiceTest(); }}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-2xl ${isListening ? 'bg-red-500 scale-110' : 'bg-white text-black active:scale-95'}`}
             >
                <Icons.Mic size={32} />
             </button>
          </div>
        ) : studyMode !== 'learn' ? (
          <form onSubmit={handleCheckText} className="relative group">
            <input 
              autoCapitalize="none"
              autoComplete="off"
              className={`w-full bg-zinc-900 border-2 rounded-[28px] p-5 text-center text-xl font-bold transition-all outline-none shadow-xl ${
                checkStatus === 'correct' ? 'border-green-500 text-green-500' :
                checkStatus === 'incorrect' ? 'border-red-500 text-red-500 animate-shake' : 'border-zinc-800 text-white focus:border-blue-500'
              }`}
              placeholder="Gõ từ tiếng Anh..."
              value={userInput}
              onChange={(e) => {setUserInput(e.target.value); setCheckStatus('pending');}}
            />
            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-blue-600 rounded-full text-white shadow-lg active:scale-90">
              <Icons.ChevronRight />
            </button>
          </form>
        ) : (
          <div className="flex justify-between gap-4">
            <button onClick={() => setCurrentIndex(p => Math.max(0, p-1))} className="flex-1 py-5 bg-zinc-900 border border-zinc-800 rounded-2xl text-white flex justify-center active:bg-zinc-800 active:scale-95 transition-all">
              <Icons.ChevronLeft size={24}/>
            </button>
            <button onClick={() => setCurrentIndex(p => Math.min(items.length-1, p+1))} className="flex-1 py-5 bg-zinc-900 border border-zinc-800 rounded-2xl text-white flex justify-center active:bg-zinc-800 active:scale-95 transition-all">
              <Icons.ChevronRight size={24}/>
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
