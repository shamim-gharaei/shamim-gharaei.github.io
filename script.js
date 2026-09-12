document.addEventListener("DOMContentLoaded", () => {
  const html = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");
  const languageButtons = document.querySelectorAll(".language-button");

  let currentLanguage = localStorage.getItem("site-language") || "en";
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark" || savedTheme === "light") {
    html.setAttribute("data-theme", savedTheme);
  } else {
    html.setAttribute("data-theme", "light");
  }

  function updateThemeButton() {
    if (!themeToggle) return;
    const theme = html.getAttribute("data-theme");
    themeToggle.textContent = theme === "dark" ? "☀" : "☾";
    themeToggle.setAttribute(
      "aria-label",
      theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
    );
  }

  updateThemeButton();

  themeToggle?.addEventListener("click", () => {
    const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    updateThemeButton();
  });


  /* LANGUAGE */
  function applyLanguage(language) {
    currentLanguage = language;
    html.lang = language;
    localStorage.setItem("site-language", language);

    document.querySelectorAll("[data-en][data-fr]").forEach((element) => {
      const text = element.dataset[language];
      if (typeof text === "string") element.textContent = text;
    });

    languageButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.lang === language);
    });
  }

  languageButtons.forEach((button) => {
    button.addEventListener("click", () => applyLanguage(button.dataset.lang));
  });

  applyLanguage(currentLanguage);


  /* LIVE GITHUB METADATA */
  const githubUsername = "shamim-gharaei";

  document.querySelectorAll(".project-card[data-repo]").forEach(async (card) => {
    const repoName = card.dataset.repo;

    try {
      const response = await fetch(`https://api.github.com/repos/${githubUsername}/${repoName}`);
      if (!response.ok) throw new Error("GitHub API request failed");
      const repo = await response.json();

      const language = card.querySelector(".repo-language");
      const stars = card.querySelector(".repo-stars");
      const updated = card.querySelector(".repo-updated");

      if (language && repo.language) language.textContent = repo.language;
      if (stars) stars.textContent = `★ ${repo.stargazers_count}`;

      if (updated && repo.updated_at) {
        const date = new Date(repo.updated_at);
        updated.textContent = `Updated ${date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric"
        })}`;
      }
    } catch (error) {
      console.warn(`GitHub metadata unavailable for ${repoName}`, error);
    }
  });


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
    }, { threshold: 0.12 });

    revealItems.forEach((item) => revealObserver.observe(item));
  }


  /* ACTIVE NAVIGATION */
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  if ("IntersectionObserver" in window) {
    const navigationObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navLinks.forEach((link) => link.classList.remove("active"));
        const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        activeLink?.classList.add("active");
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
  const graphNodes = document.querySelectorAll(".graph-node");
  const graphTooltip = document.getElementById("graph-tooltip");
  const networkWrapper = document.querySelector(".network-wrapper");

  if (graphTooltip && networkWrapper) {
    graphNodes.forEach((node) => {
      node.addEventListener("mouseenter", (event) => {
        const key = currentLanguage === "fr" ? "labelFr" : "labelEn";
        graphTooltip.textContent = event.target.dataset[key] || "Research Area";

        const nodeRect = event.target.getBoundingClientRect();
        const wrapperRect = networkWrapper.getBoundingClientRect();

        graphTooltip.style.left = `${nodeRect.left - wrapperRect.left + nodeRect.width / 2}px`;
        graphTooltip.style.top = `${nodeRect.top - wrapperRect.top}px`;
        graphTooltip.classList.add("visible");
      });

      node.addEventListener("mouseleave", () => graphTooltip.classList.remove("visible"));
    });
  }


  /* CITATION */
  const citationText = "Dabaghi-Zarandi, F., Gharaei, S., & Zeynali, A. (2025). Anomaly Detection in Social Networks: A Taxonomy of Methods, Research Challenges, and Future Directions. National Conference on Information Technology, Nanotechnology, Artificial Intelligence and Technological Futures Studies.";
  const citationButton = document.getElementById("copy-citation");
  const modalCitationButton = document.getElementById("modal-copy-citation");
  const citationMessage = document.getElementById("citation-message");

  async function copyCitation(button) {
    try {
      await navigator.clipboard.writeText(citationText);
      if (button) button.dataset.copied = "true";
      if (citationMessage) {
        citationMessage.textContent = currentLanguage === "fr" ? "Référence copiée." : "Citation copied to clipboard.";
      }
      setTimeout(() => {
        if (citationMessage) citationMessage.textContent = "";
      }, 2200);
    } catch (error) {
      console.warn("Clipboard unavailable", error);
      if (citationMessage) {
        citationMessage.textContent = currentLanguage === "fr" ? "Impossible de copier automatiquement." : "Unable to copy automatically.";
      }
    }
  }

  citationButton?.addEventListener("click", () => copyCitation(citationButton));
  modalCitationButton?.addEventListener("click", () => copyCitation(modalCitationButton));


  /* PAPER MODAL */
  const modalTriggers = document.querySelectorAll(".modal-trigger");
  const modalCloseTargets = document.querySelectorAll("[data-modal-close]");

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  modalTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      openModal(document.getElementById(trigger.dataset.modalTarget));
    });
  });

  modalCloseTargets.forEach((target) => {
    target.addEventListener("click", () => closeModal(target.closest(".modal")));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      document.querySelectorAll(".modal.open").forEach(closeModal);
    }
  });


  /* CURSOR GLOW */
  const cursorGlow = document.getElementById("cursor-glow");

  if (cursorGlow && window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener("mousemove", (event) => {
      cursorGlow.style.left = `${event.clientX}px`;
      cursorGlow.style.top = `${event.clientY}px`;
      cursorGlow.style.opacity = "1";
    }, { passive: true });

    document.addEventListener("mouseleave", () => {
      cursorGlow.style.opacity = "0";
    });
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
