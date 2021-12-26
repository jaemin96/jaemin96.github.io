("use strict");

// Greet Message
const greet = document.querySelector("#greet");

// clock
const clock = document.querySelector("#clock");

greet.innerHTML = `Hello, ${localStorage.getItem("USER_NAME")}`;

const getDate = () => {
  const date = new Date();

  let Hour = date.getHours();
  //   const Hour = String(date.getHours()).padStart(2, "0"); // PM, AM 구분 안할 경우
  const Minute = String(date.getMinutes()).padStart(2, "0");
  const Second = String(date.getSeconds()).padStart(2, "0");

  Hour > 12
    ? (Hour = `[PM] ${String(Hour - 12).padStart(2, "0")}`)
    : (Hour = `[AM] ${String(Hour).padStart(2, "0")}`);

  clock.innerText = `${Hour}:${Minute}:${Second}`;
};

getDate();
setInterval(getDate, 1000);
