/* =========================================================
   GLOBAL ELEMENTS
========================================================= */
const navbar = document.getElementById("navbar");
const mobileToggle = document.getElementById("mobileMenuToggle");
const mobileDrawer = document.getElementById("mobileDrawer");
const overlayBlur = document.getElementById("overlayBlur");
const mobileCloseBtn = document.getElementById("mobileCloseBtn");
const mobileLinks = document.querySelectorAll("[data-mobile-link]");
const scrollIndicator = document.getElementById("scrollIndicator");
const aboutSection = document.getElementById("about");

/* If present in HTML (premium layout additions) */
const progressBar = document.getElementById("scrollProgressBar"); // thin bar under navbar
const heroParallaxOrbs = document.querySelectorAll(".hero-orb"); // glowing parallax blobs
const serviceTabs = document.querySelectorAll("[data-service-tab]"); // age tabs
const serviceCards = document.querySelectorAll("[data-service-age]"); // cards tagged by age
const contactForm = document.querySelector(".contact-form"); // consultation form
let toastEl = null; // we'll create toast on demand

/* =========================================================
   MOBILE MENU OPEN/CLOSE
========================================================= */

function openMobileMenu() {
  if (!mobileDrawer || !mobileToggle || !overlayBlur) return;

  mobileToggle.classList.add("active");
  mobileDrawer.classList.add("active");
  overlayBlur.classList.add("active");
  document.body.style.overflow = "hidden";

  mobileDrawer.setAttribute("aria-hidden", "false");
  mobileToggle.setAttribute("aria-expanded", "true");

  if (mobileCloseBtn) mobileCloseBtn.focus();
}

function closeMobileMenu() {
  if (!mobileDrawer || !mobileToggle || !overlayBlur) return;

  mobileToggle.classList.remove("active");
  mobileDrawer.classList.remove("active");
  overlayBlur.classList.remove("active");
  document.body.style.overflow = "";

  mobileDrawer.setAttribute("aria-hidden", "true");
  mobileToggle.setAttribute("aria-expanded", "false");
}

/* toggle button */
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

/* close X button */
if (mobileCloseBtn) {
  mobileCloseBtn.addEventListener("click", closeMobileMenu);
}

/* overlay click closes */
if (overlayBlur) {
  overlayBlur.addEventListener("click", closeMobileMenu);
}

/* clicking nav links in drawer closes menu */
mobileLinks.forEach((link) => {
  link.addEventListener("click", () => {
    closeMobileMenu();
  });
});

/* click outside drawer closes it */
document.addEventListener("click", (e) => {
  if (!mobileDrawer || !mobileToggle) return;
  if (!mobileDrawer.classList.contains("active")) return;

  const clickInsideDrawer = mobileDrawer.contains(e.target);
  const clickToggle = mobileToggle.contains(e.target);

  if (!clickInsideDrawer && !clickToggle) {
    closeMobileMenu();
  }
});

/* esc key closes drawer */
document.addEventListener("keydown", (e) => {
  if (
    e.key === "Escape" &&
    mobileDrawer &&
    mobileDrawer.classList.contains("active")
  ) {
    closeMobileMenu();
  }
});

/* =========================================================
   NAVBAR SCROLL STATE + PROGRESS BAR
========================================================= */

function updateNavbarState() {
  if (!navbar) return;
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
}

function updateScrollProgress() {
  if (!progressBar) return;

  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;

  let progress = 0;
  if (docHeight > 0) {
    progress = (scrollTop / docHeight) * 100;
  }

  progressBar.style.transform = `scaleX(${progress / 100})`;
}

window.addEventListener("scroll", () => {
  updateNavbarState();
  updateScrollProgress();
});

updateNavbarState();
updateScrollProgress();

/* =========================================================
   SMOOTH SCROLL FOR ALL # LINKS
========================================================= */

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    const targetEl = document.querySelector(targetId);
    if (!targetEl) return;

    e.preventDefault();

    // offset so section title نیفته زیر ناوبار
    const navOffset = navbar ? navbar.offsetHeight + 24 : 24;
    const elementPos = targetEl.getBoundingClientRect().top + window.scrollY;
    const scrollTo = elementPos - navOffset;

    window.scrollTo({
      top: scrollTo,
      behavior: "smooth",
    });
  });
});

/* special scroll indicator in hero → scroll to "about" */
if (scrollIndicator && aboutSection) {
  scrollIndicator.addEventListener("click", () => {
    const navOffset = navbar ? navbar.offsetHeight + 24 : 24;
    const elementPos =
      aboutSection.getBoundingClientRect().top + window.scrollY;
    const scrollTo = elementPos - navOffset;

    window.scrollTo({
      top: scrollTo,
      behavior: "smooth",
    });
  });
}

/* =========================================================
   HERO PARALLAX ORBS
   (گلوب‌های محو که با موس خیلی آروم حرکت می‌کنن)
========================================================= */

window.addEventListener("pointermove", (e) => {
  if (!heroParallaxOrbs || heroParallaxOrbs.length === 0) return;

  // نسبت موقعیت موس نسبت به وسط ویوپورت
  const xRatio = (e.clientX / window.innerWidth - 0.5) * 2; // -1 تا 1
  const yRatio = (e.clientY / window.innerHeight - 0.5) * 2;

  heroParallaxOrbs.forEach((orb, index) => {
    // هر orb شدت متفاوت
    const strength = 10 + index * 5; // px
    const translateX = xRatio * strength;
    const translateY = yRatio * strength;

    orb.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(1)`;
  });
});

/* =========================================================
   INTERSECTION OBSERVER:
   - fade-in
   - slide-in-left
   - slide-in-right
   - plus stagger for service cards
========================================================= */

/* generic reveal observer */
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

/* attach to fade/slide elements */
document
  .querySelectorAll(".fade-in, .slide-in-left, .slide-in-right")
  .forEach((el) => animateObserver.observe(el));

/* staggered reveal for service cards grid */
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
          }, index * 120);
        });
      });
    },
    { threshold: 0.1 }
  );

  staggerObserver.observe(servicesGrid);
}

/* =========================================================
   SERVICE AGE FILTER TABS
   - دکمه‌ها مثل data-service-tab="teen" یا "early"
   - کارت‌ها مثل data-service-age="teen early"
========================================================= */

function clearActiveServiceTabs() {
  serviceTabs.forEach((tabBtn) => {
    tabBtn.classList.remove("active");
  });
}

function filterServicesByAge(ageKey) {
  // ageKey ممکنه باشه "all" یا "early" یا "school" یا "teen"
  serviceCards.forEach((card) => {
    const agesForThisCard = card
      .getAttribute("data-service-age")
      .split(" ")
      .map((x) => x.trim());

    const shouldShow = ageKey === "all" || agesForThisCard.includes(ageKey);

    if (shouldShow) {
      card.style.display = "";
      // انیمیشن ورود دوباره
      requestAnimationFrame(() => {
        card.classList.add("animate");
      });
    } else {
      card.style.display = "none";
    }
  });
}

serviceTabs.forEach((tabBtn) => {
  tabBtn.addEventListener("click", () => {
    const key = tabBtn.getAttribute("data-service-tab") || "all";

    clearActiveServiceTabs();
    tabBtn.classList.add("active");
    filterServicesByAge(key);
  });
});

/* نکته:
   ما بعد از لود صفحه می‌تونیم یک تب پیش‌فرض رو فعال کنیم.
   اینجا می‌گردیم دنبال تب ".active" اولیه. اگه نبود، می‌ذاریم "all".
*/
(function initServiceFilterOnLoad() {
  if (serviceTabs.length === 0 || serviceCards.length === 0) return;

  let defaultTab = document.querySelector("[data-service-tab].active");
  if (!defaultTab) {
    defaultTab = document.querySelector('[data-service-tab="all"]');
    if (defaultTab) defaultTab.classList.add("active");
  }

  if (defaultTab) {
    const key = defaultTab.getAttribute("data-service-tab") || "all";
    filterServicesByAge(key);
  }
})();

/* =========================================================
   CONTACT FORM UX
   - دکمه Submit میره تو حالت "Sending..."
   - بعدش پیام موفقیت
   - Toast پایین صفحه
========================================================= */

function showToast(message = "Thank you! I'll reach out soon.") {
  // اگه قبلاً توست داریم، اول پاکش کنیم
  if (toastEl) {
    toastEl.remove();
    toastEl = null;
  }

  toastEl = document.createElement("div");
  toastEl.className = "toast-success";
  toastEl.setAttribute("role", "status");
  toastEl.textContent = message;

  document.body.appendChild(toastEl);

  // کلاس برای fade-in
  requestAnimationFrame(() => {
    toastEl.classList.add("visible");
  });

  // بعد چند ثانیه محو بشه
  setTimeout(() => {
    if (!toastEl) return;
    toastEl.classList.remove("visible");
    setTimeout(() => {
      if (toastEl) {
        toastEl.remove();
        toastEl = null;
      }
    }, 400);
  }, 4000);
}

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector(".submit-btn");
    if (!submitBtn) return;

    const originalText = submitBtn.textContent;

    // حالت لودینگ
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;
    submitBtn.classList.add("is-loading");

    // fake async
    setTimeout(() => {
      // حالت موفق
      submitBtn.textContent = "Message Sent! ✓";
      submitBtn.classList.remove("is-loading");
      submitBtn.classList.add("is-success");

      // یه افکت کوچولو
      submitBtn.style.transform = "scale(1.05)";
      setTimeout(() => {
        submitBtn.style.transform = "scale(1)";
      }, 200);

      // toast
      showToast("Thank you! Your message has been sent.");

      // برگردوندن به حالت اولیه
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.classList.remove("is-success");
        submitBtn.style.transform = "";
        contactForm.reset();
      }, 3000);
    }, 2000);
  });
}
