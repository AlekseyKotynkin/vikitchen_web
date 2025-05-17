// Инициализация Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Переключение между типами отзывов
function initReviewTabs() {
  document.querySelectorAll(".review-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      // Удаляем активный класс у всех вкладок
      document.querySelectorAll(".review-tab").forEach((t) => t.classList.remove("active"));
      // Добавляем активный класс текущей вкладке
      tab.classList.add("active");

      // Скрываем все контенты
      document.querySelectorAll(".review-content").forEach((content) => {
        content.classList.remove("active");
      });

      // Показываем нужный контент
      const tabId = tab.getAttribute("data-tab");
      const targetContent = document.getElementById(`${tabId}-reviews`);
      if (targetContent) {
        targetContent.classList.add("active");
      }
    });
  });
}

// Работа с FAQ
function initFAQ() {
  document.querySelectorAll(".faq-question").forEach((question) => {
    question.addEventListener("click", () => {
      // Переключаем активный класс у вопроса
      question.classList.toggle("active");

      // Находим соответствующий ответ
      const answer = question.nextElementSibling;

      // Переключаем активный класс у ответа
      answer.classList.toggle("active");

      // Закрываем другие открытые вопросы (опционально)
      document.querySelectorAll(".faq-question").forEach((q) => {
        if (q !== question && q.classList.contains("active")) {
          q.classList.remove("active");
          q.nextElementSibling.classList.remove("active");
        }
      });
    });
  });
}

// Слайдер до/после
function initComparisonSliders() {
  const sliders = document.querySelectorAll(".comparison-slider");

  sliders.forEach((slider) => {
    let isDragging = false;
    const container = slider.parentElement;

    // Функция для обновления позиции слайдера
    const updateSliderPosition = (x) => {
      const containerRect = container.getBoundingClientRect();
      x = Math.max(0, Math.min(x, containerRect.width));
      const percent = (x / containerRect.width) * 100;

      slider.style.left = `${percent}%`;
      container.querySelector(".before-image").style.width = `${percent}%`;
      container.querySelector(".after-image").style.width = `${100 - percent}%`;
    };

    // Обработчики для мыши
    slider.addEventListener("mousedown", (e) => {
      e.preventDefault();
      isDragging = true;
      document.body.style.cursor = "ew-resize";
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      const containerRect = container.getBoundingClientRect();
      updateSliderPosition(e.clientX - containerRect.left);
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
      document.body.style.cursor = "";
    });

    // Обработчики для сенсорных устройств
    slider.addEventListener("touchstart", (e) => {
      e.preventDefault();
      isDragging = true;
    });

    document.addEventListener("touchmove", (e) => {
      if (!isDragging || !e.touches[0]) return;
      const containerRect = container.getBoundingClientRect();
      updateSliderPosition(e.touches[0].clientX - containerRect.left);
    });

    document.addEventListener("touchend", () => {
      isDragging = false;
    });

    // Инициализация начальной позиции
    const containerRect = container.getBoundingClientRect();
    updateSliderPosition(containerRect.width / 2);
  });
}

// Инициализация основного слайдера работ
async function initWorksSlider() {
  const loader = document.querySelector(".bue_slider-loader");
  const slidesContainer = document.querySelector(".bue_slides-container");
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");
  
  if (!slidesContainer || !loader) return;

  let currentSlide = 0;
  let slides = [];
  let totalSlides = 0;
  let autoScrollInterval;
  let lightGallery;

  // Функция для перехода к слайду
  const goToSlide = (index) => {
    if (totalSlides === 0) return;
    
    currentSlide = (index + totalSlides) % totalSlides;
    slidesContainer.scrollTo({
      left: slides[currentSlide].offsetLeft,
      behavior: "smooth"
    });
    updateDots();
  };

  // Функция обновления индикаторов
  const updateDots = () => {
    const dots = document.querySelectorAll(".bue_slider-dot");
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentSlide);
    });
  };

  // Функция запуска автопрокрутки
  const startAutoScroll = () => {
    stopAutoScroll();
    autoScrollInterval = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, 5000);
  };

  // Функция остановки автопрокрутки
  const stopAutoScroll = () => {
    if (autoScrollInterval) {
      clearInterval(autoScrollInterval);
    }
  };

  try {
    // Загружаем данные из Firestore
    const worksSnapshot = await db.collection("works").get();
    const worksArray = worksSnapshot.docs.map(doc => doc.data());

    if (!worksArray.length) {
      slidesContainer.innerHTML = '<p class="no-works">Фотографии работ пока отсутствуют</p>';
      loader.style.display = "none";
      return;
    }

    // Создаем слайды
    slidesContainer.innerHTML = ''; // Очищаем контейнер
    worksArray.forEach((work, index) => {
      const slide = document.createElement("div");
      slide.className = "slide_nach";
      slide.dataset.index = index;
      slide.innerHTML = `
        <img src="${work.imageUrl}" 
             alt="Наша работа ${index + 1}" 
             data-lg-size="${work.width || ""}-${work.height || ""}" 
             data-sub-html="<p>${work.description || ""}</p>">
      `;
      slidesContainer.appendChild(slide);
    });

    // Инициализируем переменные для навигации
    slides = document.querySelectorAll(".slide_nach");
    totalSlides = slides.length;

    // Создаем индикаторы (точки)
    const dotsContainer = document.querySelector(".bue_slider-dots") || document.createElement("div");
    dotsContainer.className = "bue_slider-dots";
    dotsContainer.innerHTML = '';
    
    worksArray.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.className = "bue_slider-dot";
      dot.addEventListener("click", () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });
    
    if (!document.querySelector(".bue_slider-dots")) {
      document.querySelector(".bue_works-slider").appendChild(dotsContainer);
    }

    // Инициализируем LightGallery
    if (window.lightGallery) {
      lightGallery = window.lightGallery(slidesContainer, {
        selector: ".bue_slide img",
        download: false,
        share: false
      });
    }

    // Назначаем обработчики навигации
    if (prevBtn) {
      prevBtn.addEventListener("click", () => goToSlide(currentSlide - 1));
    }
    
    if (nextBtn) {
      nextBtn.addEventListener("click", () => goToSlide(currentSlide + 1));
    }

    // Автопрокрутка
    startAutoScroll();

    // Остановка при наведении
    slidesContainer.addEventListener("mouseenter", stopAutoScroll);
    slidesContainer.addEventListener("mouseleave", startAutoScroll);

    // Скрываем загрузчик
    setTimeout(() => {
      loader.style.opacity = "0";
      setTimeout(() => {
        loader.style.display = "none";
        slidesContainer.style.display = "flex";
      }, 300);
    }, 500);

  } catch (error) {
    console.error("Ошибка загрузки работ:", error);
    slidesContainer.innerHTML = '<p class="error">Не удалось загрузить фотографии работ</p>';
    loader.style.display = "none";
  }
}

// Инициализация всех функций при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  initReviewTabs();
  initFAQ();
  initComparisonSliders();
  initWorksSlider();
});

// Инициализация слайдера "до/после" при полной загрузке страницы
window.addEventListener("load", initComparisonSliders);