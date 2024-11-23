
// blur + brightnessが0の状態から、blurなし + brightnessが100%の状態にする
// ※ brightnessが0%なら明るさがない、100%なら明るさがある状態

// TODO
// split-typeは使わずにバニラJSで文字分割を

import { TextSplitter } from '../textSplitter.js';

export class BlurScrollEffect {
  constructor(textElement) {
    if (!textElement || !(textElement instanceof HTMLElement)) {
      throw new Error('Invalid text element provided.');
    }

    this.textElement = textElement;
    this.initializeEffect(); // エフェクトの初期化
  }

  initializeEffect() {
    const textResizeCallback = () => this.scroll(); // コールバックを格納
    // console.log(textResizeCallback)

    // this.splitterの初期化
    this.splitter = new TextSplitter(this.textElement, {
      resizeCallback: textResizeCallback, // テキストがリサイズされた場合にコールバックが呼ばれ、scroll メソッドが再度実行
      splitTypeTypes: 'words, chars' // どのようにテキストを分割するか。split-typeのライブラリに渡す
    });
    
    this.scroll();
  }

  scroll() {
    // console.log("scroll running!!")
    const chars = this.splitter.getChars(); // 分割した文字列取得
    // console.log(chars); // (212) [div.char, div.char, ...]
    // console.log(this.textElement); // <div class="blur-text blur-text--1" data-effect-1></div>

    gsap.fromTo(chars, 
      {
        // brightness → 100%で通常の明るさ
        filter: 'blur(10px) brightness(0%)',
        willChange: 'filter'
      }, 
      {
        ease: 'none', 
        filter: 'blur(0px) brightness(100%)',
        stagger: {each: .05},

        scrollTrigger: {
          trigger: this.textElement,
          // bottom-=15% ... ビューポート下から15%分上にずらした地点
          // center+= -15% ... ビューポート中央から15%下にずらした地点
          start: 'top bottom-=15%',  // triggerの要素 ブラウザ
          end: 'bottom center+=15%', // 
          scrub: true, // スクロールの動きとアニメーションを同期
        },
      });
  }
}
