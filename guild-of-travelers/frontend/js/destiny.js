// Destiny page logic for Guild of Travelers
// Shows final results with recommendations

const API_BASE_URL = 'http://127.0.0.1:8000';

// Type data with recommendations
const typeData = {
    "Ч-П": {
        name: "Человек-Природа",
        icon: "🌿",
        professions: [
            "Эколог", "Биолог", "Агроном", "Лесник", 
            "Ветеринар", "Геолог", "Ботаник", "Зоолог",
            "Садовод", "Озеленитель"
        ],
        subjects: ["Биология", "Химия", "География", "Экология"],
        universities: [
            "Тимирязевская академия (РГАУ-МСХА)",
            "МГУ им. Ломоносова (биологический)",
            "СПбГУ (экология и биология)",
            "РУДН (агробиотехнологии)",
            "МГППУ (экологическое образование)"
        ]
    },
    "Ч-Т": {
        name: "Человек-Техника",
        icon: "⚙️",
        professions: [
            "Инженер", "Программист", "Механик", "Архитектор",
            "Робототехник", "Конструктор", "Технолог", "Электронщик",
            "Автомеханик", "Системный администратор"
        ],
        subjects: ["Математика", "Физика", "Информатика", "Технология"],
        universities: [
            "МГТУ им. Баумана",
            "МИФИ (НИЯУ)",
            "ИТМО (Санкт-Петербург)",
            "СПбПУ (Политех)",
            "НГТУ им. Алексеева"
        ]
    },
    "Ч-Х": {
        name: "Человек-Художественный образ",
        icon: "🎨",
        professions: [
            "Художник", "Дизайнер", "Музыкант", "Писатель",
            "Актёр", "Режиссёр", "Фотограф", "Модельер",
            "Архитектор (дизайн)", "Иллюстратор"
        ],
        subjects: ["Литература", "Искусство", "История", "Творческий экзамен"],
        universities: [
            "МГХПА им. Строганова",
            "ГИТИС (РАТИ)",
            "ВГИК",
            "СПбГУПТД (дизайн)",
            "МГУКИ (культура и искусство)"
        ]
    },
    "Ч-Ч": {
        name: "Человек-Человек",
        icon: "🤝",
        professions: [
            "Учитель", "Врач", "Психолог", "Социальный работник",
            "Менеджер по персоналу", "Продавец-консультант",
            "Воспитатель", "Тренер", "Экскурсовод", "Медицинская сестра"
        ],
        subjects: ["Биология", "Обществознание", "Русский язык", "История"],
        universities: [
            "МГПУ (Педагогический)",
            "МГМУ им. Сеченова",
            "МГППУ (Психология)",
            "РГСУ (Социальная работа)",
            "СПбГУ (психология)"
        ]
    },
    "Ч-З": {
        name: "Человек-Знаковая система",
        icon: "📚",
        professions: [
            "Бухгалтер", "Экономист", "Аналитик данных", "Переводчик",
            "Математик", "Статистик", "Картограф", "Криптограф",
            "Программист (алгоритмы)", "Финансист"
        ],
        subjects: ["Математика", "Информатика", "Иностранный язык", "Экономика"],
        universities: [
            "МГУ им. Ломоносова (ВМК)",
            "НИУ ВШЭ (экономика)",
            "Финансовый университет",
            "МГЛУ (лингвистика)",
            "СПбГУ (прикладная математика)"
        ]
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Check if user completed the quest
    const finalType = localStorage.getItem('finalType');
    const heroName = localStorage.getItem('questHeroName');
    
    if (!finalType || !heroName) {
        window.location.href = 'index.html';
        return;
    }
    
    // Initialize particle system
    new AdvancedParticleSystem('particleContainer', {
        count: 40,
        type: 'magic',
        color: 'rgba(139, 69, 19, 0.5)',
        speed: 0.8,
        size: 3
    });
    
    setTimeout(() => {
        new AdvancedParticleSystem('particleContainer', {
            count: 30,
            type: 'sparkle',
            color: 'rgba(255, 215, 0, 0.6)',
            speed: 0.6,
            size: 2
        });
    }, 100);
    
    // Set dynamic background based on type
    const backgroundImages = {
        "Ч-П": "images/enchanted-forest.jpg",
        "Ч-Т": "images/blacksmith-workshop.jpg",
        "Ч-Х": "images/artist-studio.jpg",
        "Ч-Ч": "images/tavern.jpg",
        "Ч-З": "images/library.jpg"
    };
    
    const background = document.getElementById('background');
    const bgImage = backgroundImages[finalType] || "images/ancient-scroll.jpg";
    background.style.backgroundImage = `url('${bgImage}')`;
    
    // Get total scores
    const totalScores = JSON.parse(localStorage.getItem('totalScores') || '{}');
    
    // Display results
    displayResults(finalType, heroName, totalScores);
    
    // Save button handler
    document.getElementById('saveBtn').onclick = saveResults;
});

function displayResults(type, heroName, scores) {
    const data = typeData[type];
    
    // Greeting
    document.getElementById('greetingText').textContent = `Приветствую тебя, ${heroName}!`;
    
    // Profile type
    document.getElementById('typeName').textContent = `${data.icon} ${data.name} (${type})`;
    
    // Score chart
    const chartContainer = document.getElementById('scoreChart');
    chartContainer.innerHTML = '';
    
    const maxScore = Math.max(...Object.values(scores), 1);
    const typeLabels = {
        "Ч-П": "Природа",
        "Ч-Т": "Техника",
        "Ч-Х": "Искусство",
        "Ч-Ч": "Люди",
        "Ч-З": "Знания"
    };
    
    for (const [typeKey, score] of Object.entries(scores)) {
        const barContainer = document.createElement('div');
        barContainer.style.display = 'flex';
        barContainer.style.flexDirection = 'column';
        barContainer.style.alignItems = 'center';
        
        const percentage = (score / maxScore) * 100;
        
        barContainer.innerHTML = `
            <div class="score-value">${score}</div>
            <div class="score-bar" style="height: ${Math.max(percentage, 10)}%;">
                <span>${typeLabels[typeKey]}</span>
            </div>
        `;
        chartContainer.appendChild(barContainer);
    }
    
    // Recommendations
    const professionsList = document.getElementById('professionsList');
    professionsList.innerHTML = data.professions.map(p => `<li>${p}</li>`).join('');
    
    const subjectsList = document.getElementById('subjectsList');
    subjectsList.innerHTML = data.subjects.map(s => `<li>${s}</li>`).join('');
    
    const universitiesList = document.getElementById('universitiesList');
    universitiesList.innerHTML = data.universities.map(u => `<li>${u}</li>`).join('');
}

async function saveResults() {
    const saveBtn = document.getElementById('saveBtn');
    const successMessage = document.getElementById('successMessage');
    
    saveBtn.disabled = true;
    saveBtn.textContent = '⏳ Сохранение...';
    
    const resultData = {
        code: localStorage.getItem('questCode'),
        hero_name: localStorage.getItem('questHeroName'),
        class_name: localStorage.getItem('questClassName'),
        quest_type: localStorage.getItem('finalType'),
        scores: {
            ...JSON.parse(localStorage.getItem('totalScores') || '{}'),
            date: new Date().toLocaleDateString('ru-RU')
        },
        choices: JSON.stringify(JSON.parse(localStorage.getItem('questChoices') || []))
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/save_result`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(resultData)
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            successMessage.style.display = 'block';
            saveBtn.textContent = '✅ Сохранено!';
        } else {
            throw new Error(data.detail || 'Ошибка сохранения');
        }
    } catch (error) {
        console.error('Save error:', error);
        // Still show success in local mode
        successMessage.textContent = '⚠️ Результаты сохранены локально (сервер недоступен)';
        successMessage.style.backgroundColor = 'rgba(255, 193, 7, 0.2)';
        successMessage.style.borderColor = '#ffc107';
        successMessage.style.color = '#ffc107';
        successMessage.style.display = 'block';
        saveBtn.textContent = '⚠️ Локально';
    }
}
