const searchButton = document.querySelector("#submit-form")

function formSubmitHandler(event) {
  event.preventDefault();
  console.log("Pressing submit.");
  // var value = nameInputEl.value.trim();

  // if (cityNamePattern.test(value)) {
  //   var city = value;
  //   cityLookup(city);
  // } else {
  //   alert("Invalid input.");
  // }
}
searchButton.addEventListener("submit", formSubmitHandler);