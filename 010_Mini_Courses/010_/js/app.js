/**************************************************************

Mini Course Part 1: AWWWARDS Remade - Form Studio - Video Scale on Scroll With HTML, CSS and JS
① https://www.youtube.com/watch?v=iktOrkLjjMk
② https://www.youtube.com/watch?v=-KtAEsQTQZc&t=94s
③ https://www.youtube.com/watch?v=WgKQxXMrJb0&t=28s

TODO
・ローディング
・慣性スクロール
・Three.jsのエフェクト追加
・ハンバーガーメニュー追加
・ナイトモード追加 CSS変数など

***************************************************************/

import { utils } from "/utils.js";  // モジュールを使うなら、拡張子の省略はNG
import { createBlogPosts, createProjects } from "./projects.js";

const main = document.getElementById("js-main");
const videoSection = document.querySelector("#js-video-section");
const video = document.getElementById("js-video");

////////////////////
// Videoセクション
////////////////////
const headerLeft = document.querySelector(".text__header__left")
const headerRight = document.querySelector(".text__header__right")

function animateVideo(){
  // console.log(videoSection.getBoundingClientRect())

  // bottom body上端から要素の下までの距離を取得
  // スクロールするとbottomの値が小さくなるのでこれを利用する
  let { bottom } = videoSection.getBoundingClientRect();

  // 1 - (ビューポートの上端から底までの距離 - ビューポートの高さ)
  // console.log(bottom);

  // console.log(bottom - window.innerHeight);
  // console.log((bottom - window.innerHeight) * .0005);
  // console.log(1 - ((bottom - window.innerHeight) * .0005));
  let scale = 1 - ((bottom - window.innerHeight) * .0005);
  // console.log(scale)

  // .5 < scale < 1 の範囲にする
  scale = scale < .5 ? .5 :
          scale > 1 ? 1 :
          scale;
  // console.log(scale)

  // scale = Math.max(.5, Math.min(scale, 1)); // 違う書き方

  video.style.transform = `scale(${scale})`;

  // テキストの変化 ///////////////
  let textTrans = bottom - window.innerHeight;
  // console.log(textTrans)

  textTrans = textTrans < 0 ? 0 : textTrans; // 0より下にはしない
  // console.log(textTrans)

  headerLeft.style.transform = `translateX(-${textTrans}px)` // 左からイン
  headerRight.style.transform = `translateX(${textTrans}px)`
}

////////////////////////
// Projectsセクション
////////////////////////

createProjects(); // スライダーに画像を生成・追加

const projectSticky = document.getElementById("js-projects__sticky");
let projectSlider = document.getElementById("js-projects__slider");

let projectTargetX = 0;
let projectCurrentX = 0;

// 各幅での何vw左にずらすかを設定。ビューポートにある画像の枚数で設定
// small(600px)以下では、700px左にずらすことで最後の画像がちょうど現れる
let percentages = {
  small: 700,
  medium: 300,
  large: 100,
}

let limit = window.innerWidth <= 600  ? percentages.small :
            window.innerWidth <= 1200 ? percentages.medium :
            percentages.large;


function setLimit(){
  limit = window.innerWidth <= 600  ? percentages.small :  // 700
          window.innerWidth <= 1200 ? percentages.medium : // 300
          percentages.large; // 100
          // console.log(limit)
}

let timerId = null;
window.addEventListener("resize", () => {
  clearTimeout(timerId);

  timerId = setTimeout(() => {
    // console.log("resize done!!");
    setLimit();
  }, 500)
  
});

// projectsセクションがビューポートに入ってきたらスライダーを動かす
function animateProjects(){
  // projectsセクションのサイト全体の上端からの距離を取得
  let offsetTop = projectSticky.parentElement.offsetTop; // offsetTop 要素の親要素に対する上端(top)の距離をピクセル単位で取得
  // console.log(offsetTop) // 3616

  // projectsセクションまでの上端までの距離に対するビューポートの高さの割合
  // スクロール量とprojectsセクションの上端からの高さが同じになればpercentageの値が同じになるので動き出す
  // (mainの上からのスクロール量 - projectsセクションのサイト全体の上端からの距離) / ビューポートの高さ) * 100
  let percentage = ((main.scrollTop - offsetTop) / window.innerHeight) * 100 // ((0 - 3616) / 904) * 100
  // console.log(main.scrollTop)
  // console.log(main.scrollTop - offsetTop) // -3616
  // console.log(main.scrollTop, offsetTop, `${percentage}%`)

  // 0 < percentage < 各幅でのリミット(700, 300, 100)
  // projectsセクションがビューポートに入ったらスライダーが動き出す
  percentage = percentage < 0 ? 0 :
              percentage > limit ? limit : // 各幅でのlimitを超えたらpercentageが増加する
              percentage;
  // console.log(percentage, limit)

  // これから動く先の位置と、これまでいた位置の距離の.1の部分を取得
  projectTargetX = percentage;
  projectCurrentX = utils.lerp(projectCurrentX, projectTargetX, .1); // 第３引数を小さくすればするほど慣性が効く
  // console.log(projectCurrentX)

  projectSlider.style.transform = `translate3d(${-(projectCurrentX)}vw, 0, 0)`
}


//////////////////////
// Blogセクション
/////////////////////

createBlogPosts(); // ブログを追加

const blogSection = document.getElementById("js-blog");
const blogPosts = [...document.querySelectorAll("#js-post")]

// 画像をスクロールするたびに小さくしていく
function scrollBlogPosts(){
  // blogセクションの、サイト全体の上端からの高さを取得
  let blogSectionTop = blogSection.getBoundingClientRect().top;
  // console.log(blogSectionTop)

  // console.log(blogPosts[1].parentElement.getBoundingClientRect().top)

  for(let i = 0; i < blogPosts.length; i++){
    // .postの親要素の.blog__postがビューポートの上端との距離が1px以下になると
    // console.log(blogPosts[i].parentElement.getBoundingClientRect().top);
    if(blogPosts[i].parentElement.getBoundingClientRect().top <= 1){
      
      // blogセクションのサイト全体のトップからの距離 + (ビューポートの高さ * (i + 1) * .0005)
      // 全ての.postのoffsetを同じにするために、i + 1とする
      // blogSectionTopはスクロールするたびにマイナスになっていくのでoffsetにはマイナスの値が入る
      // 要は、-1 * 0.0005 の形を作り、-1から0の範囲内で少しづつ小さくしていく
      let offset = (blogSectionTop + (window.innerHeight * (i + 1))) * .0005;
      // console.log(offset)

      // -1 < offset <= 0 の範囲にする。offsetにはマイナスが渡ってくる
      offset = offset < -1 ? -1 : // -1よりマイナスになれば、-1にとどめる
              offset >= 0 ? 0 :   // 0以上になれば0にしていおく
              offset;
      // console.log(offset)
      
      // console.log(
      //   (blogSectionTop + (window.innerHeight * (0 + 1))) * .001,     // 1つ目のpost
      //   // (blogSectionTop + (window.innerHeight * (1 + 1))) * .0005,  // 2つ目のpost
      //   // (blogSectionTop + (window.innerHeight * (2 + 1))) * .0005,  // 3つ目のpost
      //   // offset
      // )

      // console.log(offset)
      // scale(1)で元の大きさなので、そこからoffsetでマイナスしていく
      blogPosts[i].style.transform = `scale(${1 + offset})` 
    }
  }

}

/////////////////////////
// circleセクション
//////////////////////////
const circleSection = document.getElementById("js-circle__section")
const circle = document.getElementById("js-circle");

function scrollCircle(){
  // circleセクションのサイト全体の上端からの高さを取得
  // console.log(circleSection.getBoundingClientRect())
  // DOMRect {x: 0, y: 14464, width: 509, height: 1808, top: 14464, …}
  let { top } = circleSection.getBoundingClientRect();
  // console.log(top)
  let scrollTop = Math.abs(top);

  // circleセクションがビューポートに入ればscale値が0になり、そこから少しづつ値が大きくなる
  let scale = (scrollTop / window.innerHeight)
  // console.log(scale) // 16

  // 0 < scale < 1 の範囲に
  scale = scale < 0 ? 0 :
          scale > 1 ? 1 :
          scale;
  // console.log(scale)

  // console.log(top)
  if(top <= 0){
    circle.style.transform = `translate(-50%, -50%) scale(${scale})`
  } else {
    circle.style.transform = `translate(-50%, -50%) scale(0)`
  }
  
}

////////////////////////////
// Discoverセクション
/////////////////////////
const dContainer = document.getElementById("js-discover__container")
const leftText = document.getElementById("js-text__left")
const rightText = document.getElementById("js-text__right")

function scrollDiscover(){
  // サイト全体の上端からdContainerのbottomまでの高さを取得
  let { bottom } = dContainer.getBoundingClientRect();
  // console.log(bottom) // 17176

  // Discoverセクションがビューポートにちょうど入って時に、アニメーションが
  // 終わるようにwindow.innerHeightをマイナスする
  let textTrans = bottom - window.innerHeight;
  // console.log(textTrans)
  // console.log(bottom, textTrans)

  // 0 < textTrans < 数値
  textTrans = textTrans < 0 ? 0 : textTrans;
  // console.log(textTrans)
  leftText.style.transform = `translateX(-${textTrans}px)`
  rightText.style.transform = `translateX(${textTrans}px)`
}


// テキストアニメーション IntersectionObserver
const textReveals = [...document.querySelectorAll("#js-text__reveal")]

const callback = (entries) => {
  // console.log(entries) // (3)[IntersectionObserverEntry, IntersectionObserverEntry, IntersectionObserverEntry]

  entries.forEach(entry => {
    // console.log(entry) // IntersectionObserverEntry {time: 119, rootBounds: DOMRectReadOnly, boundingClientRect: DOMRectReadOnly, intersectionRect: DOMRectReadOnly, isIntersecting: true, …}

    // 監視の対象がビューポートに入ってきたときの処理
    if(entry.isIntersecting){
      [...entry.target.querySelectorAll("span")].forEach((span, index) => {
        // setTimeoutでspanに対してdurationをつける
        setTimeout(() => {
          span.style.transform = `translateY(0)`
          span.style.opacity = 1
        }, (index + 1) * 100)
      })
    }
  })

}

const options = {
  rootMargin: "0px",
  threshold: 1.0
}

const observer = new IntersectionObserver(callback, options)

// テキストをspanで分割
textReveals.forEach(text => {
  // console.log(text);
  const splitTexts = text.innerText.trim().split("");
  // console.log(splitTexts);

  const reducedTexts = utils.reduceText(splitTexts);  // spanでテキストをラップ
  // console.log(reducedTexts);

  text.innerHTML = reducedTexts; // 元のhtmlを上書き

  // .text__revealの親要素を監視対象
  observer.observe(text.parentElement);
});


// EventListener
main.addEventListener("scroll", () => {
  animateVideo()    // 
  scrollBlogPosts() // blogズームアニメーション
  scrollCircle()    // circleアニメーション
  scrollDiscover()  // テキストアニメーション
})


// 再帰関数
function render(){
  // console.log("animate")
  animateProjects();

  requestAnimationFrame(render)
}
render()









/**************************************************************

元のコード

***************************************************************/

// // モジュールを使うなら、拡張子の省略はNG
// import { lerp } from "./utils.js"; 
// import { createBlogPosts, createProjects } from "./projects.js";

// const main = document.querySelector("main")
// const video = document.querySelector("video");
// const videoSection = document.querySelector("#video");


// // スライダーに画像を生成・追加
// createProjects()

// // ブログを追加
// createBlogPosts()


// main.addEventListener("scroll", () => {
//   // console.log(window.scrollY)

//   animateVideo()
// })


// // Videoセクション
// const headerLeft = document.querySelector(".text__header__left")
// const headerRight = document.querySelector(".text__header__right")

// function animateVideo(){
//   // console.log(videoSection.getBoundingClientRect())

//   // bottom ビューポートの上から要素の下までの距離
//   // スクロールするとbottomの値が小さくなるのでこれを利用する
//   let { bottom } = videoSection.getBoundingClientRect();
//   // console.log(bottom, window.innerHeight, bottom - window.innerHeight)

//   // 1 - (ビューポートの上から底までの距離 - ビューポートの高さ)
//   let scale = 1 - ((bottom - window.innerHeight) * .0005)
//   // console.log(scale)

//   // .2 < scale < 1 の範囲にする
//   scale = scale < .2 ? .2 : scale > 1 ? 1 : scale;
//   // console.log(scale)

//   video.style.transform = `scale(${scale})`;

//   // テキストの変化
//   let textTrans = bottom - window.innerHeight;
//   // console.log(textTrans)

//   textTrans = textTrans < 0 ? 0 : textTrans; // 0より上に
//   // console.log(textTrans)

//   headerLeft.style.transform = `translateX(-${textTrans}px)` // 左からイン
//   headerRight.style.transform = `translateX(${textTrans}px)`
// }


// // Projectsセクション
// const projectSticky = document.querySelector(".projects__sticky");
// let projectSlider = document.querySelector(".projects__slider");

// let projectTargetX = 0;
// let projectCurrentX = 0;

// // 各幅での何vw左にずらすかを設定。ビューポートにある画像の枚数で設定
// // small(600px)以下では、700px左にずらすことで最後の画像がちょうど現れる
// let percentages = {
//   small: 700,
//   medium: 300,
//   large: 100,
// }

// let limit = window.innerWidth <= 600  ? percentages.small :
//             window.innerWidth <= 1200 ? percentages.medium :
//             percentages.large;


// function setLimit(){
//   limit = window.innerWidth <= 600  ? percentages.small :  // 700
//           window.innerWidth <= 1100 ? percentages.medium : // 300
//           percentages.large; // 100
//           // console.log(limit)
// }

// window.addEventListener("resize", setLimit);

// // projectsセクションがビューポートに入ってきたらスライダーを動かす
// function animateProjects(){
//   // projectsセクションのサイト全体の上端からの距離を取得
//   let offsetTop = projectSticky.parentElement.offsetTop; // offsetTop 要素の親要素に対する上端(top)の距離をピクセル単位で取得
//   // console.log(offsetTop) // 3616

//   // projectsセクションがビューポートの高さに対して何％のところに位置しているかを取得
//   // スクロール量とprojectsセクションの上端からの高さが同じになればpercentageの値が同じになるので動き出す
//   // (mainの上からのスクロール量 - projectsセクションのサイト全体の上端からの距離) / ビューポートの高さ) * 100
//   let percentage = ((main.scrollTop - offsetTop) / window.innerHeight) * 100 // ((0 - 3616) / 904) * 100
//   // console.log(main.scrollTop - offsetTop) // -3616
//   // console.log(main.scrollTop, offsetTop, `${percentage}%`)

//   // 0 < percentage < 各幅でのリミット(700, 300, 100)
//   // projectsセクションがビューポートに入ったらスライダーが動き出す
//   percentage = percentage < 0 ? 0 :
//               percentage > limit ? limit : // 各幅でのlimitを超えたらpercentageが増加する
//               percentage;
//   // console.log(percentage)

//   // これから動く先の位置と、これまでいた位置の距離の.1の部分を取得
//   projectTargetX = percentage;
//   projectCurrentX = lerp(projectCurrentX, projectTargetX, .1); // 第３引数を小さくすればするほど慣性が効く
//   // console.log(projectCurrentX)

//   projectSlider.style.transform = `translate3d(${-(projectCurrentX)}vw, 0, 0)`
// }



// // Blogセクション
// const blogSection = document.getElementById("blog");
// const blogPosts = [...document.querySelectorAll(".post")]
// // console.log(blogPosts) // 純粋な配列
// // const blogPosts = document.querySelectorAll(".post")
// // console.log(blogPosts) // NodeList(3) [div.post, div.post, div.post]

// // 画像をスクロールするたびに小さくしていく
// function scrollBlogPosts(){
//   // blogセクションの、サイト全体の上端からの高さを取得
//   let blogSectionTop = blogSection.getBoundingClientRect().top;
//   // console.log(blogSectionTop)

//   // console.log(blogPosts[1].parentElement.getBoundingClientRect().top)

//   for(let i = 0; i < blogPosts.length; i++){
//     // .postの親要素の.blog__postがビューポートの上端との距離が1px以下になると
//     if(blogPosts[i].parentElement.getBoundingClientRect().top <= 1){
//       // console.log(".blob_post react viewport top")

//       // blogセクションのサイト全体のトップからの距離 + (ビューポートの高さ * (i + 1) * .0005)
//       // 1つ目のoffset (-904 + (904 * (0 + 1))) * .0005 
//       // 2つ目のoffset (-1808 + (904 * (1 + 1))) * .0005
//       // 3つ目のoffset (-2712 + (904 * (2 + 1))) * .0005
//       // blogSectionTopはスクロールするたびにマイナスになっていくのでoffsetにはマイナスの値が入る
//       // 要は、-1 * 0.0005 の形を作り、-1から0の範囲内で少しづつ小さくしていく
//       let offset = (blogSectionTop + (window.innerHeight * (i + 1))) * .0005;

//       // -1 < offset <= 0 の範囲にする
//       offset = offset < -1 ? -1 : // -1よりマイナスになれば、-1にとどめる
//               offset >= 0 ? 0 :   // 0以上になれば0にしていおく
//               offset;
      
//       // console.log(
//       //   (blogSectionTop + (window.innerHeight * (0 + 1))) * .001,     // 1つ目のpost
//       //   // (blogSectionTop + (window.innerHeight * (1 + 1))) * .0005,  // 2つ目のpost
//       //   // (blogSectionTop + (window.innerHeight * (2 + 1))) * .0005,  // 3つ目のpost
//       //   // offset
//       // )

//       // console.log(offset)
//       // scale(1)で元の大きさなので、そこからoffsetでマイナスしていく
//       blogPosts[i].style.transform = `scale(${1 + offset})` 
//     }
//   }

// }


// // circleセクション
// const circleSection = document.getElementById("circle__section")
// const circle = document.querySelector(".circle");

// function scrollCircle(){
//   // circleセクションのサイト全体の上端からの高さを取得
//   // console.log(circleSection.getBoundingClientRect())
//   // DOMRect {x: 0, y: 14464, width: 509, height: 1808, top: 14464, …}
//   let { top } = circleSection.getBoundingClientRect()
//   let scrollTop = Math.abs(top);

//   // circleセクションがビューポートに入ればscale値が0になり、そこから少しづつ値が大きくなる
//   let scale = (scrollTop / window.innerHeight)
//   // console.log(scale) // 16

//   // 0 < scale < 1 の範囲に
//   scale = scale < 0 ? 0 :
//           scale > 1 ? 1 :
//           scale;
//   // console.log(scale)

//   if(top <= 0){
//     circle.style.transform = `translate(-50%, -50%) scale(${scale})`
//   } else {
//     circle.style.transform = `translate(-50%, -50%) scale(0)`
//   }
  
// }

// // Discoverセクション
// const dContainer = document.querySelector(".discover__container")
// const leftText = document.querySelector(".text__left")
// const rightText = document.querySelector(".text__right")

// function scrollDiscover(){
//   // サイト全体の上端からdContainerのbottomまでの高さを取得
//   let { bottom } = dContainer.getBoundingClientRect();
//   // console.log(bottom) // 17176

//   let textTrans = bottom - window.innerHeight;
//   // console.log(textTrans)

//   textTrans = textTrans < 0 ? 0 : textTrans // 0より上にする
//   console.log(textTrans)
//   leftText.style.transform = `translateX(-${textTrans}px)`
//   rightText.style.transform = `translateX(${textTrans}px)`
// }


// // テキストアニメーション IntersectionObserver
// const textReveals = [...document.querySelectorAll(".text__reveal")]

// let callback = (entries => {
//   entries.forEach(entry => {
//     if(entry.isIntersecting){
//       [...entry.target.querySelectorAll("span")].forEach((span, index) => {
//         setTimeout(() => {
//           span.style.transform = `translateY(0)`
//         }, (index + 1) * 50)
//       })
//     }
//   })

// })

// let options = {
//   rootMargin: "0px",
//   threshold: 1.0
// }

// let observer = new IntersectionObserver(callback, options)

// textReveals.forEach(text => {
//   let string = text.innerText;
//   // console.log(string)

//   let html = '';
//   for(let i = 0; i < string.length; i++){
//     html += `<span>${string[i]}</span>`
//   }
//   // console.log(html)

//   text.innerHTML = html;
//   observer.observe(text.parentElement);

// })


// main.addEventListener("scroll", () => {
//   scrollBlogPosts() // blogズームアニメーション

//   scrollCircle() // circleアニメーション

//   scrollDiscover() // テキストアニメーション
// })

// function animate(){
//   // console.log("animate")
//   animateProjects();

//   requestAnimationFrame(animate)
// }
// animate()


