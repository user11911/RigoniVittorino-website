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
