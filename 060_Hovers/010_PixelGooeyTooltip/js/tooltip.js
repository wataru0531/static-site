
export class Tooltip {
  // クラスのトップに変数を初期化する意図
  // コードの可読性を高めるため。
  // プロパティのデフォルト値を設定して、エラーを防止するため。
  // クラスの構造を明確にし、設計を整理するため。
  // TypeScript 的な型安全性を暗黙的に取り入れるため。
	DOM = {
		el: null, 
		bg: null, 
		content: null,
		contentTitle: null, 
		contentDescription: null,
		cells: null,
	};
	rows;
	cols;
	isOpen = false;
	tl;

  // インスタンス化したときに発火
  constructor(DOM_el) {
      this.DOM.el = DOM_el; // <div id="tooltip-1" class="tooltip" data-rows="12" data-cols="10"></div>
      this.DOM.bg = this.DOM.el.querySelector('.tooltip__bg'); // 背景のブロック。グリッドのセルにつかう
      this.DOM.content = this.DOM.el.querySelector('.tooltip__content');
      this.DOM.contentTitle = this.DOM.content.querySelector('.tooltip__content-title');
      this.DOM.contentDescription = this.DOM.content.querySelector('.tooltip__content-desc');

      this.rows = parseInt(this.DOM.el.dataset.rows, 10) || 4; // 10は10進数
      this.cols = parseInt(this.DOM.el.dataset.cols, 10) || 4;

      this.#layout(); // 各グリッドのセルを生成
  }

  // ホバーした箇所の位置を取得
  calculateTooltipPosition({ clientX, clientY }) {
		// console.log(`x: ${clientX}, y: ${clientY}`) // ビューポートの位置

		const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
		const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
		// console.log(scrollLeft, scrollTop); // 0 0

		const viewportWidth = window.innerWidth; // TODO 外に
		const viewportHeight = window.innerHeight;

		const tooltipWidth = this.DOM.el.offsetWidth;
		const tooltipHeight = this.DOM.el.offsetHeight;
		// console.log(tooltipWidth, tooltipHeight); // 290 330

		let position = { left: clientX + scrollLeft, top: clientY + scrollTop };
		// console.log(position); // ビューポートにおける位置 

		// ツールチップの位置がビューポートの右側からはみ出る時(右サイドに寄りすぎている時)
		if (clientX + tooltipWidth > viewportWidth) {
				position.left = clientX - tooltipWidth + scrollLeft;
		}

		// ツールチップの位置がビューポートの下側からはみ出る時(下サイドに寄りすぎている時)
		if (clientY + tooltipHeight > viewportHeight) {
				position.top = clientY - tooltipHeight + scrollTop;
		}

		if (position.left < scrollLeft) { // 左に寄りすぎている時
				position.left = scrollLeft;
		}

		if (position.top < scrollTop) { // トップに寄りすぎている時
				position.top = scrollTop;
		}

    return position;
  }

  // ツールチップの位置を更新する mousemoveで発火
  updatePosition(event) {
    const position = this.calculateTooltipPosition(event); // ホバーした箇所の位置を取得

    this.DOM.el.style.left = `${position.left}px`;
    this.DOM.el.style.top = `${position.top}px`;
  }

  // セルの分割
  #layout() {
      let strHTML = '';
      
      for (let row = 0; row < this.rows; row++) { // 12
          for (let col = 0; col < this.cols; col++) { // 10
              strHTML += '<div></div>';
          }
      }

      this.DOM.bg.innerHTML = strHTML;
      
      // CSS変数に格納
      this.DOM.el.style.setProperty('--tt-columns', this.cols);
      this.DOM.el.style.setProperty('--tt-rows', this.rows);

      this.DOM.cells =  [...this.DOM.bg.querySelectorAll('div')];
  }

  toggle(effectType, event) {
    // console.log(effectType); // effect1 effect2 effect3 effect4
    // console.log(event); // MouseEvent {isTrusted: true, screenX: 507, screenY: 160, clientX: 481, clientY: 48, …}

    this.isOpen = !this.isOpen; // trueにする
    // # シャープ ... プライベートメソッド。明示しているのではなくて実際に使えない
    this.#animateCells(effectType, event);
  }

  // セルアニメーション
  #animateCells(effectType, event) {
    // console.log(effectType); // effect1 effect2 effect3 effect4
    // console.log(effectType.charAt(0)); // e。文字列の先頭を取得
    // console.log(effectType.slice(1)); // ffect1 ffect2。eが落ちる
    const methodName = `animate${effectType.charAt(0).toUpperCase() + effectType.slice(1)}`;
    // console.log(methodName); // animateEffect1

    if (typeof this[methodName] === 'function') {
        this[methodName](event); // ここで発火。this.animateEffect1(event){}
    } else {
        console.warn(`Animation effect '${effectType}' is not defined.`);
    }
  }

  // 全てのツールチップのエフェクトでデフォルトで設定する
  createDefaultTimeline({ duration = 0.1, ease = 'expo' } = {}) {
    if ( this.tl ) { 
      this.tl.kill(); // 一度タイムライン破棄 → ホバー時に再生成
    }

    return gsap.timeline({
      defaults: { duration, ease },
      onStart: () => {
        if(this.isOpen) { // ホバー時にtrueになっている
          gsap.set(this.DOM.el, { zIndex: 99999 });
          this.DOM.el.classList.add('tooltip--show');
        }
        else {
          gsap.set(this.DOM.el, { zIndex: 0 });
        }
      },
      onComplete: () => {
        if(!this.isOpen) { // 
          this.DOM.el.classList.remove('tooltip--show');
        }
      }
    });
  }

  // コンテンツ部分のアニメーション
  animateTooltipContent() {
    // console.log(this.DOM.contentTitle, this.DOM.contentDescription)
    this.tl.fromTo([this.DOM.contentTitle, this.DOM.contentDescription], 
      {
        opacity: this.isOpen ? 0 : 1
      }, 
      {
        duration: 0.2,
        opacity: this.isOpen ? 1 : 0,
        stagger: this.isOpen ? 0.2 : 0
      }, this.isOpen ? 0.4 : 0)

    .add(() => {
      // ホバー時は、.glitchクラスを適用
      this.DOM.contentTitle.classList[this.isOpen ? 'add' : 'remove']('glitch');
    }, this.isOpen ? 0.8 : 0) // ホバー時は、timelineの先頭から.8。ホバー終了ならすぐに実行でコンテンツを消す
    .add(() => {
      this.DOM.contentDescription.classList[this.isOpen ? 'add' : 'remove']('glitch');
    }, this.isOpen ? 1 : 0)
  }

  // ①左斜め上から出現 → 右斜め下に消える
animateEffect1(event) {
  this.tl = this.createDefaultTimeline();
  
  const mousePosition = { x: event.clientX, y: event.clientY };
  const pageWidth = document.documentElement.scrollWidth;
  const pageHeight = document.documentElement.scrollHeight;
  // console.log(pageWidth, pageHeight); // 1000 1243

  // 対角線の長さを取得
  const maximumDistance = Math.sqrt(pageWidth * pageWidth + pageHeight * pageHeight);
  // console.log(maximumDistance); // 1595.3209708394108

  const maximumDelay = 1.8;

  this.DOM.cells.forEach(cell => {
    const cellRect = cell.getBoundingClientRect();
    const cellPosition = { x: cellRect.left, y: cellRect.top };
    // console.log(cellPosition, mousePosition); // ビューポートにおける座表

    // マウスカーソルの位置から、各セルの左上までの距離を取得
    // pow → べき乗 (例)Math.pow(2, 3)...2 * 2 * 2 のこと。
    const distance = Math.sqrt(Math.pow(cellPosition.x - mousePosition.x, 2) + Math.pow(cellPosition.y - mousePosition.y, 2));
    // console.log(distance);

    // 各セルのアニメーションに対角線上の遅延を設定する
    // カーソルの位置から遠いセルほど遅延が大きくなる
    const delay = (distance / maximumDistance) * maximumDelay;
    // console.log(distance / maximumDistance);
    // console.log(delay);

    if (this.isOpen) {
      this.tl.fromTo(cell, 
        {
          opacity: 0
        },
        {
          opacity: 1,
          delay: delay,
        }, 0);
    } else { // ホバーを外した時の動き。this.isOpenがfalseになるため
      this.tl.to(cell, {
        opacity: 0,
        delay: delay,
      }, 0);
    }
  });

  this.animateTooltipContent();
  }

  // 左上から順に動く。durationなし
  animateEffect2() {
    this.tl = this.createDefaultTimeline();

    if(this.isOpen) {
      this.tl.fromTo(this.DOM.cells, 
      {
        opacity: 0,
        scale: 0
      }, 
      {
        opacity: 1,
        scale: 1,
        // duration: 1, // durationをつけないことでいい感じになる
        stagger: {
          each: 0.02,
          from: 'start'
        }
      }, 0);
    } else {
      this.tl.to(this.DOM.cells, {
        opacity: 0,
        scale: 0,
        stagger: {
            each: 0.02,
            from: 'end'
        }
      }, 0);
    }
    
    this.animateTooltipContent();
  }

  // 
  animateEffect3() {
    this.tl = this.createDefaultTimeline();

    if(this.isOpen) {
      this.tl.fromTo(this.DOM.cells, 
      {
        opacity: 0,
        scale: 0,
        yPercent: () => gsap.utils.random(-200, 200)
      }, 
      {
        opacity: 1,
        scale: 1,
        yPercent: 0,
        stagger: {
          each: 0.03,
          from: 'center', // start end edge random。
          grid: 'auto' // gridであることをgsapに通知
          // → 対象要素が グリッドやフレックスで配置されている場合、GSAPはその構造を解析
          //   グリッド内での各セルの相対位置を元に、指定したstagger.fromに基づいてアニメーション順序を決定
          //   計算の流れ → 対象要素の DOM 順序と、その位置情報（getBoundingClientRect を内部的に使用）を元に、自動的に行と列を割り出す 
          //   明示的にグリッドの列数と行数を指定も可能。例: [列数, 行数]（例: [5, 4]）
        }
      }, 0);
    } else {
      this.tl.to(this.DOM.cells, {
        opacity: 0,
        scale: 0,
        yPercent: () => gsap.utils.random(-200, 200),
        // duration: 2, 
        stagger: {
          each: 0.03,
          from: 'center',
          grid: 'auto'
        }
      }, 0);
    }

    this.animateTooltipContent();
  }

  // 行が1で、カラムのアニメーション
  animateEffect4() {
    this.tl = this.createDefaultTimeline();
    if (this.isOpen) {
      this.tl.fromTo(this.DOM.cells, 
      {
        opacity: 0,
        scaleX: 0.8,
        // ランダムに左右に位置を動かしておく
        xPercent: () => gsap.utils.random(-200, 200)
      }, 
      {
        opacity: 1,
        scaleX: 1,
        xPercent: 0,
        stagger: {
          each: 0.02,
          from: 'random',
          grid: 'auto'
        }
      }, 0);
    }
    else {
      this.tl.to(this.DOM.cells, {
        opacity: 0,
        scaleX: 0.8,
        // x軸にランダムに元に戻す。
        xPercent: () => gsap.utils.random(-200,200),
        stagger: {
          each: 0.02,
          from: 'random',
          grid: 'auto'
        }
      }, 0);
    }

    this.animateTooltipContent();
  }

  // 中央から広がる
  animateEffect5() {
      this.tl = this.createDefaultTimeline();
      if (this.isOpen) {
        this.tl.fromTo(this.DOM.cells, 
        {
          opacity: 0,
          scale: 0
        }, 
        {
          opacity: 1,
          scale: 1,
          stagger: {
            each: 0.02,
            from: 'center',
            grid: 'auto'
          }
        }, 0);
      } else {
        this.tl.to(this.DOM.cells, {
          opacity: 0,
          scale: 0,
          stagger: {
            each: 0.02,
            from: 'edges', // gridのエッジから消しておく
            grid: 'auto'
          }
        }, 0);
      }
      this.animateTooltipContent();
  }

  // 丸みを帯びさせたアニメーション
  animateEffect6() {
    this.DOM.bg.style.filter = 'url(#gooey)';
    // → SVGフィルターエフェクトを適用するための指定
    //   このコードでは、"ゴイフィルター(Gooey Filter)と呼ばれるエフェクトが適用されていて、
    //   要素の境界を滑らかにブレンドして、液体のような効果を与えるも
    this.tl = this.createDefaultTimeline({
      duration: 0.9,
      ease: 'expo'
    });

    if ( this.isOpen ) {
      this.tl.fromTo(this.DOM.cells, 
      {
        opacity: 0,
        scale: 0.3
      }, 
      {
        opacity: 1,
        scale: 1,
        stagger: {
          each: 0.08,
          from: 'random',
          grid: 'auto'
        }
      }, 0);
    }
    else {
      this.tl.to(this.DOM.cells, {
        opacity: 0,
        scale: 0.3,
        stagger: {
            each: 0.04,
            from: 'random',
            grid: 'auto'
        }
      }, 0);
    }

    this.animateTooltipContent();
  }
}