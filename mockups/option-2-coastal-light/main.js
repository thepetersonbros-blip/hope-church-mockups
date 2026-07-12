/* Hope Bible Church — Mockup Option 2: Coastal Light */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header: transparent over hero, cream on scroll ---------- */
  var header = document.getElementById('siteHeader');
  function onHeaderScroll() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 50);
  }
  onHeaderScroll();
  window.addEventListener('scroll', onHeaderScroll, { passive: true });

  /* ---------- Mobile nav ---------- */
  var navToggle = document.getElementById('navToggle');
  if (navToggle) {
    navToggle.addEventListener('click', function () {
      var open = document.body.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* ---------- Dropdowns: hover works via CSS; click/tap toggles ---------- */
  var dropBtns = document.querySelectorAll('.has-dropdown > .nav-drop-btn');
  dropBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var li = btn.parentElement;
      var willOpen = !li.classList.contains('open');
      document.querySelectorAll('.has-dropdown.open').forEach(function (o) {
        o.classList.remove('open');
        var b = o.querySelector('.nav-drop-btn');
        if (b) b.setAttribute('aria-expanded', 'false');
      });
      li.classList.toggle('open', willOpen);
      btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.has-dropdown')) {
      document.querySelectorAll('.has-dropdown.open').forEach(function (o) {
        o.classList.remove('open');
        var b = o.querySelector('.nav-drop-btn');
        if (b) b.setAttribute('aria-expanded', 'false');
      });
    }
  });

  /* ---------- Hero headline: word-by-word rise (all pages, mobile + desktop) ---------- */
  if (!prefersReduced) {
    document.querySelectorAll('.hero h1').forEach(function (h1) {
      var delay = 0.12;
      var step = 0.075;

      function wrapWords(node) {
        Array.prototype.slice.call(node.childNodes).forEach(function (child) {
          if (child.nodeType === 3) {
            /* text node: wrap each word, keep the whitespace between them */
            var parts = child.textContent.split(/(\s+)/);
            if (!parts.length) return;
            var frag = document.createDocumentFragment();
            parts.forEach(function (part) {
              if (!part) return;
              if (/^\s+$/.test(part)) {
                frag.appendChild(document.createTextNode(part));
                return;
              }
              var w = document.createElement('span');
              w.className = 'hw';
              w.style.animationDelay = delay.toFixed(3) + 's';
              delay += step;
              w.textContent = part;
              frag.appendChild(w);
            });
            node.replaceChild(frag, child);
          } else if (child.nodeType === 1) {
            /* element node (.hero-line wrappers, .serif-italic, etc.): recurse */
            wrapWords(child);
          }
        });
      }

      wrapWords(h1);
      h1.classList.add('split');

      /* eyebrow / sub-headline / meta / CTA buttons follow the headline words */
      var hero = h1.closest('.hero');
      if (hero) {
        var after = delay + 0.2;
        hero.querySelectorAll('.hero-fade').forEach(function (el, i) {
          el.style.animationDelay = (after + i * 0.14).toFixed(3) + 's';
        });
      }
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal, .scripture[data-quote-reveal]');
  if (prefersReduced || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      var visible = entries.filter(function (e) { return e.isIntersecting; });
      visible.forEach(function (entry, i) {
        io.unobserve(entry.target);
        /* small stagger so batches (e.g. everything in view at load) cascade in */
        setTimeout(function () { entry.target.classList.add('in'); }, i * 80);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Scripture pull-quotes: word-by-word line reveal ---------- */
  document.querySelectorAll('.scripture[data-quote-reveal]').forEach(function (q) {
    if (prefersReduced) return;
    var words = q.textContent.trim().split(/\s+/);
    q.textContent = '';
    words.forEach(function (word, i) {
      var span = document.createElement('span');
      span.className = 'qw';
      span.style.transitionDelay = (i * 42) + 'ms';
      span.textContent = word;
      q.appendChild(span);
      q.appendChild(document.createTextNode(' '));
    });
  });

  /* ---------- Slow parallax drift on hero / band images ---------- */
  var parallaxEls = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  if (!prefersReduced && parallaxEls.length) {
    var ticking = false;
    var updateParallax = function () {
      parallaxEls.forEach(function (el) {
        var host = el.parentElement || el;
        var rect = host.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > window.innerHeight + 200) return;
        var speed = parseFloat(el.getAttribute('data-parallax')) || 0.12;
        var center = rect.top + rect.height / 2 - window.innerHeight / 2;
        el.style.transform = 'translateY(' + (center * -speed).toFixed(1) + 'px)';
      });
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(updateParallax); ticking = true; }
    }, { passive: true });
    updateParallax();
  }

  /* ---------- Mock form handling + toast ---------- */
  var toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  document.body.appendChild(toast);
  var toastTimer = null;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 4200);
  }
  document.querySelectorAll('form.mock-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      showToast('This is a design mockup. Nothing was sent, but on the live site this form will work.');
      form.reset();
    });
  });

  /* ---------- Sermons: series grid loads SoundCloud player ---------- */
  var seriesGrid = document.getElementById('seriesGrid');
  if (seriesGrid) {
    var playerTitle = document.getElementById('playerTitle');
    var playerArt = document.getElementById('playerArt');
    var playerFrame = document.getElementById('playerFrame');
    var playerWrap = document.getElementById('seriesPlayer');
    var cards = Array.prototype.slice.call(seriesGrid.querySelectorAll('.series-card'));

    function loadSeries(card, scroll) {
      cards.forEach(function (c) { c.classList.remove('active'); c.setAttribute('aria-pressed', 'false'); });
      card.classList.add('active');
      card.setAttribute('aria-pressed', 'true');
      var id = card.getAttribute('data-playlist');
      var title = card.getAttribute('data-title');
      var art = card.querySelector('img');
      playerTitle.textContent = title;
      if (art) { playerArt.src = art.src; playerArt.alt = title + ' sermon series artwork'; }
      playerFrame.title = title + ' sermon series on SoundCloud';
      playerFrame.src = 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/' + id +
        '&color=%23cf7a5a&auto_play=false&show_teaser=false&visual=false';
      if (scroll) playerWrap.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
    }

    cards.forEach(function (card) {
      card.addEventListener('click', function () { loadSeries(card, true); });
    });

    /* Load the current series (first card) on page load */
    if (cards.length) loadSeries(cards[0], false);

    /* Simple series filter (search) */
    var filterInput = document.getElementById('seriesFilter');
    if (filterInput) {
      filterInput.addEventListener('input', function () {
        var q = filterInput.value.trim().toLowerCase();
        cards.forEach(function (card) {
          var match = card.getAttribute('data-title').toLowerCase().indexOf(q) !== -1;
          card.style.display = match ? '' : 'none';
        });
      });
    }
  }
})();
