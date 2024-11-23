
// 少しblurがかかり、明るさが30%から、blurがなしで明るさが100%の状態にする

import { TextSplitter } from '../textSplitter.js';

export class BlurScrollEffect {
  constructor(textElement) {
    if (!textElement || !(textElement instanceof HTMLElement)) {
      throw new Error('Invalid text element provided.');
    }

    this.textElement = textElement;
    this.initializeEffect();
  }

  initializeEffect() {
    const textResizeCallback = () => this.scroll();

    this.splitter = new TextSplitter(this.textElement, {
      resizeCallback: textResizeCallback,
      splitTypeTypes: 'words, chars'
    });
    
    this.scroll();
  }

  scroll() {
    const chars = this.splitter.getChars();
    // console.log(chars); // (124) [div.char, div.char, ...]
    // console.log(this.textElement); // <div class="blur-text blur-text--2" data-effect-2></div>

    gsap.fromTo(chars, 
    {
      filter: 'blur(10px) brightness(30%)',
      willChange: 'filter'
    }, 
    {
      ease: 'none', 
      filter: 'blur(0px) brightness(100%)',
      stagger: { each: .05 },
      
      scrollTrigger: {
        trigger: this.textElement, // <div class="blur-text blur-text--2" data-effect-2></div>
        start: 'top bottom-=15%',
        end: 'bottom center+=15%',
        scrub: true, // スクロールとアニメーションの同期
      },
    });
  }
}
