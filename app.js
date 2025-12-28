document.addEventListener('DOMContentLoaded', () => {

    /* =====================
       BIẾN & CẤU HÌNH
    ===================== */
    let vocabulary = JSON.parse(localStorage.getItem('myVocabList')) || [];
    let selectedTopic = "Tất cả";

    const typeLabels = {
        'Noun': 'n',
        'Verb': 'v',
        'Adjective': 'adj',
        'Adverb': 'adv',
        'Preposition': 'prep',
        'Conjunction': 'conj',
        'Pronoun': 'pro',
        'Interjection': 'int'
    };

    /* =====================
       HÀM TIỆN ÍCH
    ===================== */
    const $ = id => document.getElementById(id);

    /* =====================
       FORM TOGGLE
    ===================== */
    window.toggleForm = function () {
        const wrapper = $('formWrapper');
        const btn = $('toggleFormBtn');
        const icon = $('toggleIcon');
        const text = $('toggleText');

        if (!wrapper) return;

        if (wrapper.classList.contains('show')) {
            wrapper.classList.remove('show');
            btn?.classList.remove('active');
            if (icon) icon.innerText = '➕';
            if (text) text.innerText = 'Thêm từ';
            resetForm();
        } else {
            wrapper.classList.add('show');
            btn?.classList.add('active');
            if (icon) icon.innerText = '✕';
            if (text) text.innerText = 'Đóng lại';
            updateDatalist();
            $('wordInput')?.focus();
        }
    };

    /* =====================
       TOPIC
    ===================== */
    function getUniqueTopics() {
        const set = new Set();
        vocabulary.forEach(v => {
            if (v.topic && v.topic.trim()) set.add(v.topic.trim());
        });
        return [...set];
    }

    function updateDatalist() {
        const datalist = $('existingTopics');
        if (!datalist) return;
        datalist.innerHTML = getUniqueTopics()
            .map(t => `<option value="${t}">`)
            .join('');
    }

    function renderTopicFilter() {
        const bar = $('topicFilterBar');
        if (!bar) return;

        const topics = ["Tất cả", ...getUniqueTopics()];
        bar.innerHTML = topics.map(t => `
            <div class="filter-chip ${selectedTopic === t ? 'active' : ''}"
                 onclick="selectTopic('${t}')">
                ${t}
            </div>
        `).join('');
    }

    window.selectTopic = function (topic) {
        selectedTopic = topic;
        renderTopicFilter();
        renderVocab();
    };

    /* =====================
       RENDER VOCAB
    ===================== */
    function renderVocab() {
        const list = $('vocabList');
        if (!list) return;

        const search = $('searchInput')?.value.toLowerCase() || '';
        list.innerHTML = '';

        vocabulary
            .filter(v =>
                (selectedTopic === 'Tất cả' || v.topic === selectedTopic) &&
                (v.word.toLowerCase().includes(search) ||
                 v.meaning.toLowerCase().includes(search))
            )
            .forEach(v => {
                const div = document.createElement('div');
                div.className = 'vocab-item';
                div.draggable = true;
                div.dataset.id = v.id;

                div.addEventListener('dragstart', e => {
                    e.dataTransfer.setData('text/plain', v.id);
                    div.classList.add('dragging');
                });

                div.addEventListener('dragend', () => {
                    div.classList.remove('dragging');
                    saveSortOrder();
                });

                const tag = typeLabels[v.type] || 'n';

                div.innerHTML = `
                    <div class="vocab-content">
                        <button class="speak-btn" onclick="speak('${v.word.replace(/'/g, "\\'")}')">🔊</button>
                        <div class="word-info">
                            <div class="word-title">
                                ${v.word}
                                ${v.phonetic ? `<span class="phonetic">[${v.phonetic}]</span>` : ''}
                                <span class="word-tag">${tag}</span>
                            </div>
                            <div class="meaning">${v.meaning}</div>
                        </div>
                    </div>
                    <div class="edit-icon" onclick="editVocab('${v.id}')">✏️</div>
                `;

                list.appendChild(div);
            });
    }

    window.filterBySearch = renderVocab;

    /* =====================
       SORT & DELETE
    ===================== */
    function saveSortOrder() {
        if (selectedTopic !== 'Tất cả') return;
        const items = [...document.querySelectorAll('.vocab-item')];
        vocabulary = items
            .map(i => vocabulary.find(v => v.id === i.dataset.id))
            .filter(Boolean);
        localStorage.setItem('myVocabList', JSON.stringify(vocabulary));
    }

    window.deleteVocab = function (id) {
        vocabulary = vocabulary.filter(v => v.id !== id);
        saveAndRender();
    };

    /* =====================
       FORM SUBMIT / EDIT
    ===================== */
    window.handleFormSubmit = function () {
        const id = $('editId')?.value;
        const word = $('wordInput')?.value.trim();
        const phonetic = $('phoneticInput')?.value.trim();
        const meaning = $('meaningInput')?.value.trim();
        const topic = $('topicInput')?.value.trim();
        const type = $('typeInput')?.value;

        if (!word || !meaning) return;

        if (id) {
            vocabulary = vocabulary.map(v =>
                v.id === id ? { ...v, word, phonetic, meaning, topic, type } : v
            );
        } else {
            vocabulary.unshift({
                id: Date.now().toString(),
                word, phonetic, meaning, topic, type
            });
        }

        saveAndRender();
        toggleForm();
    };

    window.editVocab = function (id) {
        const v = vocabulary.find(x => x.id === id);
        if (!v) return;

        if (!$('formWrapper')?.classList.contains('show')) toggleForm();

        $('editId').value = v.id;
        $('wordInput').value = v.word;
        $('phoneticInput').value = v.phonetic || '';
        $('meaningInput').value = v.meaning;
        $('topicInput').value = v.topic || '';
        $('typeInput').value = v.type || 'Noun';
        $('submitBtn').innerText = 'Cập nhật';

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    function resetForm() {
        ['editId','wordInput','phoneticInput','meaningInput','topicInput']
            .forEach(id => $(id) && ($(id).value = ''));
        $('submitBtn') && ($('submitBtn').innerText = 'Lưu từ vựng');
    }

    function saveAndRender() {
        localStorage.setItem('myVocabList', JSON.stringify(vocabulary));
        renderTopicFilter();
        renderVocab();
        updateDatalist();
    }

    /* =====================
       SPEAK
    ===================== */
    window.speak = function (text) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'en-US';
        window.speechSynthesis.speak(u);
    };

    /* =====================
       INIT
    ===================== */
    renderTopicFilter();
    renderVocab();
    updateDatalist();

});
