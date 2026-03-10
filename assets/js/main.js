/* global bootstrap, AOS */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function initAOS() {
  AOS.init({
    duration: 800,
    easing: "ease-out-cubic",
    once: true,
    offset: 80,
  });
}

function hideLoaderWhenReady() {
  const loader = $("#pageLoader");
  if (!loader) return;

  window.addEventListener("load", () => {
    loader.classList.add("is-hidden");
    setTimeout(() => loader.remove(), 450);
  });
}

function initTyping() {
  const el = $("#typingText");
  if (!el) return;

  const phrases = ["Full Stack PHP Laravel 12 Developer", "Backend & Frontend Engineer", "Problem Solver"];
  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  const tick = () => {
    const phrase = phrases[phraseIdx];
    const next = isDeleting ? phrase.slice(0, charIdx - 1) : phrase.slice(0, charIdx + 1);
    el.textContent = next;

    const doneTyping = !isDeleting && next === phrase;
    const doneDeleting = isDeleting && next === "";

    if (doneTyping) {
      isDeleting = true;
      setTimeout(tick, 900);
      return;
    }

    if (doneDeleting) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      setTimeout(tick, 180);
      return;
    }

    charIdx += isDeleting ? -1 : 1;
    const base = isDeleting ? 32 : 46;
    const jitter = Math.random() * 30;
    setTimeout(tick, base * 10 + jitter);
  };

  tick();
}

function initSmoothAnchorScroll() {
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const target = $(href);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });

      // Close mobile menu if open
      const menu = $("#navMenu");
      if (menu && menu.classList.contains("show")) {
        const bsCollapse = bootstrap.Collapse.getOrCreateInstance(menu);
        bsCollapse.hide();
      }
    });
  });
}

function initProjectsFilter() {
  const buttons = $$(".btn-filter");
  const items = $$(".project-item");
  if (!buttons.length || !items.length) return;

  const applyFilter = (filter) => {
    items.forEach((item) => {
      const cats = (item.getAttribute("data-category") || "").split(/\s+/).filter(Boolean);
      const show = filter === "all" ? true : cats.includes(filter);
      item.classList.toggle("is-hidden", !show);
    });
  };

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      applyFilter(btn.getAttribute("data-filter") || "all");
    });
  });
}

function initScrollTop() {
  const btn = $("#scrollTopBtn");
  if (!btn) return;

  const onScroll = () => {
    const y = window.scrollY || document.documentElement.scrollTop;
    btn.classList.toggle("is-visible", y > 500);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function initSkillProgressOnScroll() {
  const bars = $$(".skill-progress .progress-bar[data-skill]");
  if (!bars.length) return;

  const fill = () => {
    bars.forEach((bar) => {
      const v = Math.max(0, Math.min(100, Number(bar.getAttribute("data-skill") || 0)));
      bar.style.width = `${v}%`;
      bar.setAttribute("aria-valuenow", String(v));
    });
  };

  const section = $("#skills");
  if (!section) {
    fill();
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      const isVisible = entries.some((e) => e.isIntersecting);
      if (isVisible) {
        fill();
        io.disconnect();
      }
    },
    { threshold: 0.25 }
  );

  io.observe(section);
}

function initContactForm() {
  const form = $("#contactForm");
  if (!form) return;

  const toastEl = $("#sentToast");
  const toast = toastEl ? bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 3200 }) : null;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.elements.namedItem("name")?.value?.trim() || "";
    const email = form.elements.namedItem("email")?.value?.trim() || "";
    const message = form.elements.namedItem("message")?.value?.trim() || "";

    let ok = true;
    const nameInput = form.elements.namedItem("name");
    const emailInput = form.elements.namedItem("email");
    const messageInput = form.elements.namedItem("message");

    if (nameInput) nameInput.classList.toggle("is-invalid", !name);
    if (emailInput) emailInput.classList.toggle("is-invalid", !emailRegex.test(email));
    if (messageInput) messageInput.classList.toggle("is-invalid", !message);

    ok = Boolean(name) && emailRegex.test(email) && Boolean(message);
    if (!ok) return;

    const subject = encodeURIComponent(`Portfolio Contact — ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n`);
    window.location.href = `mailto:engmahmoudcr1000@gmail.com?subject=${subject}&body=${body}`;
    toast?.show();
    form.reset();
    ["name", "email", "message"].forEach((n) => form.elements.namedItem(n)?.classList.remove("is-invalid"));
  });
}

hideLoaderWhenReady();
initAOS();
initTyping();
initSmoothAnchorScroll();
initProjectsFilter();
initScrollTop();
initSkillProgressOnScroll();
initContactForm();

