// В начале файла
if (typeof renderRatingStars !== 'function') {
  console.error('Функция renderRatingStars не определена!');
  // Определяем функцию здесь как fallback
  window.renderRatingStars = function() { return ''; };
}

// На странице product.html
const urlParams = new URLSearchParams(window.location.search);
const product_group_Id = urlParams.get("category");
const product_group_Name = urlParams.get("nameGroup");

// Состояние приложения
const appState = {
  currentPage: 1,
  itemsPerPage: localStorage.getItem('itemsPerPage') || 9, // По умолчанию 9
  selectedProducts: JSON.parse(localStorage.getItem('selectedProducts')) || [],
  comparedProducts: JSON.parse(localStorage.getItem('comparedProducts')) || []
};

// DOM элементы
const pageTitle = document.querySelector('.page-title');
const productsGrid = document.getElementById("productsGrid");
const paginationContainer = document.querySelector('.pagination');
const itemsPerPageSelector = document.createElement('div');
const loader = document.createElement('div');

// Инициализация Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Функция инициализации
function init() {
  // Настройка лоадера
  loader.className = 'loader';
  loader.innerHTML = '<div class="spinner"></div><p>Загрузка товаров...</p>';
  
  // Вставляем лоадер в productsGrid
  const productsGrid = document.getElementById('productsGrid');
  if (productsGrid) {
    productsGrid.appendChild(loader);
  } else {
    console.error('Элемент productsGrid не найден');
    return;
  }
  
  // Добавляем селектор количества товаров
  createItemsPerPageSelector();
  
  // Обновляем заголовок
  if (pageTitle) {
    pageTitle.textContent = product_group_Name;
  }
  
  // Загружаем товары
  loadProducts();
}

// Создаем селектор количества товаров на странице
function createItemsPerPageSelector() {
  const container = document.getElementById('itemsPerPageContainer');
  if (!container) {
    console.error('Контейнер для селектора не найден');
    return;
  }
  
  itemsPerPageSelector.className = 'items-per-page-selector';
  itemsPerPageSelector.innerHTML = `
    <span>Товаров на странице:</span>
    <select id="itemsPerPageSelect">
      <option value="9" ${appState.itemsPerPage == 9 ? 'selected' : ''}>9</option>
      <option value="18" ${appState.itemsPerPage == 18 ? 'selected' : ''}>18</option>
      <option value="36" ${appState.itemsPerPage == 36 ? 'selected' : ''}>36</option>
    </select>
  `;
  
  // Вставляем селектор в специальный контейнер
  container.appendChild(itemsPerPageSelector);
  
  // Обработчик изменения количества товаров
  document.getElementById('itemsPerPageSelect').addEventListener('change', (e) => {
    appState.itemsPerPage = parseInt(e.target.value);
    localStorage.setItem('itemsPerPage', appState.itemsPerPage);
    appState.currentPage = 1;
    loadProducts();
  });
}

// Загрузка товаров с пагинацией
function loadProducts() {
  productsGrid.innerHTML = '';
  productsGrid.appendChild(loader);
  
  db.collection("product groups")
    .doc("ey7qtg6FvfGLdzm82yHB")
    .collection(product_group_Id)
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        productsGrid.innerHTML = "<p class='no-products'>Товары не найдены</p>";
        return;
      }
      
      const allProducts = [];
      querySnapshot.forEach((doc) => {
        const productData = doc.data();
        productData.id = doc.id;
        allProducts.push(productData);
      });
      
      renderProductsPaginated(allProducts);
      setupPagination(allProducts.length);
    })
    .catch((error) => {
      console.error("Ошибка загрузки товаров: ", error);
      productsGrid.innerHTML = '<p class="error-message">Ошибка загрузки товаров</p>';
    });
}

// Рендер товаров с учетом пагинации
function renderProductsPaginated(products) {
  productsGrid.innerHTML = '';
  
  const startIndex = (appState.currentPage - 1) * appState.itemsPerPage;
  const endIndex = startIndex + appState.itemsPerPage;
  const productsToShow = products.slice(startIndex, endIndex);
  
  if (productsToShow.length === 0) {
    productsGrid.innerHTML = "<p class='no-products'>Нет товаров для отображения</p>";
    return;
  }
  
  productsToShow.forEach(productData => {
    const productCard = createProductCard(productData);
    productsGrid.innerHTML += productCard;
  });
  
  // Восстанавливаем состояние выбранных товаров
/*   restoreSelectedState();
 */  // Восстанавливаем состояние сравнения
/*   restoreComparedState();
 */}

// Настройка пагинации
function setupPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / appState.itemsPerPage);
  paginationContainer.innerHTML = '';
  
  if (totalPages <= 1) return;
  
  // Кнопка "Назад"
  const prevBtn = document.createElement('div');
  prevBtn.className = `page-link ${appState.currentPage === 1 ? 'disabled' : ''}`;
  prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
  prevBtn.addEventListener('click', () => {
    if (appState.currentPage > 1) {
      appState.currentPage--;
      loadProducts();
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
  });
  paginationContainer.appendChild(prevBtn);
  
  // Нумерация страниц
  for (let i = 1; i <= totalPages; i++) {
    const pageLink = document.createElement('div');
    pageLink.className = `page-link ${i === appState.currentPage ? 'active' : ''}`;
    pageLink.textContent = i;
    pageLink.addEventListener('click', () => {
      appState.currentPage = i;
      loadProducts();
      window.scrollTo({top: 0, behavior: 'smooth'});
    });
    paginationContainer.appendChild(pageLink);
  }
  
  // Кнопка "Вперед"
  const nextBtn = document.createElement('div');
  nextBtn.className = `page-link ${appState.currentPage === totalPages ? 'disabled' : ''}`;
  nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
  nextBtn.addEventListener('click', () => {
    if (appState.currentPage < totalPages) {
      appState.currentPage++;
      loadProducts();
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
  });
  paginationContainer.appendChild(nextBtn);
}

// Восстановление состояния выбранных товаров
/* function restoreSelectedState() {
  const productCards = document.querySelectorAll('.product-card');
  const selectButtons = document.querySelectorAll('.select-btn');
  
  selectButtons.forEach((button, index) => {
    const productId = button.closest('.product-card').dataset.productId;
    
    if (appState.selectedProducts.includes(productId)) {
      productCards[index].classList.add('selected');
      button.textContent = 'Выбрано';
      button.style.backgroundColor = '#4CAF50';
      
      // Обновляем информацию о выбранном товаре
      updateSelectedProductInfo(productCards[index]);
    }
    
    button.addEventListener('click', function() {
      const productCard = this.closest('.product-card');
      const productId = productCard.dataset.productId;
      
      // Удаляем выделение у всех товаров
      productCards.forEach(card => card.classList.remove('selected'));
      selectButtons.forEach(btn => {
        btn.textContent = 'Выбрать';
        btn.style.backgroundColor = '';
      });
      
      // Добавляем выделение текущему товару
      productCard.classList.add('selected');
      this.textContent = 'Выбрано';
      this.style.backgroundColor = '#4CAF50';
      
      // Обновляем состояние
      appState.selectedProducts = [productId];
      localStorage.setItem('selectedProducts', JSON.stringify(appState.selectedProducts));
      
      // Обновляем информацию о выбранном товаре
      updateSelectedProductInfo(productCard);
      
      // Прокрутка к выбранному товару
      document.querySelector('.selected-product-info').scrollIntoView({ behavior: 'smooth' });
    });
  });
}
 */
// Обновление информации о выбранном товаре
function updateSelectedProductInfo(productCard) {
  const selectedProductInfo = document.querySelector('.selected-product-info');
  if (!selectedProductInfo) return;
  
  const productTitle = productCard.querySelector('.product-title').textContent;
  const productSku = productCard.querySelector('.product-sku').textContent;
  const productPrice = productCard.querySelector('.product-price').textContent;
  
  selectedProductInfo.querySelector('.selected-product-title').textContent = `Вы выбрали: ${productTitle}`;
  selectedProductInfo.querySelector('p').innerHTML = `${productSku} | Цена: ${productPrice}`;
  selectedProductInfo.style.display = 'block';
}

// Восстановление состояния сравнения
function restoreComparedState() {
  const compareButtons = document.querySelectorAll('.compare-btn');
  
  compareButtons.forEach(button => {
    const productId = button.closest('.product-card').dataset.productId;
    
    if (appState.comparedProducts.includes(productId)) {
      button.classList.add('active');
      button.innerHTML = '<i class="fas fa-check"></i>';
      button.style.color = 'white';
      button.style.backgroundColor = 'red';
      button.style.borderColor = 'red';
    }
    
    button.addEventListener('click', function() {
      const productId = this.closest('.product-card').dataset.productId;
      const index = appState.comparedProducts.indexOf(productId);
      
      if (index === -1) {
        // Добавляем в сравнение
        appState.comparedProducts.push(productId);
        this.classList.add('active');
        this.innerHTML = '<i class="fas fa-check"></i>';
        this.style.color = 'white';
        this.style.backgroundColor = 'red';
        this.style.borderColor = 'red';
      } else {
        // Удаляем из сравнения
        appState.comparedProducts.splice(index, 1);
        this.classList.remove('active');
        this.innerHTML = '<i class="fas fa-balance-scale"></i>';
        this.style.color = '';
        this.style.backgroundColor = '';
        this.style.borderColor = '';
      }
      
      localStorage.setItem('comparedProducts', JSON.stringify(appState.comparedProducts));
    });
  });
}

// Обновленная функция создания карточки товара
function createProductCard(productData) {
  // Проверка и установка значений по умолчанию
  const {
    id = '',
    title = 'Название товара',
    sku = 'N/A',
    rating = 0,
    reviewCount = 0,
    price = 0,
    oldPrice = null,
    imageUrl = 'https://storage.yandexcloud.net/vikitchen/milan1.webp',
    isHit = false
  } = productData;

  return `
    <div class="product-card" data-product-id="${id}">
      ${isHit ? '<div class="product-badge">Хит</div>' : ''}
      <img src="${imageUrl}" 
           alt="${title}" 
           class="product-image"
           loading="lazy"/>
      <div class="product-body">
        <h3 class="product-title">${title}</h3>
        <div class="product-sku">Артикул: ${sku}</div>
        <div class="product-rating">
          ${renderRatingStars(rating)}
          <span>(${reviewCount})</span>
        </div>
        <div class="product-price">
          ${formatPrice(price)} ₽
          ${oldPrice ? 
            `<span class="product-old-price">${formatPrice(oldPrice)} ₽</span>` : ''}
        </div>
        <div class="product-actions">
          <button onclick="location.href='product.html?id=${productData.id}&groupId=${product_group_Id}'" class="select-btn">Выбрать</button>
        </div>
      </div>
    </div>
  `;
}

// Остальные вспомогательные функции (formatPrice, renderRatingStars) остаются без изменений
// Добавляем в начало файла, перед всеми функциями, которые их используют

// Форматирование цены с пробелами между тысячами
function formatPrice(price) {
  if (!price) return "0";
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// Генерация HTML для звезд рейтинга
function renderRatingStars(rating) {
  if (!rating) rating = 0;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  let stars = "";

  // Полные звезды
  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="fas fa-star"></i>';
  }

  // Половина звезды
  if (hasHalfStar) {
    stars += '<i class="fas fa-star-half-alt"></i>';
  }

  // Пустые звезды
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) {
    stars += '<i class="far fa-star"></i>';
  }

  return stars;
}

// Инициализируем приложение
document.addEventListener('DOMContentLoaded', init);