(function () {
  const storageKey = "preferred-theme";
  const root = document.documentElement;

  function storedTheme() {
    try {
      return localStorage.getItem(storageKey);
    } catch (error) {
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(storageKey, theme);
    } catch (error) {
      return;
    }
  }

  function systemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function currentTheme() {
    return storedTheme() || systemTheme();
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;

    document.querySelectorAll("[data-theme-toggle]").forEach(function (toggle) {
      toggle.textContent = theme === "dark" ? "Light" : "Dark";
      toggle.setAttribute("aria-label", "Switch to " + (theme === "dark" ? "light" : "dark") + " mode");
    });
  }

  function bindToggles() {
    document.querySelectorAll("[data-theme-toggle]").forEach(function (toggle) {
      if (toggle.dataset.themeBound) {
        return;
      }
      toggle.dataset.themeBound = "true";
      toggle.addEventListener("click", function () {
        const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
        saveTheme(nextTheme);
        applyTheme(nextTheme);
      });
    });
  }

  applyTheme(currentTheme());

  window.addEventListener("DOMContentLoaded", function () {
    applyTheme(currentTheme());
    bindToggles();
  });

  window.applyPreferredTheme = function () {
    applyTheme(currentTheme());
    bindToggles();
  };

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
    if (!storedTheme()) {
      applyTheme(systemTheme());
    }
  });
})();
