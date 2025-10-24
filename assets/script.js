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

// dropdowns: click-to-open (desktop + mobile)
const dropdowns = document.querySelectorAll('.dropdown');

function closeAllDropdowns(except = null){
  dropdowns.forEach(d => {
    if (d !== except) {
      d.classList.remove('open');
      const btn = d.querySelector('.dropbtn');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    }
  });
}

dropdowns.forEach(d => {
  const btn = d.querySelector('.dropbtn');
  if (!btn) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const isOpen = d.classList.contains('open');
    closeAllDropdowns(d);               // close others
    d.classList.toggle('open', !isOpen);
    btn.setAttribute('aria-expanded', String(!isOpen));
  });
});

// click outside to close
document.addEventListener('click', (e) => {
  const inside = e.target.closest('.dropdown') || e.target.closest('.menu') || e.target.closest('.nav-toggle');
  if (!inside) closeAllDropdowns();
});

// close on ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeAllDropdowns();
});
