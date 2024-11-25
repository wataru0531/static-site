

import { ContentItem } from './contentItem';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
gsap.registerPlugin(Flip);
import { Observer } from 'gsap/Observer';
gsap.registerPlugin(Observer);


const body = document.body;

let winsize = { width: window.innerWidth, height: window.innerHeight };

window.addEventListener('resize', () => {
	winsize = { width: window.innerWidth, height: window.innerHeight };
});


export class Slideshow {
	// DOMを格納
	DOM = { // this.DOM
		el: null,
		items: null,
		stackWrap: document.querySelector('.stack-wrap'), // アイテムの初期位置
		slides: document.querySelector('.slides'),        // アイテムクリック時にアイテムを格納させるラッパー
		content: document.querySelector('.content'),
		contentItems: [...document.querySelectorAll('.content__item')], // 左下のタイトル
		mainTitleTexts: [...document.querySelectorAll('.title > .oh > .oh__inner')], // 右下のタイトル
		backCtrl: document.querySelector('.content__back'), // backボタン
		nav: document.querySelector('.content__nav-wrap'),
		navArrows: {
			prev: document.querySelector('.content__nav--prev'),
			next: document.querySelector('.content__nav--next'),
		}
	}

	contentItems = []; // ContentItemを格納していく
	isOpen = false;
	current = -1;
	totalItems = 0;
	gap = getComputedStyle(document.documentElement).getPropertyValue('--slide-gap');
	// document.documentElement → ルート要素のhtml

	constructor(DOM_el) { // .stack → .アイテム達を格納している要素
		// console.log(DOM_el); 
		this.DOM.el = DOM_el;
		
		this.DOM.items = [...this.DOM.el.querySelectorAll('.stack__item:not(.stack__item--empty)')];
		this.totalItems = this.DOM.items.length;
		this.DOM.contentItems.forEach(item => this.contentItems.push(new ContentItem(item)));
		console.log(this.DOM.contentItems); // (10) [div.content__item, div.content__item, ... ]
		
		this.initEvents(); 
	}
	
	// 初期化処理
	initEvents() {
		this.DOM.items.forEach((item, position) => {
			item.addEventListener('click', () => {
				this.open(item);
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
		this.scrollObserver = Observer.create({
			type: 'wheel,touch,pointer',
			wheelSpeed: -1,
			onDown: scrollFn,
			onUp: scrollFn,
			tolerance: 10,
			preventDefault: true,
		})
		this.scrollObserver.disable();

	}
	
	open(stackItem) {

		if ( this.isAnimating || this.isOpen ) {
			return;
		}
		this.isAnimating = true;
		this.current = this.DOM.items.indexOf(stackItem);
		this.scrollObserver.enable();
		const scrollY = window.scrollY;
		body.classList.add('oh');
		this.DOM.content.classList.add('content--open');
		
		this.contentItems[this.current].DOM.el.classList.add('content__item--current');
		this.DOM.items[this.current].classList.add('stack__item--current');

		const state = Flip.getState(this.DOM.items, {props: 'opacity'});
		this.DOM.slides.appendChild(this.DOM.el);

		const itemCenter = stackItem.offsetTop + stackItem.offsetHeight/2;
		
		document.documentElement.scrollTop = document.body.scrollTop = 0;

		gsap.set(this.DOM.el, {
			y: winsize.height/2 - itemCenter + scrollY
		});		
		
		document.documentElement.scrollTop = document.body.scrollTop = 0;

		Flip.from(state, {
			duration: 1,
			ease: 'expo',
			onComplete: () => {
				this.isOpen = true;
				this.isAnimating = false;
			},

			onStart: () => document.documentElement.scrollTop = document.body.scrollTop = scrollY,
			absoluteOnLeave: true,
		})
		.to(this.DOM.mainTitleTexts, {
			duration: .9,
			ease: 'expo',
			yPercent: -101
		}, 0)
		.to(this.contentItems[this.current].DOM.texts, {
			duration: 1,
			ease: 'expo',
			startAt: {yPercent: 101},
			yPercent: 0
		}, 0)
		.to(this.DOM.backCtrl, {
			duration: 1,
			ease: 'expo',
			startAt: {opacity: 0},
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

		this.DOM.items[this.current].classList.remove('stack__item--current');

		body.classList.remove('oh');
		
		const state = Flip.getState(this.DOM.items, {props: 'opacity'});
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
		const currentItem = this.DOM.items[previousCurrent];
		this.current = direction === 'next' ? this.current+1 : this.current-1
		const upcomingItem = this.DOM.items[this.current];
		
		currentItem.classList.remove('stack__item--current');
		upcomingItem.classList.add('stack__item--current');

		gsap.set(this.DOM.navArrows.prev, {opacity: this.current > 0 ? 1 : 0});
		gsap.set(this.DOM.navArrows.next, {opacity: this.current < this.totalItems-1 ? 1 : 0});
		
		gsap.timeline()
		.to(this.DOM.el, {
			duration: 1,
			ease: 'expo',
			y: direction === 'next' ? `-=${winsize.height/2 + winsize.height*.02}` : `+=${winsize.height/2 + winsize.height*.02}`,
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