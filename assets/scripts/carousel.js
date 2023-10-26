"use strict";

(function() {
  class Button {
    constructor(node) {
      this.node = node;
      this.init = function(self) {
        function signal(e) {
          self.node.dispatchEvent(new CustomEvent('move:slider', { bubbles: true, detail: { index: self.node.classList.contains('prevSlide') ? -1 : 1, buttonClick: true }}));
        }
        self.node.addEventListener('click', signal);
      }(this);
    }

  }

  class Carousel {
    constructor(node) {
      this.node = node;
      this.slider = node.querySelector('.slider');
      this.sliderIsActive = false;
      this.timing = Number(node.style.getPropertyValue('--carousel-timing')) || 1000;
      this.delay = Number(node.style.getPropertyValue('--carousel-delay')) || 4000;
      this.index = 0;
      this.slides = node.querySelectorAll('.slide');
      this.timer = setInterval(() => {
        this.node.dispatchEvent(new CustomEvent('move:slider', { detail: { index: 1}}));
      }, this.delay);

      this.buttons = function() {
        let allButtonNodes = node.querySelectorAll('.prevSlide, .nextSlide');
        let allButtons = [];
        allButtonNodes.forEach(button => allButtons.push(new Button(button)));
        return allButtons;
      }.bind(this)();

      this.init = function() {
        this.node.addEventListener('move:slider', this.moveSlider.bind(this));
        
      }.bind(this)();
    }

    timer() {
      const callback = () => {
        console.warn("callback")
        ;
      };

      let interval = setInterval(callback, this.delay + this.timing);

      return {
        reset: function() {
          if (interval) {
            console.log("resetting")
            clearInterval(interval);
            setTimeout(() => {
              interval = setInterval(callback, this.delay);
            }, this.timing);
          }
        }.bind(this),
      };
    }

    resetTimer() {
      clearInterval(this.timer);

      setTimeout(() => {
        this.timer = setInterval(() => {
          this.node.dispatchEvent(new CustomEvent('move:slider', { detail: { index: 1}}));
        }, this.delay);
      }, this.timing);
    }

    moveSlider(e) {
      if (this.sliderIsActive) return;
      if (e.detail.buttonClick) this.resetTimer();
      this.sliderIsActive = true;
      const placeSlider = (i, variableIndex = i) => this.slides[i].style.setProperty('--slide-index', variableIndex); 
      let indexLast = this.slides.length - 1;
      let index = this.index + e.detail.index;
      if (index === indexLast) placeSlider(indexLast);
      if (index === 0) placeSlider(0);
      if (index > indexLast) {
        placeSlider(0, indexLast + 1);
        this.slider.style.transform = `translateX(${-100 * index}%)`; 
        setTimeout(() => {
          this.node.classList.add('noTransition');
          this.slider.style.transform = 'translateX(0%)';
          placeSlider(0);
          this.node.offsetHeight;
          this.node.classList.remove('noTransition');
          placeSlider(indexLast, -1);

          this.sliderIsActive = false;
        }, this.timing);
        
        this.index = 0;
        return;
      };
      
      if (index < 0) {
        placeSlider(indexLast, -1);
        this.slider.style.transform = `translateX(${-100 * index}%)`;
        setTimeout(() => {
          this.node.classList.add('noTransition');
          this.slider.style.transform = `translateX(${-100 * indexLast}%)`;
          placeSlider(indexLast);
          this.node.offsetHeight;
          this.node.classList.remove('noTransition');
          placeSlider(0, indexLast + 1);
          
          this.sliderIsActive = false;
        }, this.timing);

        this.index = indexLast;

        return;
      }

      this.slider.style.transform = `translateX(${-100 * index}%)`; 
      setTimeout(() => {
        this.index = index;
        this.sliderIsActive = false;
      }, this.timing);
    }
  }

  const indexCarousel = new Carousel(document.querySelector("#CaseCarousel"));
})();