// Переключение между вкладками
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Удаляем активный класс у всех кнопок
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        // Добавляем активный класс текущей кнопке
        btn.classList.add('active');
        
        // Скрываем все секции
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Показываем нужную секцию
        const tabId = btn.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
    });
});

// Калькулятор стоимости
document.getElementById('calculate-btn').addEventListener('click', () => {
    // Простые расчеты для примера
    const type = document.getElementById('kitchen-type').value;
    const length = parseFloat(document.getElementById('kitchen-length').value);
    const material = document.getElementById('material').value;
    const countertop = document.getElementById('countertop').value;
    
    let basePrice = 0;
    
    // Базовая цена в зависимости от типа
    switch(type) {
        case 'linear': basePrice = 30000; break;
        case 'corner': basePrice = 40000; break;
        case 'u-shaped': basePrice = 50000; break;
        case 'island': basePrice = 60000; break;
    }
    
    // Наценка за материал
    let materialMultiplier = 1;
    switch(material) {
        case 'plastic': materialMultiplier = 1; break;
        case 'mdf': materialMultiplier = 1.5; break;
        case 'wood': materialMultiplier = 2.5; break;
        case 'glass': materialMultiplier = 2; break;
    }
    
    // Наценка за столешницу
    let countertopPrice = 0;
    switch(countertop) {
        case 'laminate': countertopPrice = 5000; break;
        case 'artstone': countertopPrice = 15000; break;
        case 'naturalstone': countertopPrice = 30000; break;
    }
    
    // Итоговая стоимость
    const totalPrice = (basePrice * length * materialMultiplier) + countertopPrice;
    
    // Форматируем число с разделителями
    const formattedPrice = new Intl.NumberFormat('ru-RU').format(Math.round(totalPrice));
    
    // Показываем результат
    document.getElementById('result-price').textContent = formattedPrice + ' ₽';
    document.getElementById('result-details').innerHTML = `
        <strong>Состав стоимости:</strong><br>
        - Основа: ${Math.round(basePrice * length)} ₽<br>
        - Материал фасадов: x${materialMultiplier}<br>
        - Столешница: ${new Intl.NumberFormat('ru-RU').format(countertopPrice)} ₽
    `;
    document.getElementById('result-container').style.display = 'block';
});

// Тест
let currentQuestion = 1;
const totalQuestions = 5;
const answers = {};

// Обработчики для кнопок теста
document.getElementById('next-btn').addEventListener('click', () => {
    if (currentQuestion < totalQuestions) {
        document.getElementById(`question${currentQuestion}`).classList.remove('active');
        currentQuestion++;
        document.getElementById(`question${currentQuestion}`).classList.add('active');
        
        document.getElementById('prev-btn').disabled = false;
        
        if (currentQuestion === totalQuestions) {
            document.getElementById('next-btn').textContent = 'Узнать результат';
        }
    } else {
        // Расчет результатов
        calculateTestResult();
    }
});

document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentQuestion > 1) {
        document.getElementById(`question${currentQuestion}`).classList.remove('active');
        currentQuestion--;
        document.getElementById(`question${currentQuestion}`).classList.add('active');
        
        document.getElementById('next-btn').textContent = 'Далее';
        
        if (currentQuestion === 1) {
            document.getElementById('prev-btn').disabled = true;
        }
    }
});

// Выбор варианта ответа
document.querySelectorAll('.test-option').forEach(option => {
    option.addEventListener('click', function() {
        // Удаляем выделение у всех вариантов в этом вопросе
        this.parentNode.querySelectorAll('.test-option').forEach(opt => {
            opt.style.backgroundColor = '#f5f5f5';
        });
        
        // Выделяем выбранный вариант
        this.style.backgroundColor = '#e0f7fa';
        
        // Сохраняем ответ
        const questionId = this.closest('.test-question').id;
        answers[questionId] = this.getAttribute('data-value');
    });
});

function calculateTestResult() {
    // Простая логика определения результата на основе ответов
    let resultText = '';
    let recommendations = '';
    
    // Анализируем ответы (упрощенный пример)
    const cookingFreq = answers['question1'];
    const peopleCount = answers['question2'];
    const stylePref = answers['question3'];
    const budget = answers['question4'];
    const priority = answers['question5'];
    
    // Определяем рекомендуемый тип кухни
    if (cookingFreq === '1' && peopleCount === '3') {
        resultText = 'Вам подойдет просторная функциональная кухня с островом или П-образной планировкой';
    } else if (budget === '1' || budget === '2') {
        resultText = 'Рекомендуем рассмотреть прямые или угловые кухни с оптимальным соотношением цены и качества';
    } else {
        resultText = 'Идеальным решением будет кухня с индивидуальным дизайном и премиальными материалами';
    }
    
    // Рекомендации по стилю
    switch(stylePref) {
        case '1': 
            recommendations += '<p><strong>Стиль:</strong> Современный минимализм с глянцевыми фасадами и скрытыми ручками</p>';
            break;
        case '2':
            recommendations += '<p><strong>Стиль:</strong> Классика с резными фасадами и натуральными материалами</p>';
            break;
        case '3':
            recommendations += '<p><strong>Стиль:</strong> Скандинавский с светлым деревом и пастельными акцентами</p>';
            break;
        case '4':
            recommendations += '<p><strong>Стиль:</strong> Лофт с бетонными эффектами и металлическими элементами</p>';
            break;
    }
    
    // Приоритеты
    if (priority === '1') {
        recommendations += '<p><strong>Рекомендации:</strong> Обратите внимание на эргономичные системы хранения и продуманную рабочую зону</p>';
    } else if (priority === '2') {
        recommendations += '<p><strong>Рекомендации:</strong> Выберите дизайнерскую кухню с акцентными элементами</p>';
    }
    
    // Показываем результат
    document.getElementById('test-result').style.display = 'block';
    document.getElementById('test-result').classList.add('active');
    document.getElementById('result-text').textContent = resultText;
    document.getElementById('result-recommendations').innerHTML = recommendations;
    
    // Скрываем кнопки навигации
    document.querySelector('.test-nav').style.display = 'none';
}

// Сохранение состояния чек-листа
document.querySelectorAll('.checklist-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        // В реальном приложении здесь можно сохранять состояние в localStorage
        console.log(`Checkbox ${this.id} changed to ${this.checked}`);
    });
});

