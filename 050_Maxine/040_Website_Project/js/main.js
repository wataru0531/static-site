import "../sass/style.scss";

/**************************************************************
// ScrollMagic
// 参考 
  https://www.npmjs.com/package/scrollmagic
  https://www.npmjs.com/package/scrollmagic-plugins

***************************************************************/

import gsap from "gsap";
// import ScrollTrigger from "gsap/ScrollTrigger";

import * as ScrollMagic from "scrollmagic";
import barba from "@barba/core";

import {
  ScrollMagicPluginIndicator,
  ScrollMagicPluginGsap,
} from "scrollmagic-plugins";

// ScrollMagicPluginGsap ... ScrollMagicとGSAPの統合を可能にするプラグイン
// ScrollMagicのトリガーイベントに応じて、GSAPを使用して要素のアニメーションを制御が可能となる

import "./animateSlides.js";
import "./cursor.js";
import "./burger.js";
import "./page-transition.js";

import {
  animateSlides,
  controller,
  slideScene,
  pageScene,
  detailAnimation,
  detailScene,
} from "./animateSlides.js";

const hikeExpo = document.querySelector(".hike-exp");
const slide = document.querySelector(".hike");

// ScrollMagic
// インジケーターにScrollMagicを有効化
// ScrollMagicPluginIndicator(ScrollMagic);

// // 監視するコントローラーを初期化
// const controller = new ScrollMagic.Controller();
// // console.log(controller); // ScrollMagic.Controller {_options: {…}, _setScrollPos: ƒ, _log: ƒ, addScene: ƒ, removeScene: ƒ, …}

// const exploreScene = new ScrollMagic.Scene({
//   triggerElement: ".hike-exp",
//   triggerHook: 0.5,
// })
//   // .addIndicators({ colorStart: "red", colorTrigger: "white" }) // gsapでいうところのmarkers
//   .setClassToggle(".hike-exp", "active")
//   .addTo(controller);

// スクロールアニメーションなど
// animateSlides()

// Page Transition Barba.js
const logo = document.getElementById("logo");
const swipes = document.querySelectorAll(".swipe");

barba.init({
  // views
  // viewsの中にページごとのオブジェクトを作り、ページの状態を記述
  // ページ遷移後、遷移時のアニメーションをコールバックする記述を書く
  views: [
    {
      namespace: "home", // ページビューの識別子 htmlにも記述
      beforeEnter() { // ページが表示される前に実行
        
        animateSlides();
        logo.href = "./index.html";
      },
      beforeLeave() { // そのページを去る前。
        // destroy() オブジェクトなどを破棄して監視を切る
        // 関連するリソースを解放する
        slideScene.destroy();
        pageScene.destroy();
        controller.destroy();
      },
    },
    {
      namespace: "fashion",
      beforeEnter() {// ページが表示される前に実行
        // console.log("enter");
        logo.href = "../index.html"; // ヘッダーは静的なのでutlを変更する

        detailAnimation() // スクロールアニメーション

        gsap.fromTo(".nav-header", 1, { y: "-100%" }, { y: "0%", ease: "power4.inOut" }, "-=.5")
      },
      beforeLeave(){
        controller.destroy();
        detailScene.destroy();
      }
    },
  ],

  // ページトランジションに関する記述
  transitions: [
    {
      // current 現在のページに関するオブジェクト
      // next    遷移後のページに関するオブジェクト
      // leaveもenterのどちらも現在のページ、遷移後のページのオブジェクトを引数に受け取る
      leave({ current, next }) {
        // this.async
        // Barba.jsの中で、トランジションメソッド内で使用される特殊な関数。非同期処理を扱うための機能
        // doneは関数で、トランジションが完了したことをBarba.jsに通知する
        // 最後のアニメーションが終了したときにdone()を呼び出さないと、
        // Barba.jsは次のページへの遷移が完了したことを検知できず、適切なトランジションが行われないので注意する
        let done = this.async();
        // console.log(done)

        const tl = gsap.timeline({ defaults: { ease: "power4.inOut" } });

        // なぜかonComplete: doneがないとmainが表示されない
        tl.fromTo(current.container, 1, { opacity: 1 }, { opacity: 0 });
        tl.fromTo(
          ".swipe",
          0.75,
          { x: "-100%" },
          {
            x: "0%",
            onComplete: done,
            // stagger: 0.25,
            stagger: {
              amount: .25 // 合計時間
              // each: 0.25, // 1つ１つの要素の間隔
            },
          },
          "-=.5"
        );
      },
      enter({ current, next }) {
        let done = this.async();

        // swipes.forEach(swipe => swipe.style.transformOrigin = "left")

        window.scrollTo(0, 0); // トップへ。x軸, y軸

        const tl = gsap.timeline({ defaults: { ease: "power4.inOut" } });
        tl.fromTo(
          ".swipe",
          1,
          { x: "0%" },
          {
            x: "100%",
            onComplete: done,
            // stagger: 0.25,
            stagger: {
              amount: .25 // 合計時間
              // each: 0.25, // １つ１つの要素の間隔
            },
          }
          // "-=.5"
        );
        tl.fromTo(next.container, 1, { opacity: 0 }, { opacity: 1 });
      },
    },
  ],
});













// フルスクラッチ
// window.addEventListener("scroll", scrollReveal);

// function scrollReveal(e){
//   // console.log(e)

//   // hikePosのサイトの上端からの距離を取得
//   const hikePos = hikeExpo.getBoundingClientRect().top;
//   // console.log(hikePos)

//   const windowHeight = window.innerHeight / 1.8;
//   console.log(windowHeight); // 521.1

//   // hikePosが上からの指定した位置に入れば発火
//   if(hikePos < windowHeight){
//     console.log("hello")
//   }
// }

// IntersectionObserver
// const options = {
//   // 入る先端が0、出る部分を1。0から1で指定して、指定した位置が入ればコールバックが発火する
//   // [0.0, .5, 1.] ... 配列で渡せば、それぞれの位置でコールバックが発火
//   threshold: 0.5,
// };

// function slideAnime(entries) {
//   // console.log(entries);
//   entries.forEach(entry => {
//     if(entry.isIntersecting){
//       // console.log(entry) // IntersectionObserverEntry {time: 70.19999998807907, rootBounds: DOMRectReadOnly, boundingClientRect: DOMRectReadOnly, intersectionRect: DOMRectReadOnly, isIntersecting: true, …}
//       entry.target.style.backgroundColor = "red"
//     }
//   })
// }

// const observer = new IntersectionObserver(slideAnime, options);

// observer.observe(slide);
