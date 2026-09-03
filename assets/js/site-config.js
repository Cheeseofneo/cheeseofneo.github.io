(function () {
  const rootPath = document.currentScript.dataset.root || "";

  function toRootUrl(path) {
    if (!path || path.startsWith("http") || path.startsWith("mailto:")) {
      return path;
    }
    return rootPath + path;
  }

  function el(tag, className, html) {
    const node = document.createElement(tag);
    if (className) {
      node.className = className;
    }
    if (html !== undefined) {
      node.innerHTML = html;
    }
    return node;
  }

  function profileIcon(item) {
    const key = (item.label + " " + item.url).toLowerCase();
    let paths;

    if (key.includes("mail")) {
      paths = '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>';
    } else if (key.includes("scholar")) {
      paths = '<path d="m3 10 9-5 9 5-9 5Z"/><path d="M7 12v5c3 2 7 2 10 0v-5"/>';
    } else if (key.includes("github")) {
      paths = '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3.28-.36 6.72-1.61 6.72-7.25A5.65 5.65 0 0 0 19.22 3.3 5.44 5.44 0 0 0 19.08 0S17.9-.38 15 1.48a13.38 13.38 0 0 0-7 0C5.1-.38 3.92 0 3.92 0a5.44 5.44 0 0 0-.14 3.3 5.65 5.65 0 0 0-1.5 3.95c0 5.63 3.44 6.88 6.72 7.25A4.8 4.8 0 0 0 8 18v4"/><path d="M8 19c-3 .92-3-1.5-4-2"/>';
    } else if (key.includes("linkedin")) {
      paths = '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>';
    } else if (key.includes("cv") || key.includes("resume")) {
      paths = '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5Z"/><polyline points="14 2 14 8 20 8"/><path d="M8 13h8M8 17h8"/>';
    } else if (key.includes("blog")) {
      paths = '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V5a2 2 0 0 1 2-2h5a3 3 0 0 1 3 3v15a3 3 0 0 0-3-3Z"/><path d="M21 18a1 1 0 0 0 1-1V5a2 2 0 0 0-2-2h-5a3 3 0 0 0-3 3v15a3 3 0 0 1 3-3Z"/>';
    } else if (key.includes("publication")) {
      paths = '<path d="M16 6 4 20"/><path d="M8 6h8v8"/><path d="M4 4h6M4 9h3M4 14h2M14 20h6"/>';
    } else {
      paths = '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>';
    }

    return '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + paths + '</svg>';
  }

  async function loadConfig() {
    const response = await fetch(rootPath + "data/site.json");
    if (!response.ok) {
      throw new Error("Could not load site configuration.");
    }
    return response.json();
  }

  function applySiteSettings(config) {
    if (config.site.language) {
      document.documentElement.lang = config.site.language;
    }

    if (config.site.icon) {
      let icon = document.querySelector("link[rel='icon']");
      if (!icon) {
        icon = document.createElement("link");
        icon.rel = "icon";
        document.head.append(icon);
      }
      icon.type = "image/png";
      icon.href = toRootUrl(config.site.icon);
    }
  }

  function renderProfile(config) {
    const target = document.querySelector("[data-profile]");
    if (!target) {
      return;
    }

    const profile = config.profile;
    target.innerHTML = "";

    const header = el("div", "profile-header");
    const name = el("a", "profile-name", profile.name);
    name.href = toRootUrl("index.html");
    header.append(name);

    const button = el("button", "theme-toggle");
    button.type = "button";
    button.dataset.themeToggle = "";
    header.append(button);
    target.append(header);

    const avatar = el("img", "profile-photo");
    avatar.src = toRootUrl(profile.avatar);
    avatar.alt = profile.name;
    target.append(avatar);

    if (profile.tagline) {
      target.append(el("p", "profile-tagline", profile.tagline));
    }

    target.append(el("p", "profile-role", profile.role));
    target.append(el("p", "profile-affiliation", profile.affiliation));
    target.append(el("p", "profile-location", profile.location));

    const links = el("nav", "profile-links");
    links.setAttribute("aria-label", "Profile links");
    profile.links.forEach(function (item) {
      const link = el("a", "profile-link");
      link.href = toRootUrl(item.url);
      link.append(el("span", "profile-link-icon", profileIcon(item)));
      link.append(el("span", "profile-link-label", item.label));
      links.append(link);
    });
    target.append(links);

    if (window.applyPreferredTheme) {
      window.applyPreferredTheme();
    }
  }

  function renderPublications(config, target) {
    const publications = config.publications;
    target.innerHTML = "";

    publications.forEach(function (publication) {
      const article = el("article", "publication-card");

      const thumb = el("a", "publication-thumb");
      thumb.href = publication.links && publication.links[0] ? publication.links[0].url : toRootUrl("index.html#publications");
      thumb.setAttribute("aria-label", publication.title);

      const image = el("img");
      image.src = toRootUrl(publication.image);
      image.alt = publication.title;
      thumb.append(image);

      if (publication.badge) {
        thumb.append(el("span", "", publication.badge));
      }
      article.append(thumb);

      const body = el("div", "publication-body");
      body.append(el("h3", "", publication.title));
      body.append(el("p", "publication-authors", publication.authors));
      body.append(el("p", "publication-venue", publication.venue + ", " + publication.year));

      if (publication.links && publication.links.length) {
        const links = el("p", "publication-links");
        publication.links.forEach(function (item) {
          const link = el("a", "", item.label);
          link.href = item.url;
          links.append(link);
        });
        body.append(links);
      }

      article.append(body);
      target.append(article);
    });
  }

  function renderPostList(config, target) {
    const posts = config.posts;
    target.innerHTML = "";

    posts.forEach(function (post) {
      const item = el("li");
      const time = el("time", "", post.displayDate);
      time.dateTime = post.date;

      const link = el("a", "", post.title);
      link.href = toRootUrl(post.url);

      item.append(time, link);
      target.append(item);
    });
  }

  function renderHome(config) {
    renderProfile(config);

    document.title = config.site.title;
    document.querySelector('meta[name="description"]').content = config.site.description;

    document.querySelector("[data-about]").innerHTML = config.about.map(function (paragraph) {
      return "<p>" + paragraph + "</p>";
    }).join("");

    document.querySelector("[data-research]").innerHTML = config.researchInterests.map(function (item) {
      return "<li>" + item + "</li>";
    }).join("");

    document.querySelector("[data-notice]").innerHTML = config.notice;

    document.querySelector("[data-news]").innerHTML = config.news.map(function (item) {
      return "<li><strong>" + item.date + ":</strong> " + item.text + "</li>";
    }).join("");

    renderPublications(config, document.querySelector("[data-publications]"));
    renderPostList(config, document.querySelector("[data-posts]"));
  }

  function start() {
    const pageType = document.body.dataset.page;

    loadConfig().then(function (config) {
    applySiteSettings(config);
    if (pageType === "home") {
      renderHome(config);
    }
    }).catch(function (error) {
      console.error(error);
      document.querySelectorAll("[data-about], [data-publications], [data-posts]").forEach(function (target) {
        target.innerHTML = '<p class="config-error">Could not load <code>data/site.json</code>. Please preview the site through a local HTTP server instead of opening the HTML file directly.</p>';
      });
    });
  }

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
