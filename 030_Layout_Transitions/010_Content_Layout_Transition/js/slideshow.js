

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
		this.DOM.stackItems.forEach((stackItem, position) => { // .stack__item
			stackItem.addEventListener('click', () => {
				this.open(stackItem); 
			});
		});

		this.DOM.backCtrl.addEventListener('click', () => {
			this.close();
		});

		this.DOM.navArrows.next.addEventListener('click', () => {
			this.navigate('next');
		});
		this.DOM.navArrows.prev.addEventListener('click', () => {
			this.navigate('prev');
		});

		const scrollFn = () => {
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

		this.scrollObserver.disable(); // この時点では向こうにしておく
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
		$.body.classList.add('oh');
		this.DOM.content.classList.add('content--open');
		// console.log(this.contentItems[this.current]); // ContentItem {DOM: {…}}
		this.contentItems[this.current].DOM.el.classList.add('content__item--current'); // 左下タイトル
		this.DOM.stackItems[this.current].classList.add('stack__item--current');

		// 左下タイトルのopacityの状態のみを対象に保持しておく
		// → その後のアニメーションで使われ、スムーズなトランジション(位置や透明度などの変化)を実現するための基準となる
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
				this.isOpen = true;
				this.isAnimating = false;
			},
			// スクロール位置をスクロール量とする
			onStart: () => document.documentElement.scrollTop = document.body.scrollTop = scrollY,
			absoluteOnLeave: true,
			// → 要素がアニメーション中に親要素から**絶対座標に基づいた位置（absolute positioning）**に切り替わります。
			// 　これにより、要素がアニメーション中に DOM の影響を受けず、スムーズに目的の位置にアニメーションすることができます。
		})
		.to(this.DOM.mainTitleTexts, { // 右下のタイトル
			// ここからはFlip.fromの影響は受けない
			duration: .9,
			ease: 'expo',
			yPercent: -101
		}, 0) // タイムラインの先頭からの時間(秒)で開始。ここではFlip.fromの発火と同時に実行される
		.to(this.contentItems[this.current].DOM.texts, { // 左下のタイトル
			duration: 1,
			ease: 'expo',
			startAt: {yPercent: 101},
			yPercent: 0
		}, 0)
		.to(this.DOM.backCtrl, { // backボタン
			duration: 1,
			ease: 'expo',
			startAt: { opacity: 0 }, // opacityが意図しない値に設定されている場合でも、確実にアニメーションの開始時点を明示的に0にリセットしておく
			opacity: 1
		}, 0)
		.to([this.DOM.navArrows.prev, this.DOM.navArrows.next], {
			duration: 1,
			ease: 'expo',
			startAt: {
				opacity: 0,
				y: pos => pos ? -150 : 150
			},
			y: 0,
			opacity: pos => this.current === 0 && !pos || this.current === this.totalItems-1 && pos ? 0 : 1
		}, 0);

	}
	
	close() {

		if ( this.isAnimating || !this.isOpen ) {
			return;
		}
		this.isAnimating = true;

		this.scrollObserver.disable();

		this.DOM.stackItems[this.current].classList.remove('stack__item--current');

		$.body.classList.remove('oh');
		
		const state = Flip.getState(this.DOM.stackItems, {props: 'opacity'});
		this.DOM.stackWrap.appendChild(this.DOM.el);

		gsap.set(this.DOM.el, {
			y: 0
		});

		
		Flip.from(state, {
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
		})
		.to(this.DOM.mainTitleTexts, {
			duration: .9,
			ease: 'expo',
			startAt: {yPercent: 101},
			yPercent: 0
		}, 0)
		.to(this.contentItems[this.current].DOM.texts, {
			duration: 1,
			ease: 'expo',
			yPercent: -101
		}, 0)
		.to(this.DOM.backCtrl, {
			duration: 1,
			ease: 'expo',
			opacity: 0
		}, 0)
		.to([this.DOM.navArrows.prev, this.DOM.navArrows.next], {
			duration: 1,
			ease: 'expo',
			y: pos => pos ? 100 : -100,
			opacity: 0
		}, 0);
	}
	
	navigate(direction) {
		if ( this.isAnimating || (direction === 'next' && this.current === this.totalItems-1) || (direction === 'prev' && this.current === 0) ) return;
		this.isAnimating = true;

		const previousCurrent = this.current;
		const currentItem = this.DOM.stackItems[previousCurrent];
		this.current = direction === 'next' ? this.current+1 : this.current-1
		const upcomingItem = this.DOM.stackItems[this.current];
		
		currentItem.classList.remove('stack__item--current');
		upcomingItem.classList.add('stack__item--current');

		gsap.set(this.DOM.navArrows.prev, {opacity: this.current > 0 ? 1 : 0});
		gsap.set(this.DOM.navArrows.next, {opacity: this.current < this.totalItems-1 ? 1 : 0});
		
		gsap.timeline()
		.to(this.DOM.el, {
			duration: 1,
			ease: 'expo',
			y: direction === 'next' ? `-=${windowsize.height/2 + windowsize.height*.02}` : `+=${windowsize.height/2 + windowsize.height*.02}`,
			onComplete: () => {
				this.isAnimating = false;
			}
		})
		.to(this.contentItems[previousCurrent].DOM.texts, {
			duration: .2,
			ease: 'power1',
			yPercent: direction === 'next' ? 101 : -101,
			onComplete: () => this.contentItems[previousCurrent].DOM.el.classList.remove('content__item--current')
		}, 0)
		.to(this.contentItems[this.current].DOM.texts, {
			duration: .9,
			ease: 'expo',
			startAt: {yPercent: direction === 'next' ? -101 : 101},
			onStart: () => this.contentItems[this.current].DOM.el.classList.add('content__item--current'),
			yPercent: 0
		}, .2)
	}
}