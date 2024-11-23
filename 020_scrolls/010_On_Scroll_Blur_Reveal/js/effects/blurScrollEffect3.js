
// 文字がぼやけてy軸に圧縮している状態から、通常の状態に戻す処理

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

    gsap.fromTo(chars, {
      scaleY: 0.1,
      scaleX: 1.8,
      filter: 'blur(10px) brightness(50%)',
      willChange: 'filter, transform'
    }, {
        ease: 'none', 
        scaleY: 1,
        scaleX: 1,
        filter: 'blur(0px) brightness(100%)',
        stagger: 0.05,
        
        scrollTrigger: {
          trigger: this.textElement,
          start: 'top bottom-=15%', 
          end: 'bottom center+=15%',
          scrub: true, 
        },
    });
  }
}
