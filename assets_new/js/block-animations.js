// Block entrance animations via IntersectionObserver
(function () {

  var blocks = {
    'block-1': [
      { sel: '.hero-label',   delay: 0   },
      { sel: '.hero-uaii',    delay: 120 },
      { sel: '.hero-line1',   delay: 260 },
      { sel: '.hero-line2',   delay: 380 },
    ],
    'block-2': [
      { sel: '.b2f-prep:nth-child(1)',    delay: 0   },
      { sel: '.b2f-word:nth-child(2)',    delay: 120 },
      { sel: '.b2f-prep:nth-child(3)',    delay: 260 },
      { sel: '.b2f-word:nth-child(4)',    delay: 380 },
      { sel: '.b2f-statement',            delay: 480 },
      { sel: '.ui-line',                  delay: 580, stagger: 120 },
      { sel: '.b2f-bottom',               delay: 820 },
    ],
    'block-3': [
      { sel: '.block-label',           delay: 0   },
      { sel: '.cell:nth-child(1)',     delay: 140 },
      { sel: '.cell:nth-child(2)',     delay: 260 },
      { sel: '.cell:nth-child(3)',     delay: 380 },
    ],
  };

  function resetBlock(blockEl) {
    var id = blockEl.id;
    var defs = blocks[id];
    if (!defs) return;
    defs.forEach(function (def) {
      blockEl.querySelectorAll(def.sel).forEach(function (el) {
        el.classList.remove('anim-in');
      });
    });
  }

  function animateBlock(blockEl) {
    var id = blockEl.id;
    var defs = blocks[id];
    if (!defs) return;
    defs.forEach(function (def) {
      var els = blockEl.querySelectorAll(def.sel);
      var stagger = def.stagger || 0;
      els.forEach(function (el, i) {
        setTimeout(function () {
          el.classList.add('anim-in');
        }, def.delay + i * stagger);
      });
    });
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateBlock(entry.target);
      } else {
        resetBlock(entry.target);
      }
    });
  }, { threshold: 0.3 });

  Object.keys(blocks).forEach(function (id) {
    var el = document.getElementById(id);
    if (el) observer.observe(el);
  });

  // Block 1 fires immediately on load
  var block1 = document.getElementById('block-1');
  if (block1) {
    setTimeout(function () { animateBlock(block1); }, 100);
  }

})();
