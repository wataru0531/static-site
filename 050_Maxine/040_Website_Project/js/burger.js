// ハンバーガーメニュー

import gsap from "gsap";

const burger = document.querySelector(".burger");
const line1 = burger.querySelector(".line1");
const line2 = burger.querySelector(".line2");
const navBar = document.querySelector(".nav-bar"); // ドロワー
const logo = document.querySelector("#logo");

function navToggle(e) {
  // console.log(e.target)

  if (!e.target.classList.contains("active")) {
    e.target.classList.add("active");

    // ライン
    gsap.to(line1, 0.1, { rotate: "45", y: 5, background: "black" });
    gsap.to(line2, 0.1, { rotate: "-45", y: -5, background: "black" });

    // ドロワー部分
    gsap.to(navBar, 0.5, {
      clipPath: "circle(2500px at 100% -10%)",
      ease: "power4.inOut",
    });

    // ロゴ
    gsap.to(logo, 0.1, { color: "black" });

    document.body.classList.add("overflow") // 背景固定

  } else {
    e.target.classList.remove("active"); // 取り除く
    gsap.to(line1, 0.1, { rotate: "0", y: 0, background: "white" });
    gsap.to(line2, 0.1, { rotate: "0", y: 0, background: "white" });

    gsap.to(navBar, 0.5, {
      clipPath: "circle(50px at 100% 0%)",
      ease: "power4.inOut",
    });

    gsap.to(logo, 0.1, { color: "white" });
    document.body.classList.remove("overflow")
  }
}

burger.addEventListener("click", navToggle);


export {
  navToggle,
  
}