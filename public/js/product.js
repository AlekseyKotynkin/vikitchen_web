// Инициализация Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Получаем параметры из URL
const urlParams = new URLSearchParams(window.location.search);
const product_Id = urlParams.get("id");
const product_group_Id = urlParams.get("groupId");

// Основная функция для получения товара
async function getProductById(product_group_Id, product_Id) {
  try {
    const docRef = db
      .collection("product groups")
      .doc("ey7qtg6FvfGLdzm82yHB")
      .collection(product_group_Id)
      .doc(product_Id);

    const docSnapshot = await docRef.get();

    if (docSnapshot.exists) {
      return {
        id: docSnapshot.id,
        ...docSnapshot.data(),
      };
    } else {
      console.log("Товар не найден");
      return null;
    }
  } catch (error) {
    console.error("Ошибка при получении товара:", error);
    throw error;
  }
}

// Функция для загрузки и отображения товара
// Показываем лоадер при начале загрузки
function showLoader() {
  const loader = document.getElementById('pageLoader');
  if (loader) {
    loader.style.display = 'flex';
  }
}

// Скрываем лоадер после загрузки
function hideLoader() {
  const loader = document.getElementById('pageLoader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.display = 'none';
    }, 300); // Совпадает с duration CSS transition
  }
}

// Обновляем функцию loadAndDisplayProduct
async function loadAndDisplayProduct() {
  showLoader(); // Показываем лоадер
  
  try {
    const product = await getProductById(product_group_Id, product_Id);

    if (product) {
      const productCardHTML = createProductCard(product);
      document.getElementById("products_card").innerHTML = productCardHTML;
      initProductPageHandlers();
    } else {
      showProductNotFound();
    }
  } catch (error) {
    showLoadError(error);
  } finally {
    hideLoader(); // Скрываем лоадер в любом случае
  }
}

// Добавляем плавное исчезновение лоадера при полной загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(hideLoader, 500); // Дополнительная задержка для плавности
});

// Показать сообщение "Товар не найден"
function showProductNotFound() {
  document.getElementById("products_card").innerHTML = `
        <div class="product-not-found">
            <h2>Товар не найден</h2>
            <p>Извините, запрашиваемый товар не существует или был удален.</p>
            <a href="index.html">Вернуться в каталог</a>
        </div>
    `;
}

// Показать сообщение об ошибке загрузки
function showLoadError(error) {
  console.error("Произошла ошибка:", error);
  document.getElementById("products_card").innerHTML = `
        <div class="error-message">
            <h2>Ошибка загрузки товара</h2>
            <p>${error.message}</p>
            <button onclick="window.location.reload()">Попробовать снова</button>
        </div>
    `;
}

// Запускаем загрузку товара при полной загрузке DOM
document.addEventListener("DOMContentLoaded", function () {
  // Проверяем, что есть необходимые параметры
  if (!product_Id || !product_group_Id) {
    showProductNotFound();
    return;
  }

  loadAndDisplayProduct();
});

// Выбор цвета
const colorOptions = document.querySelectorAll(".color-option");
colorOptions.forEach((option) => {
  option.addEventListener("click", function () {
    const color = this.getAttribute("data-color");

    // Удаляем активный класс у всех вариантов
    colorOptions.forEach((opt) => opt.classList.remove("active"));

    // Добавляем активный класс текущему варианту
    this.classList.add("active");

    // В реальном проекте здесь будет изменение главного изображения
    console.log("Выбран цвет:", color);
  });
});

// Выбор размера
const sizeOptions = document.querySelectorAll(".size-option");
sizeOptions.forEach((option) => {
  option.addEventListener("click", function () {
    // Удаляем активный класс у всех вариантов
    sizeOptions.forEach((opt) => opt.classList.remove("active"));

    // Добавляем активный класс текущему варианту
    this.classList.add("active");

    // В реальном проекте здесь будет пересчет цены
    console.log("Выбран размер:", this.textContent);
  });
});

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", function () {
  console.log("Страница товара загружена");

  // Можно добавить проверку наличия товара
/*   const stockStatus = document.querySelector(".stock-status");
  if (stockStatus.textContent.includes("0 шт")) {
    stockStatus.classList.add("out-of-stock");
    addToCartBtn.disabled = true;
    addToCartBtn.textContent = "Нет в наличии";
  }
 */});

// Функция для создания HTML-карточки товара
function createProductCard(product) {
  return `
    <div class="product-page">
      <div class="product-main">
        <div class="product-gallery">
          <img src="${
            product.imageUrl ||
            "https://storage.yandexcloud.net/vikitchen/kitchen-main.webp"
          }" 
               alt="${product.title || "Кухонный гарнитур"}" 
               class="main-image">
          <div class="zoom-icon">
            <i class="fas fa-search-plus"></i>
          </div>
          <div class="thumbnail-slider">
            ${product.images?.map((img, index) => `<img src="${img}" alt="${product.title || "Кухонный гарнитур"} вид ${index + 1}" class="thumbnail ${index === 0 ? "active" : ""}">`).join("")}
          </div>
        </div>
  
        <div class="product-info">
          <h1 class="product-title">${product.title || "Кухонный гарнитур"}</h1>
          <div class="product-sku">Артикул: ${product.sku || "VIK-NO-SKU"}</div>
  
          <div class="rating">
            <div class="stars">
              ${generateRatingStars(product.rating || 4.5)}
            </div>
            <span class="reviews-count">${
              product.reviewCount || 0
            } отзывов</span>
          </div>
  
          <div class="price-container">
            <span class="current-price">${formatPrice(
              product.price || 189900
            )} ₽</span>
            ${
              product.oldPrice
                ? `
              <span class="old-price">${formatPrice(product.oldPrice)} ₽</span>
              <span class="discount-badge">-${calculateDiscount(
                product.price,
                product.oldPrice
              )}%</span>
            `
                : ""
            }
          </div>
  
          <div class="stock-status">
            <i class="fas fa-${
              product.inStock ? "check-circle" : "times-circle"
            }"></i>
            <span>${
              product.inStock
                ? `В наличии: ${product.stockQuantity || 1} шт.`
                : "Нет в наличии"
            }</span>
          </div>

          <div class="action-buttons">
            <button class="btn btn-secondary"
              data-modal-type="callback" 
              data-title="${product.title}" 
              data-button-text="Заказать" 
              data-hide-comment="true">
              >Купить в 1 клик</button>
          </div>
            <div class="product-variants">
              <div class="variant-option" style="display: ${product.facade_colors};">
                <div class="variant-title">Цвет
                <i class="fas fa-question-circle" title="Выберите цвет фасадов"></i>
                </div>
                <div class="color-options">
                  ${product.facade_colors_array?.map((text, index) => `<div
                    class="color-option"
                    style="background: ${text}" data-color="white"
                  ></div>`).join("")}
                </div>
              </div>

              <div class="variant-option" style="display: ${product.dimensions};">
                <div class="variant-title">Размер
                  <i class="fas fa-question-circle" title="Выберите размер кухни"></i>
                </div>
                <div class="size-options">
                  ${product.dimensions_array?.map((text, index) => `
                  <div class="size-option">${text}</div>`).join("")}
                  <a class="size-table-link">Таблица размеров</a>
                </div>
              </div>

              <div class="variant-option" style="display: ${product.table_tops};">
                <div class="variant-title">Столешница
                  <i class="fas fa-question-circle"
                    title="Выберите материал столешницы"></i>
                </div>
                <div class="size-options">
                  ${product.table_tops_array?.map((text, index) => `
                    <div class="size-option">${text}</div>`).join("")}
                </div>
              </div>
        </div>
      </div>
      </div>
              <div class="product-description">
          <div class="description-section">
            <h3>Описание</h3>
            <p class="short-description">${product.description}</p>
            <h3>Преимущества:</h3>
            <ul class="features-list">
               ${product.advantages_array?.map((text, index) => `<li>${text}>`).join("")}
            </ul>
          </div>

          <div class="description-section">
            <h3 class="section-title">Технические характеристики</h3>
            <table class="specs-table">
            ${product.specifications_array?.map((item, index) => {
              // Предполагаем, что item содержит пары "название: значение"
              const [name, value] = item.split(':').map(part => part.trim());
              
              return `
                <tr>
                  <td>${name || 'Характеристика'}</td>
                  <td>${value || 'Не указано'}</td>
                </tr>
              `;
            }).join('')}
            </table>
          </div>
        </div>

        <!-- Доставка и оплата -->
         <div class="delivery-payment">
          <div class="delivery-card">
            <h2 class="section-title">Доставка</h2>
            <div class="delivery-methods">
              <div class="method-item">
              <a href="buyers.html#payment" class="product-button">Подробнее</a>
              </div>
            </div>
          </div>
          <div class="payment-card">
            <h2 class="section-title">Оплата</h2>
            <div class="payment-methods">
              <div class="method-item">
                <a href="buyers.html#delivery" class="product-button">Подробнее</a>
              </div>
            </div>
          </div>
        </div>

        <!-- Отзывы -->
        <div class="reviews-section">
          <h2 class="section-title">Отзывы</h2>

          ${product.reviews_map?.length ? product.reviews_map.map(review => `
            <div class="review-item">
              <div class="review-header">
                <span class="review-author">${review.name || review.author || 'Покупатель'}</span>
                <span class="review-date">${review.data || 'Дата не указана'}</span>
              </div>
              <div class="review-rating">
                ${generateRatingStars(review.rating || review.rating_m || 0)}
              </div>
              <div class="review-text">${review.text || review.comment || ''}</div>
            </div>
          `).join('') : `
            <div class="no-reviews">
              <i class="far fa-comment-alt"></i>
              <p>Отзывов пока нет</p>
            </div>
          `}

          <button class="add-review-btn"
            data-modal-type="feedback" 
            data-title="Оставить отзыв" 
            data-button-text="Отправить отзыв" 
            data-comment-placeholder="Напишите ваш отзыв здесь">Добавить отзыв</button>
        </div>

        <!-- Вопросы и ответы -->
        <div class="questions-section">
          <h2 class="section-title">Вопросы и ответы</h2>
            ${product.questions_map?.length ? product.questions_map.map(review => `

          <div class="question-item">
            <div class="question-header">
              <span class="question-author">${review.name || review.author || 'Покупатель'}</span>
              <span class="question-date">${review.data || 'Дата не указана'}</span>
            </div>
            <div class="question-text">${review.text_questions || review.comment || ''}
            </div>
            <div
              class="answer-text"
              style="
                margin-top: 10px;
                padding-left: 20px;
                border-left: 3px solid var(--primary-color);
              "
            >${review.text || review.comment || ''}
            </div>
          </div>
          `).join('') : `
            <div class="no-reviews">
              <i class="far fa-comment-alt"></i>
              <p>Вопросов пока нет</p>
            </div>
          `}

          <button class="add-question-btn"
            data-modal-type="feedback" 
            data-title="Задать вопрос" 
            data-button-text="Задать" 
            data-comment-placeholder="Напишите ваш отзыв здесь">Задать вопрос</button>
        </div>

        <!-- Рекомендации -->
        <div class="recommendations">
          <h2 class="section-title">Похожие товары</h2>
          <div class="products-grid">
          ${product.similar_products_map?.length ? product.similar_products_map.map(review => `

            <div class="product-card">
              <img
                src="${review.img}"
                alt="${review.title || 'Номенклатура'}"
                class="product-card-img"
              />
              <div class="product-card-body">
                <h3 class="product-card-title">${review.title || 'Номенклатура'}</h3>
                <div class="product-card-price">${review.price} ₽</div>
              </div>
            </div>

          `).join('') : `
            <div class="no-reviews">
              <i class="far fa-comment-alt"></i>
              <p>Рекомендаций пока нет</p>
            </div>
          `}

          </div>
          <h2 class="section-title" style="margin-top: 40px">С этим покупают</h2>
          <div class="products-grid">
          ${product.bwt_products_map?.length ? product.bwt_products_map.map(review => `

            <div class="product-card">
              <img
                src="${review.img}"
                alt="${review.title || 'Номенклатура'}"
                class="product-card-img"
              />
              <div class="product-card-body">
                <h3 class="product-card-title">${review.title || 'Номенклатура'}</h3>
                <div class="product-card-price">${review.price} ₽</div>
              </div>
            </div>

          `).join('') : `
            <div class="no-reviews">
              <i class="far fa-comment-alt"></i>
              <p>Рекомендаций пока нет</p>
            </div>
          `}

          </div>
        </div>

      </div>
    </div>
    `;
}

// Вспомогательные функции
function generateRatingStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  let stars = "";

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars += '<i class="fas fa-star"></i>';
    } else if (i === fullStars && hasHalfStar) {
      stars += '<i class="fas fa-star-half-alt"></i>';
    } else {
      stars += '<i class="far fa-star"></i>';
    }
  }

  return stars;
}

function formatPrice(price) {
  return new Intl.NumberFormat("ru-RU").format(price);
}

function calculateDiscount(currentPrice, oldPrice) {
  return Math.round((1 - currentPrice / oldPrice) * 100);
}

//////
function initProductPageHandlers() {
  // Элементы галереи
  const mainImage = document.querySelector(".main-image");
  const thumbnails = document.querySelectorAll(".thumbnail");
  const zoomIcon = document.querySelector(".zoom-icon");

  // Zoom изображения (реализация через lightgallery)
  if (zoomIcon) {
    zoomIcon.addEventListener("click", (e) => {
        e.preventDefault();

        if (window.lightGallery) {
          const gallery = lightGallery(document.createElement("div"), {
            dynamic: true,
            dynamicEl: [
              {
                src: mainImage.src,
                thumb: mainImage.src,
                subHtml: mainImage.alt || "Просмотр товара",
              },
            ],
            download: false,
          });
          gallery.openGallery(0);
        } else {
          console.warn(
            "LightGallery не загружен. Открываю изображение в новой вкладке."
          );
          window.open(mainImage.src, "_blank");
        }
    });
  }

  // Обработчики для миниатюр
  thumbnails.forEach((thumb) => {
    thumb.addEventListener("click", function () {
      // Меняем главное изображение (убираем '-thumb' из URL)
      const newSrc = this.src.replace("-thumb", "-main") || this.src;
      mainImage.src = newSrc;
      mainImage.alt = this.alt || "Увеличенное изображение товара";

      // Обновляем активную миниатюру
      thumbnails.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");

      // Для логов
      console.log("Изображение изменено на:", newSrc);
    });
  });

  // Выбор цвета
  const colorOptions = document.querySelectorAll(".color-option");
  colorOptions.forEach((option) => {
    option.addEventListener("click", function () {
      const color = this.getAttribute("data-color");
      const colorName = this.getAttribute("data-color-name") || color;

      // Обновляем активный цвет
      colorOptions.forEach((opt) => opt.classList.remove("active"));
      this.classList.add("active");

      // Обновляем главное изображение (если есть разные изображения для цветов)
      const colorImages = JSON.parse(this.getAttribute("data-images") || "{}");
      if (colorImages.main) {
        mainImage.src = colorImages.main;
        thumbnails[0].src = colorImages.thumb || colorImages.main;
      }

      console.log("Выбран цвет:", colorName);
      updateProductVariant(); // Обновляем варианты товара
    });
  });

  // Выбор размера
  const sizeOptions = document.querySelectorAll(".size-option");
  sizeOptions.forEach((option) => {
    option.addEventListener("click", function () {
      const size = this.textContent.trim();
      const priceModifier = parseFloat(
        this.getAttribute("data-price-modifier") || 0
      );

      // Обновляем активный размер
      sizeOptions.forEach((opt) => opt.classList.remove("active"));
      this.classList.add("active");

      console.log("Выбран размер:", size);
      updateProductVariant(); // Обновляем варианты товара
    });
  });

  // Таблица размеров
  const sizeTableLink = document.querySelector(".size-table-link");
  if (sizeTableLink) {
    sizeTableLink.addEventListener("click", function (e) {
      e.preventDefault();
      // Реализация через модальное окно
      const modalContent = `
                <h3>Таблица размеров</h3>
                <img src="/images/size-chart.png" alt="Таблица размеров" style="max-width: 100%">
                <p>Размеры могут незначительно отличаться в зависимости от модели</p>
            `;
      showCustomModal("Таблица размеров", modalContent);
    });
  }

  // Кнопки действий
  const addToCartBtn = document.querySelector(".btn-primary");
  const buyNowBtn = document.querySelector(".btn-secondary");
  const wishlistBtn = document.querySelector(".btn-wishlist");
  const compareBtn = document.querySelector(".btn-compare");

  // Добавление в корзину
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", async function () {
      if (this.disabled) return;

      this.disabled = true;
      this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Добавляем...';

      try {
        const productData = getCurrentProductData();
        await addToCart(productData);

        this.innerHTML = '<i class="fas fa-check"></i> Добавлено!';
        showToast("Товар добавлен в корзину");

        setTimeout(() => {
          this.innerHTML = '<i class="fas fa-shopping-cart"></i> В корзине';
        }, 2000);
      } catch (error) {
        console.error("Ошибка добавления в корзину:", error);
        this.innerHTML =
          '<i class="fas fa-shopping-cart"></i> Добавить в корзину';
        this.disabled = false;
        showToast("Ошибка при добавлении в корзину", "error");
      }
    });
  }

  // Избранное
  if (wishlistBtn) {
    wishlistBtn.addEventListener("click", async function () {
      const isActive = this.classList.contains("active");
      const icon = this.querySelector("i");

      icon.classList.toggle("far");
      icon.classList.toggle("fas");

      try {
        if (isActive) {
          await removeFromWishlist(product_Id);
          this.classList.remove("active");
          showToast("Товар удален из избранного");
        } else {
          await addToWishlist(product_Id);
          this.classList.add("active");
          showToast("Товар добавлен в избранное");
        }
      } catch (error) {
        console.error("Ошибка избранного:", error);
        icon.classList.toggle("far");
        icon.classList.toggle("fas");
        showToast("Ошибка при обновлении избранного", "error");
      }
    });
  }

  // Сравнение
  if (compareBtn) {
    compareBtn.addEventListener("click", async function () {
      try {
        const productData = getCurrentProductData();
        await toggleCompare(productData);

        const isComparing = this.classList.contains("active");
        if (isComparing) {
          this.classList.remove("active");
          showToast("Товар удален из сравнения");
        } else {
          this.classList.add("active");
          showToast("Товар добавлен к сравнению");
        }
      } catch (error) {
        console.error("Ошибка сравнения:", error);
        showToast("Ошибка при сравнении товаров", "error");
      }
    });
  }

  // Вспомогательные функции
  function getCurrentProductData() {
    const selectedColor =
      document
        .querySelector(".color-option.active")
        ?.getAttribute("data-color") || "default";
    const selectedSize =
      document.querySelector(".size-option.active")?.textContent.trim() ||
      "standard";

    return {
      id: product_Id,
      groupId: product_group_Id,
      color: selectedColor,
      size: selectedSize,
      quantity: 1,
      price: getCurrentPrice(),
    };
  }

  function getCurrentPrice() {
    const priceText = document.querySelector(".current-price")?.textContent;
    return priceText ? parseInt(priceText.replace(/\D/g, "")) : 0;
  }

  function updateProductVariant() {
    // Здесь можно обновить цену в зависимости от выбранных вариантов
    const basePrice = 189900; // Базовая цена
    const sizeModifier = parseFloat(
      document
        .querySelector(".size-option.active")
        ?.getAttribute("data-price-modifier") || 0
    );

    const newPrice = basePrice + sizeModifier;
    const priceElement = document.querySelector(".current-price");
    if (priceElement) {
      priceElement.textContent =
        new Intl.NumberFormat("ru-RU").format(newPrice) + " ₽";
    }

    // Можно добавить обновление других параметров
  }
}

// Инициализация LightGallery (должна быть вызвана после загрузки библиотеки)
function initLightGallery() {
  window.lgData = {
    dynamic: true,
    dynamicEl: [],
    download: false,
    share: false,
  };

  const zoomGallery = document.getElementById("zoomGallery");
  if (zoomGallery) {
    zoomGallery.addEventListener("click", function () {
      lightGallery(this, window.lgData);
    });
  }
}

// Функция для throttle (оптимизация scroll-событий)
function throttle(func, limit) {
  let lastFunc;
  let lastRan;
  return function () {
    const context = this;
    const args = arguments;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function () {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

function showCustomModal(title, content) {
    // Находим или создаем модальное окно
    let modal = document.getElementById('customModal');
    
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'customModal';
      modal.className = 'modal-overlay';
      modal.innerHTML = `
        <div class="modal-content">
          <div class="modal-header">
            <h2>${title}</h2>
            <button class="close-btn">&times;</button>
          </div>
          <div class="modal-body">${content}</div>
        </div>
      `;
      document.body.appendChild(modal);
      
      // Добавляем обработчик закрытия
      modal.querySelector('.close-btn').addEventListener('click', () => {
        modal.style.display = 'none';
      });
    }
    
    // Показываем модальное окно
    modal.style.display = 'flex';
  }

document.addEventListener("DOMContentLoaded", function () {
  initProductPageHandlers();
});

document.addEventListener('DOMContentLoaded', function() {
  // Используем делегирование событий на document или ближайшем статическом родителе
  document.addEventListener('click', function(e) {
    // Проверяем, был ли клик на иконке вопроса или её дочернем элементе
    const icon = e.target.closest('.fa-question-circle');
    
    if (icon) {
      e.preventDefault();
      e.stopPropagation();
      
      // Получаем текст подсказки
      const tooltipText = icon.getAttribute('title') || 
                         icon.getAttribute('data-tooltip') || 
                         'Информация отсутствует';
      
      // Показываем модальное окно (используем существующее или создаем новое)
      showTooltipModal(tooltipText);
    }
  });
});

// Функция для отображения модального окна с подсказкой
function showTooltipModal(content) {
  // Проверяем, есть ли уже модальное окно
  let modal = document.getElementById('tooltip-modal');
  
  if (!modal) {
    // Создаем новое модальное окно, если его нет
    modal = document.createElement('div');
    modal.id = 'tooltip-modal';
    modal.className = 'tooltip-modal';
    modal.innerHTML = `
      <div class="tooltip-content">
        <h3>Справка</h3>
        <p>${content}</p>
        <button class="close-tooltip">Закрыть</button>
      </div>
    `;
    document.body.appendChild(modal);
    
    // Добавляем обработчик закрытия
    modal.querySelector('.close-tooltip').addEventListener('click', function() {
      modal.style.display = 'none';
    });
    
    // Закрытие при клике вне контента
    modal.addEventListener('click', function(e) {
      if (e.target === this) {
        this.style.display = 'none';
      }
    });
  } else {
    // Обновляем содержимое существующего модального окна
    modal.querySelector('.tooltip-content p').textContent = content;
  }
  
  // Показываем модальное окно
  modal.style.display = 'flex';
}
