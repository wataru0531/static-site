

export const utils = {
  debounce,
  preloadFonts,
  initLenis,
}

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

// WebFont.js ここではGoogleフォントを
// https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js
function preloadFonts() {
  return new Promise((resolve) => {
    WebFont.load({
      google: {
        families: ['Inter:wght@100..900'],
      },
      active: () => { // active: resolve, // 正常に読み込まれたら発火したいコールバック
        // console.log("正常にフォントが読み込まれました。");
        resolve();
      },
    });
  });
};

// デバウンス
// → リサイズやホイールのイベントなどで最終的な1回の処理を実行する処理
// 　 例えばリサイズが止まった時にだけ発火する
//    return function(){} → この部分がイベントにコールバックとして登録され、
//    _callbackが実行される
function debounce(_callback, _delay){
  let timerId = null;

  return function(...args) {
    if(timerId) clearTimeout(timerId);
    // console.log(timerId)

    timerId = setTimeout(() => {
      // console.log(timerId)
      // console.log("callback done!!")
      // console.log(...args)

      // _callback(...args);
      _callback.apply(this, args); // thisのコンテキストを使いたい場合
    }, _delay);
  }
}

