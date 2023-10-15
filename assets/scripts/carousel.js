(function() {
  class Slide {
    constructor(node) {
      this.node = node;
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

  class Carousel {
    constructor(node) {
      this.node = node;
      this.slides = this.getSlides;
    }

    get getSlides() {
      let allSlideNodes = this.node.querySelectorAll('.slide');
      let allSlides = [];
      allSlideNodes.forEach(slide => allSlides.push(new Slide(slide)));

      return allSlides;
    }
  }

  const indexCarousel = new Carousel(document.querySelector("#CaseCarousel"));
  console.log(indexCarousel)
})();