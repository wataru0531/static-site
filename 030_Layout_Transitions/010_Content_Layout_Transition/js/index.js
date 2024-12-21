

import { utils } from '/utils.js';
import { Slideshow } from './slideshow.js';

const $ = {};
$.stack = document.querySelector(".stack");


document.addEventListener("DOMContentLoaded", init);

// 初期化処理
function init(){
  // 画像のロードが終われば発火させる
  utils.preloadImages('.stack__item').then( _ => {
    document.body.classList.remove('loading');
  
    const slideshow = new Slideshow($.stack);

    // const gap = getComputedStyle(document.documentElement).getPropertyValue('--slide-gap');
    // console.log(gap);
    // console.log(document.documentElement);

    // document.documentElement.scrollTop = document.body.scrollTop = -200;

  });
}
