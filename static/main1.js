document.addEventListener("DOMContentLoaded", function () {
  // ===============================
  // DARK / LIGHT MODE TOGGLE
  // ===============================
  const themeToggle = document.getElementById("theme-toggle");
  const sunIcon = document.getElementById("sun-icon");
  const moonIcon = document.getElementById("moon-icon");

  function updateIcons() {
    if (document.body.classList.contains("dark")) {
      sunIcon.classList.remove("hidden");
      moonIcon.classList.add("hidden");
    } else {
      sunIcon.classList.add("hidden");
      moonIcon.classList.remove("hidden");
    }
  }

  if (
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
  updateIcons();

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      localStorage.theme = document.body.classList.contains("dark") ? "dark" : "light";
      updateIcons();
    });
  }

  // ===============================
  // RESPONSIVE NAV MENU
  // ===============================
  const menuBtn = document.getElementById("menu-btn");
  const navLinks = document.getElementById("nav-links");
  const menuBtnIcon = menuBtn ? menuBtn.querySelector("i") : null;

  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("open");
      const isOpen = navLinks.classList.contains("open");
      if (menuBtnIcon) {
        menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-3-line");
      }
    });

    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        if (menuBtnIcon) menuBtnIcon.setAttribute("class", "ri-menu-3-line");
      });
    });
  }

  // ===============================
  // CONTACT FORM (AJAX SUBMISSION)
  // ===============================
  const contactForm = document.querySelector(".contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const formData = new FormData(contactForm);
      const csrfToken = document.querySelector("[name=csrfmiddlewaretoken]").value;

      fetch("/", {
        method: "POST",
        headers: { "X-CSRFToken": csrfToken },
        body: formData,
      })
        .then(response => response.ok ? response.text() : Promise.reject("Error"))
        .then(() => {
          showMessage("✅ Message sent successfully!", "success");
          contactForm.reset();
        })
        .catch(() => {
          showMessage("❌ Something went wrong. Try again later.", "error");
        });
    });
  }

  // ===============================
  // FLOATING MESSAGE
  // ===============================
  function showMessage(text, type) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("floating-message");
    messageDiv.textContent = text;

    Object.assign(messageDiv.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      padding: "12px 20px",
      borderRadius: "8px",
      fontWeight: "500",
      color: "#fff",
      zIndex: "9999",
      transition: "opacity 0.5s ease",
      opacity: "1",
      boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
      background: type === "success" ? "#22c55e" : "#ef4444",
    });

    document.body.appendChild(messageDiv);

    setTimeout(() => {
      messageDiv.style.opacity = "0";
      setTimeout(() => messageDiv.remove(), 500);
    }, 4000);
  }

  // ===============================
  // AUTO-FETCH GITHUB PROJECTS
  // ===============================
  const username = "ehsanshafiq"; // ⚠️ Replace with your GitHub username
  const projectsGrid = document.getElementById("projects-grid");

  async function fetchGitHubProjects() {
    try {
      const response = await fetch(`https://api.github.com/users/${username}/repos`);
      const data = await response.json();
      const filtered = data.filter(repo => !repo.fork);

      projectsGrid.innerHTML = "";

      filtered.forEach(repo => {
        const projectCard = document.createElement("div");
        projectCard.classList.add("project-card");

        const langColor = getLanguageColor(repo.language);

        projectCard.innerHTML = `
          <div class="project-content">
            <h3>${repo.name}</h3>
            <p>${repo.description || "No description provided."}</p>
            <p class="repo-meta">
              <span class="lang-dot" style="background:${langColor}"></span>
              ${repo.language || "Unknown"} • ⭐ ${repo.stargazers_count}
            </p>
            <div class="project-buttons">
              <a href="${repo.html_url}" target="_blank" class="btn-github">
                <i class="ri-github-fill"></i> GitHub
              </a>
              ${
                repo.homepage
                  ? `<a href="${repo.homepage}" target="_blank" class="btn-primary">Live Demo</a>`
                  : ""
              }
            </div>
          </div>
        `;

        projectsGrid.appendChild(projectCard);
      });
    } catch (error) {
      console.error("Error fetching GitHub repos:", error);
      if (projectsGrid)
        projectsGrid.innerHTML = "<p>⚠️ Unable to load projects from GitHub.</p>";
    }
  }

  // ===============================
  // LANGUAGE COLOR MAP
  // ===============================
  function getLanguageColor(lang) {
    const colors = {
      Python: "#3572A5",
      JavaScript: "#f1e05a",
      HTML: "#e34c26",
      CSS: "#563d7c",
      Java: "#b07219",
      C: "#555555",
      "C++": "#f34b7d",
    };
    return colors[lang] || "#ccc";
  }

  
  fetchGitHubProjects();
});

