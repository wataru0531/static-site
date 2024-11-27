

import { ContentItem } from './contentItem';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
gsap.registerPlugin(Flip);
import { Observer } from 'gsap/Observer';
gsap.registerPlugin(Observer);

let timerId = null;

const $ = {}; // DOM
$.body = document.body;


let windowsize = { width: window.innerWidth, height: window.innerHeight };

// リサイズ
window.addEventListener('resize', () => {
	windowsize = { width: window.innerWidth, height: window.innerHeight };

	clearTimeout(timerId);
	timerId = setTimeout(() => {
		// console.log("resize done!!");
		windowsize = { width: window.innerWidth, height: window.innerHeight };
	}, 500);
});

// 
export class Slideshow {
	// DOMを格納
	DOM = { // this.DOM
		el: null,
		stackItems: null,
		stackWrap: document.querySelector('.stack-wrap'), // アイテムの初期位置
		slides: document.querySelector('.slides'),        // アイテムクリック時にアイテムを格納させるラッパー
		content: document.querySelector('.content'),
		contentItems: [...document.querySelectorAll('.content__item')], // 左下のタイトル
		mainTitleTexts: [...document.querySelectorAll('.title > .oh > .oh__inner')], // 右下のタイトル
		backCtrl: document.querySelector('.content__back'), // backボタン
		nav: document.querySelector('.content__nav-wrap'), // 上下の矢印2つを格納
		navArrows: {
			prev: document.querySelector('.content__nav--prev'),
			next: document.querySelector('.content__nav--next'),
		}
	}

	contentItems = []; // ContentItemを格納していく
	isOpen = false;
	current = -1;
	totalItems = 0;
	gap = getComputedStyle(document.documentElement).getPropertyValue('--slide-gap'); // 2vh
	// document.documentElement → ルート要素のhtml

	constructor(DOM_el) { // .stack → アイテム達を格納している要素
		// console.log(DOM_el); 
		this.DOM.el = DOM_el;
		
		this.DOM.stackItems = [...this.DOM.el.querySelectorAll('.stack__item:not(.stack__item--empty)')];
		this.totalItems = this.DOM.stackItems.length;
		this.DOM.contentItems.forEach(item => this.contentItems.push(new ContentItem(item)));
		// console.log(this.DOM.contentItems); // (10) [div.content__item, div.content__item, ... ]
		
		this.initEvents(); 
	}
	
	// 初期化処理
	initEvents() {
		// 画像クリック
		this.DOM.stackItems.forEach((stackItem, position) => { // .stack__item
			stackItem.addEventListener('pointerdown', () => {
				this.open(stackItem); 
			});
		});

		// backボタン
		this.DOM.backCtrl.addEventListener('pointerdown', () => {
			this.close();
		});

		// 上下矢印
		this.DOM.navArrows.next.addEventListener('pointerdown', () => {
			this.navigate('next');
		});
		this.DOM.navArrows.prev.addEventListener('pointerdown', () => {
			this.navigate('prev');
		});

		// 上下にスクロールした際に発火 → デフォルトの状態に戻す
		const scrollFn = () => {
			// 右サイドに.stackがある状態、アニメーションが終わっている状態
			if ( this.isOpen && !this.isAnimating ) {
				this.close();
				this.scrollObserver.disable();
			}
		}

		// Observer → 特定のユーザーの操作(scroll, wheel, touch, pointer)を検出し、それに応じてカスタムの処理を実行することを可能にする
		this.scrollObserver = Observer.create({
			type: 'wheel, touch, pointer', // ホイール、タッチ、ポインターを監視
			wheelSpeed: -1,   // ホイールスクロール速度を反転
			onDown: scrollFn, // 下方向のスクロール時に実行する関数
			onUp: scrollFn,   // 上方向のスクロール時に実行する関数
			tolerance: 10,    // スクロールの感度(ピクセル単位)。イベントがトリガーされるために必要な移動距離の最小値
			preventDefault: true, // デフォルトのスクロール動作を無効化
			                      // → ここではscroll, wheel, pointerができなくなる
		});

		this.scrollObserver.disable(); // この時点では監視を無効にしておく
	}
	
	// 左サイドのスライドを生成、
	open(_stackItem) {
		if ( this.isAnimating || this.isOpen ) return; // アニメーション中、isOpenがtrueなら処理中断
		this.isAnimating = true;

		// console.log(this.DOM.stackItems.indexOf(_stackItem));
		this.current = this.DOM.stackItems.indexOf(_stackItem); // クリックしたアイテムのindexを取得。0 から 9
		this.scrollObserver.enable(); // Observerの動作をオン。監視開始
		// → Observerが入力イベントを監視し、登録されたコールバック(onDown, onUp)が実行可能となる

		const scrollY = window.scrollY;
		// $.body.classList.add('oh');
		this.DOM.content.classList.add('content--open');
		// console.log(this.contentItems[this.current]); // ContentItem {DOM: {…}}
		this.contentItems[this.current].DOM.el.classList.add('content__item--current'); // 左下タイトル
		this.DOM.stackItems[this.current].classList.add('stack__item--current');

		// this.DOM.stackItemsの状態をキャプチャしておく
		// → DOM構造や位置の変化も含めた要素全体の状態を内部でキャプチャする
		// Flip.from
		// → 要素が親要素の移動や再配置などで変化した場合、元の位置(キャプチャ時の状態)と新しい位置の差異を自動的に補完(なめらかな遷移)
		// { props: 'opacity' }
		// → opacityの状態をしっかり保持しつつ補間する指示を出しているだけ
		//	 Flip.fromはDOMの物理的な変化を検知して動きをなめらかに保管してくれるので、他のプロパティに関しても別に指定しなくても
		//   アニメーションの範囲に含めることができる
		const state = Flip.getState(this.DOM.stackItems, { props: 'opacity' });
		this.DOM.slides.appendChild(this.DOM.el); // .slidesに.stackを格納

		// クリック後の.stackの要素の上端から画像中央までの距離を取得
		// offset → 親要素からの距離を取得する
		// _stackItem.offsetHeight ... クリック後のがぞの高さ。
		// console.log(_stackItem.offsetTop);
		// console.log(_stackItem.offsetHeight/2);
		const itemCenter = _stackItem.offsetTop + ( _stackItem.offsetHeight / 2); 
		// console.log(itemCenter); 
		
		document.documentElement.scrollTop = document.body.scrollTop = 0; // スクロール位置をリセット
		// document.documentElement.scrollTop → ルート要素(<html>)のスクロール位置を制御
		// document.body.scrollTop 　　 　　　　→ <body>のスクロール位置を制御

		// .stackを現在currentの画像が中心になるように動かす
		gsap.set(this.DOM.el, { // .stack
			y: (windowsize.height / 2) - itemCenter + scrollY
		});		
		
		document.documentElement.scrollTop = document.body.scrollTop = 0;

		// Flipで透明度(opacity)の変化をスムーズに制御している。
		// → CSSでdurationの設定はしていない。ここでopacityの遷移をなめらかにしている。
		Flip.from(state, { // opacityのみを対象とする
			duration: 1,
			ease: 'expo',
			onComplete: () => {
				// console.log("complete!!");

				this.isOpen = true;
				this.isAnimating = false;
			},
			// スクロール位置をスクロール量とする
			onStart: () => document.documentElement.scrollTop = document.body.scrollTop = scrollY,
			absoluteOnLeave: true,
			// → 要素がアニメーション中に親要素から**絶対座標に基づいた位置（absolute positioning）**に切り替わります。
			// 　これにより、要素がアニメーション中に DOM の影響を受けず、スムーズに目的の位置にアニメーションすることができます。
		})
		.to(this.DOM.mainTitleTexts, { // 右下のタイトルをあげる
			// ここからはFlip.fromの影響は受けない
			duration: .9,
			ease: 'expo',
			yPercent: -101
		}, 0) // タイムラインの先頭からの時間(秒)で開始。ここではFlip.fromの発火と同時に実行される
		.to(this.contentItems[this.current].DOM.texts, { // 左下のタイトル .oh > .oh__inner
			duration: 1,
			ease: 'expo',
			// yPercentが意図しない値に設定されている場合でも、確実にアニメーションの開始時点を明示的に0にリセットしておく
			startAt: { yPercent: 101 }, // このブロックが発火してから下げて、y軸を0%にする。→ close()した時に-101の位置にある場合があるので
			yPercent: 0
		}, 0)
		.to(this.DOM.backCtrl, { // backボタン
			duration: 1,
			ease: 'expo',
			startAt: { opacity: 0 }, 
			opacity: 1
		}, 0)
		.to([this.DOM.navArrows.prev, this.DOM.navArrows.next], {
			duration: 1,
			ease: 'expo',
			startAt: {
				opacity: 0,
				y: (idx) => {
					// console.log(idx); // navArrowのインデックス
					return idx ? -150 : 150 
				},
			},
			y: 0,
			// 最初の画像でidxが0の時 or 最後の画像でidexが1なら → opacityは0のまま
			opacity: idx => this.current === 0 && !idx || this.current === this.totalItems-1 && idx ? 0 : 1
		}, 0);
	}
	
	// backボタンクリック(閉じる処理)
	close() {
		if (this.isAnimating || !this.isOpen) return;
		this.isAnimating = true;

		this.scrollObserver.disable();

		this.DOM.stackItems[this.current].classList.remove('stack__item--current');

		$.body.classList.remove('oh');
		
		// 
		const state = Flip.getState(this.DOM.stackItems, { props: 'opacity' });
		this.DOM.stackWrap.appendChild(this.DOM.el); // this.DOM.el → .stack

		gsap.set(this.DOM.el, { y: 0 });
		
		Flip.from(state, {
			// onStart: () => console.log("Flip"),
			duration: 1,
			ease: 'expo',
			onComplete: () => {
				this.DOM.content.classList.remove('content--open');
				this.contentItems[this.current].DOM.el.classList.remove('content__item--current');

				this.current = -1;
				this.isOpen = false;
				this.isAnimating = false;
			},
			absoluteOnLeave: true
		}, 0)
		.to(this.DOM.mainTitleTexts, { // 右下タイトル
			// onStart: () => console.log("mainTitleTexts"),
			duration: .9,
			ease: 'expo',
			startAt: { yPercent: 101 },
			yPercent: 0
		}, 0) // タイムラインの先頭から
		.to(this.contentItems[this.current].DOM.texts, { // 左下タイトル
			// onStart: () => console.log("stcontentItemsart"),
			duration: 1,
			ease: 'expo',
			yPercent: -101
		}, 0)
		.to(this.DOM.backCtrl, { // backボタン
			// onStart: () => console.log("backCtrl"),
			duration: 1,
			ease: 'expo',
			opacity: 0
		}, 0)
		.to([this.DOM.navArrows.prev, this.DOM.navArrows.next], { // 上下の矢印
			// onStart: () => console.log("navArrows"),
			duration: 1,
			ease: 'expo',
			y: pos => pos ? 100 : -100,
			opacity: 0
		}, 0);
	}

	// 上下の矢印をクリック時
	navigate(_direction) {
		// アニメーション中は矢印をクリックしても処理を中断させる
		// nextの時で、最後の画像をクリック or prevの時で元の画像をクリック
		if ( this.isAnimating || (_direction === 'next' && this.current === this.totalItems-1) || (_direction === 'prev' && this.current === 0) ) return;
		this.isAnimating = true;

		const previousCurrent = this.current;
		const currentStackItem = this.DOM.stackItems[previousCurrent];
		this.current = _direction === 'next' ? this.current+1 : this.current-1
		const upcomingItem = this.DOM.stackItems[this.current];
		
		currentStackItem.classList.remove('stack__item--current');
		upcomingItem.classList.add('stack__item--current');

		gsap.set(this.DOM.navArrows.prev, {opacity: this.current > 0 ? 1 : 0});
		gsap.set(this.DOM.navArrows.next, {opacity: this.current < this.totalItems-1 ? 1 : 0});
		
		gsap.timeline()
		.to(this.DOM.el, {
			duration: 1,
			ease: 'expo',
			y: _direction === 'next' ? `-=${windowsize.height/2 + windowsize.height*.02}` : `+=${windowsize.height/2 + windowsize.height*.02}`,
			onComplete: () => {
				this.isAnimating = false;
			}
		})
		.to(this.contentItems[previousCurrent].DOM.texts, {
			duration: .2,
			ease: 'power1',
			yPercent: _direction === 'next' ? 101 : -101,
			onComplete: () => this.contentItems[previousCurrent].DOM.el.classList.remove('content__item--current')
		}, 0)
		.to(this.contentItems[this.current].DOM.texts, {
			duration: .9,
			ease: 'expo',
			startAt: {yPercent: _direction === 'next' ? -101 : 101},
			onStart: () => this.contentItems[this.current].DOM.el.classList.add('content__item--current'),
			yPercent: 0
		}, .2)
	}
}