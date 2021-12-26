("use strict");

const loginForm = document.querySelector("#signIn");
const userId = document.querySelector("#signIn #userId");
const userPage = document.querySelector("#userPage");
const logoutBtn = document.querySelector("#successLogin #logoutBtn");
const greetMessage = document.querySelector("#login #greet");
const intro = document.querySelector("#main");

// 로그안버튼이 눌릴 경우 인풋의 값을 출력!!
// form - input 은 자동적으로 submit이 이루어지면서 새로고침을 기본으로 한다.
// 이런 기본 기능들을 막기위해 preventDefault() 를 사용한다.

const USER_NAME = "USER_NAME";
const hidden = "hide";

// exist id!!
const existId = (e) => {
  // 아이디 정보가 있을 시, 로그아웃 폼은 표시 로그인 폼은 표시하지 않음
  userPage.classList.remove(hidden);
  loginForm.classList.add(hidden);
};

// not exist id!!
const notExistId = (e) => {
  // 아이디 정보가 없을 시, 로그인 폼은 표시 로그아웃 폼은 표시하지 않음
  loginForm.classList.remove(hidden);
  userPage.classList.add(hidden);
};

// print user name!
const onPrintName = (name) => {
  greetMessage.innerText = `Hello, ${name}`;
};

// login!
const onLogin = (event) => {
  event.preventDefault();
  const name = userId.value; //중복 사용되는 입력 값 선언
  localStorage.setItem(USER_NAME, name); // 로컬스토리지에 아이디 정보 저장
  onPrintName(name); // 로그인 성공 시 메세지
  userId.value = "";
  existId();
};

// logout!
const onLogout = (event) => {
  event.preventDefault();
  notExistId();
  localStorage.removeItem(USER_NAME); // 로그아웃 시 로그인 정보 삭제
};

// Intro!
intro.addEventListener("click", () => {});

// saved user name
const SAVED_NAME = localStorage.getItem(USER_NAME);

// 유저 정보가 없는 경우에만 로그인 폼을 보이게 설정
if (localStorage.getItem(USER_NAME) === null) {
  notExistId();
  loginForm.addEventListener("submit", onLogin);
} else {
  existId();
  onPrintName(SAVED_NAME);
}

logoutBtn.addEventListener("click", onLogout);
