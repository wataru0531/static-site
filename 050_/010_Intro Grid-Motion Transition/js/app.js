/**************************************************************

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


import { utils } from './utils.js';

gsap.registerPlugin(Flip); // TODO

const $ = {}; // DOMを格納
$.body = document.body;
$.header = document.getElementById('js-header'); 
$.content = document.getElementById('js-content');
$.enterButton = document.getElementById('js-btn');
$.fullView = document.getElementById('js-fullView'); 
$.grid = document.getElementById('js-grid'); 
$.gridRows = Array.from($.grid.querySelectorAll('#js-row'));

let timerId = null;
let requestId;
let windowSizes = { width: window.innerWidth, height: window.innerHeight };

// マウスの位置
let mousePosition = { x: windowSizes.width / 2, y: windowSizes.height / 2 };

// rafでレンダリングするプロパティの設定
// → ここで適用するかどうかを決める。falseとすると変化がなくなる
const config = {
  translateX: true,
  skewX: true,
  contrast: true,
  scale: true,
  brightness: true
};

// 中央のrowの中の中央の画像にクラス付与する工程
const numRows = $.gridRows.length; // gridの行の数
// console.log(numRows); // 5
const middleRowIndex = Math.floor(numRows / 2);
// console.log(middleRowIndex); // 2
const middleRow = $.gridRows[middleRowIndex]; // 
const middleRowItems = [...middleRow.querySelectorAll('.row__item')]; 
const numRowItems = middleRowItems.length; 
const middleRowItemIndex = Math.floor(numRowItems / 2);
// console.log(middleRowItemIndex); // 3
const middleRowItemInner = middleRowItems[middleRowItemIndex].querySelector('.row__item-inner');
const middleRowItemInnerImage = middleRowItemInner.querySelector('.row__item-img'); // 画像部分
middleRowItemInnerImage.classList.add('row__item-img--large');

// amt ... amountの略
const baseAmt = 0.1; 
const minAmt = 0.05;
const maxAmt = 0.1;

// .grid > row に当てるスタイルを保持
let renderedStyles = Array.from({ length: numRows }, (v, index) => {
  // console.log(numRows); // 5
  // console.log(index); // 0 1 2 3 4

  // 線形補間の補間値を取得
  const distanceFromMiddle = Math.abs(index - middleRowIndex); // 2 〜 0。index - 2
  const amt = Math.max(baseAmt - (distanceFromMiddle * 0.03), minAmt); // .05 より大きい値を取得 .04 〜 .1
  const scaleAmt = Math.min(baseAmt + distanceFromMiddle * 0.03, maxAmt); // .1より小さい値を取得 .16
  let style = { amt, scaleAmt };
  // console.log(amt); // .05, .07, .1, .07, .05
  // console.log(scaleAmt); // .1, .1, .1, .1, .1
  // console.log(baseAmt + distanceFromMiddle * 0.03)
  
  if (config.translateX) {
    // currentはここではtargetとなる
    style.translateX = { previous: 0, current: 0 };
  }
  if (config.skewX) {
    style.skewX = { previous: 0, current: 0 };
  }
  if (config.contrast) {
    style.contrast = { previous: 100, current: 100 };
  }
  if (config.scale) { 
    style.scale = { previous: 1, current: 1 };
  }
  if (config.brightness) {
    style.brightness = { previous: 100, current: 100 };
  }

  // console.log(style); // {amt: 0.05, scaleAmt: 0.1, translateX: {…}, contrast: {…}, brightness: {…}}
  // {
  //   amt: 0.05, 
  //   scaleAmt: 0.1, 
  //   translateX: {…}, 
  //   
  //   contrast: {…}, 
  //   brightness: {…}
  // }

  return style;
});
// console.log(renderedStyles); // (5) [{…}, {…}, {…}, {…}, {…}]


document.addEventListener("DOMContentLoaded", () => {

  utils.preloadImages('.row__item-img').then(() => {
    // console.log(element)
    $.body.classList.remove('loading');

    init(); // 初期化。アニメーション開始
  });
});

window.addEventListener('mousemove', updateMousePosition);

// タッチデバイス
window.addEventListener('touchmove', (e) => {
  // console.log(e.touches[0]);
  const touch = e.touches[0];
  // console.log(touch); // Touch {identifier: 0, target: div.row__item-img, screenX: 596.93896484375, screenY: 578.2334594726562, clientX: 523.4575805664062, …}
  updateMousePosition(touch);
});

window.addEventListener('resize', () => {
  clearTimeout(timerId);
  windowSizes = { width: window.innerWidth, height: window.innerHeight };

  timerId = setTimeout(() => {
    windowSizes = { width: window.innerWidth, height: window.innerHeight };
  }, 500);
});


// 初期化処理
function init() {
  startRendering(); // レンダリングスタート

  $.enterButton.addEventListener('pointerdown', enterFullView);
  $.enterButton.addEventListener('touchstart', enterFullView); // タッチデバイス対応
};

// rafでレンダリングして、それぞれのrowにスタイルを適用する
function render() {
  const mappedValues = { // ここで再計算がされる
    translateX: calculateMappedX(), // -40% 〜40%
    skewX: calculateMappedSkew(), // -3 〜 3
    contrast: calculateMappedContrast(), // -330 〜　330
    scale: calculateMappedScale(), // 1 〜 0.95
    brightness: calculateMappedBrightness() // 100 〜　15
  };
  // console.log(mappedValues); // 

  // gridのそれぞれの行に対して線形補間した値を適用し、gsapに設定する
  $.gridRows.forEach((row, index) => {
    const style = renderedStyles[index];
    // console.log(style); // {amt: 0.07, scaleAmt: 0.1, translateX: {…}, contrast: {…}, brightness: {…}}

    for (let prop in config) { // プロパティを取得
      // console.log(prop) // translateX, skewX, scale, contrast, brightness

      if (config[prop]) { // config[translateX]
        style[prop].current = mappedValues[prop]; // current ... (ここではtarget)の値を取得

        // 線形補間の補間値を列ごとに決める → 数値が小さい方が滑らかに動き反動がつく(中央の列ほど値が小さい)
        const amt = prop === 'scale' ? style.scaleAmt : style.amt; // scaleなら、.1、それ以外は異なる少数。
        // console.log(amt); // .05, .07, .1, .07, .05

        // 線形補間した値を格納していく
        style[prop].previous = utils.lerp(style[prop].previous, style[prop].current, amt);
      }
    }

    // gsapの設定に値を渡していく
    let gsapSettings = {};
    if (config.translateX) gsapSettings.x = style.translateX.previous;
    if (config.skewX) gsapSettings.skewX = style.skewX.previous;
    if (config.scale) gsapSettings.scale = style.scale.previous;
    if (config.contrast) gsapSettings.filter = `contrast(${style.contrast.previous}%)`;
    if (config.brightness) gsapSettings.filter = `${gsapSettings.filter ? gsapSettings.filter + ' ' : ''} brightness(${style.brightness.previous}%)`;

    // console.log(gsapSettings); // 初期値 → {x: 0, filter: 'contrast(100%)  brightness(100%)'}
    // console.log(gsapSettings); // カーソル移動時 → {x: 0, filter: 'contrast(100%)  brightness(100%)'}
    gsap.set(row, gsapSettings);
  });

  requestId = requestAnimationFrame(render);
};

function startRendering() {
  if(!requestId) render();
};

function stopRendering() {
  if (requestId) {
    cancelAnimationFrame(requestId);
    requestId = undefined;
  }
};

// x軸の値を取る
// -1から1の範囲に絞る → 40 * windowSizes.width / 100(ブラウザを100等分した値)
// → これでビューポートの-40%から40%の値を返す
// 「マッピング (Mapping)」... ある範囲の値を別の範囲に変換する操作のこと
function calculateMappedX() {
  // console.log(((mousePosition.x / windowSizes.width) * 2 - 1) * 40 * windowSizes.width / 100);

  return ((mousePosition.x / windowSizes.width) * 2 - 1) * 40 * windowSizes.width / 100;
};

// Skew x軸の、-3〜3の範囲を返す
function calculateMappedSkew() {
  // console.log(((mousePosition.x / window.innerWidth) * 2 - 1) * 3);

  return ((mousePosition.x / windowSizes.width) * 2 - 1) * 3;
};

// 
// x軸から外側に行くほど大きい値を返す。-330から330の範囲
function calculateMappedContrast() {
  const centerContrast = 100;
  const edgeContrast = 330;

  const t = Math.abs((mousePosition.x / windowSizes.width) * 2 - 1); // -1 〜 1
  const factor = Math.pow(t, 2); // tの2乗を返す。Math.pow(5, 3)なら、5*5*5 = 125を返す
  // console.log(factor)

  // 100 - (少数 * -230)
  // → 左右に行くほど、数値が上がる
  // console.log(centerContrast - (factor * (centerContrast - edgeContrast)));
  return centerContrast - factor * (centerContrast - edgeContrast); // -230
};

// x軸で外側に行けば行くほど、値が小さくなる。1 〜 0.95の範囲
function calculateMappedScale() {
  const centerScale = 1;
  const edgeScale = 0.95;

  // 1 - (-1〜1 * .05) → 1 - (0 〜 .05)
  // console.log(centerScale - Math.abs((mousePosition.x / windowSizes.width) * 2 - 1) * (centerScale - edgeScale))
  return centerScale - Math.abs((mousePosition.x / windowSizes.width) * 2 - 1) * (centerScale - edgeScale);
};

// x軸で外側に行くほど、値が小さくなる。100 〜　15
function calculateMappedBrightness() {
  const centerBrightness = 100;
  const edgeBrightness = 15;

  const t = Math.abs((mousePosition.x / windowSizes.width) * 2 - 1);
  const factor = Math.pow(t, 2);
  // console.log(factor); // x軸で、1〜1を返す

  // 100 - (少数 * 85)
  // console.log(centerBrightness - (factor * (centerBrightness - edgeBrightness)));
  return centerBrightness - factor * (centerBrightness - edgeBrightness);
};

// マウスの位置を更新
function updateMousePosition(_e) {
  const pos = utils.getMousePos(_e);

  mousePosition.x = pos.x;
  mousePosition.y = pos.y;
};


// exploreボタンクリック後の動き
function enterFullView() {
  // Flip.getState()
  // → 「現在の状態（アニメーションの開始時点）」を取得している
  //    対象の要素の位置やサイズなどの状態をキャプチャしてアニメーションの前後での変化を滑らかに処理する
  const flipState = Flip.getState(middleRowItemInner);
  // console.log(flipState); // .grid > .row > /.row-item > .row__item-inner(中央のインナー)

  // console.log(middleRowItemInner); // <div class="row__item-inner" data-flip-id="auto-1"><div class="row__item-img" style="background-image:url(./images/2.avif)"></div></div>
  $.fullView.appendChild(middleRowItemInner); // 中央の画像をfullViewに格納する
  
  // console.log(getComputedStyle($.content)); // CSSStyleDeclaration {0: 'accent-color', 1: 'align-content', 2:, ...}
  // console.log(getComputedStyle($.content).getPropertyValue("--trans-content"))
  // console.log(getComputedStyle($.content).getPropertyValue("--trans-content").trim()); // -30vh
  // $.content → 親要素のhtmlタグに指定してあるcss変数を継承しているのでgetPropertyValueで取得可能
  const transContent = utils.getCSSVariableValue($.content, '--trans-content');
  // console.log(transContent); // 30vh

  const tl = gsap.timeline();

  // Flip.from()
  // → 元の状態(flipState)から現在の状態へのアニメーションを滑らかに実行
  // flipStateには、.row__item-innerの親要素から受けた状態を記録してある
  // → それを、,.row__item-innerのもともとのCSSの状態にもどしている。
  tl.add(Flip.from(flipState, {
    duration: .9,
    ease: 'power4',
    absolute: true, // アニメーション中、要素がposition: absolute;になる
    onComplete: () => {
      stopRendering(); // renderを止める

      // console.log(Flip.getState(middleRowItemInner)) // ターゲットの要素の状態を確認
    },
  }))
  .to($.grid, { // .grid部分は消す
    duration: 0.9,
    ease: 'power4',
    opacity: 0.01
  }, 0)
  .to(middleRowItemInnerImage, { // 画像の部分を拡大していく
    scale: 1.2,
    duration: 3,
    ease: 'sine'
  }, '<-=0.45') // 
  .to($.content, { // コンテンツ部分は上げる
    y: transContent,
    duration: 0.9,
    ease: 'power4'
  })
  .add(() => $.header.classList.remove('hidden'), '<') // 直前のトゥイーンの開始時
  .to(middleRowItemInnerImage, { // 中央画像を少し縮小
    scale: 1.1,
    startAt: { filter: 'brightness(100%)' }, // 一度明るくする

    filter: 'brightness(50%)',
    y: '-5vh',
    duration: 0.9,
    ease: 'power4'
  }, '<'); 
  
  $.enterButton.classList.add('hidden');
  $.body.classList.remove('noscroll');
};

