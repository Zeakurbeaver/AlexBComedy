// =============================================
// NAVIGATION
// =============================================
const sections   = document.querySelectorAll(".section");
const allNavBtns = document.querySelectorAll(".nav-btn");

function showSection(id) {
  sections.forEach((s) => s.classList.remove("active"));
  allNavBtns.forEach((b) => b.classList.remove("active"));

  const target = document.getElementById(id);
  if (!target) return;
  target.classList.add("active");
  allNavBtns.forEach((b) => { if (b.dataset.section === id) b.classList.add("active"); });

  window.scrollTo({ top: 0, behavior: "instant" });
  animateSection(id);
}

allNavBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.section;
    if (id) showSection(id);
  });
});

// =============================================
// MARQUEE
// =============================================
document.querySelectorAll(".tape-divider").forEach((divider) => {
  const span = divider.querySelector("span");
  if (!span) return;
  const track = document.createElement("div");
  track.className = "tape-track";
  // 20 identical copies — total width >> any viewport, loop translates by
  // exactly 1/20 of track width (= one copy), so seam is never visible
  for (let i = 0; i < 20; i++) {
    const s = span.cloneNode(true);
    if (i > 0) s.setAttribute("aria-hidden", "true");
    track.appendChild(s);
  }
  divider.innerHTML = "";
  divider.appendChild(track);
});

// =============================================
// VIDEO — auto-pause + mute toggle
// =============================================
function ytCmd(iframe, func) {
  try {
    iframe.contentWindow.postMessage(
      JSON.stringify({ event: "command", func, args: [] }),
      "*"
    );
  } catch (e) {}
}

const videoContainers = document.querySelectorAll(".video-container");

const videoObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const iframe = entry.target.querySelector("iframe");
      if (!iframe) return;
      if (entry.isIntersecting) {
        // Pause all others first
        videoContainers.forEach((other) => {
          if (other !== entry.target) ytCmd(other.querySelector("iframe"), "pauseVideo");
        });
        ytCmd(iframe, "playVideo");
      } else {
        ytCmd(iframe, "pauseVideo");
      }
    });
  },
  { threshold: 0.5 }
);

videoContainers.forEach((c) => videoObserver.observe(c));

// Mute toggle
document.querySelectorAll(".mute-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const iframe = btn.closest(".video-container").querySelector("iframe");
    const muted = btn.dataset.muted === "true";
    ytCmd(iframe, muted ? "unMute" : "mute");
    btn.dataset.muted = muted ? "false" : "true";
    btn.textContent  = muted ? "MUTE" : "UNMUTE";
    btn.classList.toggle("unmuted", muted);
  });
});

// =============================================
// GSAP
// =============================================
gsap.registerPlugin(ScrollTrigger);

function restoreTilt(el) {
  const t = el.classList.contains("tilt-left")   ? "rotate(-1.5deg)"
           : el.classList.contains("tilt-right")  ? "rotate(1.8deg)"
           : el.classList.contains("tilt-slight") ? "rotate(-0.7deg)"
           : "";
  if (t) el.style.transform = t;
}

// ---- single, clean scroll-reveal; no conflicting from/to ----
function setupScrollReveals() {
  gsap.utils.toArray(".reveal").forEach((el) => {
    if (el.dataset.revealed) return;
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: "top 92%", once: true },
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: "power3.out",
      onComplete() {
        // restore CSS tilt transform after GSAP clears inline styles
        restoreTilt(el);
        // also check immediate children (e.g. .oval-photo, .card inside reveal wrapper)
        el.querySelectorAll(".tilt-left, .tilt-right, .tilt-slight").forEach(restoreTilt);
        el.dataset.revealed = "1";
      },
    });
  });

  gsap.utils.toArray(".reveal-strip").forEach((el) => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: "top 95%", once: true },
      opacity: 1,
      duration: 0.5,
      ease: "power2.out",
    });
  });
}

// =============================================
// HOME ENTRANCE
// =============================================
function animateHome() {
  ScrollTrigger.getAll().forEach((t) => t.kill());

  // Reset all reveal elements to invisible
  gsap.utils.toArray(".reveal").forEach((el) => {
    delete el.dataset.revealed;
    gsap.set(el, { opacity: 0, y: 36 });
  });
  gsap.utils.toArray(".reveal-strip").forEach((el) => {
    gsap.set(el, { opacity: 0 });
  });

  // Set up scroll reveals IMMEDIATELY — don't wait for hero animation
  setupScrollReveals();

  // Hero text entrance (runs in parallel, independently)
  gsap.set(".hero-name", { opacity: 0, y: 80, skewX: -4 });
  gsap.set(".hero-tag",  { opacity: 0, y: 40 });
  gsap.set(".hero-cta",  { opacity: 0, y: 24 });

  gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.15 })
    .to(".hero-name", { opacity: 1, y: 0, skewX: 0, duration: 1.0 })
    .to(".hero-tag",  { opacity: 1, y: 0, duration: 0.6 }, "-=0.45")
    .to(".hero-cta",  { opacity: 1, y: 0, duration: 0.45 }, "-=0.35");
}

// =============================================
// TOUR ENTRANCE
// =============================================
function animateTour() {
  ScrollTrigger.getAll().forEach((t) => t.kill());

  gsap.set(".page-title",       { opacity: 0, y: 30 });
  gsap.set(".tour-item",        { opacity: 0, x: -30 });
  gsap.set(".tour-footer-note", { opacity: 0, y: 20 });

  gsap.to(".page-title", { opacity: 1, y: 0, duration: 0.75, ease: "back.out(1.4)" });

  gsap.to(".tour-item", {
    opacity: 1, x: 0,
    stagger: 0.07, duration: 0.5, ease: "power3.out", delay: 0.3,
    onComplete() {
      document.querySelectorAll(".tour-item").forEach((el, i) => {
        el.style.transform = i % 2 === 0 ? "rotate(-0.4deg)" : "rotate(0.4deg)";
      });
    },
  });

  gsap.to(".tour-footer-note", {
    opacity: 1, y: 0, duration: 0.5, ease: "power3.out", delay: 0.7,
    onComplete() { gsap.set(".tour-footer-note", { clearProps: "transform" }); },
  });
}

// =============================================
// CONTACT ENTRANCE
// =============================================
function animateContact() {
  ScrollTrigger.getAll().forEach((t) => t.kill());

  gsap.set(".page-title", { opacity: 0, y: 30 });
  gsap.utils.toArray(".contact-collage .reveal").forEach((el) => {
    delete el.dataset.revealed;
    gsap.set(el, { opacity: 0, y: 36 });
  });

  gsap.to(".page-title", { opacity: 1, y: 0, duration: 0.75, ease: "back.out(1.4)" });
  gsap.to(".contact-collage .reveal", {
    opacity: 1, y: 0,
    stagger: 0.12, duration: 0.6, ease: "back.out(1.5)", delay: 0.3,
    onComplete() {
      document.querySelectorAll(".contact-collage .reveal").forEach(restoreTilt);
    },
  });
}

function animateSection(id) {
  if (id === "home")    animateHome();
  if (id === "tour")    animateTour();
  if (id === "contact") animateContact();
}

// =============================================
// CONTACT FORM
// =============================================
const form = document.getElementById("contact-form");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = form.querySelector(".tape-btn");
    const orig = btn.textContent;
    btn.textContent = "SENT!";
    btn.disabled = true;
    gsap.fromTo(btn, { scale: 1 }, { scale: 1.08, yoyo: true, repeat: 1, duration: 0.15 });
    setTimeout(() => { btn.textContent = orig; btn.disabled = false; form.reset(); }, 3000);
  });
}

// =============================================
// INIT
// =============================================
animateHome();
