/* ==========================================================================
   PRESTON SCHEEL — interactions & animation (GSAP + ScrollTrigger)
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = typeof gsap !== "undefined";
  if (hasGsap && typeof ScrollTrigger !== "undefined") gsap.registerPlugin(ScrollTrigger);

  /* ---------------------------------------------------------------- header */
  var header = document.querySelector(".site-header");
  function onScroll() {
    header.classList.toggle("scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var toggle = document.querySelector(".nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      document.body.classList.toggle("nav-open");
    });
    document.querySelectorAll(".nav a").forEach(function (a) {
      a.addEventListener("click", function () {
        document.body.classList.remove("nav-open");
      });
    });
  }

  /* ------------------------------------------------- fill shared site data */
  document.querySelectorAll("[data-site]").forEach(function (el) {
    var key = el.getAttribute("data-site");
    if (key === "email") {
      if (el.tagName === "A") el.href = "mailto:" + SITE.email;
      if (!el.textContent.trim()) el.textContent = SITE.email;
    } else if (key === "instagram" || key === "linkedin") {
      el.href = SITE[key];
    } else if (SITE[key]) {
      el.textContent = SITE[key];
    }
  });
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ------------------------------------------------------------- work grid */
  var grid = document.getElementById("workGrid");
  var flatList = []; // currently displayed works, for the lightbox
  var PREVIEW = 4;   // thumbnails shown per section before "Show more"

  function buildFigure(w, i) {
    var fig = document.createElement("figure");
    fig.innerHTML =
      '<img src="assets/img/md/' + w.slug + '.jpg" alt="' + w.title +
      '" width="' + w.w + '" height="' + w.h + '" loading="lazy" decoding="async">' +
      '<figcaption><span class="t">' + w.title + '</span><span class="c">' +
      CATEGORIES[w.cat] + "</span></figcaption>";
    fig.addEventListener("click", function () { openLightbox(i); });
    return fig;
  }

  // Add a "Show more / Show less" control to a section wrapper that starts
  // collapsed. `extras` are the figures hidden until the section is expanded.
  function addShowMore(wrap, hiddenCount, extras) {
    wrap.classList.add("collapsed");
    var bwrap = document.createElement("div");
    bwrap.className = "show-more-wrap";
    var btn = document.createElement("button");
    btn.className = "show-more";
    btn.type = "button";
    btn.textContent = "Show " + hiddenCount + " more";
    btn.addEventListener("click", function () {
      var collapsed = wrap.classList.toggle("collapsed");
      if (!collapsed) {
        btn.textContent = "Show less";
        if (hasGsap && !reduceMotion && extras.length) {
          gsap.fromTo(extras, { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: "power3.out", overwrite: true });
        }
      } else {
        btn.textContent = "Show " + hiddenCount + " more";
        wrap.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
    bwrap.appendChild(btn);
    wrap.appendChild(bwrap);
  }

  function renderGrid(filter) {
    if (!grid) return;
    grid.innerHTML = "";

    var grouped = filter === "all";
    if (grouped) {
      var order = Object.keys(CATEGORIES);
      flatList = WORKS.slice().sort(function (a, b) {
        return order.indexOf(a.cat) - order.indexOf(b.cat);
      });
    } else {
      flatList = WORKS.filter(function (w) { return w.cat === filter; });
    }

    var counts = {};
    flatList.forEach(function (w) { counts[w.cat] = (counts[w.cat] || 0) + 1; });

    // Partition the flat list into sections (one per category when grouped,
    // or a single section when a specific filter is active). Each item keeps
    // its global index into flatList so the lightbox stays correct.
    var sections = [];
    if (grouped) {
      var byCat = {};
      flatList.forEach(function (w, i) { (byCat[w.cat] = byCat[w.cat] || []).push({ w: w, i: i }); });
      Object.keys(CATEGORIES).forEach(function (c) {
        if (byCat[c]) sections.push({ cat: c, items: byCat[c] });
      });
    } else {
      sections.push({ cat: null, items: flatList.map(function (w, i) { return { w: w, i: i }; }) });
    }

    var frag = document.createDocumentFragment();
    var previewFigs = [], extraFigs = [];
    sections.forEach(function (sec) {
      var wrap = document.createElement("div");
      wrap.className = "grid-group";
      if (sec.cat) {
        wrap.innerHTML = '<h3 class="grid-cat-heading">' + CATEGORIES[sec.cat] +
          '<span class="n">' + String(counts[sec.cat]).padStart(2, "0") + "</span></h3>";
      }
      var g = document.createElement("div");
      g.className = "grid";
      var secExtras = [];
      sec.items.forEach(function (it, idx) {
        var fig = buildFigure(it.w, it.i);
        g.appendChild(fig);
        if (idx < PREVIEW) previewFigs.push(fig);
        else { extraFigs.push(fig); secExtras.push(fig); }
      });
      wrap.appendChild(g);
      if (sec.items.length > PREVIEW) addShowMore(wrap, sec.items.length - PREVIEW, secExtras);
      frag.appendChild(wrap);
    });
    grid.appendChild(frag);

    var countEl = document.querySelector("[data-count]");
    if (countEl) countEl.textContent = String(flatList.length).padStart(2, "0") + " frames";

    if (hasGsap && !reduceMotion) {
      // Only the visible preview thumbnails get the scroll-reveal; the hidden
      // extras are left fully visible so they appear instantly when expanded.
      if (extraFigs.length) gsap.set(extraFigs, { opacity: 1, y: 0 });
      gsap.set(previewFigs, { opacity: 0, y: 30 });
      ScrollTrigger.batch(previewFigs, {
        start: "top 92%",
        once: true,
        batchMax: 6,
        onEnter: function (els) {
          gsap.to(els, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power3.out", overwrite: true });
        },
      });
      ScrollTrigger.refresh();
    }
  }

  var filterWrap = document.querySelector(".filters");
  if (filterWrap && grid) {
    var cats = Object.keys(CATEGORIES);
    var btns = ['<button class="active" data-f="all">All</button>'];
    cats.forEach(function (c) {
      btns.push('<button data-f="' + c + '">' + CATEGORIES[c] + "</button>");
    });
    filterWrap.innerHTML = btns.join("");
    filterWrap.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      filterWrap.querySelectorAll("button").forEach(function (x) { x.classList.remove("active"); });
      b.classList.add("active");
      renderGrid(b.getAttribute("data-f"));
    });
    renderGrid("all");
  }

  /* -------------------------------------------------------------- lightbox */
  var lb = document.getElementById("lightbox");
  var lbIndex = 0;
  function openLightbox(i) {
    if (!lb) return;
    lbIndex = i;
    updateLightbox();
    lb.classList.add("open");
  }
  function updateLightbox() {
    var w = flatList[lbIndex];
    lb.querySelector("img").src = "assets/img/lg/" + w.slug + ".jpg";
    lb.querySelector("img").alt = w.title;
    lb.querySelector(".lb-caption").textContent =
      w.title + " — " + CATEGORIES[w.cat] + " (" + (lbIndex + 1) + "/" + flatList.length + ")";
  }
  function step(d) {
    lbIndex = (lbIndex + d + flatList.length) % flatList.length;
    updateLightbox();
  }
  if (lb) {
    lb.querySelector(".lb-close").addEventListener("click", function () { lb.classList.remove("open"); });
    lb.querySelector(".lb-prev").addEventListener("click", function (e) { e.stopPropagation(); step(-1); });
    lb.querySelector(".lb-next").addEventListener("click", function (e) { e.stopPropagation(); step(1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) lb.classList.remove("open"); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") lb.classList.remove("open");
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    });

    // Touch: swipe left/right to change photo, swipe down to close.
    // The image follows the finger for feedback, then springs back or advances.
    var lbImg = lb.querySelector("img");
    var touch = null; // {x, y, axis}
    lb.addEventListener("touchstart", function (e) {
      if (e.touches.length !== 1) { touch = null; return; }
      touch = { x: e.touches[0].clientX, y: e.touches[0].clientY, axis: null };
      lbImg.style.transition = "none";
    }, { passive: true });

    lb.addEventListener("touchmove", function (e) {
      if (!touch) return;
      var dx = e.touches[0].clientX - touch.x;
      var dy = e.touches[0].clientY - touch.y;
      if (!touch.axis && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
        touch.axis = Math.abs(dx) >= Math.abs(dy) ? "x" : "y";
      }
      if (touch.axis === "x") {
        lbImg.style.transform = "translateX(" + dx + "px)";
        lbImg.style.opacity = Math.max(0.4, 1 - Math.abs(dx) / 600);
      } else if (touch.axis === "y" && dy > 0) {
        lbImg.style.transform = "translateY(" + dy + "px)";
        lbImg.style.opacity = Math.max(0.3, 1 - dy / 400);
      }
    }, { passive: true });

    lb.addEventListener("touchend", function (e) {
      if (!touch) return;
      var dx = e.changedTouches[0].clientX - touch.x;
      var dy = e.changedTouches[0].clientY - touch.y;
      var axis = touch.axis;
      touch = null;
      lbImg.style.transition = "transform 0.25s ease, opacity 0.25s ease";
      if (axis === "x" && Math.abs(dx) > 55) {
        step(dx < 0 ? 1 : -1); // updateLightbox swaps src; reset position
        lbImg.style.transform = "";
        lbImg.style.opacity = "";
      } else if (axis === "y" && dy > 80) {
        lb.classList.remove("open");
        // reset after the overlay fade so the next open starts clean
        setTimeout(function () { lbImg.style.transform = ""; lbImg.style.opacity = ""; }, 300);
      } else {
        lbImg.style.transform = "";
        lbImg.style.opacity = "";
      }
    });
  }

  /* ----------------------------------------------------------------- films */
  var filmRow = document.getElementById("filmRow");

  function buildFilm(f) {
    var el = document.createElement("div");
    el.className = "film" + (f.vertical ? "" : " landscape");
    var poster = f.type === "youtube" ? "https://i.ytimg.com/vi/" + f.id + "/hqdefault.jpg" : f.poster;
    el.innerHTML =
      '<img src="' + poster + '" alt="' + f.title + '" loading="lazy" decoding="async">' +
      '<button class="play" aria-label="Play ' + f.title + '">' +
      '<span class="btn-circle"></span>' +
      '<span class="label">' + f.title + '</span>' +
      '<span class="sub">' + f.caption + "</span></button>";
    el.querySelector(".play").addEventListener("click", function () {
      if (f.type === "youtube") {
        el.innerHTML =
          '<iframe src="https://www.youtube.com/embed/' + f.id + '?autoplay=1&rel=0" title="' + f.title +
          '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
      } else {
        el.innerHTML =
          '<video src="' + f.src + '" poster="' + f.poster + '" controls autoplay playsinline></video>';
      }
    });
    return el;
  }

  // Render a list of films into `container`, wiring up a Show more/less
  // control when there are more than PREVIEW items.
  function renderFilmsInto(container, list) {
    if (!container) return;
    container.innerHTML = "";
    // drop any Show-more control from a previous render
    var oldWrap = container.parentNode.querySelector(".show-more-wrap");
    if (oldWrap) oldWrap.parentNode.removeChild(oldWrap);
    container.classList.remove("collapsed");

    var frag = document.createDocumentFragment();
    list.forEach(function (f) { frag.appendChild(buildFilm(f)); });
    container.appendChild(frag);

    if (list.length > PREVIEW) {
      container.classList.add("collapsed");
      var hidden = list.length - PREVIEW;
      var bwrap = document.createElement("div");
      bwrap.className = "show-more-wrap";
      var btn = document.createElement("button");
      btn.className = "show-more";
      btn.type = "button";
      btn.textContent = "Show " + hidden + " more";
      btn.addEventListener("click", function () {
        var collapsed = container.classList.toggle("collapsed");
        btn.textContent = collapsed ? ("Show " + hidden + " more") : "Show less";
        if (collapsed) container.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
      bwrap.appendChild(btn);
      container.parentNode.appendChild(bwrap);
    }
  }

  // Short-Form & Social — locally uploaded video clips.
  if (filmRow && window.FILMS) {
    renderFilmsInto(filmRow, FILMS.filter(function (f) { return f.type === "video"; }));
  }

  // Long-Form Videos — YouTube links, filterable by category.
  var longRow = document.getElementById("longRow");
  var youtube = (window.FILMS || []).filter(function (f) { return f.type === "youtube"; });
  if (longRow && youtube.length) {
    var renderLong = function (filter) {
      renderFilmsInto(longRow, youtube.filter(function (f) {
        return filter === "all" || f.cat === filter;
      }));
    };
    var longFilterWrap = document.querySelector("#longform .film-filters");
    if (longFilterWrap && window.FILM_CATEGORIES) {
      var fcats = Object.keys(FILM_CATEGORIES);
      var fbtns = ['<button class="active" data-f="all">All</button>'];
      fcats.forEach(function (c) {
        fbtns.push('<button data-f="' + c + '">' + FILM_CATEGORIES[c] + "</button>");
      });
      longFilterWrap.innerHTML = fbtns.join("");
      longFilterWrap.addEventListener("click", function (e) {
        var b = e.target.closest("button");
        if (!b) return;
        longFilterWrap.querySelectorAll("button").forEach(function (x) { x.classList.remove("active"); });
        b.classList.add("active");
        renderLong(b.getAttribute("data-f"));
      });
    }
    renderLong("all");
  }

  /* ------------------------------------------------------------ animations */
  if (!hasGsap || reduceMotion) {
    document.documentElement.classList.add("reduced-motion");
    return;
  }

  // Hero title: lines rise in
  var heroLines = document.querySelectorAll(".hero-title .line > span");
  if (heroLines.length) {
    gsap.from(heroLines, {
      yPercent: 110,
      duration: 1.1,
      stagger: 0.12,
      ease: "power4.out",
      delay: 0.15,
    });
    gsap.from(".hero-meta", { opacity: 0, y: 20, duration: 0.9, delay: 0.7, ease: "power3.out" });
    var heroImg = document.querySelector(".hero-media img");
    if (heroImg) {
      gsap.from(heroImg, { scale: 1.12, duration: 1.8, ease: "power2.out" });
      gsap.to(heroImg, {
        yPercent: 12,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
      });
    }
  }

  // Generic reveal-on-scroll
  document.querySelectorAll(".reveal").forEach(function (el) {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });
  });

  // Section headings: slight slide
  document.querySelectorAll(".section-head h2").forEach(function (el) {
    gsap.from(el, {
      xPercent: -4,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    });
  });

  // Services list rows
  document.querySelectorAll(".services-list li").forEach(function (el, i) {
    gsap.from(el, {
      opacity: 0,
      y: 24,
      duration: 0.7,
      delay: (i % 6) * 0.05,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 94%", once: true },
    });
  });

  // Big footer CTA
  var big = document.querySelector(".footer-cta a.big");
  if (big) {
    gsap.from(big, {
      yPercent: 30,
      opacity: 0,
      duration: 1.1,
      ease: "power4.out",
      scrollTrigger: { trigger: big, start: "top 92%", once: true },
    });
  }

  // Page-hero (about / contact)
  var pageH1 = document.querySelector(".page-hero h1");
  if (pageH1) {
    gsap.from(pageH1, { yPercent: 40, opacity: 0, duration: 1, ease: "power4.out", delay: 0.1 });
    gsap.from(".page-hero .sub", { opacity: 0, y: 16, duration: 0.8, delay: 0.5, ease: "power3.out" });
  }
})();
