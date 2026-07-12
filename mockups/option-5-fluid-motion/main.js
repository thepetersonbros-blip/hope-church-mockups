/* Hope Bible Church — Mockup Option 5 "Fluid Motion" */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- header: scrolled state ---------- */
  var pill = document.querySelector(".header-pill");
  if (pill) {
    var onScroll = function () {
      pill.classList.toggle("is-scrolled", window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- mobile nav toggle ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".primary-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    document.addEventListener("click", function (e) {
      if (nav.classList.contains("open") && !nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- dropdowns: tap/click + keyboard (hover handled by CSS) ---------- */
  document.querySelectorAll(".has-dropdown").forEach(function (li) {
    var btn = li.querySelector(".nav-drop-btn");
    if (!btn) return;
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var isOpen = li.classList.contains("open");
      document.querySelectorAll(".has-dropdown.open").forEach(function (o) {
        o.classList.remove("open");
        var b = o.querySelector(".nav-drop-btn");
        if (b) b.setAttribute("aria-expanded", "false");
      });
      li.classList.toggle("open", !isOpen);
      btn.setAttribute("aria-expanded", !isOpen ? "true" : "false");
    });
  });
  document.addEventListener("click", function () {
    document.querySelectorAll(".has-dropdown.open").forEach(function (o) {
      o.classList.remove("open");
      var b = o.querySelector(".nav-drop-btn");
      if (b) b.setAttribute("aria-expanded", "false");
    });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      document.querySelectorAll(".has-dropdown.open").forEach(function (o) {
        o.classList.remove("open");
      });
      if (nav && nav.classList.contains("open")) {
        nav.classList.remove("open");
        if (toggle) toggle.setAttribute("aria-expanded", "false");
      }
    }
  });

  /* ---------- hero headline word stagger ---------- */
  document.querySelectorAll("[data-split]").forEach(function (el) {
    var words = el.textContent.trim().split(/\s+/);
    el.textContent = "";
    words.forEach(function (word, i) {
      var outer = document.createElement("span");
      outer.className = "w";
      var inner = document.createElement("span");
      inner.textContent = word;
      inner.style.setProperty("--d", (0.12 + i * 0.07).toFixed(2) + "s");
      outer.appendChild(inner);
      el.appendChild(outer);
      el.appendChild(document.createTextNode(" "));
    });
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        el.classList.add("is-in");
      });
    });
  });

  /* ---------- scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal, .reveal-scale");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- subtle cursor tilt on cards ---------- */
  if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll(".tilt").forEach(function (card) {
      var raf = null;
      card.addEventListener("mousemove", function (e) {
        if (raf) return;
        raf = requestAnimationFrame(function () {
          var r = card.getBoundingClientRect();
          var px = (e.clientX - r.left) / r.width - 0.5;
          var py = (e.clientY - r.top) / r.height - 0.5;
          card.style.transform =
            "perspective(900px) rotateY(" + (px * 3.5).toFixed(2) + "deg) rotateX(" + (-py * 3.5).toFixed(2) + "deg) translateY(-4px)";
          raf = null;
        });
      });
      card.addEventListener("mouseleave", function () {
        card.style.transform = "";
      });
    });
  }

  /* ---------- mock forms → toast ---------- */
  var toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  toast.innerHTML = '<span class="tick" aria-hidden="true">&#10003;</span><span class="toast-msg"></span>';
  document.body.appendChild(toast);
  var toastTimer = null;

  function showToast(msg) {
    toast.querySelector(".toast-msg").textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("show");
    }, 4200);
  }

  document.querySelectorAll("form.mock-form").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      showToast("Thanks! This is a design mockup — no message was sent.");
      form.reset();
    });
  });

  /* ---------- series carousel: drag + arrow buttons ---------- */
  document.querySelectorAll(".series-carousel").forEach(function (track) {
    var isDown = false, startX = 0, startScroll = 0, moved = false;

    track.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse") return; /* touch uses native scroll */
      isDown = true;
      moved = false;
      startX = e.clientX;
      startScroll = track.scrollLeft;
      track.setPointerCapture(e.pointerId);
    });
    track.addEventListener("pointermove", function (e) {
      if (!isDown) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 6) {
        moved = true;
        track.classList.add("dragging");
      }
      track.scrollLeft = startScroll - dx;
    });
    var endDrag = function () {
      isDown = false;
      setTimeout(function () { track.classList.remove("dragging"); }, 30);
    };
    track.addEventListener("pointerup", endDrag);
    track.addEventListener("pointercancel", endDrag);
    track.addEventListener("click", function (e) {
      if (moved) { e.preventDefault(); moved = false; }
    }, true);

    var shell = track.closest(".carousel-shell");
    if (shell) {
      var step = function () {
        var slide = track.querySelector(".series-slide");
        return slide ? slide.getBoundingClientRect().width + 22 : 300;
      };
      var prev = shell.querySelector("[data-carousel-prev]");
      var next = shell.querySelector("[data-carousel-next]");
      if (prev) prev.addEventListener("click", function () {
        track.scrollBy({ left: -step(), behavior: reduceMotion ? "auto" : "smooth" });
      });
      if (next) next.addEventListener("click", function () {
        track.scrollBy({ left: step(), behavior: reduceMotion ? "auto" : "smooth" });
      });
    }
  });

  /* ---------- sermons page: series player swap ---------- */
  var playerFrame = document.getElementById("series-player");
  if (playerFrame) {
    var playerTitle = document.getElementById("player-series-title");
    var playerArt = document.getElementById("player-series-art");
    var cards = Array.prototype.slice.call(document.querySelectorAll(".series-card"));

    var loadSeries = function (card, scroll) {
      cards.forEach(function (c) {
        c.classList.remove("active");
        c.setAttribute("aria-pressed", "false");
      });
      card.classList.add("active");
      card.setAttribute("aria-pressed", "true");
      var id = card.getAttribute("data-playlist");
      var title = card.getAttribute("data-title");
      playerFrame.src =
        "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/" +
        id + "&color=%23ff5500&auto_play=false";
      playerFrame.title = "SoundCloud player: " + title + " sermon series";
      if (playerTitle) playerTitle.textContent = title;
      if (playerArt) {
        var img = card.querySelector("img");
        if (img) { playerArt.src = img.src; playerArt.alt = title + " series artwork"; }
      }
      if (scroll) {
        var panel = document.getElementById("player-panel");
        if (panel) panel.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
      }
    };

    cards.forEach(function (card) {
      card.addEventListener("click", function () { loadSeries(card, true); });
    });

    /* deep-link: sermons.html#slug */
    var initial = null;
    var hash = window.location.hash.replace("#", "");
    if (hash) {
      initial = cards.find ? cards.find(function (c) { return c.getAttribute("data-slug") === hash; })
        : cards.filter(function (c) { return c.getAttribute("data-slug") === hash; })[0];
    }
    loadSeries(initial || cards[0], false);

    /* simple text filter */
    var filter = document.getElementById("series-filter");
    if (filter) {
      filter.addEventListener("input", function () {
        var q = filter.value.trim().toLowerCase();
        cards.forEach(function (card) {
          var match = card.getAttribute("data-title").toLowerCase().indexOf(q) !== -1;
          card.style.display = match ? "" : "none";
        });
      });
    }
  }
})();
