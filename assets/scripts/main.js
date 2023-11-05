'use strict';
// Menu handler
(function() {
  const menuButton = document.querySelector('#MenuButton');

  document.body.addEventListener('click', function(event) {
    const inactiveMenu = !document.body.classList.contains('activeMenu');
    if (event.target === menuButton) {
      if (inactiveMenu) {
        document.body.classList.add('activeMenu');
      } else {
        document.body.classList.remove('activeMenu');
      }
    } else {
      if (!!event.target.closest('#Navigation')) return;
      if (!!event.target.closest('#Menu') == false && !inactiveMenu) document.body.classList.remove('activeMenu');
    }
  });
})();

// Heading observer
(function() {
  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!entry.target.classList.contains('animated')) {
          entry.target.classList.add('animated');
        }
      }
    });
  };

  let observer = new IntersectionObserver(observerCallback, {
    rootMargin: '0px',
    threshold: 1.0,
  });

  let relevantHeadings = document.querySelectorAll('.heading.animateMe, .tinyHeading.animateMe');
  relevantHeadings.forEach(heading => observer.observe(heading));
})();

// Top navigation 
(function() {
  const topNavigation = document.querySelector('#Navigation');
  let scrollAmount = 0;
  let hasScrolled = false;
  
  const handleScroll = (e) => {
    if (scrollAmount >= 1) {
      if (hasScrolled) {
        window.removeEventListener('scroll', handleScroll);
      } else {
        topNavigation.classList.add('animateMe');
        hasScrolled = true;
      }
      return;
    }

    scrollAmount++;
  }

  window.addEventListener('scroll', handleScroll);
})();

// Contact modal
(function() {
  const contactModal = document.querySelector('.contactModal');
  const toggleModalButtons = document.querySelectorAll('.toggleContactModal');

  contactModal.addEventListener('click', (e) => e.target == contactModal ? document.body.classList.remove('activeContactModal') : null)

  toggleModalButtons.forEach(btn => {
    btn.addEventListener('click', () => document.body.classList.toggle('activeContactModal'));
  });
})();