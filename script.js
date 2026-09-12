document.addEventListener("DOMContentLoaded", () => {


  /* ======================================
     THEME
  ====================================== */

  const html =
    document.documentElement;

  const themeToggle =
    document.getElementById(
      "theme-toggle"
    );


  const savedTheme =
    localStorage.getItem(
      "theme"
    );


  /*
    Light mode is the default.
    If the user has previously selected
    a theme, remember that choice.
  */

  if (
    savedTheme === "dark" ||
    savedTheme === "light"
  ) {

    html.setAttribute(
      "data-theme",
      savedTheme
    );

  } else {

    html.setAttribute(
      "data-theme",
      "light"
    );

  }


  function updateThemeButton() {

    if (!themeToggle) {
      return;
    }


    const theme =
      html.getAttribute(
        "data-theme"
      );


    if (theme === "dark") {

      themeToggle.textContent =
        "☀";

      themeToggle.setAttribute(
        "aria-label",
        "Switch to light mode"
      );

    } else {

      themeToggle.textContent =
        "☾";

      themeToggle.setAttribute(
        "aria-label",
        "Switch to dark mode"
      );

    }

  }


  updateThemeButton();


  if (themeToggle) {

    themeToggle.addEventListener(
      "click",
      () => {

        const currentTheme =
          html.getAttribute(
            "data-theme"
          );


        const nextTheme =
          currentTheme === "dark"
            ? "light"
            : "dark";


        html.setAttribute(
          "data-theme",
          nextTheme
        );


        localStorage.setItem(
          "theme",
          nextTheme
        );


        updateThemeButton();

      }
    );

  }



  /* ======================================
     GITHUB PROJECTS
  ====================================== */

  const githubUsername =
    "shamim-gharaei";


  const selectedRepositories = [

    "network-intrusion-anomaly-detection",

    "social-network-anomaly-analysis"

  ];


  const projectsContainer =
    document.getElementById(
      "github-projects"
    );


  async function loadGitHubProjects() {

    if (!projectsContainer) {
      return;
    }


    try {

      const response =
        await fetch(
          `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=100`
        );


      if (!response.ok) {

        throw new Error(
          "GitHub API request failed."
        );

      }


      const repositories =
        await response.json();


      const selected =
        selectedRepositories
          .map(
            repoName =>
              repositories.find(
                repo =>
                  repo.name === repoName
              )
          )
          .filter(Boolean);


      projectsContainer.innerHTML =
        "";


      selected.forEach(
        (repo, index) => {


          const card =
            document.createElement(
              "a"
            );


          card.className =
            `project-card project-card-${index + 1}`;


          card.href =
            repo.html_url;


          card.target =
            "_blank";


          card.rel =
            "noopener noreferrer";


          const header =
            document.createElement(
              "div"
            );


          header.className =
            "project-header";


          const titleWrap =
            document.createElement(
              "div"
            );


          titleWrap.className =
            "project-title-wrap";


          const icon =
            document.createElement(
              "div"
            );


          icon.className =
            "github-project-icon";


          icon.textContent =
            "GH";


          const title =
            document.createElement(
              "h3"
            );


          title.textContent =
            repo.name
              .split("-")
              .map(
                word =>
                  word
                    .charAt(0)
                    .toUpperCase()
                  +
                  word.slice(1)
              )
              .join(" ");


          const arrow =
            document.createElement(
              "span"
            );


          arrow.className =
            "project-arrow";


          arrow.textContent =
            "↗";


          titleWrap.appendChild(
            icon
          );


          titleWrap.appendChild(
            title
          );


          header.appendChild(
            titleWrap
          );


          header.appendChild(
            arrow
          );


          const description =
            document.createElement(
              "p"
            );


          description.className =
            "project-description";


          description.textContent =
            repo.description ||
            "GitHub project.";


          const meta =
            document.createElement(
              "div"
            );


          meta.className =
            "project-meta";


          if (repo.language) {

            const language =
              document.createElement(
                "span"
              );


            language.textContent =
              repo.language;


            meta.appendChild(
              language
            );

          }


          const stars =
            document.createElement(
              "span"
            );


          stars.textContent =
            `★ ${repo.stargazers_count}`;


          meta.appendChild(
            stars
          );


          const updated =
            document.createElement(
              "span"
            );


          const updateDate =
            new Date(
              repo.updated_at
            );


          updated.textContent =
            "Updated "
            +
            updateDate
              .toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  year: "numeric"
                }
              );


          meta.appendChild(
            updated
          );


          card.appendChild(
            header
          );


          card.appendChild(
            description
          );


          card.appendChild(
            meta
          );


          projectsContainer
            .appendChild(
              card
            );

        }
      );


      if (
        selected.length === 0
      ) {

        projectsContainer.innerHTML =
          `
          <p class="projects-message">
            Projects are currently unavailable.
          </p>
          `;

      }

    }

    catch (error) {

      console.error(
        "GitHub projects:",
        error
      );


      projectsContainer.innerHTML =
        `
        <p class="projects-message">
          Unable to load GitHub projects right now.
        </p>
        `;

    }

  }


  loadGitHubProjects();



  /* ======================================
     SECTION REVEAL
  ====================================== */

  const animatedSections =
    document.querySelectorAll(
      ".animate-section"
    );


  if (
    "IntersectionObserver"
    in window
  ) {

    const revealObserver =
      new IntersectionObserver(

        entries => {

          entries.forEach(
            entry => {

              if (
                entry.isIntersecting
              ) {

                entry.target
                  .classList
                  .add(
                    "is-visible"
                  );


                revealObserver
                  .unobserve(
                    entry.target
                  );

              }

            }
          );

        },

        {
          threshold: 0.10
        }

      );


    animatedSections.forEach(
      section => {

        revealObserver.observe(
          section
        );

      }
    );

  }



  /* ======================================
     ACTIVE NAVIGATION
  ====================================== */

  const pageSections =
    document.querySelectorAll(
      "main section[id]"
    );


  const navigationLinks =
    document.querySelectorAll(
      ".nav-links a"
    );


  if (
    "IntersectionObserver"
    in window
  ) {

    const navigationObserver =
      new IntersectionObserver(

        entries => {

          entries.forEach(
            entry => {

              if (
                !entry.isIntersecting
              ) {
                return;
              }


              navigationLinks.forEach(
                link => {

                  link.classList
                    .remove(
                      "active"
                    );

                }
              );


              const activeLink =
                document.querySelector(
                  `.nav-links a[href="#${entry.target.id}"]`
                );


              if (activeLink) {

                activeLink
                  .classList
                  .add(
                    "active"
                  );

              }

            }
          );

        },

        {
          rootMargin:
            "-38% 0px -52% 0px"
        }

      );


    pageSections.forEach(
      section => {

        navigationObserver.observe(
          section
        );

      }
    );

  }



  /* ======================================
     SCROLL PROGRESS
  ====================================== */

  const progressBar =
    document.getElementById(
      "scroll-progress"
    );


  function updateScrollProgress() {

    if (!progressBar) {
      return;
    }


    const maximumScroll =
      document.documentElement
        .scrollHeight
      -
      window.innerHeight;


    const percentage =
      maximumScroll > 0
        ?
        (
          window.scrollY
          /
          maximumScroll
        )
        * 100
        :
        0;


    progressBar.style.width =
      `${percentage}%`;

  }


  window.addEventListener(
    "scroll",
    updateScrollProgress,
    {
      passive: true
    }
  );


  updateScrollProgress();



  /* ======================================
     HERO PARALLAX
  ====================================== */

  const heroVisual =
    document.getElementById(
      "hero-visual"
    );


  if (heroVisual) {

    window.addEventListener(
      "mousemove",
      event => {

        if (
          window.innerWidth
          < 1000
        ) {
          return;
        }


        const x =
          (
            event.clientX
            /
            window.innerWidth
            -
            0.5
          )
          * 8;


        const y =
          (
            event.clientY
            /
            window.innerHeight
            -
            0.5
          )
          * 8;


        heroVisual.style.transform =
          `translate(${x}px, ${y}px)`;

      },

      {
        passive: true
      }
    );

  }



  /* ======================================
     GRAPH TOOLTIP
  ====================================== */

  const graphNodes =
    document.querySelectorAll(
      ".graph-node"
    );


  const graphTooltip =
    document.getElementById(
      "graph-tooltip"
    );


  const networkWrapper =
    document.querySelector(
      ".network-wrapper"
    );


  if (
    graphTooltip
    &&
    networkWrapper
  ) {

    graphNodes.forEach(
      node => {


        node.addEventListener(
          "mouseenter",
          event => {


            graphTooltip.textContent =
              event
                .target
                .dataset
                .label;


            const nodeRect =
              event
                .target
                .getBoundingClientRect();


            const wrapperRect =
              networkWrapper
                .getBoundingClientRect();


            graphTooltip.style.left =
              `${
                nodeRect.left
                -
                wrapperRect.left
                +
                nodeRect.width / 2
              }px`;


            graphTooltip.style.top =
              `${
                nodeRect.top
                -
                wrapperRect.top
              }px`;


            graphTooltip
              .classList
              .add(
                "visible"
              );

          }
        );


        node.addEventListener(
          "mouseleave",
          () => {

            graphTooltip
              .classList
              .remove(
                "visible"
              );

          }
        );


      }
    );

  }



  /* ======================================
     COPY CITATION
  ====================================== */

  const citationButton =
    document.getElementById(
      "copy-citation"
    );


  const citationMessage =
    document.getElementById(
      "citation-message"
    );


  const citationText =
    "Dabaghi-Zarandi, F., Gharaei, S., & Zeynali, A. (2025). Anomaly Detection in Social Networks: A Taxonomy of Methods, Research Challenges, and Future Directions. National Conference on Information Technology, Nanotechnology, Artificial Intelligence and Technological Futures Studies.";


  if (citationButton) {

    citationButton.addEventListener(
      "click",
      async () => {


        try {


          if (
            navigator.clipboard
          ) {

            await navigator
              .clipboard
              .writeText(
                citationText
              );

          } else {

            const temporary =
              document
                .createElement(
                  "textarea"
                );


            temporary.value =
              citationText;


            document.body
              .appendChild(
                temporary
              );


            temporary.select();


            document.execCommand(
              "copy"
            );


            temporary.remove();

          }


          citationButton.textContent =
            "Copied ✓";


          if (
            citationMessage
          ) {

            citationMessage.textContent =
              "Citation copied to clipboard.";

          }


          setTimeout(
            () => {

              citationButton.textContent =
                "Copy citation";


              if (
                citationMessage
              ) {

                citationMessage.textContent =
                  "";

              }

            },
            2000
          );

        }

        catch (error) {

          console.error(
            "Clipboard:",
            error
          );


          if (
            citationMessage
          ) {

            citationMessage.textContent =
              "Unable to copy automatically.";

          }

        }

      }
    );

  }



  /* ======================================
     CURSOR GLOW
  ====================================== */

  const cursorGlow =
    document.getElementById(
      "cursor-glow"
    );


  if (
    cursorGlow
    &&
    window.matchMedia(
      "(pointer: fine)"
    ).matches
  ) {

    window.addEventListener(
      "mousemove",
      event => {


        cursorGlow.style.left =
          `${event.clientX}px`;


        cursorGlow.style.top =
          `${event.clientY}px`;


        cursorGlow.style.opacity =
          "1";

      },

      {
        passive: true
      }
    );


    document.addEventListener(
      "mouseleave",
      () => {

        cursorGlow.style.opacity =
          "0";

      }
    );

  }



  /* ======================================
     BACK TO TOP
  ====================================== */

  const backToTop =
    document.getElementById(
      "back-to-top"
    );


  function updateBackToTop() {

    if (!backToTop) {
      return;
    }


    if (
      window.scrollY > 650
    ) {

      backToTop
        .classList
        .add(
          "visible"
        );

    } else {

      backToTop
        .classList
        .remove(
          "visible"
        );

    }

  }


  window.addEventListener(
    "scroll",
    updateBackToTop,
    {
      passive: true
    }
  );


  if (backToTop) {

    backToTop.addEventListener(
      "click",
      () => {

        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });

      }
    );

  }


  updateBackToTop();

});
