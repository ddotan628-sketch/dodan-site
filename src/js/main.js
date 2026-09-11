// Mobile nav drawer toggle
(function () {
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("mobileNav");
  var backdrop = document.getElementById("mobileNavBackdrop");
  if (!toggle || !nav) return;

  function setOpen(open) {
    nav.classList.toggle("open", open);
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (backdrop) backdrop.classList.toggle("open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }

  toggle.addEventListener("click", function () {
    setOpen(!nav.classList.contains("open"));
  });
  nav.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () { setOpen(false); });
  });
  if (backdrop) backdrop.addEventListener("click", function () { setOpen(false); });
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setOpen(false);
  });
})();

// Latest-news rotating carousel (about page hero)
(function () {
  var carousel = document.getElementById("newsCarousel");
  if (!carousel) return;
  var slides = carousel.querySelectorAll(".news-slide");
  var dots = carousel.querySelectorAll(".news-carousel__dots button");
  if (slides.length < 2) return;
  var current = 0;
  var timer;

  function show(i) {
    current = (i + slides.length) % slides.length;
    slides.forEach(function (s, idx) { s.classList.toggle("is-active", idx === current); });
    dots.forEach(function (d, idx) { d.classList.toggle("is-active", idx === current); });
  }

  function start() {
    stop();
    timer = setInterval(function () { show(current + 1); }, 5000);
  }
  function stop() { if (timer) clearInterval(timer); }

  dots.forEach(function (d) {
    d.addEventListener("click", function () {
      show(parseInt(d.dataset.index, 10));
      start();
    });
  });
  carousel.addEventListener("mouseenter", stop);
  carousel.addEventListener("mouseleave", start);

  start();
})();

// Category → maker hover panel: tap-to-toggle on touch devices
// (desktop uses pure CSS :hover, see style.css)
(function () {
  var menus = document.querySelectorAll(".maker-menu");
  if (!menus.length) return;
  var supportsHover = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (supportsHover) return;

  menus.forEach(function (menu) {
    var trigger = menu.querySelector(".maker-menu__trigger");
    if (!trigger) return;
    trigger.addEventListener("click", function () {
      var isOpen = menu.classList.contains("open");
      menus.forEach(function (m) { m.classList.remove("open"); });
      if (!isOpen) menu.classList.add("open");
      trigger.setAttribute("aria-expanded", String(!isOpen));
    });
  });

  document.addEventListener("click", function (e) {
    menus.forEach(function (m) {
      if (!m.contains(e.target)) m.classList.remove("open");
    });
  });
})();
// Makers page: category filter pills + name search over the maker grid
(function () {
  var grid = document.getElementById("makerGrid");
  if (!grid) return;
  var tiles = Array.prototype.slice.call(grid.querySelectorAll(".maker-tile"));
  var filters = document.querySelectorAll(".maker-filter");
  var search = document.getElementById("makerSearch");
  var countEl = document.getElementById("makerCount");
  var emptyEl = document.getElementById("makerEmpty");
  var activeFilter = "all";

  function apply() {
    var q = (search && search.value ? search.value.trim().toLowerCase() : "");
    var shown = 0;
    tiles.forEach(function (tile) {
      var cats = (tile.getAttribute("data-categories") || "").split(" ");
      var name = tile.getAttribute("data-name") || "";
      var matchesFilter = activeFilter === "all" || cats.indexOf(activeFilter) !== -1;
      var matchesSearch = !q || name.indexOf(q) !== -1;
      var show = matchesFilter && matchesSearch;
      tile.hidden = !show;
      if (show) shown += 1;
    });
    if (countEl) countEl.textContent = "전체 " + tiles.length + "개 중 " + shown + "개 표시";
    if (emptyEl) emptyEl.hidden = shown !== 0;
  }

  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filters.forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      activeFilter = btn.getAttribute("data-filter");
      apply();
    });
  });

  if (search) search.addEventListener("input", apply);

  apply();
})();

// Contact form submission via Web3Forms (no backend required)
// Contact form submission via Web3Forms (no backend required)
// Sign up free at https://web3forms.com to get your own access key,
// then replace the key in src/_data/site.js (web3formsKey).
(function () {
  var form = document.getElementById("contactForm");
  if (!form) return;
  var statusBox = document.getElementById("formStatus");

  function showStatus(type, message) {
    statusBox.textContent = message;
    statusBox.className = "form-status show " + type;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var submitBtn = form.querySelector("button[type=submit]");
    submitBtn.disabled = true;
    submitBtn.textContent = "전송 중...";

    var data = new FormData(form);

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: data,
    })
      .then(function (res) { return res.json(); })
      .then(function (result) {
        if (result.success) {
          showStatus("ok", "문의가 정상적으로 접수되었습니다. 빠르게 확인 후 연락드리겠습니다.");
          form.reset();
        } else {
          showStatus("err", "전송에 실패했습니다. 잠시 후 다시 시도하시거나 이메일로 문의해 주세요.");
        }
      })
      .catch(function () {
        showStatus("err", "전송 중 오류가 발생했습니다. 이메일로 문의해 주세요.");
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = "문의 보내기";
      });
  });
})();
