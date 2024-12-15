
export const utils = {
  lerp,
  preloadImages,
  loadImage,
  getMousePos,
  getCSSVariableValue,
}

// 線形補間 t...補完係数
function lerp(start, end, t, limit = .001) {
  let current = start * (1 - t) + end * t;
  // end と currentの中間値の値が.001未満になれば、endを返す(要調整)
  if (Math.abs(end - current) < limit) current = end;

  return current;
}


// CSSの背景画像を含めた画像の読み込みが終わるまで待機する関数
function preloadImages(selector = 'img') {
  const elements = [...document.querySelectorAll(selector)];
  // console.log(elements); // NodeList(79) [div.grid__item-img, ...]
  const imagePromises = [];

  elements.forEach((element) => {
    // 背景画像の場合
    // console.log(getComputedStyle(element)); // 指定した要素に適用されているスタイルを表すオブジェクト
    const backgroundImage = getComputedStyle(element).backgroundImage;
    // console.log(backgroundImage);
    // url("image.jpg")、url('image.jpg')、url(image.jpg) にマッチさせる
    const urlMatch = backgroundImage.match(/url\((['"])?(.*?)\1\)/);
    // console.log(urlMatch); // (3) ['url("http://127.0.0.1:5501/images/1.avif")', '"', 'http://127.0.0.1:5501/images/1.avif', index: 0, input: 'url("http://127.0.0.1:5501/images/1.avif")', groups: undefined]
    if (urlMatch) {
      const url = urlMatch[2];
      // console.log(url)
      imagePromises.push(utils.loadImage(url));
    }
    // console.log(element.tagName); // div
    if (element.tagName === 'IMG') { // img要素の場合の処理
      const src = element.src;
      if(src) {
        imagePromises.push(utils.loadImage(src));
      }
    }
  });

  return Promise.all(imagePromises);
}

// 画像を生成し、画像のロードの完了を待つ関数
function loadImage(_src){
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = _src;
  })
}

// 対象の要素が持つCSSの値を取得する
function getCSSVariableValue(_element, _variableName) {
  return getComputedStyle(_element).getPropertyValue(_variableName).trim();
};

// マウスの位置を取得
function getMousePos(e) {
  return { 
      x : e.clientX, 
      y : e.clientY 
  };
};

