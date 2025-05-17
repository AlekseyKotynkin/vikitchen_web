// Таймер обратного отсчета
document.addEventListener('DOMContentLoaded', function() {
  // Функция для обновления таймеров
  function updateTimers() {
    const timers = document.querySelectorAll('.timer-numbers');
    
    timers.forEach(timer => {
      const endDateStr = timer.getAttribute('data-end');
      if (!endDateStr) return;
      
      const endDate = new Date(endDateStr).getTime();
      const now = new Date().getTime();
      const distance = endDate - now;
      
      if (distance < 0) {
        timer.textContent = "Акция завершена";
        return;
      }
      
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      // Правильное склонение слова "день"
      let daysText = 'дней';
      if (days % 10 === 1 && days % 100 !== 11) {
        daysText = 'день';
      } else if ([2, 3, 4].includes(days % 10) && ![12, 13, 14].includes(days % 100)) {
        daysText = 'дня';
      }
      
      timer.textContent = `${days} ${daysText} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    });
  }
  
  // Инициализация таймеров
  if (document.querySelectorAll('.timer-numbers').length > 0) {
    updateTimers();
    const timerInterval = setInterval(updateTimers, 1000);
    
    // Очистка интервала при переходе на другую страницу
    window.addEventListener('beforeunload', () => {
      clearInterval(timerInterval);
    });
  }

  // Главный слайдер (hero)
  const heroSlidesContainer = document.querySelector(".hero-slider .slides-container");
  const heroSlides = document.querySelectorAll(".hero-slider .slide");
  const heroDots = document.querySelectorAll(".hero-slider .dot");
  
  // Слайдер стилей (styles)
  const stylesSlidesContainer = document.querySelector(".styles-slider .styles-slider-container");
  const stylesSlides = document.querySelectorAll(".styles-slider .style-slide");
  const stylesDots = document.querySelectorAll(".styles-slider .dot");
  const prevArrow = document.querySelector(".prev-arrow");
  const nextArrow = document.querySelector(".next-arrow");
  
  // Инициализация hero слайдера
  if (heroSlides && heroSlides.length > 0) {
    let heroCurrentSlide = 0;
    let heroInterval;
    
    function goToHeroSlide(index) {
      heroSlidesContainer.style.transform = `translateX(-${index * 100}%)`;
      
      heroSlides.forEach((slide) => slide.classList.remove("active"));
      heroSlides[index].classList.add("active");
      
      heroDots.forEach((dot) => dot.classList.remove("active"));
      heroDots[index].classList.add("active");
      
      heroCurrentSlide = index;
    }
    
    heroDots.forEach((dot) => {
      dot.addEventListener("click", function () {
        const slideIndex = parseInt(this.getAttribute("data-slide"));
        if (!isNaN(slideIndex)) {
          goToHeroSlide(slideIndex);
          resetHeroInterval();
        }
      });
    });
    
    function startHeroInterval() {
      heroInterval = setInterval(() => {
        heroCurrentSlide = (heroCurrentSlide + 1) % heroSlides.length;
        goToHeroSlide(heroCurrentSlide);
      }, 5000);
    }
    
    function resetHeroInterval() {
      clearInterval(heroInterval);
      startHeroInterval();
    }
    
    startHeroInterval();
    
    // Очистка интервала при переходе на другую страницу
    window.addEventListener('beforeunload', () => {
      clearInterval(heroInterval);
    });
  }
  
  // Инициализация styles слайдера
  if (stylesSlides && stylesSlides.length > 0) {
    let stylesCurrentSlide = 0;
    let stylesInterval;
    
    function goToStylesSlide(index) {
      stylesSlides.forEach((slide) => {
        slide.classList.remove("active");
        slide.style.opacity = 0;
      });
      
      stylesSlides[index].classList.add("active");
      setTimeout(() => {
        stylesSlides[index].style.opacity = 1;
      }, 10);
      
      stylesDots.forEach((dot) => dot.classList.remove("active"));
      stylesDots[index].classList.add("active");
      
      stylesCurrentSlide = index;
    }
    
    stylesDots.forEach((dot) => {
      dot.addEventListener("click", function () {
        const slideIndex = parseInt(this.getAttribute("data-slide"));
        if (!isNaN(slideIndex)) {
          goToStylesSlide(slideIndex);
          resetStylesInterval();
        }
      });
    });
    
    // Обработчики для стрелок
    if (prevArrow) {
      prevArrow.addEventListener("click", function() {
        stylesCurrentSlide = (stylesCurrentSlide - 1 + stylesSlides.length) % stylesSlides.length;
        goToStylesSlide(stylesCurrentSlide);
        resetStylesInterval();
      });
    }
    
    if (nextArrow) {
      nextArrow.addEventListener("click", function() {
        stylesCurrentSlide = (stylesCurrentSlide + 1) % stylesSlides.length;
        goToStylesSlide(stylesCurrentSlide);
        resetStylesInterval();
      });
    }
    
    function startStylesInterval() {
      stylesInterval = setInterval(() => {
        stylesCurrentSlide = (stylesCurrentSlide + 1) % stylesSlides.length;
        goToStylesSlide(stylesCurrentSlide);
      }, 5000);
    }
    
    function resetStylesInterval() {
      clearInterval(stylesInterval);
      startStylesInterval();
    }
    
    startStylesInterval();
    
    // Очистка интервала при переходе на другую страницу
    window.addEventListener('beforeunload', () => {
      clearInterval(stylesInterval);
    });
  }

  // Инициализация слайдера для десктопной версии
  function initDesktopSlider() {
    const slides = document.querySelectorAll('.desktop-version .style-slide');
    const dots = document.querySelectorAll('.desktop-version .dot');
    
    if (slides.length === 0 || dots.length === 0) return;
    
    let currentSlide = 0;
    let desktopInterval;

    function showSlide(n) {
      slides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));
      
      slides[n].classList.add('active');
      dots[n].classList.add('active');
      
      currentSlide = n;
    }

    dots.forEach(dot => {
      dot.addEventListener('click', function() {
        const slideIndex = parseInt(this.getAttribute('data-slide'));
        if (!isNaN(slideIndex)) {
          showSlide(slideIndex);
          resetDesktopInterval();
        }
      });
    });

    function startDesktopInterval() {
      desktopInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
      }, 5000);
    }
    
    function resetDesktopInterval() {
      clearInterval(desktopInterval);
      startDesktopInterval();
    }

    startDesktopInterval();
    
    // Очистка интервала при переходе на другую страницу
    window.addEventListener('beforeunload', () => {
      clearInterval(desktopInterval);
    });
  }

  // Запуск при загрузке и изменении размера окна
  function checkAndInitDesktopSlider() {
    if (window.innerWidth > 768) {
      initDesktopSlider();
    }
  }

  window.addEventListener('load', checkAndInitDesktopSlider);
  window.addEventListener('resize', checkAndInitDesktopSlider);
});

// Слайдер для шапки слайда
document.addEventListener('DOMContentLoaded', function() {
  // Инициализация слайдера
  const slider = document.querySelector('.hero-slider');
  if (!slider) return;

  const slidesContainer = slider.querySelector('.slides-container');
  const slides = slider.querySelectorAll('.slide');
  const dotsContainer = slider.querySelector('.slider-dots');
  const dots = slider.querySelectorAll('.dot');

  if (!slidesContainer || slides.length === 0 || !dotsContainer) return;

  let currentSlide = 0;
  let interval;
  const slideCount = slides.length;

  // Функция обновления слайдера
  function updateSlider() {
    slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Обновляем активные слайды
    slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === currentSlide);
    });
    
    // Обновляем точки навигации
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSlide);
    });
  }

  // Переход к конкретному слайду
  function goToSlide(index) {
    currentSlide = (index + slideCount) % slideCount;
    updateSlider();
    resetInterval();
  }

  // Автопереключение слайдов
  function startInterval() {
    interval = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, 5000);
  }

  function resetInterval() {
    clearInterval(interval);
    startInterval();
  }

  // Обработчики для точек
  dots.forEach(dot => {
    dot.addEventListener('click', function() {
      const slideIndex = parseInt(this.getAttribute('data-slide'));
      if (!isNaN(slideIndex)) {
        goToSlide(slideIndex);
      }
    });
  });

  // Свайпы для мобильных
  let touchStartX = 0;
  let touchEndX = 0;

  slidesContainer.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
    clearInterval(interval);
  }, {passive: true});

  slidesContainer.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].clientX;
    handleSwipe();
    resetInterval();
  }, {passive: true});

  function handleSwipe() {
    const diff = touchStartX - touchEndX;
    if (diff > 50) goToSlide(currentSlide + 1);  // Свайп влево
    if (diff < -50) goToSlide(currentSlide - 1); // Свайп вправо
  }

  // Инициализация
  updateSlider();
  startInterval();

  // Адаптация для мобильных
  function handleResize() {
    // Гарантированное отображение точек на мобильных
    dotsContainer.style.display = 'flex';
  }

  window.addEventListener('resize', handleResize);
  handleResize(); // Инициализация при загрузке
});

// Слайдер для слайдера стилей
document.addEventListener('DOMContentLoaded', function() {
  // Общие настройки для обоих слайдеров
  const desktopSliderContainer = document.querySelector('.desktop-version .styles-slider-container');
  const mobileSliderContainer = document.querySelector('.mobile-version .mobile-slides-container');
  const desktopSlides = document.querySelectorAll('.desktop-version .style-slide');
  const mobileSlides = document.querySelectorAll('.mobile-version .mobile-slide');
  const desktopDots = document.querySelectorAll('.desktop-version .dot');
  const mobileDots = document.querySelectorAll('.mobile-version .mobile-dot');
  
  let currentSlide = 0;
  const slideCount = desktopSlides.length;
  let autoSlideInterval;
  const slideDuration = 5000; // 5 секунд
  
  // Инициализация слайдеров
  function initSliders() {
      // Удаляем классы active по умолчанию
      desktopSlides.forEach(slide => slide.classList.remove('active'));
      mobileSlides.forEach(slide => slide.style.display = 'none');
      
      // Устанавливаем первый слайд как активный
      desktopSlides[0].classList.add('active');
      mobileSlides[0].style.display = 'block';
      
      // Обновляем точки навигации
      updateDots();
      
      // Запускаем автопрокрутку
      startAutoSlide();
      
      // Добавляем обработчики событий для точек навигации
      addDotsEventListeners();
      
      // Добавляем обработчики свайпа для мобильной версии
      setupMobileSwipe();
  }
  
  // Обновление видимых слайдов
  function updateSlides() {
      // Десктопная версия
      desktopSlides.forEach((slide, index) => {
          slide.classList.toggle('active', index === currentSlide);
      });
      
      // Мобильная версия
      mobileSlides.forEach((slide, index) => {
          slide.style.display = index === currentSlide ? 'block' : 'none';
      });
      
      // Обновляем точки навигации
      updateDots();
  }
  
  // Обновление точек навигации
  function updateDots() {
      desktopDots.forEach((dot, index) => {
          dot.classList.toggle('active', index === currentSlide);
      });
      
      mobileDots.forEach((dot, index) => {
          dot.classList.toggle('active', index === currentSlide);
      });
  }
  
  // Переход к конкретному слайду
  function goToSlide(index) {
      currentSlide = index;
      updateSlides();
      resetAutoSlide();
  }
  
  // Переход к следующему слайду
  function nextSlide() {
      currentSlide = (currentSlide + 1) % slideCount;
      updateSlides();
  }
  
  // Переход к предыдущему слайду
  function prevSlide() {
      currentSlide = (currentSlide - 1 + slideCount) % slideCount;
      updateSlides();
  }
  
  // Автопрокрутка слайдов
  function startAutoSlide() {
      autoSlideInterval = setInterval(nextSlide, slideDuration);
  }
  
  // Сброс автопрокрутки при взаимодействии пользователя
  function resetAutoSlide() {
      clearInterval(autoSlideInterval);
      startAutoSlide();
  }
  
  // Добавление обработчиков событий для точек навигации
  function addDotsEventListeners() {
      desktopDots.forEach(dot => {
          dot.addEventListener('click', function() {
              const slideIndex = parseInt(this.getAttribute('data-slide'));
              goToSlide(slideIndex);
          });
      });
      
      mobileDots.forEach(dot => {
          dot.addEventListener('click', function() {
              const slideIndex = parseInt(this.getAttribute('data-slide'));
              goToSlide(slideIndex);
          });
      });
  }
  
  // Настройка свайпа для мобильной версии
  function setupMobileSwipe() {
      let touchStartX = 0;
      let touchEndX = 0;
      
      mobileSliderContainer.addEventListener('touchstart', function(e) {
          touchStartX = e.changedTouches[0].screenX;
      }, false);
      
      mobileSliderContainer.addEventListener('touchend', function(e) {
          touchEndX = e.changedTouches[0].screenX;
          handleSwipe();
      }, false);
      
      function handleSwipe() {
          const swipeThreshold = 50; // Минимальное расстояние свайпа
          
          if (touchStartX - touchEndX > swipeThreshold) {
              // Свайп влево - следующий слайд
              nextSlide();
              resetAutoSlide();
          } else if (touchEndX - touchStartX > swipeThreshold) {
              // Свайп вправо - предыдущий слайд
              prevSlide();
              resetAutoSlide();
          }
      }
  }
  
  // Остановка слайдера при наведении (только для десктопной версии)
  if (desktopSliderContainer) {
      desktopSliderContainer.addEventListener('mouseenter', function() {
          clearInterval(autoSlideInterval);
      });
      
      desktopSliderContainer.addEventListener('mouseleave', function() {
          resetAutoSlide();
      });
  }
  
  // Инициализация
  initSliders();
});

//Слушатель нажатия кнопок класса subcategory-link
document.addEventListener('DOMContentLoaded', function() {
  // Находим все элементы с классом subcategory-link
  const subcategoryLinks = document.querySelectorAll('.subcategory-link');
  
  // Добавляем обработчик клика для каждой ссылки
  subcategoryLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault(); // Предотвращаем стандартное поведение ссылки
      
      // Получаем ID из data-атрибута
      const categoryId = this.getAttribute('data-id');
      const nameGroup = this.getAttribute('data-name');
      
      // Формируем URL с параметром
      const url = `product_groups.html?category=${encodeURIComponent(categoryId)}&nameGroup=${encodeURIComponent(nameGroup)}`;
      
      // Перенаправляем на новую страницу
      window.location.href = url;
    });
  });
});
