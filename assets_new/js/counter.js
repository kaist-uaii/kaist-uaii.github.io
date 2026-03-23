// CountUp animation - matching FCL source exactly
(function () {
  var countUpEl = document.querySelectorAll('.types-grid');
  if (!countUpEl.length) return;

  var countOptions = {
    enableScrollSpy: false,
    scrollSpyOnce: false,
  };

  var countObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var countUps = entry.target.querySelectorAll('.countup');
        countUps.forEach(function (el) {
          if (!el.dataset.counted) {
            var counter = new countUp.CountUp(el, el.dataset.number, countOptions);
            counter.start();
            el.dataset.counted = 'true';
          }
        });
      }
    });
  });

  countObserver.observe(countUpEl[0]);
})();
