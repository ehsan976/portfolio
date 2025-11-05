document.addEventListener("DOMContentLoaded", function () {
  // ===============================
  // DARK / LIGHT MODE TOGGLE
  // ===============================
  const themeToggle = document.getElementById("theme-toggle");
  const sunIcon = document.getElementById("sun-icon");
  const moonIcon = document.getElementById("moon-icon");

  function updateIcons() {
    if (document.body.classList.contains("dark")) {
      sunIcon?.classList.remove("hidden");
      moonIcon?.classList.add("hidden");
    } else {
      sunIcon?.classList.add("hidden");
      moonIcon?.classList.remove("hidden");
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

  themeToggle?.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.theme = document.body.classList.contains("dark") ? "dark" : "light";
    updateIcons();
  });

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

    // Smooth scrolling for all section links
    navLinks.querySelectorAll("a[href^='#']").forEach(link => {
      link.addEventListener("click", e => {
        e.preventDefault();
        const targetId = link.getAttribute("href");
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          smoothScrollTo(targetSection, 900);
        }
        navLinks.classList.remove("open");
        if (menuBtnIcon) menuBtnIcon.setAttribute("class", "ri-menu-3-line");
      });
    });
  }

  // ===============================
  // CUSTOM SMOOTH SCROLL FUNCTION (no lag, ease-out)
  // ===============================
  function smoothScrollTo(target, duration = 800) {
    const start = window.pageYOffset;
    const end = target.getBoundingClientRect().top + start - 50;
    const distance = end - start;
    let startTime = null;

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3); // smooth ease-out curve
      window.scrollTo(0, start + distance * easeOut);

      if (elapsed < duration) {
        requestAnimationFrame(animation);
      }
    }

    requestAnimationFrame(animation);
  }

  // ===============================
  // FLOATING MESSAGE FUNCTION
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
  // PROJECT IMAGE OPTIMIZATION
  // ===============================
  const projectImages = document.querySelectorAll(".project-image img");
  projectImages.forEach(img => {
    img.loading = "lazy"; // ✅ native lazy load
    img.decoding = "async"; // ✅ async decode (avoids blocking render)
    img.style.willChange = "transform, opacity"; // ✅ GPU hint
  });

  // ===============================
  // PROJECT CARD GPU BOOST
  // ===============================
  const projectCards = document.querySelectorAll(".project-card");
  projectCards.forEach(card => {
    card.style.willChange = "transform, opacity";
    card.style.backfaceVisibility = "hidden"; // ✅ prevents flicker
    card.style.transform = "translateZ(0)"; // ✅ triggers GPU rendering
    card.style.transition = "transform 0.3s ease, box-shadow 0.3s ease";
  });
});
