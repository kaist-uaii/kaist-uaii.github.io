function injectNavbarStyles() {
    if (document.getElementById("uaii-navbar-style")) {
        return;
    }

    const style = document.createElement("style");
    style.id = "uaii-navbar-style";
    style.textContent = `
        .uaii-navbar {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 100;
            height: 56px;
            padding: 0 40px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: rgba(252, 252, 252, 0.92);
            backdrop-filter: blur(8px);
            border-bottom: 1px solid #e2e5eb;
        }
        .uaii-navbar-brand {
            font-size: 20px;
            font-weight: 900;
            letter-spacing: -0.5px;
            color: #1e3a8a;
            text-decoration: none;
        }
        .uaii-navbar-brand-sub {
            font-weight: 300;
            color: #94a3b8;
            margin-left: 6px;
        }
        .uaii-navbar-links {
            display: flex;
            gap: 28px;
            list-style: none;
            margin: 0;
            padding: 0;
        }
        .uaii-navbar-links a {
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: #64748b;
            transition: color 0.2s;
            text-decoration: none;
        }
        .uaii-navbar-links a:hover {
            color: #2563eb;
        }
        .uaii-menu-btn {
            display: none;
            border: 0;
            background: transparent;
            font-size: 20px;
            color: #334155;
            cursor: pointer;
        }
        .uaii-mobile-menu {
            display: none;
            position: fixed;
            top: 56px;
            left: 0;
            width: 100%;
            z-index: 99;
            background: rgba(252, 252, 252, 0.97);
            border-bottom: 1px solid #e2e5eb;
            padding: 12px 24px;
        }
        .uaii-mobile-menu.open {
            display: block;
        }
        .uaii-mobile-menu a {
            display: block;
            padding: 10px 0;
            color: #334155;
            text-decoration: none;
            font-weight: 600;
        }
        @media (max-width: 900px) {
            .uaii-navbar {
                padding: 0 20px;
            }
            .uaii-navbar-links {
                display: none;
            }
            .uaii-menu-btn {
                display: block;
            }
        }
    `;

    document.head.appendChild(style);
}

function setupMobileMenu() {
    const menuBtn = document.getElementById("menuBtn");
    const mobileMenu = document.getElementById("mobileMenu");
    if (!menuBtn || !mobileMenu) {
        return;
    }

    menuBtn.addEventListener("click", () => {
        const isOpen = mobileMenu.classList.toggle("open");
        menuBtn.setAttribute("aria-expanded", String(isOpen));
    });
}

function loadNavbar(sectionName) {
    const navbarContainer = document.getElementById("navbar");
    if (!navbarContainer) {
        console.error('Navbar container with id="navbar" not found');
        return;
    }

    injectNavbarStyles();

    navbarContainer.innerHTML = `
        <nav class="uaii-navbar" aria-label="Main navigation">
            <a id="navbar-home-link" href="index.html" class="uaii-navbar-brand">
                UAII <span id="navbar-section" class="uaii-navbar-brand-sub">${sectionName || "Urban AI Institute"}</span>
            </a>
            <ul class="uaii-navbar-links">
                <li><a href="#about">About</a></li>
                <li><a href="people.html">People</a></li>
                <li><a href="projects.html">Projects</a></li>
                <li><a href="apply.html">Apply</a></li>
                <li><a href="press.html">Press</a></li>
                <li><a href="calendar/calendar-fullcalendar-v5-test.html">Calendar</a></li>
            </ul>
            <button id="menuBtn" class="uaii-menu-btn" aria-label="Toggle menu" aria-expanded="false">☰</button>
        </nav>
        <div id="mobileMenu" class="uaii-mobile-menu">
            <a href="#about">About</a>
            <a href="people.html">People</a>
            <a href="projects.html">Projects</a>
            <a href="apply.html">Apply</a>
            <a href="press.html">Press</a>
            <a href="calendar/calendar-fullcalendar-v5-test.html">Calendar</a>
        </div>
    `;

    setupMobileMenu();
}

document.addEventListener("DOMContentLoaded", () => {
    const navbarContainer = document.getElementById("navbar");
    const sectionName = navbarContainer?.dataset.section ?? "";
    loadNavbar(sectionName);
});