
import { Tooltip } from './tooltip.js';

const triggers = [...document.querySelectorAll('.trigger')];

// navigator.maxTouchPoints → ブラウザがサポートする最大タッチポイント数を返すプロパティ
// 
// console.log(navigator); // Navigator{vendorSub: '', productSub: '20030107', vendor: 'Google Inc.', maxTouchPoints: 0, scheduling: Scheduling, …}
// → ブラウザの情報やユーザーの環境に関する情報を提供するオブジェクト。
//   このオブジェクトを使うと、ブラウザに関するさまざまな情報(例えば、ブラウザの名前、
//   バージョン、プラットフォーム、言語設定など)や、ユーザーのデバイスの情報を取得できる

function isTouchDevice(){
	return 'ontouchstart' in window 
			|| navigator.maxTouchPoints > 0 
			|| navigator.msMaxTouchPoints > 0;
}

const useTouchEvents = isTouchDevice();
// console.log(useTouchEvents);

// タッチデバイスなら、touchイベントを使う 
const startEvent = useTouchEvents ? 'touchstart' : 'pointerenter';
const moveEvent = useTouchEvents ? 'touchmove' : 'pointermove';
const endEvent = useTouchEvents ? 'touchend' : 'pointerleave';

// ツールチップの初期化
const tooltips = triggers.map(trigger => {
    // console.log(trigger.dataset.tooltip); // tooltip-1
    const tooltipEl = document.getElementById(trigger.dataset.tooltip);
    // console.log(tooltipEl); // 各ホバー時に出現するカード

    return tooltipEl ? new Tooltip(tooltipEl) : null;
});

// triggers ... span
triggers.forEach((trigger, idx) => {
	const tooltip = tooltips[idx]; // 各ホバーアニメーションのインスタンス
	// console.log(tooltip); // Tooltip {DOM: {…}, rows: 12, cols: 10, isOpen: false, tl: undefined}

	if (!tooltip) return;

	let showTimeoutId;
	let hideTimeoutId;

	// ホバー時
	trigger.addEventListener(startEvent, event => { // pointerenter
		clearTimeout(hideTimeoutId);

		showTimeoutId = setTimeout(() => {
			// タッチデバイスならデフォルトの挙動を制御
			if(useTouchEvents) event.preventDefault();

			const touchEvent = useTouchEvents ? event.touches[0] : event;
			// console.log(touchEvent); // PointerEvent {isTrusted: true, pointerId: 1, width: 1, height: 1, pressure: 0, …}
			// タッチイベントなら
			// → Touch {identifier: 0, target: span.trigger, screenX: 633.687255859375, screenY: 372.8660583496094, clientX: 262.3776550292969, …}

			if (!tooltip.isOpen) {
					tooltip.updatePosition(touchEvent); // 位置の更新
					tooltip.toggle(trigger.dataset.effect, touchEvent);
			}
		}, 40); 
	});

	trigger.addEventListener(moveEvent, event => {
		if (useTouchEvents) event.preventDefault();
		const touchEvent = useTouchEvents ? event.touches[0] : event;

		if (tooltip.isOpen) {
				tooltip.updatePosition(touchEvent);
		}
	});

	trigger.addEventListener(endEvent, event => {
		clearTimeout(showTimeoutId);
		hideTimeoutId = setTimeout(() => {
			if (tooltip.isOpen) {
					tooltip.toggle(trigger.dataset.effect, event);
			}
		}, 40);
	});
});
