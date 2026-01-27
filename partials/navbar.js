/**
 * Loads the navbar HTML and injects it into the page
 * @param {string} sectionName - The section name to display (e.g., "Calendar", "People", "Projects")
 * @param {string} navbarPath - Optional path to navbar.html (defaults to 'partials/navbar.html')
 */
export function loadNavbar(sectionName, navbarPath) {
    // Auto-detect if we're in a subdirectory
    var currentPath = window.location.pathname;
    const isInSubdirectory = currentPath.split('/').filter(p => p && !p.endsWith('.html')).length > 0;
    const defaultPath = isInSubdirectory ? '../partials/navbar.html' : './partials/navbar.html';
    const path = navbarPath || defaultPath;
    
    fetch(path)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            const navbarContainer = document.getElementById('navbar');
            if (!navbarContainer) {
                console.error('Navbar container with id="navbar" not found');
                return;
            }
            
            navbarContainer.innerHTML = data;
            
            // Update section name if provided
            if (sectionName) {
                const sectionEl = document.querySelector('#navbar-section');
                if (sectionEl) {
                    sectionEl.textContent = sectionName;
                }
            }
            
            // Update all links to include ../ if we're in a subdirectory
            if (isInSubdirectory) {
                const navbarLinks = document.querySelectorAll('#navbar a[href]');
                navbarLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href && !href.startsWith('http') && !href.startsWith('../') && !href.startsWith('/')) {
                        link.setAttribute('href', '../' + href);
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error loading navbar:', error);
            // Fallback: show a simple navbar if fetch fails
            const navbarContainer = document.getElementById('navbar');
            if (navbarContainer) {
                const fallbackPath = isInSubdirectory ? '../' : '';
                navbarContainer.innerHTML = 
                    '<nav class="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">' +
                    '<div class="container mx-auto px-6 py-6 flex justify-between items-center">' +
                    `<a href="${fallbackPath}index.html"><div class="text-xl font-black tracking-tighter text-blue-900">UAII <span class="text-slate-400 font-light">${sectionName || 'Projects'}</span></div></a>` +
                    '<div class="flex gap-6 text-xs font-bold uppercase tracking-widest text-slate-500">' +
                    '</div></div></nav>';
            }
        });
}