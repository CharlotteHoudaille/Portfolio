/* ==========================================================
   Charlotte Houdaille - Portfolio
   ========================================================== */

const IMG = "assets/img/";
const LANG = document.documentElement.lang === "en" ? "en" : "fr";
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

const UI = {
  fr: { open: "voir le projet", year: "Année", zoom: "Agrandir", copied: "Copié !" },
  en: { open: "view project", year: "Year", zoom: "Enlarge", copied: "Copied!" },
}[LANG];

const HERO_SLIDES = [
  "mq-station.jpg", "bio-print.jpg", "cloud.jpg", "mycelium.jpg", "orika.jpg",
  "mq-tsunami.jpg", "bio-shapes.jpg", "maze.jpg", "bio-sprouts.jpg",
];

/* ----------------------------------------------------------
   NAV - fond dès qu'on quitte le haut de page
   ---------------------------------------------------------- */
const nav = document.querySelector(".nav");
const updateNav = () => nav.classList.toggle("is-scrolled", window.scrollY > 60);
window.addEventListener("scroll", updateNav, { passive: true });
updateNav();

/* ----------------------------------------------------------
   HERO - photos qui défilent en arrière-plan
   ---------------------------------------------------------- */
(function heroSlides() {
  const box = document.querySelector(".hero__slides");
  const imgs = HERO_SLIDES.map((src, i) => {
    const img = new Image();
    img.src = IMG + src;
    img.alt = "";
    img.decoding = "async";
    if (i === 0) img.classList.add("is-active");
    box.appendChild(img);
    return img;
  });
  if (reduceMotion) return;
  let i = 0;
  setInterval(() => {
    imgs[i].classList.remove("is-active");
    i = (i + 1) % imgs.length;
    imgs[i].classList.add("is-active");
  }, 1800);
})();

/* ----------------------------------------------------------
   PROJETS - génération des cartes
   ---------------------------------------------------------- */
const track = document.querySelector(".projects__track");
const featuredBox = document.querySelector(".featured");

function makeCard(p, big) {
  const t = p[LANG];
  const card = document.createElement("button");
  card.type = "button";
  card.className = big ? "card card--big" : "card";
  card.dataset.id = p.id;
  card.setAttribute("aria-label", `${t.title} - ${UI.open}`);
  card.innerHTML = `
    <div class="card__media">
      <img class="is-active" src="${IMG + p.cover}" alt="" loading="lazy" draggable="false">
    </div>
    <span class="card__title" data-reveal>${t.title}</span>
    <span class="card__meta">${p.year} · ${t.context}</span>
    ${big ? `<span class="card__lead">${t.lead}</span>` : ""}`;
  hoverSlides(card, p);
  return card;
}

// Au survol d'une carte, les photos du projet défilent
function hoverSlides(card, p) {
  const box = card.querySelector(".card__media");
  const srcs = [p.cover, ...p.gallery.map(([src]) => src)]
    .filter((src, k, all) => all.indexOf(src) === k && !/\.(mp4|webm|mov)$/i.test(src));
  if (srcs.length < 2 || reduceMotion) return;
  let imgs = null, k = 0, timer = null;

  function show(n) {
    imgs.forEach((img, j) => img.classList.toggle("is-active", j === n));
  }
  card.addEventListener("pointerenter", (e) => {
    if (e.pointerType !== "mouse") return;
    if (!imgs) {
      imgs = [box.querySelector("img")];
      srcs.slice(1).forEach((src) => {
        const img = document.createElement("img");
        img.src = IMG + src;
        img.alt = "";
        img.draggable = false;
        box.appendChild(img);
        imgs.push(img);
      });
    }
    clearInterval(timer);
    timer = setInterval(() => { k = (k + 1) % imgs.length; show(k); }, 850);
  });
  card.addEventListener("pointerleave", () => {
    clearInterval(timer);
    if (imgs) { k = 0; show(0); }
  });
}

PROJECTS.filter((p) => p.featured).forEach((p) => featuredBox.appendChild(makeCard(p, true)));
PROJECTS.filter((p) => !p.featured).forEach((p) => track.appendChild(makeCard(p, false)));
document.querySelector(".projects__count").textContent = `(${PROJECTS.length})`;
featuredBox.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (card) openProject(card.dataset.id, card);
});

/* ----------------------------------------------------------
   PROJETS - swipe horizontal (tactile natif + glisser souris)
   ---------------------------------------------------------- */
(function carousel() {
  const cards = [...track.children];
  const prev = document.querySelector("[data-prev]");
  const next = document.querySelector("[data-next]");
  const index = document.querySelector(".projects__index");
  const bar = document.querySelector(".projects__progress span");
  const pad = () => parseFloat(getComputedStyle(track).paddingLeft);
  const snapOf = (card) => card.offsetLeft - pad();

  function currentIndex() {
    let best = 0;
    cards.forEach((c, k) => {
      if (Math.abs(snapOf(c) - track.scrollLeft) < Math.abs(snapOf(cards[best]) - track.scrollLeft)) best = k;
    });
    return best;
  }

  function goTo(k) {
    k = clamp(k, 0, cards.length - 1);
    track.scrollTo({ left: snapOf(cards[k]), behavior: reduceMotion ? "auto" : "smooth" });
  }

  function update() {
    const max = track.scrollWidth - track.clientWidth;
    const k = currentIndex();
    index.textContent = `${String(k + 1).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;
    bar.style.transform = `scaleX(${max > 0 ? track.scrollLeft / max : 1})`;
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= max - 2;
  }
  track.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();

  prev.addEventListener("click", () => goTo(currentIndex() - 1));
  next.addEventListener("click", () => goTo(currentIndex() + 1));

  // Glisser à la souris, avec élan puis accroche sur la carte la plus proche
  let drag = null;
  let moved = false;

  track.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    drag = { x: e.clientX, left: track.scrollLeft, lastX: e.clientX, lastT: performance.now(), v: 0 };
    moved = false;
  });

  window.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (!moved && Math.abs(dx) > 6) { moved = true; track.classList.add("is-dragging"); }
    if (!moved) return;
    const now = performance.now();
    drag.v = (e.clientX - drag.lastX) / Math.max(1, now - drag.lastT);
    drag.lastX = e.clientX;
    drag.lastT = now;
    track.scrollLeft = drag.left - dx;
  });

  window.addEventListener("pointerup", () => {
    if (!drag) return;
    const { v } = drag;
    drag = null;
    if (!moved) return;
    // Projection de l'élan pour choisir la carte cible
    const projected = track.scrollLeft - v * 280;
    let k = 0;
    cards.forEach((c, j) => {
      if (Math.abs(snapOf(c) - projected) < Math.abs(snapOf(cards[k]) - projected)) k = j;
    });
    track.scrollTo({ left: snapOf(cards[k]), behavior: "smooth" });
    setTimeout(() => track.classList.remove("is-dragging"), 450);
  });

  track.addEventListener("click", (e) => {
    if (moved) { e.preventDefault(); moved = false; return; }
    const card = e.target.closest(".card");
    if (card) openProject(card.dataset.id, card);
  });

  // Flèches du clavier quand le carrousel a le focus
  track.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); goTo(currentIndex() + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); goTo(currentIndex() - 1); }
  });
})();

/* ----------------------------------------------------------
   Texte "filtre" : la souris révèle le texte dans d'autres couleurs
   ---------------------------------------------------------- */
function setupReveal(el) {
  if (el.dataset.revealReady) return;
  el.dataset.revealReady = "1";
  el.classList.add("reveal");
  const top = document.createElement("span");
  top.className = "reveal__top";
  top.setAttribute("aria-hidden", "true");
  top.innerHTML = el.innerHTML;
  el.appendChild(top);

  if (!finePointer) return;
  let x = 0, y = 0, r = 0, tr = 0, raf = null;

  function render() {
    r = reduceMotion ? tr : lerp(r, tr, 0.18);
    top.style.clipPath = `circle(${r.toFixed(1)}px at ${x}px ${y}px)`;
    raf = Math.abs(r - tr) > 0.5 ? requestAnimationFrame(render) : null;
  }
  el.addEventListener("pointermove", (e) => {
    const rect = top.getBoundingClientRect();
    x = e.clientX - rect.left;
    y = e.clientY - rect.top;
    // Disque à peine plus grand que la hauteur du texte survolé
    tr = clamp(parseFloat(getComputedStyle(el).fontSize) * 0.62, 14, 110);
    top.style.clipPath = `circle(${r.toFixed(1)}px at ${x}px ${y}px)`;
    if (!raf) raf = requestAnimationFrame(render);
  });
  el.addEventListener("pointerleave", () => {
    tr = 0;
    if (!raf) raf = requestAnimationFrame(render);
  });
}
document.querySelectorAll("[data-reveal]").forEach(setupReveal);

/* ----------------------------------------------------------
   PARCOURS - life map : une ligne qui relie les étapes et se
   dessine au fil du scroll
   ---------------------------------------------------------- */
(function lifemap() {
  const map = document.querySelector(".lifemap");
  if (!map) return;
  const svg = map.querySelector(".lifemap__svg");
  const track = map.querySelector(".lifemap__track");
  const line = map.querySelector(".lifemap__line");
  const stops = [...map.querySelectorAll(".lifemap__stop")];
  let length = 0;
  let stopYs = [];
  let samples = []; // [longueur, y] le long du tracé

  function build() {
    const box = map.getBoundingClientRect();
    const pts = stops.map((s) => {
      const r = s.querySelector(".lifemap__dot").getBoundingClientRect();
      return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top };
    });
    // Courbes en S : on quitte chaque point à la verticale, puis on traverse l'écran
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let k = 1; k < pts.length; k++) {
      const a = pts[k - 1], b = pts[k];
      const dy = (b.y - a.y) * 0.55;
      d += ` C ${a.x} ${a.y + dy}, ${b.x} ${b.y - dy}, ${b.x} ${b.y}`;
    }
    svg.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);
    track.setAttribute("d", d);
    line.setAttribute("d", d);
    length = line.getTotalLength();
    line.style.strokeDasharray = `${length}`;
    // Échantillonne le tracé pour savoir quelle longueur correspond à quelle hauteur
    samples = [];
    for (let l = 0; l <= length; l += 6) samples.push([l, line.getPointAtLength(l).y]);
    samples.push([length, pts[pts.length - 1].y]);
    stopYs = pts.map((p) => p.y);
    update();
  }

  function update() {
    const r = map.getBoundingClientRect();
    // La pointe de la ligne suit le scroll, aux 2/3 de la hauteur de l'écran
    const tip = reduceMotion ? Infinity : window.innerHeight * 0.66 - r.top;
    let drawn = 0;
    for (const [l, y] of samples) { if (y <= tip) drawn = l; else break; }
    if (tip >= stopYs[stopYs.length - 1]) drawn = length;
    line.style.strokeDashoffset = `${length - drawn}`;
    stops.forEach((s, k) => s.classList.toggle("is-reached", tip >= stopYs[k] - 4));
  }

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", build);
  window.addEventListener("load", build);
  if (document.fonts) document.fonts.ready.then(build);
  build();
})();

/* ----------------------------------------------------------
   Curseur : un cercle + un trait qui suit la souris et s'efface
   ---------------------------------------------------------- */
(function cursor() {
  if (!finePointer) return;
  document.documentElement.classList.add("has-cursor");

  const ring = document.createElement("div");
  ring.className = "cursor";
  ring.setAttribute("aria-hidden", "true");
  document.body.appendChild(ring);

  const canvas = document.createElement("canvas");
  canvas.className = "cursor-trail";
  canvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  let dpr = 1;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
  }
  resize();
  window.addEventListener("resize", resize);

  const LIFE = 650;
  let points = [];
  let x = -100, y = -100, rx = -100, ry = -100;

  window.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    x = e.clientX;
    y = e.clientY;
    const target = e.target instanceof Element ? e.target : null;
    const onReveal = !!target?.closest(".reveal");
    // Sur un texte "filtre", le disque remplace le curseur : pas de point ni de trait
    // Sur une zone foncée ([data-dark]), le point et le trait passent en clair
    const onDark = !!target?.closest("[data-dark]");
    if (onReveal) points = [];
    else if (!reduceMotion) points.push({ x, y, t: performance.now(), dark: onDark });
    ring.classList.toggle("is-hidden", onReveal);
    ring.classList.toggle("is-light", onDark);
    ring.classList.toggle("is-hover", !!target?.closest("a, button, [role='button']"));
  });
  document.addEventListener("pointerleave", () => ring.classList.add("is-hidden"));
  document.addEventListener("pointerenter", () => ring.classList.remove("is-hidden"));

  (function loop(now) {
    rx = lerp(rx, x, 0.35);
    ry = lerp(ry, y, 0.35);
    ring.style.transform = `translate3d(${rx}px,${ry}px,0)`;

    points = points.filter((p) => now - p.t < LIFE);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    if (points.length > 2) {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (let k = 1; k < points.length - 1; k++) {
        const a = points[k - 1], b = points[k], c = points[k + 1];
        const life = 1 - (now - b.t) / LIFE;
        ctx.strokeStyle = b.dark
          ? `rgba(250, 246, 239, ${(life * 0.8).toFixed(3)})`
          : `rgba(26, 54, 93, ${(life * 0.7).toFixed(3)})`;
        ctx.lineWidth = 0.6 + 1.6 * life;
        ctx.beginPath();
        ctx.moveTo((a.x + b.x) / 2, (a.y + b.y) / 2);
        ctx.quadraticCurveTo(b.x, b.y, (b.x + c.x) / 2, (b.y + c.y) / 2);
        ctx.stroke();
      }
    }
    requestAnimationFrame(loop);
  })(performance.now());
})();

/* ----------------------------------------------------------
   Panneau de détail projet
   ---------------------------------------------------------- */
const panel = document.getElementById("panel");
const sheet = panel.querySelector(".panel__sheet");
const content = panel.querySelector(".panel__content");
let lastTrigger = null;

function media(src, cap) {
  const inner = /\.(mp4|webm|mov)$/i.test(src)
    ? `<video src="${IMG + src}" autoplay muted loop playsinline></video>`
    : `<img src="${IMG + src}" alt="${cap}" loading="lazy">`;
  return `<figure><button type="button" class="p-thumb" data-src="${src}" data-cap="${cap}" aria-label="${UI.zoom} : ${cap}">${inner}</button><figcaption>${cap}</figcaption></figure>`;
}

function openProject(id, trigger) {
  const p = PROJECTS.find((proj) => proj.id === id);
  if (!p) return;
  const t = p[LANG];
  lastTrigger = trigger;

  const meta = [[UI.year, p.year], ...Object.entries(t.meta)]
    .map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");
  const sections = t.sections.map((s) => `
    <div><h3 data-reveal>${s.title}</h3><ul>${s.items.map((it) => `<li>${it}</li>`).join("")}</ul>${
      s.link ? `<a class="chip chip--link" href="${s.link[1]}" target="_blank" rel="noopener">${s.link[0]} <span aria-hidden="true">↗</span></a>` : ""
    }</div>`).join("");
  const gallery = p.gallery.map(([src, fr, en]) => media(src, LANG === "en" ? en : fr)).join("");
  const links = p.links.map((l) => `
    <a class="btn btn--solid" href="${l.href}" target="_blank" rel="noopener">${l[LANG]} <span aria-hidden="true">↗</span></a>`).join("");

  content.innerHTML = `
    <header class="p-hero">
      <p class="eyebrow">${t.context}</p>
      <h2 id="panel-title" data-reveal>${t.title}</h2>
      <p class="p-hero__lead">${t.lead}</p>
      ${links ? `<div class="p-links" style="padding:28px 0 0">${links}</div>` : ""}
    </header>
    <dl class="p-meta">${meta}</dl>
    ${sections ? `<div class="p-body" style="--cols:${t.sections.length}">${sections}</div>` : ""}
    <div class="p-gallery" ${sections ? "" : 'style="padding-top:44px"'}>${gallery}</div>`;
  content.querySelectorAll("[data-reveal]").forEach(setupReveal);

  panel.hidden = false;
  document.body.classList.add("is-locked");
  sheet.scrollTop = 0;
  void sheet.offsetHeight; // force le rendu de l'état fermé avant l'animation
  panel.classList.add("is-open");
  sheet.focus({ preventScroll: true });
  // Point d'accroche pour des modules optionnels (ex. avant / après)
  document.dispatchEvent(new CustomEvent("projectopen", { detail: { id } }));
}

function closeProject() {
  if (panel.hidden) return;
  panel.classList.remove("is-open");
  document.body.classList.remove("is-locked");
  setTimeout(() => { panel.hidden = true; }, reduceMotion ? 0 : 600);
  if (lastTrigger) lastTrigger.focus({ preventScroll: true });
}

panel.addEventListener("click", (e) => {
  if (e.target.closest("[data-close]")) closeProject();
  const thumb = e.target.closest(".p-thumb");
  if (thumb) openLightbox(thumb);
});

/* ----------------------------------------------------------
   Agrandissement d'une photo de la galerie
   ---------------------------------------------------------- */
const lightbox = document.createElement("div");
lightbox.className = "lightbox";
lightbox.hidden = true;
lightbox.setAttribute("role", "dialog");
lightbox.setAttribute("aria-modal", "true");
lightbox.innerHTML = `<figure class="lightbox__figure"></figure>
  <button class="lightbox__close" type="button" aria-label="${LANG === "en" ? "Close" : "Fermer"}">✕</button>`;
document.body.appendChild(lightbox);
let lightboxTrigger = null;

function openLightbox(thumb) {
  lightboxTrigger = thumb;
  const { src, cap } = thumb.dataset;
  const inner = /\.(mp4|webm|mov)$/i.test(src)
    ? `<video src="${IMG + src}" autoplay muted loop playsinline controls></video>`
    : `<img src="${IMG + src}" alt="${cap}">`;
  lightbox.querySelector(".lightbox__figure").innerHTML = `${inner}<figcaption>${cap}</figcaption>`;
  lightbox.hidden = false;
  lightbox.querySelector(".lightbox__close").focus({ preventScroll: true });
}
function closeLightbox() {
  if (lightbox.hidden) return false;
  lightbox.hidden = true;
  lightbox.querySelector(".lightbox__figure").innerHTML = "";
  if (lightboxTrigger) lightboxTrigger.focus({ preventScroll: true });
  return true;
}
lightbox.addEventListener("click", (e) => {
  if (!e.target.closest("img, video")) closeLightbox();
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (!closeLightbox()) closeProject();
});

/* ----------------------------------------------------------
   Copier l'adresse email
   ---------------------------------------------------------- */
document.querySelectorAll("[data-copy]").forEach((btn) => {
  const label = btn.querySelector("span");
  const initial = label.textContent;
  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
    } catch {
      // Repli si l'API presse-papiers est indisponible
      const ta = document.createElement("textarea");
      ta.value = btn.dataset.copy;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    label.textContent = UI.copied;
    setTimeout(() => { label.textContent = initial; }, 1800);
  });
});
