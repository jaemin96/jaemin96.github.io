("use strict");

// image 관리 객체 생성
const images = [
  { img: "christmas1.jpg" },
  { img: "christmas2.jpg" },
  { img: "christmas3.jpg" },
  { img: "christmas4.jpg" },
  { img: "christmas5.jpg" },
  { img: "christmas6.jpg" },
  { img: "christmas7.jpg" },
];

const userPage = document.querySelector("#successSignIn");
const bgImg = document.createElement("img");

const setBgImage = () => {
  bgImg.src = `/src/image/${
    images[Math.floor(Math.random() * images.length)].img
  }`;

  bgImg.style = "width: 100%; height: 100vh; object-fit:cover;";
};

setBgImage();
setInterval(setBgImage, 10000);

bgImg.classList.add("bgImage");
userPage.appendChild(bgImg);
