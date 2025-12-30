const { Icons, speak, checkAnswer } = window.LearningLogic;

window.AppComponents = {
  // --- MÀN HÌNH TRANG CHỦ (DANH SÁCH CHỦ ĐỀ) ---
  Home: ({ 
    categories, 
    words, 
    sentences, 
    homeSearchQuery, 
    setHomeSearchQuery, 
    homeSearchVisible, 
    setHomeSearchVisible, 
    onSelectCategory 
  }) => {
    const q = homeSearchQuery.toLowerCase().trim();
    const filteredCats = categories.filter(c => 
      !q || c.title.toLowerCase().includes(q) || c.subtitle.toLowerCase().includes(q)
    );

    return (
      <div className="max-w-[1600px] mx-auto px-4 py-8 animate-in">
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase">Learn English</h1>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Smart Education</p>
          </div>
          <div className="flex items-center gap-2">
            {homeSearchVisible && (
              <input 
                autoFocus 
                placeholder="Tìm chủ đề..." 
                className="bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-4 text-sm text-white outline-none w-40 focus:border-blue-500 transition-all" 
                value={homeSearchQuery} 
                onChange={e => setHomeSearchQuery(e.target.value)} 
              />
            )}
            <button 
              onClick={() => setHomeSearchVisible(!homeSearchVisible)} 
              className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400 hover:text-white transition-colors"
            >
              {homeSearchVisible ? <Icons.X /> : <Icons.SearchIcon />}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-4">
          {filteredCats.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => onSelectCategory(cat)} 
              className="flex items-center p-4 bg-zinc-900/50 rounded-[28px] border border-zinc-800 hover:border-zinc-700 transition-all text-left group"
            >
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700 shadow-xl">
                <img 
                  src={cat.icon} 
                  className="w-full h-full object-cover" 
                  onError={e => { e.target.style.display='none'; e.target.parentNode.innerHTML='📚'; }} 
                />
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
              <div className="ml-2 text-zinc-700 group-hover:text-zinc-400 transition-transform group-hover:translate-x-1">
                <Icons.ChevronRight />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  },

  // --- MÀN HÌNH CHI TIẾT (TỪ VỰNG & MẪU CÂU) ---
  Detail: ({ 
    selectedCategory, 
    activeTab, 
    setActiveTab, 
    words, 
    sentences, 
    detailSearchQuery, 
    setDetailSearchQuery, 
    detailSearchVisible, 
    setDetailSearchVisible,
    isQuizMode, 
    setIsQuizMode, 
    setIsAddingItem, 
    quizAnswers, 
    setQuizAnswers, 
    onBack 
  }) => {
    const q = detailSearchQuery.toLowerCase().trim();
    const filteredWords = words.filter(w => 
      w.category === selectedCategory.id && 
      (!q || w.word.toLowerCase().includes(q) || w.meaning.toLowerCase().includes(q))
    );
    const filteredSentences = sentences.filter(s => 
      s.category === selectedCategory.id && 
      (!q || s.english.toLowerCase().includes(q) || s.vietnamese.toLowerCase().includes(q))
    );

    return (
      <div className="max-w-[1600px] mx-auto px-4 py-4 animate-in">

        {/* THANH ĐIỀU HƯỚNG - Đã thêm sticky để cố định */}
<div className="sticky top-0 z-50 bg-black/90 backdrop-blur-md py-4 -mt-4 mb-6 flex items-center gap-2">
          <button 
            onClick={onBack} 
            className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400 hover:text-white"
          >
            <Icons.ChevronLeft />
          </button>
          
          <div className="flex bg-zinc-900 p-1 rounded-2xl border border-zinc-800 flex-1 relative overflow-hidden">
            {detailSearchVisible ? (
              <div className="flex items-center w-full px-2">
                <div className="text-zinc-500 mr-2"><Icons.SearchIcon /></div>
                <input 
                  autoFocus 
                  placeholder="Tìm nhanh..." 
                  className="bg-transparent text-white text-xs font-bold outline-none w-full py-2" 
                  value={detailSearchQuery} 
                  onChange={e => setDetailSearchQuery(e.target.value)} 
                />
                <button onClick={() => { setDetailSearchVisible(false); setDetailSearchQuery(''); }} className="text-zinc-500">
                  <Icons.X />
                </button>
              </div>
            ) : (
              <>
                <button 
                  onClick={() => setActiveTab('vocab')} 
                  className={`flex-1 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${activeTab === 'vocab' ? 'bg-zinc-800 text-blue-500' : 'text-zinc-500'}`}
                >
                  TỪ VỰNG
                </button>
                <button 
                  onClick={() => setActiveTab('sentences')} 
                  className={`flex-1 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${activeTab === 'sentences' ? 'bg-zinc-800 text-green-500' : 'text-zinc-500'}`}
                >
                  MẪU CÂU
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!detailSearchVisible && (
              <button 
                onClick={() => setDetailSearchVisible(true)} 
                className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500"
              >
                <Icons.SearchIcon />
              </button>
            )}
            <button 
              onClick={() => setIsQuizMode(!isQuizMode)} 
              className={`p-3 rounded-2xl border transition-all ${isQuizMode ? 'bg-orange-600 border-orange-600 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}
            >
              <Icons.ShieldCheck />
            </button>
            <button 
              onClick={() => setIsAddingItem(true)} 
              className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-900/40 active:scale-90 transition-transform"
            >
              <Icons.Plus />
            </button>
          </div>
        </div>

        {/* LƯỚI NỘI DUNG */}
        <div className={`grid gap-4 pb-24 ${activeTab === 'vocab' ? 'grid-cols-[repeat(auto-fill,minmax(320px,1fr))]' : 'grid-cols-[repeat(auto-fill,minmax(400px,1fr))]'}`}>
          {activeTab === 'vocab' ? filteredWords.map(item => {
            const status = checkAnswer(quizAnswers[item.id], item.word);
            return (
              <div 
                key={item.id} 
                className={`bg-zinc-900/50 p-4 rounded-[28px] border transition-all flex gap-4 items-center h-[120px] ${isQuizMode && status === 'correct' ? 'border-green-500 bg-green-500/5' : isQuizMode && status === 'incorrect' ? 'border-red-500 bg-red-500/5' : 'border-zinc-800'}`}
              >
                <div className="w-20 h-20 rounded-2xl bg-zinc-800 overflow-hidden shrink-0 border border-zinc-800 shadow-inner">
                  {item.image ? (
                    <img src={item.image} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-700">
                      <Icons.ImageIcon />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                   <span className="text-[10px] text-blue-500 font-black uppercase tracking-tighter mb-0.5">{item.type}</span>
                   {isQuizMode ? (
                     <input 
                        className={`w-full bg-black border rounded-xl px-3 py-1.5 text-sm font-bold outline-none transition-colors ${status==='correct'?'border-green-500 text-green-400':'border-zinc-700 text-white focus:border-blue-500'}`} 
                        placeholder="Gõ từ..." 
                        value={quizAnswers[item.id]||''} 
                        onChange={e=>setQuizAnswers({...quizAnswers,[item.id]:e.target.value})} 
                      />
                   ) : (
                     <h3 className="text-white font-bold text-lg truncate leading-tight">{item.word}</h3>
                   )}
                   
                   {/* Dòng nghĩa tiếng Việt + Nút chức năng */}
                   <div className="flex items-center justify-between mt-1">
                      <p className="text-zinc-500 text-sm truncate pr-2">{item.meaning}</p>
                      <div className="flex items-center gap-2 shrink-0">
                        <button 
                          onClick={() => window.LearningLogic.copyToClipboard(item.word)}
                          className="text-zinc-600 hover:text-blue-400 transition-colors"
                          title="Copy word"
                        >
                          <Icons.Copy />
                        </button>
                        <button 
                          onClick={() => speak(item.word)} 
                          className="text-zinc-500 hover:text-white"
                        >
                          <Icons.Volume2 size={18} />
                        </button>
                      </div>
                   </div>
                </div>
              </div>
            );
          }) : filteredSentences.map(item => {
            const status = checkAnswer(quizAnswers[item.id], item.english);
            return (
              <div 
                key={item.id} 
                className={`bg-zinc-900/50 p-4 rounded-[28px] border transition-all flex items-center h-[120px] gap-4 ${isQuizMode && status === 'correct' ? 'border-green-500 bg-green-500/5' : isQuizMode && status === 'incorrect' ? 'border-red-500 bg-red-500/5' : 'border-zinc-800'}`}
              >
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="h-[15px]"></div> {/* Spacer đồng bộ với nhãn bên vocab */}
                  {isQuizMode ? (
                    <textarea 
                      rows="1" 
                      className={`w-full bg-black border rounded-xl p-2.5 text-sm font-bold outline-none resize-none transition-colors ${status==='correct'?'border-green-500 text-green-400':'border-zinc-700 text-white focus:border-blue-500'}`} 
                      placeholder="Dịch câu..." 
                      value={quizAnswers[item.id]||''} 
                      onChange={e=>setQuizAnswers({...quizAnswers,[item.id]:e.target.value})} 
                    />
                  ) : (
                    <p className="text-white font-bold text-lg leading-tight truncate">{item.english}</p>
                  )}

                  {/* Dòng nghĩa tiếng Việt + Nút chức năng */}
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-zinc-500 text-sm italic truncate pr-2">{item.vietnamese}</p>
                    <div className="flex items-center gap-2 shrink-0">
                      <button 
                        onClick={() => window.LearningLogic.copyToClipboard(item.english)}
                        className="text-zinc-600 hover:text-blue-400 transition-colors"
                        title="Copy sentence"
                      >
                        <Icons.Copy />
                      </button>
                      <button 
                        onClick={() => speak(item.english)} 
                        className="text-zinc-500 hover:text-white"
                      >
                        <Icons.Volume2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
};
