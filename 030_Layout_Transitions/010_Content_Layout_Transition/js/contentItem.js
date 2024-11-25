


export class ContentItem {
	DOM = {
		el: null,
		title: null,
		description: null,
		texts: null
	}

	constructor(DOM_el) { // .content__item
		this.DOM.el = DOM_el;
		// console.log(this.DOM.el);  .content__itemタグ
		this.DOM.title = this.DOM.el.querySelector('.content__item-title');
		this.DOM.description = this.DOM.el.querySelector('.content__item-description');
		this.DOM.texts = [...this.DOM.el.querySelectorAll('.oh > .oh__inner')];
	}
}