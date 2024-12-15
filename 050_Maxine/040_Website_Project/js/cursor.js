
// カーソルのアニメーション

import gsap from "gsap";

const mouse = document.querySelector(".cursor");
const mouseText = mouse.querySelector("span");


function cursor(e) {
  // console.log(e) // MouseEvent {isTrusted: true, screenX: 636, screenY: 123, clientX: 636, clientY: 11, …}

  // let mouse = document.querySelector(".cursor");

  mouse.style.top = `${e.pageY}px`;
  mouse.style.left = `${e.pageX}px`;
}

//
function activeCursor(e) {
  // console.log("mouseover")
  const item = e.target; // mouseoverした要素を取得
  // console.log(item);

  // logo もしくは .burger
  if (item.id === "logo" || item.classList.contains("burger")) {
    mouse.classList.add("nav-active");
  } else {
    mouse.classList.remove("nav-active");
  }

  // exploreボタン
  if (item.classList.contains("explore")) {
    mouse.classList.add("explore-active");
    mouseText.innerText = "Tap";

    gsap.to(".title-swipe", 1, { y: "0%" })

  } else {
    mouse.classList.remove("explore-active");
    mouseText.innerText = "";

    gsap.to(".title-swipe", 1, { y: "100%" })

  }
}

window.addEventListener("mousemove", cursor);
window.addEventListener("mouseover", activeCursor);


export {
  cursor,
  
}