document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // 1️⃣ GESTIONE SPLASH PAGE
  // =========================
  const splash = document.getElementById("splash");

  if (!sessionStorage.getItem("splashSeen")) {
    if (splash) {
      splash.style.display = "flex"; // Assicurati che sia visibile
      splash.addEventListener("click", () => {
        splash.classList.add("hide");
        sessionStorage.setItem("splashSeen", "true");
      });
    }
  } else if (splash) {
    splash.style.display = "none"; // Nascondi subito se già vista
  }

  // =========================
  // 2️⃣ CURSORE PERSONALIZZATO
  // =========================
  const cursor = document.getElementById("custom-cursor");
  const cursorText = document.getElementById("cursor-text");
  const deskImages = document.querySelectorAll("#desk-images .desk-image-wrapper");

  document.addEventListener("mousemove", (e) => {
    if (!cursor) return;

    const isProjectHover = cursor.classList.contains("project-hover");
    const offsetY = isProjectHover ? -20 : 0;
    cursor.style.top = e.clientY + offsetY + "px";
    cursor.style.left = e.clientX + "px";

    const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
    if (!elementBelow) return;

    // Sempre bianco nella sezione finale
    const isInFinalSection = elementBelow.closest("#final") !== null;

    const whiteRGB = "rgb(250, 250, 237)";
    const orangeRGB = "rgb(248, 128, 0)";
    const bgColor = window.getComputedStyle(elementBelow).backgroundColor;

    if (isInFinalSection) {
      cursor.style.backgroundColor = "#FAFAED";
    } else if (bgColor === whiteRGB) {
      cursor.style.backgroundColor = "#F88000";
    } else if (bgColor === orangeRGB) {
      cursor.style.backgroundColor = "#FAFAED";
    } else {
      cursor.style.backgroundColor = "#F88000";
    }
  });

  deskImages.forEach(wrapper => {
    wrapper.addEventListener("mouseenter", () => {
      cursor?.classList.add("project-hover");
      if (cursorText) cursorText.textContent = wrapper.dataset.name;
    });

    wrapper.addEventListener("mouseleave", () => {
      cursor?.classList.remove("project-hover");
      if (cursorText) cursorText.textContent = "";
    });
  });

  // =========================
  // 3️⃣ SUB-NAVBAR & ACTIVE LINK
  // =========================
  const subNavbar = document.querySelector(".sub-navbar");
  const trigger = document.getElementById("sub-navbar-trigger");
  const workflow = document.querySelector(".workflow");
  const navbarHeight = document.querySelector(".navbar")?.offsetHeight || 0;

  if (subNavbar && trigger) {
    const stickyObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.boundingClientRect.top <= navbarHeight && !entry.isIntersecting) {
          subNavbar.classList.add("fixed");
        } else {
          subNavbar.classList.remove("fixed");
        }
      },
      {
        root: null,
        threshold: 0,
        rootMargin: `-${navbarHeight}px 0px 0px 0px`
      }
    );
    stickyObserver.observe(trigger);
  }

  // IntersectionObserver per evidenziare link attivo
  const sections = document.querySelectorAll("#research, #storyboard, #output, #last");
  const navLinks = document.querySelectorAll(".sub-navbar a");

  if (sections.length && navLinks.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const id = entry.target.getAttribute("id");
          if (!id) return;

          const link = document.querySelector(`.sub-navbar a[href="#${id}"]`);
          if (entry.isIntersecting && link) {
            navLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach(section => observer.observe(section));
  }

  // Disattiva sticky quando esci dalla sezione workflow
  if (workflow && subNavbar) {
    window.addEventListener("scroll", () => {
      const workflowBottom = workflow.offsetTop + workflow.offsetHeight;
      const scrollBottom = window.scrollY + navbarHeight + subNavbar.offsetHeight;

      if (scrollBottom > workflowBottom) {
        subNavbar.classList.remove("fixed");
      }
    });
  }

  // =========================
  // 4️⃣ OVERLAY BINOMIO FANTASTICO
  // =========================
  const binomioFantastico = document.getElementById("binomiofantastico");
  const overlay = document.getElementById("overlay");

  binomioFantastico?.addEventListener("click", () => {
    overlay?.classList.add("show");
  });

  overlay?.addEventListener("click", (e) => {
    if (e.target.id === "overlay-img") return;
    overlay.classList.remove("show");
  });

  // =========================
  // 5️⃣ VIDEO PLAY BUTTON LOGIC
  // =========================
  const video = document.getElementById("amorfosi-video");
  const playButton = document.getElementById("play-button");

  if (video && playButton) {
    video.removeAttribute("controls");

    playButton.addEventListener("click", () => {
      video.setAttribute("controls", true);
      video.play();
      playButton.classList.add("hidden");
    });

    video.addEventListener("ended", () => {
      playButton.classList.remove("hidden");
      video.removeAttribute("controls");
    });
  }

// =========================
// 6️⃣ ANIMAZIONE LETTERE PRECARICATA
// =========================
const lettereImg = document.getElementById("lettere-amorfosi");
if (lettereImg) {
  const totalLettereFrames = 18;
  let lettereFrame = 1;
  const fps = 24;
  const framePaths = [];

  for (let i = 1; i <= totalLettereFrames; i++) {
    const frameNumber = String(i).padStart(5, "0");
    // ✅ percorso corretto (senza %20)
    const path = `../images/Amorfosi/video_lettere/Composizione_1_${frameNumber}.png`;
    framePaths.push(path);

    const img = new Image();
    img.src = path;
  }

  setInterval(() => {
    lettereFrame = (lettereFrame % totalLettereFrames);
    lettereImg.src = framePaths[lettereFrame];
    lettereFrame++;
  }, 1000 / fps);
}


  // =========================
  // 7️⃣ ANIMAZIONE LOGO INTRO (loop infinito)
  // =========================
  const logoImg = document.getElementById("animation-logo");
  if (logoImg) {
    const totalFrames = 42; // numero di frame esportati
    const fps = 10; // fotogrammi al secondo
    const framePaths = [];

    // Precarica tutte le immagini
    for (let i = 1; i <= totalFrames; i++) {
      const frameNumber = String(i).padStart(5, "0");
      const path = `./video/Intro/Comp_1_${frameNumber}.png`;
      framePaths.push(path);
      const img = new Image();
      img.src = path;
    }

    let currentFrame = 0;

    // Avvia l'animazione in loop
    setInterval(() => {
      logoImg.src = framePaths[currentFrame];
      currentFrame = (currentFrame + 1) % totalFrames; // ricomincia da capo
    }, 1000 / fps);
  }
});

