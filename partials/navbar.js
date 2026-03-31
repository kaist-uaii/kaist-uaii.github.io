function ensureNavbarStylesheet() {
    if (document.getElementById("uaii-navbar-css")) {
        return;
    }

    const link = document.createElement("link");
    link.id = "uaii-navbar-css";
    link.rel = "stylesheet";
    link.href = "partials/navbar.css";
    document.head.appendChild(link);
}

function setActivePageLinks() {
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll(".uaii-navbar a[href], .uaii-mobile-menu a[href]");

    navLinks.forEach((link) => {
        const href = link.getAttribute("href") || "";
        let isActive = false;

        if (href.startsWith("#")) {
            isActive = currentPath === "index.html" && window.location.hash === href;
        } else {
            const targetPath = href.split("/").pop();
            isActive = targetPath === currentPath;
        }

        if (isActive) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
}

function setupMobileMenu() {
    const menuBtn = document.getElementById("menuBtn");
    const mobileMenu = document.getElementById("mobileMenu");
    if (!menuBtn || !mobileMenu) {
        return;
    }

    const closeMobileMenu = () => {
        mobileMenu.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
    };

    menuBtn.addEventListener("click", () => {
        const isOpen = mobileMenu.classList.toggle("open");
        menuBtn.setAttribute("aria-expanded", String(isOpen));
    });

    // If viewport returns to desktop size, force-close mobile menu.
    const desktopMediaQuery = window.matchMedia("(min-width: 901px)");
    const handleViewportChange = (event) => {
        if (event.matches) {
            closeMobileMenu();
        }
    };

    if (desktopMediaQuery.addEventListener) {
        desktopMediaQuery.addEventListener("change", handleViewportChange);
    } else {
        desktopMediaQuery.addListener(handleViewportChange);
    }
}

function loadNavbar(pageName) {
    const navbarContainer = document.getElementById("navbar");
    if (!navbarContainer) {
        console.error('Navbar container with id="navbar" not found');
        return;
    }

    ensureNavbarStylesheet();

    navbarContainer.innerHTML = `
        <nav class="uaii-navbar" aria-label="Main navigation">
            <a id="navbar-home-link" href="index.html" class="uaii-navbar-brand">
                UAII <span id="navbar-page" class="uaii-navbar-brand-sub">${pageName || "Urban AI Institute"}</span>
            </a>
            <ul class="uaii-navbar-links">
                <li><a href="index.html">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="people.html">People</a></li>
                <li><a href="projects.html">Projects</a></li>
                <li><a href="engagement.html">Engagement</a></li>
            </ul>
            <button id="menuBtn" class="uaii-menu-btn" aria-label="Toggle menu" aria-expanded="false">☰</button>
        </nav>
        <div id="mobileMenu" class="uaii-mobile-menu">
            <a href="index.html">Home</a>
            <a href="#about">About</a>
            <a href="people.html">People</a>
            <a href="projects.html">Projects</a>
            <a href="engagement.html">Engagement</a>   
        </div>
    `;

    setupMobileMenu();
    setActivePageLinks();
}

document.addEventListener("DOMContentLoaded", () => {
    const navbarContainer = document.getElementById("navbar");
    const pageName = navbarContainer?.dataset.page ?? "";
    loadNavbar(pageName);
});