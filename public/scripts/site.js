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

(function autoSwipeContattiCards() {
  // Phone-only auto-advancing carousel for the contatti page's 3 team cards
  // (Stefano/Michele/Annamaria). The manual swipe (CSS scroll-snap,
  // site.css's own Task 46 comment) already works without any JS; this adds
  // a second, independent behavior on top of it — periodically advancing to
  // the next card on its own, only below the same `max-width:768px`
  // breakpoint that CSS switches the section from a 3-across grid to a
  // horizontal-swipe strip in the first place, so it's inert on desktop
  // (nothing to advance between — all 3 cards are already visible at once).
  //
  // `.grids-s-w_i:has(> .contatti-team)` is the exact same selector site.css
  // already uses to find this one carousel container (not `.grids-s-w_i`
  // generally, the Grids plugin's generic wrapper class reused dozens of
  // times sitewide) — kept identical on purpose so the CSS and JS are
  // provably talking about the same element, not two selectors that happen
  // to agree today.
  const container = document.querySelector(".grids-s-w_i:has(> .contatti-team)");
  if (!container) return;
  // Continuous, unrequested motion is exactly what this setting exists to
  // suppress — skip the whole feature outright for these visitors rather
  // than just picking a slower interval.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const ADVANCE_MS = 5000;
  const mobileQuery = window.matchMedia("(max-width: 768px)");
  let timer = null;
  let userInteracted = false;

  function advance() {
    if (document.hidden) return; // don't scroll a backgrounded tab
    const atEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 1;
    container.scrollTo({
      left: atEnd ? 0 : container.scrollLeft + container.clientWidth,
      behavior: "smooth",
    });
  }

  // A real touch/pointer interaction means the visitor is swiping the
  // carousel themselves — stop auto-advancing for good rather than fighting
  // their manual swipe or resuming later and undoing where they navigated to.
  function stopForGood() {
    userInteracted = true;
    if (timer) clearInterval(timer);
    timer = null;
  }

  // Re-evaluated on every viewport-width crossing of the breakpoint (not
  // just once at load) so this behaves correctly across a rotation/resize,
  // matching the same breakpoint CSS itself reacts to live.
  function syncToViewport() {
    if (userInteracted) return;
    if (mobileQuery.matches && !timer) {
      timer = setInterval(advance, ADVANCE_MS);
    } else if (!mobileQuery.matches && timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  container.addEventListener("touchstart", stopForGood, { passive: true, once: true });
  container.addEventListener("pointerdown", stopForGood, { once: true });
  mobileQuery.addEventListener("change", syncToViewport);
  syncToViewport();
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
