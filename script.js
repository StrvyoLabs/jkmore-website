(() => {
  const WHATSAPP = "919520077712";
  document.documentElement.classList.remove("no-js");

  // Year
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // Nav border on scroll
  const nav = document.querySelector(".nav");
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile menu
  const toggle = document.querySelector(".nav__toggle");
  const menu = document.getElementById("menu");
  const setMenu = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.classList.toggle("is-open", open);
  };
  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

  // Reveal on scroll
  const items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 4) * 70}ms`;
      io.observe(el);
    });
  } else {
    items.forEach((el) => el.classList.add("is-in"));
  }

  // Sajavat colourway switcher
  const swatches = document.querySelectorAll(".colourways button");
  const featImg = document.getElementById("sajavat-img");
  const featName = document.getElementById("sajavat-name");
  const featCta = document.getElementById("sajavat-cta");
  swatches.forEach((b) => { const i = new Image(); i.src = `assets/img/${b.dataset.img}.jpg`; }); // preload
  const pick = (btn) => {
    if (btn.getAttribute("aria-checked") === "true") return;
    swatches.forEach((b) => { b.setAttribute("aria-checked", String(b === btn)); b.tabIndex = b === btn ? 0 : -1; });
    const name = `Roman ${btn.dataset.name}`;
    featImg.classList.add("is-swapping");
    setTimeout(() => {
      featImg.onload = () => featImg.classList.remove("is-swapping");
      featImg.src = `assets/img/${btn.dataset.img}.jpg`;
      featImg.alt = `Sajavat Collection, ${name} tiles shown in a room`;
    }, 220);
    featName.textContent = name;
    featCta.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hi JK More, I'm interested in the Sajavat ${name} tiles.`)}`;
  };
  swatches.forEach((b, idx) => {
    b.tabIndex = b.getAttribute("aria-checked") === "true" ? 0 : -1;
    b.addEventListener("click", () => pick(b));
    b.addEventListener("keydown", (e) => {
      const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (!d) return;
      e.preventDefault();
      const next = swatches[(idx + d + swatches.length) % swatches.length];
      next.focus(); pick(next);
    });
  });

  // Enquiry → WhatsApp
  const form = document.getElementById("enquiry");
  const err = form.querySelector(".enquiry__error");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = (data.get("name") || "").toString().trim();
    if (!name) { err.hidden = false; form.elements.name.focus(); return; }
    err.hidden = true;

    const interests = data.getAll("interest");
    const msg = (data.get("message") || "").toString().trim();
    const city = (data.get("city") || "").toString().trim();
    const lines = [
      `Hi JK More, I'm ${name}${city ? ` from ${city}` : ""}.`,
      interests.length ? `I'm interested in: ${interests.join(", ")}.` : "",
      msg,
    ].filter(Boolean);

    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener");
  });
})();
