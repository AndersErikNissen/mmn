(function() {
  class Button {
    constructor(node) {
      this.node = node;
      this.init = function(self) {
        function signal(e) {
          self.node.dispatchEvent(new CustomEvent('move:slider', { bubbles: true, detail: { index: self.node.classList.contains('prevSlide') ? -1 : 1 }}));
        }
        self.node.addEventListener('click', signal);
      }(this);
    }

  }

  class Carousel {
    constructor(node) {
      this.node = node;
      this.slider = node.querySelector('.slider');
      this.multiplier = -100;
      this.index = 0;
      this.slides = node.querySelectorAll('.slide');
      this.lastIndex = this.slides.length - 1;

      this.buttons = function() {
        let allButtonNodes = node.querySelectorAll('.prevSlide, .nextSlide');
        let allButtons = [];
        allButtonNodes.forEach(button => allButtons.push(new Button(button)));
        return allButtons;
      }.bind(this)();

    }
    init() {
      this.node.addEventListener('move:slider', this.slideEvent.bind(this));
      this.boundrySlide(this.index);
    };

    boundrySlide(i) {
      if (i === 0) {
        this.slides[this.lastIndex].style.transform = 'translateX(-100%)';
      }
      
      if (i === this.lastIndex) {
        this.slides[0].style.transform = 'translateX(-' + (this.lastIndex * 100) + ')';
      }
    }

    slideEvent(e) {
      let nextIndex = this.index + e.detail.index;
      let lastSlideTransform = this.lastIndex * this.multiplier;
      
      this.slider.style.transform = 'translateX(' + (this.multiplier * nextIndex) + '%)';
      
      console.warn("SlideEvent",nextIndex, this.multiplier, this.slider)
      if (nextIndex === 0) this.slides[this.lastIndex].style.transform = 'translateX(-100%)';
      if (nextIndex === this.lastIndex) this.slides[0].style.transform = 'translateX(-' + lastSlideTransform + ')';
      
      if (nextIndex === -1) {
        setTimeout(() => {
          this.node.classList.add('noTransition');
          console.log("first>last", (this.lastIndex * (this.multiplier * -1)), (this.lastIndex * this.multiplier))
          
          nextIndex = this.lastIndex;

          this.slides[this.lastIndex].style.transform = 'translateX(' + (this.lastIndex * (this.multiplier * -1)) + '%)';
          this.slider.style.transform = 'translateX(' + (this.lastIndex * this.multiplier) + '%)';
        },1000);
        
        setTimeout(() => {
          this.node.classList.remove('noTransition');
        }, 1010)
      }
      
      this.index = nextIndex;
    }

    /*
      init()
        - add event listeners
      
      handler()
      - based on event move left or right
      - handle index
        - current index
        - next index - based on next/prev

      first -> last()
      - move last
      - normal transition -> no transition to reflect "other -> last" after
      other()
      - move left or right
      last -> first()
    
    */

    slideLeft() {
      console.log("Slide left");

      let index = this.index - 1;
      let lastSlide = this.slides[this.slides.length - 1];
      if (index === 0) {
        lastSlide.style.transform = `translateX(-${this.multiplier}%)`;
      }
      this.slider.transform = `translateX(-${index * this.multiplier})`;

      this.index = index;
    }
    
    slideRight() {
      console.log("Slide right");
      
      let index = this.index + 1;
      let firstSlide = this.slides[0];
      if (index === this.slides.length - 1) {
        firstSlide.style.transform = `translateX(${this.multiplier * this.slides.length})`;
      }
      
      this.slider.transform = `translateX(${-index * this.multiplier})`;
      this.index = index;
    }
  }

  const indexCarousel = new Carousel(document.querySelector("#CaseCarousel"));
  indexCarousel.init();
  console.log(indexCarousel)
})();