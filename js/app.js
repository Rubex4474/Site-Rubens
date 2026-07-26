// ==========================================================================
// CONFIG — edite aqui os dados de contato reais antes de publicar o site
// ==========================================================================
const WHATSAPP_NUMBER = "5511999999999"; // formato: 55 + DDD + número, sem espaços/símbolos
const WHATSAPP_MESSAGE = "Olá, Rubens! Vim pelo site e quero saber mais sobre a gestão de tráfego pago.";
const INSTAGRAM_HANDLE = "seu.usuario"; // sem o @

document.addEventListener("DOMContentLoaded", () => {
  wireContactLinks();
  setupNavbar();
  setupMobileMenu();
  setupScrollReveal();
  setupCounters();
  setupFaqAccordion();
  setupBackgroundVideos();
  setupSceneCrossfade();
  setupFeedbackSwitcher();
  document.getElementById("year").textContent = new Date().getFullYear();
});

// ============ Feedback video switcher (Cases de Sucesso) ============
function setupFeedbackSwitcher() {
  const items = document.querySelectorAll(".feedback-item");
  const video = document.querySelector(".feedback-video");
  const source = video ? video.querySelector("source") : null;
  const playBtn = document.querySelector(".feedback-play-btn");
  if (!items.length || !video || !source || !playBtn) return;

  function showOverlay() {
    playBtn.classList.remove("hidden");
    video.controls = false;
  }

  items.forEach((item) => {
    item.addEventListener("click", () => {
      items.forEach((i) => i.classList.remove("active"));
      item.classList.add("active");

      const newSrc = item.dataset.video;
      if (source.getAttribute("src") !== newSrc) {
        video.pause();
        source.setAttribute("src", newSrc);
        source.setAttribute("type", item.dataset.type || "video/mp4");
        video.load();
      }
      showOverlay();
    });
  });

  playBtn.addEventListener("click", () => {
    playBtn.classList.add("hidden");
    video.controls = true;
    video.play().catch(() => showOverlay());
  });

  video.addEventListener("pause", showOverlay);
  video.addEventListener("ended", showOverlay);
}

// ============ Scene crossfade: each registered section fades its own bg video in/out as it scrolls through the viewport ============
const SCENE_SECTIONS = [
  { sectionId: "hero", layerSelector: ".scene-layer-hero" },
  { sectionId: "autoridade", layerSelector: ".scene-layer-authority" },
  { sectionId: "como-funciona", layerSelector: ".scene-layer-metodo" },
  { sectionId: "diferenciais", layerSelector: ".scene-layer-diferenciais" },
  { sectionId: "servicos", layerSelector: ".scene-layer-servicos" },
  { sectionId: "final-cta", layerSelector: ".scene-layer-cta" },
];

function setupSceneCrossfade() {
  const clamp01 = (v) => Math.min(Math.max(v, 0), 1);

  const scenes = SCENE_SECTIONS
    .map(({ sectionId, layerSelector }) => ({
      section: document.getElementById(sectionId),
      layer: document.querySelector(layerSelector),
    }))
    .filter(({ section, layer }) => section && layer);

  if (!scenes.length) return;

  let ticking = false;

  function update() {
    ticking = false;
    const vh = window.innerHeight;

    scenes.forEach(({ section, layer }) => {
      const rect = section.getBoundingClientRect();
      // fades in as the section's top travels from the bottom edge of the viewport to the top
      const enter = clamp01(1 - rect.top / vh);
      // fades out as the section's bottom travels from the bottom edge of the viewport to the top
      const exit = clamp01(1 - rect.bottom / vh);
      layer.style.opacity = enter * (1 - exit);
    });
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
}

// ============ Background videos (retry autoplay if browser blocked it) ============
function setupBackgroundVideos() {
  document.querySelectorAll("video[autoplay]").forEach((video) => {
    const tryPlay = () => video.play().catch(() => {});
    tryPlay();
    video.addEventListener("loadeddata", tryPlay, { once: true });
  });
}

// ============ Contact links (WhatsApp / Instagram) ============
function wireContactLinks() {
  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
  document.querySelectorAll(".whatsapp-link").forEach((el) => (el.href = waHref));

  const igHref = `https://instagram.com/${INSTAGRAM_HANDLE}`;
  document.querySelectorAll("[data-instagram-link]").forEach((el) => (el.href = igHref));
}

// ============ Navbar background on scroll ============
function setupNavbar() {
  const navbar = document.getElementById("navbar");
  const onScroll = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 20);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

// ============ Mobile menu ============
function setupMobileMenu() {
  const burger = document.getElementById("navBurger");
  const menu = document.getElementById("mobileMenu");

  burger.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    burger.classList.toggle("open", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      burger.classList.remove("open");
      document.body.style.overflow = "";
    });
  });
}

// ============ Scroll reveal ============
function setupScrollReveal() {
  const targets = document.querySelectorAll("[data-reveal]");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );
  targets.forEach((el) => observer.observe(el));
}

// ============ Animated counters ============
function setupCounters() {
  const counters = document.querySelectorAll("[data-counter]");

  const animate = (el) => {
    const target = parseFloat(el.dataset.target);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const duration = 1600;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = `${prefix}${value.toFixed(decimals)}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((el) => observer.observe(el));
}

// ============ FAQ accordion ============
function setupFaqAccordion() {
  const items = document.querySelectorAll(".faq-item");

  items.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      items.forEach((other) => {
        other.classList.remove("open");
        other.querySelector(".faq-answer").style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add("open");
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    });
  });
}
