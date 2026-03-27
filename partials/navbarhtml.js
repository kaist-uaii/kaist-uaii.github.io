function setupMobileMenu() {
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if (!menuBtn || !mobileMenu) {
        return;
    }

    menuBtn.addEventListener('click', () => {
        const isHidden = mobileMenu.hasAttribute('hidden');
        if (isHidden) {
            mobileMenu.removeAttribute('hidden');
            menuBtn.setAttribute('aria-expanded', 'true');
            return;
        }
        mobileMenu.setAttribute('hidden', '');
        menuBtn.setAttribute('aria-expanded', 'false');
    });
}

function setupSectionName(sectionName) {
    const sectionEl = document.getElementById('navbar-section');
    if (!sectionEl || !sectionName) {
        return;
    }
    sectionEl.textContent = sectionName;
}

async function loadNavbar(sectionName) {
    const navbarContainer = document.getElementById('navbar');
    if (!navbarContainer) {
        console.error('Navbar container with id="navbar" not found');
        return;
    }

    try {
        const response = await fetch('partials/navbar.html', { cache: 'no-cache' });
        if (!response.ok) {
            throw new Error(`Failed to fetch navbar.html (${response.status})`);
        }
        const html = await response.text();
        navbarContainer.innerHTML = html;
        setupSectionName(sectionName);
        setupMobileMenu();
    } catch (error) {
        console.error('Unable to load navbar partial:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const navbarContainer = document.getElementById('navbar');
    const sectionName = navbarContainer?.dataset.section ?? '';
    loadNavbar(sectionName);
});