/**************************************************************

Project Name
Project URL

// GSAPライブラリ
https://cdnjs.com/libraries/gsap

gsap easings  https://gsap.com/docs/v3/Eases/

***************************************************************/
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

// stagger... each   ... デフォルト、1つ１つの要素に効く
//            amount ... 全体で何秒か

// Custom ease の使用例
// gsap.registerPlugin(CustomEase)
// CustomEase.create(
//   "hop",
//   "M0,0 C0,0 0.056,0.442 0.175,0.442 0.294,0.442 0.332,0 0.332,0 0.332,0 0.414,1 0.671,1 0.991,1 1,0 1,0"
// );

// //now you can reference the ease by ID (as a string):
// gsap.to(element, { duration: 1, y: -100, ease: "hop" });


import { 
  BlurScrollEffect1, 
  BlurScrollEffect2, 
  BlurScrollEffect3, 
  BlurScrollEffect4 
} from './effects/index.js';

import { utils } from './utils.js';

utils.initLenis(); // Lenisの初期化

gsap.registerPlugin(ScrollTrigger);

const init = () => {
  const effects = [
    { selector: '[data-effect-1]', effect: BlurScrollEffect1 },
    { selector: '[data-effect-2]', effect: BlurScrollEffect2 },
    { selector: '[data-effect-3]', effect: BlurScrollEffect3 },
    { selector: '[data-effect-4]', effect: BlurScrollEffect4 },
  ];

  effects.forEach(({ selector, effect }) => {
    // data-effect-1のついたクラスを取得
    // console.log(document.querySelectorAll(selector)); // NodeList [div.blur-text.blur-text--1]

    document.querySelectorAll(selector).forEach(el => {
      // console.log(el); 
      new effect(el);
    });
  });
};

// WebFont.jsをつかい、フォントを読み込んだらJSを初期化
utils.preloadFonts().then(() => {
  // console.log("then!!")
  document.documentElement.className="js"; // htmlタグに付与

  document.body.classList.remove('loading');
  init();
});