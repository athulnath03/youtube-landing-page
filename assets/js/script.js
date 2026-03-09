(function () {
  const toggles = document.querySelectorAll(".theme-toggle");
  const root = document.documentElement;
  const stored = localStorage.getItem("site-theme");
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  function applyTheme(theme) {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }
    // update toggle ARIA state and title for all toggles
    toggles.forEach((toggle) => {
      toggle.setAttribute("aria-checked", theme === "dark" ? "true" : "false");
      toggle.setAttribute(
        "title",
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
      );
    });
    try {
      localStorage.setItem("site-theme", theme);
    } catch (e) {}
  }
  const initial = stored || (prefersDark ? "dark" : "light");
  applyTheme(initial);
  // add event listeners to all toggles
  toggles.forEach((toggle) => {
    toggle.addEventListener("click", function () {
      const current =
        root.getAttribute("data-theme") === "dark" ? "dark" : "light";
      applyTheme(current === "dark" ? "light" : "dark");
    });
  });

  // Create button: click to open/close the create menu. Close on outside click or Escape.
  (function () {
    const createBtn = document.querySelector(".create-button");
    if (!createBtn) return;
    // ensure accessibility attributes
    createBtn.setAttribute("aria-haspopup", "true");
    createBtn.setAttribute(
      "aria-expanded",
      createBtn.classList.contains("open") ? "true" : "false",
    );

    // toggle on click
    createBtn.addEventListener("click", function (ev) {
      ev.stopPropagation();
      const isOpen = createBtn.classList.toggle("open");
      createBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      // close other open menus when create opens
      if (isOpen) {
        const notif = document.querySelector(
          ".notifications-icon-container.open",
        );
        if (notif) {
          notif.classList.remove("open");
          notif.setAttribute("aria-expanded", "false");
        }
        const user = document.querySelector(".current-user-profile.open");
        if (user) {
          user.classList.remove("open");
          user.setAttribute("aria-expanded", "false");
        }
      }
    });

    // allow keyboard toggle (Enter / Space)
    createBtn.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter" || ev.key === " ") {
        ev.preventDefault();
        createBtn.click();
      }
    });

    // click outside closes
    document.addEventListener("click", function (e) {
      if (
        !createBtn.contains(e.target) &&
        createBtn.classList.contains("open")
      ) {
        createBtn.classList.remove("open");
        createBtn.setAttribute("aria-expanded", "false");
      }
    });

    // close with Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && createBtn.classList.contains("open")) {
        createBtn.classList.remove("open");
        createBtn.setAttribute("aria-expanded", "false");
        createBtn.focus();
      }
    });
  })();
  // Notifications and User profile toggles
  (function () {
    function closeAllExcept(el) {
      document
        .querySelectorAll(
          ".create-button.open, .notifications-icon-container.open, .current-user-profile.open",
        )
        .forEach(function (node) {
          if (node !== el) {
            node.classList.remove("open");
            if (
              node.matches(".create-button") ||
              node.matches(".current-user-profile") ||
              node.matches(".notifications-icon-container")
            ) {
              node.setAttribute("aria-expanded", "false");
            }
          }
        });
    }

    // Notifications
    const notif = document.querySelector(".notifications-icon-container");
    if (notif) {
      notif.addEventListener("click", function (ev) {
        ev.stopPropagation();
        const isOpen = notif.classList.toggle("open");
        notif.setAttribute("aria-expanded", isOpen ? "true" : "false");
        if (isOpen) closeAllExcept(notif);
      });
      notif.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter" || ev.key === " ") {
          ev.preventDefault();
          notif.click();
        }
      });
    }

    // User profile
    const user = document.querySelector(".current-user-profile");
    if (user) {
      user.addEventListener("click", function (ev) {
        ev.stopPropagation();
        const isOpen = user.classList.toggle("open");
        user.setAttribute("aria-expanded", isOpen ? "true" : "false");
        if (isOpen) closeAllExcept(user);
      });
      user.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter" || ev.key === " ") {
          ev.preventDefault();
          user.click();
        }
      });
    }

    // global close on outside click
    document.addEventListener("click", function (e) {
      document
        .querySelectorAll(
          ".create-button.open, .notifications-icon-container.open, .current-user-profile.open",
        )
        .forEach(function (node) {
          if (!node.contains(e.target)) {
            node.classList.remove("open");
            node.setAttribute("aria-expanded", "false");
          }
        });
    });

    // close with escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        document
          .querySelectorAll(
            ".create-button.open, .notifications-icon-container.open, .current-user-profile.open",
          )
          .forEach(function (node) {
            node.classList.remove("open");
            node.setAttribute("aria-expanded", "false");
          });
      }
    });
  })();
})();
