/* Lodestar Lab: shared behavior. Each block runs only on pages that contain its element. */
(function () {
  const L = window.LAB;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const NS = "http://www.w3.org/2000/svg";
  const svgEl = (tag, attrs = {}, parent) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); if (parent) parent.appendChild(n); return n; };
  const starPath = r => { const k = r * .22; return `M0 ${-r}L${k} ${-k} ${r} 0 ${k} ${k} 0 ${r} ${-k} ${k} ${-r} 0 ${-k} ${-k}Z`; };
  const byId = Object.fromEntries(L.PROJECTS.map(p => [p.id, p]));
  const projUrl = id => `projects.html#${id}`;

  /* links + mobile menu */
  const GH = `https://github.com/${L.CONFIG.org}`, HOME = `${GH}/${L.CONFIG.homeRepo}`;
  const ext = (sel, url) => $$(sel).forEach(a => { a.href = url; a.target = "_blank"; a.rel = "noopener"; });
  ext(".gh-link", HOME); ext(".gh-org", GH); ext(".gh-discuss", `${HOME}/discussions`); ext(".gh-idea", `${HOME}/issues/new?title=Project%20idea%3A%20`);
  $$(".mc-link").forEach(a => { a.href = L.CONFIG.micreate; a.target = "_blank"; a.rel = "noopener"; });
  const menu = $(".menu"), nav = $(".nav");
  if (menu) menu.addEventListener("click", () => { const o = nav.classList.toggle("open"); menu.setAttribute("aria-expanded", o); });

  /* ---------- home: star map ---------- */
  const sky = $("#sky");
  if (sky) {
    const wrapEl = sky.parentElement;
    const far = svgEl("g", { "aria-hidden": "true" }, sky), near = svgEl("g", {}, sky);
    const links = svgEl("g", { "aria-hidden": "true" }, near), pulses = svgEl("g", { "aria-hidden": "true" }, near), stars = svgEl("g", {}, near);
    let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 80; i++) {
      const c = svgEl("circle", { cx: (rnd() * 700 - 10).toFixed(1), cy: (rnd() * 540 - 10).toFixed(1), r: (rnd() * 1.4 + .5).toFixed(2), fill: i % 5 ? "#B9C6D3" : "#4FB8C8", opacity: (rnd() * .5 + .3).toFixed(2) }, far);
      if (i % 4 === 0) { c.classList.add("twinkle"); c.style.animationDelay = (rnd() * 3.6).toFixed(2) + "s"; }
    }
    const C = { x: 345, y: 255 };
    const linkOf = {}, pulseOf = {};
    const line = (a, b, cls, delay, id) => {
      const p = svgEl("path", { d: `M${a.x} ${a.y}L${b.x} ${b.y}`, class: "link " + cls }, links);
      if (!reduce) { p.style.setProperty("--len", Math.hypot(b.x - a.x, b.y - a.y)); p.classList.add("draw"); p.style.animationDelay = delay + "s"; }
      if (id) linkOf[id] = p;
      return p;
    };
    L.PROJECTS.forEach((p, i) => {
      line(C, p, "", .2 + i * .12, p.id);
      const q = svgEl("path", { d: `M${C.x} ${C.y}L${p.x} ${p.y}`, class: "pulse" }, pulses);
      q.style.animationDelay = `${(i * .37).toFixed(2)}s, ${(1.4 + i * .12).toFixed(2)}s`;
      pulseOf[p.id] = q;
    });
    ["A", "B"].forEach(t => { const ps = L.PROJECTS.filter(p => p.track === t); ps.slice(1).forEach((p, i) => line(ps[i], p, "track", 1.1 + i * .05)); });
    const idea = { x: 395, y: 465 }; line(C, idea, "track", 1.3);

    const g = svgEl("g", { transform: `translate(${C.x} ${C.y})`, "aria-hidden": "true" }, stars);
    svgEl("circle", { r: 44, fill: "#EB4547", opacity: .1, class: "breathe" }, g);
    svgEl("path", { d: starPath(30), fill: "#EB4547" }, g);
    svgEl("path", { d: starPath(12), fill: "#fff", transform: "rotate(45)" }, g);
    const lt = svgEl("text", { y: 58, "text-anchor": "middle", fill: "#C93638", style: "font:500 15px Rubik,sans-serif" }, g); lt.textContent = "Lodestar";

    const tip = document.createElement("div"); tip.className = "sky-tip"; tip.setAttribute("aria-hidden", "true"); wrapEl.appendChild(tip);
    const showTip = (p, el) => {
      tip.className = "sky-tip on " + p.track;
      tip.innerHTML = `<b>${p.id} ${p.name}</b><span class="pill ${p.first ? "first" : ""}">${p.status}</span><p>${p.what}</p><em>Click to open the project</em>`;
      const r = el.getBoundingClientRect(), w = wrapEl.getBoundingClientRect();
      let x = r.left - w.left + r.width / 2 - 130, y = r.top - w.top + r.height + 8;
      x = Math.max(0, Math.min(x, w.width - 260));
      if (y + 190 > w.height) y = r.top - w.top - 190;
      tip.style.left = x + "px"; tip.style.top = y + "px";
      linkOf[p.id]?.classList.add("hot"); pulseOf[p.id]?.classList.add("hot");
    };
    const hideTip = p => { tip.classList.remove("on"); linkOf[p.id]?.classList.remove("hot"); pulseOf[p.id]?.classList.remove("hot"); };

    const addStar = (o, i, p) => {
      const color = o.color, right = o.x > C.x;
      const s = svgEl("a", { class: "star", href: o.href, transform: `translate(${o.x} ${o.y})`, "aria-label": o.aria, style: `color:${color}` }, stars);
      if (!reduce) { s.classList.add("fade"); s.style.animationDelay = (.5 + i * .12) + "s"; }
      svgEl("circle", { class: "halo", r: 30 }, s);
      if (p && p.first) svgEl("circle", { class: "beacon", r: 18, stroke: color }, s);
      svgEl("circle", { class: "ring" + (o.dashed ? " spin" : ""), r: 18, fill: "#fff", stroke: color, "stroke-opacity": .6, "stroke-dasharray": o.dashed ? "3 4" : "none" }, s);
      if (!o.dashed) svgEl("path", { d: starPath(11), fill: color }, s);
      const tx = right ? 28 : -28, anchor = right ? "start" : "end";
      const t1 = svgEl("text", { x: tx, y: o.sub ? -2 : 5, "text-anchor": anchor }, s); t1.textContent = o.label;
      if (o.sub) { const t2 = svgEl("text", { x: tx, y: 16, "text-anchor": anchor, class: "sub" }, s); t2.textContent = o.sub; }
      if (p) {
        s.addEventListener("pointerenter", () => showTip(p, s)); s.addEventListener("pointerleave", () => hideTip(p));
        s.addEventListener("focus", () => showTip(p, s)); s.addEventListener("blur", () => hideTip(p));
      }
    };
    L.PROJECTS.forEach((p, i) => addStar({ x: p.x, y: p.y, color: p.track === "A" ? "#1A8A99" : "#355E8A", href: projUrl(p.id), label: `${p.id}  ${p.short}`, sub: p.status, aria: `${p.id} ${p.name}, ${p.status}. Open project details` }, i, p));
    addStar({ ...idea, color: "#5E6672", dashed: true, href: "about.html#join", label: "Your idea", aria: "Propose a project" }, L.PROJECTS.length);

    if (!reduce) {
      const hero = sky.closest(".hero") || wrapEl;
      let tx = 0, ty = 0, cx = 0, cy = 0;
      hero.addEventListener("pointermove", e => { const r = sky.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width - .5; ty = (e.clientY - r.top) / r.height - .5; });
      hero.addEventListener("pointerleave", () => { tx = 0; ty = 0; });
      const tick = () => {
        cx += (tx - cx) * .06; cy += (ty - cy) * .06;
        far.setAttribute("transform", `translate(${(-cx * 22).toFixed(2)} ${(-cy * 16).toFixed(2)})`);
        near.setAttribute("transform", `translate(${(cx * 8).toFixed(2)} ${(cy * 6).toFixed(2)})`);
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }

  /* home: track lists */
  $$("[data-track-list]").forEach(ul => {
    const t = ul.dataset.trackList;
    ul.innerHTML = L.PROJECTS.filter(p => p.track === t)
      .map(p => `<li><b>${p.id}</b><span><a href="${projUrl(p.id)}">${p.name}</a> <span class="pill ${p.first ? "first" : ""}">${p.status}</span></span></li>`).join("");
  });

  /* ---------- projects table ---------- */
  const rows = $("#rows");
  if (rows) {
    const chev = `<svg class="chev" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 3v14M3 10h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
    const tag = p => `<span class="tag ${p.track}">${L.TRACKS[p.track].short}</span>`;
    const risk = (p, word) => `<span class="risk ${p.risk}"><b></b>${p.riskText}${word ? " risk" : ""}</span>`;
    const pill = p => `<span class="pill ${p.first ? "first" : ""}">${p.status}</span>`;
    const toggle = (r, force) => { const o = force ?? r.dataset.open !== "true"; r.dataset.open = o; r.querySelector("button").setAttribute("aria-expanded", o); };
    const render = f => {
      const list = L.PROJECTS.filter(p => f === "all" || p.track === f);
      rows.innerHTML = list.length ? "" : `<p class="empty">No projects in this track yet.</p>`;
      list.forEach(p => {
        const rq = L.RESEARCH_QUESTIONS.find(q => q.id === p.rq);
        const r = document.createElement("div");
        r.className = "row"; r.id = p.id; r.dataset.open = "false";
        r.style.setProperty("--i", rows.children.length);
        r.innerHTML = `
          <button class="cols" aria-expanded="false" aria-controls="d-${p.id}">
            <span><span class="pname"><span class="code">${p.id}</span>${p.name}</span><span class="mobile-meta">${tag(p)}${risk(p, true)}${pill(p)}</span></span>
            <span class="c-track">${tag(p)}</span><span class="c-risk">${risk(p)}</span><span class="c-size">${p.size}</span><span class="c-status">${pill(p)}</span>${chev}
          </button>
          <div class="detail" id="d-${p.id}" role="region" aria-label="${p.name} details"><div><dl>
            <div class="wide"><dt>What it does</dt><dd>${p.what}</dd></div>
            <div><dt>${p.track === "A" ? "How the agent works" : "Model"}</dt><dd>${p.how}</dd></div>
            <div><dt>How we evaluate</dt><dd>${p.eval}</dd></div>
            <div><dt>Data and risk</dt><dd>${p.data}</dd></div>
            <div><dt>Research question</dt><dd>${rq ? `<a href="research.html#${rq.id}">${rq.id}</a>: ${rq.q}` : "None yet"}</dd></div>
            <div><dt>Repository</dt><dd>${p.repo ? `<a href="${GH}/${p.repo}" target="_blank" rel="noopener">${L.CONFIG.org}/${p.repo}</a> (opens once work starts)` : "Lives in MiCreate's existing tools for now"}</dd></div>
            ${L.AGENT_RUNS.some(w => w.id === p.id) ? `<div><dt>See it run</dt><dd><a href="agents.html#run-${p.id}">Watch a simulated run of ${p.id}</a></dd></div>` : ""}
          </dl></div></div>`;
        r.querySelector("button").addEventListener("click", () => toggle(r));
        rows.appendChild(r);
      });
    };
    const setFilter = f => { $$(".chip[data-f]").forEach(c => c.setAttribute("aria-pressed", c.dataset.f === f)); render(f); };
    $$(".chip[data-f]").forEach(c => c.addEventListener("click", () => setFilter(c.dataset.f)));
    render("all");
    const openHash = () => {
      const id = location.hash.slice(1); if (!byId[id]) return;
      if (!$("#" + id)) setFilter("all");
      const r = $("#" + id); toggle(r, true);
      setTimeout(() => { r.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }); r.querySelector("button").focus({ preventScroll: true }); }, 50);
    };
    openHash(); addEventListener("hashchange", openHash);
  }

  /* ---------- agents: simulated run ---------- */
  const sim = $("#sim");
  if (sim) {
    const ICON = {
      trigger: "M13 2 4 14h7l-1 8 9-12h-7z", read: "M6 2h9l5 5v15H6zM14 2v6h6", model: "M12 2l2.5 6.5L21 11l-6.5 2.5L12 20l-2.5-6.5L3 11l6.5-2.5z",
      code: "M8 6 2 12l6 6M16 6l6 6-6 6", check: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-5-5", tool: "M4 6h16M4 12h10M4 18h7",
      approval: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4 4-6 8-6s8 2 8 6", write: "M5 3h11l4 4v14H5zM8 3v6h7V3M8 21v-7h8v7", done: "M4 12l5 5L20 6"
    };
    const icon = k => `<span class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true"><path d="${ICON[k] || ICON.tool}"/></svg></span>`;
    const tabs = $("#sim-tabs"), trace = $("#trace"), runBtn = $("#run"), perms = $("#perms"), title = $("#sim-title");
    let cur = 0, timer = null, token = 0;
    const delay = ms => new Promise(r => { timer = setTimeout(r, reduce ? 0 : ms); });
    const bar = document.createElement("div"); bar.className = "progress"; bar.innerHTML = "<i></i>";
    $(".console-head", sim).after(bar);
    const setBar = (n, total) => { bar.firstChild.style.width = (total ? Math.round(n / total * 100) : 0) + "%"; };
    const typeInto = async (el, text, my) => {
      if (reduce) { el.textContent = text; return; }
      el.classList.add("caret");
      for (let k = 0; k <= text.length; k += 2) { if (my !== token) return; el.textContent = text.slice(0, k); await new Promise(r => setTimeout(r, 9)); }
      el.textContent = text; el.classList.remove("caret");
    };
    const think = async (my) => {
      if (reduce) return;
      const li = document.createElement("li"); li.className = "thinking";
      li.innerHTML = `${icon("model")}<div><span class="dots" aria-label="Working"><i></i><i></i><i></i></span></div>`;
      trace.appendChild(li); await delay(420); li.remove();
    };
    const add = (s) => {
      const li = document.createElement("li"); li.className = "k-" + s.kind;
      const permCls = s.perm === "Needs approval" ? "perm ask" : "perm";
      li.innerHTML = `${icon(s.kind)}<div><h4>${s.t}${s.perm ? `<span class="${permCls}">${s.perm}</span>` : ""}</h4><p></p></div>`;
      trace.appendChild(li); li.typing = typeInto(li.querySelector("p"), s.p, token); return li;
    };
    const waitApproval = (li) => new Promise(res => {
      const box = document.createElement("div"); box.className = "approve";
      box.innerHTML = `<label for="note" style="font:500 .95rem Rubik,sans-serif">Note to the agent (optional)</label><textarea id="note" rows="2" placeholder="For example: use 'asesoría legal gratuita'"></textarea>
        <div class="actions"><button class="btn btn-coral" data-a="ok">Approve</button><button class="btn btn-quiet" data-a="back">Send back</button></div>`;
      li.querySelector("div").appendChild(box);
      box.querySelector("[data-a=ok]").focus({ preventScroll: true });
      box.addEventListener("click", e => {
        const a = e.target.closest("button")?.dataset.a; if (!a) return;
        const note = box.querySelector("textarea").value.trim();
        box.outerHTML = `<p><b>${a === "ok" ? "Approved by staff." : "Sent back by staff."}</b>${note ? ` Note: “${note.replace(/</g, "&lt;")}”` : ""}</p>`;
        res(a);
      });
    });
    async function run() {
      const my = ++token; const w = L.AGENT_RUNS[cur];
      trace.innerHTML = ""; runBtn.disabled = true; runBtn.textContent = "Running";
      let n = 0; setBar(0, w.steps.length);
      for (const s of w.steps) {
        if (my !== token) return;
        await think(my); if (my !== token) return;
        const li = add(s.kind === "done" ? { ...s, p: `${trace.children.length + 1} steps. ${s.p}` } : s);
        await li.typing; setBar(++n, w.steps.length);
        if (s.kind === "approval") {
          runBtn.textContent = "Waiting for you";
          let a = await waitApproval(li);
          while (a === "back" && my === token) {
            await think(my); await add({ kind: "model", t: s.revise, perm: "Allowed", p: "Changes made and checked again." }).typing;
            await think(my); const again = add({ ...s, t: "Waiting for staff approval again" }); await again.typing;
            a = await waitApproval(again);
          }
          if (my !== token) return;
          runBtn.textContent = "Running";
        }
      }
      runBtn.disabled = false; runBtn.textContent = "Run again";
    }
    const select = (i, focus) => {
      token++; clearTimeout(timer); cur = i; const w = L.AGENT_RUNS[i];
      $$("button", tabs).forEach((b, j) => { b.setAttribute("aria-pressed", i === j); });
      title.textContent = `${w.id} ${w.title}`;
      trace.innerHTML = `<li style="display:block"><span class="idle">Press “Run sample” to watch this agent work. You approve or send back its draft.</span></li>`;
      runBtn.disabled = false; runBtn.textContent = "Run sample"; setBar(0, 1);
      perms.innerHTML = `<h3>What this agent may do</h3><ul>${w.perms.map(([t, k]) => `<li><span>${t}</span><span class="p-${k}">${{ allow: "Allowed", ask: "Needs approval", never: "Never" }[k]}</span></li>`).join("")}</ul>`;
      if (focus) sim.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    };
    tabs.innerHTML = L.AGENT_RUNS.map((w, i) => `<button class="chip" aria-pressed="false">${w.id} ${w.label}</button>`).join("");
    $$("button", tabs).forEach((b, i) => b.addEventListener("click", () => select(i)));
    runBtn.addEventListener("click", run);
    const fromHash = () => { const m = location.hash.match(/^#run-([A-Z]\d)$/); const i = m ? L.AGENT_RUNS.findIndex(w => w.id === m[1]) : -1; select(i >= 0 ? i : 0, i >= 0); };
    fromHash(); addEventListener("hashchange", fromHash);
  }

  /* agent project list */
  $$("[data-agent-projects]").forEach(el => {
    el.innerHTML = L.PROJECTS.filter(p => p.track === "A").map(p => `
      <div><h3><a href="${projUrl(p.id)}">${p.id} ${p.name}</a></h3><p>${p.what}</p><p><span class="pill ${p.first ? "first" : ""}">${p.status}</span> <span class="risk ${p.risk}" style="margin-left:.5rem"><b></b>${p.riskText} risk</span></p></div>`).join("");
  });

  /* ---------- research ---------- */
  const rq = $("#rq");
  if (rq) rq.innerHTML = L.RESEARCH_QUESTIONS.map(q => `
    <article id="${q.id}"><div class="id">${q.id}</div>
      <div><h3>${q.q}</h3><p>${q.why}</p></div>
      <dl><div><dt>Method</dt><dd>${q.method}</dd></div>
      <div><dt>Projects</dt><dd>${q.projects.map(id => `<a href="${projUrl(id)}">${id} ${byId[id].name}</a>`).join("<br>")}</dd></div>
      <div><dt>Status</dt><dd>${q.status}</dd></div></dl></article>`).join("");

  const ds = $("#datasets");
  if (ds) {
    ds.innerHTML = L.DATASETS.map((d, i) => `
      <div class="ds ${d.closed ? "closed-data" : ""}"><h3>${d.name}</h3><p>${d.what}</p>
        <dl><dt>Project</dt><dd>${d.project}</dd><dt>License</dt><dd>${d.license}</dd><dt>Target</dt><dd>${d.target}</dd><dt>Status</dt><dd>${d.status}</dd></dl>
        ${d.sample ? `<button class="btn btn-quiet" aria-expanded="false" aria-controls="s${i}">Preview a record</button><pre id="s${i}" hidden>${JSON.stringify(d.sample, null, 2)}</pre>` : ""}
      </div>`).join("");
    $$("button[aria-controls]", ds).forEach(b => b.addEventListener("click", () => {
      const pre = $("#" + b.getAttribute("aria-controls")); const o = pre.hidden; pre.hidden = !o;
      b.setAttribute("aria-expanded", o); b.textContent = o ? "Hide record" : "Preview a record";
    }));
  }

  const pubs = $("#pubs");
  if (pubs) pubs.innerHTML = `<ul>${L.PUBLICATIONS.map(p => `<li><div><b>${p.t}</b><span>${p.d}</span></div><span class="pill">${p.status}</span></li>`).join("")}</ul>`;

  /* ---------- pipeline ---------- */
  const steps = $("#steps"), panel = $("#panel");
  if (steps) {
    const show = i => {
      const s = L.STEPS[i];
      $$("button", steps).forEach((b, j) => { b.setAttribute("aria-selected", i === j); b.tabIndex = i === j ? 0 : -1; });
      panel.innerHTML = `<h3>${s.t}</h3><p>${s.d}</p><ul>${s.li.map(x => `<li>${x}</li>`).join("")}</ul><div class="chips">${s.chips.map(x => `<span>${x}</span>`).join("")}</div>`;
      panel.setAttribute("aria-labelledby", "step-" + i);
    };
    L.STEPS.forEach((s, i) => {
      const li = document.createElement("li");
      li.innerHTML = `<button role="tab" id="step-${i}" aria-controls="panel"><span class="n ${s.gate ? "is-gate" : ""}">${i + 1}</span>${s.t}</button>`;
      const b = li.firstChild;
      b.addEventListener("click", () => show(i));
      b.addEventListener("keydown", e => {
        const n = ["ArrowDown", "ArrowRight"].includes(e.key) ? 1 : ["ArrowUp", "ArrowLeft"].includes(e.key) ? -1 : 0;
        if (n) { e.preventDefault(); const k = (i + n + L.STEPS.length) % L.STEPS.length; show(k); $$("button", steps)[k].focus(); }
      });
      steps.appendChild(li);
    });
    show(0);
  }

  /* ---------- release check ---------- */
  const qs = $("#questions"), v = $("#verdict");
  if (qs) {
    const ans = L.QUESTIONS.map(() => null);
    const render = () => {
      const n = ans.filter(a => a !== null).length, fails = L.QUESTIONS.filter((q, i) => ans[i] !== null && ans[i] !== q.want);
      v.className = "verdict"; let head, body;
      if (fails.length) { v.classList.add("fail"); head = "Not ready to release"; body = `<p>Fix these first:</p><ul>${fails.map(f => `<li>${f.fix}</li>`).join("")}</ul>`; }
      else if (n === L.QUESTIONS.length) { v.classList.add("pass"); if (!reduce) { void v.offsetWidth; v.classList.add("pop"); } head = "Ready for a partner pilot"; body = `<p>Next: sign-off against the data and ethics policy, then a pilot with one partner before any public release.</p>`; }
      else { head = n ? "Keep going" : "Answer each question"; body = `<p>${L.QUESTIONS.length - n} of ${L.QUESTIONS.length} questions left. One failed answer blocks release.</p>`; }
      v.innerHTML = `<p class="label">Result</p><div class="big">${head}</div>${body}<div class="meter" aria-hidden="true"><i style="width:${Math.round(n / L.QUESTIONS.length * 100)}%"></i></div>`;
    };
    L.QUESTIONS.forEach((q, i) => {
      const d = document.createElement("div"); d.className = "q";
      d.innerHTML = `<p id="q${i}">${q.q}</p><div class="yn" role="group" aria-labelledby="q${i}"><button aria-pressed="false" data-v="1">Yes</button><button aria-pressed="false" data-v="0">No</button></div>`;
      $$("button", d).forEach(b => b.addEventListener("click", () => { ans[i] = b.dataset.v === "1"; $$("button", d).forEach(x => x.setAttribute("aria-pressed", x === b)); render(); }));
      qs.appendChild(d);
    });
    render();
  }

  /* ---------- about ---------- */
  const road = $("#road");
  if (road) road.innerHTML = L.ROAD.map((r, i) => `<li style="--i:${i}" class="${r.key ? "key" : ""}"><span class="m">${r.m}</span><span class="d">${r.d}</span><p>${r.p}</p></li>`).join("");
  if (road) {
    if (reduce || !("IntersectionObserver" in window)) road.classList.add("in");
    else { const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { road.classList.add("in"); io.disconnect(); } }), { threshold: .3 }); io.observe(road); }
  }
  const princ = $("#princ");
  if (princ) princ.innerHTML = L.PRINCIPLES.map(([h, p]) => `<div><h3><svg viewBox="-12 -12 24 24" aria-hidden="true"><path d="${starPath(11)}" fill="#EB4547"/></svg>${h}</h3><p>${p}</p></div>`).join("");
  const metrics = $("#metrics");
  if (metrics) metrics.innerHTML = L.METRICS.map(p => `<div class="metric"><div class="v" aria-label="Not yet measured">0</div><p>${p}</p></div>`).join("");
  const roles = $("#roles");
  if (roles) roles.innerHTML = L.ROLES.map(([r, d, s]) => `<div><b>${r}</b><p>${d}</p><span class="pill ${s === "Open" ? "first" : ""}">${s}</span></div>`).join("");

  const handle = $("#handle");
  if (handle) {
    const cmd = $("#gitcmd"); let cur = "vega";
    const set = n => { cur = n; handle.innerHTML = `mcr-<span>${n}</span>`; cmd.textContent = `git config user.name "mcr-${n}"\ngit config user.email "<your-id>+mcr-${n}@users.noreply.github.com"`; };
    const pick = () => { let n; do { n = L.STAR_NAMES[Math.floor(Math.random() * L.STAR_NAMES.length)]; } while (n === cur); return n; };
    $("#draw").addEventListener("click", () => {
      $("#copied").textContent = "";
      if (reduce) { set(pick()); return; }
      let k = 0; handle.classList.add("rolling");
      const spin = setInterval(() => { handle.innerHTML = `mcr-<span>${pick()}</span>`; if (++k > 10) { clearInterval(spin); handle.classList.remove("rolling"); set(pick()); } }, 55);
    });
    $("#copy").addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(cmd.textContent); $("#copied").textContent = "Copied git setup for mcr-" + cur; }
      catch { $("#copied").textContent = "Copy failed. Select the text above and copy it manually."; }
    });
    set(cur);
  }
})();
