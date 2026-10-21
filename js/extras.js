/* ==========================================================
   Modules interactifs
   - Constellation des compétences
   - Schémas animés en haut des fiches projet
   - Mini-jeu du labyrinthe (fiche Signal vidéo VGA)
   À charger après projects.js et main.js
   ========================================================== */

(function () {
  const L = (fr, en) => (LANG === "en" ? en : fr);
  const NS = "http://www.w3.org/2000/svg";

  /* ==========================================================
     1. CONSTELLATION : compétences reliées aux projets
     ========================================================== */
  const SKILLS = [
    [["SolidWorks", "SolidWorks"], ["bioprinting"]],
    [["Fusion 360", "Fusion 360"], ["hmaa-flute"]],
    [["Rhino 3D", "Rhino 3D"], ["hmaa-flute", "hmaa-arbo"]],
    [["Blender", "Blender"], []],
    [["Impression 3D", "3D printing"], ["bioprinting", "martinique", "hmaa-flute", "mycelium"]],
    [["Klipper / Orca", "Klipper / Orca"], ["bioprinting"]],
    [["Raspberry Pi", "Raspberry Pi"], ["bioprinting", "hmaa-vga"]],
    [["Biomatériaux", "Biomaterials"], ["bioprinting", "mycelium"]],
    [["KiCad", "KiCad"], ["hmaa-montre"]],
    [["ESP32", "ESP32"], ["hmaa-montre", "martinique"]],
    [["Soudure", "Soldering"], ["hmaa-montre", "hmaa-vga"]],
    [["Arduino", "Arduino"], ["hmaa-vga"]],
    [["Énergie solaire", "Solar power"], ["martinique"]],
    [["Python / Pandas", "Python / Pandas"], ["martinique"]],
    [["Web (HTML / CSS)", "Web (HTML / CSS)"], ["martinique"]],
    [["Machine Learning", "Machine Learning"], ["hmaa-ia", "martinique"]],
    [["p5.js / ml5.js", "p5.js / ml5.js"], ["hmaa-ia"]],
    [["Découpe laser", "Laser cutting"], ["hmaa-arbo"]],
    [["Design produit", "Product design"], ["orika", "hmaa-flute"]],
    [["Gestion de projet", "Project management"], ["raid", "orika", "martinique"]],
  ];
  const SHORT = {
    bioprinting: ["Bio-impression", "Bioprinting"],
    martinique: ["Observatoire météo", "Weather observatory"],
    orika: ["ORIKA", "ORIKA"],
    "hmaa-montre": ["Montre coureurs", "Runner watch"],
    "hmaa-flute": ["Flûte nuage", "Cloud flute"],
    "hmaa-arbo": ["Arbo Laser", "Arbo Laser"],
    "hmaa-vga": ["Signal VGA", "VGA signal"],
    "hmaa-ia": ["Apprendre l'IA", "Learning AI"],
    mycelium: ["Mycélium", "Mycelium"],
    raid: ["Raid", "Race"],
  };
  // Position des projets (grand écran) : une carte du ciel irrégulière, pas un cercle
  const SKY = {
    mycelium: [130, 300],
    bioprinting: [300, 170],
    "hmaa-flute": [520, 110],
    "hmaa-arbo": [760, 90],
    orika: [740, 280],
    raid: [880, 440],
    martinique: [530, 330],
    "hmaa-montre": [380, 450],
    "hmaa-vga": [190, 470],
    "hmaa-ia": [700, 470],
  };
  const ORDER = ["bioprinting", "mycelium", "hmaa-vga", "hmaa-montre", "martinique", "hmaa-ia", "raid", "orika", "hmaa-flute", "hmaa-arbo"];

  const host = document.querySelector(".constellation");
  if (host) {
    host.setAttribute("data-dark", "");
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", "constellation__svg");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", L("Constellation des compétences reliées aux projets", "Constellation of skills linked to projects"));
    host.prepend(svg);

    // Aperçu du projet survolé
    const preview = document.createElement("div");
    preview.className = "constellation__preview";
    preview.setAttribute("aria-hidden", "true");
    host.appendChild(preview);

    const projIds = ORDER.filter((id) => PROJECTS.some((p) => p.id === id));
    let nodes = [], edges = [], W = 1000, H = 560, narrow = false, selected = null;

    const el = (tag, attrs, parent) => {
      const n = document.createElementNS(NS, tag);
      for (const k in attrs) n.setAttribute(k, attrs[k]);
      parent.appendChild(n);
      return n;
    };

    function build() {
      svg.innerHTML = "";
      narrow = host.clientWidth < 700;
      W = narrow ? 540 : 1000;
      H = narrow ? 920 : 560;
      svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
      svg.classList.toggle("is-narrow", narrow);

      // Étoiles décoratives
      const deco = el("g", { class: "constellation__stars" }, svg);
      for (let k = 0; k < 70; k++) {
        el("circle", {
          cx: (Math.sin(k * 91.7) * 0.5 + 0.5) * W,
          cy: (Math.sin(k * 47.3 + 1) * 0.5 + 0.5) * H,
          r: 0.8 + (k % 3) * 0.6,
          style: `animation-delay:${(k % 7) * 0.5}s`,
        }, deco);
      }
      const gEdges = el("g", {}, svg);
      const gNodes = el("g", {}, svg);
      nodes = [];
      edges = [];

      projIds.forEach((id) => nodes.push({ id, type: "project", label: SHORT[id][LANG === "en" ? 1 : 0] }));
      SKILLS.forEach(([labels, links], k) => nodes.push({ id: "s" + k, type: "skill", label: labels[LANG === "en" ? 1 : 0], links }));
      const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));

      // Création des éléments (le texte est mesuré avant de placer les nœuds)
      nodes.forEach((n, k) => {
        n.phase = k * 1.7;
        n.g = el("g", {
          class: `constellation__node constellation__node--${n.type}`,
          tabindex: "0",
          role: n.type === "project" ? "button" : "img",
          "aria-label": n.label,
        }, gNodes);
        n.hit = el("rect", { class: "constellation__hit" }, n.g);
        n.dot = el("circle", { r: n.type === "project" ? 9 : 5 }, n.g);
        n.text = el("text", {}, n.g);
        n.text.textContent = n.label;
        n.w = n.text.getComputedTextLength() || n.label.length * 9;
      });

      if (narrow) layoutColumns(); else layoutSky(byId);

      // Texte et zone de survol (qui inclut l'étiquette)
      nodes.forEach((n) => {
        if (narrow) {
          n.anchor = n.type === "project" ? "start" : "end";
          n.dx = n.type === "project" ? 18 : -14;
          n.dy = 6;
        } else {
          n.anchor = "middle";
          n.dx = 0;
          n.dy = n.type === "project" ? -18 : 24;
        }
        n.text.setAttribute("text-anchor", n.anchor);
      });

      nodes.filter((n) => n.type === "skill").forEach((s) => {
        s.links.forEach((pid) => {
          edges.push({ a: s, b: byId[pid], line: el("line", { class: "constellation__edge" }, gEdges) });
        });
      });

      nodes.forEach((n) => {
        n.g.addEventListener("pointerenter", () => { highlight(n); if (n.type === "project") showPreview(n); });
        n.g.addEventListener("pointerleave", () => { highlight(selected); hidePreview(); });
        n.g.addEventListener("focus", () => { highlight(n); if (n.type === "project") showPreview(n); });
        n.g.addEventListener("blur", () => { highlight(selected); hidePreview(); });
        n.g.addEventListener("click", () => {
          if (n.type === "project") { hidePreview(); openProject(n.id, n.g); return; }
          selected = selected === n ? null : n;
          highlight(selected);
        });
        n.g.addEventListener("keydown", (e) => { if (e.key === "Enter") n.g.dispatchEvent(new Event("click")); });
      });
      place(0);
    }

    // Grand écran : projets à des positions fixes, compétences placées autour
    // de leurs projets en évitant que les étiquettes se chevauchent
    function layoutSky(byId) {
      const sx = W / 1000, sy = H / 560;
      const projects = nodes.filter((n) => n.type === "project");
      const skills = nodes.filter((n) => n.type === "skill");
      projects.forEach((p) => { [p.bx, p.by] = SKY[p.id]; p.bx *= sx; p.by *= sy; });

      skills.forEach((s, k) => {
        const linked = s.links.map((id) => byId[id]);
        const ax = linked.length ? linked.reduce((v, p) => v + p.bx, 0) / linked.length : 900;
        const ay = linked.length ? linked.reduce((v, p) => v + p.by, 0) / linked.length : 120;
        const a = k * 2.4;
        s.bx = ax + Math.cos(a) * 70;
        s.by = ay + Math.sin(a) * 60;
      });

      // Boîte occupée par chaque nœud (point + étiquette)
      const box = (n) => n.type === "project"
        ? { x: n.bx, y: n.by - 12, hw: n.w / 2 + 16, hh: 27 }
        : { x: n.bx, y: n.by + 10, hw: n.w / 2 + 12, hh: 23 };

      for (let it = 0; it < 500; it++) {
        // Ressorts compétence -> projet
        skills.forEach((s) => s.links.forEach((id) => {
          const p = byId[id];
          const dx = p.bx - s.bx, dy = p.by - s.by;
          const d = Math.hypot(dx, dy) || 1;
          const f = (d - 120) * 0.02;
          s.bx += (dx / d) * f;
          s.by += (dy / d) * f;
        }));
        // Pas de chevauchement entre étiquettes
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const a = nodes[i], b = nodes[j];
            if (a.type === "project" && b.type === "project") continue;
            const A = box(a), B = box(b);
            const ox = A.hw + B.hw - Math.abs(A.x - B.x);
            const oy = A.hh + B.hh - Math.abs(A.y - B.y);
            if (ox <= 0 || oy <= 0) continue;
            const moveA = a.type === "skill" ? (b.type === "skill" ? 0.5 : 1) : 0;
            const moveB = 1 - moveA;
            if (ox < oy) {
              const s = (A.x < B.x ? -1 : 1) * ox;
              a.bx += s * moveA; b.bx -= s * moveB;
            } else {
              const s = (A.y < B.y ? -1 : 1) * oy;
              a.by += s * moveA; b.by -= s * moveB;
            }
          }
        }
        // Rester dans le cadre
        skills.forEach((s) => {
          s.bx = clamp(s.bx, s.w / 2 + 16, W - s.w / 2 - 16);
          s.by = clamp(s.by, 24, H - 44);
        });
      }
    }

    // Téléphone : deux colonnes (compétences à gauche, projets à droite)
    function layoutColumns() {
      const projRow = Object.fromEntries(projIds.map((id, k) => [id, k]));
      const projects = nodes.filter((n) => n.type === "project");
      const skills = nodes.filter((n) => n.type === "skill");
      const top = 40, bottom = H - 30;
      projects.forEach((n, k) => { n.bx = W * 0.6; n.by = top + ((k + 0.5) / projects.length) * (bottom - top); });
      skills
        .map((n) => ({ n, key: n.links.length ? n.links.reduce((s, id) => s + projRow[id], 0) / n.links.length : 99 }))
        .sort((a, b) => a.key - b.key)
        .forEach(({ n }, k) => { n.bx = W * 0.42; n.by = top + ((k + 0.5) / skills.length) * (bottom - top); });
    }

    function highlight(n) {
      const on = new Set();
      if (n) {
        on.add(n);
        edges.forEach((e) => { if (e.a === n || e.b === n) { on.add(e.a); on.add(e.b); } });
      }
      svg.classList.toggle("has-focus", !!n);
      nodes.forEach((m) => m.g.classList.toggle("is-on", on.has(m)));
      edges.forEach((e) => e.line.classList.toggle("is-on", !!n && (e.a === n || e.b === n)));
    }

    function showPreview(n) {
      if (narrow || !finePointer) return;
      const p = PROJECTS.find((x) => x.id === n.id);
      const t = p[LANG];
      preview.innerHTML = `<img src="${IMG + p.cover}" alt=""><strong>${t.title}</strong><span>${p.year} · ${t.context}</span><em>${L("Cliquez pour ouvrir", "Click to open")}</em>`;
      const scale = svg.getBoundingClientRect().width / W;
      const x = n.x * scale, y = n.y * scale;
      const pw = 240, ph = 230;
      let left = x + 26, top = y - ph / 2;
      if (left + pw > host.clientWidth - 12) left = x - pw - 26;
      top = clamp(top, 12, host.clientHeight - ph - 12);
      preview.style.left = left + "px";
      preview.style.top = top + "px";
      preview.classList.add("is-visible");
    }
    function hidePreview() { preview.classList.remove("is-visible"); }

    // Léger mouvement de flottaison
    function place(t) {
      nodes.forEach((n) => {
        const amp = reduceMotion ? 0 : n.type === "project" ? 2.5 : 4;
        n.x = n.bx + Math.sin(t / 1600 + n.phase) * amp;
        n.y = n.by + Math.cos(t / 1900 + n.phase) * amp;
        n.dot.setAttribute("cx", n.x);
        n.dot.setAttribute("cy", n.y);
        n.text.setAttribute("x", n.x + n.dx);
        n.text.setAttribute("y", n.y + n.dy);
        // Zone de survol : le point et son étiquette
        const left = n.anchor === "middle" ? n.x - n.w / 2 : n.anchor === "end" ? n.x + n.dx - n.w : n.x;
        const right = n.anchor === "middle" ? n.x + n.w / 2 : n.anchor === "end" ? n.x : n.x + n.dx + n.w;
        const top = Math.min(n.y - 12, n.y + n.dy - 18);
        const bottom = Math.max(n.y + 12, n.y + n.dy + 6);
        n.hit.setAttribute("x", left - 6);
        n.hit.setAttribute("y", top);
        n.hit.setAttribute("width", right - left + 12);
        n.hit.setAttribute("height", bottom - top);
      });
      edges.forEach(({ a, b, line }) => {
        line.setAttribute("x1", a.x); line.setAttribute("y1", a.y);
        line.setAttribute("x2", b.x); line.setAttribute("y2", b.y);
      });
    }

    let visible = false;
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(host);
    (function loop(t) {
      if (visible && !reduceMotion) place(t);
      requestAnimationFrame(loop);
    })(0);

    build();
    if (document.fonts) document.fonts.ready.then(build);
    let lastNarrow = host.clientWidth < 700;
    window.addEventListener("resize", () => {
      const nw = host.clientWidth < 700;
      if (nw !== lastNarrow) { lastNarrow = nw; build(); }
    });
  }

  /* ==========================================================
     2. SCHÉMAS ANIMÉS des fiches projet
     Dessins au trait très simples. Ils s'animent à l'ouverture de
     la fiche, puis à chaque survol.
     ========================================================== */

  // Fait avancer un élément le long d'un tracé (et dessine le tracé derrière lui)
  function followPath(path, mover, tip, dur, done) {
    const len = path.getTotalLength();
    const t0 = performance.now();
    (function step(now) {
      const k = Math.min(1, (now - t0) / dur);
      const p = path.getPointAtLength(k * len);
      mover.setAttribute("transform", `translate(${p.x - tip[0]} ${p.y - tip[1]})`);
      path.style.strokeDashoffset = 1 - k;
      if (k < 1) requestAnimationFrame(step); else done && done();
    })(t0);
  }

  /* Imprimante 3D en vue isométrique : un cube de 40 x 40 x 40 imprimé en 8 couches */
  const BP = { cx: 120, cy: 120, half: 20, layers: 8, h: 5 };
  const iso = (x, y, z) => [BP.cx + (x - y) * 0.866, BP.cy + (x + y) * 0.5 - z];
  const pts = (list) => list.map((p) => iso(...p).map((v) => v.toFixed(1)).join(",")).join(" ");

  // Dessine les "count" premières couches (faces avant + dessus de la dernière)
  function bioBuild(root, ratio) {
    const g = root.querySelector(".bp-object");
    const n = Math.round(BP.layers * ratio);
    const H = BP.half;
    let s = "";
    // Couches d'hydrogel : translucides, avec reflets et petites bulles
    for (let k = 0; k < n; k++) {
      const z0 = k * BP.h, z1 = z0 + BP.h;
      s += `<polygon class="gel" points="${pts([[-H, H, z0], [H, H, z0], [H, H, z1], [-H, H, z1]])}"/>`;
      s += `<polygon class="gel gel--side" points="${pts([[H, -H, z0], [H, H, z0], [H, H, z1], [H, -H, z1]])}"/>`;
      s += `<polygon class="gel gel--top" points="${pts([[-H, -H, z1], [H, -H, z1], [H, H, z1], [-H, H, z1]])}"/>`;
    }
    const top = n * BP.h;
    if (n > 1) {
      // Reflet brillant sur la face gauche
      const a = iso(-H + 6, H, Math.min(top - 4, 34)), b = iso(-H + 6, H, Math.max(4, top - 22));
      s += `<line class="gel-shine" x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/>`;
      // Bulles prises dans le gel (seulement sous la hauteur imprimée)
      [[8, H, 9, 2.2], [-6, H, 22, 1.6], [H, -8, 14, 2], [H, 6, 30, 1.5], [12, H, 33, 1.4]].forEach(([x, y, z, r]) => {
        if (z < top - 2) { const [cx, cy] = iso(x, y, z); s += `<circle class="gel-bubble" cx="${cx}" cy="${cy}" r="${r}"/>`; }
      });
    }
    g.innerHTML = s;
    // Tête au repos au-dessus du cube
    if (ratio >= 1 || n === 0) placeHead(root, iso(0, 0, BP.layers * BP.h + 8));
  }

  function placeHead(root, [x, y]) {
    root.querySelector(".bp-head").setAttribute("transform", `translate(${x} ${y})`);
    root.querySelector(".bp-carriage").setAttribute("transform", `translate(${x} 0)`);
    const rod = root.querySelector(".bp-rod");
    rod.setAttribute("x1", x); rod.setAttribute("y1", 14);
    rod.setAttribute("x2", x); rod.setAttribute("y2", y - 52);
  }

  // Trajet de la buse pour une couche : contour, puis remplissage en allers-retours
  function layerPath(z) {
    const H = BP.half, I = H - 5;
    const path = [[-H, -H], [H, -H], [H, H], [-H, H], [-H, -H]];
    for (let y = -I, dir = 1; y <= I; y += 7.5, dir = -dir) {
      path.push(dir > 0 ? [-I, y] : [I, y], dir > 0 ? [I, y] : [-I, y]);
    }
    return path.map(([x, y]) => iso(x, y, z));
  }

  function bioPlay(root, done) {
    // Le filament de gel est dessiné deux fois (contour + cœur clair)
    const traces = root.querySelectorAll(".bp-trace");
    const trace = { setAttribute: (k, v) => traces.forEach((tr) => tr.setAttribute(k, v)) };
    bioBuild(root, 0);
    let layer = 0;
    const perLayer = 1150; // vitesse d'impression (ms par couche)
    function runLayer() {
      if (layer >= BP.layers) {
        trace.setAttribute("d", "");
        bioBuild(root, 1);
        setTimeout(done, 400);
        return;
      }
      const path = layerPath((layer + 1) * BP.h);
      // Longueurs cumulées pour avancer à vitesse constante
      const segs = [];
      let total = 0;
      for (let k = 1; k < path.length; k++) {
        const l = Math.hypot(path[k][0] - path[k - 1][0], path[k][1] - path[k - 1][1]);
        segs.push(l);
        total += l;
      }
      const t0 = performance.now();
      (function step(now) {
        const dist = Math.min(1, (now - t0) / perLayer) * total;
        let acc = 0, k = 0;
        while (k < segs.length - 1 && acc + segs[k] < dist) acc += segs[k++];
        const f = segs[k] ? (dist - acc) / segs[k] : 1;
        const a = path[k], b = path[k + 1];
        const pos = [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
        const drawn = path.slice(0, k + 1).concat([pos]);
        trace.setAttribute("d", "M" + drawn.map((p) => p.map((v) => v.toFixed(1)).join(" ")).join(" L"));
        placeHead(root, pos);
        if (dist < total) requestAnimationFrame(step);
        else {
          layer++;
          bioBuild(root, layer / BP.layers);
          trace.setAttribute("d", "");
          runLayer();
        }
      })(t0);
    }
    runLayer();
  }

  const SCHEMAS = {
    /* Bio-impression : vue 3D d'une imprimante qui construit un cube couche par couche
       (allers-retours horizontaux, puis la buse monte d'un cran) */
    bioprinting: {
      svg: `
        <path class="f-blue" d="M120 90 L172 120 L120 150 L68 120 Z"/>
        <line x1="40" y1="148" x2="40" y2="10"/><line x1="200" y1="148" x2="200" y2="10"/>
        <line x1="34" y1="10" x2="206" y2="10"/>
        <g class="bp-object"></g>
        <path class="bp-trace bp-trace--out"/><path class="bp-trace bp-trace--in"/>
        <line class="bp-rod thin"/>
        <g class="bp-carriage"><rect class="f-navy" x="-12" y="6" width="24" height="8" rx="2"/></g>
        <g class="bp-head">
          <rect class="f-cream" x="-9" y="-46" width="18" height="34" rx="3"/>
          <rect class="gel gel--top" x="-6" y="-30" width="12" height="16" rx="1"/>
          <circle class="gel-bubble" cx="-2" cy="-24" r="1.4"/><circle class="gel-bubble" cx="2.5" cy="-18" r="1.1"/>
          <line x1="-7" y1="-52" x2="7" y2="-52"/><line x1="0" y1="-52" x2="0" y2="-46"/>
          <line x1="0" y1="-12" x2="0" y2="0"/>
        </g>`,
      setup(root) { bioBuild(root, 1, false); },
      play(root, done) { bioPlay(root, done); },
    },

    /* Observatoire : l'anémomètre tourne, les données partent vers le tableau de bord */
    martinique: {
      svg: `
        <line x1="70" y1="54" x2="70" y2="160"/>
        <line x1="70" y1="160" x2="52" y2="174"/><line x1="70" y1="160" x2="88" y2="174"/>
        <g class="mq-anemo">
          <line x1="70" y1="50" x2="70" y2="32"/><line x1="70" y1="50" x2="85.6" y2="59"/><line x1="70" y1="50" x2="54.4" y2="59"/>
          <circle class="f-cream" cx="70" cy="32" r="5"/><circle class="f-cream" cx="85.6" cy="59" r="5"/><circle class="f-cream" cx="54.4" cy="59" r="5"/>
          <circle class="f-navy" cx="70" cy="50" r="3"/>
        </g>
        <line x1="58" y1="84" x2="82" y2="84"/><line x1="56" y1="92" x2="84" y2="92"/><line x1="58" y1="100" x2="82" y2="100"/>
        <path class="mq-wave" d="M94 66 a9 9 0 0 1 0 14"/><path class="mq-wave" style="--d:.2s" d="M100 61 a15 15 0 0 1 0 24"/><path class="mq-wave" style="--d:.4s" d="M106 56 a21 21 0 0 1 0 34"/>
        <rect class="f-cream" x="126" y="88" width="94" height="62" rx="6"/>
        <line x1="173" y1="150" x2="173" y2="162"/><line x1="158" y1="162" x2="188" y2="162"/>
        <path class="draw" style="--d:.3s" pathLength="1" d="M134 138 L146 126 L156 132 L168 112 L180 120 L192 102 L210 110"/>
        <g class="mq-sun"><circle cx="192" cy="38" r="10"/>
          <path d="M192 20 v6 M192 50 v6 M174 38 h6 M204 38 h6 M179 25 l4 4 M201 47 l4 4 M205 25 l-4 4 M183 47 l-4 4"/></g>`,
      duration: 2600,
    },

    /* ORIKA : un carré de cuir se plie en porte-monnaie */
    orika: {
      svg: `
        <g class="ok-open">
          <rect class="f-cream" x="70" y="40" width="100" height="100" rx="3"/>
          <path class="draw thin" pathLength="1" d="M70 40 L170 140"/>
          <path class="draw thin" style="--d:.25s" pathLength="1" d="M170 40 L70 140"/>
          <path class="draw thin" style="--d:.5s" pathLength="1" d="M120 40 L120 140"/>
        </g>
        <g class="ok-closed">
          <rect class="f-cream" x="92" y="56" width="56" height="80" rx="4"/>
          <path d="M92 72 L120 86 L148 72"/>
          <line x1="88" y1="104" x2="152" y2="104"/>
          <path class="f-navy" d="M120 97 l2.2 4.6 5 .7 -3.6 3.5 .9 5 -4.5 -2.4 -4.5 2.4 .9 -5 -3.6 -3.5 5 -.7 z"/>
        </g>`,
      duration: 3000,
    },

    /* PCB de la montre pour coureurs */
    "hmaa-montre": {
      // Le PCB de la montre : module ESP32, driver moteur, LED et connecteur
      svg: `
        <path class="f-cream" d="M64 164 V72 A56 56 0 0 1 176 72 V164 Z"/>
        <rect class="f-blue" x="96" y="44" width="48" height="44" rx="3"/>
        <g class="thin">
          <path d="M92 52 h4 M92 60 h4 M92 68 h4 M92 76 h4 M144 52 h4 M144 60 h4 M144 68 h4 M144 76 h4"/>
        </g>
        <rect class="f-navy" x="92" y="106" width="56" height="16" rx="2"/>
        <path class="thin" d="M98 106 v-4 M108 106 v-4 M118 106 v-4 M128 106 v-4 M138 106 v-4 M98 122 v4 M108 122 v4 M118 122 v4 M128 122 v4 M138 122 v4"/>
        <path class="pcb-trace draw thin" pathLength="1" d="M92 60 H80 V140 H86"/>
        <path class="pcb-trace draw thin" style="--d:.15s" pathLength="1" d="M148 60 H160 V96 H128 V102"/>
        <path class="pcb-trace draw thin" style="--d:.3s" pathLength="1" d="M148 76 H154 V90 H108 V102"/>
        <path class="pcb-trace draw thin" style="--d:.45s" pathLength="1" d="M118 126 V140 H112"/>
        <path class="pcb-trace draw thin" style="--d:.6s" pathLength="1" d="M138 126 V138 H156"/>
        <circle class="pcb-led f-cream" cx="92" cy="140" r="6"/>
        <path class="pcb-led-ray" d="M84 130 l-4 -4 M92 128 v-5 M100 130 l4 -4"/>
        <circle class="f-cream" cx="104" cy="152" r="4"/><circle class="f-cream" cx="116" cy="152" r="4"/>
        <circle class="f-cream" cx="128" cy="152" r="4"/><circle class="f-cream" cx="140" cy="152" r="4"/>
        <rect x="152" y="132" width="14" height="22" rx="2"/>
        <circle class="pcb-motor" cx="159" cy="143" r="3"/>`,
      duration: 2600,
    },

    /* Flûte de pan nuage : des notes s'envolent, les perles se balancent */
    "hmaa-flute": {
      svg: `
        <path class="f-cream" d="M52 112 C 34 112 32 88 52 86 C 50 64 78 58 88 74 C 94 50 132 48 140 70 C 150 54 178 60 176 82 C 198 80 202 112 180 112 Z"/>
        <g class="fl-tubes"><line x1="78" y1="80" x2="78" y2="106"/><line x1="96" y1="72" x2="96" y2="106"/><line x1="114" y1="68" x2="114" y2="104"/>
          <line x1="132" y1="72" x2="132" y2="100"/><line x1="150" y1="78" x2="150" y2="98"/><line x1="166" y1="88" x2="166" y2="96"/></g>
        <g class="fl-rain">
          <line x1="72" y1="112" x2="72" y2="150"/><circle class="f-cream" cx="72" cy="132" r="3.5"/><circle class="f-cream" cx="72" cy="150" r="3.5"/>
          <line x1="104" y1="112" x2="104" y2="166"/><circle class="f-cream" cx="104" cy="140" r="3.5"/><circle class="f-cream" cx="104" cy="166" r="3.5"/>
          <line x1="140" y1="112" x2="140" y2="142"/><circle class="f-cream" cx="140" cy="128" r="3.5"/><circle class="f-cream" cx="140" cy="142" r="3.5"/>
          <line x1="168" y1="112" x2="168" y2="158"/><circle class="f-cream" cx="168" cy="136" r="3.5"/><circle class="f-cream" cx="168" cy="158" r="3.5"/>
        </g>
        <g class="fl-note"><ellipse class="f-navy" cx="118" cy="44" rx="5" ry="4"/><line x1="123" y1="44" x2="123" y2="26"/><path d="M123 26 q6 3 6 9"/></g>
        <g class="fl-note" style="--d:.5s"><ellipse class="f-navy" cx="150" cy="44" rx="5" ry="4"/><line x1="155" y1="44" x2="155" y2="26"/></g>
        <g class="fl-note" style="--d:1s"><ellipse class="f-navy" cx="86" cy="48" rx="5" ry="4"/><line x1="91" y1="48" x2="91" y2="30"/></g>`,
      duration: 2600,
    },

    /* Arbo Laser */
    "hmaa-arbo": {
      // Arbre décoratif découpé au laser : branches, feuilles et un oiseau
      svg: (() => {
        const leaves = [
          [94, 78, -70], [92, 86, -150], [150, 74, -50], [152, 82, -10], [101, 62, -100],
          [104, 70, -30], [139, 60, -80], [138, 68, -150], [66, 80, -120], [64, 86, -175],
          [174, 74, -50], [176, 80, 0], [120, 64, -90], [112, 62, -130], [128, 62, -50],
          [104, 108, -140], [136, 104, -40], [86, 94, -170], [158, 88, 10],
        ];
        let s = `
          <rect class="f-cream" x="94" y="160" width="52" height="7" rx="3"/>
          <path class="draw" style="stroke-width:6" pathLength="1" d="M120 161 C 119 140 121 124 120 106"/>
          <path class="draw" style="stroke-width:4;--d:.35s" pathLength="1" d="M120 122 C 108 112 96 104 84 92"/>
          <path class="draw" style="stroke-width:4;--d:.45s" pathLength="1" d="M120 116 C 132 106 144 98 156 86"/>
          <path class="draw" style="stroke-width:4;--d:.55s" pathLength="1" d="M120 110 C 120 94 122 80 120 64"/>
          <path class="draw thin" style="--d:.8s" pathLength="1" d="M97 103 C 93 94 92 86 94 78"/>
          <path class="draw thin" style="--d:.85s" pathLength="1" d="M144 97 C 150 90 152 82 150 74"/>
          <path class="draw thin" style="--d:.9s" pathLength="1" d="M120 86 C 111 78 105 70 101 62"/>
          <path class="draw thin" style="--d:.95s" pathLength="1" d="M121 82 C 130 75 136 68 139 59"/>
          <path class="draw thin" style="--d:1s" pathLength="1" d="M84 92 C 76 90 70 86 66 80"/>
          <path class="draw thin" style="--d:1.05s" pathLength="1" d="M156 86 C 164 84 170 80 174 74"/>`;
        leaves.forEach(([x, y, a], k) => {
          s += `<g transform="translate(${x} ${y}) rotate(${a})"><path class="ab-leaf f-cream" style="--d:${(1.2 + k * 0.06).toFixed(2)}s;stroke-width:1.8" d="M0 0 q8 -6.5 16 0 q-8 6.5 -16 0 z"/></g>`;
        });
        s += `
          <path class="ab-fly" style="--d:2.1s" d="M162 36 q5 -6 10 0 q5 -6 10 0"/>
          <path class="ab-fly" style="--d:2.3s" d="M186 50 q3.5 -4 7 0 q3.5 -4 7 0"/>`;
        return s;
      })(),
      duration: 3000,
    },

    /* Apprendre l'IA : un signal traverse le réseau de neurones */
    "hmaa-ia": {
      svg: (() => {
        const layers = [[50, [50, 90, 130]], [120, [36, 72, 108, 144]], [190, [70, 110]]];
        let s = "";
        for (let l = 0; l < 2; l++) {
          const [x1, ys1] = layers[l], [x2, ys2] = layers[l + 1];
          ys1.forEach((y1) => ys2.forEach((y2) => {
            s += `<line class="ia-edge" style="--d:${l * 0.45}s" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
          }));
        }
        layers.forEach(([x, ys], l) => ys.forEach((y) => {
          s += `<circle class="ia-node f-cream" style="--d:${l * 0.45}s" cx="${x}" cy="${y}" r="9"/>`;
        }));
        return s;
      })(),
      duration: 2600,
    },

    /* Mycélium */
    mycelium: {
      // Un champignon et son mycélium qui pousse sous terre
      svg: `
        <path class="draw thin" pathLength="1" d="M120 132 C 112 146 98 152 80 156"/>
        <path class="draw thin" style="--d:.15s" pathLength="1" d="M120 132 C 128 148 144 154 164 156"/>
        <path class="draw thin" style="--d:.3s" pathLength="1" d="M120 132 C 118 148 120 160 116 172"/>
        <path class="draw thin" style="--d:.5s" pathLength="1" d="M96 152 C 90 160 86 166 78 170"/>
        <path class="draw thin" style="--d:.6s" pathLength="1" d="M146 152 C 152 160 160 164 170 168"/>
        <path class="draw thin" style="--d:.7s" pathLength="1" d="M88 155 C 80 150 72 150 64 146"/>
        <path class="draw thin" style="--d:.8s" pathLength="1" d="M156 155 C 164 150 172 148 180 144"/>
        <line x1="48" y1="132" x2="192" y2="132"/>
        <g class="my-shroom">
          <path class="f-cream" d="M108 132 C 111 116 111 104 108 92 L132 92 C 129 104 129 116 132 132 Z"/>
          <path class="f-cream" d="M70 94 C 72 50 168 50 170 94 C 150 101 90 101 70 94 Z"/>
          <path class="thin" d="M86 97 L92 92 M100 99 L104 93 M116 100 L118 94 M130 100 L130 94 M144 99 L142 93 M156 97 L150 92"/>
        </g>
        <g class="my-shroom my-shroom--small">
          <path class="f-cream" d="M160 132 C 161 124 161 118 160 112 L170 112 C 169 118 169 124 170 132 Z"/>
          <path class="f-cream" d="M148 113 C 149 94 181 94 182 113 C 174 116 156 116 148 113 Z"/>
        </g>`,
      duration: 2400,
    },

    /* Raid : un coureur suit le parcours jusqu'au drapeau */
    raid: {
      svg: `
        <path stroke-width="1.5" d="M8 150 C 50 112 80 122 110 140 C 140 158 170 100 232 118"/>
        <path d="M40 120 l10 -18 l10 18 z M150 96 l9 -16 l9 16 z M176 132 l8 -14 l8 14 z" />
        <path class="rd-plan" d="M30 160 C 60 150 70 122 100 118 C 130 114 128 90 158 84 C 180 80 190 62 206 52"/>
        <path class="rd-trail" pathLength="1" d="M30 160 C 60 150 70 122 100 118 C 130 114 128 90 158 84 C 180 80 190 62 206 52"/>
        <line x1="206" y1="52" x2="206" y2="24"/><path class="f-navy" d="M206 24 L224 31 L206 38 Z"/>
        <g class="rd-runner"><circle class="f-navy" cx="30" cy="160" r="6"/></g>`,
      play(root, done) {
        const trail = root.querySelector(".rd-trail");
        const runner = root.querySelector(".rd-runner");
        trail.style.strokeDashoffset = 1;
        followPath(trail, runner, [30, 160], 2600, () => setTimeout(done, 800));
      },
    },
  };

  /* Mini-jeu du labyrinthe (fiche Signal vidéo VGA) */
  function createMaze(box, COLS, ROWS) {
    box.innerHTML = `
      <canvas tabindex="0" aria-label="${L("Labyrinthe : utilisez les flèches du clavier", "Maze: use the arrow keys")}"></canvas>
      <p class="maze__status" aria-live="polite"></p>
      <div class="maze__bar">
        <div class="maze__pad">
          <button type="button" data-dir="w" aria-label="${L("Gauche", "Left")}">←</button>
          <button type="button" data-dir="n" aria-label="${L("Haut", "Up")}">↑</button>
          <button type="button" data-dir="s" aria-label="${L("Bas", "Down")}">↓</button>
          <button type="button" data-dir="e" aria-label="${L("Droite", "Right")}">→</button>
        </div>
        <button type="button" class="maze__restart">${L("Nouveau labyrinthe", "New maze")}</button>
      </div>`;
    const canvas = box.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    const status = box.querySelector(".maze__status");
    let walls, player, moves, won;

    function generate() {
      walls = Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => ({ n: 1, e: 1, s: 1, w: 1 })));
      const seen = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
      const stack = [[0, 0]];
      seen[0][0] = true;
      const dirs = [["n", 0, -1, "s"], ["e", 1, 0, "w"], ["s", 0, 1, "n"], ["w", -1, 0, "e"]];
      while (stack.length) {
        const [x, y] = stack[stack.length - 1];
        const opts = dirs.filter(([, dx, dy]) => {
          const nx = x + dx, ny = y + dy;
          return nx >= 0 && ny >= 0 && nx < COLS && ny < ROWS && !seen[ny][nx];
        });
        if (!opts.length) { stack.pop(); continue; }
        const [d, dx, dy, opp] = opts[Math.floor(Math.random() * opts.length)];
        walls[y][x][d] = 0;
        walls[y + dy][x + dx][opp] = 0;
        seen[y + dy][x + dx] = true;
        stack.push([x + dx, y + dy]);
      }
      player = { x: 0, y: 0 };
      moves = 0;
      won = false;
      status.textContent = L("Cliquez sur le labyrinthe, puis utilisez les flèches (ou ZQSD) pour rejoindre le cercle.", "Click the maze, then use the arrow keys (or WASD) to reach the circle.");
      draw();
    }

    function draw() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth || 300;
      const lw = Math.max(2.5, (w / COLS) * 0.16);
      // Marge = moitié de l'épaisseur des murs, pour que les bords ne soient pas coupés
      const m = lw / 2 + 1;
      const cell = (w - 2 * m) / COLS, h = cell * ROWS + 2 * m;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, m * dpr, m * dpr);
      ctx.clearRect(-m, -m, w, h);
      ctx.strokeStyle = "#1a365d";
      ctx.lineWidth = lw;
      ctx.lineCap = "square";
      ctx.beginPath();
      for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
        const c = walls[y][x], px = x * cell, py = y * cell;
        if (c.n) { ctx.moveTo(px, py); ctx.lineTo(px + cell, py); }
        if (c.w) { ctx.moveTo(px, py); ctx.lineTo(px, py + cell); }
        if (y === ROWS - 1 && c.s) { ctx.moveTo(px, py + cell); ctx.lineTo(px + cell, py + cell); }
        if (x === COLS - 1 && c.e) { ctx.moveTo(px + cell, py); ctx.lineTo(px + cell, py + cell); }
      }
      ctx.stroke();
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc((COLS - 0.5) * cell, (ROWS - 0.5) * cell, cell * 0.26, 0, Math.PI * 2);
      ctx.stroke();
      const s = cell * 0.52;
      ctx.fillStyle = "#faf6ef";
      ctx.fillRect((player.x + 0.5) * cell - s / 2, (player.y + 0.5) * cell - s / 2, s, s);
      ctx.strokeRect((player.x + 0.5) * cell - s / 2, (player.y + 0.5) * cell - s / 2, s, s);
    }

    function move(dir) {
      if (won || walls[player.y][player.x][dir]) return;
      const step = { n: [0, -1], e: [1, 0], s: [0, 1], w: [-1, 0] }[dir];
      player.x += step[0];
      player.y += step[1];
      moves++;
      if (player.x === COLS - 1 && player.y === ROWS - 1) {
        won = true;
        status.textContent = L(`Bravo ! Sortie trouvée en ${moves} déplacements.`, `Well done! Exit found in ${moves} moves.`);
      }
      draw();
    }
    const KEYS = { ArrowUp: "n", ArrowRight: "e", ArrowDown: "s", ArrowLeft: "w", z: "n", w: "n", d: "e", s: "s", q: "w", a: "w" };
    // Les touches ne sont captées que quand le jeu a le focus
    canvas.addEventListener("keydown", (e) => {
      const dir = KEYS[e.key] || KEYS[e.key.toLowerCase()];
      if (!dir) return;
      e.preventDefault();
      move(dir);
    });
    canvas.addEventListener("pointerdown", () => canvas.focus());
    box.querySelectorAll("[data-dir]").forEach((b) => b.addEventListener("click", () => move(b.dataset.dir)));
    box.querySelector(".maze__restart").addEventListener("click", () => { generate(); canvas.focus(); });
    requestAnimationFrame(generate);
  }

  // Ajout du schéma à droite du titre, à l'ouverture d'une fiche
  document.addEventListener("projectopen", (e) => {
    const id = e.detail.id;
    const hero = document.querySelector(".panel__content .p-hero");
    if (!hero) return;
    const sc = SCHEMAS[id];
    if (!sc && id !== "hmaa-vga") return;
    // La grille est dans un conteneur interne : le bandeau bleu (.p-hero)
    // reste un bloc normal et va jusqu'au bord droit, sous le bouton fermer
    const grid = document.createElement("div");
    grid.className = "p-hero__grid";
    const text = document.createElement("div");
    text.className = "p-hero__text";
    while (hero.firstChild) text.appendChild(hero.firstChild);
    const side = document.createElement("div");
    side.className = "p-hero__schema";
    grid.append(text, side);
    hero.appendChild(grid);

    if (id === "hmaa-vga") {
      side.classList.add("is-game");
      createMaze(side, 13, 9);
      return;
    }
    side.innerHTML = `<svg class="schema" viewBox="0 0 240 180" aria-hidden="true">${sc.svg}</svg>`;
    const root = side.querySelector(".schema");
    if (sc.setup) sc.setup(root);
    let playing = false;
    function play() {
      if (playing || reduceMotion) return;
      playing = true;
      root.classList.remove("is-playing");
      void root.getBoundingClientRect();
      root.classList.add("is-playing");
      const end = () => { root.classList.remove("is-playing"); playing = false; };
      if (sc.play) sc.play(root, end);
      else setTimeout(end, sc.duration || 2500);
    }
    side.addEventListener("pointerenter", play);
    side.addEventListener("click", play);
    setTimeout(play, 650);
  });
})();
