function ensureNavbarStylesheet(prefix) {
    if (document.getElementById("uaii-navbar-css")) {
        return;
    }

    const link = document.createElement("link");
    link.id = "uaii-navbar-css";
    link.rel = "stylesheet";
    link.href = (prefix || "") + "partials/navbar.css";
    document.head.appendChild(link);
}

function setActivePageLinks() {
    const navbarContainer = document.getElementById("navbar");
    const activeKey = navbarContainer?.dataset.active;
    const navLinks = document.querySelectorAll(".uaii-navbar a[data-key], .uaii-mobile-menu a[data-key]");

    if (activeKey) {
        navLinks.forEach((link) => {
            if (link.dataset.key === activeKey) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
        return;
    }

    const currentPathname = window.location.pathname;
    const allLinks = document.querySelectorAll(".uaii-navbar a[href], .uaii-mobile-menu a[href]");
    allLinks.forEach((link) => {
        const href = link.getAttribute("href") || "";
        let isActive = false;

        if (href.startsWith("#")) {
            const currentFile = currentPathname.split("/").pop() || "index.html";
            isActive = currentFile === "index.html" && window.location.hash === href;
        } else {
            const resolved = new URL(href, window.location.href).pathname;
            isActive = resolved === currentPathname ||
                (currentPathname.endsWith("/") && resolved === currentPathname + "index.html");
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

    const prefix = navbarContainer.dataset.prefix || "";
    ensureNavbarStylesheet(prefix);

    navbarContainer.innerHTML = `
        <nav class="uaii-navbar" aria-label="Main navigation">
            <a id="navbar-home-link" href="${prefix}index.html" class="uaii-navbar-brand">
                KUAI <span id="navbar-page" class="uaii-navbar-brand-sub">${pageName || "KAIST Urban AI"}</span>
            </a>
            <ul class="uaii-navbar-links">
                <li><a href="${prefix}index.html" data-key="home">Home</a></li>
                <li><a href="${prefix}about.html" data-key="about">About</a></li>
                <li><a href="${prefix}people.html" data-key="people">People</a></li>
                <li><a href="${prefix}projects.html" data-key="projects">Projects</a></li>
                <li><a href="${prefix}announcement.html" data-key="engagement">Announcement</a></li>
                <li><a href="${prefix}engagement/index.html" data-key="conferences">Engagement</a></li>
            </ul>
            <button id="menuBtn" class="uaii-menu-btn" aria-label="Toggle menu" aria-expanded="false">☰</button>
        </nav>
        <div id="mobileMenu" class="uaii-mobile-menu">
            <a href="${prefix}index.html" data-key="home">Home</a>
            <a href="${prefix}about.html" data-key="about">About</a>
            <a href="${prefix}people.html" data-key="people">People</a>
            <a href="${prefix}projects.html" data-key="projects">Projects</a>
            <a href="${prefix}announcement.html" data-key="engagement">Announcement</a>
            <a href="${prefix}engagement/index.html" data-key="conferences">Engagement</a>
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
