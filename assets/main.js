'use strict';

// Heading observer
(function() {
  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!entry.target.classList.contains('animateMe')) {
          entry.target.classList.add('animateMe');
        }
      }
    });
  };

  let observer = new IntersectionObserver(observerCallback, {
    rootMargin: '0px',
    threshold: 1.0,
  });

  let relevantHeadings = document.querySelectorAll('.heading');
  relevantHeadings.forEach(heading => observer.observe(heading));
})();