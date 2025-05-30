// Инициализация Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

/* Коллекция: salons
Документ: (автоID)
Поля:
- city: string (например "Москва")
- address: string (полный адрес)
- workingHours: string (например "10:00 - 20:00")
- coords: array [широта, долгота] (например [55.7558, 37.6176])
- photo: string (URL фото)
- comingSoon: boolean (true/false) */

document.addEventListener("DOMContentLoaded", function () {
  const db = firebase.firestore();
  const salonsCollection = db.collection("salons"); // Коллекция в Firestore

  ymaps.ready(initMap);

  let map;
  let placemarks = [];

  function initMap() {
    map = new ymaps.Map("map", {
      center: [55.76, 37.64],
      zoom: 10,
    });

    loadSalons();
  }

  function loadSalons() {
    salonsCollection.get().then((querySnapshot) => {
      const salonsData = [];
      const cities = new Set();

      querySnapshot.forEach((doc) => {
        const salon = doc.data();
        salon.id = doc.id; // Добавляем ID документа
        salonsData.push(salon);
        cities.add(salon.city);
      });

      updateCityFilter(cities);
      displaySalons(salonsData);
    });
  }

  function updateCityFilter(cities) {
    const citySelect = document.getElementById("citySelect");

    cities.forEach((city) => {
      const option = document.createElement("option");
      option.value = city;
      option.textContent = city;
      citySelect.appendChild(option);
    });

    citySelect.addEventListener("change", (e) => {
      filterSalons(e.target.value);
    });
  }

  function filterSalons(city) {
    salonsCollection.get().then((querySnapshot) => {
      const filteredSalons = [];

      querySnapshot.forEach((doc) => {
        const salon = doc.data();
        if (city === "all" || salon.city === city) {
          filteredSalons.push(salon);
        }
      });

      displaySalons(filteredSalons);
    });
  }

  function displaySalons(salons) {
    const salonsList = document.getElementById("salonsList");
    salonsList.innerHTML = "";

    // Очищаем карту
    placemarks.forEach((pm) => map.geoObjects.remove(pm));
    placemarks = [];

    salons.forEach((salon) => {
      // Карточка салона
      const salonElement = document.createElement("div");
      salonElement.className = `salon-card ${
        salon.comingSoon ? "coming-soon" : ""
      }`;
      salonElement.innerHTML = `
          <div class="salon-photo" style="background-image: url('${
            salon.photo
          }')"></div>
          <div class="salon-info">
            <h3>${salon.city}</h3>
            <p class="salon-address">${salon.address}</p>
            <p class="salon-hours">${
              salon.comingSoon ? "Скоро открытие" : salon.workingHours
            }</p>
          </div>
        `;

      // Метка на карте
      const placemark = new ymaps.Placemark(
        salon.coords,
        {
          balloonContent: `
              <strong>${salon.city}</strong><br>
              ${salon.address}<br>
              ${
                salon.comingSoon
                  ? "<em>Скоро открытие</em>"
                  : salon.workingHours
              }
            `,
        },
        {
          preset: salon.comingSoon ? "islands#grayIcon" : "islands#blueIcon",
        }
      );

      map.geoObjects.add(placemark);
      placemarks.push(placemark);

      salonElement.addEventListener("click", () => {
        map.setCenter(salon.coords, 17);
        placemark.balloon.open();
      });

      salonsList.appendChild(salonElement);
    });

    if (placemarks.length > 0) {
      map.setBounds(map.geoObjects.getBounds(), {
        checkZoomRange: true,
      });
    }
  }
});

