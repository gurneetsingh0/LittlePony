document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".main-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      window.location.href = "shop.html";
    });
  });
});

(() => {
  const panel = document.getElementById("mobile-panel");
  const menuIcon = document.querySelector("#nav3 img");
  const panelLinks = panel?.querySelectorAll(".panel-link");

  if (!panel || !menuIcon) return;

  const SNAP_RATIO = 0.3;
  const AUTO_CLOSE_KEY = "panelAutoCloseAt";

  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let dragging = false;
  let intentLocked = false;
  let horizontalIntent = false;

  const vw = () => window.innerWidth;

  function openPanel() {
    panel.classList.add("active");
    document.body.classList.add("panel-open");
    panel.style.transform = "";
    panel.style.transition = "";
  }

  function closePanel() {
    panel.classList.remove("active");
    document.body.classList.remove("panel-open");
    panel.style.transform = "";
    panel.style.transition = "";
  }

  menuIcon.addEventListener("click", openPanel);

  panelLinks?.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth > 700) return;

      sessionStorage.setItem(AUTO_CLOSE_KEY, Date.now().toString());
    });
  });

  document.addEventListener(
    "touchstart",
    (e) => {
      if (window.innerWidth > 700) return;
      if (!panel.classList.contains("active") && window.scrollY !== 0) return;

      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
      currentX = startX;

      dragging = true;
      intentLocked = false;
      horizontalIntent = false;

      panel.style.transition = "none";
    },
    { passive: true }
  );

  document.addEventListener(
    "touchmove",
    (e) => {
      if (!dragging) return;

      const t = e.touches[0];
      currentX = t.clientX;

      const dx = currentX - startX;
      const dy = t.clientY - startY;

      if (!intentLocked) {
        intentLocked = true;
        horizontalIntent = Math.abs(dx) > Math.abs(dy);
      }

      if (!horizontalIntent) {
        dragging = false;
        panel.style.transition = "";
        panel.style.transform = "";
        return;
      }

      if (!panel.classList.contains("active") && dx < 0) {
        const progress = Math.min(Math.abs(dx) / vw(), 1);
        panel.style.transform = `translateX(${100 - progress * 100}%)`;
      }

      if (panel.classList.contains("active") && dx > 0) {
        const progress = Math.min(dx / vw(), 1);
        panel.style.transform = `translateX(${progress * 100}%)`;
      }
    },
    { passive: true }
  );

  document.addEventListener("touchend", () => {
    if (!dragging) return;

    const dx = currentX - startX;
    const progress = Math.abs(dx) / vw();

    panel.style.transition = "";

    if (!panel.classList.contains("active")) {
      progress > SNAP_RATIO && dx < 0
        ? openPanel()
        : (panel.style.transform = "");
    } else {
      progress > SNAP_RATIO && dx > 0
        ? closePanel()
        : (panel.style.transform = "");
    }

    dragging = false;
    intentLocked = false;
  });

  const autoCloseAt = sessionStorage.getItem(AUTO_CLOSE_KEY);
  const navEntry = performance.getEntriesByType("navigation")[0];

  const isFreshNavigation = navEntry && navEntry.type === "navigate";

  if (autoCloseAt && isFreshNavigation) {
    sessionStorage.removeItem(AUTO_CLOSE_KEY);

    panel.classList.add("active");
    document.body.classList.add("panel-open");
    panel.style.transition = "none";
    panel.style.transform = "translateX(0)";

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        panel.style.transition = "";
        closePanel();
      });
    });
  } else {
    sessionStorage.removeItem(AUTO_CLOSE_KEY);
  }
})();
