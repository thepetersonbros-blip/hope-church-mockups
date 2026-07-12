/* Hope Bible Church — Mockup Option 4: Warm Storyteller */
(function () {
  "use strict";

  var motionOK = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Sticky header: transparent -> cream ---------- */
  var header = document.getElementById("siteHeader");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var menuToggle = document.querySelector(".menu-toggle");
  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ---------- Dropdowns: hover (CSS) on desktop, tap toggle everywhere ---------- */
  document.querySelectorAll(".has-drop > .drop-toggle").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var li = btn.parentElement;
      var open = li.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      document.querySelectorAll(".has-drop.open").forEach(function (other) {
        if (other !== li) {
          other.classList.remove("open");
          var t = other.querySelector(".drop-toggle");
          if (t) t.setAttribute("aria-expanded", "false");
        }
      });
    });
  });
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".has-drop")) {
      document.querySelectorAll(".has-drop.open").forEach(function (li) {
        li.classList.remove("open");
        var t = li.querySelector(".drop-toggle");
        if (t) t.setAttribute("aria-expanded", "false");
      });
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      document.body.classList.remove("nav-open");
      if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
      document.querySelectorAll(".has-drop.open").forEach(function (li) {
        li.classList.remove("open");
      });
    }
  });

  /* ---------- Scroll reveal + scripture settle-in ---------- */
  var animated = document.querySelectorAll(".reveal, .settle");
  if (!motionOK || !("IntersectionObserver" in window)) {
    animated.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -40px 0px" }
    );
    animated.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Mock form handling + toast ---------- */
  var toast = document.getElementById("toast");
  var toastTimer;
  function showToast(msg) {
    if (!toast) return;
    toast.innerHTML = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("show");
    }, 4200);
  }
  document.querySelectorAll("form[data-mock]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      showToast(
        "<strong>Thanks!</strong> This is a design mockup — nothing was actually sent."
      );
      form.reset();
    });
  });

  /* ---------- Sermons: series grid -> inline player swap ---------- */
  var grid = document.getElementById("seriesGrid");
  if (grid) {
    var playerFrame = document.getElementById("sermonPlayer");
    var playerTitle = document.getElementById("playerTitle");
    var playerArt = document.getElementById("playerArt");
    var panel = document.getElementById("playerPanel");
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".series-card"));

    cards.forEach(function (card) {
      card.addEventListener("click", function () {
        var id = card.getAttribute("data-playlist");
        var title = card.getAttribute("data-title");
        var art = card.getAttribute("data-art");
        playerFrame.src =
          "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/" +
          id +
          "&color=%23d99a3d&auto_play=false";
        playerFrame.title = title + " — sermon audio player";
        if (playerTitle) playerTitle.textContent = title;
        if (playerArt && art) {
          playerArt.src = art;
          playerArt.alt = title + " sermon series artwork";
        }
        cards.forEach(function (c) {
          c.classList.toggle("active", c === card);
          c.setAttribute("aria-pressed", c === card ? "true" : "false");
        });
        if (panel) {
          panel.scrollIntoView({
            behavior: motionOK ? "smooth" : "auto",
            block: "center"
          });
        }
      });
    });

    /* Simple series filter */
    var filter = document.getElementById("seriesFilter");
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
