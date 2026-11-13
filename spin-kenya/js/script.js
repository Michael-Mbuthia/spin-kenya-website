(function () {
  "use strict";

  /* ----------------------------------------------------------
     Contact numbers — single source of truth, rendered into
     both the contact roster and the footer.
     ---------------------------------------------------------- */
  var PHONE_NUMBERS = [
    "+254112466810",
    "+254758399366",
    "+254702705015",
    "+254798258106",
    "+25457449554",
    "+254112484717",
    "+254725232915"
  ];

  function toWhatsAppLink(number) {
    var digits = number.replace(/[^\d]/g, "");
    return "https://wa.me/" + digits;
  }

  var whatsappIcon =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.41-1.36a9.87 9.87 0 0 0 4.63 1.15h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.75 14.03c-.24.68-1.4 1.3-1.93 1.37-.5.07-1.13.1-1.82-.11-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.8-4.16-4.94-4.35-.14-.19-1.19-1.58-1.19-3.02 0-1.44.75-2.15 1.02-2.44.27-.29.59-.36.79-.36.2 0 .4 0 .57.01.18.01.43-.07.67.51.24.6.83 2.05.9 2.2.07.15.12.33.02.52-.1.19-.15.31-.3.48-.15.17-.31.38-.44.51-.15.15-.31.31-.13.6.18.29.79 1.3 1.69 2.11 1.16 1.04 2.14 1.36 2.43 1.51.29.15.46.13.63-.07.17-.2.72-.83.92-1.12.19-.29.39-.24.65-.14.27.1 1.7.8 1.99.94.29.15.48.22.55.34.07.13.07.72-.17 1.4z"/></svg>';

  function renderRoster() {
    var list = document.getElementById("rosterList");
    if (!list) return;
    var html = "";
    PHONE_NUMBERS.forEach(function (number, i) {
      html +=
        '<li>' +
          '<div>' +
            '<span class="roster-name">Team Contact ' + (i + 1) + '</span><br>' +
            '<span class="roster-number">' + number + '</span>' +
          '</div>' +
          '<a class="roster-wa" href="' + toWhatsAppLink(number) + '" target="_blank" rel="noopener">' +
            whatsappIcon + ' WhatsApp' +
          '</a>' +
        '</li>';
    });
    list.innerHTML = html;
  }

  function renderFooterPhones() {
    var list = document.getElementById("footerPhones");
    if (!list) return;
    var html = "";
    PHONE_NUMBERS.forEach(function (number) {
      html +=
        '<li><a href="' + toWhatsAppLink(number) + '" target="_blank" rel="noopener">' + number + '</a></li>';
    });
    list.innerHTML = html;
  }

  /* ----------------------------------------------------------
     Hero carousel — auto-rotating crossfade between the two
     team photos, with clickable dots.
     ---------------------------------------------------------- */
  function initCarousel() {
    var slides = document.querySelectorAll("#carousel .slide");
    var dotsWrap = document.getElementById("carouselDots");
    if (!slides.length || !dotsWrap) return;

    var current = 0;
    var interval = 7500;
    var timer = null;
    var transitionMs = 2600;
    var resetTimer = null;

    slides.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", "Show photo " + (i + 1));
      if (i === 0) dot.classList.add("is-active");
      dot.addEventListener("click", function () {
        goTo(i);
        restart();
      });
      dotsWrap.appendChild(dot);
    });

    var dots = dotsWrap.querySelectorAll("button");

    function goTo(index) {
      if (index === current) return;
      var outgoing = slides[current];
      var incoming = slides[index];

      // Keep the outgoing photo as a fully opaque backdrop while the
      // incoming one fades in on top — this way there's always a solid
      // image filling the frame, so the crossfade never dips down to
      // reveal the dark page background behind it.
      outgoing.classList.remove("is-active");
      outgoing.classList.add("is-backdrop");

      incoming.classList.remove("is-backdrop");
      incoming.classList.add("is-active");

      dots[current].classList.remove("is-active");
      dots[index].classList.add("is-active");
      current = index;

      window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(function () {
        outgoing.classList.remove("is-backdrop");
      }, transitionMs);
    }

    function next() {
      goTo((current + 1) % slides.length);
    }

    function start() {
      timer = window.setInterval(next, interval);
    }

    function restart() {
      window.clearInterval(timer);
      start();
    }

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduceMotion) start();
  }

  /* ----------------------------------------------------------
     Merch carousel — three t-shirt colours, synced with a
     swatch picker. Manual only (no auto-rotate), since a
     visitor picking a colour shouldn't have it change under
     them.
     ---------------------------------------------------------- */
  function initMerchCarousel() {
    var root = document.getElementById("merchCarousel");
    var dotsWrap = document.getElementById("merchDots");
    var swatchWrap = document.getElementById("merchSwatches");
    if (!root || !dotsWrap || !swatchWrap) return;

    var slides = root.querySelectorAll(".merch-slide");
    if (!slides.length) return;

    var current = 0;

    slides.forEach(function (slide, i) {
      var color = slide.getAttribute("data-color") || "Option " + (i + 1);

      var dot = document.createElement("button");
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", "Show " + color + " t-shirt");
      if (i === 0) dot.classList.add("is-active");
      dot.addEventListener("click", function () { goTo(i); });
      dotsWrap.appendChild(dot);

      var swatch = document.createElement("button");
      swatch.type = "button";
      swatch.setAttribute("role", "tab");
      if (i === 0) swatch.classList.add("is-active");
      var dotSpan = document.createElement("span");
      dotSpan.className = "swatch-dot";
      dotSpan.style.background = color.toLowerCase();
      swatch.appendChild(dotSpan);
      swatch.appendChild(document.createTextNode(color));
      swatch.addEventListener("click", function () { goTo(i); });
      swatchWrap.appendChild(swatch);
    });

    var dots = dotsWrap.querySelectorAll("button");
    var swatches = swatchWrap.querySelectorAll("button");

    function goTo(index) {
      slides[current].classList.remove("is-active");
      dots[current].classList.remove("is-active");
      swatches[current].classList.remove("is-active");
      current = index;
      slides[current].classList.add("is-active");
      dots[current].classList.add("is-active");
      swatches[current].classList.add("is-active");
    }
  }

  /* ----------------------------------------------------------
     Nav — solid background on scroll, mobile menu toggle.
     ---------------------------------------------------------- */
  function initNav() {
    var nav = document.getElementById("nav");
    var toggle = document.getElementById("navToggle");
    if (!nav) return;

    function onScroll() {
      if (window.scrollY > 40) {
        nav.classList.add("is-scrolled");
      } else {
        nav.classList.remove("is-scrolled");
      }
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (toggle) {
      toggle.addEventListener("click", function () {
        var isOpen = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });

      document.querySelectorAll("#navMobile a").forEach(function (link) {
        link.addEventListener("click", function () {
          nav.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
        });
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderRoster();
    renderFooterPhones();
    initCarousel();
    initMerchCarousel();
    initNav();
  });
})();
