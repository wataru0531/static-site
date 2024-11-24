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


// TODO
// ①grid-item > .grid-item-imgwrapをJSから挿入
// ②grid-fullの部分もJSから挿入

// import gsap from "gsap";
// import gsap from "/node_modules/gsap/index.js";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import Lenis from '/node_modules/lenis/dist/lenis.mjs';


import { utils } from '/utils.js';


const grid = document.getElementById('js-grid'); 
// console.log(gridNarrowContainer)
const marqueeInner = document.getElementById('js-marquee-inner');

// テキスト分割
const textElement = document.getElementById('js-text');
const trimedTexts = textElement.innerHTML.trim().split("");
// console.log(trimedTexts); // (7) ['H', 'a', 'l', 'c', 'y', 'o', 'n']
const splitTexts = utils.reduceText(trimedTexts);
// console.log(splitTexts); // <span class="char">H</span><span class="char">a</span><span class="char">l</span><span class="char">c</span><span class="char">y</span><span class="char">o</span><span class="char">n</span>
textElement.innerHTML = splitTexts; // innerHTMLでhtml上書き
const chars = [...document.querySelectorAll(".char")];

const gridFull = document.querySelector('.grid--full'); 

const creditsTexts = [...document.querySelectorAll('.credits')]; 
// console.log(creditsTexts[0]);


// 初期化
document.addEventListener("DOMContentLoaded", async () => {
  // gsap、lenisなどの動きが悪くなる可能性があるのでtopに戻る
  setTimeout(() => {
    // window.scrollTo(0, 0); // scrollTo(x, y); ページの左上端にスクロール
    window.scrollTo({
      top: 0,
      left: 0,
      // behavior: "smooth",
    })
  }, 150);


  gsap.registerPlugin(ScrollTrigger); 

  await generateGridItems(); // 画像生成

  initLenis(); // Lenisの初期化

  utils.preloadImages('.grid__item-img').then(() => { // 画像を読み込んだら発火
    document.body.classList.remove('loading'); // ローディングを削除
    init(); // アニメーションを発火
  });

});


// 
async function init() {
  animateScrollGrid();
  animateMarquee();
  animateTextElement();
  animateGridFull();
  animateCredits();
};

function initLenis() {
  // Lenisとgsap(ScrollTrigger)の更新を連動させる仕組みを構築
  // gsapの内部のtickerが独自に動く仕組みになっていて、それをlenisと同期していく
  const lenis = new Lenis();

  // Lenisでスクロールが発生するたびに、ScrollTrigger.updateを発火させる
  // この設定により、スクロール位置の変化に合わせてScrollTriggerが更新され、アニメーションが同期して動作する
  lenis.on('scroll', ScrollTrigger.update)

  // gsap.ticker.add → gsapのタイムライン(gsap内部で起きている独自の更新のタイミング)にLenisのrafメソッドを追加
  // → gsapのアニメーション更新タイミングとLenisのスクロール更新タイミングが同期され、スムーズにスクロールとアニメーションが連動
  //   ここではgsapのタイミングに合わせてLenisのスクロール状態も更新されるようにしている
  gsap.ticker.add((time)=>{   // lenis.raf() → Lenisのスクロールアニメーションを更新
    // console.log(time)
    lenis.raf(time * 1000)
  });

  // lagSmoothing(0) → gsapのtickerのラグ(遅れ)を調整する機能を無効化
  // → gsapはフレームレートが低下してラグが発生した場合に、アニメーションが一時的にカクつかないように、ある程度の範囲で自動補正を行う
  //   デフォルト設定では、フレームレートが大きく落ち込んだときにアニメーションをリセットしたり、スムーズさを保つために動作を調整したりしている
  //   Lenisとの連携では、補正がかかるとスクロールやアニメーションの同期が崩れることがあるため、この設定でスムーズに動作するようgsapのこの機能を無効化している
  // この設定により、スクロールやアニメーションに遅延が発生した場合でも、突然のリセットやカクつきが発生しないようにしている
  gsap.ticker.lagSmoothing(0);
};

// 画像の配列を生成
const narrowImages = utils.generateImageUrls({ _length: 24, _path: "/images", _range: 20, _extension: "avif" })
// const narrowImages = Array.from({ length: 24 }, (_, idx) => {
//   // console.log(idx) // 0 から 23
//   return `./images/${(idx % 20) + 1}.avif`;
// });
// console.log(narrowImages); // (24) ['./images/1.avif', './images/2.avif', './images/3.avif', './images/4.avif', './images/5.avif', './images/6.avif', './images/7.avif', './images/8.avif', './images/9.avif', './images/10.avif', './images/11.avif', './images/12.avif', './images/13.avif', './images/14.avif', './images/15.avif', './images/16.avif', './images/17.avif', './images/18.avif', './images/19.avif', './images/20.avif', './images/1.avif', './images/2.avif', './images/3.avif', './images/4.avif']
// const narrowImages = [...Array(24)].map((_, index) => `./images/${(index % 20) + 1}.avif`);

const fullImages = utils.generateImageUrls({ _length: 35, _path: "/images", _range: 20, _extension: "avif" });


// gridに画像を挿入
async function generateGridItems(){
  const gridNarrowContainer = document.querySelector(".grid.grid-narrow");
  const gridFullContainer = document.querySelector(".grid.grid--full")

  for (const image of narrowImages) {
    const figure = document.createElement("figure");
    figure.classList.add("grid__item");

    const imgWrap = document.createElement("div");
    imgWrap.classList.add("grid__item-imgwrap");
    imgWrap.id = "js-grid-item-imgwrap";

    const imgDiv = document.createElement("div");
    imgDiv.classList.add("grid__item-img");
    imgDiv.style.backgroundImage = `url(${image})`;

    imgWrap.appendChild(imgDiv);
    figure.appendChild(imgWrap);
    gridNarrowContainer.appendChild(figure);

    // await new Promise((resolve) => setTimeout(resolve, 0));
  }

  for (const image of fullImages) {
    const figure = document.createElement("figure");
    figure.classList.add("grid__item");

    const imgDiv = document.createElement("div");
    imgDiv.classList.add("grid__item-img");
    imgDiv.style.backgroundImage = `url(${image})`;

    figure.appendChild(imgDiv);
    gridFullContainer.appendChild(figure);

    // await new Promise((resolve) => setTimeout(resolve, 0));
  }
}



// gridアイテムのwrapperの位置が中央より左側にあるか判定
function isLeftSide(element){
  const elementCenter = element.getBoundingClientRect().left + element.offsetWidth / 2; 
  const viewportCenter = window.innerWidth / 2;
  
  return elementCenter < viewportCenter; 
};

// gridの画像にアニメーションをかける処理
function animateScrollGrid(){
  const gridImageWraps = [...grid.querySelectorAll('#js-grid-item-imgwrap')];

  // console.log("animateScrollGrid done!!");
  gridImageWraps.forEach(imageWrap => {
    // console.log(imageWrap)
    const imgEl = imageWrap.querySelector('.grid__item-img');
    // console.log(imgEl)
    const leftSide = isLeftSide(imageWrap); // 左の要素か、右の要素か判定
    // console.log(leftSide); // true false true ....

    // fromで一度{ filter: 'blur(0px) brightness(100%) contrast(100%)' }のこの初期状態に移り、
    // そしてそこからtoに移行する
    // → fromからtoが終了するまでがScrollTriggerされている。
    gsap.timeline({
      scrollTrigger: {
        trigger: imageWrap, 
        start: 'top bottom+=10%', // imageWrapのtop ブラウザ下から10%下
        end: 'bottom top-=25%', // imageWrapのbottom ブラウザのtopから25%上の位置(見えない位置)
        scrub: true,
      }
    })
    .from(imageWrap, {
      // from    → アニメーションが開始された瞬間このスタイルが適用される
      // startAt → アニメーションが開始される前にあてられるスタイル
      //           CSSで初めから指定しているのと変わらない
      startAt: { filter: 'blur(0px) brightness(100%) contrast(100%)' },

      z: 300, // transform: translate3d(0, 0, 300)があてられる。一度0になり、toで300まで上がる
      rotateX: 70, // x軸を中心に回転
      rotateZ: leftSide ? 5 : -5, // 左の要素 : 右の要素。rotate(5deg)
      xPercent: leftSide ? -40 : 40, // translate(-11.8774%, 29.6935%)
      yPercent: 100,
      skewX: leftSide ? -20 : 20, 
      filter: 'blur(7px) brightness(0%) contrast(400%)', // triggerの範囲に入れば発火
      ease: 'sine',                       
    })
    .to(imageWrap, {
      z: 300,
      rotateX: -50,
      rotateZ: leftSide ? -1 : 1, 
      xPercent: leftSide ? -20 : 20, 
      skewX: leftSide ? 10 : -10,
      filter: 'blur(4px) brightness(0%) contrast(500%)',
      ease: 'sine.in',                    
    })
    .from(imgEl, {
      scaleY: 1.8, // y軸に拡大した状態　→ 0に戻り、1.8に再び戻る。
      ease: 'sine',                       
    }, 0) // tlの先頭からの秒数。即発火
    .to(imgEl, {
      scaleY: 1.8,
      ease: 'sine.in'                     
    }, '>');//  直前のトゥイーンの終了時に発火
  });
};

// マーキー
function animateMarquee(){
  gsap.timeline({
    scrollTrigger: {
      trigger: grid, 
      start: 'top bottom',  // gridのtop ブラウザのbottom
      end: 'bottom top', // gridのbottom ブラウザのtop
      scrub: true, // スクロールとアニメーションを同期
    }
  })
  .fromTo(marqueeInner, {
    x: '100vw' // 右に100vw動かして、ぎりぎり画面外にしておく
  }, {
    x: '-100%',  // scrubと同期させているので、endまでに100左にずれる
    ease: 'sine',
  });
};

// HALCYONのテキストアニメーション
function animateTextElement(){
  gsap.timeline({
    scrollTrigger: {
      trigger: textElement, 
      start: 'top bottom', // js-textのtop ブラウザのbottom
      end: 'center center-=25%',  // js-textのcenter ブラウザのcenterから上に25%の位置
      scrub: true, 
    }
  })
  .from(chars, {
    ease: 'sine',
    yPercent: 300, 
    autoAlpha: 0, // opacity と visibility
    stagger: {  
      amount: 0.4,  // each 要素1つ１つに。amountは全体で
      from: 'center', // start end random
    }
  });
};


function animateGridFull(){
  // const gridFullItems = [...gridFull.querySelectorAll('.grid__item')];
  const gridFullItems = Array.from(gridFull.querySelectorAll('.grid__item'));
  // console.log(gridFullItems)
  
  // console.log(getComputedStyle(gridFull).getPropertyValue("grid-template-columns"));
  // → 96px 96px 96px 96px 96px 96px 96px
  // console.log(getComputedStyle(gridFull).getPropertyValue("grid-template-columns").split(" "));
  // → (7) ['96px', '96px', '96px', '96px', '96px', '96px', '96px']
  // 　split(" ") 半角スペースを基準に文字列を分割
  //   split("")として半角スペースなしなら文字を1つ１つに分割
  const numColumns = getComputedStyle(gridFull).getPropertyValue('grid-template-columns').split(' ').length;
  const middleColumnIndex = Math.floor(numColumns / 2); // 中央のカラムのindexを3つ取得
  // console.log(numColumns, middleColumnIndex); // 7 3

  // 指定された数の空の配列を含む配列を生成
  // → Array.from(arrayLike, mapFunction)
  const columns = Array.from({ length: numColumns }, () => []); 
  // console.log(columns); // (7) [Array(0), Array(0), Array(0), Array(0), Array(0), Array(0), Array(0)]
  // [ [], [], [], [], [], [], [] ]

  // 行ごとに、.grid-itemを格納していく
  gridFullItems.forEach((item, index) => {
    const columnIndex = index % numColumns; // 余り。0 〜 6
    // console.log(columnIndex);
    columns[columnIndex].push(item);
  });
  // console.log(columns); // 7) [Array(5), Array(5), Array(5), Array(5), Array(5), Array(5), Array(5)]

  columns.forEach((columnItems, columnIndex) => {
    const gridImage = columnItems.map(item => item.querySelector(".grid__item-img"));
    // console.log(gridImage);
    
    // 中央のカラムからどれだけ離れているかで遅延をつける
    const delayFactor = Math.abs(columnIndex - middleColumnIndex) * 0.2;
    // console.log(delayFactor); // .6 .4 .2 0 .2 .4 .6

    gsap.timeline({
      scrollTrigger: {
        trigger: gridFull,
        start: 'top bottom', // gridのtop ブラウザのbottom
        end: 'center center', // gridのcenter ブラウザのcenter
        scrub: true,
      }
    })
    .from(columnItems, {
      yPercent: 450,
      autoAlpha: 0,
      delay: delayFactor,
      ease: 'sine',
    })
    .from(gridImage, { // 行ごとの.grid__itemの中の画像に対してのアニメーション
      transformOrigin: '50% 0%',
      ease: 'sine',
    }, 0); // timelineの先頭からの秒数。即発火
  });
};

// テキストアニメーション(x軸に拡大から通常に収束していく)
function animateCredits() {
  creditsTexts.forEach(creditsText => {
    const splitCredits = new SplitType(creditsText, { type: 'chars' });
    // console.log(splitCredits);

    gsap.timeline({
      scrollTrigger: {
        trigger: creditsText,
        start: 'top bottom', // creditsTextのtop ブラウザのbottom
        end: 'clamp(bottom top)',
        // clamp → スクロール範囲が狭い場合でも、終了ポイントが正常な位置に制限される
        //         ここではcreditsTextがブラウザのtopと交差しなくても終了している
        //         スクロール量が足りなくても正常に終了できる
        // end: "bottom top", // → スクロール量が足りずアニメーションが終わらない
        scrub: true,
      }
    })
    .fromTo(splitCredits.chars, 
      {
        x: (index) => {
          // console.log(index); // charsのlength分の数値
          // console.log(splitCredits.chars.length)
          // console.log(index*80 - ((splitCredits.chars.length*80)/2)); // 
          // -560 -480 -400 -320 -240 -160 -80 0 80 160 240 320 400 480 560
          return index * 80 - ((splitCredits.chars.length * 80) / 2) // -560
        },
      }, {
        x: 0,
        ease: 'sine'
      }
    );
  });
};
