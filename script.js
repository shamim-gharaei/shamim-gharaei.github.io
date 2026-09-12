document.addEventListener("DOMContentLoaded", () => {
  const html = document.documentElement;

  /* THEME */
  const themeToggle = document.getElementById("theme-toggle");
  const savedTheme = localStorage.getItem("theme");
  html.setAttribute("data-theme", savedTheme === "dark" ? "dark" : "light");

  function updateThemeButton() {
    if (!themeToggle) return;
    const dark = html.getAttribute("data-theme") === "dark";
    themeToggle.textContent = dark ? "☀" : "☾";
    themeToggle.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  }

  updateThemeButton();

  themeToggle?.addEventListener("click", () => {
    const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    updateThemeButton();
  });

  /* LANGUAGE + GITHUB PROJECTS */
  let currentLanguage = localStorage.getItem("portfolio-language") === "fr" ? "fr" : "en";
  const languageButtons = document.querySelectorAll(".language-button");

  const projectsContainer = document.getElementById("github-projects");
  const githubUsername = "shamim-gharaei";

  const projectConfig = [
    {
      repo: "network-intrusion-anomaly-detection",
      title: "Network Intrusion Anomaly Detection",
      descriptionEn: "A machine-learning project exploring PortScan detection using network-traffic data from CICIDS2017.",
      descriptionFr: "Un projet d'apprentissage automatique explorant la détection de PortScan à partir de données de trafic réseau CICIDS2017.",
      tags: ["Python", "Pandas", "scikit-learn", "CICIDS2017"]
    },
    {
      repo: "social-network-anomaly-analysis",
      title: "Social Network Anomaly Analysis",
      descriptionEn: "A graph-based project exploring structural characteristics and anomaly identification in social-network data using Python and NetworkX.",
      descriptionFr: "Un projet fondé sur les graphes explorant les caractéristiques structurelles et l'identification d'anomalies dans des données de réseaux sociaux avec Python et NetworkX.",
      tags: ["Python", "NetworkX", "Graph Analysis"]
    }
  ];

  function prettyLanguage(language) {
    if (!language) return "GitHub";
    return language;
  }

  function renderProjects(repositories) {
    if (!projectsContainer) return;

    projectsContainer.innerHTML = "";

    projectConfig.forEach((config, index) => {
      const repo = repositories.find((item) => item.name === config.repo) || {};
      const card = document.createElement("a");
      card.className = `project-card project-card-${index + 1}`;
      card.href = repo.html_url || `https://github.com/${githubUsername}/${config.repo}`;
      card.target = "_blank";
      card.rel = "noopener noreferrer";

      const updated = repo.updated_at
        ? new Date(repo.updated_at).toLocaleDateString(
            currentLanguage === "fr" ? "fr-FR" : "en-US",
            { month: "short", year: "numeric" }
          )
        : "GitHub";

      const updatedLabel = currentLanguage === "fr" ? "Mis à jour" : "Updated";
      const description = currentLanguage === "fr" ? config.descriptionFr : config.descriptionEn;

      card.innerHTML = `
        <div class="project-header">
          <div class="project-title-wrap">
            <div class="github-project-icon">GH</div>
            <h3>${config.title}</h3>
          </div>
          <span class="project-arrow">↗</span>
        </div>
        <p class="project-description">${description}</p>
        <div class="project-tech">
          ${config.tags.map((tag) => `<span>${tag}</span>`).join("")}
        </div>
        <div class="project-meta">
          <span>${prettyLanguage(repo.language)}</span>
          <span>★ ${repo.stargazers_count ?? 0}</span>
          <span>${updatedLabel} ${updated}</span>
        </div>
      `;

      projectsContainer.appendChild(card);
    });
  }

  function applyLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem("portfolio-language", lang);
    html.lang = lang;

    document.querySelectorAll("[data-en][data-fr]").forEach((element) => {
      const value = element.dataset[lang];
      if (typeof value === "string") element.textContent = value;
    });

    languageButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.lang === lang);
    });

    if (window.__portfolioRepos) {
      renderProjects(window.__portfolioRepos);
    }
  }

  languageButtons.forEach((button) => {
    button.addEventListener("click", () => applyLanguage(button.dataset.lang));
  });

  applyLanguage(currentLanguage);

  async function loadGitHubProjects() {
    if (!projectsContainer) return;

    // Render immediately so the section never stays stuck on "Loading...".
    renderProjects([]);

    try {
      const response = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=100`);
      if (!response.ok) throw new Error("GitHub API request failed");
      const repositories = await response.json();
      window.__portfolioRepos = repositories;
      renderProjects(repositories);
    } catch (error) {
      console.error("GitHub projects:", error);
      window.__portfolioRepos = [];
      renderProjects([]);
    }
  }

  loadGitHubProjects();

  /* REVEAL */
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  /* ACTIVE NAV */
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  if ("IntersectionObserver" in window) {
    const navigationObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => link.classList.remove("active"));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        active?.classList.add("active");
      });
    }, { rootMargin: "-38% 0px -52% 0px" });

    sections.forEach((section) => navigationObserver.observe(section));
  }

  /* SCROLL PROGRESS */
  const progressBar = document.getElementById("scroll-progress");
  function updateScrollProgress() {
    if (!progressBar) return;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const percentage = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
    progressBar.style.width = `${percentage}%`;
  }
  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  updateScrollProgress();

  /* HERO PARALLAX */
  const heroVisual = document.getElementById("hero-visual");
  if (heroVisual) {
    window.addEventListener("mousemove", (event) => {
      if (window.innerWidth < 1000) return;
      const x = (event.clientX / window.innerWidth - 0.5) * 8;
      const y = (event.clientY / window.innerHeight - 0.5) * 8;
      heroVisual.style.transform = `translate(${x}px, ${y}px)`;
    }, { passive: true });
  }

  /* GRAPH TOOLTIP */
  const graphTooltip = document.getElementById("graph-tooltip");
  const networkWrapper = document.querySelector(".network-wrapper");

  if (graphTooltip && networkWrapper) {
    document.querySelectorAll(".graph-node").forEach((node) => {
      node.addEventListener("mouseenter", (event) => {
        const label = currentLanguage === "fr" ? event.target.dataset.labelFr : event.target.dataset.labelEn;
        graphTooltip.textContent = label || "Research Area";
        const nodeRect = event.target.getBoundingClientRect();
        const wrapperRect = networkWrapper.getBoundingClientRect();
        graphTooltip.style.left = `${nodeRect.left - wrapperRect.left + nodeRect.width / 2}px`;
        graphTooltip.style.top = `${nodeRect.top - wrapperRect.top}px`;
        graphTooltip.classList.add("visible");
      });
      node.addEventListener("mouseleave", () => graphTooltip.classList.remove("visible"));
    });
  }

  /* PAPER MODAL */
  const paperModal = document.getElementById("paper-modal");
  const openPaperButtons = document.querySelectorAll("[data-open-paper]");
  const closeModalButtons = document.querySelectorAll("[data-modal-close]");

  function openPaperModal() {
    if (!paperModal) return;
    paperModal.classList.add("open");
    paperModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function closePaperModal() {
    if (!paperModal) return;
    paperModal.classList.remove("open");
    paperModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  openPaperButtons.forEach((button) => button.addEventListener("click", openPaperModal));
  closeModalButtons.forEach((button) => button.addEventListener("click", closePaperModal));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closePaperModal();
  });

  /* COPY CITATION */
  const citationText = "Dabaghi-Zarandi, F., Gharaei, S., & Zeynali, A. (2025). Anomaly Detection in Social Networks: A Taxonomy of Methods, Research Challenges, and Future Directions. National Conference on Information Technology, Nanotechnology, Artificial Intelligence and Technological Futures Studies.";
  const citationMessage = document.getElementById("citation-message");
  const copyButtons = [document.getElementById("copy-citation"), document.getElementById("modal-copy-citation")].filter(Boolean);

  async function copyCitation(button) {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(citationText);
      } else {
        const temporary = document.createElement("textarea");
        temporary.value = citationText;
        document.body.appendChild(temporary);
        temporary.select();
        document.execCommand("copy");
        temporary.remove();
      }

      const original = button.textContent;
      button.textContent = currentLanguage === "fr" ? "Copié ✓" : "Copied ✓";
      if (citationMessage) citationMessage.textContent = currentLanguage === "fr" ? "Référence copiée." : "Citation copied to clipboard.";
      setTimeout(() => {
        button.textContent = original;
        if (citationMessage) citationMessage.textContent = "";
      }, 1800);
    } catch (error) {
      console.error("Clipboard:", error);
      if (citationMessage) citationMessage.textContent = currentLanguage === "fr" ? "Impossible de copier automatiquement." : "Unable to copy automatically.";
    }
  }

  copyButtons.forEach((button) => button.addEventListener("click", () => copyCitation(button)));

  /* CURSOR GLOW */
  const cursorGlow = document.getElementById("cursor-glow");
  if (cursorGlow && window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener("mousemove", (event) => {
      cursorGlow.style.left = `${event.clientX}px`;
      cursorGlow.style.top = `${event.clientY}px`;
      cursorGlow.style.opacity = "1";
    }, { passive: true });
    document.addEventListener("mouseleave", () => { cursorGlow.style.opacity = "0"; });
  }

  /* BACK TO TOP */
  const backToTop = document.getElementById("back-to-top");
  function updateBackToTop() {
    if (!backToTop) return;
    backToTop.classList.toggle("visible", window.scrollY > 650);
  }
  window.addEventListener("scroll", updateBackToTop, { passive: true });
  backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  updateBackToTop();
});
