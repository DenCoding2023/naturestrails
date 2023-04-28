const searchButton = document.querySelector("#submit-form")
const cityNamePattern = /^(.+?)(?:, ([a-zA-Z]{2}), ([a-zA-Z]{2}))?$/;
var cityEl = document.querySelector("#city-name");
var ApiKey = "7bdab0cf3daa341b1d431ecfe8584de8"
var limit = 1;
var temp = {};
function formSubmitHandler(event) {
  event.preventDefault();
  console.log("Pressing submit.");
  var value = cityEl.value.trim();

  if (cityNamePattern.test(value)) {
    var city = value;
    searchWeather(city);
  } else {
    alert("Invalid input.");
  }
}

// Added a event lisitner with the API key to set tem, humidity and city name//
searchButton.addEventListener("submit", formSubmitHandler);

function searchWeather(city) {
  var searchHistory = []
  searchHistory.push(city);
  console.log(searchHistory)
  localStorage.setItem('search-history', JSON.stringify(searchHistory))

for (let i = 0; i < searchHistory.length; i++) {
    var list = document.createElement("li");
    list.setAttribute("class", "list-group-item");
    list.setAttribute("id", "city-name");
    list.textContent = searchHistory[i];
    cityEl.appendChild(list);
  }

  var apiUrl =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&limit=" +
    limit +
    "&appid=" +
    ApiKey;

  //    var city was here I moved it to the top to test///
  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      console.log(data)
      

      let weatherIcon= document.querySelector("#weather-container");
      // console.log(data)

      var lat = data[0].lat;
      var lon = data[0].lon;
      displayWeather(lat, lon);

// Trying out this function to see if it works//

      
      // document.querySelector(".box-bodyTemp").innerHTML="Temp: "+data.main.temp+"℉"
      // document.querySelector(".box-maxTemp").innerHTML="Max Temp: "+data.main.temp_max+"℉"
      // document.querySelector(".box-minTemp").innerHTML="Min Temp: "+data.main.temp_min+"℉"
      // document.querySelector(".box-Humidity").innerHTML="Humidity: "+data.main.humidity+"%"
      // document.querySelector(".boxCityName").innerHTML="City name: "+data.name
      // document.querySelector(".icons").innerHTML="Icon: "+data.weather[0].icon
    })
}

function displayWeather(lat, lon) {
  // var weatherContainerEl = document.querySelector("#weather-container");
  // var fiveDayForecastEl = document.querySelector("#forecast-container");
  // var citySearchEl = document.querySelector("#city-search-term");
  // var weatherBox = document.querySelector("#weather-box");

  // weatherContainerEl.innerHTML = "";
  // citySearchEl.innerHTML = "";
  // fiveDayForecastEl.innerHTML = "";

  // weatherBox.style.visibility = "visible";

  var lat = lat;
  var lon = lon;
  var apiUrl =
    "http://api.openweathermap.org/data/2.5/forecast?lat=" +
    lat +
    "&lon=" +
    lon +
    "&units=imperial&appid=" +
    ApiKey;

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          let weatherIcon= document.querySelector(".icons");
          console.log(data);
      temp = data;
          // const minMaxTemps = getMinMaxTemp(data);
          
          document.querySelector("#name-city").innerHTML="City Name: "+data.city.name;
          document.querySelector("#weather-container").innerHTML="Temp: "+data.list[0].main.temp+"℉";
          document.querySelector("#humid-container").innerHTML="Humidity: "+data.list[0].main.humidity+"%";
          document.querySelector("#w-speed").innerHTML="Wind: "+data.list[0].wind.speed+" MLP"
          document.querySelector("#description").innerHTML="Weather Conditions: "+data.list[0].weather[0].description;
          document.querySelector(".icons").innerHTML="Weather Icon: "+data.list[0].weather[0].icon

          let iconCode = data.list[0].weather[0].icon
          let iconUrl = "http://openweathermap.org/img/wn/" + iconCode + ".png";
          weatherIcon.setAttribute("src", iconUrl);
        
          
          // // Today
          // const todayDate = data.list[0].dt_txt.split(" ")[0];
          // const currentWeatherEl = createWeatherBox(
          //   data.list[0],
          //   minMaxTemps[todayDate]
          // );
          // weatherContainerEl.appendChild(currentWeatherEl);
          // citySearchEl.textContent =
          //   data.city.name + ", " + data.city.country;

          // // 5-Day Forecast

          // const middayForecastData = data.list.filter((item) =>
          //   item.dt_txt.includes("12:00:00")
          // );

          // middayForecastData.slice(0, 6).forEach((day) => {
          //   const date = day.dt_txt.split(" ")[0];
          //   const fiveDayForecastWeatherEl = createWeatherBox(
          //     day,
          //     minMaxTemps[date]
          //   );
          //   fiveDayForecastEl.appendChild(fiveDayForecastWeatherEl);
          // });
          return;
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect to OpenWeatherMap: " + error);
    });
}

// Section to modify as neede //
function createWeatherBox(day, minMaxTemp) {
  const cardDiv = document.createElement("div");
  const cardDivBody = document.createElement("div");
  const forecastDate = document.createElement("h3");
  const weatherIcon = document.createElement("img");
  const weatherDescription = document.createElement("span");
  const weatherConditionsTemp = document.createElement("p");
  const weatherConditionsWind = document.createElement("p");
  const weatherConditionsHum = document.createElement("p");
  const weatherConditionsMinMax = document.createElement("p");
  cardDiv.classList.add("card");
  cardDivBody.classList = "card-content";
  forecastDate.classList = "card-title fc-title";
  // chainging the card list to ?//
  weatherIcon.classList = "card-img-top fc-icon";
  weatherConditionsTemp.classList = "card-text fc-text";
  weatherConditionsWind.classList = "card-text fc-text";
  weatherConditionsHum.classList = "card-text fc-text";
  weatherConditionsMinMax.classList = "card-text fc-text";

  let iconCode = day.weather[0].icon;
  let iconUrl = "http://openweathermap.org/img/wn/" + iconCode + ".png";
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
  weatherConditionsHum.textContent = "Humidity: " + day.main.humidity + "%";
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
  cardDivBody.appendChild(weatherConditionsHum);
  cardDiv.appendChild(forecastDate);
  cardDiv.appendChild(weatherIcon);
  cardDiv.appendChild(weatherDescription);
  cardDiv.appendChild(cardDivBody);
  return cardDiv;
}