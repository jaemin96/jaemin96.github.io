("use strict");

const signOut = document.querySelector(".signOutBtn");

const onSignOut = () => {
  if (window.confirm("로그아웃 하시겠습니까?")) {
    localStorage.removeItem("USER_NAME"); // 로컬스토리지 아이디 정보 초기화
    window.location.reload(); // 페이지 리로딩
  }
};

signOut.addEventListener("click", onSignOut);
