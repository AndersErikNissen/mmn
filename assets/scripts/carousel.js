(function() {
  class Button {
    constructor(node, index) {
      this.node = node;
      this.polar = index % 2;
      this.init = function(self) {
        function signal(e) {
          let direction = self.polar === 0 ? 'prev' : 'next';
          self.node.dispatchEvent(new CustomEvent('carousel:' + direction, { bubbles: true, detail: { polar: direction === 'prev' ? -1 : 1 }}));
        }

        self.node.addEventListener('click', signal);
      }(this);
    }

  }

  class Carousel {
    constructor(node) {
      this.node = node;
      this.slider = node.querySelector('.slider');
      this.multiplier = 100;
      this.index = 0;
      this.slides = node.querySelectorAll('.slide');

      this.buttons = function() {
        let allButtonNodes = node.querySelectorAll('.carouselButton');
        let allButtons = [];
        allButtonNodes.forEach((button, index) => allButtons.push(new Button(button, index)));
        return allButtons;
      }.bind(this)();
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
 
    moveSlider() {
      this.node.addEventListener('carousel:prev', this.slideLeft.bind(this));
      this.node.addEventListener('carousel:next', this.slideRight.bind(this));
    };
  }

  const indexCarousel = new Carousel(document.querySelector("#CaseCarousel"));
  indexCarousel.moveSlider();
  console.log(indexCarousel)
})();