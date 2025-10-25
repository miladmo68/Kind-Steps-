/* ================================
   MOBILE MENU + NAVBAR + SCROLL FX
=================================== */

const navbar = document.getElementById("navbar");
const mobileToggle = document.getElementById("mobileMenuToggle");
const mobileDrawer = document.getElementById("mobileDrawer");
const overlayBlur = document.getElementById("overlayBlur");
const mobileCloseBtn = document.getElementById("mobileCloseBtn");
const mobileLinks = document.querySelectorAll("[data-mobile-link]");

/* ---- open/close helpers ---- */
function openMobileMenu() {
  mobileToggle.classList.add("active");
  mobileDrawer.classList.add("active");
  overlayBlur.classList.add("active");
  document.body.style.overflow = "hidden";

  mobileDrawer.setAttribute("aria-hidden", "false");
  mobileToggle.setAttribute("aria-expanded", "true");

  if (mobileCloseBtn) mobileCloseBtn.focus();
}

function closeMobileMenu() {
  mobileToggle.classList.remove("active");
  mobileDrawer.classList.remove("active");
  overlayBlur.classList.remove("active");
  document.body.style.overflow = "";

  mobileDrawer.setAttribute("aria-hidden", "true");
  mobileToggle.setAttribute("aria-expanded", "false");
}

/* hamburger click */
if (mobileToggle) {
  mobileToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    if (mobileDrawer.classList.contains("active")) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });
}

/* close btn click */
if (mobileCloseBtn) {
  mobileCloseBtn.addEventListener("click", closeMobileMenu);
}

/* overlay click */
if (overlayBlur) {
  overlayBlur.addEventListener("click", closeMobileMenu);
}

/* link click inside drawer */
mobileLinks.forEach((link) => {
  link.addEventListener("click", () => {
    closeMobileMenu();
  });
});

/* esc key */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && mobileDrawer.classList.contains("active")) {
    closeMobileMenu();
  }
});

/* clicking outside drawer while open */
document.addEventListener("click", (e) => {
  if (!mobileDrawer.classList.contains("active")) return;

  const clickInsideDrawer = mobileDrawer.contains(e.target);
  const clickToggle = mobileToggle.contains(e.target);

  if (!clickInsideDrawer && !clickToggle) {
    closeMobileMenu();
  }
});

/* navbar shrink on scroll */
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

/* smooth scroll for nav anchors */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    const targetEl = document.querySelector(targetId);
    if (!targetEl) return;

    e.preventDefault();

    const navOffset = navbar.offsetHeight + 24;
    const elementPos = targetEl.getBoundingClientRect().top + window.scrollY;
    const scrollTo = elementPos - navOffset;

    window.scrollTo({
      top: scrollTo,
      behavior: "smooth",
    });
  });
});

/* scroll-indicator to #about */
const scrollIndicator = document.getElementById("scrollIndicator");
const aboutSection = document.getElementById("about");

if (scrollIndicator && aboutSection) {
  scrollIndicator.addEventListener("click", () => {
    const navOffset = navbar.offsetHeight + 24;
    const elementPos =
      aboutSection.getBoundingClientRect().top + window.scrollY;
    const scrollTo = elementPos - navOffset;

    window.scrollTo({
      top: scrollTo,
      behavior: "smooth",
    });
  });
}

/* ================================
   INTERSECTION OBSERVER ANIMS
=================================== */
const animateObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate");
      }
    });
  },
  {
    threshold: 0.15,
    rootMargin: "0px 0px -80px 0px",
  }
);

/* fade / slide elements */
document
  .querySelectorAll(".fade-in, .slide-in-left, .slide-in-right")
  .forEach((el) => animateObserver.observe(el));

/* stagger services cards */
const servicesGrid = document.querySelector(".services-grid");
if (servicesGrid) {
  const cards = servicesGrid.querySelectorAll(".service-card");
  const staggerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        cards.forEach((card, index) => {
          setTimeout(() => {
            card.classList.add("animate");
          }, index * 150);
        });
      });
    },
    { threshold: 0.1 }
  );

  staggerObserver.observe(servicesGrid);
}

/* ================================
   CONTACT FORM UX
=================================== */
const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector(".submit-btn");
    if (!submitBtn) return;

    const originalText = submitBtn.textContent;

    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;
    submitBtn.style.background = "linear-gradient(135deg, #94a3b8, #64748b)";

    setTimeout(() => {
      submitBtn.textContent = "Message Sent! ✓";
      submitBtn.style.background = "linear-gradient(135deg, #10b981, #059669)";
      submitBtn.style.transform = "scale(1.05)";

      setTimeout(() => {
        submitBtn.style.transform = "scale(1)";
      }, 200);

      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.style.background = "";
        contactForm.reset();
      }, 3000);
    }, 2000);
  });
}
