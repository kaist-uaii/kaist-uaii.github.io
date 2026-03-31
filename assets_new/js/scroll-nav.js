// Scroll navigation with up/down buttons
(function () {
  var scrollEl = document.getElementById('landing');
  if (!scrollEl) return;

  var blockIds = ['block-1', 'block-2'];
  var currentIndex = 0;

  var upBtn = document.getElementById('scroll-up');
  var downBtn = document.getElementById('scroll-down');

  function updateButtons() {
    if (upBtn)   upBtn.style.opacity   = currentIndex === 0 ? '0' : '1';
    if (upBtn)   upBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
    if (downBtn) downBtn.style.opacity = currentIndex === blockIds.length - 1 ? '0' : '1';
    if (downBtn) downBtn.style.pointerEvents = currentIndex === blockIds.length - 1 ? 'none' : 'auto';
  }

  // Track current block via IntersectionObserver
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var idx = blockIds.indexOf(entry.target.id);
        if (idx !== -1) {
          currentIndex = idx;
          updateButtons();
        }
      }
    });
  }, { threshold: 0.5 });

  blockIds.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) observer.observe(el);
  });

  function scrollTo(index) {
    var el = document.getElementById(blockIds[index]);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  if (upBtn) {
    upBtn.addEventListener('click', function (e) {
      e.preventDefault();
      if (currentIndex > 0) scrollTo(currentIndex - 1);
    });
  }

  if (downBtn) {
    downBtn.addEventListener('click', function (e) {
      e.preventDefault();
      if (currentIndex < blockIds.length - 1) scrollTo(currentIndex + 1);
    });
  }

  updateButtons();
})();
