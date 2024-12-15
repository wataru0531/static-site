/**************************************************************
gsapのイージング

// "数値" 指定時間後にトゥイーン。タイムラインの先頭からの時間（秒）で開始
// "+=1"  直前のトゥイーンの終了後に何秒だけ離すか delay: 1 と同じ
// "-=1"  直前のトゥイーンの終了に何秒だけ重ねるか delay: -1　と同じ

// ">"    直前のトゥイーンの終了時
// ">3"   直前のトゥイーンの終了後に何秒だけ離すか。3秒後にトゥイーンする
// "<"    直前のトゥイーンの開始時
// "<4"   直前のトゥイーンの開始時の何秒後か。4秒後にトゥイーン

// "ラベル名"  指定したラベルと同じタイミングでトゥイーン
// "ラベル名 += 数値"
// "ラベル名 -= 数値"
***************************************************************/

// スクロールアニメーションなど

import gsap, { TweenMax } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

import * as ScrollMagic from "scrollmagic";

import {
  ScrollMagicPluginIndicator,
  // ScrollMagicPluginGsap, // これはなぜか使えない。verの違い?
} from "scrollmagic-plugins";

import { ScrollMagicPluginGsap } from "scrollmagic-plugin-gsap";

// ScrollMagicPluginGsap ... ScrollMagicとGSAPの統合を可能にするプラグイン
// ScrollMagicのトリガーイベントに応じて、GSAPを使用して要素のアニメーションを制御が可能となる

// ScrollMagicとGSAPを統合する。setTwennなどが使える
// setTweenを使うには多分TweenMaxが必要?
ScrollMagicPluginGsap(ScrollMagic, TweenMax);

let controller;
let slideScene;
let pageScene;
let detailScene;

// 各セクションでのスクロールアニメーション
function animateSlides() {
  // ScrollMagic初期化
  controller = new ScrollMagic.Controller();

  const sliders = document.querySelectorAll(".slide");
  // console.log(sliders)
  const nav = document.querySelector(".nav-header");

  sliders.forEach((slide, index, slides) => {
    const revealImg = slide.querySelector(".reveal-img");
    const img = slide.querySelector("img");

    const revealText = slide.querySelector(".reveal-text");
    // console.log(revealText)

    // GSAP Timeline
    const slideTl = gsap.timeline({
      defaults: {
        // デフォルトの設定
        duration: 1,
        ease: "power4.inOut",
      },
    });

    slideTl.fromTo(revealImg, { x: "0%" }, { x: "100%" });
    slideTl.fromTo(img, { scale: 2 }, { scale: 1 }, "-=1"); // 前のアニメーションに1秒重ねる
    slideTl.fromTo(revealText, { x: "0%" }, { x: "100%" }, "-=.75");
    slideTl.fromTo(nav, { y: "-100%" }, { y: "0%" }, "-=.5");

    // Create Scene
    // ScrollMagicでは、Sceneをコントローラに追加することで、
    // そのシーンがスクロールの監視対象となる
    slideScene = new ScrollMagic.Scene({
      triggerElement: slide, // トリガーはslide
      triggerHook: 0.25, // ビューポートの上からの位置。この位置に来たら発火
    })
      .setTween(slideTl) // ここでScrollMagicとGSAPを統合
      .addIndicators({
        colorStart: "white",
        colorTrigger: "white",
        name: "slide",
      }) // gsapでいうmarkers
      .addTo(controller); // 作成したシーンをScrollMagicに登録

    // セクションがスクロールするごとに小さくなり、消えていく
    // TODO 震えるので後ほど修正
    const pageTl = gsap.timeline();

    // 次のスライドを取得
    let nextSlide = slides.length - 1 === index ? "end" : slides[index + 1];
    pageTl.fromTo(nextSlide, { y: "0%" }, { y: "50%" }); // 下げる
    pageTl.fromTo(slide, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0 });
    pageTl.fromTo(nextSlide, { y: "50%" }, { y: "0%" }, "-=.5"); // .5秒前に発火

    pageScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: "100%", // セクションの下まで
      triggerHook: 0,
    })
      .addIndicators({
        colorStart: "white",
        colorTrigger: "white",
        name: "page",
        indent: 200, // インデント。左に200pxくらいずれる
      })
      .setPin(slide, {
        // ピン留め
        // pushFollowers ... ピン留めされた要素がフォロワー要素（後続の要素）に影響を与えるかどうかを制御
        // false ... ピン留めされた要素がフォロワー要素に影響を与えず、後続の要素はピン留めされた要素に重なることがある。
        pushFollowers: false,
      })
      .setTween(pageTl)
      .addTo(controller);
  });
}

animateSlides();


// その他の部分のアニメーション
function detailAnimation(){
  // 
  controller = new ScrollMagic.Controller();
  const slides = document.querySelectorAll(".detail-slide");

  slides.forEach((slide, index, slides) => {
    // console.log(slide);

    const slideTl = gsap.timeline({ defaults: { duration: 1 } })

    // 次のスライドを取得。最後のスライドは"end"、そうでないなら+1したスライド
    let nextSlide = slides.length - 1 === index ? "end" : slides[index + 1];

    // 次のスライドの画像
    const nextImage = nextSlide.querySelector("img"); // 次のスライドの画像を取得
    // nextImage.style.transformOrigin = "bottom center"

    slideTl.fromTo(slide, { opacity: 1 }, { opacity: 0 });
    
    slideTl.fromTo(nextSlide, { opacity: 0 }, { opacity: 1 }, "-=1");

    // slideTl.fromTo(nextImage, { scaleY: 0 }, { scaleY: 1 })
    slideTl.fromTo(nextImage, { opacity: 0, x: "100%" }, { opacity: 1, x: "0%" }, "-=.5")

    // ScrollMagicに新しいシーンを生成
    detailScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: "100%",
      triggerHook: 0,
    })
      .setPin(slide, { pushFollowers: false })
      .setTween(slideTl)  // ScrollMagicとgsapを統合
      .addIndicators({ // インジケーター
        colorStart: "white",
        colorTrigger: "white",
        name: "detailScene",
        // indent: 200, // インデント。左に200pxくらいずれる
      })
      .addTo(controller); // シーンをScrollMagicに登録
      
  })

}

// detailAnimation()


export { 
  animateSlides,
  controller,
  slideScene,
  pageScene,
  detailAnimation,
  detailScene,
};
