import "./styles/index.scss";
import { getWeather } from "./api";
import {
  convertTemp,
  convertDecimal,
  dateAndTime,
  getDayNightTime,
  getFutureDay,
  getWindDirection,
} from "./utilities";
import { DateTime } from "luxon";

let tempUnit = "C";
let currentCity = "";
//default bg
document.querySelector(
  "body"
).style.backgroundImage = `url(${require("./assets/default.jpg")})`;

//temp unit selection
document.querySelector(".unit").addEventListener("click", async () => {
  let unit = document.querySelector(".unit");
  if (tempUnit === "C") {
    unit.classList.toggle("fahrenheit");
    unit.textContent = "°F";
    tempUnit = "F";
  } else {
    unit.classList.toggle("fahrenheit");
    unit.textContent = "°C";
    tempUnit = "C";
  }
  if (currentCity === "") return;
  console.log(currentCity);
  let weather = await getWeather(currentCity);
  displayWeather(weather, tempUnit);
});
//textarea enter submit
document
  .querySelector(".searchTextArea")
  .addEventListener("keydown", async (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    let city = e.target.value;
    currentCity = city;
    let weather = await getWeather(city);
    displayWeather(weather, tempUnit);
  });
//search button
document.querySelector(".searchBtn").addEventListener("click", async () => {
  let city = document.querySelector(".searchTextArea").value;
  currentCity = city;
  let weather = await getWeather(city);
  displayWeather(weather, tempUnit);
});

//default city
(async function () {
  currentCity = "New York";
  let weather = await getWeather("New York");
  displayWeather(weather, "C");
})();

async function displayWeather(response, unit) {
  if (!response) {
    document.querySelector(".card1").innerHTML = `
    <h1>City not found</h1>`;
    document.querySelector(".card2").innerHTML = `
    <h1 class="notFound">Something went wrong</h1>`;
    document.querySelector(".card3").innerHTML = `
    <h1 class="notFound">The city was not found, please search for an other city</h1>`;
    return;
  }

  //various declarations
  let container = document.querySelector(".container");
  container.innerHTML = "";
  const weather = response[0];
  const city = response[1];
  let decimal = 1;
  let date = dateAndTime(weather.timezone);
  console.log(weather);

  //sets bg based on weather condition
  (function setBg() {
    let c = weather.current.weather[0].main;
    let body = document.querySelector("body");
    if (c === "Mist" || c === "Fog")
      body.style.backgroundImage = `url(${require("./assets/mist.jpg")})`;
    if (c === "Clear")
      body.style.backgroundImage = `url(${require("./assets/clear.jpg")})`;
    if (c === "Clouds")
      body.style.backgroundImage = `url(${require("./assets/cloudy.jpg")})`;
    if (c === "Rain")
      body.style.backgroundImage = `url(${require("./assets/rain.jpg")})`;
    if (c === "Snow")
      body.style.backgroundImage = `url(${require("./assets/snow.jpg")})`;
  })();

  let left = document.createElement("div");
  left.classList.add("leftMain");
  container.appendChild(left);

  //creates first card at the top
  let card1 = document.createElement("div");
  left.appendChild(card1);
  card1.classList.add("card1");
  card1.innerHTML = `
  <div class="left">
  <div class ="city"> 
  <h4>${date.day}.${date.month}.${date.year}, ${date.hour}:${date.c.minute}</h4>
  <h3>${city[0].name}</h3>
  <h3>${city[0].country}</h3>
  </div>
  <h1>${convertTemp(weather.current.temp, unit, decimal)}°${unit}</h1>
  <h4>L: ${convertTemp(
    weather.daily[0].temp.min,
    unit,
    decimal
  )}, H: ${convertTemp(weather.daily[0].temp.max, unit, decimal)}</h4>
  </div>
  <div class=right>
  <img src="http://openweathermap.org/img/wn/${
    weather.current.weather[0].icon
  }@2x.png">
    <h3>${weather.current.weather[0].main}</h3>
  </div>
`;

  // creates second card with today details
  let card2 = document.createElement("div");
  left.appendChild(card2);
  card2.classList.add("card2");
  card2.innerHTML += `
  <div class="top">
  <h3>Today</h3>
  <p><b>${weather.daily[0].pop * 100}%</b> chance of rain</p>
  <p><b>${weather.current.humidity}%</b> humidity</p>
  <p>UV index of <b>${convertDecimal(weather.current.uvi, 0)}/10</b></p>
  <p>${getWindDirection(weather.current.wind_deg)} wind - <b>${
    weather.current.wind_speed
  }m/s</b></p>
  </div>
`;
  let sunrise = getDayNightTime(weather.current.sunrise, weather.timezone);
  let sunset = getDayNightTime(weather.current.sunset, weather.timezone);
  card2.innerHTML += `
  <div class="bottom">
  <div class="sunrise">
  <img src="${require("./assets/sunrise_icon.png")}">
  <p>${sunrise.c.hour}:${sunrise.c.minute}</p>
  </div>
  <div class="sunrise">
  <img src="${require("./assets/sunset_icon.png")}">
  <p>${sunset.c.hour}:${sunset.c.minute}</p>
  </div>

  </div>
  `;

  let right = document.createElement("div");
  right.classList.add("rightMain");
  container.appendChild(right);

  //creates third card with 7day forecast
  let card3 = document.createElement("div");
  right.appendChild(card3);
  card3.classList.add("card3");
  for (let i = 1; i <= 7; i++) {
    decimal = 0; //no decimal after temp
    card3.innerHTML += `
      <div class="day${i}">
      <div class="left">
      <h4>${getFutureDay(date.weekday, i)}</h3>
      <h3>${convertTemp(
        weather.daily[i].temp.min,
        unit,
        decimal
      )}°${unit} / ${convertTemp(
      weather.daily[i].temp.max,
      unit,
      decimal
    )}°${unit}</h4>
      <h4>${weather.daily[i].weather[0].main}</h3>
      </div>
      <div class="right">
      <img src="http://openweathermap.org/img/wn/${
        weather.daily[i].weather[0].icon
      }@2x.png">
      </div>
      </div>`;
  }
}
