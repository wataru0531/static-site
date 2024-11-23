
// console.log(lerp(10, 15, 0.9991));


// transformを付与。_elはDOM
function setTransform(_el, _transform) {
  _el.style.transform = _transform;
}

// 与えた秒数、処理を遅らせる。ms
function delay(time){
  return new Promise(resolve => setTimeout(resolve, time))
}

// ①テキストをspanでラップする関数。reduce版
function reduceText(_textArray){
  return _textArray.reduce((accu, curr) => {
    // console.log(accu, curr)
    curr = curr.replace(/\s+/, "&nbsp;")

    // return accu + curr
    return `${accu}<span class="char">${curr}</span>`
  }, "")
}

// ②テキストをspanでラップする関数 for文版
function wrapSpan(_text){
  let html = "";

  for(let i = 0; i < _text.length; i++){
    // console.log(_text[i]);
    let char = _text[i] === " " ? "&nbsp;" : _text[i]; // 空白には、"nbsp;" 

    html += `<span class="char">${char}</span>`;
  }

  return html;
}



// ランダムな整数値を取得
function random(min, max) {
  const num = Math.floor(Math.random() * (max - min)) + min;
  return num;
}

// rgbカラーコードを生成
function generateRgb() {
  return `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`;
}

// 16進数のカラーコードを生成
function generateHex(){
  const letters = "0123456789ABCDEF"; // ※letters ... 文字の意味
  let hash = "#";

  for(let i = 0; i < 6; i++){
    // Math.floor()  ... 小数点切り捨て
    // Math.random() ... 0以上〜1未満の範囲で乱数を生成。
    // Math.random() * 16 とすることで、0〜15までの数値がランダムで生成される。

    // lettersの中からランダムに文字列を取得して#以下を選択
    hash += letters[Math.floor(Math.random() * 16)];
  }

  return hash;
}


// モバイルデバイスかタブレットだったらtrueを返す。PCだったらfalseを返す
function isDevice() {
  const ua = window.navigator.userAgent;
  // console.log(ua) // Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36
  
  // 検索対象の文字列や配列の中で、特定のサブ文字列や要素が最初に現れる位置を返す。見つからなかった場合は-1を返す。
  // console.log(ua.indexOf("iPhone")) // -1
  // if(ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0){
  //   return 'mobile';
  // }else if(ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0){
  //   return 'tablet';
  // }else{
  //   return 'desktop';
  // }

  const isMobile = (ua.indexOf('iPhone') > -1 || ua.indexOf('iPod') > -1 || ua.indexOf('Android') > -1 && ua.indexOf('Mobile') > -1);
  const isTablet = (ua.indexOf('iPad') > -1 || ua.indexOf('Android') > -1);
  if(isMobile || isTablet) return true;

  return false;
}

// 配列の要素をランダムにシャッフル。
// Fisher-Yates（フィッシャー・イェーツ）アルゴリズム
function shuffleArray(_array){
  // console.log(_array)
  const newArray = _array.slice(); // 複製。元の配列には影響なし

  // 配列全体を後ろからループ
  // console.log(_array.length - 1) // 4 最後の要素を取得
  // i > 0 ... i が 0までループを継続。つまり、indexが0の時終了。
  for(let i = newArray.length - 1; i >= 0; i--){
    // 配列のインデックスをランダムに返す。0から
    const randomIndex = Math.floor(Math.random() * (i + 1)); // floor 少数切り捨て
    // console.log(i, randomIndex) // インデックス、ランダムな数値
    
    // ここで配列の要素の回数ループを回し、要素を入れ替える。
    [newArray[i], newArray[randomIndex]] = [newArray[randomIndex], newArray[i]];

    // console.log(newArray)
  }

  return newArray;
}

function distance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;

  // Math.sqrt() ... 与えられた数値の平方根を返す。スクエアルート
  return Math.sqrt(dx * dx + dy * dy);
}
// console.log(distance(0, 0, 3, 4)); // 5 (3-4-5の三角形)

// インデックスが範囲を超えた場合に適切にラップする関数
// 配列が[0, 1, 2]とあったとして、4のインデックスに増えるところを次のインデックスを0にする
// -1、+1になるところを配列のlength-1にわわせることができる
// gsap.utils.wrapのバニラ版
function wrap(current, min, max) {
  const range = max - min; // range 3

  return ((current - min) % range + range) % range + min;
}

// 最小値から最大値までのランダムな値を取得
function mapRand(min, max, isInt = false) {
  // Math.random 0 〜 1未満
  // Math.round  四捨五入
  let rand = Math.random() * (max - min) + min;
  rand = isInt ? Math.round(rand) : rand; // Math.round 四捨五入

  return rand;
}


export {
  lerp,
  setTransform,
  delay,
  reduceText,
  wrapSpan,
  random,
  generateRgb,
  generateHex,
  isDevice,
  shuffleArray,
  mapRand,
  
}