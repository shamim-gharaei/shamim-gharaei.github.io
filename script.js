document.addEventListener("DOMContentLoaded", () => {
  const html = document.documentElement;
  const body = document.body;

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

  /* MOBILE NAV */
  const menuToggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("primary-nav");

  function closeMenu() {
    if (!menuToggle || !nav) return;
    menuToggle.classList.remove("open");
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  }

  menuToggle?.addEventListener("click", () => {
    const open = nav?.classList.toggle("open");
    menuToggle.classList.toggle("open", Boolean(open));
    menuToggle.setAttribute("aria-expanded", String(Boolean(open)));
    menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });

  nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  window.addEventListener("resize", () => {
    if (window.innerWidth > 940) closeMenu();
  });

  /* PROJECT DATA USED BY LANGUAGE + OPTIONAL GITHUB ENRICHMENT */
  const githubUsername = "shamim-gharaei";
  let repositoryCache = [];

  /* LANGUAGE */
  let currentLanguage = localStorage.getItem("portfolio-language") === "fr" ? "fr" : "en";
  const languageButtons = document.querySelectorAll(".language-button");

  function applyLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem("portfolio-language", lang);
    html.lang = lang;

    document.querySelectorAll("[data-en][data-fr]").forEach((element) => {
      const value = element.dataset[lang];
      if (typeof value === "string") element.textContent = value;
    });

    languageButtons.forEach((button) => {
      const active = button.dataset.lang === lang;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    updateProjectMetadataLabels();
  }

  languageButtons.forEach((button) => {
    button.addEventListener("click", () => applyLanguage(button.dataset.lang));
  });
  applyLanguage(currentLanguage);

  /* STATIC PROJECT CARDS + OPTIONAL GITHUB ENRICHMENT */
  function updateProjectMetadataLabels() {
    document.querySelectorAll(".project-card[data-repo]").forEach((card) => {
      const repoName = card.dataset.repo;
      const repo = repositoryCache.find((item) => item.name === repoName);
      if (!repo) return;

      const language = card.querySelector(".repo-language");
      const stars = card.querySelector(".repo-stars");
      const updated = card.querySelector(".repo-updated");

      if (language) language.textContent = repo.language || "GitHub";
      if (stars) stars.textContent = `★ ${repo.stargazers_count ?? 0}`;
      if (updated && repo.updated_at) {
        const date = new Date(repo.updated_at).toLocaleDateString(currentLanguage === "fr" ? "fr-FR" : "en-US", {
          month: "short",
          year: "numeric"
        });
        updated.textContent = `${currentLanguage === "fr" ? "Mis à jour" : "Updated"} ${date}`;
      }
    });
  }

  async function enrichGitHubProjects() {
    try {
      const response = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=100`);
      if (!response.ok) return;
      repositoryCache = await response.json();
      updateProjectMetadataLabels();
    } catch (error) {
      console.info("GitHub metadata unavailable; static project cards remain visible.");
    }
  }
  enrichGitHubProjects();

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
        document.querySelector(`.nav-links a[href="#${entry.target.id}"]`)?.classList.add("active");
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
  if (heroVisual && window.matchMedia("(pointer: fine)").matches) {
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
  const modalDialog = paperModal?.querySelector(".modal-dialog");
  const openPaperButtons = document.querySelectorAll("[data-open-paper]");
  const closeModalButtons = document.querySelectorAll("[data-modal-close]");
  let previousFocus = null;

  function openPaperModal() {
    if (!paperModal || !modalDialog) return;
    previousFocus = document.activeElement;
    paperModal.classList.add("open");
    paperModal.setAttribute("aria-hidden", "false");
    body.classList.add("modal-open");
    setTimeout(() => modalDialog.focus(), 0);
  }

  function closePaperModal() {
    if (!paperModal) return;
    paperModal.classList.remove("open");
    paperModal.setAttribute("aria-hidden", "true");
    body.classList.remove("modal-open");
    previousFocus?.focus?.();
  }

  openPaperButtons.forEach((button) => button.addEventListener("click", openPaperModal));
  closeModalButtons.forEach((button) => button.addEventListener("click", closePaperModal));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && paperModal?.classList.contains("open")) closePaperModal();
  });



  /* PROJECT DEEP-DIVE MODALS */
  const projectOpenButtons = document.querySelectorAll("[data-open-project]");
  const projectCloseButtons = document.querySelectorAll("[data-project-close]");
  let activeProjectModal = null;
  let projectPreviousFocus = null;

  function openProjectModal(modalId, trigger) {
    const modal = document.getElementById(modalId);
    const dialog = modal?.querySelector(".modal-dialog");
    if (!modal || !dialog) return;
    projectPreviousFocus = trigger || document.activeElement;
    activeProjectModal = modal;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    body.classList.add("modal-open");
    setTimeout(() => dialog.focus(), 0);
  }

  function closeProjectModal(modal = activeProjectModal) {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    activeProjectModal = null;
    body.classList.remove("modal-open");
    projectPreviousFocus?.focus?.();
  }

  projectOpenButtons.forEach((button) => {
    button.addEventListener("click", () => openProjectModal(button.dataset.openProject, button));
  });

  projectCloseButtons.forEach((button) => {
    button.addEventListener("click", () => closeProjectModal(button.closest(".project-modal")));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && activeProjectModal) closeProjectModal(activeProjectModal);
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

      const originalText = button.textContent;
      button.textContent = currentLanguage === "fr" ? "Copié ✓" : "Copied ✓";
      if (citationMessage) citationMessage.textContent = currentLanguage === "fr" ? "Référence copiée." : "Citation copied.";
      setTimeout(() => {
        button.textContent = originalText;
        if (citationMessage) citationMessage.textContent = "";
      }, 1800);
    } catch (error) {
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
