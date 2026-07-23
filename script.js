/* ============================================================
   ROBIN PORTFOLIO — SHARED SCRIPT
   ============================================================ */

/* ── FLOATING CHAT BUBBLE (WhatsApp + Viber) — every page ─── */
(function() {
  const PHONE_INTL = '639695159058'; // +63 969 515 9058, digits only for wa.me
  const VIBER_INTL = '9609304700'; // +960 9304700, Maldives number, digits only for Viber
  const chatHTML = `
    <div class="chat-fab-wrap" id="chatFabWrap">
      <div class="chat-fab-panel" id="chatFabPanel">
        <div class="chat-fab-panel-head">
          <span class="chat-fab-panel-title">Let's Connect</span>
          <span class="chat-fab-panel-sub">Pick a platform to chat</span>
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
      <button class="chat-fab-btn" id="chatFabBtn" aria-label="Chat with me">
        <span class="chat-fab-tooltip" aria-hidden="true">
          <span class="chat-fab-tooltip-text chat-fab-tooltip-whatsapp">Chat on WhatsApp</span>
          <span class="chat-fab-tooltip-text chat-fab-tooltip-viber">Chat on Viber</span>
        </span>
        <span class="chat-fab-icon-wrap">
          <img class="chat-fab-icon chat-fab-icon-whatsapp" src="IMG/whatsapp.webp" alt="WhatsApp">
          <img class="chat-fab-icon chat-fab-icon-viber" src="IMG/viber.png" alt="Viber">
        </span>
        <svg class="chat-fab-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </div>`;
  document.body.insertAdjacentHTML('beforeend', chatHTML);

  const wrap = document.getElementById('chatFabWrap');
  const btn  = document.getElementById('chatFabBtn');
  if (wrap && btn) {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      wrap.classList.toggle('open');
    });
    document.addEventListener('click', e => {
      if (!wrap.contains(e.target)) wrap.classList.remove('open');
    });
  }
})();

/* ── PAGE ENTER ANIMATION ────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

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
  const navAnchors = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
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
        ring.style.borderColor = 'rgba(2,245,161,0.8)';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(1)';
        ring.style.width = '36px'; ring.style.height = '36px';
        ring.style.borderColor = 'rgba(2,245,161,0.6)';
      });
    });
  }

  /* ── SCROLL REVEAL ────────────────────────────────────── */
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), 100);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal, .timeline-item, .exp-card, .work-card').forEach(el => {
    revealObserver.observe(el);
  });

  /* ── SKILL BARS ───────────────────────────────────────── */
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
  document.querySelectorAll('#skillsGrid').forEach(g => barObserver.observe(g));

  /* ── SKILL FILTER ─────────────────────────────────────── */
  document.querySelectorAll('#skills .cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#skills .cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.skill-card').forEach(card => {
        card.style.display = (filter === 'all' || card.dataset.category === filter) ? 'block' : 'none';
      });
    });
  });

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

  /* ── WORKS CAROUSEL ───────────────────────────────────── */
  (function() {
    const worksGrid = document.getElementById('worksGrid');
    if (!worksGrid) return;

    const allItems = Array.from(worksGrid.querySelectorAll('.work-item'));
    const prevBtn  = document.getElementById('carouselPrev');
    const nextBtn  = document.getElementById('carouselNext');
    if (!allItems.length || !prevBtn || !nextBtn) return;

    let visibleItems = allItems.slice();
    let current = 0;

    function layout() {
      const total = visibleItems.length;
      allItems.forEach(item => {
        item.classList.remove('cs-active', 'cs-visible');
        item.style.display = 'none';
        const vid = item.querySelector('video.work-img');
        if (vid && !vid.paused) vid.pause();
      });
      if (!total) return;

      const mobile  = window.innerWidth <= 768;
      const spacing = mobile ? 130 : 340;

      visibleItems.forEach((item, i) => {
        let diff = i - current;
        if (diff > total / 2) diff -= total;
        if (diff < -total / 2) diff += total;
        if (Math.abs(diff) > 2) return;

        item.style.display = 'flex';
        item.classList.add('cs-visible');
        if (diff === 0) {
          item.classList.add('cs-active');
          const vid = item.querySelector('video.work-img');
          if (vid) {
            vid.muted = true; // some mobile browsers only honor the JS property, not just the attribute
            const tryPlay = () => vid.play().catch(() => {});
            tryPlay();
            if (vid.readyState < 2) {
              vid.addEventListener('canplay', tryPlay, { once: true });
            }
          }
        }

        const scale   = diff === 0 ? 1 : (Math.abs(diff) === 1 ? 0.72 : 0.5);
        const opacity = diff === 0 ? 1 : (Math.abs(diff) === 1 ? 0.55 : 0.22);
        const blur    = diff === 0 ? 0 : Math.min(Math.abs(diff) * 1.5, 3);

        item.style.transform = `translate(-50%, -50%) translateX(${diff * spacing}px) scale(${scale})`;
        item.style.opacity   = String(opacity);
        item.style.zIndex    = String(10 - Math.abs(diff));
        item.style.filter    = `blur(${blur}px)`;
      });
    }

    function goTo(index) {
      const total = visibleItems.length;
      if (!total) return;
      current = ((index % total) + total) % total;
      layout();
    }
    const next = () => goTo(current + 1);
    const prev = () => goTo(current - 1);

    /* ── AUTO SLIDESHOW (every 2s, only while "All" filter is active) ── */
    let autoSlideTimer = null;
    let autoSlideEnabled = true; // tracks whether current filter is "all"
    function startAutoSlide() {
      stopAutoSlide();
      if (!autoSlideEnabled) return;
      autoSlideTimer = setInterval(next, 2000);
    }
    function stopAutoSlide() {
      if (autoSlideTimer) { clearInterval(autoSlideTimer); autoSlideTimer = null; }
    }
    function restartAutoSlide() { startAutoSlide(); } // resets the 2s timer after manual navigation

    pauseWorksAutoSlide  = stopAutoSlide;
    resumeWorksAutoSlide = restartAutoSlide;

    prevBtn.addEventListener('click', () => { prev(); restartAutoSlide(); });
    nextBtn.addEventListener('click', () => { next(); restartAutoSlide(); });

    /* clicking a peeking (non-active) slide brings it to center
       instead of opening the lightbox */
    allItems.forEach(item => {
      item.addEventListener('click', e => {
        if (!item.classList.contains('cs-active')) {
          e.stopPropagation();
          e.preventDefault();
          const idx = visibleItems.indexOf(item);
          if (idx !== -1) goTo(idx);
          restartAutoSlide();
        }
      }, true);
    });

    /* swipe support on mobile */
    let touchStartX = null;
    worksGrid.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    worksGrid.addEventListener('touchend', e => {
      if (touchStartX === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (dx > 40) { prev(); restartAutoSlide(); }
      else if (dx < -40) { next(); restartAutoSlide(); }
      touchStartX = null;
    }, { passive: true });

    window.addEventListener('resize', layout);

    /* ── FILTER INTEGRATION ────────────────────────────── */
    document.querySelectorAll('#works .cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#works .cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        visibleItems = allItems.filter(item => filter === 'all' || item.dataset.category === filter);
        current = 0;
        layout();
        autoSlideEnabled = (filter === 'all');
        startAutoSlide();
      });
    });

    layout();
    startAutoSlide();

    /* fallback: some mobile browsers still block autoplay even when muted
       until the very first tap anywhere on the page — nudge the active
       reel to play once that happens. */
    const nudgeActiveReel = () => {
      const activeVid = worksGrid.querySelector('.work-item.cs-active video.work-img');
      if (activeVid && activeVid.paused) activeVid.play().catch(() => {});
    };
    document.addEventListener('touchstart', nudgeActiveReel, { once: true, passive: true });
    document.addEventListener('click', nudgeActiveReel, { once: true });
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
      lightboxCap.textContent = img.dataset.title || img.alt || '';
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
      lightboxCap.textContent = vid.closest('.work-item')?.querySelector('.work-label-top')?.textContent || '';
      lightboxVideo.src = vid.currentSrc || vid.src;
      lightboxVideo.muted = false;
      lightboxVideo.currentTime = 0;
      lightboxVideo.play().catch(() => {});
      pauseWorksAutoSlide();
    };

    document.querySelectorAll('.work-item--story .work-card').forEach(card => {
      card.addEventListener('click', e => {
        if (e.target.closest('.video-mute-btn')) return;
        const item = card.closest('.work-item');
        if (!item || !item.classList.contains('cs-active')) return; // only the centered slide opens
        const vid = card.querySelector('video.work-img');
        if (!vid) return;
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
        openedCardVideo.play().catch(() => {});
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

  /* Note: video autoplay for the works carousel is now handled inside the
     WORKS CAROUSEL block above (plays only the active/center slide). */

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

  /* ── ROTATE ANIM FOR SVG ──────────────────────────────── */
  const s = document.createElement('style');
  s.textContent = `@keyframes rotateSlow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`;
  document.head.appendChild(s);
});

/* ── HEX 3D TILT (desktop only) ──────────────────────── */
(function() {
  const hexVisual = document.querySelector('.home-visual');
  const hexFrame  = document.querySelector('.hex-frame');
  if (!hexVisual || !hexFrame) return;
  if (window.innerWidth <= 768) return;
  hexVisual.addEventListener('mousemove', (e) => {
    const rect = hexVisual.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    hexFrame.style.animation = 'none';
    hexFrame.style.transform = `rotateX(${-dy * 20}deg) rotateY(${dx * 20}deg) translateY(-8px)`;
  });
  hexVisual.addEventListener('mouseleave', () => {
    hexFrame.style.transform = '';
    hexFrame.style.animation = 'hexFloat 4s ease-in-out infinite';
  });
})();
