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

function copyEmail(email) {
    // 최신 브라우저
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email)
            .then(() => {
                alert('Email copied to clipboard');
            })
            .catch(() => {
                fallbackCopy(email);
            });
    } else {
        fallbackCopy(email);
    }
}

function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
        document.execCommand('copy');
        alert('Email copied to clipboard');
    } catch (e) {
        alert('Copy failed');
    }

    document.body.removeChild(textarea);
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

const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});


// press slider (auto-advance)
const pressSlider = document.querySelector('.press-slider');
if (pressSlider) {
    const track = pressSlider.querySelector('.press-track');
    const slides = Array.from(pressSlider.querySelectorAll('.press-item'));
    const prevButton = document.querySelector('.press-control.prev');
    const nextButton = document.querySelector('.press-control.next');

    if (!track || slides.length === 0) {
        // 트랙/슬라이드 없으면 아무것도 안 함
    } else {
        let current = slides.findIndex((slide) => slide.classList.contains('is-active'));
        if (current === -1) current = 0;

        const showSlide = (index, { focus = false } = {}) => {
            slides.forEach((slide, idx) => {
                const isActive = idx === index;
                slide.classList.toggle('is-active', isActive);
                slide.setAttribute('aria-hidden', String(!isActive));
            });

            // 트랙 이동 (CSS transition으로 자연스럽게)
            track.style.transform = `translateX(-${index * 100}%)`;

            // (선택) 키보드 사용자가 버튼으로 조작할 때 슬라이더 영역에 포커스 주고 싶으면:
            if (focus) pressSlider.focus?.();
        };

        const moveTo = (index) => {
            current = (index + slides.length) % slides.length;
            showSlide(current);
        };

        const nextMove = () => moveTo(current + 1);
        const prevMove = () => moveTo(current - 1);

        // 초기 렌더
        showSlide(current);

        // 자동재생 (슬라이드 2개 이상일 때만)
        const loopIntervalMs = 5000;
        let loopInterval = null;

        const startLoop = () => {
            if (slides.length <= 1) return;
            stopLoop();
            loopInterval = setInterval(nextMove, loopIntervalMs);
        };

        const stopLoop = () => {
            if (loopInterval) clearInterval(loopInterval);
            loopInterval = null;
        };

        const resetLoop = () => {
            startLoop();
        };

        startLoop();

        // 버튼 이벤트
        prevButton?.addEventListener('click', () => {
            prevMove();
            resetLoop();
        });

        nextButton?.addEventListener('click', () => {
            nextMove();
            resetLoop();
        });

        // hover 시 자동재생 멈춤 / 벗어나면 재시작
        pressSlider.addEventListener('mouseenter', stopLoop);
        pressSlider.addEventListener('mouseleave', startLoop);

        // 포커스 들어오면 멈춤(키보드/스크린리더), 나가면 재시작
        pressSlider.addEventListener('focusin', stopLoop);
        pressSlider.addEventListener('focusout', startLoop);

        // 키보드 좌/우 이동 (슬라이더 영역에 포커스가 있을 때)
        // tabindex가 없으면 focus가 안 될 수 있으니 HTML에 press-slider에 tabindex="0" 추가해도 됨.
        pressSlider.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevMove();
                resetLoop();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextMove();
                resetLoop();
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('menuBtn');
    const menu = document.getElementById('mobileMenu');

    if (!btn || !menu) return;

    const openMenu = () => {
        btn.setAttribute('aria-expanded', 'true');
        menu.classList.remove('opacity-0');
        menu.classList.add('opacity-100');
        menu.style.maxHeight = menu.scrollHeight + 'px';
    };

    const closeMenu = () => {
        btn.setAttribute('aria-expanded', 'false');
        menu.style.maxHeight = '0px';
        menu.classList.remove('opacity-100');
        menu.classList.add('opacity-0');
    };

    btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        expanded ? closeMenu() : openMenu();
    });

    // 메뉴 항목 클릭 시 자동 닫힘(모바일 UX)
    menu.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => closeMenu());
    });

    // 데스크탑으로 넘어가면 상태 초기화
    window.addEventListener('resize', () => {
        if (window.matchMedia('(min-width: 768px)').matches) {
            closeMenu();
        }
    });
});