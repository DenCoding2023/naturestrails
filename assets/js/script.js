const searchButton = document.querySelector("#submit-form")

function formSubmitHandler(event) {
  event.preventDefault();
  searchWeather();
  console.log("Pressing submit.");
  // var value = nameInputEl.value.trim();

  // if (cityNamePattern.test(value)) {
  //   var city = value;
  //   cityLookup(city);
  // } else {
  //   alert("Invalid input.");
  // }
}


// Added a event lisitner with the API key to set tem, humidity and citry name//
searchButton.addEventListener("submit", formSubmitHandler);

function searchWeather(){

  var city = document.querySelector("#city-name").value

  var searchHistory =[]
  searchHistory.push(city);
  console.log(searchHistory)
  localStorage.setItem('search-history', JSON.stringify(searchHistory))
  

//    var city was here I moved it to the top to test///
  var ApiKey = "7bdab0cf3daa341b1d431ecfe8584de8"
  fetch("https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+ApiKey+"&units=imperial")
  .then(res=>res.json())
  .then(data=>{
      console.log(data)

      // document.querySelector(".box-bodyToday").innerHTML="Wind Speed: "+data.wind.speed+"MPH"
      // document.querySelector(".box-bodyTemp").innerHTML="Temp: "+data.main.temp+"℉"
      // document.querySelector(".box-maxTemp").innerHTML="Max Temp: "+data.main.temp_max+"℉"
      // document.querySelector(".box-minTemp").innerHTML="Min Temp: "+data.main.temp_min+"℉"
      // document.querySelector(".box-Humidity").innerHTML="Humidity: "+data.main.humidity+"%"
      // document.querySelector(".boxCityName").innerHTML="City name: "+data.name
      // document.querySelector(".icons").innerHTML="Icon: "+data.weather[0].icon
  })
}


document.querySelector("#button-addon2").addEventListener("click", searchWeather)