


import { utils } from '/utils';
import { Slideshow } from './slideshow';

const slideshow = new Slideshow(document.querySelector('.stack'));

// Preload images
utils.preloadImages('.stack__item').then( _ => {
  document.body.classList.remove('loading');

});


const gap = getComputedStyle(document.documentElement).getPropertyValue('--slide-gap');
// console.log(gap);
// console.log(document.documentElement);