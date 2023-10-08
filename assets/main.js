'use strict';

// Set CSS variables
(function() {
  const root = document.documentElement;
  const pairs = [
    { name: '--move-content', value: '-' + document.querySelector('#Menu').getBoundingClientRect().width + 'px' },
  ]
  
  pairs.forEach(pair => root.style.setProperty(pair.name, pair.value));
})();

const toggleTransitions = () => {
  if (!document.body.classList.contains('activeTransitions')) document.body.classList.add('activeTransitions');
};

const classListMatch = (element, classList) => classList.some(clss => element.classList.contains(clss));

// Menu handler
(function() {
  const activators = ['openMenu'];
  const deactivators = ['closeMenu'];
  
  document.body.addEventListener('click', function(event) {
    toggleTransitions();
    const inactiveMenu = !document.body.classList.contains('activeMenu');

    switch(true) {
      case classListMatch(event.target, deactivators):
        if (!inactiveMenu) document.body.classList.remove('activeMenu');

      case !!event.target.closest('#Menu'):
      case event.target.id == 'Menu':
        break;

      case classListMatch(event.target, activators):
        if (inactiveMenu) document.body.classList.add('activeMenu')
        break;

      default: 
        if (!inactiveMenu) document.body.classList.remove('activeMenu');
    }
  });
})();