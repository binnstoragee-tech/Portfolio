/* ============================================================
   ROBIN PORTFOLIO — SHARED SCRIPT
   ============================================================ */

/* ── PAGE ENTER ANIMATION ────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('pageTransition');
  if (overlay) {
    /* tiny delay so browser paints the wipe-in state first */
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay.classList.remove('wipe-in');
        overlay.classList.add('wipe-out');
      });
    });
  }

  /* ── ACTIVE NAV LINK ──────────────────────────────────── */
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── SMOOTH PAGE NAVIGATION ───────────────────────────── */
  document.querySelectorAll('a[data-nav]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = link.getAttribute('href');
      if (!target || target === '#') return;

      const o = document.getElementById('pageTransition');
      if (o) {
        o.classList.remove('wipe-out');
        o.classList.add('wipe-in');
        setTimeout(() => { location.href = target; }, 480);
      } else {
        location.href = target;
      }
    });
  });

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
        ring.style.borderColor = 'rgba(0,245,212,0.8)';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(1)';
        ring.style.width = '36px'; ring.style.height = '36px';
        ring.style.borderColor = 'rgba(0,245,212,0.6)';
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

  /* ── WORKS FILTER ─────────────────────────────────────── */
  document.querySelectorAll('#works .cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#works .cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.work-card').forEach((card, i) => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.style.transition = 'opacity 0.25s ease, transform 0.25s ease, border-color 0.35s ease, box-shadow 0.35s ease';
        card.style.opacity = '0';
        card.style.transform = 'translateY(16px) scale(0.97)';
        setTimeout(() => {
          card.style.display = show ? 'block' : 'none';
          if (show) {
            card.offsetHeight;
            card.style.transition = `opacity 0.5s ${i * 0.06}s cubic-bezier(0.22,1,0.36,1), transform 0.5s ${i * 0.06}s cubic-bezier(0.22,1,0.36,1), border-color 0.35s ease, box-shadow 0.35s ease`;
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }
        }, 160);
      });
    });
  });

  /* ── LIGHTBOX ─────────────────────────────────────────── */
  const lightbox      = document.getElementById('lightbox');
  const lightboxImg   = document.getElementById('lightboxImg');
  const lightboxCap   = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  if (lightbox) {
    document.querySelectorAll('.work-card').forEach(card => {
      card.addEventListener('click', () => {
        const img = card.querySelector('.work-img');
        if (!img || !img.src) return;
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || '';
        lightboxCap.textContent = img.dataset.title || img.alt || '';
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
    const closeLightbox = () => {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
      setTimeout(() => { lightboxImg.src = ''; }, 300);
    };
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
  }

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
