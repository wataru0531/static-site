

import { utils } from '/utils.js';


window.addEventListener("DOMContentLoaded", () => {
  // gsap, lenis
  gsap.registerPlugin(ScrollTrigger);
  utils.initLenis();

  // 画像の読み込み終われば、ローディング終了。アニメーションの初期化
  utils.preloadImages('.grid__img').then(() => {
    document.body.classList.remove('loading'); // Remove the loading class from the body
    
    initAnimate();

    // window.scrollTo(0, 0); // 効かない...
    // document.documentElement.scrollTo(0, 0); 
  });
});


// 初期化
async function initAnimate(){
  animateHeader();  // headerのアニメーション

  animateFirstGrid();
  animateSecondGrid();
  animateThirdGrid();
  animateFourthGrid();
  animateFourthV2Grid();
  animateFifthGrid();
  animateSixthGrid();
  animateSeventhGrid();
  animateEighthGrid();
  animateNinthGrid();
};


// headerアニメーション
function animateHeader() {
  const header = document.querySelector('.header'); 
  const headerTitle = header.querySelector('.header__title');
  
  gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: header,
      start: 'clamp(top bottom)', // headerのtop ブラウザのbottom
      // start: 'top top', // headerのtop ブラウザのbottom
      // もし計算された位置がスクロール可能範囲を超えた場合: 
      //  → 自動的に範囲内に収まるよう制限される
      end: 'bottom top',
      scrub: true, // スクロールと後述のアニメーションとを同期
    }
  })
  .to(header, { // 下に下げる
    yPercent: 35,
    scale: 0.95,
    startAt: { filter: 'brightness(100%)' }, // 必ず明るさを100%にしておく
    filter: 'brightness(30%)' // 明るさ
  })
  .to(headerTitle, {
    xPercent: -80
  }, 0);
};


// ①
function animateFirstGrid() {
  const gridFirst = document.querySelector('[data-grid-first]');
  const gridImages = [...gridFirst.querySelectorAll('.grid__img')];

  gsap.timeline({
    defaults: { ease: 'sine.inOut' },
    scrollTrigger: {
      trigger: gridFirst, // .grid
      start: 'center center',
      end: '+=250%', // 250%だけでいいが、triggerから+250%の地点とgsapに認識させる
      pin: gridFirst.parentNode, // .content
      scrub: .5, // スクロールとアニメーションを同期 + 慣性をつける
      // scrub: true, // スクロール率とアニメーションとを完全に同期
    }
  })
  .from(gridImages, { // from 元に戻す
    stagger: 0.07, // each。gridImagesの画像１つ１つに対してdelayをつける
    y: () => {
      // gsap.utils.random(min, max)で、指定した範囲のランダムな値を返す
      // console.log(gsap.utils.random(window.innerHeight, window.innerHeight* 1.8));
     return gsap.utils.random(window.innerHeight, window.innerHeight * 1.8)
    }
  })
  .from(gridFirst.parentNode.querySelector('.content__title'), {
    duration: 1.2,
    ease: 'power4',
    yPercent: 180,
    autoAlpha: 0
  }, 0.8); // タイムラインの先頭（0秒）から0.8秒後にアニメーションを開始
  // →　scrub を設定すると、タイムライン全体が スクロール進行度 (0から1) と連動。
  //    この場合、タイムライン内の 0.8 は「全体の進行度の 80% の地点」を意味する
  // 　　よって、.88進んだ地点から1の間でアニメーションが同期される
};


// ②
function animateSecondGrid() {
  const grid = document.querySelector('[data-grid-second]');
  const gridImages = [...grid.querySelectorAll('.grid__img')];
  const middleIndex = Math.floor(gridImages.length / 2); // 少数切り捨て
  // ceil: 少数切り上げ、floor: 少数切り捨て、round: 四捨五入
  // console.log(middleIndex); // 2

  gsap.timeline({
    defaults: { ease: 'power3' },
    scrollTrigger: {
      trigger: grid,
      start: 'center center',
      end: '+=250%', // ブラウザのビューポートに対しての割合
      pin: grid.parentNode, // .content
      scrub: 0.5, // スクロールと、後述のアニメーションを同期。慣性
    }
  })
  .from(gridImages, {
    stagger: {
      // この場合はscrubが設定してあるので、秒数ではなくスクロールの進行に合わせたタイミングでの発火となる
      // →　ここではtriggerであるgrigの中央とブラウザの中央が交差してから、+=250%の地点までの間の30%の相対的な差をつける
      amount: 0.3, 
      from: 'center', // 中央から
    },
    y: window.innerHeight, // ブラウザの高さ分下げる
    transformOrigin: '50% 0%',
    rotation: pos => { // gridImagesの要素のインデックス
      // console.log(pos); // 0 1 2 3 4
      const distanceFromCenter = Math.abs(pos - middleIndex);
      // console.log(distanceFromCenter); // 2 1 0 1 2
      // console.log(pos < middleIndex ? distanceFromCenter * 3 : distanceFromCenter * -3);
      // 6 3 0 -3 -6
      // 中央から外側ほど回転させておく。プラスで時計回り
      return pos < middleIndex ? distanceFromCenter * 3 : distanceFromCenter * -3;
    },
  })
  .from(grid.querySelectorAll('.grid__item'), {
    stagger: {
      each: 0.3, // 
      from: 'center'
    },
    yPercent: 100,
    autoAlpha: 0
  }, 0); // タイムラインの頭から
};


// ③
function animateThirdGrid() {
  const grid = document.querySelector('[data-grid-third]');
  const gridImages = grid.querySelectorAll('.grid__img');

  gsap.timeline({
    defaults: { ease: 'power3' },
    scrollTrigger: {
      trigger: grid,
      start: 'center center',
      end: '+=200%',
      pin: grid.parentNode, // .content
      scrub: 0.2,
    }
  })
  .from(gridImages, {
    stagger: 0.06, // each
    y: window.innerHeight,
    rotation: () => gsap.utils.random(-15, 15),
    transformOrigin: '50% 0%', // 上中央を起点に回転
  })
  .fromTo(gridImages, 
    {
      filter: 'brightness(100%)', // 明るさ
    },
    {
      ease: 'none',
      stagger: 0.06,
      filter: pos => {
        // 4番目までを20%に抑えて、最後の要素は100%のままとする
        // console.log(pos); // 0 1 2 3 4
        // console.log(gridImages.length - 1); // 4
        return pos < gridImages.length - 1 ? 'brightness(20%)' : 'brightness(100%)'
      }
    }, 0) // タイムラインの頭から
  .from(grid.querySelectorAll('.grid__item'), {
    xPercent: pos => {
      return pos % 2 ? 100 : -100
    },
    autoAlpha: 0
  }, 0.06 * gridImages.length); 
  // タイムラインの頭から画像の枚数*0.06。つまり全体で.3の位置から開始
  // →　gridImageの最後の要素とアニメーションが終わるのを同じにしている
};



// 各画像をx, y, z軸方向に動かす値、回転する角度を返す処理
// →　ランダムではなく、一定の基準に基づいて均等に動かす
//    例: ビューポート中央から遠い画像ほど、移動距離や回転する値が大きくなる
function calculateInitialTransform(element, offsetDistance = 250, maxRotation = 300, maxZTranslation = 2000) {
  const viewportCenter = { // ビューポートの中央
    width: window.innerWidth / 2, 
    height: window.innerHeight / 2 
  };

  const elementCenter = { // 格納その中央の座表
    // offsetLeft → ビューポートの左側からの距離
    x: element.offsetLeft + element.offsetWidth / 2, 
    y: element.offsetTop + element.offsetHeight / 2 
  };
  // console.log(element.offsetLeft); 
  // console.log(element.offsetTop); // 親要素(.grid_img)の上端からの距離

  // 中央(0, 0)から各画像までの角度を算出
  // atan → 長さの比から角度を算出。tanは角度から比を算出する
  //        計算される角度は -π から π の範囲で、-180° から 180° まで
  const angle = Math.atan2(
    Math.abs(viewportCenter.height - elementCenter.y), 
    Math.abs(viewportCenter.width - elementCenter.x),
    // viewportCenter.height - elementCenter.y, 
    // viewportCenter.width - elementCenter.x
  );
  // console.log(angle); 

  // x軸、y軸方向への移動距離の値
  // 画像の角度に合わせて、x軸、y軸の位置を設定し、250をかけて移動距離を決定
  // cos, sin → 角度(ラジアン)を入れることで、比(-1〜1)が返る
  const translateX = Math.abs(Math.cos(angle) * offsetDistance);
  const translateY = Math.abs(Math.sin(angle) * offsetDistance);
  // console.log(translateY) // -1 〜 1 * 250

  // ビューポートの中央から角四方までの距離。中央からの最大距離
  // Math.sqrt → √。
  // Math.pow(2, 3) → べき乗。2 * 2 * 2
  // console.log(Math.pow(viewportCenter.width, 2)); // 250000
  const maxDistance = Math.sqrt(Math.pow(viewportCenter.width, 2) + Math.pow(viewportCenter.height, 2));

  // ビューポート中央から各画像の中央までの距離
  const currentDistance = Math.sqrt(Math.pow(viewportCenter.width - elementCenter.x, 2) + Math.pow(viewportCenter.height - elementCenter.y, 2));

  // 最大距離に対する、ビューポート中央から各画像の中央までの距離に対する比。0 〜 1
  // ビューポート中央から遠い画像ほど1に近く大きくなる
  const distanceFactor = currentDistance / maxDistance;

  // 回転角度を決定
  // 中央から離れている要素ほど大きく回転する
  // translateY → -1 〜 1 * 250
  // offsetDistance → 250
  // translateY / offsetDistance ... 元のcos, sinの-1〜1の値に戻しているだけ
  // maxRotation → 300
  // distanceFactor → 0〜1の範囲の数値で、ビューポート外側の画像ほど値が1に近くて大きい
  // rotationX: プラスなら、向かって奥側に回転
  // rotationY: プラスなら、向けって左に回転
  const rotationX = ((elementCenter.y < viewportCenter.height ? -1 : 1) * (translateY / offsetDistance) * maxRotation * distanceFactor);
  const rotationY = ((elementCenter.x < viewportCenter.width ? 1 : -1) * (translateX / offsetDistance) * maxRotation * distanceFactor);

  // z軸方向への移動距離の値。0 〜 1 * 2000
  const translateZ = maxZTranslation * distanceFactor;

  // 各画像をx, y, z軸方向に動かす値、回転する角度を返す
  return {
    // ビューポート中央より右側の画像はプラス、左側の画像はマイナスに
    x: elementCenter.x < viewportCenter.width ? -translateX : translateX,
    y: elementCenter.y < viewportCenter.height ? -translateY : translateY,
    z: translateZ,
    rotateX: rotationX,
    rotateY: rotationY
  };
};

// ④
function animateFourthGrid() {
  const grid = document.querySelector('[data-grid-fourth]');
  const gridImages = [...grid.querySelectorAll('.grid__img')];

  gsap.timeline({
    defaults: { ease: 'expo' },
    scrollTrigger: {
      trigger: grid,
      start: 'center center',
      end: '+=200%', // ビューポートの200%
      pin: grid.parentNode, // .content
      scrub: .2,
    }
  })
  .set(grid, { 
    // perspective → 3D 効果を作り出すための基準点を設定する
    //               これを設定した要素の子要素に対して、奥行きや3D効果が反映される
    //               カメラであり値が小さいほど、要素の近くを移すので物体が大きく見える
    // transform-style → 子要素が親の 3D コンテキストを 明示的に引き継ぐ
    //                   これを省略すると、親要素の perspective は適用されるが、別の親要素やスタイル変更がある場合に意図しない挙動を引き起こすことがある
    //                   将来的な変更や可読性を考えると、transform-style: preserve-3d を書いておく方が明示的で安全
    perspective: 1000, 
    transformStyle: "preserve-3d" 
  }) // 3D
  .fromTo(gridImages, 
    {
      // 各要素をx, y, z軸方向に動かして、戻していく
      x: (_, el) => {
        // console.log(_); // インデックス
        // console.log(el); // 各.grid__img
        calculateInitialTransform(el).x
      },
      y: (_, el) => calculateInitialTransform(el).y,
      z: (_, el) => calculateInitialTransform(el).z, // Z-axis translation
      rotateX: (_, el) => calculateInitialTransform(el).rotateX*.5,
      rotateY: (_, el) => calculateInitialTransform(el).rotateY,
      autoAlpha: 0,
      scale: 0.7,
    }, 
    {
      x: 0,
      y: 0,
      z: 0,
      rotateX: 0,
      rotateY: 0,
      autoAlpha: 1,
      scale: 1,
      stagger: {
        amount: 0.2,
        from: 'center', // 中央から先に動かす
        grid: [4, 9] 
        // 4行9列のgridであることを、gsapに明示的に伝えることで、グリッド状の配置でのアニメーション制御させる
        // →　zlこの情報に基づき、アニメーションの遅延(stagger)が自動的に計算される
      }
    }
  );
};


// ④-v2
function animateFourthV2Grid() {
  const grid = document.querySelector('[data-grid-fourth-v2]');
  const gridImages = grid.querySelectorAll('.grid__img');

  gsap.timeline({
    defaults: { ease: 'power4' },
    scrollTrigger: {
      trigger: grid,
      start: 'center center',
      end: '+=200%', // ビューポートの200%
      pin: grid.parentNode, // .content
      scrub: 0.2, // アニメーションとスクロールを同期。慣性を.2付与
    }
  })
  .set(grid, { 
    perspective: 1200, 
    transformStyle: "preserve-3d" 
  }) // Add perspective for 3D effect
  .fromTo(gridImages, {
    // calculateInitialTransform(element, offsetDistance = 250, maxRotation = 300, maxZTranslation = 2000) {
    // offsetDistance → ビューポート中央からの距離など。Math.cos() * offsetDistance
    x: (_, el) => calculateInitialTransform(el, 900).x,
    y: (_, el) => calculateInitialTransform(el, 600).y,
    z: (_, el) => calculateInitialTransform(el, _, _, -3000).z,
    // → _ には各画像のインデックスが入る
    rotateX: (_, el) => calculateInitialTransform(el, 250, -160, -3000).rotateX,
    rotateY: (_, el) => calculateInitialTransform(el, 250, -160, -3000).rotateY,
    autoAlpha: 0,
    scale: 0.4,
  }, {
    x: 0,
    y: 0,
    z: 0,
    rotateX: 0,
    rotateY: 0,
    autoAlpha: 1,
    scale: 1,
    stagger: {
      amount: 0.15,
      from: 'center',
      grid: [4, 9]
    }
  })
};

// ⑤
function animateFifthGrid() {
  const grid = document.querySelector('[data-grid-fifth]');
  const gridImages = grid.querySelectorAll('.grid__img');
  
  gsap.timeline({
    defaults: { ease: 'sine' },
    scrollTrigger: {
      trigger: grid,
      start: 'center center',
      end: '+=250%',
      pin: grid.parentNode, // .content
      scrub: 0.3,
    }
  })
  .set(grid, { 
    perspective: 1000,
    transformStyle: "preserve-3d",
  })
  .from(gridImages, {
    y: window.innerHeight, // ビューポートの高さ/2下げる
    rotationX: -70, // マイナスの値なら、向かって手前側に回転する
    transformOrigin: '50% 0%',
    z: -900,
    autoAlpha: 0,

    stagger: {
      amount: .4, 
      // from() で指定されたアニメーション（例: y, z など）が、0 まで到達する全体のスクロール進行度が 1 となる
      // ここでは、amount: 0.4 と指定することで、アニメーションの進行がその1のうちの 0.4(40%)の範囲にわたって要素ごとにずれるようになる
      // 注意: アニメーション自体の長さは変わらない。
      // amount: 1とすると、
      from: 'random',
      grid: [4,9] // gridであることをgsapに通知。内部で計算されるらしい
    },
  });
};

// ⑥
function animateSixthGrid() {
  const grid = document.querySelector('[data-grid-sixth]');
  const gridImages = grid.querySelectorAll('.grid__img');
  
  gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: grid,
      start: 'center center',
      end: '+=200%',
      pin: grid.parentNode,
      scrub: 0.5, // スクロールと同期、慣性を.5付与
    }
  })
  // 画像自体は剪断されていないが、コンテナ自体が剪断されている
  .from(gridImages, { // 画像
    scale: 0.7,
    autoAlpha: 0,

    stagger: {
      amount: 0.03,
      from: 'edges',
      grid: [3,3]
    },
  })
  .from(grid, { // コンテナ。
    scale: .7,
    skewY: 5,
  }, 0); // タイムラインの先頭から
};

// ⑦
function animateSeventhGrid() {
  const grid = document.querySelector('[data-grid-seventh]');
  const gridImages = grid.querySelectorAll('.grid__img');
  
  gsap.timeline({
    defaults: { ease: 'power1' },
    scrollTrigger: {
      trigger: grid,
      start: 'center center',
      end: '+=150%',
      pin: grid.parentNode,
      scrub: 0.5,
    }
  })
  .fromTo(gridImages, // 画像のラッパー
    {
      yPercent: -102,
      filter: 'brightness(300%) contrast(480%)',
      // filter: 'brightness(300%)',
      // filter: 'contrast(480%)',
      // コントラスト →　コントラストが高いと、明るい部分はより明るく、暗い部分はより暗く
      //               0%でグレー、100%で通常
      //               contrast(480%)で、明るい部分は4.8倍明るく、暗い部分は4.8倍暗くなる
      // brightness 明るさ。100%で通常
    }, 
    {
      stagger: 0.08,
      yPercent: 0,
      filter: 'brightness(100%) contrast(100%)'
      // filter: 'brightness(100%)'
      // filter: 'contrast(100%)'
    }
  )
  .from([...gridImages].map(img => img.querySelector('.grid__img-inner')), {
    // → 画像
    stagger: 0.08,
    yPercent: 102, // 上から下に下ろす
  }, 0) // タイムラインの先頭から
  
  .from(grid.querySelectorAll('.grid__item'), {
    yPercent: 20, // 下から上げる
    stagger: gridImages.length / 2 * 0.08,
    // fromToの部分が１つづつで、0.08のdelayがついているので、
    // →　画像全体の長さを２で割ることで、２つ目のgrid_imgのアニメーションと動くタイミングを合わせることができる
    autoAlpha: 0,
  }, 0);
};

// ⑧
function animateEighthGrid() {
  const grid = document.querySelector('[data-grid-eighth]');
  const gridImages = [...grid.querySelectorAll('.grid__img')];
  
  gsap.timeline({
    defaults: { ease: 'expo' },
    scrollTrigger: {
      trigger: grid,
      start: 'center center', // .gridのcenter ビューポートのcenter
      end: '+=250%', // ビューポートの高さの250%の位置
      pin: grid.parentNode,
      scrub: true, // スクロールの進行度合いとアニメーションを同期しているだけ

      // onUpdate: (self) => {
      //   console.log(self.progress)
      // },
    }
  })
  .set(grid, { perspective: 2000, transformStyle: "preserve-3d" })
  .from(gridImages, { // 画像の回転、y軸の位置
    // onStart: () => console.log("onStart"),
    // onComplete: () => console.log("onComplete"),
    transformOrigin: '0% 50%', // 左中央をtransformの基準
    rotationY: 65, // プラスなら、奥に回転する。ここは65°からの現象なので逆に動く
    z: -200,
    yPercent: 10, // 10%

    stagger: {
      amount: 0.8,
      // amountの計算
      // scrubしてないなら全体で.8秒だが、スクロールと同期してあるので、.8秒を全体の要素で割って遅延を均等に行う
      // → 遅延 = amount / (totalElements - 1)
      //   ここでは、遅延 = .8 / (36 - 1)
      //   1つ目の要素が、0秒後に始まり、2つ目が約0.02、..., 35番目の要素が0.777, 36番目が0.8で発火
      from: 'start'
    },
  })
  .from(gridImages, { // 画像の透明度
    duration: 0.2,
    autoAlpha: 0,
    stagger: {
      amount: 0.8, // scrubしているので、.8 / (36 - 1) づつ要素に遅延をつける
      from: 'start'
    }
  }, 0); // タイムラインの頭から
};

// ⑨右サイドから出現
function animateNinthGrid() {
  const grid = document.querySelector('[data-grid-ninth]');
  const gridImages = grid.querySelectorAll('.grid__img');
  
  gsap.timeline({
    defaults: { ease: 'power3' },
    scrollTrigger: {
      trigger: grid,
      start: 'center center',
      end: '+=200%',
      pin: grid.parentNode,
      scrub: true, // スクロールと後続のアニメーションの進行を同期
    }
  })
  .from(gridImages, {
    transformOrigin: '100% -450%',
    // → 画像のかなり右上をアニメーションの起点に
    // transformOrigin: "50% top",
    stagger: 0.07, // 画像１枚１枚に
    scaleX: 1.05,
    skewX: 15,
    // skew
    // →　座表変換で座標自体が剪断される。
    //    座標自体が剪断されるので、プラスなら上辺は左側に動き、下の辺は右側に動く
    xPercent: 50,
    rotation: -10,
    autoAlpha: 0
  });
};

