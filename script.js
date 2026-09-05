const githubUsername = "shamim-gharaei";

const selectedRepositories = [
  "network-intrusion-anomaly-detection",
  "social-network-anomaly-analysis"
];

const projectsContainer = document.getElementById("github-projects");

async function loadGitHubProjects() {
  try {
    const response = await fetch(
      `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=100`
    );

    if (!response.ok) {
      throw new Error("GitHub API request failed.");
    }

    const repositories = await response.json();

    const selected = selectedRepositories
      .map(repoName =>
        repositories.find(repo => repo.name === repoName)
      )
      .filter(Boolean);

    projectsContainer.innerHTML = "";

    selected.forEach((repo, index) => {
      const card = document.createElement("a");

      card.className = `project-card project-card-${index + 1}`;
      card.href = repo.html_url;
      card.target = "_blank";
      card.rel = "noopener noreferrer";

      const header = document.createElement("div");
      header.className = "project-header";

      const title = document.createElement("h3");
      title.textContent = repo.name
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      const arrow = document.createElement("span");
      arrow.className = "project-arrow";
      arrow.textContent = "↗";

      header.appendChild(title);
      header.appendChild(arrow);

      const description = document.createElement("p");
      description.className = "project-description";
      description.textContent =
        repo.description || "GitHub research project.";

      const meta = document.createElement("div");
      meta.className = "project-meta";

      if (repo.language) {
        const language = document.createElement("span");
        language.textContent = repo.language;
        meta.appendChild(language);
      }

      const stars = document.createElement("span");
      stars.textContent = `★ ${repo.stargazers_count}`;
      meta.appendChild(stars);

      const updated = document.createElement("span");
      const updateDate = new Date(repo.updated_at);

      updated.textContent =
        "Updated " +
        updateDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short"
        });

      meta.appendChild(updated);

      card.appendChild(header);
      card.appendChild(description);
      card.appendChild(meta);

      projectsContainer.appendChild(card);
    });

    if (selected.length === 0) {
      projectsContainer.innerHTML =
        '<p class="projects-message">Projects are currently unavailable.</p>';
    }

  } catch (error) {
    projectsContainer.innerHTML =
      '<p class="projects-message">Unable to load GitHub projects right now.</p>';

    console.error(error);
  }
}

loadGitHubProjects();
