// import after editing the config.js.dist file name and inputing API
import { config } from './config.js';

//  Access DOM elements
const cityName = document.querySelector('.city');
const weatherIcon = document.getElementById('icon-id');
const weatherDescription = document.querySelector('.description');
const temperatureValue = document.querySelector('.temp');
const humidtyValue = document.querySelector('.humidity');
const windIntensity = document.querySelector('.wind');
const searchButton = document.querySelector('.search-button');
const searchInput = document.querySelector('.search-bar');

document.getElementById('icon-id').style.width = '50px';

// getting real images of cities
function backgroundChange(city_name) {
  document.body.style.backgroundImage =
    "url('https://source.unsplash.com/1600x900/?" + city_name + "')";
}

// Function for Toggle switch
document.getElementById('checkbox').addEventListener('change', function () {
  let degreeSign = document.querySelector('.temp').textContent;

  let temp = document.querySelector('.temp').textContent.slice(0, -3);

  //If temperature is in C, convert to F
  if (degreeSign.slice(-1) === 'C') {
    temp = Math.round(temp * (9 / 5)) + 32;
    degreeSign = 'F';
    document.querySelector('.temp').innerText = temp + ' °' + degreeSign;
  } else {
    //If temperature is in F, convert to C
    temp = Math.round((temp - 32) * (5 / 9));
    degreeSign = 'C';
    document.querySelector('.temp').innerText = temp + ' °' + degreeSign;
  }
});

//Common url for both instances of fetch //
let apiKey = config.apikey;
let url = `https://api.weatherbit.io/v2.0/current?&key=${apiKey}&`;

// Function to get Local weather using coordinates longitude and latitude

function localWeather() {
  let long;
  let lat;
  //If user allows geolocation, retrieve success/error function //
  navigator.geolocation.getCurrentPosition(success, error);

  function success(position) {
    long = position.coords.longitude;
    lat = position.coords.latitude;

    // Using fetch to send request for weather data and return json data
    fetch(`${url}&lat=${lat}&lon=${long}`)
      .then((response) => response.json())
      .then((data) => {
        let { city_name } = data.data[0];

        const { icon, description } = data.data[0].weather;
        let { temp, rh } = data.data[0];
        const { wind_spd } = data.data[0];

        // Removing the loading page and adding toggle switch onload
        document.querySelector('.loader').classList.remove('loader');

        document.getElementById('loader-text').textContent = '';

        document.querySelector('.switch').classList.add('active');

        // Displaying relevant data through the DOM
        cityName.textContent = 'Weather in ' + city_name;

        weatherIcon.src = `https://www.weatherbit.io/static/img/icons/${icon}.png`;

        weatherDescription.textContent = description;

        temperatureValue.textContent = Math.round(temp) + ' °C';

        humidtyValue.textContent = 'Humidity: ' + rh + '%';

        windIntensity.textContent =
          'Wind speed: ' + Math.round(wind_spd) + 'km/h';
        backgroundChange(city_name);
      });
  }

  //If error, alert user //
  function error(err) {
    switch (err.code) {
      case err.PERMISSION_DENIED:
        alert(
          'User denied the request for Geolocation, Please search by city.'
        );
    }
  }
}
// Automatically get weather once HTML contents are loaded
window.addEventListener('DOMContentLoaded', () => {
  // test for usable internet connection
  if (navigator.onLine === false) {
    alert('offline, Please turn on Wifi or Mobile data');
  }

  localWeather();
});

// Function to get any City's weather using the City's Name.

let city;
function requestCityWeather(city) {
  // Using fetch to send request for weather data and return json data
  fetch(`${url}&city=${city}`)
    .then((response) => response.json())
    .then((data) => {
      let { city_name } = data.data[0];
      const { icon, description } = data.data[0].weather;
      let { temp, rh } = data.data[0];
      const { wind_spd } = data.data[0];

      // Removing the loading page and adding toggle switch onload
      document.querySelector('.active-loader').classList.remove('loader');
      document.querySelector('.switch').classList.add('active');
      document.getElementById('loader-text').textContent = '';

      // Displaying relevant data through the DOM
      cityName.textContent = 'Weather in ' + city_name;

      weatherIcon.src = `https://www.weatherbit.io/static/img/icons/${icon}.png`;

      weatherDescription.textContent = description;

      temperatureValue.textContent = Math.round(temp) + ' °C';

      humidtyValue.textContent = 'Humidity: ' + rh + '%';

      windIntensity.textContent =
        'Wind speed: ' + Math.round(wind_spd) + 'km/h';
      backgroundChange(city_name);
    });
}

searchButton.addEventListener('click', () => {
  city = searchInput.value;
  requestCityWeather(city);
  // resets search input value
  searchInput.value = '';
  // resets the toggle switch
  document.getElementById('checkbox').checked = false;
});

// enabling search with enter key //
searchInput.addEventListener('keyup', function (e) {
  if (e.key === 'Enter') {
    city = searchInput.value;
    requestCityWeather(city);
    searchInput.value = '';
    document.getElementById('checkbox').checked = false;
  }
});

// Footer data
//Determine current date and store that as a variable
let time = new Date();
let year = time.getFullYear();

//Insert the copyright text at the bottom of the footer
document.getElementById('copy').innerHTML =
  '&copy; ' + year + ' Okolie James (devJames). All rights reserved.';
