const searchButton = document.querySelector("#submit-form")
const cityNamePattern = /^(.+?)(?:, ([a-zA-Z]{2}), ([a-zA-Z]{2}))?$/;
var cityEl = document.querySelector("#city-name");
var ApiKey = "7bdab0cf3daa341b1d431ecfe8584de8"
var limit = 1;

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

// Added a event lisitner with the API key to set tem, humidity and citry name//
searchButton.addEventListener("submit", formSubmitHandler);

function searchWeather(city){

  var searchHistory =[]
  searchHistory.push(city);
  console.log(searchHistory)
  localStorage.setItem('search-history', JSON.stringify(searchHistory))
  

  var apiUrl =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&limit=" +
    limit +
    "&appid=" +
    ApiKey;

//    var city was here I moved it to the top to test///
  fetch(apiUrl)
  .then(res=>res.json())
  .then(data=>{
      console.log(data)

      var lat = data[0].lat;
      var lon = data[0].lon;
      displayWeather(lat, lon);

      // document.querySelector(".box-bodyToday").innerHTML="Wind Speed: "+data.wind.speed+"MPH"
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
          console.log(data);
          // const minMaxTemps = getMinMaxTemp(data);

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