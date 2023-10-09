'use strict';

// Set CSS variables
(function() {
  const root = document.documentElement;
  const pairs = [
    { name: '--move-content', value: '-' + document.querySelector('#Menu').getBoundingClientRect().width + 'px' },
    { name: '--navigation-height', value: document.querySelector('#Navigation').getBoundingClientRect().height + 'px' },
  ]
  
  pairs.forEach(pair => root.style.setProperty(pair.name, pair.value));
})();

const toggleTransitions = () => {
  if (!document.body.classList.contains('activeTransitions')) document.body.classList.add('activeTransitions');
};

const classListMatch = (element, classList) => classList.some(clss => element.classList.contains(clss));

// Menu handler
(function() {
  const menu = document.querySelector('#Menu');
  const menuButton = document.querySelector('#MenuButton');
  
  document.body.addEventListener('click', function(event) {
    toggleTransitions();
    const inactiveMenu = !document.body.classList.contains('activeMenu');
    if (event.target === menuButton) {
      if (inactiveMenu) {
        menu.style.transform = 'translateY(' + window.scrollY + 'px)';
        document.body.classList.add('activeMenu');
      } else {
        document.body.classList.remove('activeMenu');
      }
    } else {
      if (!!event.target.closest('#Menu') == false && !inactiveMenu) document.body.classList.remove('activeMenu');
    }
  });
})();