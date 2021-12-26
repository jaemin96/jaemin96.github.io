("use strict");

const HIDDEN = "hidden";
const USER_NAME = "USER_NAME";

/* >> DOM 요소 접근 << */
// signIn
const signIn = document.querySelector("#signIn");

// session bg
const signPageImage = document.querySelector(".bgImage");

// session input
const userInputSession = document.querySelector("#signIn__userInput");
const userIdForm = document.querySelector("#userId");
const userInput = document.querySelector("#userId input");
const signInBtn = document.querySelector(".signInBtn");

// Success signIn page
const successSignIn = document.querySelector("#successSignIn");
const translucent = document.querySelector("#translucent");

const currentUserInfo = () => {
  // 로컬에 값이 저장되어 있는 경우 화면 전환 [실제로는 html요소 자체를 숨김]
  if (localStorage.getItem(USER_NAME)) {
    signIn.classList.add(HIDDEN); // signIn 숨기기 [원래는 라우팅으로 다른 페이지로 이동]
    successSignIn.classList.remove(HIDDEN); // 로그인 성공 시 나타나는 화면 표시
    translucent.classList.remove(HIDDEN);
  } else {
    signIn.classList.remove(HIDDEN);
    successSignIn.classList.add(HIDDEN);
  }
};

/* >> event Handler << */
const handlerFunction = {
  handleUserInfo: (e) => {
    e.preventDefault();

    // 공백을 입력하거나 입력하지 않은 경우 수행x
    if (userInput.value.trim() !== "") {
      window.location.reload(); // 페이지 리로딩
      localStorage.setItem(USER_NAME, userInput.value);
    }

    // 로그인 처리
    localStorage.getItem(USER_NAME) && currentUserInfo();
  },
};

// Background Image setting
const bgImage = document.createElement("img");
bgImage.style = "width: 100%; height: 100vh; object-fit: cover;";
bgImage.src = "/src/image/signIn-Img.jpg";
signPageImage.appendChild(bgImage);

// welcome message setting
const welcomeMessage = document.createElement("span");
welcomeMessage.classList.add("welcome");
welcomeMessage.innerHTML = "WELCOME:)";
userInputSession.appendChild(welcomeMessage);

currentUserInfo();

userIdForm.addEventListener("submit", handlerFunction.handleUserInfo);
signInBtn.addEventListener("click", handlerFunction.handleUserInfo);
