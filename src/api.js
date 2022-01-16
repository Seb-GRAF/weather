//api call to get city coords with name input in all languages
async function getCity(name) {
  let city = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${name}&appid=6f129145a03503e8e226740cda23a4ab`,
    { mode: "cors" }
  );
  return await city.json();
}

//gets json from OpenWeatherMap API
async function getWeather(name) {
  try {
    let city = await getCity(name);
    let response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${city[0].lat}&lon=${city[0].lon}&appid=6f129145a03503e8e226740cda23a4ab`,
      { mode: "cors" }
    );
    let weather = await response.json();
    return [weather, city];
  } catch {
    return false;
  }
}

export { getWeather };
