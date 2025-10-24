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

// open/close dropdowns on mobile
const drops = document.querySelectorAll('.dropdown');
drops.forEach(d => {
  const btn = d.querySelector('.dropbtn');
  const panel = d.querySelector('.dropdown-menu');
  if (btn && panel){
    btn.addEventListener('click', (e) => {
      if (getComputedStyle(document.querySelector('.nav-toggle')).display !== 'none'){
        e.preventDefault();
        panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
        btn.setAttribute('aria-expanded', String(panel.style.display === 'block'));
      }
    });
  }
});
