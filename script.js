/* ============================================================
   ROBIN PORTFOLIO — SHARED SCRIPT
   ============================================================ */

/* ── GLOBAL ANIMATED BACKGROUND — every page, plain onyx + drifting
      gradient orbs that shift position as you scroll up/down ── */
(function() {
  const wrap = document.createElement('div');
  wrap.className = 'site-bg-fx';
  wrap.setAttribute('aria-hidden', 'true');
  wrap.innerHTML =
    '<div class="bg-orb bg-orb-1"></div>' +
    '<div class="bg-orb bg-orb-2"></div>' +
    '<div class="bg-orb bg-orb-3"></div>' +
    '<div class="bg-orb bg-orb-4"></div>' +
    '<div class="bg-orb bg-orb-5"></div>';
  document.body.prepend(wrap);

  const orbs = wrap.querySelectorAll('.bg-orb');
  // each orb drifts at its own speed/direction relative to scroll,
  // so they constantly change position and never move in lockstep
  const speeds = [0.18, -0.13, 0.24, -0.2, 0.15];
  const sideways = [12, -18, 22, -14, 18]; // subtle horizontal drift too

  let ticking = false;
  function updateOrbs() {
    const y = window.scrollY;
    orbs.forEach((orb, i) => {
      const vSpeed = speeds[i % speeds.length];
      const hAmount = sideways[i % sideways.length];
      const x = Math.sin(y / 900 + i) * hAmount;
      orb.style.transform = `translate3d(${x}px, ${y * vSpeed}px, 0)`;
    });
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateOrbs);
      ticking = true;
    }
  }, { passive: true });
  updateOrbs();
})();

/* ── "LET'S CONNECT" PANEL (WhatsApp + Viber) — opens from the
      "Get In Touch" button, no more floating bubble ─────────── */
(function() {
  const PHONE_INTL = '639695159058'; // +63 969 515 9058, digits only for wa.me
  const VIBER_INTL = '9609304700'; // +960 9304700, Maldives number, digits only for Viber
  const chatHTML = `
    <div class="chat-fab-wrap" id="chatFabWrap">
      <div class="chat-fab-panel" id="chatFabPanel">
        <div class="chat-fab-panel-head">
          <div class="chat-fab-panel-headtext">
            <span class="chat-fab-panel-title">Let's Connect</span>
            <span class="chat-fab-panel-sub">Pick a platform to chat</span>
          </div>
          <button class="chat-fab-panel-close" id="chatFabClose" aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </div>
        <a class="chat-fab-item chat-fab-whatsapp" href="https://wa.me/${PHONE_INTL}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">
          <span class="chat-fab-item-icon"><img src="IMG/whatsapp.webp" alt=""></span>
          <span class="chat-fab-item-text">
            <span class="chat-fab-item-title">WhatsApp</span>
            <span class="chat-fab-item-desc">Chat instantly</span>
          </span>
          <svg class="chat-fab-item-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>
        </a>
        <a class="chat-fab-item chat-fab-viber" href="viber://chat?number=%2B${VIBER_INTL}" aria-label="Chat on Viber">
          <span class="chat-fab-item-icon"><img src="IMG/viber.png" alt=""></span>
          <span class="chat-fab-item-text">
            <span class="chat-fab-item-title">Viber</span>
            <span class="chat-fab-item-desc">Message me</span>
          </span>
          <svg class="chat-fab-item-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>
        </a>
      </div>
    </div>`;
  document.body.insertAdjacentHTML('beforeend', chatHTML);

  const wrap     = document.getElementById('chatFabWrap');
  const panel    = document.getElementById('chatFabPanel');
  const closeBtn = document.getElementById('chatFabClose');
  const triggers = document.querySelectorAll('.nav-cta');

  function positionPanel(trigger) {
    // Anchor to the navbar's right edge (not the raw trigger position) so the
    // panel always drops cleanly from the "Get In Touch" corner, even when the
    // trigger came from inside the mobile slide-out menu that's about to close.
    const nav = document.querySelector('nav') || trigger;
    const navRect = nav.getBoundingClientRect();
    const navPadRight = parseFloat(getComputedStyle(nav).paddingRight) || 20;
    const gap = 14;
    let right = window.innerWidth - navRect.right + navPadRight;
    right = Math.max(right, 12);
    panel.style.top = (navRect.bottom + gap) + 'px';
    panel.style.right = right + 'px';
    panel.style.left = 'auto';
  }

  if (wrap && panel && triggers.length) {
    triggers.forEach(t => {
      t.addEventListener('click', e => {
        e.preventDefault();
        e.stopImmediatePropagation();
        const willOpen = !wrap.classList.contains('open');
        if (willOpen) positionPanel(t);
        wrap.classList.toggle('open');

        const mobileNav = document.getElementById('navLinks');
        const ham = document.getElementById('hamburger');
        if (mobileNav && mobileNav.classList.contains('open')) {
          mobileNav.classList.remove('open');
          if (ham) ham.classList.remove('open');
        }
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', e => {
        e.stopPropagation();
        wrap.classList.remove('open');
      });
    }

    document.addEventListener('click', e => {
      if (!wrap.contains(e.target) && !e.target.closest('.nav-cta')) {
        wrap.classList.remove('open');
      }
    });

    window.addEventListener('resize', () => wrap.classList.remove('open'));
    window.addEventListener('scroll', () => wrap.classList.remove('open'), { passive: true });
  }
})();

/* ── PAGE TRANSITION (wipe curtain between separate pages) ──────
   Every subpage (skills/works/education/experience/contact) ships a
   <div class="page-transition wipe-in" id="pageTransition">. It starts
   covering the screen, we wipe it away to reveal the page, then wipe
   it back in and *then* navigate whenever a data-nav link points to
   another real page (not a "#section" anchor on the same page). ── */
(function() {
  const overlay = document.getElementById('pageTransition');
  if (!overlay) return; // index.html is single-page and doesn't use this

  const WIPE_MS = 500; // keep in sync with the CSS .page-transition clip-path duration

  // reveal the page we just landed on
  requestAnimationFrame(() => {
    overlay.classList.remove('wipe-in');
    overlay.classList.add('wipe-out');
  });

  let navigating = false;
  document.querySelectorAll('a[data-nav]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      if (link.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      if (navigating) return;
      navigating = true;
      overlay.classList.remove('wipe-out');
      overlay.classList.add('wipe-in');
      setTimeout(() => { window.location.href = href; }, WIPE_MS);
    });
  });

  // restore a clean "revealed" state if the page is served from bfcache
  // (e.g. tapping the browser's back button on mobile)
  window.addEventListener('pageshow', e => {
    if (e.persisted) {
      overlay.classList.remove('wipe-in');
      overlay.classList.add('wipe-out');
      navigating = false;
    }
  });
})();

/* ── PAGE ENTER ANIMATION ────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  /* ── HERO ROLE TYPEWRITER (loops between roles) ─────────── */
  (function typewriterLoop() {
    const el = document.getElementById('typewriterText');
    if (!el) return;

    const words = ['Graphic Designer', 'Social Media Manager'];
    let wordIndex = 0, charIndex = 0, deleting = false;

    const TYPE_SPEED = 85;
    const DELETE_SPEED = 45;
    const HOLD_TIME = 1600;
    const jitter = (base) => base + Math.random() * 30 - 15; // slight natural variance

    function tick() {
      const current = words[wordIndex];

      if (!deleting) {
        charIndex++;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, HOLD_TIME);
          return;
        }
        setTimeout(tick, jitter(TYPE_SPEED));
      } else {
        charIndex--;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          setTimeout(tick, 400);
          return;
        }
        setTimeout(tick, jitter(DELETE_SPEED));
      }
    }

    tick();
  })();

  /* ── SMOOTH IN-PAGE NAV + AUTO-CLOSE MOBILE MENU ──────── */
  document.querySelectorAll('a[data-nav]').forEach(link => {
    link.addEventListener('click', e => {
      const target = link.getAttribute('href');
      if (!target || !target.startsWith('#')) return; // let real links behave normally
      const section = document.querySelector(target);
      if (!section) return;
      e.preventDefault();
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', target);

      const nav = document.getElementById('navLinks');
      const ham = document.getElementById('hamburger');
      if (nav && nav.classList.contains('open')) {
        nav.classList.remove('open');
        if (ham) ham.classList.remove('open');
      }
    });
  });

  /* ── ACTIVE NAV LINK (SCROLL-SPY) ──────────────────────── */
  const navAnchors = Array.from(document.querySelectorAll('.nav-links a[href^="#"], .mobile-bottom-nav a[href^="#"]'));
  const sections = navAnchors
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  function setActiveLink(id) {
    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + id);
    });
  }

  if (sections.length) {
    const spyObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActiveLink(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(sec => spyObserver.observe(sec));
  }

  /* ── CUSTOM CURSOR ────────────────────────────────────── */
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursorRing');
  if (cursor && ring) {
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
    document.addEventListener('mousemove', e => {
      mouseX = e.clientX; mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top  = mouseY + 'px';
    });
    (function animateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = ringX + 'px';
      ring.style.top  = ringY + 'px';
      requestAnimationFrame(animateRing);
    })();

    document.querySelectorAll('a, button, .skill-card, .exp-card, .contact-item, .work-card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(2)';
        ring.style.width = '50px'; ring.style.height = '50px';
        ring.style.borderColor = 'rgba(255,255,255,0.8)';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(1)';
        ring.style.width = '36px'; ring.style.height = '36px';
        ring.style.borderColor = 'rgba(255,255,255,0.6)';
      });
    });
  }

  /* ── SCROLL REVEAL (replays on scroll up AND down) ────────
     threshold 0 = fires the instant any part of the element
     enters the viewport, so it's purely scroll-driven — no tap
     or extra interaction needed to "unstick" a card. ──────── */
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
      }
    });
  }, { threshold: 0 });

  document.querySelectorAll('.reveal, .timeline-item, .exp-card, .work-card').forEach(el => {
    revealObserver.observe(el);
  });

  /* ── TOOLS IMAGE: stay hidden on initial landing, only reveal once
     the user actually scrolls it well into view ─────────────────── */
  const toolsRevealEl = document.querySelector('.tools-wrap');
  if (toolsRevealEl) {
    // Shorter, less aggressive margin on mobile so the reveal reliably
    // fires on smaller viewports (the old -30% could get skipped on
    // short phone screens where the section barely clears that mark).
    const toolsRootMargin = window.matchMedia('(max-width: 768px)').matches
      ? '0px 0px -10% 0px'
      : '0px 0px -30% 0px';
    const toolsObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } else {
          entry.target.classList.remove('visible');
        }
      });
    }, { threshold: 0, rootMargin: toolsRootMargin });
    toolsObserver.observe(toolsRevealEl);
  }

  /* ── SKILLS MARQUEE (auto-scrolls sideways, tap/click a card to pause) ── */
  (function() {
    const marquee    = document.getElementById('skillsMarquee');
    const track      = document.getElementById('skillsGrid');
    const folderGate = document.getElementById('folderGate');
    const skillsHint = document.getElementById('skillsHint');
    if (!marquee || !track) return;

    // the original, single-copy cards — our source of truth for filtering
    const masterCards = Array.from(track.children);
    let folderOpened = false;

    function staggerCards() {
      // give each visible card its own little burst delay/rotation so they
      // don't all pop out of the folder at once — reads like a real burst
      const cards = track.querySelectorAll('.skill-card');
      cards.forEach((card, i) => {
        const delay = (i % 12) * 45; // ms, capped so the tail doesn't drag
        card.style.animationDelay = delay + 'ms';
      });
    }

    function buildTrack(filter) {
      const filtered = masterCards.filter(c => filter === 'all' || c.dataset.category === filter);
      track.innerHTML = '';
      // two back-to-back copies so the loop is seamless (-50% = exactly one set)
      for (let i = 0; i < 2; i++) {
        filtered.forEach(card => {
          const clone = card.cloneNode(true);
          clone.classList.add('visible');
          if (i === 1) clone.setAttribute('aria-hidden', 'true');
          track.appendChild(clone);
        });
      }
      // fill bar widths right away (section's already on screen when filtering)
      track.querySelectorAll('.skill-bar').forEach(bar => {
        bar.style.width = bar.dataset.pct + '%';
      });
      // re-wire the custom-cursor hover effect onto the freshly cloned cards
      const cursor = document.getElementById('cursor');
      const ring   = document.getElementById('cursorRing');
      if (cursor && ring) {
        track.querySelectorAll('.skill-card').forEach(el => {
          el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%,-50%) scale(2)';
            ring.style.width = '50px'; ring.style.height = '50px';
            ring.style.borderColor = 'rgba(255,255,255,0.8)';
          });
          el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%,-50%) scale(1)';
            ring.style.width = '36px'; ring.style.height = '36px';
            ring.style.borderColor = 'rgba(255,255,255,0.6)';
          });
        });
      }
      // restart the scroll animation cleanly from the start
      track.style.animation = 'none';
      void track.offsetWidth;
      track.style.animation = '';

      // if the folder's already been opened, any re-filtered cards should
      // just appear normally (no re-burst, no re-hide)
      if (folderOpened) {
        marquee.classList.remove('folder-closed', 'folder-opening');
      } else {
        staggerCards();
      }
    }

    buildTrack('all');

    // ── FOLDER OPEN: tap the folder and every skill bursts out ──────
    function openFolder() {
      if (folderOpened) return;
      folderOpened = true;

      if (folderGate) folderGate.classList.add('opened');
      marquee.classList.add('folder-opening');
      marquee.classList.remove('folder-closed');

      // let the burst play, then start the auto-scroll and swap the hint
      setTimeout(() => {
        marquee.classList.remove('paused');
        marquee.classList.remove('folder-opening');
        if (skillsHint) skillsHint.textContent = 'Tap a card to pause the scroll';
      }, 950);

      if (folderGate) {
        setTimeout(() => folderGate.remove(), 600);
      }
    }

    if (folderGate) {
      folderGate.addEventListener('click', openFolder);
      folderGate.setAttribute('role', 'button');
      folderGate.setAttribute('tabindex', '0');
      folderGate.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openFolder(); }
      });
    }

    // animate the bars in once the section first scrolls into view
    const barObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.skill-bar').forEach(bar => {
            bar.style.width = bar.dataset.pct + '%';
          });
          barObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    barObserver.observe(marquee);

    document.querySelectorAll('#skills .cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#skills .cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        // filtering before the folder's opened should open it first,
        // then apply the filter — never leave cards invisible
        if (!folderOpened) openFolder();
        buildTrack(btn.dataset.filter);
        marquee.classList.remove('paused');
      });
    });

    // click/tap any card = pause; click again = resume (only once opened)
    track.addEventListener('click', e => {
      if (folderOpened && e.target.closest('.skill-card')) {
        marquee.classList.toggle('paused');
      }
    });
  })();

  /* ── COUNTER ANIMATION ────────────────────────────────── */
  function animateCounter(el, target, duration = 2000) {
    let start = 0;
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      el.textContent = Math.floor(p * target);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target + '+';
    };
    requestAnimationFrame(step);
  }
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const t = parseInt(entry.target.dataset.target);
        if (!isNaN(t)) animateCounter(entry.target, t);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-num').forEach(el => counterObserver.observe(el));

  /* ── HAMBURGER ────────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  /* Hooks the lightbox (further below) uses to pause/resume the works
     auto-slideshow while a picture or video is being viewed fullscreen. */
  let pauseWorksAutoSlide  = () => {};
  let resumeWorksAutoSlide = () => {};

  /* ── WORKS GRID (index.html "Sample Works" preview) ────────
     Continuous masonry-style feed, filterable by category —
     no carousel, just scroll. Reels only autoplay while actually
     scrolled into view, to keep things light. ────────────────── */
  (function() {
    const grid = document.getElementById('worksGrid');
    if (!grid) return;

    const allItems   = Array.from(grid.querySelectorAll('.work-item'));
    const filterBtns = document.querySelectorAll('.works-filters .cat-btn');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        allItems.forEach(item => {
          item.style.display = (filter === 'all' || item.dataset.category === filter) ? '' : 'none';
        });
      });
    });

    /* Reel cards no longer autoplay on scroll — they sit on their poster
       frame and only play (with sound) when tapped, inside the lightbox. */
  })();

  /* ── WORKS — PER-CATEGORY ROWS ────────────────────────────
     Each category is its own horizontal scroller with Back/Next
     buttons. On mobile the Reels row snaps one clip at a time —
     same feel as the Websites carousel — with a dot rail and an
     active-card pop animation; desktop keeps the classic multi-
     card peek scroller untouched. ─────────────────────────────── */
  (function() {
    const rows = document.querySelectorAll('.works-row-wrap');
    if (!rows.length) return;

    rows.forEach(wrap => {
      const row  = wrap.querySelector('.works-row');
      const prev = wrap.querySelector('.row-prev');
      const next = wrap.querySelector('.row-next');
      const dotsWrap = wrap.parentElement ? wrap.parentElement.querySelector('.works-row-dots') : null;
      if (!row || !prev || !next) return;

      const cards = Array.from(row.children);

      if (dotsWrap && !dotsWrap.children.length) {
        cards.forEach((_, i) => {
          const dot = document.createElement('button');
          dot.className = 'works-row-dot';
          dot.setAttribute('aria-label', `Go to clip ${i + 1}`);
          dot.addEventListener('click', () => {
            cards[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
          });
          dotsWrap.appendChild(dot);
        });
      }
      const dots = dotsWrap ? Array.from(dotsWrap.children) : [];

      let activeIndex = 0;
      const setActive = (index) => {
        activeIndex = index;
        cards.forEach((c, i) => c.classList.toggle('is-active', i === index));
        dots.forEach((d, i) => d.classList.toggle('active', i === index));
        prev.classList.toggle('disabled', index === 0);
        next.classList.toggle('disabled', index === cards.length - 1);
      };
      setActive(0);

      if (cards.length) {
        const obs = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
              setActive(cards.indexOf(entry.target));
            }
          });
        }, { root: row, threshold: [0.6] });
        cards.forEach(c => obs.observe(c));
      }

      const scrollAmount = () => row.clientWidth * 0.85;
      prev.addEventListener('click', () => {
        if (cards.length) cards[Math.max(0, activeIndex - 1)].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        else row.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
      });
      next.addEventListener('click', () => {
        if (cards.length) cards[Math.min(cards.length - 1, activeIndex + 1)].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        else row.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
      });

      // Rows whose cards already fit the available width (no overflow)
      // don't need Back/Next controls — hide them instead of showing
      // buttons that have nothing to do.
      const checkOverflow = () => {
        const hasOverflow = row.scrollWidth > row.clientWidth + 2;
        wrap.classList.toggle('no-overflow', !hasOverflow);
      };
      checkOverflow();
      window.addEventListener('resize', checkOverflow);
      if (window.ResizeObserver) new ResizeObserver(checkOverflow).observe(row);
    });

    /* Reel cards no longer autoplay on scroll — they sit on their poster
       frame and only play (with sound) when tapped, inside the lightbox. */
  })();

  /* ── WEBSITES CAROUSEL — one site card at a time. Swipe/scroll or
     tap the arrow buttons; the active card scales up and the dot
     rail underneath tracks position, with a snap animation. ────── */
  (function() {
    document.querySelectorAll('.sites-carousel-block').forEach(block => {
      const carousel = block.querySelector('.sites-carousel');
      const prevBtn  = block.querySelector('.sites-prev');
      const nextBtn  = block.querySelector('.sites-next');
      const dotsWrap = block.querySelector('.sites-dots');
      if (!carousel) return;

      const cards = Array.from(carousel.children);
      if (!cards.length) return;

      if (dotsWrap) {
        cards.forEach((_, i) => {
          const dot = document.createElement('button');
          dot.className = 'sites-dot';
          dot.setAttribute('aria-label', `Go to website ${i + 1}`);
          dot.addEventListener('click', () => {
            cards[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
          });
          dotsWrap.appendChild(dot);
        });
      }
      const dots = dotsWrap ? Array.from(dotsWrap.children) : [];

      let activeIndex = 0;
      const setActive = (index) => {
        activeIndex = index;
        cards.forEach((c, i) => c.classList.toggle('is-active', i === index));
        dots.forEach((d, i) => d.classList.toggle('active', i === index));
        if (prevBtn) prevBtn.classList.toggle('disabled', index === 0);
        if (nextBtn) nextBtn.classList.toggle('disabled', index === cards.length - 1);
      };
      setActive(0);

      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            setActive(cards.indexOf(entry.target));
          }
        });
      }, { root: carousel, threshold: [0.6] });
      cards.forEach(c => obs.observe(c));

      if (prevBtn) prevBtn.addEventListener('click', () => {
        cards[Math.max(0, activeIndex - 1)].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      });
      if (nextBtn) nextBtn.addEventListener('click', () => {
        cards[Math.min(cards.length - 1, activeIndex + 1)].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      });
    });
  })();

  /* ── FEATURED REELS CAROUSEL — one big reel card at a time,
     same swipe/arrow/dot behavior as the Websites carousel above.
     Tapping the card (play button included) opens the video in the
     lightbox — that's handled by the existing video-lightbox logic
     further below, which matches on any `.work-card` with a video. ── */
  (function() {
    document.querySelectorAll('.reels-carousel-block').forEach(block => {
      const carousel = block.querySelector('.reels-carousel');
      const prevBtn  = block.querySelector('.reels-prev');
      const nextBtn  = block.querySelector('.reels-next');
      const dotsWrap = block.querySelector('.reels-dots');
      if (!carousel) return;

      const cards = Array.from(carousel.children);
      if (!cards.length) return;

      if (dotsWrap) {
        cards.forEach((_, i) => {
          const dot = document.createElement('button');
          dot.className = 'reels-dot';
          dot.setAttribute('aria-label', `Go to reel ${i + 1}`);
          dot.addEventListener('click', () => {
            cards[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
          });
          dotsWrap.appendChild(dot);
        });
      }
      const dots = dotsWrap ? Array.from(dotsWrap.children) : [];

      let activeIndex = 0;
      const setActive = (index) => {
        activeIndex = index;
        cards.forEach((c, i) => c.classList.toggle('is-active', i === index));
        dots.forEach((d, i) => d.classList.toggle('active', i === index));
        if (prevBtn) prevBtn.classList.toggle('disabled', index === 0);
        if (nextBtn) nextBtn.classList.toggle('disabled', index === cards.length - 1);
      };
      setActive(0);

      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            setActive(cards.indexOf(entry.target));
          }
        });
      }, { root: carousel, threshold: [0.6] });
      cards.forEach(c => obs.observe(c));

      if (prevBtn) prevBtn.addEventListener('click', () => {
        cards[Math.max(0, activeIndex - 1)].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      });
      if (nextBtn) nextBtn.addEventListener('click', () => {
        cards[Math.min(cards.length - 1, activeIndex + 1)].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      });
    });
  })();

  /* ── LIGHTBOX ─────────────────────────────────────────── */
  const lightbox      = document.getElementById('lightbox');
  const lightboxImg   = document.getElementById('lightboxImg');
  const lightboxVideo = document.getElementById('lightboxVideo');
  const lightboxStage = document.getElementById('lightboxStage');
  const lightboxCap   = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev  = document.getElementById('lightboxPrev');
  const lightboxNext  = document.getElementById('lightboxNext');
  const zoomInBtn      = document.getElementById('zoomInBtn');
  const zoomOutBtn     = document.getElementById('zoomOutBtn');
  const zoomResetBtn   = document.getElementById('zoomResetBtn');
  const zoomLevelLabel = document.getElementById('zoomLevel');

  if (lightbox) {
    /* only images (not videos) become part of the gallery */
    const galleryImgs = Array.from(document.querySelectorAll('.work-card .work-img'))
      .filter(img => img.tagName !== 'VIDEO');

    let currentIndex = 0;
    let scale = 1, panX = 0, panY = 0;
    const MIN_SCALE = 1, MAX_SCALE = 4, STEP = 0.5;

    const applyTransform = () => {
      lightboxImg.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
      zoomLevelLabel.textContent = Math.round(scale * 100) + '%';
      lightboxStage.classList.toggle('zoomed', scale > 1);
      if (scale <= 1) { panX = 0; panY = 0; }
    };

    const resetZoom = () => { scale = 1; panX = 0; panY = 0; applyTransform(); };

    const setZoom = (next) => {
      scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, next));
      applyTransform();
    };

    const loadImage = (index) => {
      currentIndex = (index + galleryImgs.length) % galleryImgs.length;
      const img = galleryImgs[currentIndex];
      resetZoom();
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || '';
      lightboxCap.textContent = '';
    };

    const openLightbox = (index) => {
      loadImage(index);
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
      pauseWorksAutoSlide();
    };

    document.querySelectorAll('.work-card').forEach(card => {
      card.addEventListener('click', () => {
        const img = card.querySelector('.work-img');
        if (!img || img.tagName === 'VIDEO' || !img.src) return;
        const idx = galleryImgs.indexOf(img);
        if (idx === -1) return;
        openLightbox(idx);
      });
    });

    /* ── VIDEO CARDS: tap the active/centered video to open the floating reel viewer ── */
    let openedCardVideo = null;
    const openVideoLightbox = (vid) => {
      vid.pause();
      openedCardVideo = vid;
      lightbox.classList.add('video-mode', 'open');
      document.body.style.overflow = 'hidden';
      lightboxCap.textContent = vid.closest('.works-cat-block')?.querySelector('.works-cat-heading')?.textContent
        || vid.closest('.work-item')?.querySelector('.work-label-top')?.textContent
        || '';
      lightboxVideo.src = vid.currentSrc || vid.src;
      lightboxVideo.muted = false;
      lightboxVideo.currentTime = 0;
      lightboxVideo.play().catch(() => {});
      pauseWorksAutoSlide();
    };

    document.querySelectorAll('.work-card').forEach(card => {
      const vid = card.querySelector('video.work-img');
      if (!vid) return;
      card.addEventListener('click', e => {
        if (e.target.closest('.video-mute-btn')) return;
        openVideoLightbox(vid); // floating modal viewer, not native edge-to-edge fullscreen
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('open', 'video-mode');
      document.body.style.overflow = '';
      lightboxVideo.pause();
      lightboxVideo.removeAttribute('src');
      lightboxVideo.load();
      if (openedCardVideo) {
        openedCardVideo.muted = true;
        openedCardVideo.currentTime = 0;
        openedCardVideo = null;
      }
      setTimeout(() => { lightboxImg.src = ''; }, 300);
      resumeWorksAutoSlide();
    };

    const showNext = () => loadImage(currentIndex + 1);
    const showPrev = () => loadImage(currentIndex - 1);

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', e => { e.stopPropagation(); showNext(); });
    lightboxPrev.addEventListener('click', e => { e.stopPropagation(); showPrev(); });
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowRight') showNext();
      else if (e.key === 'ArrowLeft') showPrev();
      else if (e.key === '+' || e.key === '=') setZoom(scale + STEP);
      else if (e.key === '-') setZoom(scale - STEP);
    });

    /* ── ZOOM CONTROLS ─────────────────────────────────── */
    zoomInBtn.addEventListener('click', e => { e.stopPropagation(); setZoom(scale + STEP); });
    zoomOutBtn.addEventListener('click', e => { e.stopPropagation(); setZoom(scale - STEP); });
    zoomResetBtn.addEventListener('click', e => { e.stopPropagation(); resetZoom(); });

    /* scroll wheel zoom */
    lightboxStage.addEventListener('wheel', e => {
      e.preventDefault();
      setZoom(scale + (e.deltaY < 0 ? STEP : -STEP));
    }, { passive: false });

    /* click image to zoom in, click again (already zoomed) toggles back */
    lightboxImg.addEventListener('click', e => {
      e.stopPropagation();
      if (scale === 1) setZoom(2);
      else resetZoom();
    });

    /* drag to pan when zoomed */
    let dragging = false, startX = 0, startY = 0, startPanX = 0, startPanY = 0;
    lightboxStage.addEventListener('mousedown', e => {
      if (scale <= 1) return;
      dragging = true;
      startX = e.clientX; startY = e.clientY;
      startPanX = panX; startPanY = panY;
      lightboxStage.classList.add('dragging');
    });
    window.addEventListener('mousemove', e => {
      if (!dragging) return;
      panX = startPanX + (e.clientX - startX);
      panY = startPanY + (e.clientY - startY);
      applyTransform();
    });
    window.addEventListener('mouseup', () => {
      dragging = false;
      lightboxStage.classList.remove('dragging');
    });
  }

  /* Note: video autoplay for the index.html works grid is handled inside
     the WORKS GRID block above (plays only reels scrolled into view). */

  /* ── VIDEO SOUND TOGGLE ────────────────────────────────── */
  document.querySelectorAll('.video-mute-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      e.preventDefault();
      const vid = btn.closest('.work-card')?.querySelector('video.work-img');
      if (!vid) return;
      vid.muted = !vid.muted;
      btn.classList.toggle('is-unmuted', !vid.muted);
      btn.setAttribute('aria-label', vid.muted ? 'Unmute video' : 'Mute video');
    });
  });

  /* ── ROLE TYPEWRITER LOOP ─────────────────────────────────
     Any element with class="role-typewriter" and a
     data-roles="Role One, Role Two, ..." attribute will type each
     role in, hold, delete, then move to the next — looping forever.
     The box locks itself to the width of the longest role so the
     rest of the sentence never reflows/shifts while it types. ── */
  document.querySelectorAll('.role-typewriter').forEach(el => {
    const roles = (el.dataset.roles || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    if (!roles.length) return;

    /* Optional: data-role-links="url1, url2, ..." — same length/order
       as data-roles. When present on an <a>, the href swaps to match
       whichever role is currently showing (e.g. Viber link while
       "Chat on Viber" is typed, WhatsApp link while "Chat on WhatsApp"
       is typed). Safe no-op if the attribute isn't set. */
    const roleLinks = (el.dataset.roleLinks || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    if (roleLinks.length && 'href' in el) el.href = roleLinks[0];

    const textSpan = document.createElement('span');
    textSpan.className = 'role-typewriter-text';
    const cursorSpan = document.createElement('span');
    cursorSpan.className = 'cursor';
    el.textContent = '';
    el.appendChild(textSpan);
    el.appendChild(cursorSpan);

    /* Lock the box to the widest role's rendered width so only the
       typed text inside it changes — nothing around it moves. */
    const computed = window.getComputedStyle(el);
    const measurer = document.createElement('span');
    measurer.style.position = 'absolute';
    measurer.style.visibility = 'hidden';
    measurer.style.whiteSpace = 'nowrap';
    measurer.style.font = computed.font;
    measurer.style.letterSpacing = computed.letterSpacing;
    document.body.appendChild(measurer);
    let maxWidth = 0;
    roles.forEach(r => {
      measurer.textContent = r;
      maxWidth = Math.max(maxWidth, measurer.getBoundingClientRect().width);
    });
    measurer.remove();
    el.style.display = 'inline-block';
    el.style.minWidth = Math.ceil(maxWidth) + 4 + 'px';
    el.style.whiteSpace = 'nowrap';
    el.style.verticalAlign = 'bottom';

    const TYPE_SPEED = 70, DELETE_SPEED = 40, GAP_TIME = 400;
    /* Optional: data-hold="10000" overrides how long (ms) each role
       stays fully typed before deleting to the next one. Defaults to
       the original quick 1700ms pace when not set. */
    const HOLD_TIME = parseInt(el.dataset.hold, 10) || 1700;
    let roleIndex = 0, charIndex = 0, typing = true, stopped = false;

    /* Once clicked, freeze the loop on whatever text/link is showing —
       stops it from switching underneath the user after they've
       already acted on it (e.g. opened Viber/WhatsApp in a new tab). */
    el.addEventListener('click', () => { stopped = true; });

    function tick() {
      if (stopped) return;
      const current = roles[roleIndex];
      if (typing) {
        charIndex++;
        textSpan.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          typing = false;
          setTimeout(tick, HOLD_TIME);
          return;
        }
        setTimeout(tick, TYPE_SPEED);
      } else {
        charIndex--;
        textSpan.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          typing = true;
          roleIndex = (roleIndex + 1) % roles.length;
          if (roleLinks.length && 'href' in el) el.href = roleLinks[roleIndex] || el.href;
          setTimeout(tick, GAP_TIME);
          return;
        }
        setTimeout(tick, DELETE_SPEED);
      }
    }
    tick();
  });

  /* ── ROTATE ANIM FOR SVG ──────────────────────────────── */
  const s = document.createElement('style');
  s.textContent = `@keyframes rotateSlow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`;
  document.head.appendChild(s);
});



