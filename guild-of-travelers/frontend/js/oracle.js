// Oracle page logic for Guild of Travelers
// Handles 20 questions, randomly selects 5, shuffles options

const QUESTIONS_COUNT = 5;
const API_BASE_URL = 'http://127.0.0.1:8000';

// Database of 20 questions for the Oracle
const allQuestions = [
    {
        text: "Ты стоишь у древнего дерева. Его листья шелестят на языке, который ты почти понимаешь. Что ты сделаешь?",
        options: [
            { text: "🌿 Прислушаюсь — возможно, дерево расскажет историю", type: "Ч-П" },
            { text: "⚙️ Изучу структуру коры — там может быть механизм", type: "Ч-Т" },
            { text: "🎨 Представлю, как нарисовать этот момент", type: "Ч-Х" },
            { text: "🤝 Оглянусь — вдруг рядом есть кто-то ещё", type: "Ч-Ч" },
            { text: "📜 Запишу всё, что вижу — детали пригодятся", type: "Ч-З" }
        ]
    },
    {
        text: "В старой башне ты находишь странный прибор с шестерёнками. Он тихо гудит...",
        options: [
            { text: "🌿 Отнесу его в лес — пусть природа заберёт своё", type: "Ч-П" },
            { text: "⚙️ Разберусь, как он работает и зачем нужен", type: "Ч-Т" },
            { text: "🎨 Использую как элемент декора", type: "Ч-Х" },
            { text: "🤝 Покажу другим путникам", type: "Ч-Ч" },
            { text: "📜 Изучу записи о подобных устройствах", type: "Ч-З" }
        ]
    },
    {
        text: "Гильдия готовится к празднику. Тебя просят внести свой вклад...",
        options: [
            { text: "🌿 Украшу зал живыми цветами и растениями", type: "Ч-П" },
            { text: "⚙️ Создам световое оборудование", type: "Ч-Т" },
            { text: "🎨 Напишу картину для центрального места", type: "Ч-Х" },
            { text: "🤝 Организую команду волонтёров", type: "Ч-Ч" },
            { text: "📜 Составлю смету и план мероприятия", type: "Ч-З" }
        ]
    },
    {
        text: "Ты видишь, как новичок пытается решить сложную задачу. Он явно растерян...",
        options: [
            { text: "🌿 Предложу прогуляться на природе — это поможет успокоиться", type: "Ч-П" },
            { text: "⚙️ Покажу техническое решение проблемы", type: "Ч-Т" },
            { text: "🎨 Расскажу вдохновляющую историю", type: "Ч-Х" },
            { text: "🤝 Подойду и предложу помощь", type: "Ч-Ч" },
            { text: "📜 Дам инструкцию с пошаговым решением", type: "Ч-З" }
        ]
    },
    {
        text: "В библиотеке ты находишь книгу с пустыми страницами. Но они слегка светятся...",
        options: [
            { text: "🌿 Положу книгу под дерево — пусть наполнится природной силой", type: "Ч-П" },
            { text: "⚙️ Попробую проявить страницы технически", type: "Ч-Т" },
            { text: "🎨 Сам напишу и нарисую новую историю", type: "Ч-Х" },
            { text: "🤝 Отнесу книгу другим читателям", type: "Ч-Ч" },
            { text: "📜 Изучу магические свойства бумаги", type: "Ч-З" }
        ]
    },
    {
        text: "На пути ты встречаешь торговца с диковинными товарами. Что привлечёт твоё внимание?",
        options: [
            { text: "🌿 Семена редких растений", type: "Ч-П" },
            { text: "⚙️ Механические устройства", type: "Ч-Т" },
            { text: "🎨 Картины и скульптуры", type: "Ч-Х" },
            { text: "🤝 Книги об обучении и развитии", type: "Ч-Ч" },
            { text: "📜 Карты и схемы неизвестных земель", type: "Ч-З" }
        ]
    },
    {
        text: "Гильдии нужно новое помещение. Какое место ты выберешь?",
        options: [
            { text: "🌿 Дом в окружении сада", type: "Ч-П" },
            { text: "⚙️ Здание с современным оборудованием", type: "Ч-Т" },
            { text: "🎨 Красиво оформленное историческое здание", type: "Ч-Х" },
            { text: "🤝 Просторное место для встреч людей", type: "Ч-Ч" },
            { text: "📜 Башню с архивом и библиотекой", type: "Ч-З" }
        ]
    },
    {
        text: "Ты создаёшь новый артефакт для гильдии. Что будет его основой?",
        options: [
            { text: "🌿 Природные материалы: дерево, камни, травы", type: "Ч-П" },
            { text: "⚙️ Механизмы и электроника", type: "Ч-Т" },
            { text: "🎨 Художественное оформление и дизайн", type: "Ч-Х" },
            { text: "🤝 Возможность помогать людям", type: "Ч-Ч" },
            { text: "📜 Система данных и вычислений", type: "Ч-З" }
        ]
    },
    {
        text: "Что для тебя значит «быть героем»?",
        options: [
            { text: "🌿 Защищать природу и её обитателей", type: "Ч-П" },
            { text: "⚙️ Создавать технологии для улучшения жизни", type: "Ч-Т" },
            { text: "🎨 Вдохновлять людей своим примером", type: "Ч-Х" },
            { text: "🤝 Помогать тем, кто в этом нуждается", type: "Ч-Ч" },
            { text: "📜 Искать истину и знания", type: "Ч-З" }
        ]
    },
    {
        text: "Ты видишь, как разрушается старый мост. Твоя реакция?",
        options: [
            { text: "🌿 Интересно, как природа займёт это место", type: "Ч-П" },
            { text: "⚙️ Нужно спроектировать и построить новый", type: "Ч-Т" },
            { text: "🎨 Жаль, он был так живописно выглядит на закате", type: "Ч-Х" },
            { text: "🤝 Надо предупредить людей об опасности", type: "Ч-Ч" },
            { text: "📜 Изучить причины разрушения", type: "Ч-З" }
        ]
    },
    {
        text: "Какой подарок ты бы выбрал для друга?",
        options: [
            { text: "🌿 Комнатное растение или семена", type: "Ч-П" },
            { text: "⚙️ Гаджет или инструмент", type: "Ч-Т" },
            { text: "🎨 Картину или книгу стихов", type: "Ч-Х" },
            { text: "🤝 Сертификат на совместное мероприятие", type: "Ч-Ч" },
            { text: "📜 Энциклопедию или научную книгу", type: "Ч-З" }
        ]
    },
    {
        text: "Ты открываешь свою школу. Чему будешь учить?",
        options: [
            { text: "🌿 Садоводству и уходу за природой", type: "Ч-П" },
            { text: "⚙️ Инженерии и конструированию", type: "Ч-Т" },
            { text: "🎨 Искусству и творчеству", type: "Ч-Х" },
            { text: "🤝 Коммуникации и помощи людям", type: "Ч-Ч" },
            { text: "📜 Анализу данных и исследованиям", type: "Ч-З" }
        ]
    },
    {
        text: "Что тебя больше всего вдохновляет?",
        options: [
            { text: "🌿 Красота природных ландшафтов", type: "Ч-П" },
            { text: "⚙️ Новые технологии и изобретения", type: "Ч-Т" },
            { text: "🎨 Произведения искусства", type: "Ч-Х" },
            { text: "🤝 Истории о людях и их достижениях", type: "Ч-Ч" },
            { text: "📜 Научные открытия и теории", type: "Ч-З" }
        ]
    },
    {
        text: "Ты находишь сундук с сокровищами. Что внутри ты надеешься увидеть?",
        options: [
            { text: "🌿 Редкие семена и кристаллы", type: "Ч-П" },
            { text: "⚙️ Чертежи и инструменты мастеров", type: "Ч-Т" },
            { text: "🎨 Драгоценные камни для украшений", type: "Ч-Х" },
            { text: "🤝 Письма и истории предков", type: "Ч-Ч" },
            { text: "📜 Древние манускрипты и карты", type: "Ч-З" }
        ]
    },
    {
        text: "Как ты предпочитаешь проводить свободное время?",
        options: [
            { text: "🌿 На природе, в лесу или у воды", type: "Ч-П" },
            { text: "⚙️ Мастеря что-то своими руками", type: "Ч-Т" },
            { text: "🎨 Творя или наслаждаясь искусством", type: "Ч-Х" },
            { text: "🤝 В компании друзей и знакомых", type: "Ч-Ч" },
            { text: "📜 Читая или изучая новое", type: "Ч-З" }
        ]
    },
    {
        text: "Что для тебя важнее всего в работе?",
        options: [
            { text: "🌿 Связь с природой и экологичность", type: "Ч-П" },
            { text: "⚙️ Технические возможности и инновации", type: "Ч-Т" },
            { text: "🎨 Творческая свобода и самовыражение", type: "Ч-Х" },
            { text: "🤝 Общение и помощь людям", type: "Ч-Ч" },
            { text: "📜 Точность и работа с информацией", type: "Ч-З" }
        ]
    },
    {
        text: "Ты становишься главой гильдии. Какой твой первый указ?",
        options: [
            { text: "🌿 Создать заповедную зону вокруг гильдии", type: "Ч-П" },
            { text: "⚙️ Модернизировать оборудование и инструменты", type: "Ч-Т" },
            { text: "🎨 Устроить фестиваль искусств", type: "Ч-Х" },
            { text: "🤝 Открыть бесплатную школу для всех", type: "Ч-Ч" },
            { text: "📜 Основать исследовательский центр", type: "Ч-З" }
        ]
    },
    {
        text: "Какой суперсилой ты бы хотел обладать?",
        options: [
            { text: "🌿 Понимать язык животных и растений", type: "Ч-П" },
            { text: "⚙️ Создавать любые механизмы силой мысли", type: "Ч-Т" },
            { text: "🎨 Воплощать в жизнь свои художественные замыслы", type: "Ч-Х" },
            { text: "🤝 Исцелять людей одним прикосновением", type: "Ч-Ч" },
            { text: "📜 Мгновенно получать доступ к любым знаниям", type: "Ч-З" }
        ]
    },
    {
        text: "Что ты ценишь в друзьях больше всего?",
        options: [
            { text: "🌿 Любовь к природе и животным", type: "Ч-П" },
            { text: "⚙️ Умение чинить и создавать вещи", type: "Ч-Т" },
            { text: "🎨 Творческий подход к жизни", type: "Ч-Х" },
            { text: "🤝 Доброту и готовность помочь", type: "Ч-Ч" },
            { text: "📜 Ум и эрудицию", type: "Ч-З" }
        ]
    },
    {
        text: "Кем ты видишь себя через 10 лет?",
        options: [
            { text: "🌿 Экологом или защитником природы", type: "Ч-П" },
            { text: "⚙️ Инженером или изобретателем", type: "Ч-Т" },
            { text: "🎨 Художником или дизайнером", type: "Ч-Х" },
            { text: "🤝 Учителем или врачом", type: "Ч-Ч" },
            { text: "📜 Учёным или аналитиком", type: "Ч-З" }
        ]
    }
];

// State variables
let activeQuestions = [];
let currentQuestion = 0;
let scores = { "Ч-П": 0, "Ч-Т": 0, "Ч-Х": 0, "Ч-Ч": 0, "Ч-З": 0 };

// Shuffle array function (Fisher-Yates)
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const heroName = localStorage.getItem('questHeroName');
    if (!heroName) {
        window.location.href = 'index.html';
        return;
    }
    
    // Initialize particle system
    new AdvancedParticleSystem('particleContainer', {
        count: 50,
        type: 'magic',
        color: 'rgba(100, 150, 255, 0.5)',
        speed: 0.8,
        size: 3
    });
    
    // Set background
    const background = document.getElementById('background');
    background.style.backgroundImage = "url('images/oracle-room.jpg')";
    
    // Select 5 random questions and shuffle their options
    activeQuestions = shuffleArray(allQuestions).slice(0, QUESTIONS_COUNT);
    activeQuestions = activeQuestions.map(q => ({
        ...q,
        options: shuffleArray(q.options)
    }));
    
    showQuestion(0);
});

function showQuestion(index) {
    if (index >= activeQuestions.length) {
        finishOracle();
        return;
    }
    
    const q = activeQuestions[index];
    const container = document.getElementById('questionsContainer');
    
    // Update progress bar
    const progress = ((index) / QUESTIONS_COUNT) * 100;
    document.getElementById('progressBar').style.width = `${progress}%`;
    
    // Update counter
    document.getElementById('questionCounter').textContent = 
        `Вопрос ${index + 1} из ${QUESTIONS_COUNT}`;
    
    // Clear container
    container.innerHTML = '';
    
    // Create question card with animation
    const card = document.createElement('div');
    card.className = 'animate-in';
    card.innerHTML = `
        <h3 style="color: var(--brown-dark); margin-bottom: 25px; font-size: 1.3em;">
            ${q.text}
        </h3>
        <div class="options-container" id="optionsContainer"></div>
    `;
    container.appendChild(card);
    
    // Add options with staggered animation
    const optionsContainer = document.getElementById('optionsContainer');
    q.options.forEach((option, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn animate-slide-up';
        btn.textContent = option.text;
        btn.style.animationDelay = `${idx * 0.15}s`;
        btn.onclick = () => handleAnswer(option.type, btn);
        optionsContainer.appendChild(btn);
    });
}

function handleAnswer(type, button) {
    // Increment score
    scores[type]++;
    
    // Visual feedback - absorb into crystal ball
    button.style.transform = 'scale(0.5) rotate(10deg)';
    button.style.opacity = '0';
    button.disabled = true;
    
    // Move to next question after delay
    setTimeout(() => {
        currentQuestion++;
        showQuestion(currentQuestion);
    }, 600);
}

function finishOracle() {
    // Save scores to localStorage
    localStorage.setItem('oracleScores', JSON.stringify(scores));
    
    // Determine dominant type
    const dominantType = Object.entries(scores).reduce((a, b) => b[1] > a[1] ? b : a)[0];
    localStorage.setItem('dominantType', dominantType);
    
    // Update progress bar to 100%
    document.getElementById('progressBar').style.width = '100%';
    document.getElementById('questionCounter').textContent = 'Испытание завершено!';
    
    // Show final message
    document.getElementById('questionsContainer').style.display = 'none';
    document.getElementById('oracleFinal').style.display = 'block';
    document.getElementById('oracleFinal').classList.add('animate-in');
}
