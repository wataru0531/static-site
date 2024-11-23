
// split-type ... ライブラリ
// ResizeObserver ... lenis

import { utils } from './utils.js';


export class TextSplitter {
  constructor(textElement, options = {}) {
    if (!textElement || !(textElement instanceof HTMLElement)) {
      throw new Error('Invalid text element provided.');
    }

    // resizeCallback → リサイズ時に発火
    // splitTypeTypes → どのようにテキストを分割するか
    const { resizeCallback, splitTypeTypes } = options;
    // console.log(resizeCallback)
    
    this.textElement = textElement;

    this.onResize = typeof resizeCallback === 'function' ? resizeCallback : null;
    
    const splitOptions = splitTypeTypes ? { types: splitTypeTypes } : {};
    // console.log(splitOptions); // {types: 'words, chars'}

    // split-typeのライブラリ
    this.splitText = new SplitType(this.textElement, splitOptions);

    if (this.onResize) { // リサイズ処理のコールバックが入っているなら発火させる
      this.initResizeObserver();
    }
  }

  initResizeObserver() {
    // console.log("initResizeObserver running!!");
    this.previousContainerWidth = null; 

    // ResizeObserver 
    // → ネイティブなAPI。
    //   要素の幅や高さが変更されたときに通知を受け取り、コールバック関数(この場合は handleResize)を実行。
    // 　このコードでは、ResizeObserverによってtextElementのサイズ変化が検知されると、
    //   debounceを利用して頻度を制御したうえで、handleResizeが実行される
    // 　※ DOMロード時にも一度発火する
    let resizeObserver = new ResizeObserver(
      utils.debounce((entries) => {
        // console.log(entries); // [ResizeObserverEntry]
        // → this.textElement のこと。

        this.handleResize(entries)
      }, 100)
    );

    // 監視対象を指定する
    resizeObserver.observe(this.textElement);
  }

  handleResize(entries) {
    // console.log("handleResize running!!");
    const [{ contentRect }] = entries;
    // console.log(entries)  targetに、div.blur-text.blur-text--1
    // console.log(contentRect);
    const width = Math.floor(contentRect.width);

    // 初回は発火しない
    if (this.previousContainerWidth && this.previousContainerWidth !== width) {
      this.splitText.split(); 
      this.onResize(); 
    }

    this.previousContainerWidth = width; // ここで指定。次回から発火
  }

  getChars() { return this.splitText.chars; } // 文字ごとに返す。1つ目、２つ目のエフェクトで仕様

  getLines() { return this.splitText.lines; }

  getWords() { return this.splitText.words; }
}
