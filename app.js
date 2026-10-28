const apiKey = "OPEN_WEATHER_API_KEY";

const URL = "https://api.openweathermap.org/data/2.5/weather?";
const weatherIconURL = "https://openweathermap.org/payload/api/media/file/";
const geoCodeURL = "https://api.openweathermap.org/geo/1.0/direct?q=";

const loader = document.querySelector(".loader");
const container = document.querySelector(".container");

const heading = document.querySelector("h3");
const input = document.querySelector("input");
const searchAgain = document.createElement("p");

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

const hourlyScroll = document.querySelector(".hourly-scroll");
const weeklyScroll = document.querySelector(".weekly-scroll");

const hourlyWeeklyData = () => {
  hourlyScroll.replaceChildren();
  weeklyScroll.replaceChildren();

  const futureTime = new Date();

  for (let i = 0; i < 24; i++) {
    const time = new Date(futureTime);
    time.setHours(time.getHours() + i);

    const div = document.createElement("div");
    div.classList.add("hour-temp", "tile-background");
    hourlyScroll.append(div);
    div.innerText = time.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  const date = new Date();
  for (let i = 0; i < 7; i++) {
    const dateStamp = new Date(date);
    dateStamp.setDate(dateStamp.getDate() + i);

    const div = document.createElement("div");
    div.classList.add("week-temp", "tile-background");
    weeklyScroll.append(div);
    div.innerText = `${dateStamp.toDateString().slice(0, 3)} - __°C`;
  }
  loader.classList.add("hide");
  container.classList.remove("hide");
};

const displayQuickStatsAndIndicators = (data) => {
  const wthrData = data;

  heading.classList.remove("hide");
  heading.innerText = wthrData.name;

  weatherIcon.setAttribute(
    "src",
    `${weatherIconURL}${wthrData.weather[0].icon}.png`,
  );
  weatherMain.innerText = wthrData.weather[0].main;
  weatherDesc.innerText = wthrData.weather[0].description;
  temp.innerText = `${wthrData.main.temp}°C`;
  tempFeels.innerText = `Feels like ${wthrData.main.feels_like}°C`;

  windSpeed.innerText = `Wind: ${wthrData.wind.speed}m/s`;
  humidity.innerText = `Humidity: ${wthrData.main.humidity}%`;
  pressure.innerText = `Pressure: ${wthrData.main.pressure}hPa`;
  visibility.innerText = `Visibility: ${wthrData.visibility}m`;
  hourlyWeeklyData();
};

const loadedInterface = async () => {
  try {
    const response = await fetch(
      `${URL}lat=12.9716&lon=77.5946&units=metric&appid=${apiKey}`,
    );

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    displayQuickStatsAndIndicators(data);
  } catch (error) {
    document.body.replaceChildren();
    document.body.style.color = "red";
    document.body.style.display = "flex";
    document.body.style.justifyContent = "center";
    document.body.style.alignItems = "center";
    document.body.innerText =
      "Network Error. Please check your Internet Connection";
  }
};

window.addEventListener("load", () => {
  if (!heading.classList.contains("hide")) heading.classList.add("hide");
  container.classList.add("hide");
  searchAgain.classList.add("hide");
  loadedInterface();
});

const fetchWeatherData = async (lat, lon) => {
  try {
    const response = await fetch(
      `${URL}lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`,
    );

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    displayQuickStatsAndIndicators(data);
  } catch (error) {
    document.body.replaceChildren();
    document.body.style.color = "red";
    document.body.style.display = "flex";
    document.body.style.justifyContent = "center";
    document.body.style.alignItems = "center";
    document.body.innerText =
      "Network Error. Please check your Internet Connection";
  }
};

const fetchCoordinates = async (place) => {
  try {
    const response = await fetch(
      `${geoCodeURL}${place},IN&limit=5&appid=${apiKey}`,
    );

    //server side errror
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    //server rendered data
    const data = await response.json();

    //but city not found
    if (data.length === 0) {
      loader.classList.add("hide");
      container.classList.remove("hide");
      searchAgain.classList.remove("hide");
      searchAgain.innerText = "City not found. Please enter valid city name";
      searchAgain.style.color = "red";
      document.querySelector("header").append(searchAgain);
      document.querySelector("main").classList.add("hide");
      return null;
    }

    //if city found....
    fetchWeatherData(data[0].lat, data[0].lon);
  } catch (error) {
    //network failure or another error
    document.body.replaceChildren();
    document.body.style.color = "red";
    document.body.style.display = "flex";
    document.body.style.justifyContent = "center";
    document.body.style.alignItems = "center";
    document.body.innerText =
      "Network Error. Please check your Internet Connection";
    return null;
  }
};

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    loader.classList.remove("hide");
    container.classList.add("hide");
    searchAgain.classList.add("hide");
    document.querySelector("main").classList.remove("hide");
    const place = e.target.value.trim();
    if (!heading.classList.contains("hide")) heading.classList.add("hide");
    fetchCoordinates(place);
  }
});
