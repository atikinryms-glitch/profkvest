// Quest page logic for Guild of Travelers
// Loads 20 situations from backend, selects 6 random ones

const QUESTIONS_COUNT = 6;
const API_BASE_URL = 'http://127.0.0.1:8000';

// State variables
let situations = [];
let currentSituation = 0;
let questScores = { "Ч-П": 0, "Ч-Т": 0, "Ч-Х": 0, "Ч-Ч": 0, "Ч-З": 0 };
let choicesLog = [];

// Shuffle array function (Fisher-Yates)
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

document.addEventListener('DOMContentLoaded', async () => {
    // Check if user is logged in
    const heroName = localStorage.getItem('questHeroName');
    if (!heroName) {
        window.location.href = 'index.html';
        return;
    }
    
    // Initialize particle system
    new AdvancedParticleSystem('particleContainer', {
        count: 50,
        type: 'sparkle',
        color: 'rgba(255, 215, 0, 0.6)',
        speed: 1,
        size: 3
    });
    
    // Add magic particles
    setTimeout(() => {
        new AdvancedParticleSystem('particleContainer', {
            count: 30,
            type: 'magic',
            color: 'rgba(212, 175, 55, 0.5)',
            speed: 0.8,
            size: 4
        });
    }, 100);
    
    // Set background
    const background = document.getElementById('background');
    background.style.backgroundImage = "url('images/council-hall.jpg')";
    
    try {
        // Load situations from backend
        const response = await fetch(`${API_BASE_URL}/api/quest`);
        const data = await response.json();
        
        // Shuffle and select 6 random situations
        situations = shuffleArray(data.quest).slice(0, QUESTIONS_COUNT);
        
        // Shuffle options within each situation
        situations = situations.map(s => {
            const options = Object.entries(s.options);
            const shuffled = shuffleArray(options);
            const newOptions = {};
            const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
            shuffled.forEach(([key, value], index) => {
                newOptions[letters[index]] = value;
            });
            return { ...s, options: newOptions };
        });
        
        renderSituation(0);
    } catch (error) {
        console.error('Error loading quest:', error);
        // Fallback: use hardcoded situations if backend unavailable
        situations = getFallbackSituations();
        situations = shuffleArray(situations).slice(0, QUESTIONS_COUNT);
        renderSituation(0);
    }
});

function getFallbackSituations() {
    // Fallback situations if backend is unavailable
    return [
        {
            id: 1,
            title: "Древний артефакт",
            text: "Ты находишь в руинах светящийся артефакт неизвестной силы...",
            options: {
                "A": { text: "Изучу структуру и механизм", scores: { "Ч-Т": 3, "Ч-З": 2, "Ч-П": 0, "Ч-Х": 1, "Ч-Ч": 0 } },
                "B": { text: "Отнесу старейшинам", scores: { "Ч-Т": 0, "Ч-З": 0, "Ч-П": 0, "Ч-Х": 0, "Ч-Ч": 3 } },
                "C": { text: "Задокументирую свойства", scores: { "Ч-Т": 1, "Ч-З": 3, "Ч-П": 0, "Ч-Х": 0, "Ч-Ч": 0 } },
                "D": { text: "Создам произведение искусства", scores: { "Ч-Т": 0, "Ч-З": 0, "Ч-П": 0, "Ч-Х": 3, "Ч-Ч": 1 } },
                "E": { text: "Верну природе", scores: { "Ч-Т": 0, "Ч-З": 0, "Ч-П": 3, "Ч-Х": 1, "Ч-Ч": 0 } },
                "F": { text: "Свой ответ", scores: "AI_ANALYZE" }
            }
        },
        {
            id: 2,
            title: "Загадочный зверь",
            text: "В чаще леса ты встречаешь раненое мифическое существо...",
            options: {
                "A": { text: "Окажу первую помощь", scores: { "Ч-Т": 0, "Ч-З": 0, "Ч-П": 3, "Ч-Х": 0, "Ч-Ч": 2 } },
                "B": { text: "Изучу анатомию", scores: { "Ч-Т": 1, "Ч-З": 3, "Ч-П": 2, "Ч-Х": 0, "Ч-Ч": 0 } },
                "C": { text: "Позову на помощь", scores: { "Ч-Т": 0, "Ч-З": 0, "Ч-П": 0, "Ч-Х": 0, "Ч-Ч": 3 } },
                "D": { text: "Нарисую портрет", scores: { "Ч-Т": 0, "Ч-З": 0, "Ч-П": 1, "Ч-Х": 3, "Ч-Ч": 0 } },
                "E": { text: "Создам устройство для транспортировки", scores: { "Ч-Т": 3, "Ч-З": 1, "Ч-П": 0, "Ч-Х": 0, "Ч-Ч": 0 } },
                "F": { text: "Свой ответ", scores: "AI_ANALYZE" }
            }
        },
        {
            id: 3,
            title: "Пророчество Оракула",
            text: "Оракул показывает тебе видение будущего, зашифрованное символами...",
            options: {
                "A": { text: "Расшифрую через логику", scores: { "Ч-Т": 1, "Ч-З": 3, "Ч-П": 0, "Ч-Х": 0, "Ч-Ч": 0 } },
                "B": { text: "Обсужу с другими", scores: { "Ч-Т": 0, "Ч-З": 0, "Ч-П": 0, "Ч-Х": 0, "Ч-Ч": 3 } },
                "C": { text: "Создам художественную интерпретацию", scores: { "Ч-Т": 0, "Ч-З": 0, "Ч-П": 0, "Ч-Х": 3, "Ч-Ч": 1 } },
                "D": { text: "Сравню с природными циклами", scores: { "Ч-Т": 0, "Ч-З": 1, "Ч-П": 3, "Ч-Х": 0, "Ч-Ч": 0 } },
                "E": { text: "Построю модель событий", scores: { "Ч-Т": 2, "Ч-З": 3, "Ч-П": 0, "Ч-Х": 0, "Ч-Ч": 0 } },
                "F": { text: "Свой ответ", scores: "AI_ANALYZE" }
            }
        },
        {
            id: 4,
            title: "Строительство моста",
            text: "Гильдии нужно перебраться через ущелье. Мост разрушен...",
            options: {
                "A": { text: "Спроектирую и построю", scores: { "Ч-Т": 3, "Ч-З": 1, "Ч-П": 0, "Ч-Х": 0, "Ч-Ч": 0 } },
                "B": { text: "Организую команду", scores: { "Ч-Т": 1, "Ч-З": 0, "Ч-П": 0, "Ч-Х": 0, "Ч-Ч": 3 } },
                "C": { text: "Рассчитаю нагрузку", scores: { "Ч-Т": 2, "Ч-З": 3, "Ч-П": 0, "Ч-Х": 0, "Ч-Ч": 0 } },
                "D": { text: "Украшу символами", scores: { "Ч-Т": 0, "Ч-З": 0, "Ч-П": 0, "Ч-Х": 3, "Ч-Ч": 1 } },
                "E": { text: "Найду обходной путь", scores: { "Ч-Т": 0, "Ч-З": 0, "Ч-П": 3, "Ч-Х": 0, "Ч-Ч": 0 } },
                "F": { text: "Свой ответ", scores: "AI_ANALYZE" }
            }
        },
        {
            id: 5,
            title: "Магическая библиотека",
            text: "Ты обнаружил библиотеку с книгами, шепчущими заклинания...",
            options: {
                "A": { text: "Систематизирую книги", scores: { "Ч-Т": 1, "Ч-З": 3, "Ч-П": 0, "Ч-Х": 0, "Ч-Ч": 0 } },
                "B": { text: "Прочитаю вслух", scores: { "Ч-Т": 0, "Ч-З": 0, "Ч-П": 0, "Ч-Х": 1, "Ч-Ч": 3 } },
                "C": { text: "Изучу связь с природой", scores: { "Ч-Т": 0, "Ч-З": 1, "Ч-П": 3, "Ч-Х": 0, "Ч-Ч": 0 } },
                "D": { text: "Создам иллюстрации", scores: { "Ч-Т": 0, "Ч-З": 0, "Ч-П": 0, "Ч-Х": 3, "Ч-Ч": 0 } },
                "E": { text: "Построю механизм защиты", scores: { "Ч-Т": 3, "Ч-З": 2, "Ч-П": 0, "Ч-Х": 0, "Ч-Ч": 0 } },
                "F": { text: "Свой ответ", scores: "AI_ANALYZE" }
            }
        },
        {
            id: 6,
            title: "Фестиваль гильдий",
            text: "Ежегодный фестиваль! Нужно организовать мероприятие...",
            options: {
                "A": { text: "Разработаю сценарий", scores: { "Ч-Т": 1, "Ч-З": 2, "Ч-П": 0, "Ч-Х": 2, "Ч-Ч": 0 } },
                "B": { text: "Соберу команду", scores: { "Ч-Т": 0, "Ч-З": 0, "Ч-П": 0, "Ч-Х": 0, "Ч-Ч": 3 } },
                "C": { text: "Создам декорации", scores: { "Ч-Т": 0, "Ч-З": 0, "Ч-П": 0, "Ч-Х": 3, "Ч-Ч": 1 } },
                "D": { text: "Построю сцену", scores: { "Ч-Т": 3, "Ч-З": 1, "Ч-П": 0, "Ч-Х": 0, "Ч-Ч": 0 } },
                "E": { text: "Организую зону природы", scores: { "Ч-Т": 0, "Ч-З": 0, "Ч-П": 3, "Ч-Х": 0, "Ч-Ч": 0 } },
                "F": { text: "Свой ответ", scores: "AI_ANALYZE" }
            }
        }
    ];
}

function renderSituation(index) {
    if (index >= situations.length) {
        finishQuest();
        return;
    }
    
    const situation = situations[index];
    const container = document.getElementById('situationsContainer');
    
    // Update progress bar
    const progress = ((index) / situations.length) * 100;
    document.getElementById('progressBar').style.width = `${progress}%`;
    
    // Clear container
    container.innerHTML = '';
    
    // Create situation card
    const card = document.createElement('div');
    card.className = 'situation-card active animate-slide-up';
    card.innerHTML = `
        <h3 style="color: var(--gold-dark); margin-bottom: 15px; font-size: 1.4em;">
            Ситуация ${index + 1}: ${situation.title}
        </h3>
        <p style="font-style: italic; color: var(--brown-medium); margin-bottom: 25px; font-size: 1.1em;">
            ${situation.text}
        </p>
        <div class="options-container" id="optionsContainer"></div>
        
        <div class="custom-answer-section">
            <h3>✍️ Или напиши свой ответ:</h3>
            <textarea id="customAnswerText" placeholder="Опиши, что ты будешь делать..."></textarea>
            <button id="submitCustomBtn" class="btn" style="margin-top: 15px;">
                Отправить свой ответ
            </button>
        </div>
    `;
    container.appendChild(card);
    
    // Add option buttons (excluding F - custom answer)
    const optionsContainer = document.getElementById('optionsContainer');
    Object.entries(situation.options).forEach(([key, value]) => {
        if (key === 'F') return; // Skip custom answer button
        
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = value.text;
        btn.onclick = () => handleStandardAnswer(index, key, value.scores, situation.title);
        optionsContainer.appendChild(btn);
    });
    
    // Custom answer handler
    document.getElementById('submitCustomBtn').onclick = () => {
        handleCustomAnswer(index, situation.title);
    };
}

async function handleStandardAnswer(situationIndex, optionKey, scores, title) {
    // Add scores
    for (const [type, points] of Object.entries(scores)) {
        questScores[type] += points;
    }
    
    // Log choice
    choicesLog.push(`Ситуация ${situationIndex + 1} (${title}): ${optionKey}`);
    
    // Animate card exit
    const card = document.querySelector('.situation-card');
    card.style.transform = 'translateX(-50px)';
    card.style.opacity = '0';
    
    // Next situation after delay
    setTimeout(() => {
        currentSituation++;
        renderSituation(currentSituation);
    }, 600);
}

async function handleCustomAnswer(situationIndex, title) {
    const text = document.getElementById('customAnswerText').value.trim();
    
    if (!text || text.length < 10) {
        alert('Ответ слишком короткий (минимум 10 символов)');
        return;
    }
    
    // Show loading indicator
    const submitBtn = document.getElementById('submitCustomBtn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '🔮 Оракул анализирует...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/analyze_answer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ answer: text })
        });
        
        if (response.ok) {
            const aiScores = await response.json();
            
            // Add AI scores
            for (const [type, points] of Object.entries(aiScores)) {
                questScores[type] += points;
            }
            
            // Log choice
            choicesLog.push(`Ситуация ${situationIndex + 1} (${title}): F (ИИ)`);
            
            // Animate and proceed
            const card = document.querySelector('.situation-card');
            card.style.transform = 'translateX(-50px)';
            card.style.opacity = '0';
            
            setTimeout(() => {
                currentSituation++;
                renderSituation(currentSituation);
            }, 600);
        } else {
            throw new Error('AI analysis failed');
        }
    } catch (error) {
        console.error('AI analysis error:', error);
        // Fallback: give default scores
        questScores["Ч-П"] += 1;
        questScores["Ч-Т"] += 1;
        questScores["Ч-Х"] += 1;
        questScores["Ч-Ч"] += 2;
        questScores["Ч-З"] += 1;
        choicesLog.push(`Ситуация ${situationIndex + 1} (${title}): F (дефолт)`);
        
        // Proceed anyway
        const card = document.querySelector('.situation-card');
        card.style.transform = 'translateX(-50px)';
        card.style.opacity = '0';
        
        setTimeout(() => {
            currentSituation++;
            renderSituation(currentSituation);
        }, 600);
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

function finishQuest() {
    // Save quest scores to localStorage
    localStorage.setItem('questScores', JSON.stringify(questScores));
    localStorage.setItem('questChoices', JSON.stringify(choicesLog));
    
    // Combine with oracle scores
    const oracleScores = JSON.parse(localStorage.getItem('oracleScores') || '{}');
    const totalScores = {};
    
    for (const type of ['Ч-П', 'Ч-Т', 'Ч-Х', 'Ч-Ч', 'Ч-З']) {
        totalScores[type] = (oracleScores[type] || 0) + (questScores[type] || 0);
    }
    
    localStorage.setItem('totalScores', JSON.stringify(totalScores));
    
    // Determine dominant type
    const dominantType = Object.entries(totalScores).reduce((a, b) => b[1] > a[1] ? b : a)[0];
    localStorage.setItem('finalType', dominantType);
    
    // Update UI
    document.getElementById('progressBar').style.width = '100%';
    document.getElementById('situationsContainer').style.display = 'none';
    document.getElementById('questFinal').style.display = 'block';
    document.getElementById('questFinal').classList.add('animate-in');
}
