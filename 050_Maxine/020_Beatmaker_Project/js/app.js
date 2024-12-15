/**************************************************************

Todo Project
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




class DrumKit {
  constructor (){
    this.pads = document.querySelectorAll(".pad");
    this.playBtn = document.querySelector(".play");

    this.currentKick = "/sounds/kick-classic.wav";
    this.currentSnare = "/sounds/snare-acoustic01.wav";
    this.currentHihat = "/sounds/hihat-acoustic01.wav";

    this.kickAudio = document.querySelector(".kick-sound");
    this.snareAudio = document.querySelector(".snare-sound");
    this.hihatAudio = document.querySelector(".hihat-sound");

    this.index = 0;
    this.bpm   = 200; // 再生の速さ
    this.isPlaying = null; // 

    this.selects = document.querySelectorAll("select"); // selectタグ
    this.muteBtns = document.querySelectorAll(".mute");  // ミュートボタン
    this.tempoSlider = document.querySelector(".temp-slider"); // input[type="range"]
  }

  // パッド１つの色を変化させる
  activePad(){
    this.classList.toggle("active");
  }
  
  repeat(){
    // % 剰余演算子 ... ここではthis.indexを8で割った時の余りを返す。0〜8までの数値を返す。.
    let step = this.index % 8;
    // console.log(step);

    // Kick、Snare、Hihatのバーを番号で取得
    const activeBars = document.querySelectorAll(`.b${step}`);
    // console.log(activeBars); // NodeList(3) [div.pad.kick-pad.b5, div.pad.snare-pad.b5, div.pad.hihat-pad.b5]

    // バーにアニメーションを付与
    activeBars.forEach(bar => {
      // alternate ... animation-direction。初回は初回は順再生、2回目以降は回目以降は逆再生。
      bar.style.animation = `playTrack .3s alternate ease-in-out 2`;

      // クリックしたバーの動き。
      // activeのクラスを持っている時は、音を鳴らす
      if(bar.classList.contains("active")){
        // Kick-pad の時
        if(bar.classList.contains("kick-pad")){
          // console.dir(this.kickAudio);
          
          // 再生位置を常に0にして再生する。
          // currentTime ... 動画のどの位置を再生しているかを取得する。
          // 仮に10秒の動画があるとして、currentTimeを5だと設定すると、5秒後から再生される。
          this.kickAudio.currentTime = 0;
          
          this.kickAudio.play();
        }

        // Snare の時
        if(bar.classList.contains("snare-pad")){
          this.snareAudio.currentTime = 0;
          this.snareAudio.play();
        }

        // Hihat の時
        if(bar.classList.contains("hihat-pad")){
          this.hihatAudio.currentTime = 0;
          this.hihatAudio.play();
        }
      }
    })

    this.index++;
  }

  start(){
    // インターバルを生成
    const interval = (60 / this.bpm) * 1000;

    // setIntervalを呼ぶと、その実行感覚に基づいて一意のidが返される。一般的には数値が返される。
    // 2回以上スタートをクリックしてもsetIntervalが実行されないように設定
    if(this.isPlaying){ // 2回以上クリックした場合は停止

      clearInterval(this.isPlaying);

      // 再び実行できるように設定
      this.isPlaying = null;
    } else {
       // 初回クリック以降の処理。
      this.isPlaying = setInterval(() => { 
        // console.log(this); // DrumKit {...} 

        this.repeat();
      }, interval);
    }
  }

  // スタートボタンのテキストを変更
  updateBtn(){
    if(!this.isPlaying){
      // 初回クリック時の挙動
      this.playBtn.innerText = "STOP";
      this.playBtn.classList.add("active");
    } else {
      // 2回目以降
      this.playBtn.innerText = "PLAY";
      this.playBtn.classList.remove("active");
    }
  }

  // selectタグの項目を選択したら発火
  changeSound(e){
    // console.log(e);
    const selectionName = e.target.name;
    const selectionValue = e.target.value; // 
    // console.log(selectionName); // kick-select selectタグのname属性
    // console.log(selectionValue); // /sounds/kick-classic.wav

    // 選択肢によって音を変更させる
    switch (selectionName) {
      case "kick-select":
        this.kickAudio.src = selectionValue;

        break; // breakは省略可能だが、省略したら次のcaseも評価されてしまう。
      case "snare-select":
        this.snareAudio.src = selectionValue;
        break;
      case "hihat-select":
        this.hihatAudio.src = selectionValue;
        break;
    }
  }

  // ミュート処理
  mute(e){
    // console.log(e.target); // <button data-track="0" class="mute kick-volume">Kick Btn</button>

    // インデックスを取得
    const muteIndex = e.target.getAttribute("data-track");
    // console.log(muteIndex); // 0, 1, 2

    e.target.classList.toggle("active");

    // ミュートのインデックスによってミュートにする音源を切り替える
    if(e.target.classList.contains("active")){
      switch(muteIndex){
        case "0":
          this.kickAudio.volume = 0;
          break;
        case "1":
          this.snareAudio.volume = 0;
          break;
        case "2":
          this.hihatAudio.volume = 0;
          break;
      }
    } else {
      switch(muteIndex){
        case "0":
          this.kickAudio.volume = 1;
          break;
        case "1":
          this.snareAudio.volume = 1;
          break;
        case "2":
          this.hihatAudio.volume = 1;
          break;
      }
    }
  }

  // テンポスライダーのテキスト更新
  changeTempo(e){
    // console.log(e); // Event{type: "input", ...}

    const tempoText = document.querySelector(".tempo-nr");
    tempoText.innerText = e.target.value;

  }

  // 音楽の速度を更新
  // 一度ストップしてからではないと発火しない...
  // 一度setIntervalが発火しているためにthis.bpmを変更することができないため、再びsetIntervalを再設定する必要がある。
  updateTempo(e){
    // console.log(e); // Event{type: "change", ...}
    this.bpm = e.target.value; // 先に変更しておく

    // 一度ストップさせることでthis.bpmを更新可能となる
    clearInterval(this.isPlaying);
    this.isPlaying = null;

    // playBtnにactiveがついていたら即スタートさせる。 
    const playBtn = document.querySelector(".play");
    if(playBtn.classList.contains("active")){
      this.start();
    }
  }
}

const drumKit = new DrumKit();
// console.log(drumKit)

// Event Listeners↓
// バーをクリックした時の挙動
drumKit.pads.forEach(pad => {
  // console.log(this); // undefined

  // 色を変化させる
  pad.addEventListener("click", drumKit.activePad);

  // animationが終わったら、animationを取り除く
  pad.addEventListener("animationend", function(){
    // console.log(this); // アロー関数だとundefinedになるので注意

    this.style.animation = "";
  })

})

// スタートボタン 
drumKit.playBtn.addEventListener("click", () => {
  // スタートボタンのテキストを変更
  drumKit.updateBtn();

  //
  drumKit.start()
})


// selectボタンの項目によって音を変更する
drumKit.selects.forEach(select => {
  // console.log(select); // 3つのselectタグを取得 <select>...</select>

  // 項目を選んだら発火
  select.addEventListener("change", function(e){
    // console.log("hello");

    drumKit.changeSound(e);
  })
})

// ミュートボタンの処理
drumKit.muteBtns.forEach(btn => {

  btn.addEventListener("click", (e) => {
    drumKit.mute(e);
  });
});


// テンポスライダー(inputの変更)
drumKit.tempoSlider.addEventListener("input", function(e){
  // input要素を変更したら変更を検知して発火しつづける
  // console.log(e); // Event{...}

  drumKit.changeTempo(e);
})

// テンポスライダー(速さの変更)
drumKit.tempoSlider.addEventListener("change", function(e){
  // console.log(e); // Event{...}

  drumKit.updateTempo(e);
})