document.addEventListener("DOMContentLoaded", function () {
  // Инициализация модальных окон
  const modal = document.getElementById("universalModal");
  const thankYouModal = document.getElementById("thankYouModal");
  const openModalBtns = document.querySelectorAll(
    ".open-modal-btn, .callback-btn, .cta-button, .promo-button, .download-btn, .open-feedback-btn, .service-cta, .material-link, .btn btn-secondary, .add-review-btn, .add-question-btn"
  );
  const closeBtns = document.querySelectorAll(".close-btn, #closeThankYouBtn");

  // Маска для телефона
  const phoneInput = document.getElementById("userPhone");
  IMask(phoneInput, {
    mask: "+{7} (000) 000-00-00",
    lazy: false,
  });

  // Генерация капчи
  function generateCaptcha() {
    const chars = "0123456789";
    let captcha = "";
    for (let i = 0; i < 1; i++) {
      captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return captcha;
  }

  let currentCaptcha = generateCaptcha();
  document.getElementById("captchaText").textContent = currentCaptcha;

  document
    .getElementById("refreshCaptcha")
    .addEventListener("click", function () {
      currentCaptcha = generateCaptcha();
      document.getElementById("captchaText").textContent = currentCaptcha;
    });

  // Хранение данных кнопки и заголовка
  let currentButtonText = "";
  let currentTitle = "";

  // Вешаем обработчик на document (или ближайшего статического родителя)
  document.addEventListener("click", function (event) {
    const btn = event.target.closest("[data-modal-type]");
    if (!btn) return;

    // Получаем все необходимые атрибуты
    const modalType = btn.getAttribute("data-modal-type");
    currentTitle = btn.getAttribute("data-title") || "";
    currentButtonText = btn.getAttribute("data-button-text") || "";
    const hideComment = btn.getAttribute("data-hide-comment") === "true";
    const commentPlaceholder =
      btn.getAttribute("data-comment-placeholder") || ""; // Добавляем получение placeholder

    // Получаем элементы DOM
    const modal = document.getElementById("universalModal");
    const commentGroup = document.getElementById("commentGroup");
    const userComment = document.getElementById("userComment");

    if (!modal || !commentGroup || !userComment) {
      console.error("Required elements not found");
      return;
    }

    // Настройка формы
    document.getElementById("modalTitle").textContent = currentTitle;
    document.getElementById("submitBtn").textContent = currentButtonText;
    document.getElementById("formType").value = modalType;
    document.getElementById("pageUrl").value = window.location.href;

    // Управление полем комментария
    commentGroup.style.display = hideComment ? "none" : "block";
    userComment.placeholder = commentPlaceholder;

    // Настройка окна благодарности (если используется)
    const thankYouTitle = btn.getAttribute("data-thankyou-title");
    const thankYouText = btn.getAttribute("data-thankyou-text");

    if (thankYouTitle) {
      document.getElementById("thankYouTitle").textContent = thankYouTitle;
    }
    if (thankYouText) {
      document.getElementById("thankYouText").textContent = thankYouText;
    }

    // Показываем модальное окно
    modal.style.display = "flex";
  });

  // Для капчи используйте отдельную проверку
// Функция валидации капчи
function validateCaptcha() {
  const captchaInput = document.getElementById('captchaInput');
  const captchaError = document.getElementById('captchaInputError');
  
  if (!captchaInput || !captchaError) return false;
  
  const isValid = captchaInput.value === currentCaptcha;
  
  // Устанавливаем соответствующий текст ошибки
  if (!isValid) {
    captchaError.textContent = 'Неверный код с картинки';
    captchaError.style.display = 'block';
  } else {
    captchaError.style.display = 'none';
  }
  
  return isValid;
}

// Обработчик ввода капчи
document.getElementById('captchaInput').addEventListener('input', function() {
  validateCaptcha();
  checkFormValidity();
});

// Обновите функцию checkFormValidity
function checkFormValidity() {
  const isFormValid = validateField('userName', 'name') && 
                     validateField('userPhone', 'phone') &&
                     validateField('privacyCheckbox', 'checkbox');
  
  const isCaptchaValid = validateCaptcha();
  
  document.getElementById('submitBtn').disabled = !(isFormValid && isCaptchaValid);
  
  return isFormValid && isCaptchaValid;
}

  // Закрытие модальных окон
  closeBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      modal.style.display = "none";
      thankYouModal.style.display = "none";
    });
  });

  // Oбработчик изменения чекбокса
  document.getElementById("privacyCheckbox").addEventListener("change", function() {
    validateField("privacyCheckbox", "checkbox");
    checkFormValidity();
  });

  // Валидация формы
  document
    .getElementById("universalForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      // Проверка валидности всех полей
      const nameValid = validateField("userName", "name");
      const phoneValid = validateField("userPhone", "phone");
      const captchaValid = document.getElementById("captchaInput").value === currentCaptcha;
      const privacyValid = validateField("privacyCheckbox", "checkbox");

        // Проверяем всю форму и капчу
      const isFormValid = checkFormValidity();
      const isCaptchaValid = validateField('captchaInput', 'captcha');
  
      if (!isFormValid || !isCaptchaValid) {
       // Прокручиваем к первой ошибке
      const firstError = document.querySelector('.error-message[style="display: block;"]');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
      }

      if (!privacyValid) return; // Блокируем отправку если нет согласия

      if (!captchaValid) {
        /*       document.getElementById('captchaError').style.display = 'block';
         */ const captchaError = document.getElementById("captchaInputError");
        captchaError.textContent = ""; // Сначала очищаем
        captchaError.textContent = "Не правильный код"; // Затем устанавливаем новый
      } else {
        /*       document.getElementById('captchaError').style.display = 'none';
         */ const captchaError = document.getElementById("captchaInputError");
        captchaError.textContent = ""; // Сначала очищаем
        captchaError.textContent = "Правильный код"; // Затем устанавливаем новый
      }

      if (nameValid && phoneValid && captchaValid) {
        // Собираем данные формы
        const formData = {
          name: document.getElementById("userName").value,
          phone: document.getElementById("userPhone").value,
          comment: document.getElementById("userComment").value,
          formType: document.getElementById("formType").value,
          buttonText: currentButtonText,
          title: currentTitle,
          pageUrl: document.getElementById("pageUrl").value,
        };

        // Отправляем в Telegram
        const isSent = await sendToTelegram(formData);

        if (isSent) {
          //Очищаем поле
          const captchaError = document.getElementById("captchaInputError");
          captchaError.textContent = ""; // Сначала очищаем

          // Показываем окно благодарности
          modal.style.display = "none";
          thankYouModal.style.display = "flex";

          // Сброс формы
          this.reset();
          currentCaptcha = generateCaptcha();
          document.getElementById("captchaText").textContent = currentCaptcha;

          // Автоматическое закрытие через 2 секунды
          setTimeout(() => {
            thankYouModal.style.display = "none";

            // Дополнительные действия после отправки
            if (formData.formType === "material") {
              const newWindow = window.open(
                "https://planplace.ru/clients/dmazygula/",
                "PlanPlace",
                "width=800,height=600"
              );

              if (!newWindow) {
                alert(
                  "Пожалуйста, разрешите всплывающие окна для просмотра материалов"
                );
              }
            }
          }, 2000);
        } else {
          alert("Ошибка отправки сообщения. Пожалуйста, попробуйте позже.");
        }
      }
    });

// Новая улучшенная функция валидации
function validateField(fieldId, type) {
  const field = document.getElementById(fieldId);
  if (!field) {
    console.error(`Поле ${fieldId} не найдено`);
    return false;
  }

  // Находим элемент ошибки по шаблону: fieldId + "Error"
  const errorElement = document.getElementById(`${fieldId}Error`);
  if (!errorElement) {
    console.error(`Элемент ошибки для ${fieldId} не найден`);
    return false;
  }

  let isValid = false;

  switch (type) {
    case 'name':
      isValid = /^[а-яА-ЯёЁa-zA-Z\s]{2,30}$/.test(field.value.trim());
      break;
    case 'phone':
      isValid = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(field.value);
      break;
    case 'text':
      isValid = field.value.trim().length <= 500;
      break;
    case 'checkbox':
      isValid = field.checked;
      break;
    case 'captcha':
      isValid = field.value === currentCaptcha;
      break;
    default:
      console.warn(`Неизвестный тип валидации: ${type}`);
      isValid = true; // По умолчанию считаем валидным
  }

  errorElement.style.display = isValid ? 'none' : 'block';
  return isValid;
}
  
  // Валидация при вводе
  document.querySelectorAll("[data-validate]").forEach((field) => {
    field.addEventListener("input", function () {
      const validateType = this.getAttribute("data-validate");
      validateField(this.id, validateType);
      checkFormValidity();
    });
  });


 // Обновленная функция проверки всей формы
function checkFormValidity() {
  const fields = [
    { id: 'userName', type: 'name' },
    { id: 'userPhone', type: 'phone' },
    { id: 'privacyCheckbox', type: 'checkbox' }
  ];

  let allValid = true;
  
  fields.forEach(({id, type}) => {
    const isValid = validateField(id, type);
    if (!isValid) allValid = false;
  });

  const submitBtn = document.getElementById('submitBtn');
  if (submitBtn) {
    submitBtn.disabled = !allValid;
  }

  return allValid;
}

// Добавляем обработчики для динамической валидации
document.querySelectorAll('[data-validate]').forEach(field => {
  field.addEventListener('input', function() {
    const validateType = this.getAttribute('data-validate');
    validateField(this.id, validateType);
    checkFormValidity();
  });
});

// Для чекбокса отдельный обработчик
const privacyCheckbox = document.getElementById('privacyCheckbox');
if (privacyCheckbox) {
  privacyCheckbox.addEventListener('change', function() {
    validateField('privacyCheckbox', 'checkbox');
    checkFormValidity();
  });
}

  // Закрытие по клику вне модального окна
  window.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.style.display = "none";
    }
    if (e.target === thankYouModal) {
      thankYouModal.style.display = "none";
    }
  });
});

async function sendToTelegram(formData) {
  const botToken = "7718874593:AAEaP_dAXpGkMfXGZAZjDkfgteWhpEo_66E";
  const chatId = "825592923";

  if (!botToken || !chatId) {
    console.error("Не настроены Telegram параметры");
    return false;
  }

  // Форматируем сообщение с добавлением title и buttonText
  const messageText = `
📌 <b>Новая заявка</b>
━━━━━━━━━━━━━━━━━
<b>Тип формы:</b> ${formData.formType || "не указан"}
<b>Заголовок:</b> ${formData.title || "не указан"}
<b>Текст кнопки:</b> ${formData.buttonText || "не указан"}
<b>Имя:</b> ${formData.name || "не указано"}
<b>Телефон:</b> ${formData.phone || "не указан"}
<b>Комментарий:</b> ${formData.comment || "нет"}
<b>Страница:</b> ${formData.pageUrl || "не определена"}
━━━━━━━━━━━━━━━━━
📅 ${new Date().toLocaleString()}
  `.trim();

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: messageText,
          parse_mode: "HTML",
        }),
      }
    );

    const result = await response.json();

    if (!result.ok) {
      console.error("Telegram API Error:", result.description);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Network Error:", error);
    return false;
  }
}
