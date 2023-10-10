const latitude = 47.6;
const longitude = -122.33;
const APIkey = `830c7046b70053a5bb6012f04397d976`;

export const getForecastWeather = () => {
  const weatherApi = fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${APIkey}`
  ).then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(`Error: ${res.status}`);
    }
  });
  return weatherApi;
};

export const parseWeatherData = (data) => {
  const main = data.main;
  const temperature = main && main.temp;
  const weather = {
    temperature: {
      F: `${Math.round(temperature)}ºF`,
      C: `${Math.round(((temperature - 32) * 5) / 9)}ºC`,
    },
  };

  // weather.temperature.F = `${Math.round(data.main.temp)}°F`;
  // weather.temperature.C = `${Math.round((data.main.temp - 32) * 5/9)}°C`;
  console.log(
    weather,
    "this is current weather celsius and fahrenheit in weatherApi parse weather data"
  );
  return weather;
};

export const parseLocationData = (data) => {
  const currentLocation = data.name;
  console.log(currentLocation, "this is current location");
  return currentLocation;
};

export const parseWeatherForecastData = (data) => {
  const weather = data.weather;
  const forecast = weather && weather[0].main.toLowerCase();
  console.log("this is current forecast", forecast);
  return forecast;
};

export const parseTimeOfDay = (data) => {
  const currentTime = Date.now();
  const timeOfDay = data.sys;
  const sunrise = timeOfDay.sunrise * 1000;
  const sunset = timeOfDay.sunset * 1000;
  console.log(sunrise, "this is sunrise");
  console.log(sunset, "this is sunset");
  console.log(timeOfDay, "is this time of day converted??? ");

  if (currentTime > sunrise && currentTime < sunset) {
    return true;
  } else {
    return false;
  }
};

//export

//    "weather": [
//    {
//        "id": 500,
//        "main": "Rain",
//        "description": "light rain",
//        "icon": "10n"
//    }
// ],

//"dt": 1661870592,
//"sys": {
//    "type": 2,
//    "id": 2075663,
//    "country": "IT",
//    "sunrise": 1661834187,
//    "sunset": 1661882248
//  },

//For determining the time of day, you can compare Date.now()
//to the sunrise and sunset fields returned by the API.
//But be careful: Date.now() returns the time elapsed since January 1, 1970 in milliseconds.
//The weather API returns the time elapsed since January 1, 1970 in seconds.

//export default weatherApi

//  if (temperature >= 86) {
//      return 'hot';
//    } else if (temperature >= 66 && temperature <= 85) {
//      return 'warm';
//    } else if (temperature <= 65) {
//      return 'cold';
//    }
