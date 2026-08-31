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

  async function loadConfig() {
    const response = await fetch(rootPath + "data/site.json");
    if (!response.ok) {
      throw new Error("Could not load site configuration.");
    }
    return response.json();
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

    target.append(el("p", "profile-role", profile.role));
    target.append(el("p", "profile-affiliation", profile.affiliation));
    target.append(el("p", "profile-location", profile.location));

    const links = el("nav", "profile-links");
    links.setAttribute("aria-label", "Profile links");
    profile.links.forEach(function (item) {
      const link = el("a", "", item.label);
      link.href = toRootUrl(item.url);
      links.append(link);
    });
    target.append(links);

    if (window.applyPreferredTheme) {
      window.applyPreferredTheme();
    }
  }

  function renderPublications(config, target, options) {
    const publications = options && options.limit ? config.publications.slice(0, options.limit) : config.publications;
    target.innerHTML = "";

    publications.forEach(function (publication) {
      const article = el("article", "publication-card");

      const thumb = el("a", "publication-thumb");
      thumb.href = publication.links && publication.links[0] ? publication.links[0].url : toRootUrl("publications/");
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

  function renderPostList(config, target, options) {
    const posts = options && options.limit ? config.posts.slice(0, options.limit) : config.posts;
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

    renderPublications(config, document.querySelector("[data-publications]"), { limit: 3 });
    renderPostList(config, document.querySelector("[data-posts]"), { limit: 5 });
  }

  function renderArchive(config) {
    renderPostList(config, document.querySelector("[data-posts]"));
  }

  function renderPublicationsPage(config) {
    const scholar = document.querySelector("[data-scholar]");
    const scholarLink = config.profile.links.find(function (link) {
      return link.label === "Google Scholar";
    });
    if (scholarLink) {
      scholar.href = scholarLink.url;
    }
    renderPublications(config, document.querySelector("[data-publications]"));
  }

  function start() {
    const pageType = document.body.dataset.page;

    loadConfig().then(function (config) {
    if (pageType === "home") {
      renderHome(config);
    }
    if (pageType === "archive") {
      renderArchive(config);
    }
    if (pageType === "publications") {
      renderPublicationsPage(config);
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
