// =========================
// PAROLA ANIMATA NEL TITOLO (visual → graphic → systemic)
// =========================
let roleWordStarted = false;
function startRoleWord() {
  const roleWordEl = document.getElementById("role-word");
  if (!roleWordEl || roleWordStarted) return;
  roleWordStarted = true;

  const roleWords = ["visual", "graphic", "systemic"];
  const TYPE_SPEED = 80;          // ms per lettera, mentre scrive
  const DELETE_SPEED = 45;        // ms per lettera, mentre cancella
  const PAUSE_AFTER_TYPE = 1100;  // pausa a parola completa, prima di cancellare
  let wordIndex = 0;

  const typeWord = (word, i, callback) => {
    if (i <= word.length) {
      roleWordEl.textContent = word.slice(0, i);
      setTimeout(() => typeWord(word, i + 1, callback), TYPE_SPEED);
    } else {
      callback();
    }
  };

  const deleteWord = (word, i, callback) => {
    if (i >= 0) {
      roleWordEl.textContent = word.slice(0, i);
      setTimeout(() => deleteWord(word, i - 1, callback), DELETE_SPEED);
    } else {
      callback();
    }
  };

  const playNextWord = () => {
    const word = roleWords[wordIndex];
    const isLast = wordIndex === roleWords.length - 1;

    typeWord(word, 0, () => {
      if (isLast) {
        // "systemic" resta scritta: il cursore smette di lampeggiare
        roleWordEl.classList.add("role-word-final");
        return;
      }
      setTimeout(() => {
        deleteWord(word, word.length, () => {
          wordIndex++;
          playNextWord();
        });
      }, PAUSE_AFTER_TYPE);
    });
  };

  playNextWord();
}

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
        startRoleWord(); // la parola animata parte quando si entra nel sito
      });
    } else {
      startRoleWord();
    }
  } else {
    if (splash) splash.style.display = "none"; // Nascondi subito se già vista
    startRoleWord();
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

    // Nella sezione finale (sfondo chiaro) il cursore resta rosso
    const isInFinalSection = elementBelow.closest("#final") !== null;

    const whiteRGB = "rgb(255, 255, 255)";
    const orangeRGB = "rgb(227, 6, 19)";
    const bgColor = window.getComputedStyle(elementBelow).backgroundColor;

    if (isInFinalSection) {
      cursor.style.backgroundColor = "#E30613";
    } else if (bgColor === whiteRGB) {
      cursor.style.backgroundColor = "#E30613";
    } else if (bgColor === orangeRGB) {
      cursor.style.backgroundColor = "#FFFFFF";
    } else {
      cursor.style.backgroundColor = "#E30613";
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



// =========================
// NAVBAR: sparisce scorrendo in giù, ricompare scorrendo in su
// =========================
(function () {
  let lastY = window.scrollY;
  window.addEventListener("scroll", () => {
    if (document.body.classList.contains("menu-open")) return;
    const y = window.scrollY;
    const delta = y - lastY;
    if (y < 80) {
      document.body.classList.remove("nav-hidden");
    } else if (delta > 5) {
      document.body.classList.add("nav-hidden");
    } else if (delta < -5) {
      document.body.classList.remove("nav-hidden");
    }
    if (Math.abs(delta) > 5) lastY = y;
  }, { passive: true });
})();


// =========================
// COMPARSA MORBIDA (.reveal) quando un blocco entra nello schermo
// =========================
(function () {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;
  if (!("IntersectionObserver" in window)) {
    els.forEach(el => el.classList.add("in-view"));
    return;
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  els.forEach(el => obs.observe(el));
})();


// =========================
// MY DESK: il link "riordina" mette le foto in fila al centro,
// "scompiglia" le sparpaglia di nuovo (solo da desktop)
// =========================
(function () {
  const button = document.getElementById("desk-tidy");
  const messyButton = document.getElementById("desk-messy");
  const desk = document.getElementById("desk-images");
  const section = document.getElementById("mydesk");
  if (!button || !desk || !section) return;

  const wrappers = [...desk.querySelectorAll(".desk-image-wrapper")];
  const desktop = window.matchMedia("(min-width: 1200px)");
  const GAP = 12;
  let tidy = false;

  // proporzioni della copertina, che sia una foto o un video
  const mediaSize = (wrapper) => {
    const m = wrapper.querySelector(".desk-image");
    if (!m) return null;
    const w = m.naturalWidth || m.videoWidth || +m.getAttribute("width");
    const h = m.naturalHeight || m.videoHeight || +m.getAttribute("height");
    return w && h ? { w, h } : null;
  };
  const ratioOf = (wrapper) => {
    const s = mediaSize(wrapper);
    return s ? s.w / s.h : 1;
  };



  // la sezione deve stare in una schermata: l'altezza della composizione
  // è fissata dallo schermo, le foto restano a grandezza piena e si
  // avvicinano in verticale (sovrapponendosi di più)
  const MAX_HEIGHT = 908;       // altezza della composizione su schermi molto alti
  const RESERVED = 290;         // titolo, spazi, link "tidy up" e un po' di respiro
  const BASE_WIDTH = 1040;      // larghezza per cui sono pensate le foto
  const PHOTO_SCALE = 1;        // foto alle misure originali
  const BASE_TOPS = { eco: 0, realista: 330, tesi: 40, cat: 570, ettore: 650, astory: 290, editoria: 360 };
  const BASE_WIDTHS = { eco: 220, realista: 270, tesi: 210, cat: 210, ettore: 180, astory: 410, editoria: 230 };
  const BASE_WIDTHS_XL = Object.assign({}, BASE_WIDTHS, { astory: 440, editoria: 200 });
  const xl = window.matchMedia("(min-width: 1900px)");

  const fitToScreen = () => {
    if (!desktop.matches) return;
    const height = Math.min(MAX_HEIGHT, Math.max(420, window.innerHeight - RESERVED));
    desk.style.setProperty("--desk-h", height + "px");
    const w = Math.min(1, desk.clientWidth / BASE_WIDTH) * PHOTO_SCALE;
    desk.style.setProperty("--desk-w", w.toFixed(3));
    // quanto comprimere le posizioni perché ogni foto finisca dentro l'altezza
    let t = 1;
    wrappers.forEach((wrapper) => {
      const key = Object.keys(BASE_TOPS).find((k) => wrapper.classList.contains(k));
      const top = key ? BASE_TOPS[key] : 0;
      const size = mediaSize(wrapper);
      const ratio = size ? size.h / size.w : 1.3;
      const h = (key ? (xl.matches ? BASE_WIDTHS_XL : BASE_WIDTHS)[key] : 200) * w * ratio;
      if (top > 0) t = Math.min(t, (height - h) / top);
    });
    desk.style.setProperty("--desk-t", Math.max(0.2, t).toFixed(3));
  };
  fitToScreen();
  wrappers.forEach((wrapper) => {
    const img = wrapper.querySelector("img");
    if (img && !img.complete) img.addEventListener("load", fitToScreen, { once: true });
    const video = wrapper.querySelector("video");
    if (video && !video.videoWidth) video.addEventListener("loadedmetadata", fitToScreen, { once: true });
  });

  // ---- fila riordinata: foto grandi una accanto all'altra ----
  const ORDER = ["realista", "editoria", "eco", "astory", "tesi", "ettore", "cat"];
  const ROW_GAP = 16;
  const CAPTION = 44;
  const DURATION = 950;
  const big = window.matchMedia("(min-width: 1900px)");
  const spacer = document.createElement("span");
  spacer.className = "desk-row-end";
  spacer.setAttribute("aria-hidden", "true");
  desk.appendChild(spacer);
  let clearTimer = null;

  const mediaOf = (w) => w.querySelector(".desk-image");
  const snapshot = () => wrappers.map((w) => ({
    left: w.offsetLeft - desk.scrollLeft,
    top: w.offsetTop,
    width: w.offsetWidth,
    h: mediaOf(w) ? mediaOf(w).offsetHeight : 0,
  }));
  const setGeo = (w, g) => {
    w.style.left = g.left + "px";
    w.style.top = g.top + "px";
    w.style.width = g.width + "px";
    const m = mediaOf(w);
    if (m) m.style.height = g.h + "px";
  };
  const clearGeo = (w) => {
    w.style.left = w.style.top = w.style.width = "";
    const m = mediaOf(w);
    if (m) m.style.height = "";
  };
  const rowGeometry = () => {
    const deskH = desk.clientHeight;
    const imgH = Math.max(220, Math.min(big.matches ? 560 : 480, deskH - CAPTION - 40));
    const width = Math.round(imgH * 0.75);
    const top = Math.max(0, Math.round((deskH - imgH - CAPTION) / 2));
    const ordered = ORDER.map((k) => wrappers.find((w) => w.classList.contains(k))).filter(Boolean);
    wrappers.forEach((w) => { if (!ordered.includes(w)) ordered.push(w); });
    const geo = new Map();
    ordered.forEach((w, i) => geo.set(w, { left: i * (width + ROW_GAP), top, width, h: imgH }));
    return { geo, end: ordered.length * (width + ROW_GAP) - ROW_GAP };
  };
  // parte da "from", poi scivola fino a "to"
  const animate = (from, to) => {
    desk.classList.add("no-anim");
    wrappers.forEach((w, i) => setGeo(w, from[i]));
    void desk.offsetWidth;
    desk.classList.remove("no-anim");
    wrappers.forEach((w, i) => setGeo(w, to[i]));
  };

  const goTidy = (withAnimation) => {
    clearTimeout(clearTimer);
    const from = snapshot();
    const bleed = Math.max(0, document.documentElement.clientWidth - desk.getBoundingClientRect().right);
    desk.style.setProperty("--desk-bleed", bleed + "px");
    desk.classList.add("is-tidy");
    const { geo, end } = rowGeometry();
    spacer.style.left = end + bleed - 1 + "px";
    const to = wrappers.map((w) => geo.get(w));
    if (withAnimation) animate(from, to);
    else wrappers.forEach((w, i) => setGeo(w, to[i]));
    desk.scrollLeft = 0;
  };

  const goMessy = (withAnimation) => {
    clearTimeout(clearTimer);
    const from = snapshot();
    desk.classList.add("no-anim");
    desk.classList.remove("is-tidy");
    desk.scrollLeft = 0;
    spacer.style.left = "";
    wrappers.forEach(clearGeo);
    const to = snapshot();
    desk.classList.remove("no-anim");
    if (!withAnimation) return;
    animate(from, to);
    clearTimer = setTimeout(() => {
      desk.classList.add("no-anim");
      wrappers.forEach(clearGeo);
      void desk.offsetWidth;
      desk.classList.remove("no-anim");
    }, DURATION);
  };

  const render = (withAnimation) => {
    section.classList.toggle("is-tidy", tidy);
    button.setAttribute("aria-pressed", String(tidy));
    button.classList.toggle("is-active", tidy);
    const switchLabel = button.querySelector(".desk-switch-label");
    if (switchLabel) switchLabel.textContent = tidy ? "Di solito è più messa così" : "Riordina";
    if (messyButton) {
      messyButton.setAttribute("aria-pressed", String(!tidy));
      messyButton.classList.toggle("is-active", !tidy);
    }
    if (tidy && desktop.matches) goTidy(withAnimation);
    else if (desk.classList.contains("is-tidy") || withAnimation === false) goMessy(withAnimation);
  };

  // nella fila riordinata la rotellina del mouse fa scorrere le foto di lato,
  // finché non si arriva all'inizio o alla fine
  desk.addEventListener("wheel", (e) => {
    if (!tidy || !desktop.matches) return;
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    const max = desk.scrollWidth - desk.clientWidth;
    const atStart = desk.scrollLeft <= 0 && e.deltaY < 0;
    const atEnd = desk.scrollLeft >= max - 1 && e.deltaY > 0;
    if (atStart || atEnd) return;
    e.preventDefault();
    desk.scrollLeft += e.deltaY;
  }, { passive: false });

  // due icone: foto sparse / foto in fila
  button.addEventListener("click", () => {
    tidy = !tidy;
    render(true);
  });
  if (messyButton) messyButton.addEventListener("click", () => {
    if (!tidy) return;
    tidy = false;
    render(true);
  });

  window.addEventListener("resize", () => {
    if (!desktop.matches && tidy) tidy = false;
    if (tidy) {
      desk.classList.remove("is-tidy");
      wrappers.forEach(clearGeo);
    }
    fitToScreen();
    render(false);
  });
})();


// =========================
// MENU A SCHERMO INTERO SU TELEFONO (pallino in alto a destra)
// =========================
(function () {
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.getElementById("mobile-menu");
  if (!toggle || !menu) return;

  const setOpen = (open) => {
    menu.classList.toggle("open", open);
    toggle.classList.toggle("active", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Chiudi il menu" : "Apri il menu");
    document.body.classList.toggle("menu-open", open);
    if (open) document.body.classList.remove("nav-hidden");
  };

  toggle.addEventListener("click", () => setOpen(!menu.classList.contains("open")));
  menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
  window.matchMedia("(min-width: 992px)").addEventListener("change", (e) => { if (e.matches) setOpen(false); });
})();

// =========================
// COPERTINE VIDEO: ferme se l'utente preferisce meno movimento
// =========================
(function () {
  const videos = document.querySelectorAll("#desk-images video");
  if (!videos.length) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const apply = () => videos.forEach((v) => {
    if (reduce.matches) { v.pause(); v.removeAttribute("autoplay"); }
    else { v.play().catch(() => {}); }
  });
  apply();
  reduce.addEventListener?.("change", apply);
})();

// =========================
// CASSETTO: elenco con anteprima al passaggio del mouse
// e progetto in sovraimpressione
// =========================
(function () {
  const panel = document.getElementById("drawer-panel");
  const section = document.getElementById("cassetto");
  if (!panel || !section) return;
  const items = [...section.querySelectorAll(".drawer-item")];
  const preview = section.querySelector(".drawer-preview");
  const titleEl = panel.querySelector("#drawer-panel-title");
  const fieldEl = panel.querySelector(".dp-field");
  const yearEl = panel.querySelector(".dp-year");
  const textEl = panel.querySelector(".drawer-panel-text");
  const slider = panel.querySelector(".drawer-slider");
  const track = panel.querySelector(".drawer-track");
  const prev = panel.querySelector(".drawer-prev");
  const next = panel.querySelector(".drawer-next");
  const count = panel.querySelector(".drawer-count");
  const closeBtn = panel.querySelector(".drawer-close");
  let lastFocus = null;
  let slides = [];

  // anteprima che segue il mouse
  const firstImage = (item) => item.querySelector(".drawer-images > *");
  items.forEach((item) => {
    const btn = item.querySelector(".drawer-open");
    btn.addEventListener("mouseenter", () => {
      const first = firstImage(item);
      preview.innerHTML = "";
      if (first && first.querySelector("img")) preview.appendChild(first.querySelector("img").cloneNode());
      else if (first && first.dataset.poster) {
        const im = document.createElement("img");
        im.src = first.dataset.poster;
        im.alt = "";
        preview.appendChild(im);
      }
      if (first && first.dataset.ratio) preview.style.aspectRatio = first.dataset.ratio;
      preview.classList.add("is-on");
    });
    btn.addEventListener("mouseleave", () => preview.classList.remove("is-on"));
  });
  section.addEventListener("mousemove", (e) => {
    const r = section.getBoundingClientRect();
    preview.style.left = e.clientX - r.left + 260 + "px";
    preview.style.top = e.clientY - r.top + "px";
  });

  const current = () => Math.round(slider.scrollLeft / Math.max(1, slider.clientWidth));
  // fa partire solo il video della foto visibile
  const playCurrent = () => {
    const i = current();
    slides.forEach((s, k) => {
      const v = s.querySelector("video");
      if (!v) return;
      if (k === i) v.play().catch(() => {});
      else v.pause();
    });
  };
  const update = () => {
    const i = current();
    playCurrent();
    count.textContent = slides.length ? (i + 1) + " / " + slides.length : "";
    prev.disabled = i <= 0;
    next.disabled = i >= slides.length - 1;
  };
  const goTo = (i) => {
    const t = Math.max(0, Math.min(slides.length - 1, i));
    slider.scrollTo({ left: t * slider.clientWidth, behavior: "smooth" });
  };

  const open = (item) => {
    lastFocus = document.activeElement;
    titleEl.textContent = item.querySelector(".drawer-name").textContent;
    fieldEl.textContent = item.querySelector(".drawer-field").textContent;
    yearEl.textContent = item.querySelector(".drawer-year").textContent;
    const data = item.querySelector(".drawer-data");
    textEl.textContent = data.querySelector(".drawer-text").textContent;
    track.innerHTML = data.querySelector(".drawer-images").innerHTML;
    track.querySelectorAll("[data-ratio]").forEach((d) => d.style.setProperty("--r", d.dataset.ratio.replace("/", " / ")));
    slides = [...track.children];
    preview.classList.remove("is-on");
    panel.hidden = false;
    document.body.classList.add("drawer-lock");
    slider.scrollLeft = 0;
    panel.scrollTop = 0;
    requestAnimationFrame(() => panel.classList.add("is-open"));
    update();
    closeBtn.focus();
  };
  const close = () => {
    panel.classList.remove("is-open");
    document.body.classList.remove("drawer-lock");
    track.querySelectorAll("video").forEach((v) => v.pause());
    setTimeout(() => { panel.hidden = true; track.innerHTML = ""; }, 300);
    if (lastFocus) lastFocus.focus();
  };

  items.forEach((item) => item.querySelector(".drawer-open").addEventListener("click", () => open(item)));
  closeBtn.addEventListener("click", close);
  panel.addEventListener("click", (e) => { if (e.target === panel) close(); });
  prev.addEventListener("click", () => goTo(current() - 1));
  next.addEventListener("click", () => goTo(current() + 1));
  track.addEventListener("click", () => goTo(current() + 1 >= slides.length ? 0 : current() + 1));
  slider.addEventListener("scroll", () => requestAnimationFrame(update), { passive: true });
  document.addEventListener("keydown", (e) => {
    if (panel.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") goTo(current() + 1);
    if (e.key === "ArrowLeft") goTo(current() - 1);
  });
})();
