const submitForm = document.querySelector("#submit-form");
const submitButton = document.querySelector("#submit");
const fiveDayForecastEl = document.querySelector("#weather-forecast");
const mapContainerEl = document.querySelector("#map-display");
const weatherBox = document.querySelector("#weather-box");
const forecastBox = document.querySelector("#forecast-box");
const cityEl = document.querySelector("#city-input");
const sidebarEl = document.querySelector("#sidebar");
const submitFormEl = document.querySelector("#city-input");
const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
const modal = document.getElementById("myModal");
const span = document.getElementsByClassName("close")[0];
const modalMessage = document.querySelector("#modal-message");
var ApiKey = "7bdab0cf3daa341b1d431ecfe8584de8";
var limit = 1;
var maxTableSize = 10;
const cityNamePattern = /^(.+?)(?:, ([a-zA-Z]{2}), ([a-zA-Z]{2}))?$/;


window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

function formSubmitHandler(event) {
  event.preventDefault();
  var value = cityEl.value.trim();

  if (cityNamePattern.test(value)) {
    var city = value;
    searchWeather(city);
    displayHistory();
    } else {
      modal.style.display = "block";
      modalMessage.textContent = "Invalid city name. Please enter a valid city."
  }
}

span.onclick = function() {
  modal.style.display = "none";
}

function displayHistory() {
  const searchHistoryBox = document.querySelector("#search-history");
  searchHistoryBox.innerHTML = "";
  for (var i = 0; i < searchHistory.length; i++) {
    const savedCity = document.createElement("a");
    savedCity.classList =
  "saved-city";
    savedCity.setAttribute =
      ("href", "./index.html?city-name=" + searchHistory[i]);
    savedCity.textContent = searchHistory[i];
    (function (city) {
      savedCity.addEventListener("click", function () {
        searchWeather(city);
      });
    })(searchHistory[i]);
    searchHistoryBox.appendChild(savedCity);
  }
}

function searchWeather(city) {
  const cityIndex = searchHistory.indexOf(city);
  if (cityIndex > -1) {
    searchHistory.splice(cityIndex, 1);
  }
  searchHistory.unshift(city);
  if (searchHistory.length >= maxTableSize) {
    searchHistory.pop();
  }

  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  var limit = 1;
  var apiUrl =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&limit=" +
    limit +
    "&appid=" +
    ApiKey;

  fetch(apiUrl)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to fetch weather data: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      var lat = data[0].lat;
      var lon = data[0].lon;
      displayWeather(lat, lon);
      return convertLatLon(lat, lon);
    })
    .then((converted) => {
      if (converted) {
        const { x, y } = converted;
        displayMap(x, y);
      } else {
        modalMessage.textContent = "Conversion failed.";
        modal.style.display = "block";
      }
    })
    .catch((error) => {
      modalMessage.textContent = "Error during fetch or conversion. ", error;
      modal.style.display = "block";
    });
    cityEl.value = "";
}

function displayWeather(lat, lon) {
  fiveDayForecastEl.innerHTML = "";
  mapContainerEl.innerHTML = "";
  weatherBox.style.visibility = "visible";


  var lat = lat;
  var lon = lon;
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
    lat +
    "&lon=" +
    lon +
    "&units=imperial&appid=" +
    ApiKey;

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          let weatherIcon = document.querySelector(".icons");

          fiveDayForecast(data);

          document.querySelector("#name-city").innerHTML =
            "City Name: " + data.city.name;
          document.querySelector("#weather-container").innerHTML =
            "Temp: " + data.list[0].main.temp + "℉";
          document.querySelector("#humid-container").innerHTML =
            "Humidity: " + data.list[0].main.humidity + "%";
          document.querySelector("#w-speed").innerHTML =
            "Wind: " + data.list[0].wind.speed + " MLP";
          document.querySelector("#description").innerHTML =
            "Weather Conditions: " + data.list[0].weather[0].description;
          document.querySelector(".icons").innerHTML =
            "Weather Icon: " + data.list[0].weather[0].icon;

          let iconCode = data.list[0].weather[0].icon;
          let iconUrl = "https://openweathermap.org/img/wn/" + iconCode + ".png";
          weatherIcon.setAttribute("src", iconUrl);

          return;
        });
      } else {
        modalMessage.textContent - "Error: " + response.statusText
        modal.style.display = "block";
        
      }
    })
    .catch(function (error) {
      modalMessage.textContent - "Unable to connect to OpenWeatherMap: " + error
      modal.style.display = "block";
      
    });
}

function createMap(x, y) {
  const map = document.createElement("iframe");
  map.style.width = "100%";
  map.style.maxWidth = "1200px";
  map.style.height = "500px";
  map.classList = "has-ratio"
  map.src = `https://hikingproject.com/widget/map?favs=1&location=fixed&x=${x}&y=${y}&z=10&h=10`;
  return map;
}

function createTrailRecMap(x, y) {
  const map = document.createElement("iframe");
  map.style.width = "100%";
  map.style.maxWidth = "600px";
  map.style.height = "500px";
  map.classList = "has-ratio"
  map.src = `https://hikingproject.com/widget/trail?v=3&map=1&type=trail&id=0&x=${x}&y=${y}&z=5`;
  return map;
}

function createConditionsEl(x, y) {
  const map = document.createElement("iframe");
  map.style.width = "100%";
  map.style.maxWidth = "600px";
  map.style.height = "500px";
  map.classList = "has-ratio"
  map.src = `https://hikingproject.com/widget/conditions?v=3&x=${x}&y=${y}&z=5&height=400`;
  return map;
}

function displayMap(x, y) {
  const mapEl = createMap(x, y);
  const recommendTrailEl = createTrailRecMap(x, y);
  const conditionsEl = createConditionsEl(x, y);
  mapContainerEl.appendChild(mapEl);
  mapContainerEl.appendChild(recommendTrailEl);
  mapContainerEl.appendChild(conditionsEl);
}

function convertLatLon(lat, lon) {
  const webMercator = proj4('EPSG:3857');

  function latLngToXY(lat, lon) {
    const converted = webMercator.forward([lon, lat]);
    return { x: converted[0], y: converted[1] };
  }

  const coordinates = latLngToXY(lat, lon);
  const  { x, y } = coordinates;
  return { x, y };
}

function fiveDayForecast(data) {
  const minMaxTemps = getMinMaxTemp(data);
  const minMaxHumidity = getMinMaxHumidity(data);
  const groupedData = groupByDay(data);
  const dates = Object.keys(groupedData).slice(0, 6);

  dates.forEach((date) => {
    const day =
      groupedData[date].find((item) => item.dt_txt.includes("12:00:00")) ||
      groupedData[date][0];

    const fiveDayForecastWeatherEl = createWeatherBox(
      day,
      minMaxTemps[date],
      minMaxHumidity[date]
    );
    fiveDayForecastEl.appendChild(fiveDayForecastWeatherEl);
  });
}

function groupByDay(data) {
  const groupedData = {};

  for (var i = 0; i < data.list.length; i++) {
    var dateObj = data.list[i];
    const date = dateObj.dt_txt.split(" ")[0];
    if (!groupedData[date]) {
      groupedData[date] = [];
    }
    groupedData[date].push(dateObj);
  }
  return groupedData;
}

function getMinMaxTemp(data) {
  const groupedData = groupByDay(data);
  const dailyMinMax = {};

  for (const date in groupedData) {
    const dailyData = groupedData[date];
    let minTemp = Number.MAX_VALUE;
    let maxTemp = Number.MIN_VALUE;

    dailyData.forEach((item) => {
      minTemp = Math.min(minTemp, item.main.temp_min);
      maxTemp = Math.max(maxTemp, item.main.temp_max);
    });

    dailyMinMax[date] = {
      minTemp,
      maxTemp,
    };
  }

  return dailyMinMax;
}

function getMinMaxHumidity(data) {
  const groupedData = groupByDay(data);
  const dailyMinMaxHum = {};

  for (const date in groupedData) {
    const dailyData = groupedData[date];
    let minHum = Number.MAX_VALUE;
    let maxHum = Number.MIN_VALUE;

    dailyData.forEach((item) => {
      minHumidity = Math.min(minHum, item.main.humidity);
      maxHumidity = Math.max(maxHum, item.main.humidity);
    });

    dailyMinMaxHum[date] = {
      minHumidity,
      maxHumidity,
    };
  }

  return dailyMinMaxHum;
}

function createWeatherBox(day, minMaxTemp, minMaxHumidity) {
  const cardDiv = document.createElement("div");
  const cardDivBody = document.createElement("div");
  const forecastDate = document.createElement("h3");
  const weatherIcon = document.createElement("img");
  const weatherDescription = document.createElement("span");
  const weatherConditionsTemp = document.createElement("p");
  const weatherConditionsWind = document.createElement("p");
  const weatherConditionsHumMinMax = document.createElement("p");
  const weatherConditionsMinMax = document.createElement("p");

  cardDiv.classList = "card mb-6";
  cardDivBody.classList = "card-content";
  forecastDate.classList = "card-header-title";
  weatherDescription.classList = "card-content content is-capitalized is-family sans-serif has-text-weight-semibold is-size-4";
  weatherIcon.classList = "card-header-icon";

  weatherConditionsTemp.classList = "card-content ";
  weatherConditionsWind.classList = "card-content";
  weatherConditionsHumMinMax.classList = "card-content";
  weatherConditionsMinMax.classList = "card-content";

  let iconCode = day.weather[0].icon;
  let iconUrl = "https://openweathermap.org/img/wn/" + iconCode + ".png";
  weatherIcon.setAttribute("src", iconUrl);
  weatherDescription.textContent = day.weather[0].description;
  weatherConditionsTemp.textContent = "Temp: " + day.main.temp + "\xB0F";
  weatherConditionsMinMax.textContent =
    "Min: " +
    minMaxTemp.minTemp +
    "\xB0F, Max: " +
    minMaxTemp.maxTemp +
    "\xB0F";
  weatherConditionsWind.textContent = "Wind: " + day.wind.speed + " MPH";
  weatherConditionsHumMinMax.textContent =
    "Humidity: Min: " +
    minMaxHumidity.minHumidity + "%";
  let dateObj = new Date(day.dt * 1000);
  let options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  let formattedDate = new Intl.DateTimeFormat("en-US", options).format(dateObj);
  forecastDate.textContent = formattedDate;

  cardDivBody.appendChild(weatherConditionsTemp);
  cardDivBody.appendChild(weatherConditionsMinMax);
  cardDivBody.appendChild(weatherConditionsWind);
  cardDivBody.appendChild(weatherConditionsHumMinMax);
  cardDiv.appendChild(forecastDate);
  cardDiv.appendChild(weatherIcon);
  cardDiv.appendChild(weatherDescription);
  cardDiv.appendChild(cardDivBody);
  return cardDiv;
}

displayHistory();
submitForm.addEventListener("submit", formSubmitHandler);