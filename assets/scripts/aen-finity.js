/*
  # Attributes
  # timing {integer} (optional) --- in milliseconds
  # pause-on {string} (optional) --- possible string values: all, click, hover
*/

class AenCarouselCore extends HTMLElement {
  constructor() {
    super();

    // Queries for relevant items
    this.queries = {
      item: '.aen-item',
      wrapper: '.aen-wrapper',
    }

    this.settings = {
      timing: this.getTiming,
    }
  }

  get getPauseOn() {
    let returnObject = {
      hover: false,
      click: false,
    };

    let pauseAttribute = this.hasAttribute('pause-on') && this.getAttribute('pause-on') || undefined;

    if (pauseAttribute) {
      if (pauseAttribute.includes('all') || pauseAttribute.includes('hover')) returnObject.hover = true;
      if (pauseAttribute.includes('all') || pauseAttribute.includes('click')) returnObject.click = true;
    }

    return returnObject;
  }

  get getTiming() {
    let timing = 30000; // the default timing

    // Gives to option to overwrite the default timing
    if (this.hasAttribute('timing')) {
      let parsedTimingAttribute = parseInt(this.getAttribute('timing'));

      // Only change the timing, if the attribute contains an integer
      if (!isNaN(parsedTimingAttribute)) timing = parsedTimingAttribute;
    }
    return timing;
  }

  // Find relevant all nodes
  get getNodes() {
    let returnObject = {};

    for (const query in this.queries) {
      let queryNodes = this.querySelectorAll(this.queries[query]);
      
      if (queryNodes.length > 0) {
        returnObject[query + 's'] = Array.from(queryNodes);
      }
    }

    return returnObject;
  }

  sendEvent(eventName) {
    const EVENT_OBJECT = {
      detail: {
        emitter: this,
      },
    };

    return new CustomEvent(this.nodeName.toLowerCase() + ':' + eventName, EVENT_OBJECT);
  }

  set setState(s) {
    this.state = s;
    this.setAttribute('state', s);
    document.body.dispatchEvent(this.sendEvent(s));
  }

  init() {
    this.nodes = this.getNodes;
  }
}

class AenFinityFrames extends AenCarouselCore {
  constructor() {
    super();
    this.currentAnimation;
    this.timeToReset = false;
    
    this.time = {
      start: undefined,
      previous: 0,
      elapsed: 0,
    }
  }

  get getTransformDirection() {
    let direction;

    // A full switch is used, to have an easy overview over the different extenstion types
    switch(this.nodeName) {
      case 'AEN-FINITY-START':
        direction = '-'
        break;
      case 'AEN-FINITY-END':
        direction = ''
        break;
    }

    return direction;
  }

  pauseAnimation() {
    if (this.state === 'paused') return;

    this.setState = 'paused';
    cancelAnimationFrame(this.currentAnimation);
  }
  
  startAnimation() {
    if (this.state === 'running') return;

    // In order to continue to transform from the current position, we need to adjust the start time, based on time spent in the last loop
    this.time.start = document.timeline.currentTime - this.time.elapsed;
    
    this.setState = 'running';
    this.currentAnimation = window.requestAnimationFrame(this.animationFrames.bind(this));
  }

  restartAnimation(timeStamp) {
    // Start from the last known timeStamp
    this.time.start = timeStamp;

    // Reset values
    this.time.previous = 0;
    this.time.elapsed = this.settings.timing;
    this.nodes.wrapper.style.transform = `translateX(0px)`;
    this.timeToReset = false;

    // Start new loop
    this.currentAnimation = window.requestAnimationFrame(this.animationFrames.bind(this));
  }

  animationFrames(timeStamp) {
    // First time, starting the animation loop
    if (this.time.start === undefined) {
      this.time.start = timeStamp;
    }

    // Time since the last requestAnimationFrame()
    const ELAPSED_TIME = timeStamp - this.time.start; // milliseconds
    this.time.elapsed = ELAPSED_TIME;

    if (this.time.previous !== timeStamp) {
      // Math.min() makes sure that we don't transform too much
      const TRANSFORM_AMOUNT = Math.min(this.animation.perMS * ELAPSED_TIME, this.animation.totalTransformAmount);
      
      this.nodes.wrapper.style.transform = `translateX(${ this.animation.direction }${ TRANSFORM_AMOUNT }px)`;

      // Set variable, so we can handle the reseting, in another if-statement
      if (TRANSFORM_AMOUNT === this.animation.totalTransformAmount) this.timeToReset = true;
    }
    
    // Continue current loop
    if (ELAPSED_TIME < this.settings.timing) {
      this.time.previous = timeStamp;

      if (!this.timeToReset) {
        this.currentAnimation = window.requestAnimationFrame(this.animationFrames.bind(this));
      }
    }

    // Start new loop
    if (this.timeToReset) {
      this.restartAnimation(timeStamp);
    }
  }

  bindPauseEvents() {
    if (this.getPauseOn.hover) {
      this.addEventListener('mouseenter', () => {
         this.pauseAnimation();
      });

      this.addEventListener('mouseleave', () => {
        this.startAnimation();
      });
    }

    if (this.getPauseOn.click) {
      this.addEventListener('click', () => {
        if (this.state === 'paused') {
          this.startAnimation();
          return;
        }

        this.pauseAnimation();
      });
    }
  }

  pickAndBuildContent() {
    this.nodes.wrapper = this.nodes.wrappers[0];
    this.nodes.items = this.nodes.wrapper.querySelectorAll(this.queries.item);
    
    let fragmentForItems = new DocumentFragment();
    let itemMultiplier = 1;
    
    const WRAPPER_WIDTH = this.nodes.wrapper.getBoundingClientRect().width,
          THIS_WIDTH = this.getBoundingClientRect().width;
    
    // Check if we need more items, to have a wide enough wrapper
    if (THIS_WIDTH > WRAPPER_WIDTH) {
      itemMultiplier = Math.ceil(THIS_WIDTH / WRAPPER_WIDTH);
    }

    itemMultiplier *= 2;

    // Adding the right amount of items
    for (let i = 0; i < itemMultiplier; i++) {
      this.nodes.items.forEach(item => fragmentForItems.appendChild(item.cloneNode(true)));
    }

    let newItemsBundle = document.createElement('div');
    newItemsBundle.appendChild(fragmentForItems);

    this.nodes.wrapper.innerHTML = newItemsBundle.innerHTML;
  }

  postBuildData() {
    const TOTAL_TRANSFORM_AMOUNT = this.nodes.wrapper.getBoundingClientRect().width / 2;

    this.animation = {
      totalTransformAmount: TOTAL_TRANSFORM_AMOUNT,
      perMS: TOTAL_TRANSFORM_AMOUNT / this.settings.timing,
      direction: this.getTransformDirection,
    }
  }

  connectedCallback() {
    // Building the core functionality
    this.init();
    this.pickAndBuildContent();
    this.postBuildData();
    this.setState = 'running';

    // Bind events
    this.bindPauseEvents();
    
    // Start animation
    this.currentAnimation = window.requestAnimationFrame(this.animationFrames.bind(this));
  }
}

/*
  WHAT: new customElements extending the parent, is used to decide on the direction
  WHY: so we don't need to use any attribute to do the same

  NOTE: we don't seem to need construtor(), since the parent has called it.
*/
class AenFinityStart extends AenFinityFrames {}
class AenFinityEnd extends AenFinityFrames {}

customElements.define('aen-finity-start', AenFinityStart);
customElements.define('aen-finity-end', AenFinityEnd);


/* Uses CSS keyframes instead of requestAnimationFrames */
class AenFinityAnimate extends AenCarouselCore {
  constructor() {
    super();
  }

  get getAnimationObject() {
    let wrapperComputedStyling = window.getComputedStyle(this.nodes.wrappers[0]);
    
    return {
      name: wrapperComputedStyling.getPropertyValue('animation-name'),
      timing: wrapperComputedStyling.getPropertyValue('animation-timing-function'),
      duration: parseInt(wrapperComputedStyling.getPropertyValue('animation-duration')),
    }
  }

  set adjustedCSSAnimation(animationObject) {
    if (this.widths.wrapper > this.widths.thisElement) return;

    const WIDTH_PERCENTAGE_DIFFERENCE = this.widths.wrapper / this.widths.thisElement * 100,
          ADJUSTED_TIMING = animationObject.duration / WIDTH_PERCENTAGE_DIFFERENCE * 100;

    this.nodes.wrappers.forEach(wrapper => wrapper.style.animation = animationObject.name + ' ' + animationObject.timing + ' ' + ADJUSTED_TIMING + 's infinite');
  }

  pickAndBuildContent() {
    this.nodes.wrapper = this.nodes.wrappers[0];
    this.nodes.items = this.nodes.wrapper.querySelectorAll(this.queries.item);
    this.widths = {
      thisElement: this.getBoundingClientRect().width,
      wrapper: this.nodes.wrapper.getBoundingClientRect().width,
    }

    let fragmentForItems = new DocumentFragment();
    let itemMultiplier = 1;

    if (this.widths.thisElement > this.widths.wrapper) {
      itemMultiplier = Math.ceil(this.widths.thisElement / this.widths.wrapper);
    }

    for (let i = 0; i < itemMultiplier; i++) {
      this.nodes.items.forEach(item => fragmentForItems.appendChild(item.cloneNode(true)));
    }

    let currentWrapperClone = this.nodes.wrapper.cloneNode();
    currentWrapperClone.appendChild(fragmentForItems.cloneNode(true));

    let newWrappersBundle = document.createElement('div');

    // Using 2 wrappers to make a smooth animation
    for (let i = 0; i < 2; i++) {
      newWrappersBundle.appendChild(currentWrapperClone.cloneNode(true));
    }

    this.innerHTML = newWrappersBundle.innerHTML;

    // Rebind first new wrapper
    this.nodes.wrappers = this.querySelectorAll(this.queries.wrapper);
  }

  connectedCallback() {
    // Building the core functionality
    this.init();
    this.pickAndBuildContent();
    this.adjustedCSSAnimation = this.getAnimationObject;

    this.setState = 'running';
  }
}

customElements.define('aen-finity-animate', AenFinityAnimate);