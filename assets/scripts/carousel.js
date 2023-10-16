(function() {
  class Slide {
    constructor(node, index) {
      this.node = node;
      this.placing = (100 * index) + "%"  
      this.height = this.getDimentions.height;
      this.width = this.getDimentions.width;
    }

    get getDimentions() {
      const rect = this.node.getBoundingClientRect();
      return {
        height: rect.height,
        width: rect.width,
      }
    }
  }

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
      this.slideIndex = 0;
      this.slides = function() {
        let allSlideNodes = this.node.querySelectorAll('.slide');
        let allSlides = [];
        allSlideNodes.forEach((slide, index) => allSlides.push(new Slide(slide, index)));
        return allSlides;
      }.bind(this)();
      this.slideAmount = this.slides.length;

      this.buttons = function() {
        let allButtonNodes = this.node.querySelectorAll('.carouselButton');
        let allButtons = [];
        allButtonNodes.forEach((button, index) => {console.log(index,button,"allButton button");allButtons.push(new Button(button, index))});
        return allButtons;
      }.bind(this)();
      
      this.handleSlides = function(carousel) {
        function sliderHandler(e) {
          let newIndex = carousel.slideIndex + e.detail.polar;
          
          if (newIndex == carousel.slideAmount) {
            let slide = carousel.slides[0];
            slide.node.style.transform = `translateX(${(carousel.slideAmount - 1) * 100}%)`;
          } else {
            carousel.slideIndex = newIndex;
            let newSlide = carousel.slides[newIndex];

          }
          carousel.slider.style.transform = `translateX(-${newSlide.placing || (carousel.slideAmount - 1) * 100})`;
        }
  
        carousel.node.addEventListener('carousel:prev', sliderHandler);
        carousel.node.addEventListener('carousel:next', sliderHandler);
      }(this);
    }
  }

  const indexCarousel = new Carousel(document.querySelector("#CaseCarousel"));
  console.log(indexCarousel)
})();