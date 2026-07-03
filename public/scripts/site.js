// Small vanilla-JS site behaviors that replace jQuery-plugin equivalents from the
// original WordPress site (see IMPLEMENTATION_NOTES.md "Reproduced third-party
// behavior" section):
//  - sticky header on scroll (was geppa-js.min.js, a 3-line jQuery snippet)
//  - active nav-item highlighting (the header partial is shared across every page,
//    so the "current" page link is marked here instead of per-page templating)

(function stickyHeader() {
  const header = document.querySelector("#site-header");
  if (!header) return;
  function update() {
    if (window.scrollY > 0) header.classList.add("sticky");
    else header.classList.remove("sticky");
  }
  window.addEventListener("scroll", update, { passive: true });
  update();
})();

// Progressively enhances the verbatim-preserved "featured wines" Getwid
// images-slider markup on the homepage into a working one-at-a-time carousel with
// prev/next arrows, reading its autoplay/loop config straight from the original
// data-* attributes. Replaces Getwid's own jQuery+Slick-based runtime (see
// IMPLEMENTATION_NOTES.md) with a small vanilla implementation.
(function enhanceImageSliders() {
  document.querySelectorAll(".wp-block-getwid-images-slider__wrapper").forEach((wrapper) => {
    const items = Array.from(wrapper.querySelectorAll(":scope > .wp-block-getwid-images-slider__item"));
    if (items.length < 2) return;

    wrapper.setAttribute("data-enhanced", "true");
    let current = 0;
    items[0].classList.add("is-active");

    const prev = document.createElement("button");
    prev.className = "getwid-slider-arrow prev";
    prev.setAttribute("aria-label", "Precedente");
    prev.innerHTML = "&#8249;";
    const next = document.createElement("button");
    next.className = "getwid-slider-arrow next";
    next.setAttribute("aria-label", "Successivo");
    next.innerHTML = "&#8250;";
    wrapper.append(prev, next);

    function show(index) {
      items[current].classList.remove("is-active");
      current = (index + items.length) % items.length;
      items[current].classList.add("is-active");
    }

    prev.addEventListener("click", () => {
      show(current - 1);
      restartAutoplay();
    });
    next.addEventListener("click", () => {
      show(current + 1);
      restartAutoplay();
    });

    const autoplay = wrapper.dataset.autoplay === "true";
    const speed = Number(wrapper.dataset.autoplaySpeed) || 6000;
    let timer;
    function restartAutoplay() {
      if (!autoplay) return;
      clearInterval(timer);
      timer = setInterval(() => show(current + 1), speed);
    }
    restartAutoplay();
  });
})();

// "More..." share popup toggle (was social-share-button plugin JS; the share links
// themselves are plain static URLs needing no plugin runtime at all).
(function shareButtonPopups() {
  document.querySelectorAll(".share-button-more").forEach((moreLink) => {
    moreLink.addEventListener("click", (e) => {
      e.preventDefault();
      const popup = moreLink.parentElement.querySelector(".wp-share-button-popup");
      if (popup) popup.classList.toggle("is-open");
    });
  });
  document.querySelectorAll(".wp-share-button-popup .close").forEach((closeBtn) => {
    closeBtn.addEventListener("click", () => {
      closeBtn.closest(".wp-share-button-popup")?.classList.remove("is-open");
    });
  });
})();

(function markActiveNav() {
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  document.querySelectorAll(".primary-menu a, .modal-menu a").forEach((a) => {
    let hrefUrl;
    try {
      hrefUrl = new URL(a.getAttribute("href"), window.location.origin);
    } catch {
      return;
    }
    if (hrefUrl.origin !== window.location.origin) return;
    const hrefPath = hrefUrl.pathname.replace(/\/$/, "") || "/";
    if (hrefPath === path) {
      a.setAttribute("aria-current", "page");
      const li = a.closest("li.menu-item");
      if (li) li.classList.add("current-menu-item");
      const parentLi = a.closest("li.menu-item-has-children");
      if (parentLi && parentLi !== li) parentLi.classList.add("current-menu-item");
    }
  });
})();
