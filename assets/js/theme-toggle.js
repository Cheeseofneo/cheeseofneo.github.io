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

  function bulbIcon(theme) {
    const rays = theme === "dark"
      ? '<path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.58.51-1.1.98-1.5A6 6 0 1 0 7.93 12.5c.48.41.8.92.98 1.5"/><path d="M12 2v1"/><path d="m4.93 4.93.7.7"/><path d="M20 10h1"/><path d="m18.36 5.64.71-.71"/><path d="M3 10h1"/>'
      : '<path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.58.51-1.1.98-1.5A6 6 0 1 0 7.93 12.5c.48.41.8.92.98 1.5"/>';

    return '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + rays + '</svg>';
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;

    document.querySelectorAll("[data-theme-toggle]").forEach(function (toggle) {
      const nextTheme = theme === "dark" ? "light" : "dark";
      toggle.innerHTML = bulbIcon(theme);
      toggle.setAttribute("aria-label", "Switch to " + nextTheme + " mode");
      toggle.setAttribute("title", "Switch to " + nextTheme + " mode");
      toggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
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

  const colorSchemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handleSystemThemeChange = function () {
    if (!storedTheme()) {
      applyTheme(systemTheme());
    }
  };

  if (colorSchemeQuery.addEventListener) {
    colorSchemeQuery.addEventListener("change", handleSystemThemeChange);
  } else if (colorSchemeQuery.addListener) {
    colorSchemeQuery.addListener(handleSystemThemeChange);
  }
})();
