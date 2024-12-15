/**************************************************************

Colors Project
https://www.udemy.com/course/the-creative-javascript-course/learn/lecture/29046408?start=1#overview

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

// Hex形式 ... "hexadecimal"（16進数）の略で、色を表現するための16進数の表記方法
//         0から15までの数字と、AからFまでの6つのアルファベットを使用
//         例 #2626ba

// chroma.js
// ... 例えば、const hexValue = chroma(#2626ba); としてHex形式の値を格納した場合
//     vexValueには、chromaオブジェクトが生成される。
//     chroma.jsはその色を内部的に解釈し、chromaオブジェクトを生成。
//     これには明度、彩度、色相の変更、補色の取得、色の混合などが含まれる
//     chromaオブジェクトは、その色に対して様々な操作を行うための便利なメソッドを提供する


// Global selections and variables
const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll(".color h2");
const popup = document.querySelector(".copy-container");
const adjustButton = document.querySelectorAll(".adjust"); // 調整ボタン
const lockButton = document.querySelectorAll(".lock");     // ロックボタン
const closeAdjustButton = document.querySelectorAll(".close-adjustment"); // スライダーの✖️ボタン
const slidersContainer = document.querySelectorAll(".sliders"); // inputタグのコンテナ

let initialColors; // 初期化時に格納する色の配列
let savedPalettes = []; // ローカルストレージに格納する配列


// Event Listener
// randomColors() ... 背景色やテキストなどの色を再設定
generateBtn.addEventListener("click", randomColors);

//各スライダーのinputにイベントを登録
sliders.forEach(slider => {
  // console.log(slider); // 全ての<input >

  slider.addEventListener("input", hslControls);
});

// スライダーの色を変更した時に、h2タグのテキスト色とボタンの色を変更する
colorDivs.forEach((div, index) => {
  div.addEventListener("change", () => {

    updateTextUi(index);
  })
});

// h2のタイトルをクリック
currentHexes.forEach(hex => {
  hex.addEventListener("click", () => {

    copyToClipboard(hex);
  })
})

// ポップアップコンテナが表示されたら
popup.addEventListener("transitionend", function(e){
  // console.log(e)
  const popupBox = popup.children[0]; // 白ボックス

  popup.classList.remove("active");
  popupBox.classList.remove("active");
})

// 調整ボタン クリックしたらinputタグを入れているスライダーを表示
adjustButton.forEach((button, index) => {

  button.addEventListener("click", () => {
    openAdjustmentPanel(index);
  })
});

// パネルの✖️ボタン
closeAdjustButton.forEach((button, index) => {

  button.addEventListener("click", () => {
    closeAdjustmentPanel(index)
  })
})


// Functions 
// ランダムに色を生成する関数。「#B518E2」などを生成
function generateHex(){
  const letters = "0123456789ABCDEF"; // ※letters ... 文字の意味
  let hash = "#";

  for(let i = 0; i < 6; i++){
    // Math.floor()  ... 小数点切り捨て
    // Math.random() ... 0以上〜1未満の範囲で乱数を生成。
    // Math.random() * 16 とすることで、0〜15までの数値がランダムで生成される。
    // hash += letters[1]; // #111111

    // lettersの中からランダムに文字列を取得して#以下を選択
    hash += letters[Math.floor(Math.random() * 16)];
  }

  return hash;

  // chroma.jsだと2行だけで色を生成できる
  // console.log(chroma)
  // const hexColor = chroma.random();
  // return hexColor;
}


// 各colorの背景色、テキスト色、スライダー(Hue、Saturation、Lightness)の色を動的に決めていく
function randomColors(){
  // 色の初期値を初期化
  initialColors = [];

  colorDivs.forEach((div, index) => {
    // console.log(div);
    const randomColor = generateHex(); // ランダムにHex形式の色を生成 #4D5D05 
    const hexText = div.children[0]; // <h2></h2>

    // div(colorが)がlockedクラスを持っていたら
    if(div.classList.contains("locked")){
      initialColors.push(hexText.innerText);

      return;
    } else {
      // 最初はこの処理が走る

      // chromaオブジェクトを生成し、Hex形式で色を格納
      initialColors.push(chroma(randomColor).hex());
      // console.log(initialColors); //  ['#DFD4D3', '#447E90', '#4B43D7', '#323E33', '#C41273']
    
      // div.classList.add("locked");
    }

    // backgroundに色を付与
    div.style.backgroundColor = randomColor;
    // h2のテキストの名前を変更
    hexText.innerText = randomColor;

    // 背景色の明るさが0.5以上なら、テキストを黒に
    checkTextContrast(randomColor, hexText);

    // chroma() ... chromaオブジェクトを生成。メソッドなどがありこれにいろいろ操作を加えることができる。
    const color = chroma(randomColor);
    // console.log(color); // g {_rgb: Array(4)}

    // sliderのinput[type="range"]を取得
    const sliders = div.querySelectorAll(".sliders input");
    // console.log(sliders); // NodeList(3) [input.hue-input, input.bright-input, input.sat-input]

    // 色相、輝度、彩度 を取得
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];

    // スライダーのinputの背景色を決める
    colorizeSliders(color, hue, brightness, saturation);
  })

  // inputの中をリセット
  resetInputs();

  // 
  adjustButton.forEach((button, index) => {
    // console.log(button)
    // console.log(lockButton[index])
    
    // 背景色とテキストのコントラストを比べて、調整ボタンのテキスト色を変更
    checkTextContrast(initialColors[index], button);
    // ロックボタンの色もコントラストと比べて変更
    checkTextContrast(initialColors[index], lockButton[index])
  })
}


// 背景色の濃度(コントラスト)によりテキストの色を黒か白にする
function checkTextContrast(color, text){
  // 色の明るさを取得する。 0(黒)から1(白)の範囲で値を取得
  // 注意 : 色の濃さではなくてあくまでも明るさを算出する
  const luminance = chroma(color).luminance();
  // console.log(luminance); // 0.08631909952132394  0.33765538208293244

  // 背景色の明るさが0.5以上ならテキスト色を黒にする
  if(luminance >= .5){
    text.style.color = "black";
  } else {
    text.style.color = "white";
  }
}

// スライダーのinputの背景色
function colorizeSliders(color, hue, brightness, saturation){ 
  // console.log(color); // chromaオブジェクトが渡ってくる。
  
  // 彩度
  const noSat = color.set("hsl.s", 0); // colorの hsl.s(彩度) が「0」の状態を取得。
  const fullSat = color.set("hsl.s", 1); // 彩度が1の状態の色を生成
  
  // chroma.scale ... 彩度のスケールを取得する関数を生成。0〜1で取得
  // これはグラデーションで彩度を表す。
  // 第1引数は引数は鮮度が低い色、第2引数は対象とする色、第２引数は鮮度が最も高い色
  const scaleSat = chroma.scale([noSat, color, fullSat]); 

  // 彩度のinput[type="range"]の背景色
  saturation.style.backgroundImage = `
    linear-gradient(to right, ${scaleSat(0)}, ${scaleSat(1)})
  `;

  // 輝度 ... 低ければ黒、高ければ白になる
  const midBright = color.set("hsl.l", 0.5); // 輝度の中間を取得
  // console.log(midBright);
  const scaleBright = chroma.scale(["black", midBright, "white"]); // 輝度を取得する関数
  // console.log(scaleBright)

  brightness.style.backgroundImage = `
  linear-gradient(to right, ${scaleBright(0)}, ${scaleBright(.5)}, ${scaleBright(1)})
  `;

  // 色相(色)
  hue.style.backgroundImage = `
    linear-gradient(to right, rgb(204, 204, 75), rgb(204, 75, 204), rgb(75, 204, 75), rgb(204, 75, 75) )
  `;
}

// スライダーのinputにイベント登録
function hslControls(e) {
  // console.log(e);
  // console.log(e.target); // target : input.hue-input
  
  // inputのカスタム属性を取得して、どれかのその番号を取得
  const index = 
    e.target.getAttribute("data-hue") ||
    e.target.getAttribute("data-bright") ||
    e.target.getAttribute("data-sat");
  // console.log(index); 0 1 2 3 4

  // colorひとつの中のinput(3つ)を取得
  const sliders = e.target.parentElement.querySelectorAll("input[type='range']");
  // console.log(sliders); // NodeList(3) [input.hue-input, input.bright-input, input.sat-input]

  const hue = sliders[0];         // <input type="range"...>
  const brightness = sliders[1];  // <input type="range"...>
  const saturation = sliders[2];  // <input type="range"...>
  // console.log(hue, brightness, saturation);
  // console.log(saturation.value);

  // colorの背景色。Hexで取得できる
  const bgColor = initialColors[index];
  // console.log(bgColor); // #869FF0

  // bgColorに対して、hueなどの値を取得してcolorに格納してchromaオブジェクトを生成
  let color = chroma(bgColor)
    .set("hsl.s", saturation.value) // hsl.sにsaturation.valueを設定
    .set("hsl.l", brightness.value)
    .set("hsl.h", hue.value)
  
    // console.log(color); // _rgb : (4) [64, 155, 191, 1, _clipped: false, _unclipped: Array(4)]

  // Hue、Saturation、Brightnessを動的に適用
  colorDivs[index].style.backgroundColor = color;

  // スライダーのinputの背景色
  colorizeSliders(color, hue, brightness, saturation);
}

// スライダーのinputを変更した時、テキスト色も変更させる
function updateTextUi(index){
  const activeDiv = colorDivs[index];

  // colorDivの背景色を取得
  const color = chroma(activeDiv.style.backgroundColor);
  // console.log(color); // _rgb : (4) [118, 209, 209, 1, _clipped: false, _unclipped: Array(4)]

  const textHex = activeDiv.querySelector("h2");
  const icons   = activeDiv.querySelectorAll(".controls button");
  // console.log(icons)

  // テキストの色を変更
  textHex.innerText = color.hex()

  // コントラストに合わせてテキストの色を白 / 黒　に変更
  checkTextContrast(color, textHex);

  // ボタンの色もコントラストによって変更
  for(const icon of icons){
    // console.log(icon)
    checkTextContrast(color, icon);
  }

}

// input属性の中のvalue属性の値を設定
function resetInputs(){
  // 全てのinput取得 
  const sliders = document.querySelectorAll(".sliders input");
  // console.log(sliders); // NodeList(15) [input.hue-input, input.bright-input, input.sat-input, ... ]

  // console.log(initialColors); // (5) ['#2626ba', '#71859d', '#e7b151', '#788852', '#4f822b']

  sliders.forEach(slider => {
    // console.log(slider); // <input type="range" name="hue" ...>

    // Hue(色相)
    if(slider.name === "hue"){
      // グローバルに設定した初期色からdata-hueの番号(ここでは0)の色を取得する
      const hueColor = initialColors[slider.getAttribute("data-hue")]
      // console.log(hueColor); // #2626ba, #71859d, #e7b151, #788852, #4f822b

      // Hueを取得
      const hueValue = chroma(hueColor).hsl()[0]; // 0番目がhue
      // console.log(chroma(hueColor).hsl())
      // console.log(hueValue); // 268.59060402684565 ... ... ... ... 

      // 
      slider.value = Math.floor(hueValue);
      // console.log(slider.value);
    }

    // Brightness(輝度)
    if(slider.name === "brightness"){
      const brightColor = initialColors[slider.getAttribute("data-bright")]
      const brightValue = chroma(brightColor).hsl()[2]; // 配列の2番目がbrightness
      // console.log(brightValue); // 0.6546184738955823 ... ... ... ... 

      // 100倍にして四捨五入して、11や22の形にしてから、100で割ることで、0.11、0.22の形にして格納する
      slider.value = Math.floor(brightValue * 100) / 100;
      // console.log(slider.value);  // 0.84 0.65 ... ... ...
    }

    // Saturation(彩度)
    if(slider.name === "saturation"){
      const satColor = initialColors[slider.getAttribute("data-sat")];
      const satValue = chroma(satColor).hsl()[1]; // 配列の１番目がsaturation
      // console.log(satValue); // 0.41960784313725485 ... ... ... ...

      slider.value = Math.floor(satValue * 100) / 100;
      // console.log(slider.value)
    }

  })
}


// h2のテキストをクリック h2のテキスト(Hex)をクリップボードにコピーする
function copyToClipboard(hex){
  // console.log(hex); // <h2 style="color: white;">#B32DB1</h2>

  // textarea要素を生成している理由
  // textareaはテキストの選択とコピーが比較的簡単に行える要素であるため
  // textareaは、通常、ユーザーがテキストエリア内のテキストを選択できるようになっており、
  // JavaScriptでselect()を呼び出すことでそのテキストを選択することが可能。
  // そして、選択されたテキストはdocument.execCommand("copy")を使ってクリップボードにコピーすることができるru
  const el = document.createElement("textarea");
  el.value = hex.innerText;
  // console.log(el.value); // #194DBA

  document.body.appendChild(el);

  el.select();  // textareaの中のテキストを選択
  document.execCommand("copy");// 選択したテキストをコピーする

  document.body.removeChild(el); // 不必要なので消す

  const popupBox = popup.children[0];
  // console.log(popupBox); // <div class="copy-popup">...</div>

  popup.classList.add("active"); // ポップアップコンテナ
  popupBox.classList.add("active"); // 白いコンテナ
}


// 調整ボタンを押したら、パネルを表示
function openAdjustmentPanel(index){

  slidersContainer[index].classList.add("active")
}

// inputを入れているスライダーを閉じる
function closeAdjustmentPanel(index){
  slidersContainer[index].classList.remove("active");
}





/**************************************************************
ローカルストレージに色を格納する処理
***************************************************************/
const saveBtn    = document.querySelector(".save"); // パネルのボタンのsave
const submitSave = document.querySelector(".submit-save"); // saveボタン
const closeSave  = document.querySelector(".close-save");
const saveContainer = document.querySelector(".save-container");
const saveInput  = document.querySelector(".save-container input");
const libraryContainer = document.querySelector(".library-container");
const libraryBtn = document.querySelector(".library"); // ライブラリのボタン
const closeLibraryBtn = document.querySelector(".close-library"); // ライブラリの✖️ボタンbotann

// Event Listener
saveBtn.addEventListener("click", openPalette);
closeSave.addEventListener("click", closePalette);
submitSave.addEventListener("click", savePalette);
libraryBtn.addEventListener("click", openLibrary);
closeLibraryBtn.addEventListener("click", closeLibrary);


// Functions
// ローカルストレージに保存する関数
function saveToLocal(paletteObj){
  let localPalettes;

  if(localStorage.getItem("palettes") === null){
    // 初めてのアクセス ... 初期化
    localPalettes = [];
  } else {
    // palettesオブジェクトの配列を取得。この中に命名した色を突っ込んでいく
    localPalettes = JSON.parse(localStorage.getItem("palettes"));
  }

  // 一度配列に格納してローカルストレージに「palettes」として格納
  localPalettes.push(paletteObj);
  localStorage.setItem("palettes", JSON.stringify(localPalettes));
}

// ライブライをオープン
function openLibrary(){
  const popup = libraryContainer.children[0];

  libraryContainer.classList.add("active");
  popup.classList.add("active");
}

// ライブラリをクローズ
function closeLibrary(){
  const popup = libraryContainer.children[0];

  libraryContainer.classList.remove("active");
  popup.classList.remove("active");
}


function openPalette(e){
  const popup = saveContainer.children[0];

  saveContainer.classList.add("active");
  popup.classList.add("active")
}

function closePalette(e){
  const popup = saveContainer.children[0];

  saveContainer.classList.remove("active");
  popup.classList.remove("active");
}

// ローカルストレージから保存されているpaletteを取得
function getLocal(){
  if(localStorage.getItem("palettes") === null) {
    // 何もなければ空で初期化
    localStorage = [];
  } else {
    // localStorageの内容を配列で取得
    const palettesObjects = JSON.parse(localStorage.getItem("palettes"));
    // console.log(palettesObjects); // (3) [{…}, {…}, {…} ]

    palettesObjects.forEach(paletteObj => {
      // カスタムパレットを生成
      const palette = document.createElement("div");
      palette.classList.add("custom-palette");

      const title = document.createElement("h4");
      title.innerText = paletteObj.name;

      const preview = document.createElement("div");
      preview.classList.add("small-preview");
      
      // 保存しているパレットを展開して、previewの中に色を格納していく
      paletteObj.colors.forEach(smallColor => {
        const smallDiv = document.createElement("div");
        smallDiv.style.backgroundColor = smallColor;

        preview.appendChild(smallDiv);
      })

      // パレットボタン生成
      const paletteBtn = document.createElement("button");
      paletteBtn.classList.add("pick-palette-btn");
      paletteBtn.classList.add(paletteObj.nr);
      paletteBtn.innerText = "Select";

      // パレットボタン(Select)のクリック処理
      paletteBtn.addEventListener("click", (e) => {
        closeLibrary();

        // クリックしたpaletteのインデックスを付与し取得
        const paletteIndex = e.target.classList[1];
        // console.log(paletteIndex)

        // 保存している色をメイン画面に表示させる
        // paletteObj...{name, colors, nr: paletteNr}としてsavedPalettesに格納している色をforEachで展開していinitialColorsに格納
        initialColors = [];
        savedPalettes[paletteIndex].colors.forEach((color, index) => {
          console.log(color)
          // 初期の色に格納
          initialColors.push(color);
          colorDivs[index].style.backgroundColor = color;

          const text = colorDivs[index].children[0];
          
          // 背景色とテキストのコントラスト調整
          checkTextContrast(color, text);

          // テキストの変更
          updateTextUi(index);
        });

        // input属性の中のvalue属性の値を設定
        resetInputs();
      });

      palette.appendChild(title);
      palette.appendChild(preview);
      palette.appendChild(paletteBtn);
      libraryContainer.children[0].appendChild(palette); // popupにpaletteを格納
    });

  }
}


// パレットを保存する関数
function savePalette(e){
  const popup = saveContainer.children[0];
  saveContainer.classList.remove(".active");
  popup.classList.remove(".active");

  const name = saveInput.value; // inputの値を取得
  const colors = [];

  currentHexes.forEach(hex => { // currentHexes...h2タグのテキスト
    colors.push(hex.innerHTML);
  });

  // ローカルストレージに保存するオブジェクトを生成
  let paletteNr = savedPalettes.length; // ローカルストレージに保存したオブジェクトの個数
  const paletteObj = {
    name: name,
    colors: colors,
    nr: paletteNr,
  }

  // 配列に保存
  savedPalettes.push(paletteObj);

  // ここでローカルストレージに保存
  saveToLocal(paletteObj);
  saveInput.value = "";

  // console.log(paletteObj);


  // カスタムパレットを生成
  const palette = document.createElement("div");
  palette.classList.add("custom-palette");

  const title = document.createElement("h4");
  title.innerText = paletteObj.name;

  const preview = document.createElement("div");
  preview.classList.add("small-preview");
  
  // 保存しているパレットを展開して、previewの中に色を格納していく
  paletteObj.colors.forEach(smallColor => {
    const smallDiv = document.createElement("div");
    smallDiv.style.backgroundColor = smallColor;

    preview.appendChild(smallDiv);
  })

  // パレットボタン生成
  const paletteBtn = document.createElement("button");
  paletteBtn.classList.add("pick-palette-btn");
  paletteBtn.classList.add(paletteObj.nr);
  paletteBtn.innerText = "Select";

  // パレットボタン(Select)のクリック処理
  paletteBtn.addEventListener("click", (e) => {
    closeLibrary();

    // クリックしたpaletteのインデックスを付与し取得
    const paletteIndex = e.target.classList[1];
    // console.log(paletteIndex)

    // 保存している色をメイン画面に表示させる
    // paletteObj...{name, colors, nr: paletteNr}としてsavedPalettesに格納している色をforEachで展開していinitialColorsに格納
    initialColors = [];
    savedPalettes[paletteIndex].colors.forEach((color, index) => {
      console.log(color)
      // 初期の色に格納
      initialColors.push(color);
      colorDivs[index].style.backgroundColor = color;

      const text = colorDivs[index].children[0];
      
      // 背景色とテキストのコントラスト調整
      checkTextContrast(color, text);

      // テキストの変更
      updateTextUi(index);
    });

    // input属性の中のvalue属性の値を設定
    resetInputs();

    // パネルのinputを変更も反映される
    // libraryInputUpdate();
    
  })

  palette.appendChild(title);
  palette.appendChild(preview);
  palette.appendChild(paletteBtn);
  libraryContainer.children[0].appendChild(palette); // popupにpaletteを格納

  // console.log(libraryContainer)

}

randomColors();
getLocal();




// ※ localStorageをクリア
const clearLocalStorageBtn = document.getElementById("js-clearLocalBtn");
clearLocalStorageBtn.addEventListener("click", clearLocalStorage);

function clearLocalStorage(){
  localStorage.clear();
  window.location.reload();
}
// clearLocalStorage()