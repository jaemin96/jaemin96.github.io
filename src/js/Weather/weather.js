("use strict");

const onGeoOk = (position) => {
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=1689aef2fb39496fb92b31818a91d81d&units=metric`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const city = document.querySelector(".city");
      const weather = document.querySelector(".weather");

      city.innerHTML = data.name;
      weather.innerHTML = data.weather[0].main;
    });
};

const onGeoError = () => {
  alert("can't find you!");
};

navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError);
