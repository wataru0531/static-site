
// skewしている状態からもとに戻す処理

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
      splitTypeTypes: 'words', // この場合は単語のみで
    });
    
    this.scroll();
  }

  scroll() {
    const words = this.splitter.getWords();
    // console.log(words)

    gsap.fromTo(words, 
    {
      opacity: 0,
      skewX: -20,
      filter: 'blur(8px)',
      willChange: 'filter, transform',
    }, 
    {
      ease: 'sine', 
      opacity: 1,
      skewX: 0,
      filter: 'blur(0px)',
      stagger: 0.04, 
      scrollTrigger: {
        trigger: this.textElement, 
        start: 'top bottom-=15%',
        end: 'bottom center+=15%', 
        scrub: true, 
      },
    });
  }
}
