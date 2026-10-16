const URL = `https://api.openweathermap.org/data/2.5/weather?lat=12.9716&lon=77.5946&units=metric&appid={apiKey}`;
const weatherIconURL = "https://openweathermap.org/payload/api/media/file/";

const weatherMain = document.querySelector("#weather");
const weatherIcon = document.querySelector("#weather-icon");
const weatherDesc = document.querySelector("#weather-desc");
const temp = document.querySelector("#temp");
const tempFeels = document.querySelector("#temp-feels");

const windSpeed = document.querySelector("#wind-speed");
const humidity = document.querySelector("#humidity");
const uvIndex = document.querySelector("#uv-index");
const pressure = document.querySelector("#pressure");
const visibility = document.querySelector("#visibility");
const dewPoint = document.querySelector("#dew-point");

const loadedInterface = async () => {
  const response = await fetch(URL);
  const data = await response.json();

  const heading = document.createElement("h3");
  document.querySelector("header").prepend(heading);
  heading.innerText = data.name;

  weatherIcon.setAttribute(
    "src",
    `${weatherIconURL}${data.weather[0].icon}.png`,
  );
  weatherMain.innerText = data.weather[0].main;
  weatherDesc.innerText = data.weather[0].description;
  temp.innerText = `${data.main.temp}°C`;
  tempFeels.innerText = `Feels like ${data.main.feels_like}°C`;

  windSpeed.innerText = `Wind: ${data.wind.speed}m/s`;
  humidity.innerText = `Humidity: ${data.main.humidity}%`;
  pressure.innerText = `Pressure: ${data.main.pressure}hPa`;
  visibility.innerText = `Visibility: ${data.visibility}km`;
};

window.addEventListener("load", () => {
  loadedInterface();
});
