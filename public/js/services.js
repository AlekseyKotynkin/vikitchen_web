// Переключение между услугами
document.querySelectorAll('.service-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        // Удаляем активный класс у всех вкладок
        document.querySelectorAll('.service-tab').forEach(t => t.classList.remove('active'));
        // Добавляем активный класс текущей вкладке
        tab.classList.add('active');
        
        // Скрываем все контенты
        document.querySelectorAll('.service-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Показываем нужный контент
        const serviceId = tab.getAttribute('data-service');
        document.getElementById(`${serviceId}-service`).classList.add('active');
    });
});

// Плавная прокрутка к якорям
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
