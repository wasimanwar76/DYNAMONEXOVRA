// Year
document.getElementById("year").textContent = new Date().getFullYear();

// Mobile menu
const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const iconOpen = document.getElementById("icon-open");
const iconClose = document.getElementById("icon-close");
let menuIsOpen = false;
menuToggle.addEventListener("click", () => {
  menuIsOpen = !menuIsOpen;
  menuToggle.setAttribute("aria-expanded", String(menuIsOpen));
  if (menuIsOpen) {
    mobileMenu.style.maxHeight = mobileMenu.scrollHeight + "px";
    mobileMenu.style.opacity = "1";
    iconOpen.classList.add("hidden");
    iconClose.classList.remove("hidden");
  } else {
    mobileMenu.style.maxHeight = "0px";
    mobileMenu.style.opacity = "0";
    iconOpen.classList.remove("hidden");
    iconClose.classList.add("hidden");
  }
});
mobileMenu.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    menuIsOpen = false;
    mobileMenu.style.maxHeight = "0px";
    mobileMenu.style.opacity = "0";
    iconOpen.classList.remove("hidden");
    iconClose.classList.add("hidden");
    menuToggle.setAttribute("aria-expanded", "false");
  }),
);

// Sticky header shrink
const header = document.getElementById("site-header");
window.addEventListener(
  "scroll",
  () => {
    if (window.scrollY > 40) {
      header.classList.add("shadow-lg", "shadow-black/20");
    } else {
      header.classList.remove("shadow-lg", "shadow-black/20");
    }
    // back to top visibility
    const btn = document.getElementById("back-to-top");
    if (window.scrollY > 500) {
      btn.classList.remove("opacity-0", "pointer-events-none", "translate-y-3");
    } else {
      btn.classList.add("opacity-0", "pointer-events-none", "translate-y-3");
    }
  },
  { passive: true },
);

document.getElementById("back-to-top").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Active nav link on scroll
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav-link");
const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((l) => l.classList.remove("active"));
        const activeLink = document.querySelector(
          `.nav-link[href="#${entry.target.id}"]`,
        );
        if (activeLink) activeLink.classList.add("active");
      }
    });
  },
  { rootMargin: "-45% 0px -50% 0px" },
);
sections.forEach((s) => navObserver.observe(s));

// Reveal on scroll
const revealEls = document.querySelectorAll(".reveal, .reveal-stagger");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 },
);
revealEls.forEach((el) => revealObserver.observe(el));

// Counter animation
const counters = document.querySelectorAll(".counter");
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const duration = 1400;
        const start = performance.now();
        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target);
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        counterObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.5 },
);
counters.forEach((c) => counterObserver.observe(c));

// Testimonial carousel
const slides = document.querySelectorAll(".testimonial-slide");
const dots = document.querySelectorAll(".testi-dot");
let current = 0;
function showSlide(i) {
  slides.forEach((s, idx) => s.classList.toggle("hidden", idx !== i));
  dots.forEach((d, idx) => {
    d.classList.toggle("bg-brass", idx === i);
    d.classList.toggle("bg-white/20", idx !== i);
    d.setAttribute("aria-selected", String(idx === i));
  });
  current = i;
}
dots.forEach((dot) =>
  dot.addEventListener("click", () => showSlide(parseInt(dot.dataset.go, 10))),
);
let autoRotate = setInterval(
  () => showSlide((current + 1) % slides.length),
  6000,
);
document
  .getElementById("testimonial-track")
  .addEventListener("mouseenter", () => clearInterval(autoRotate));

// Contact form validation
const form = document.getElementById("contact-form");
const submitBtn = document.getElementById("submit-btn");
const submitLabel = document.getElementById("submit-label");
const submitBar = document.getElementById("submit-bar");
const successMsg = document.getElementById("form-success");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let valid = true;
  form.querySelectorAll("[required]").forEach((field) => {
    const errorEl = field.parentElement.querySelector(".error-msg");
    let fieldValid = field.value.trim().length > 1;
    if (field.type === "email") {
      fieldValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
    }
    if (!fieldValid) {
      valid = false;
      field.classList.add("border-brass");
      if (errorEl) errorEl.classList.remove("hidden");
    } else {
      field.classList.remove("border-brass");
      if (errorEl) errorEl.classList.add("hidden");
    }
  });

  if (!valid) return;

  submitLabel.textContent = "Sending…";
  submitBtn.disabled = true;
  submitBar.style.transition = "width 1s ease";
  submitBar.style.width = "100%";

  setTimeout(() => {
    submitLabel.textContent = "Send brief";
    submitBtn.disabled = false;
    submitBar.style.transition = "none";
    submitBar.style.width = "0%";
    successMsg.classList.remove("hidden");
    form.reset();
  }, 1100);
});
// Cookie Banner Logic
const cookieBanner = document.getElementById("cookie-banner");
const acceptCookiesBtn = document.getElementById("accept-cookies");
const closeCookiesBtn = document.getElementById("close-cookies");

// Check if the user has already accepted or declined
const cookieConsent = localStorage.getItem("dx_cookie_consent");

if (!cookieConsent) {
  // Show the banner after a short delay (e.g., 1.5 seconds)
  setTimeout(() => {
    cookieBanner.classList.remove("translate-y-[150%]", "opacity-0");
  }, 1500);
}

// Handle Accept
acceptCookiesBtn.addEventListener("click", () => {
  localStorage.setItem("dx_cookie_consent", "accepted");
  hideBanner();
});

// Handle Decline
closeCookiesBtn.addEventListener("click", () => {
  localStorage.setItem("dx_cookie_consent", "declined");
  hideBanner();
});

function hideBanner() {
  cookieBanner.classList.add("translate-y-[150%]", "opacity-0");
  // Optional: completely remove from DOM after animation completes
  setTimeout(() => {
    cookieBanner.style.display = "none";
  }, 700);
}
