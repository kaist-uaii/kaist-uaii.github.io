// set current year
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

// mobile menu toggle
const toggle = document.querySelector('.nav-toggle');
const menu = document.querySelector('.menu');
if (toggle && menu){
  toggle.addEventListener('click', () => {
    const isOpen = menu.style.display === 'block';
    menu.style.display = isOpen ? 'none' : 'block';
    toggle.setAttribute('aria-expanded', String(!isOpen));
  });
}

// dropdowns: open ONLY on click (desktop + mobile)
const dropdowns = document.querySelectorAll('.dropdown');

function closeAll(except = null){
  dropdowns.forEach(d => {
    if (d !== except) {
      const btn = d.querySelector('.dropbtn');
      const panel = d.querySelector('.dropdown-menu');
      if (panel) panel.hidden = true;                 // force hidden
      if (btn) btn.setAttribute('aria-expanded', 'false');
    }
  });
}

// ensure all panels start hidden
closeAll();

dropdowns.forEach(d => {
  const btn = d.querySelector('.dropbtn');
  const panel = d.querySelector('.dropdown-menu');
  if (!btn || !panel) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const willOpen = panel.hidden;                    // open if currently hidden
    closeAll(d);                                      // close others
    panel.hidden = !willOpen;                         // toggle
    btn.setAttribute('aria-expanded', String(willOpen));
  });
});

// click outside to close
document.addEventListener('click', (e) => {
  const inside = e.target.closest('.dropdown') || e.target.closest('.menu') || e.target.closest('.nav-toggle');
  if (!inside) closeAll();
});

// close on ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeAll();
});
