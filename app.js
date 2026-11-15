/* Plan T1-2027 — application de suivi (100 % statique, données dans le navigateur + archivage GitHub optionnel) */
(() => {
  "use strict";
  const P = window.PLAN;
  const DAYS = ["lun", "mar", "mer", "jeu", "ven", "sam", "dim"];
  const DAY_LABELS = { lun: "Lun", mar: "Mar", mer: "Mer", jeu: "Jeu", ven: "Ven", sam: "Sam", dim: "Dim" };
  const SPORT = {
    velo: { label: "Vélo", color: "var(--velo)" },
    test: { label: "Test", color: "var(--test)" },
    natation: { label: "Natation", color: "var(--natation)" },
    renfo: { label: "Renfo", color: "var(--ppg)" },
    eveil: { label: "Éveil / souplesse", color: "var(--mobilite)" },
    ski: { label: "Ski", color: "var(--ski)" },
    repos: { label: "Repos", color: "var(--repos)" }
  };
  const STATUS = { fait: "✓ Fait", partiel: "◐ Partiel", saute: "✕ Sautée" };
  const FEEL = ["😫", "😕", "😐", "🙂", "😃"];
  const KEY = "planT1-2027:v1";

  /* ---------------- Données ---------------- */
  const blank = () => ({
    version: 1,
    settings: { ftp: P.meta.ftpDefault, eventDate: P.meta.event.date, gh: { repo: "frederictillier-design/Mon-Plan-T1-2027", path: "data/journal.json", branch: "main", token: "" } },
    log: {},        // "YYYY-MM-DD|workoutKey" -> {status, dur, w, np, hr, cad, rpe, feel, note, ts}
    weights: [],    // {date, kg}
    tests: [],      // {date, w20, ftp, note}
    updated: null
  });
  let S = load();
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return seed(blank());
      const s = Object.assign(blank(), JSON.parse(raw));
      s.settings = Object.assign(blank().settings, s.settings || {});
      s.settings.gh = Object.assign(blank().settings.gh, (s.settings || {}).gh || {});
      return s;
    } catch (e) { return seed(blank()); }
  }
  function seed(s) {
    s.weights.push({ date: "2026-11-15", kg: P.meta.weightStart });
    return s;
  }
  function save() {
    S.updated = new Date().toISOString();
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { toast("Stockage local indisponible : exporte tes données."); }
  }

  /* ---------------- Utilitaires ---------------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pad = (n) => String(n).padStart(2, "0");
  const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parse = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d, 12); };
  const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return iso(d); };
  const today = () => iso(new Date());
  const fmt = (s, opt = { weekday: "short", day: "numeric", month: "short" }) => parse(s).toLocaleDateString("fr-FR", opt);
  const daysBetween = (a, b) => Math.round((parse(b) - parse(a)) / 864e5);
  const ftp = () => Number(S.settings.ftp) || P.meta.ftpDefault;
  const W = (pct) => Math.round(ftp() * pct / 100);
  const watts = (z) => (z ? (z[0] === z[1] ? `${W(z[0])} W` : `${W(z[0])}–${W(z[1])} W`) : "—");
  const hm = (min) => { if (!min) return "—"; const h = Math.floor(min / 60), m = Math.round(min % 60); return h ? `${h}h${m ? pad(m) : ""}` : `${m} min`; };
  const dateOf = (weekN, dayIdx) => addDays(P.meta.start, (weekN - 1) * 7 + dayIdx);
  const lkey = (date, wk) => `${date}|${wk}`;

  // Liste à plat de toutes les séances planifiées
  const ALL = [];
  P.weeks.forEach((w) => DAYS.forEach((d, i) => (w.days[d] || []).forEach((k) => {
    ALL.push({ week: w.n, day: d, idx: i, date: dateOf(w.n, i), key: k, wo: P.workouts[k] });
  })));
  const isTrackable = (it) => it.wo && it.wo.sport !== "repos";
  function weekOfDate(date) {
    const off = daysBetween(P.meta.start, date);
    if (off < 0) return 0;
    const n = Math.floor(off / 7) + 1;
    return n > P.weeks.length ? P.weeks.length + 1 : n;
  }
  function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), 2600); }

  /* ---------------- Rendu général ---------------- */
  let TAB = "today";
  function render() {
    $("#ftp-chip").textContent = `FTP ${ftp()} W`;
    const v = $("#view");
    ({ today: viewToday, plan: viewPlan, suivi: viewSuivi, doc: viewDoc, settings: viewSettings })[TAB](v);
    document.querySelectorAll(".tabbar button").forEach((b) => b.classList.toggle("active", b.dataset.tab === TAB));
  }
  document.querySelectorAll(".tabbar button").forEach((b) => b.addEventListener("click", () => { TAB = b.dataset.tab; render(); window.scrollTo(0, 0); }));

  function sessionBtn(it, opts = {}) {
    const wo = it.wo, sp = SPORT[wo.sport] || SPORT.repos;
    const L = S.log[lkey(it.date, it.key)];
    const st = !isTrackable(it) ? "" : L ? `<span class="status ${L.status}">${STATUS[L.status] || ""}</span>` : (it.date < today() ? `<span class="status afaire">à saisir</span>` : "");
    const target = (wo.sport === "velo" || wo.sport === "test") ? mainTarget(wo) : "";
    return `<button class="session" data-date="${it.date}" data-key="${it.key}">
      <span class="stripe" style="background:${sp.color}"></span>
      <span class="body"><span class="title">${esc(wo.title)}</span>
        <div class="meta">${opts.showDate ? esc(fmt(it.date)) + " · " : ""}${wo.slot && wo.slot !== "—" ? wo.slot.toUpperCase() + " · " : ""}${sp.label}${wo.dur ? " · " + hm(wo.dur) : ""}${target ? " · " + target : ""}${wo.outdoor ? " · extérieur" : ""}</div></span>${st}</button>`;
  }
  function mainTarget(wo) {
    // l'étape la plus intense, pour l'aperçu
    const s = (wo.steps || []).filter((x) => x.z).sort((a, b) => b.z[1] - a.z[1])[0];
    return s ? watts(s.z) : "";
  }
  function bindSessions(root) {
    root.querySelectorAll(".session").forEach((b) => b.addEventListener("click", () => openSession(b.dataset.date, b.dataset.key)));
  }

  /* ---------------- Onglet Aujourd'hui ---------------- */
  function viewToday(v) {
    const t = today(), wn = weekOfDate(t);
    const ev = S.settings.eventDate, dEv = daysBetween(t, ev);
    const lastW = [...S.weights].sort((a, b) => a.date < b.date ? -1 : 1).pop();
    const kg = lastW ? lastW.kg : P.meta.weightStart;
    const kgProg = Math.max(0, Math.min(100, (P.meta.weightStart - kg) / (P.meta.weightStart - P.meta.weightGoal) * 100));
    const ftpProg = Math.max(0, Math.min(100, (ftp() - P.meta.ftpDefault) / (P.meta.ftpGoal - P.meta.ftpDefault) * 100));
    const wkg = (ftp() / kg).toFixed(2);

    let html = `<div class="card hero">
      <div class="row"><div><h2>${esc(P.meta.event.name)}</h2><div class="small">${esc(fmt(ev, { day: "numeric", month: "long", year: "numeric" }))} · ${esc(P.meta.event.note)}</div></div>
      <div style="text-align:right"><div style="font-size:2rem;font-weight:800;line-height:1;white-space:nowrap">J-${Math.max(0, dEv)}</div><div class="small">jours</div></div></div></div>
      <div class="grid k3">
        <div class="kpi"><div class="lbl">FTP</div><div class="val">${ftp()} W</div><div class="sub">objectif &gt; ${P.meta.ftpGoal} W</div><div class="bar"><span style="width:${ftpProg}%"></span></div></div>
        <div class="kpi"><div class="lbl">Poids</div><div class="val">${kg} kg</div><div class="sub">objectif ${P.meta.weightGoal} kg</div><div class="bar"><span style="width:${kgProg}%"></span></div></div>
        <div class="kpi"><div class="lbl">W/kg</div><div class="val">${wkg}</div><div class="sub">objectif ≥ ${(P.meta.ftpGoal / P.meta.weightGoal).toFixed(2)}</div></div>
      </div><div style="height:14px"></div>`;

    if (wn === 0) {
      const d0 = daysBetween(t, P.meta.start);
      html += `<div class="card"><h2>Le plan démarre le lundi 4 janvier</h2><p class="small">Dans ${d0} jours. Prochain repère : <b>test FTP du 19 décembre</b>. Saisis-le dans <b>Suivi</b> : la FTP et toutes les cibles en watts seront mises à jour.</p></div>`;
      html += weekCard(P.weeks[0], "Aperçu — semaine 1");
    } else if (wn > P.weeks.length) {
      html += `<div class="card"><h2>Trimestre terminé 🎉</h2><p class="small">Consulte le bilan dans <b>Suivi</b> et exporte tes données dans <b>Réglages</b>.</p></div>`;
    } else {
      const wk = P.weeks[wn - 1];
      const todays = ALL.filter((x) => x.date === t);
      html += `<div class="card"><div class="row"><h2>Aujourd'hui · ${esc(fmt(t, { weekday: "long", day: "numeric", month: "long" }))}</h2></div>
        ${todays.map((x) => sessionBtn(x)).join("") || '<div class="empty">Rien de prévu</div>'}</div>`;
      html += weekCard(wk, `Semaine ${wk.n} · ${blockName(wk.block)}`);
    }
    // séances passées non saisies
    const missing = ALL.filter((x) => isTrackable(x) && x.date < t && !S.log[lkey(x.date, x.key)]).slice(-5);
    if (missing.length) html += `<div class="card"><h3>À saisir</h3>${missing.map((x) => sessionBtn(x, { showDate: true })).join("")}</div>`;
    v.innerHTML = html;
    bindSessions(v);
  }
  const blockName = (id) => (P.blocks.find((b) => b.id === id) || {}).name || "";
  function weekStats(wk) {
    const items = ALL.filter((x) => x.week === wk.n && isTrackable(x));
    const planned = items.reduce((a, x) => a + (x.wo.dur || 0), 0);
    let done = 0, logged = 0;
    items.forEach((x) => { const L = S.log[lkey(x.date, x.key)]; if (L && L.status !== "saute") { logged++; done += Number(L.dur) || (L.status === "fait" ? x.wo.dur : 0); } });
    return { planned, done, logged, total: items.length };
  }
  function weekCard(wk, title) {
    const st = weekStats(wk);
    const tagCls = wk.type;
    const tagTxt = { charge: "Charge", recup: "Allégée", ski: "Ski", test: "Test" }[wk.type];
    return `<div class="card"><div class="row"><h2>${esc(title)}</h2><span class="tag ${tagCls}">${tagTxt}</span></div>
      <p class="small">${esc(wk.theme)} · ${fmt(dateOf(wk.n, 0), { day: "numeric", month: "short" })} → ${fmt(dateOf(wk.n, 6), { day: "numeric", month: "short" })} · ${hm(st.planned)} prévues · ${st.logged}/${st.total} séances saisies</p>
      ${DAYS.map((d, i) => dayRow(wk, d, i)).join("")}</div>`;
  }
  function dayRow(wk, d, i) {
    const date = dateOf(wk.n, i);
    const items = (wk.days[d] || []).map((k) => ({ week: wk.n, day: d, idx: i, date, key: k, wo: P.workouts[k] }));
    return `<div class="day ${date === today() ? "today" : ""}"><div class="d"><b>${DAY_LABELS[d]}</b>${fmt(date, { day: "numeric", month: "short" })}</div>
      <div>${items.map((x) => sessionBtn(x)).join("")}</div></div>`;
  }

  /* ---------------- Onglet Plan ---------------- */
  function viewPlan(v) {
    const wn = weekOfDate(today());
    let html = `<div class="card"><h2>${esc(P.meta.title)}</h2><p class="small">13 semaines · 4 janvier → 4 avril 2027 · cibles calculées sur une FTP de <b>${ftp()} W</b>.</p>
      <div class="legend">${Object.entries(SPORT).filter(([k]) => k !== "repos").map(([, s]) => `<span><span class="dot" style="background:${s.color}"></span> ${s.label}</span>`).join("")}</div></div>`;
    P.blocks.forEach((b) => {
      html += `<h3 style="margin:18px 4px 8px">${esc(b.name)}</h3><p class="small" style="margin:0 4px 10px">${esc(b.focus)}</p>`;
      b.weeks.forEach((n) => {
        const wk = P.weeks[n - 1], st = weekStats(wk);
        const open = n === wn || (wn === 0 && n === 1);
        const tagTxt = { charge: "Charge", recup: "Allégée", ski: "Ski", test: "Test" }[wk.type];
        html += `<details class="card week ${n === wn ? "current" : ""}" ${open ? "open" : ""}>
          <summary><div class="week-head"><div><div class="t">S${n} · ${esc(wk.theme)}</div>
          <div class="small">${fmt(dateOf(n, 0), { day: "numeric", month: "short" })} → ${fmt(dateOf(n, 6), { day: "numeric", month: "short" })} · ${hm(st.planned)} · ${st.logged}/${st.total} saisies</div></div>
          <span class="tag ${wk.type}">${tagTxt}</span></div></summary>
          ${DAYS.map((d, i) => dayRow(wk, d, i)).join("")}</details>`;
      });
    });
    v.innerHTML = html;
    bindSessions(v);
  }

  /* ---------------- Fiche séance + saisie ---------------- */
  function openSession(date, key) {
    const wo = P.workouts[key]; if (!wo) return;
    const L = S.log[lkey(date, key)] || {};
    const isBike = wo.sport === "velo" || wo.sport === "test";
    const track = wo.sport !== "repos";
    const rows = (wo.steps || []).map((s) => `<tr><td>${esc(s.t)}${s.n ? `<div class="n">${esc(s.n)}</div>` : ""}</td>
      <td>${s.d ? hm(s.d) : ""}</td>${isBike ? `<td class="w">${s.z ? watts(s.z) : ""}<div class="n">${s.z ? s.z[0] + "–" + s.z[1] + " %" : ""}</div></td><td>${esc(s.c || "")}</td>` : ""}</tr>`).join("");
    let html = `<div class="small">${esc(fmt(date, { weekday: "long", day: "numeric", month: "long" }))} · ${(SPORT[wo.sport] || {}).label || ""}</div>
      <h2>${esc(wo.title)}</h2>
      <p class="small">${wo.dur ? "Durée " + hm(wo.dur) : ""}${wo.tss ? " · charge ~" + wo.tss + " TSS" : ""}${wo.outdoor ? " · extérieur si possible" : ""}</p>
      <table class="steps"><thead><tr><th>Étape</th><th>Durée</th>${isBike ? "<th>Cible</th><th>rpm</th>" : ""}</tr></thead><tbody>${rows}</tbody></table>${wo.tip ? `<p class="small" style="border-left:3px solid var(--accent);padding-left:8px;font-style:italic">${esc(wo.tip)}</p>` : ""}`;
    if (track) {
      html += `<div class="sep"></div><h3>Mon ressenti</h3>
      <div class="seg" id="f-status">${Object.entries(STATUS).map(([k, l]) => `<button type="button" data-v="${k}" class="${L.status === k ? "on" : ""}">${l}</button>`).join("")}</div>
      <div style="height:10px"></div>
      <div class="form-grid">
        <div><label>Durée (min)</label><input id="f-dur" type="number" inputmode="numeric" value="${esc(L.dur ?? "")}" placeholder="${wo.dur || ""}"></div>
        ${isBike ? `<div><label>W moyens</label><input id="f-w" type="number" inputmode="numeric" value="${esc(L.w ?? "")}"></div>
        <div><label>W normalisés / intervalles</label><input id="f-np" type="number" inputmode="numeric" value="${esc(L.np ?? "")}"></div>
        <div><label>FC moyenne</label><input id="f-hr" type="number" inputmode="numeric" value="${esc(L.hr ?? "")}"></div>
        <div><label>Cadence moy.</label><input id="f-cad" type="number" inputmode="numeric" value="${esc(L.cad ?? "")}"></div>` : `<div><label>Distance / volume</label><input id="f-vol" value="${esc(L.vol ?? "")}" placeholder="${wo.sport === "natation" ? "ex. 1 800 m" : ""}"></div>`}
        <div><label>Effort perçu (RPE 1-10)</label><input id="f-rpe" type="number" min="1" max="10" inputmode="numeric" value="${esc(L.rpe ?? "")}"></div>
        <div class="full"><label>Sensations</label><div class="seg feel" id="f-feel">${FEEL.map((e, i) => `<button type="button" data-v="${i + 1}" class="${Number(L.feel) === i + 1 ? "on" : ""}" aria-label="Ressenti ${i + 1} sur 5">${e}</button>`).join("")}</div></div>
        <div class="full"><label>Commentaire</label><textarea id="f-note" placeholder="Jambes, sommeil, météo, matériel…">${esc(L.note ?? "")}</textarea></div>
      </div>
      <div class="btn-row"><button class="btn" id="f-save">Enregistrer</button>${S.log[lkey(date, key)] ? '<button class="btn danger" id="f-del">Effacer</button>' : ""}</div>`;
      if (wo.sport === "test") html += `<p class="small">Pour un test FTP, saisis aussi la moyenne des 20 min dans <b>Suivi → Tests FTP</b> : la nouvelle FTP sera proposée.</p>`;
    }
    $("#modal-body").innerHTML = html;
    const m = $("#modal");
    if (track) {
      let status = L.status || "", feel = L.feel || "";
      m.querySelectorAll("#f-status button").forEach((b) => b.addEventListener("click", () => { status = b.dataset.v; m.querySelectorAll("#f-status button").forEach((x) => x.classList.toggle("on", x === b)); }));
      m.querySelectorAll("#f-feel button").forEach((b) => b.addEventListener("click", () => { feel = Number(b.dataset.v); m.querySelectorAll("#f-feel button").forEach((x) => x.classList.toggle("on", x === b)); }));
      $("#f-save").addEventListener("click", () => {
        if (!status) { toast("Choisis Fait, Partiel ou Sautée"); return; }
        const num = (id) => { const e = $(id); return e && e.value !== "" ? Number(e.value) : undefined; };
        S.log[lkey(date, key)] = { status, dur: num("#f-dur"), w: num("#f-w"), np: num("#f-np"), hr: num("#f-hr"), cad: num("#f-cad"), vol: $("#f-vol") ? $("#f-vol").value : undefined, rpe: num("#f-rpe"), feel: feel || undefined, note: $("#f-note").value.trim(), ts: new Date().toISOString() };
        save(); m.close(); render(); toast("Séance enregistrée");
      });
      const del = $("#f-del");
      if (del) del.addEventListener("click", () => { if (confirm("Effacer la saisie de cette séance ?")) { delete S.log[lkey(date, key)]; save(); m.close(); render(); } });
    }
    m.showModal();
  }

  /* ---------------- Onglet Suivi ---------------- */
  function viewSuivi(v) {
    const ws = [...S.weights].sort((a, b) => a.date < b.date ? -1 : 1);
    const ts = [...S.tests].sort((a, b) => a.date < b.date ? -1 : 1);
    const weeks = P.weeks.map((w) => ({ n: w.n, ...weekStats(w), ...weekFeel(w) }));
    const logged = Object.keys(S.log).length;
    const doneBike = ALL.filter((x) => (x.wo.sport === "velo" || x.wo.sport === "test") && S.log[lkey(x.date, x.key)] && S.log[lkey(x.date, x.key)].status !== "saute").length;

    let html = `<div class="grid k3">
      <div class="kpi"><div class="lbl">Séances saisies</div><div class="val">${logged}</div><div class="sub">sur ${ALL.filter(isTrackable).length} prévues</div></div>
      <div class="kpi"><div class="lbl">Séances vélo faites</div><div class="val">${doneBike}</div></div>
      <div class="kpi"><div class="lbl">Volume réalisé</div><div class="val">${hm(weeks.reduce((a, w) => a + w.done, 0))}</div><div class="sub">sur ${hm(weeks.reduce((a, w) => a + w.planned, 0))} prévues</div></div>
    </div><div style="height:14px"></div>`;

    // Poids
    html += `<div class="card"><h2>Poids</h2>
      <div class="legend"><span><i style="background:var(--series-1)"></i>Poids mesuré</span><span><i class="dash"></i>Trajectoire vers ${P.meta.weightGoal} kg (juin)</span></div>
      <div class="chart-wrap" id="ch-weight"></div>
      <div class="form-grid" style="margin-top:10px"><div><label>Date</label><input id="w-date" type="date" value="${today()}"></div>
      <div><label>Poids (kg)</label><input id="w-kg" type="number" step="0.1" inputmode="decimal"></div>
      <div style="align-self:end"><button class="btn" id="w-add" style="width:100%">Ajouter</button></div></div>
      ${listTable(ws.slice().reverse().slice(0, 8), ["Date", "kg"], (x) => [fmt(x.date, { day: "numeric", month: "short", year: "2-digit" }), x.kg], "w")}</div>`;

    // Tests FTP
    html += `<div class="card"><h2>Tests FTP</h2>
      <div class="legend"><span><i style="background:var(--series-1)"></i>FTP testée</span><span><i class="dash"></i>Objectif ${P.meta.ftpGoal} W</span></div>
      <div class="chart-wrap" id="ch-ftp"></div>
      <div class="form-grid" style="margin-top:10px"><div><label>Date</label><input id="t-date" type="date" value="${today()}"></div>
      <div><label>Moyenne 20 min (W)</label><input id="t-w20" type="number" inputmode="numeric"></div>
      <div><label>ou FTP directe (W)</label><input id="t-ftp" type="number" inputmode="numeric" placeholder="ex. test rampe"></div>
      <div class="full"><button class="btn" id="t-add">Enregistrer le test</button> <span class="small">FTP = 95 % de la moyenne des 20 min. Repères : 19/12, 27/01, 03/03, 31/03.</span></div></div>
      ${listTable(ts.slice().reverse(), ["Date", "20 min", "FTP", "W/kg"], (x) => [fmt(x.date, { day: "numeric", month: "short", year: "2-digit" }), x.w20 ? x.w20 + " W" : "—", x.ftp + " W", (x.ftp / weightAt(x.date)).toFixed(2)], "t")}</div>`;

    // Volume hebdo
    html += `<div class="card"><h2>Volume par semaine</h2>
      <div class="legend"><span><i style="background:var(--surface-2);border:1px solid var(--border);height:8px"></i>Prévu</span><span><i style="background:var(--series-1);height:8px"></i>Réalisé</span></div>
      <div class="chart-wrap" id="ch-vol"></div></div>`;

    // Ressenti
    html += `<div class="card"><h2>Effort perçu moyen (RPE) par semaine</h2><div class="chart-wrap" id="ch-rpe"></div>
      <p class="small">Si le RPE monte d'une semaine à l'autre alors que les watts stagnent, c'est le signe d'une fatigue qui s'accumule : allège la semaine.</p></div>`;

    // Journal
    const journal = Object.entries(S.log).sort((a, b) => a[0] < b[0] ? 1 : -1).slice(0, 30);
    html += `<div class="card"><h2>Journal récent</h2>${journal.length ? `<table class="list"><thead><tr><th>Date</th><th>Séance</th><th class="r">W</th><th class="r">RPE</th><th>Ressenti</th></tr></thead><tbody>
      ${journal.map(([k, L]) => { const [d, w] = k.split("|"); const wo = P.workouts[w] || { title: w }; return `<tr data-date="${d}" data-key="${w}" style="cursor:pointer"><td>${fmt(d, { day: "numeric", month: "short" })}</td><td>${esc(wo.title)} <span class="status ${L.status}">${L.status === "fait" ? "✓" : L.status === "partiel" ? "◐" : "✕"}</span></td><td class="r">${L.w ?? "—"}</td><td class="r">${L.rpe ?? "—"}</td><td>${L.feel ? FEEL[L.feel - 1] : ""}</td></tr>`; }).join("")}</tbody></table>` : '<div class="empty">Aucune séance saisie pour l\'instant</div>'}</div>`;

    v.innerHTML = html;

    // charts
    const start = "2026-11-15", end = "2027-06-30";
    lineChart($("#ch-weight"), {
      xMin: start, xMax: end, series: [{ pts: ws.map((x) => [x.date, x.kg]), color: "var(--series-1)", unit: "kg" }],
      targets: [{ pts: [[start, P.meta.weightStart], [S.settings.eventDate, P.meta.weightGoal]], label: "trajectoire" }],
      yPad: 1, decimals: 1
    });
    lineChart($("#ch-ftp"), {
      xMin: "2026-12-01", xMax: end, series: [{ pts: ts.map((x) => [x.date, x.ftp]), color: "var(--series-1)", unit: "W" }],
      targets: [{ pts: [["2026-12-01", P.meta.ftpGoal], [end, P.meta.ftpGoal]], label: "objectif" }],
      yMinForce: Math.min(P.meta.ftpDefault - 15, ...ts.map((x) => x.ftp - 5)), yMaxForce: Math.max(P.meta.ftpGoal + 15, ...ts.map((x) => x.ftp + 5))
    });
    barChart($("#ch-vol"), weeks.map((w) => ({ label: "S" + w.n, a: w.planned / 60, b: w.done / 60 })), "h");
    rpeChart($("#ch-rpe"), weeks.map((w) => ({ label: "S" + w.n, v: w.rpe })));

    $("#w-add").addEventListener("click", () => {
      const kg = Number($("#w-kg").value), d = $("#w-date").value;
      if (!kg || !d) return toast("Indique la date et le poids");
      S.weights = S.weights.filter((x) => x.date !== d).concat({ date: d, kg }); save(); render(); toast("Poids enregistré");
    });
    $("#t-add").addEventListener("click", () => {
      const d = $("#t-date").value, w20 = Number($("#t-w20").value) || undefined; let f = Number($("#t-ftp").value) || (w20 ? Math.round(w20 * 0.95) : 0);
      if (!d || !f) return toast("Indique la moyenne 20 min ou la FTP");
      S.tests = S.tests.filter((x) => x.date !== d).concat({ date: d, w20, ftp: f });
      if (confirm(`Nouvelle FTP : ${f} W. L'utiliser pour toutes les cibles du plan ?`)) S.settings.ftp = f;
      save(); render(); toast("Test enregistré");
    });
    v.querySelectorAll("[data-del]").forEach((b) => b.addEventListener("click", () => {
      const [kind, d] = b.dataset.del.split("|");
      if (kind === "w") S.weights = S.weights.filter((x) => x.date !== d); else S.tests = S.tests.filter((x) => x.date !== d);
      save(); render();
    }));
    v.querySelectorAll("tr[data-key]").forEach((r) => r.addEventListener("click", () => openSession(r.dataset.date, r.dataset.key)));
  }
  function weightAt(date) {
    const ws = S.weights.filter((x) => x.date <= date).sort((a, b) => a.date < b.date ? -1 : 1);
    return ws.length ? ws[ws.length - 1].kg : P.meta.weightStart;
  }
  function weekFeel(wk) {
    const r = ALL.filter((x) => x.week === wk.n).map((x) => S.log[lkey(x.date, x.key)]).filter((L) => L && L.rpe);
    return { rpe: r.length ? r.reduce((a, L) => a + L.rpe, 0) / r.length : null };
  }
  function listTable(rows, head, fn, kind) {
    if (!rows.length) return "";
    return `<table class="list" style="margin-top:10px"><thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}<th></th></tr></thead><tbody>
      ${rows.map((x) => `<tr>${fn(x).map((c) => `<td>${esc(c)}</td>`).join("")}<td class="r"><button class="icon-btn" data-del="${kind}|${x.date}" aria-label="Supprimer">✕</button></td></tr>`).join("")}</tbody></table>`;
  }

  /* ---------------- Graphiques SVG (sans dépendance) ---------------- */
  let SVGW = 640, SVGH = 220; const M = { l: 40, r: 14, t: 18, b: 26 };
  function dims(wrap) { SVGW = Math.max(300, Math.round(wrap.clientWidth || 640)); SVGH = SVGW < 500 ? 200 : 230; }
  function tipHandlers(wrap) {
    const tip = document.createElement("div"); tip.className = "tip"; wrap.appendChild(tip);
    wrap.querySelectorAll("[data-tip]").forEach((el) => {
      el.addEventListener("pointerenter", (e) => { tip.textContent = el.dataset.tip; tip.style.opacity = 1; move(e); });
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", () => (tip.style.opacity = 0));
    });
    function move(e) { const r = wrap.getBoundingClientRect(); let x = e.clientX - r.left + 10; if (x > r.width - 120) x -= 140; tip.style.left = x + "px"; tip.style.top = (e.clientY - r.top - 34) + "px"; }
  }
  function lineChart(wrap, o) {
    dims(wrap);
    const x0 = parse(o.xMin).getTime(), x1 = parse(o.xMax).getTime();
    const allY = o.series.flatMap((s) => s.pts.map((p) => p[1])).concat(o.targets.flatMap((t) => t.pts.map((p) => p[1])));
    let y0 = o.yMinForce ?? Math.floor(Math.min(...allY) - (o.yPad || 2)), y1 = o.yMaxForce ?? Math.ceil(Math.max(...allY) + (o.yPad || 2));
    if (y0 === y1) { y0 -= 1; y1 += 1; }
    const ticks = niceTicks(y0, y1, 4); y0 = ticks[0]; y1 = ticks[ticks.length - 1];
    const X = (d) => M.l + (parse(d).getTime() - x0) / (x1 - x0) * (SVGW - M.l - M.r);
    const Y = (v) => SVGH - M.b - (v - y0) / (y1 - y0) * (SVGH - M.t - M.b);
    let g = `<g class="grid">${ticks.map((t) => `<line x1="${M.l}" x2="${SVGW - M.r}" y1="${Y(t)}" y2="${Y(t)}"/><text x="${M.l - 6}" y="${Y(t) + 4}" text-anchor="end">${t}</text>`).join("")}</g>`;
    // mois
    const months = []; let d = parse(o.xMin); d.setDate(1); d.setMonth(d.getMonth() + 1);
    while (d.getTime() <= x1) { months.push(iso(d)); d.setMonth(d.getMonth() + 1); }
    g += months.map((m) => `<text x="${X(m)}" y="${SVGH - 8}" text-anchor="middle">${parse(m).toLocaleDateString("fr-FR", { month: "short" })}</text>`).join("");
    g += o.targets.map((t) => `<polyline fill="none" stroke="var(--target)" stroke-width="1.5" stroke-dasharray="5 4" points="${t.pts.map((p) => X(p[0]) + "," + Y(p[1])).join(" ")}"/>`).join("");
    o.series.forEach((s) => {
      if (s.pts.length > 1) g += `<polyline fill="none" stroke="${s.color}" stroke-width="2" stroke-linejoin="round" points="${s.pts.map((p) => X(p[0]) + "," + Y(p[1])).join(" ")}"/>`;
      g += s.pts.map((p) => `<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="4.5" fill="${s.color}" stroke="var(--surface)" stroke-width="2"/><circle cx="${X(p[0])}" cy="${Y(p[1])}" r="12" fill="transparent" data-tip="${fmt(p[0], { day: "numeric", month: "short" })} · ${p[1]} ${s.unit}"/>`).join("");
      const last = s.pts[s.pts.length - 1];
      if (last) g += `<text x="${Math.min(X(last[0]) + 8, SVGW - 40)}" y="${Y(last[1]) - 8}" style="fill:var(--text);font-weight:600">${last[1]} ${s.unit}</text>`;
    });
    if (!o.series.some((s) => s.pts.length)) g += `<text x="${SVGW / 2}" y="${SVGH / 2}" text-anchor="middle">Pas encore de mesure</text>`;
    wrap.innerHTML = `<svg class="chart" viewBox="0 0 ${SVGW} ${SVGH}" role="img">${g}</svg>`;
    tipHandlers(wrap);
  }
  function barChart(wrap, data, unit) {
    dims(wrap);
    const max = Math.max(1, ...data.map((d) => Math.max(d.a, d.b)));
    const ticks = niceTicks(0, max, 4), top = ticks[ticks.length - 1];
    const bw = (SVGW - M.l - M.r) / data.length;
    const Y = (v) => SVGH - M.b - v / top * (SVGH - M.t - M.b);
    let g = `<g class="grid">${ticks.map((t) => `<line x1="${M.l}" x2="${SVGW - M.r}" y1="${Y(t)}" y2="${Y(t)}"/><text x="${M.l - 6}" y="${Y(t) + 4}" text-anchor="end">${t}${unit}</text>`).join("")}</g>`;
    data.forEach((d, i) => {
      const x = M.l + i * bw + bw * 0.18, w = bw * 0.64;
      g += `<rect x="${x}" y="${Y(d.a)}" width="${w}" height="${Math.max(0, Y(0) - Y(d.a))}" rx="4" fill="var(--surface-2)" stroke="var(--border)"/>`;
      if (d.b > 0) g += `<rect x="${x + 3}" y="${Y(d.b)}" width="${w - 6}" height="${Math.max(0, Y(0) - Y(d.b))}" rx="4" fill="var(--series-1)"/>`;
      g += `<rect x="${M.l + i * bw}" y="${M.t}" width="${bw}" height="${SVGH - M.t - M.b}" fill="transparent" data-tip="${d.label} · prévu ${d.a.toFixed(1)} ${unit} · réalisé ${d.b.toFixed(1)} ${unit}"/>`;
      if (bw >= 30 || i % 2 === 0) g += `<text x="${M.l + i * bw + bw / 2}" y="${SVGH - 8}" text-anchor="middle">${d.label}</text>`;
    });
    wrap.innerHTML = `<svg class="chart" viewBox="0 0 ${SVGW} ${SVGH}" role="img">${g}</svg>`;
    tipHandlers(wrap);
  }
  function rpeChart(wrap, data) {
    dims(wrap);
    const bw = (SVGW - M.l - M.r) / data.length, Y = (v) => SVGH - M.b - v / 10 * (SVGH - M.t - M.b);
    let g = `<g class="grid">${[0, 2, 4, 6, 8, 10].map((t) => `<line x1="${M.l}" x2="${SVGW - M.r}" y1="${Y(t)}" y2="${Y(t)}"/><text x="${M.l - 6}" y="${Y(t) + 4}" text-anchor="end">${t}</text>`).join("")}</g>`;
    const pts = data.map((d, i) => d.v != null ? [M.l + i * bw + bw / 2, Y(d.v), d] : null).filter(Boolean);
    if (pts.length > 1) g += `<polyline fill="none" stroke="var(--series-1)" stroke-width="2" points="${pts.map((p) => p[0] + "," + p[1]).join(" ")}"/>`;
    g += pts.map((p) => `<circle cx="${p[0]}" cy="${p[1]}" r="4.5" fill="var(--series-1)" stroke="var(--surface)" stroke-width="2"/><circle cx="${p[0]}" cy="${p[1]}" r="12" fill="transparent" data-tip="${p[2].label} · RPE ${p[2].v.toFixed(1)}"/>`).join("");
    g += data.map((d, i) => (bw >= 30 || i % 2 === 0) ? `<text x="${M.l + i * bw + bw / 2}" y="${SVGH - 8}" text-anchor="middle">${d.label}</text>` : "").join("");
    if (!pts.length) g += `<text x="${SVGW / 2}" y="${SVGH / 2}" text-anchor="middle">Le RPE apparaîtra au fil des saisies</text>`;
    wrap.innerHTML = `<svg class="chart" viewBox="0 0 ${SVGW} ${SVGH}" role="img">${g}</svg>`;
    tipHandlers(wrap);
  }
  function niceTicks(a, b, n) {
    const span = b - a || 1, raw = span / n, mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const step = [1, 2, 2.5, 5, 10].map((x) => x * mag).find((x) => span / x <= n) || mag * 10;
    const out = []; for (let v = Math.floor(a / step) * step; v <= b + 1e-9; v += step) out.push(+v.toFixed(2));
    if (out[out.length - 1] < b) out.push(+(out[out.length - 1] + step).toFixed(2));
    return out;
  }

  /* ---------------- Onglet Document ---------------- */
  function viewDoc(v) {
    v.innerHTML = `<div class="card doc">${docHTML()}</div>
      <div class="btn-row no-print"><button class="btn ghost" onclick="window.print()">Imprimer / PDF</button><a class="btn ghost" href="Plan-T1-2027.pdf" target="_blank" rel="noopener">PDF complet (FTP 288 W)</a><a class="btn ghost" href="PLAN.md" target="_blank" rel="noopener">Version Markdown</a></div>`;
  }
  function docHTML() {
    const m = P.meta;
    let h = `<h1>${esc(m.title)}</h1>
      <p><b>Objectif :</b> ${esc(m.event.name)} (${esc(fmt(S.settings.eventDate, { day: "numeric", month: "long", year: "numeric" }))}) — ${esc(m.event.note)}.<br>
      <b>Cibles juin 2027 :</b> FTP &gt; ${m.ftpGoal} W · poids ${m.weightGoal} kg (départ ${m.weightStart} kg, FTP ${m.ftpDefault} W).<br>
      <b>Référence :</b> ${esc(m.reference2026)}</p>
      <h2>Principes</h2><ul>${P.principles.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
      <h2>Zones de puissance (FTP ${ftp()} W)</h2><table><tr><th>Zone</th><th>%FTP</th><th>Watts</th></tr>
      ${P.zones.map((z) => `<tr><td>${z.z} — ${esc(z.name)}</td><td>${z.pct[0]}–${z.pct[1]} %</td><td>${W(z.pct[0])}–${W(z.pct[1])} W</td></tr>`).join("")}</table>`;
    h += `<section class="blk"><h2>Vue d'ensemble</h2><table><tr><th>Sem.</th><th>Dates</th><th>Type</th><th>Thème</th><th>Vélo</th><th>Total</th></tr>
      ${P.weeks.map((wk) => { let v = 0, t = 0; DAYS.forEach((d) => wk.days[d].forEach((k) => { const w = P.workouts[k]; t += w.dur; if (w.sport === "velo" || w.sport === "test") v += w.dur; }));
        return `<tr><td><b>S${wk.n}</b></td><td>${fmt(dateOf(wk.n, 0), { day: "numeric", month: "short" })} → ${fmt(dateOf(wk.n, 6), { day: "numeric", month: "short" })}</td><td>${{ charge: "Charge", recup: "Allégée", ski: "Ski", test: "Reprise + test" }[wk.type]}</td><td>${esc(wk.theme)}</td><td>${hm(v)}</td><td>${hm(t)}</td></tr>`; }).join("")}</table></section>`;
    P.blocks.forEach((b) => {
      h += `<section class="blk"><h2>${esc(b.name)}</h2><p>${esc(b.focus)}</p><table><tr><th>Sem.</th>${DAYS.map((d) => `<th>${DAY_LABELS[d]}</th>`).join("")}</tr>`;
      b.weeks.forEach((n) => {
        const wk = P.weeks[n - 1];
        h += `<tr><td><b>S${n}</b><br><small>${fmt(dateOf(n, 0), { day: "numeric", month: "short" })}</small><br><small>${esc(wk.theme)}</small></td>${DAYS.map((d) => `<td>${wk.days[d].map((k) => esc(P.workouts[k].title)).join("<br>")}</td>`).join("")}</tr>`;
      });
      h += `</table></section>`;
    });
    h += `<h2 class="lib">Bibliothèque des séances</h2>`;
    const order = ["velo", "test", "natation", "renfo", "eveil"];
    order.forEach((sp) => Object.entries(P.workouts).filter(([, w]) => w.sport === sp).forEach(([, w]) => {
      const bike = sp === "velo" || sp === "test";
      h += `<h3>${esc(w.title)} <small>(${hm(w.dur)})</small></h3><ul>${w.steps.map((s) => `<li>${esc(s.t)}${s.d ? " — " + hm(s.d) : ""}${bike && s.z ? ` — <b>${watts(s.z)}</b> (${s.z[0]}–${s.z[1]} %)` : ""}${s.c ? ` — ${esc(s.c)} rpm` : ""}${s.n ? `<br><small>${esc(s.n)}</small>` : ""}</li>`).join("")}</ul>`;
    }));
    return h;
  }

  /* ---------------- Onglet Réglages / archivage ---------------- */
  function viewSettings(v) {
    const gh = S.settings.gh;
    v.innerHTML = `<div class="card"><h2>Paramètres</h2><div class="form-grid">
        <div><label>FTP actuelle (W)</label><input id="s-ftp" type="number" value="${ftp()}"></div>
        <div><label>Date de l'Ardéchoise</label><input id="s-ev" type="date" value="${S.settings.eventDate}"></div>
        <div style="align-self:end"><button class="btn" id="s-save" style="width:100%">Enregistrer</button></div></div>
        <p class="small">Toutes les cibles en watts du plan se recalculent à partir de la FTP.</p></div>
      <div class="card"><h2>Archivage local</h2>
        <p class="small">Tes saisies sont stockées dans ce navigateur, sur cet appareil. Exporte-les régulièrement, ou active l'archivage GitHub ci-dessous.${S.updated ? ` Dernière modification : ${new Date(S.updated).toLocaleString("fr-FR")}.` : ""}</p>
        <div class="btn-row"><button class="btn ghost" id="x-json">Exporter (JSON)</button><button class="btn ghost" id="x-csv">Exporter le journal (CSV)</button>
        <label class="btn ghost" style="margin:0">Importer (JSON)<input id="x-imp" type="file" accept="application/json,.json" hidden></label></div></div>
      <div class="card"><h2>Archivage GitHub (optionnel)</h2>
        <p class="small">Enregistre ton journal dans le dépôt (<code>${esc(gh.path)}</code>) : historique des versions, et synchronisation entre ton iPhone et ton PC. Il faut un <b>jeton GitHub « fine-grained »</b> limité à ce seul dépôt, avec la permission <i>Contents : Read and write</i>. Le jeton reste uniquement dans ce navigateur.</p>
        <div class="form-grid">
          <div class="full"><label>Dépôt (propriétaire/nom)</label><input id="g-repo" value="${esc(gh.repo)}"></div>
          <div><label>Fichier</label><input id="g-path" value="${esc(gh.path)}"></div>
          <div><label>Branche</label><input id="g-branch" value="${esc(gh.branch)}"></div>
          <div><label>Jeton</label><input id="g-token" type="password" autocomplete="off" value="${esc(gh.token)}" placeholder="github_pat_…"></div>
        </div>
        <div class="btn-row"><button class="btn" id="g-push">Archiver sur GitHub</button><button class="btn ghost" id="g-pull">Restaurer depuis GitHub</button></div>
        <p class="small" id="g-msg"></p></div>
      <div class="card"><h2>Réinitialiser</h2><p class="small">Efface toutes les saisies de cet appareil (pense à exporter avant).</p><button class="btn danger" id="r-all">Tout effacer</button></div>
      <p class="small muted" style="text-align:center">Plan T1-2027 · v1 · données : ${Object.keys(S.log).length} séances, ${S.weights.length} pesées, ${S.tests.length} tests</p>`;

    $("#s-save").addEventListener("click", () => {
      const f = Number($("#s-ftp").value); if (f > 100) S.settings.ftp = f;
      if ($("#s-ev").value) S.settings.eventDate = $("#s-ev").value;
      save(); render(); toast("Paramètres enregistrés");
    });
    $("#x-json").addEventListener("click", () => download(`plan-t1-2027-${today()}.json`, JSON.stringify(exportable(), null, 2), "application/json"));
    $("#x-csv").addEventListener("click", () => download(`journal-t1-2027-${today()}.csv`, toCSV(), "text/csv"));
    $("#x-imp").addEventListener("change", async (e) => {
      const f = e.target.files[0]; if (!f) return;
      try { importData(JSON.parse(await f.text())); toast("Données importées"); render(); } catch (err) { toast("Fichier illisible"); }
    });
    const ghRead = () => { Object.assign(S.settings.gh, { repo: $("#g-repo").value.trim(), path: $("#g-path").value.trim(), branch: $("#g-branch").value.trim() || "main", token: $("#g-token").value.trim() }); save(); };
    $("#g-push").addEventListener("click", async () => { ghRead(); await ghPush(); });
    $("#g-pull").addEventListener("click", async () => { ghRead(); await ghPull(); });
    $("#r-all").addEventListener("click", () => { if (confirm("Effacer toutes les données de cet appareil ?")) { const keep = S.settings; S = seed(blank()); S.settings = keep; save(); render(); } });
  }
  function exportable() { const c = JSON.parse(JSON.stringify(S)); c.settings.gh.token = ""; c.exportedAt = new Date().toISOString(); return c; }
  function importData(d) {
    if (!d || typeof d !== "object" || !d.log) throw new Error("format");
    const token = S.settings.gh.token;
    S.log = Object.assign({}, S.log, d.log);
    const merge = (a, b) => { const m = new Map(a.map((x) => [x.date, x])); (b || []).forEach((x) => m.set(x.date, x)); return [...m.values()]; };
    S.weights = merge(S.weights, d.weights); S.tests = merge(S.tests, d.tests);
    if (d.settings) { S.settings.ftp = d.settings.ftp || S.settings.ftp; S.settings.eventDate = d.settings.eventDate || S.settings.eventDate; }
    S.settings.gh.token = token; save();
  }
  function toCSV() {
    const head = ["date", "semaine", "jour", "seance", "sport", "duree_prevue_min", "statut", "duree_min", "w_moy", "w_np", "fc_moy", "cadence", "volume", "rpe", "ressenti_1a5", "commentaire"];
    const rows = ALL.filter((x) => S.log[lkey(x.date, x.key)]).map((x) => {
      const L = S.log[lkey(x.date, x.key)];
      return [x.date, x.week, x.day, x.wo.title, x.wo.sport, x.wo.dur, L.status, L.dur, L.w, L.np, L.hr, L.cad, L.vol, L.rpe, L.feel, L.note];
    });
    return [head].concat(rows).map((r) => r.map((c) => { const s = c == null ? "" : String(c); return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; }).join(";")).join("\n");
  }
  function download(name, text, type) {
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(["﻿" + text], { type })); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  const b64e = (s) => btoa(unescape(encodeURIComponent(s)));
  const b64d = (s) => decodeURIComponent(escape(atob(s.replace(/\n/g, ""))));
  async function ghApi(method, body) {
    const g = S.settings.gh;
    if (!g.token || !g.repo) throw new Error("Renseigne le dépôt et le jeton");
    const url = `https://api.github.com/repos/${g.repo}/contents/${g.path}` + (method === "GET" ? `?ref=${encodeURIComponent(g.branch)}` : "");
    const r = await fetch(url, { method, headers: { Authorization: `Bearer ${g.token}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" }, body: body ? JSON.stringify(body) : undefined });
    if (r.status === 404 && method === "GET") return null;
    if (!r.ok) throw new Error(`GitHub ${r.status} : ${(await r.json().catch(() => ({}))).message || ""}`);
    return r.json();
  }
  async function ghPush() {
    const msg = $("#g-msg"); msg.textContent = "Archivage en cours…";
    try {
      const cur = await ghApi("GET");
      const content = JSON.stringify(exportable(), null, 2);
      await ghApi("PUT", { message: `Journal T1-2027 — ${new Date().toLocaleString("fr-FR")}`, content: b64e(content), branch: S.settings.gh.branch, sha: cur ? cur.sha : undefined });
      msg.textContent = `✓ Archivé dans ${S.settings.gh.path} (${new Date().toLocaleTimeString("fr-FR")})`; toast("Archivé sur GitHub");
    } catch (e) { msg.textContent = "✕ " + e.message; }
  }
  async function ghPull() {
    const msg = $("#g-msg"); msg.textContent = "Lecture…";
    try {
      const cur = await ghApi("GET"); if (!cur) { msg.textContent = "Aucune archive dans le dépôt pour l'instant."; return; }
      importData(JSON.parse(b64d(cur.content))); msg.textContent = "✓ Archive fusionnée avec les données de cet appareil"; render();
    } catch (e) { msg.textContent = "✕ " + e.message; }
  }

  /* ---------------- Démarrage ---------------- */
  render();
  if ("serviceWorker" in navigator && location.protocol === "https:") navigator.serviceWorker.register("sw.js").catch(() => {});
})();
