// Génère pdf/plan-print.html (mise en page du « Plan FTP sept.-déc. 2026 ») à partir de plan.js.
// Usage : node build-pdf.js [FTP]  puis imprimer en PDF avec Chrome (A4, marges par défaut, arrière-plans activés).
const fs = require("fs");
const P = require("./plan.js");
const FTP = Number(process.argv[2]) || P.meta.ftpDefault;
const DAYS = ["lun", "mar", "mer", "jeu", "ven", "sam", "dim"];
const DAYN = { lun: "Lundi", mar: "Mardi", mer: "Mercredi", jeu: "Jeudi", ven: "Vendredi", sam: "Samedi", dim: "Dimanche" };
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const W = (p) => Math.round(FTP * p / 100);
const hm = (m) => { if (!m) return ""; const h = Math.floor(m / 60), r = m % 60; return h ? `${h} h${r ? " " + String(r).padStart(2, "0") : ""}` : `${r} min`; };
const dOf = (n, i) => { const d = new Date(P.meta.start + "T12:00:00"); d.setDate(d.getDate() + (n - 1) * 7 + i); return d; };
const dd = (d, o = { day: "numeric", month: "short" }) => d.toLocaleDateString("fr-FR", o);
const range = (n) => { const a = dOf(n, 0), b = dOf(n, 6); return a.getMonth() === b.getMonth() ? `${a.getDate()} – ${dd(b, { day: "numeric", month: "long" })}` : `${dd(a, { day: "numeric", month: "long" })} – ${dd(b, { day: "numeric", month: "long" })}`; };

const C = { z1: "#a9b9c1", z2: "#4f8068", z3: "#c9a227", ss: "#e07a1f", z4: "#c23b2b", z5: "#6d2442", eveil: "#5b9aa0", renfo: "#3c4850", natation: "#2f6e9c", ski: "#b5739d", repos: "#d3d3cc", test: "#c23b2b" };
const zoneColor = (p) => p < 56 ? C.z1 : p < 76 ? C.z2 : p < 88 ? C.z3 : p < 95 ? C.ss : p < 106 ? C.z4 : C.z5;
const TAG = { velo: "VÉLO", test: "TEST", natation: "NATATION", renfo: "RENFO", eveil: "ÉVEIL", ski: "SKI", repos: "REPOS" };
const TAGC = { velo: "#7d8580", test: C.test, natation: C.natation, renfo: C.renfo, eveil: C.eveil, ski: C.ski, repos: "#b0b0a8" };
const CHARGE = { 1: "COUPURE", 2: "DÉCHARGE", 3: "MODÉRÉE", 4: "FORTE", 5: "TRÈS FORTE" };

/* Profil miniature : largeur = temps, hauteur = intensité */
function profile(wo) {
  const Wd = 120, H = 22;
  if (wo.sport !== "velo" && wo.sport !== "test") {
    if (!wo.dur) return `<svg width="${Wd}" height="${H}"><rect x="0" y="${H - 4}" width="${Wd}" height="3" fill="${C.repos}"/></svg>`;
    return `<svg width="${Wd}" height="${H}"><rect x="0" y="${H - 7}" width="${Wd}" height="6" rx="1" fill="${C[wo.sport] || C.repos}"/></svg>`;
  }
  const total = wo.steps.reduce((a, s) => a + (s.d || 0), 0);
  const hOf = (p) => Math.max(4, Math.min(H, (p / 125) * H));
  let x = 0, g = "";
  const bar = (w, p) => { const h = hOf(p); g += `<rect x="${x.toFixed(2)}" y="${(H - h).toFixed(2)}" width="${Math.max(0.6, w - 0.6).toFixed(2)}" height="${h.toFixed(2)}" fill="${zoneColor(p)}"/>`; x += w; };
  wo.steps.forEach((s) => {
    const w = (s.d / total) * Wd, p = s.z ? (s.z[0] + s.z[1]) / 2 : 50;
    const grp = /^(\d+)\s*×\s*\(/.exec(s.t);
    const m = grp ? [null, grp[1], String((s.d - (+grp[1] - 1) * 5) / +grp[1]), "min"] : /(\d+)\s*×\s*(\d+)\s*(min|s)/.exec(s.t);
    if (m && p >= 76 && +m[1] > 1 && +m[1] <= 12) {
      const n = +m[1], work = +m[2] * (m[3] === "s" ? 1 / 60 : 1), rest = Math.max(0, (s.d - n * work) / Math.max(1, n - 1));
      const k = Wd / total;
      for (let i = 0; i < n; i++) { bar(work * k, p); if (i < n - 1 && rest > 0) bar(rest * k, 52); }
      const used = (n * work + (n - 1) * rest) * k; if (used < w) bar(w - used, 55);
    } else bar(w, p);
  });
  return `<svg width="${Wd}" height="${H}">${g}</svg>`;
}

function summary(wo) {
  if (wo.sport === "velo" || wo.sport === "test") {
    const parts = wo.steps.map((s) => {
      const hot = s.z && s.z[1] >= 76;
      return `${s.t.replace(/^Solo — /, "")}${s.d ? " " + hm(s.d) : ""}${hot ? ` à ${s.z[0]}–${s.z[1]} % (${W(s.z[0])}–${W(s.z[1])} W)` : ""}${hot && s.n ? `, ${s.n.charAt(0).toLowerCase() + s.n.slice(1)}` : ""}`;
    });
    const main = wo.steps.filter((s) => s.z).sort((a, b) => b.z[1] - a.z[1])[0];
    let txt = parts.join(" · ") + ".";
    if (wo.steps.some((s) => /Pol/.test(s.t))) {
      const solo = wo.steps.filter((s) => !/Pol/.test(s.t)), pol = wo.steps.find((s) => /Pol/.test(s.t));
      txt = `<b>Solo ${hm(solo.reduce((a, s) => a + s.d, 0))}</b> : ${solo.map((s) => `${s.t.replace(/^Solo — /, "")} ${hm(s.d)}${s.z && s.z[1] >= 76 ? ` à ${s.z[0]}–${s.z[1]} % (${W(s.z[0])}–${W(s.z[1])} W)` : ""}`).join(" · ")}. <b>Avec Pol ${hm(pol.d)}</b> en bas de Z2, ${pol.z[0]}–${pol.z[1]} % (${W(pol.z[0])}–${W(pol.z[1])} W).`;
    }
    if (main && main.c) txt += ` Cadence ${esc(main.c)} rpm.`;
    return txt;
  }
  return esc(wo.brief || wo.steps.map((s) => s.t).join(" · ") + ".");
}

function squares(n) { return `<span class="sq">${[1, 2, 3, 4, 5].map((i) => `<i class="${i <= n ? "on" : ""}"></i>`).join("")}</span>`; }

/* ---------- Pages ---------- */
const velH = P.weeks.filter((w) => w.type !== "ski" && w.n !== 7).map((w) => DAYS.reduce((a, d) => a + w.days[d].reduce((b, k) => b + ((P.workouts[k].sport === "velo" || P.workouts[k].sport === "test") ? P.workouts[k].dur : 0), 0), 0) / 60);
const vMin = Math.floor(Math.min(...velH)), vMax = Math.round(Math.max(...velH));

let html = "";
// 1. Couverture + cadre
html += `<section class="page cover">
  <div class="kicker">PLAN D'ENTRAÎNEMENT · T1-2027 · OBJECTIF ARDÉCHOISE</div>
  <h1>${P.meta.cover.lines.map((l, i) => `<span class="${i >= P.meta.cover.accentFrom ? "acc" : ""}">${esc(l)}</span>`).join("<br>")}</h1>
  <p class="lead">${esc(P.meta.cover.lead)}</p>
  <div class="stats">
    <div><b>13</b><span>SEMAINES</span></div><div><b>3</b><span>TESTS FTP</span></div><div><b>3</b><span>BLOCS</span></div>
    <div><b>${vMin}–${vMax} h</b><span>VÉLO / SEMAINE</span></div><div><b>3</b><span>ÉVEILS / SEMAINE</span></div><div><b>1</b><span>SEMAINE DE SKI</span></div>
  </div>
  <div class="goals"><div><span class="lbl">FTP</span><b>${P.meta.ftpDefault} → &gt; ${P.meta.ftpGoal} W</b></div><div><span class="lbl">POIDS</span><b>${P.meta.weightStart} → ${P.meta.weightGoal} kg</b></div><div><span class="lbl">W/KG</span><b>${(P.meta.ftpDefault / P.meta.weightStart).toFixed(2)} → ${(P.meta.ftpGoal / P.meta.weightGoal).toFixed(2)}</b></div><div><span class="lbl">OBJECTIF</span><b>Volcanique · juin 2027</b></div></div>
  <h2>Le cadre</h2><p class="sub">Cinq chantiers, une hiérarchie. Quand deux choses entrent en conflit, celle du haut gagne.</p>
  ${P.cadre.map((c, i) => `<div class="cadre c${i + 1}"><span class="num">${i + 1}</span><p><b>${esc(c.t)}</b> — ${esc(c.d)}</p></div>`).join("")}
</section>`;

// 2. Semaine type + plages
html += `<section class="page p2">
  <h2>La semaine type</h2>
  <p class="sub wide">Deux séances de qualité le lundi et le mercredi soir, séparées par un mardi calme. Le renforcement passe le matin, ce qui laisse une douzaine d'heures avant toute séance du soir. Le vrai enjeu n'est pas la journée mais le lendemain : les courbatures du travail lourd culminent entre 24 et 48 heures. C'est pourquoi le renfo A tombe le jeudi, sans vélo, et que ses courbatures sont résorbées pour la sortie longue du dimanche.</p>
  <table class="tt"><thead><tr><th>JOUR</th><th>MATIN</th><th>SOIR</th><th>POURQUOI LÀ</th></tr></thead><tbody>
  ${P.semaineType.map((r) => `<tr><td class="day">${esc(r.j)}</td><td>${esc(r.m)}</td><td>${esc(r.s)}</td><td class="why">${esc(r.why)}</td></tr>`).join("")}</tbody></table>
  <h2>Les plages</h2>
  <p class="sub wide">Toutes les séances sont écrites en pourcentage de FTP. Les watts indiqués sont calculés pour une FTP de <b>${FTP} W</b> : ils se recalent après chaque test (19/12, 27/01, 03/03, 31/03). Les plages cardiaques sont exprimées en pourcentage de la FC seuil, c'est-à-dire la FC moyenne des minutes 5 à 20 du test, et non de la FC max.</p>
  <table class="tt zones"><thead><tr><th>ZONE</th><th>% FTP</th><th>WATTS (${FTP} W)</th><th>% FC SEUIL</th><th>SENSATION</th></tr></thead><tbody>
  ${P.zones.filter((z) => z.z !== "Z6").map((z) => `<tr><td><span class="sw" style="background:${zoneColor(z.pct[0] + 1)}"></span><b>${z.z} · ${esc(z.name)}</b></td><td class="mono">${z.pct[0] === 0 ? "&lt; 55 %" : `${z.pct[0]} – ${z.pct[1]} %`}</td><td class="mono">${z.pct[0] === 0 ? `&lt; ${W(55)} W` : `${W(z.pct[0])} – ${W(z.pct[1])} W`}</td><td class="mono">${esc(z.fc)}</td><td>${esc(z.feel)}</td></tr>`).join("")}</tbody></table>
  <div class="legend">${[["Récupération", C.z1], ["Endurance", C.z2], ["Tempo", C.z3], ["Sweet spot", C.ss], ["Seuil", C.z4], ["VO₂max", C.z5], ["Éveil", C.eveil], ["Renfo", C.renfo], ["Natation", C.natation], ["Ski", C.ski], ["Repos", C.repos]].map(([l, c]) => `<span><i style="background:${c}"></i>${l}</span>`).join("")}</div>
  <p class="sub wide">Chaque séance porte un petit profil : la hauteur des barres représente l'intensité, la largeur représente le temps. Un coup d'œil suffit à voir la forme de la séance avant de la lire.</p>
</section>`;

// 3. Blocs et semaines
P.blocks.forEach((b) => {
  html += `<section class="page">
    <div class="bhead"><span class="letter">${b.letter}</span><div><h2 class="bt">${esc(b.name.toUpperCase())}</h2><div class="mono dim">${esc(b.dates)}</div></div></div>
    <p class="goal">${esc(b.goal)}</p>
    <div class="whybox"><div class="lbl">POURQUOI CE BLOC</div><p>${esc(b.why)}</p></div>
    <h3>Les semaines de ce bloc</h3>
    <table class="tt bw"><thead><tr><th>SEMAINE</th><th>CHARGE</th><th>SÉANCES VÉLO</th><th>VOLUME</th></tr></thead><tbody>
    ${b.weeks.map((n) => { const wk = P.weeks[n - 1]; const bikes = DAYS.flatMap((d) => wk.days[d]).map((k) => P.workouts[k]).filter((w) => w.sport === "velo" || w.sport === "test");
      const v = bikes.reduce((a, w) => a + w.dur, 0);
      return `<tr><td><b class="wn">S${n}</b><div class="mono dim">${range(n)}</div></td><td><div class="cl">${CHARGE[wk.charge]}</div>${squares(wk.charge)}</td><td>${bikes.map((w) => esc(w.title)).join(" · ") || "—"}</td><td class="mono">${hm(v)}</td></tr>`; }).join("")}
    </tbody></table>
  </section>`;
  b.weeks.forEach((n) => {
    const wk = P.weeks[n - 1];
    html += `<section class="page week">
      <div class="runner">${esc(b.name.toUpperCase())}</div>
      <div class="wbar"><div><b>S${n}</b><span class="mono">${range(n)}</span></div><div class="chg">${CHARGE[wk.charge]} ${squares(wk.charge)}</div></div>
      <div class="wdesc">${esc(wk.desc)}</div>
      <table class="days"><tbody>
      ${DAYS.map((d, i) => { const items = wk.days[d].map((k) => P.workouts[k]);
        return items.map((wo, j) => `<tr class="${j === 0 ? "first" : ""}">
          ${j === 0 ? `<td class="dcol" rowspan="${items.length}"><b>${DAYN[d]}</b><div class="mono dim">${dd(dOf(n, i))}</div></td>` : ""}
          <td class="slot mono">${esc((wo.slot || "").toUpperCase())}</td>
          <td class="tagc"><span class="tag" style="border-color:${TAGC[wo.sport]};color:${TAGC[wo.sport]}">${TAG[wo.sport]}</span></td>
          <td class="cont"><div class="st">${esc(wo.title)}</div><div class="sd">${summary(wo)}</div>${wo.tip ? `<div class="tip" style="border-color:${wo.sport === "velo" || wo.sport === "test" ? C.z3 : TAGC[wo.sport]}">${esc(wo.tip)}</div>` : ""}</td>
          <td class="prof">${profile(wo)}<div class="mono dur">${hm(wo.dur) || "—"}</div></td></tr>`).join(""); }).join("")}
      </tbody></table>
    </section>`;
  });
});

// 3b. Bibliothèque hors vélo
html += `<section class="page"><h2>Les séances hors vélo, en détail</h2>
  <p class="sub wide">Les pages semaine résument ; voici le contenu exact des éveils, du renforcement et de la natation.</p>
  ${["eveil", "renfo", "natation"].map((sp) => `<h3>${{ eveil: "Éveils & assouplissement", renfo: "Renforcement", natation: "Natation · jeudi soir" }[sp]}</h3>` +
    Object.entries(P.workouts).filter(([, w]) => w.sport === sp && w.dur >= 15).map(([, w]) => `<div class="libw" style="border-color:${TAGC[sp]}"><div class="sth"><b>${esc(w.title)}</b><span class="mono dim">${hm(w.dur)}</span></div>
      <div class="libs">${w.steps.map((s) => `<span><b>${esc(s.t)}</b>${s.d ? ` <span class="mono dim">${s.d} min</span>` : ""}${s.n ? ` — ${esc(s.n)}` : ""}</span>`).join("")}</div></div>`).join("")).join("")}
</section>`;

// 4. Protocole de test
const T = P.workouts.test_ftp;
html += `<section class="page">
  <div class="kicker">TESTS</div><h2 class="bt">FTP 20 MINUTES</h2>
  <div class="mono dim">Samedi 19 décembre · Mercredi 27 janvier · Mercredi 3 mars · Mercredi 31 mars</div>
  <p class="goal">Déterminer la FTP et la FC seuil, sur lesquelles sont construites toutes les plages du plan. Le protocole est reproduit à l'identique à chaque test : c'est la seule façon d'obtenir une comparaison qui veuille dire quelque chose.</p>
  <div class="two"><div class="box"><div class="lbl">MATÉRIEL ET RÉGLAGES</div><p>Direto X en mode Slope ou Level, jamais ERG. Rouvy en simulation sur une montée régulière, ou parcours plat avec résistance réelle. Ventilateur obligatoire.</p></div>
  <div class="box"><div class="lbl">AVANT DE COMMENCER</div><ul><li>Calibrer le Direto X après 10 minutes de pédalage, jamais à froid.</li><li>Pas d'alcool la veille, nuit normale, aucune séance dure dans les 48 h.</li><li>Repas léger 2 à 3 h avant.</li><li>Choisir le braquet à l'échauffement pour tenir la cible entre 85 et 90 rpm, puis ne plus y toucher.</li></ul></div></div>
  <h3>Le protocole, bloc par bloc</h3>
  <table class="tt proto"><tbody>${T.steps.map((s) => `<tr class="${/TEST/.test(s.t) ? "hl" : ""}"><td class="mono">${hm(s.d)}</td><td><b>${esc(s.t)}</b></td><td class="mono">${s.z[0]}–${s.z[1]} % · ${W(s.z[0])}–${W(s.z[1])} W</td><td>${esc(s.n || "")}${s.c ? ` Cadence ${esc(s.c)} rpm.` : ""}</td></tr>`).join("")}</tbody></table>
  <h3>Stratégie d'exécution</h3>
  <div class="pace"><b>Minutes 0 à 2</b><p>Partir 5 % SOUS la cible. C'est la consigne la plus difficile à respecter et la plus importante : ton biais documenté est de partir trop fort, à l'EDT comme sur la Volcanique.</p></div>
  <div class="pace"><b>Minutes 2 à 10</b><p>Se stabiliser à la cible. La puissance doit être plate : regarder la moyenne glissante de 30 s, pas la valeur instantanée.</p></div>
  <div class="pace"><b>Minutes 10 à 17</b><p>Tenir. Si c'est possible, monter de 2 à 3 %, pas plus.</p></div>
  <div class="pace"><b>Minutes 17 à 20</b><p>Tout donner. C'est le seul moment où l'on accélère franchement.</p></div>
  <p class="sub wide"><b>Résultat :</b> FTP = 95 % de la puissance moyenne des 20 minutes. FC seuil = FC moyenne des minutes 5 à 20. Saisir les deux dans l'application (Suivi → Tests FTP).</p>
</section>`;

// 5. Types de séances
html += `<section class="page">
  <h2>Chaque type de séance, et pourquoi</h2>
  <p class="sub wide">Huit familles de séances composent ce plan. Aucune n'est interchangeable : chacune produit une adaptation différente, sur une échelle de temps différente.</p>
  ${P.sessionTypes.map((s, i) => `<div class="stype" style="border-color:${[C.z2, C.z3, C.ss, C.z4, C.z4, C.z5, C.z3, C.z2][i]}"><div class="sth"><b>${esc(s.t.toUpperCase())}</b><span class="mono dim">${esc(s.z)}</span></div>
    <p><b>Format.</b> ${esc(s.format)}</p><p><b>À quoi ça sert.</b> ${esc(s.why)}</p><p><b>Le point de vigilance.</b> ${esc(s.watch)}</p></div>`).join("")}
</section>`;

// 6. Combinaison, règles, à caler
html += `<section class="page">
  <h2>Comment elles se combinent</h2>
  <p class="sub wide">Cinq principes gouvernent l'assemblage. Ils expliquent la semaine type et l'ordre des trois blocs.</p>
  ${P.combine.map((c) => `<div class="rule"><b>${esc(c.t)}</b> — ${esc(c.d)}</div>`).join("")}
  <h2>Les six règles du trimestre</h2>
  ${P.rules.map((c) => `<div class="rule"><b>${esc(c.t)}</b> — ${esc(c.d)}</div>`).join("")}
  <h2>Ce qui reste à caler</h2>
  ${P.aCaler.map((c) => `<div class="rule"><b>${esc(c.t)}</b> — ${esc(c.d)}</div>`).join("")}
  <div class="endnote mono">Plan T1-2027 · 4 janvier – 4 avril 2027 · version de l'application : https://frederictillier-design.github.io/Mon-Plan-T1-2027/</div>
</section>`;

const css = `
@font-face{font-family:"Barlow Condensed";font-weight:500;src:url(fonts/barlow-condensed-latin-500-normal.woff2)}
@font-face{font-family:"Barlow Condensed";font-weight:600;src:url(fonts/barlow-condensed-latin-600-normal.woff2)}
@font-face{font-family:"Barlow Condensed";font-weight:700;src:url(fonts/barlow-condensed-latin-700-normal.woff2)}
@font-face{font-family:"IBM Plex Sans";font-weight:400;src:url(fonts/ibm-plex-sans-latin-400-normal.woff2)}
@font-face{font-family:"IBM Plex Sans";font-weight:400;font-style:italic;src:url(fonts/ibm-plex-sans-latin-400-italic.woff2)}
@font-face{font-family:"IBM Plex Sans";font-weight:500;src:url(fonts/ibm-plex-sans-latin-500-normal.woff2)}
@font-face{font-family:"IBM Plex Sans";font-weight:600;src:url(fonts/ibm-plex-sans-latin-600-normal.woff2)}
@font-face{font-family:"IBM Plex Mono";font-weight:400;src:url(fonts/ibm-plex-mono-latin-400-normal.woff2)}
@font-face{font-family:"IBM Plex Mono";font-weight:500;src:url(fonts/ibm-plex-mono-latin-500-normal.woff2)}
@page{size:A4;margin:13mm 12mm 15mm}
*{box-sizing:border-box}
body{margin:0;font:400 8.6pt/1.45 "IBM Plex Sans",sans-serif;color:#1d2421;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{break-after:page;page-break-after:always}
.page:last-child{break-after:auto}
h1,h2,h3,.bt,.wbar b,.st,.day,.cl,.chg,.sth b,.stats b,.goals b,.wn,.dcol b{font-family:"Barlow Condensed",sans-serif;font-weight:700;letter-spacing:.01em}
.mono,.kicker,.lbl,.stats span,.goals .lbl,.slot,.tag,.dur,.tt th{font-family:"IBM Plex Mono",monospace}
.dim{color:#8b918d;font-size:7.4pt}
.kicker{font-size:7pt;letter-spacing:.22em;color:#8b918d;margin-bottom:10mm}
.cover h1{font-size:50pt;line-height:.93;margin:0 0 5mm;text-transform:uppercase;color:#1d2421}
.cover h1 .acc{color:#e07a1f}
.lead{font-size:10.5pt;max-width:150mm;margin:0 0 7mm}
.stats{display:flex;gap:4mm;margin-bottom:5mm}
.stats div{border-left:2px solid #1d2421;padding:0 0 0 3mm;min-width:22mm}
.stats div:nth-child(2){border-color:#e07a1f}.stats div:nth-child(3){border-color:#4f8068}.stats div:nth-child(4){border-color:#2f6e9c}.stats div:nth-child(5){border-color:#5b9aa0}.stats div:nth-child(6){border-color:#b5739d}
.stats b{display:block;font-size:17pt;line-height:1}.stats span{font-size:6.2pt;letter-spacing:.14em;color:#8b918d}
.goals{display:grid;grid-template-columns:repeat(4,1fr);border-top:2px solid #1d2421;border-bottom:1px solid #d8d8d2;padding:3mm 0;margin-bottom:7mm}
.goals .lbl{display:block;font-size:6.4pt;letter-spacing:.16em;color:#8b918d}.goals b{font-size:12.5pt}
h2{font-size:15pt;text-transform:uppercase;margin:6mm 0 1.5mm}
.cover h2{margin-top:0}
h3{font-size:11pt;text-transform:uppercase;margin:6mm 0 2mm}
.sub{color:#2c3330;margin:0 0 3.5mm;max-width:150mm}.sub.wide{max-width:none}
.cadre{display:flex;gap:4mm;align-items:center;border:1px solid #e1e1db;border-left:3px solid #1d2421;padding:2.4mm 4mm;margin-bottom:2mm;background:#fbfbf8}
.cadre .num{font-family:"Barlow Condensed";font-weight:700;font-size:13pt;width:5mm}
.cadre p{margin:0}.c2{border-left-color:#4f8068}.c3{border-left-color:#3c4850}.c4{border-left-color:#c9a227}.c5{border-left-color:#2f6e9c}
.tt{width:100%;border-collapse:collapse;border:1px solid #e1e1db;margin-bottom:3mm}
.tt th{font-size:6.4pt;letter-spacing:.16em;color:#8b918d;font-weight:400;text-align:left;padding:2mm 2.5mm;border-bottom:1px solid #d8d8d2;background:#f6f6f2}
.tt td{padding:1.7mm 2.5mm;border-bottom:1px solid #ecece6;vertical-align:top;background:#fbfbf8}
.tt td.day{font-size:10pt;width:22mm}.tt td.why{color:#2c3330;width:95mm}
.zones td{vertical-align:middle}.zones td:first-child{white-space:nowrap;width:40mm}.zones td.mono{white-space:nowrap}.sw{display:inline-block;width:3mm;height:3mm;margin-right:2mm;vertical-align:-1px}
.legend{display:flex;flex-wrap:wrap;gap:2.5mm 4.5mm;margin:3mm 0;font-size:7.2pt;color:#555}
.legend i{display:inline-block;width:3mm;height:3mm;margin-right:1.2mm;vertical-align:-1px}
.bhead{display:flex;gap:4mm;align-items:flex-start;border-top:2px solid #1d2421;padding-top:4mm;margin-top:2mm}
.letter{font-family:"Barlow Condensed";font-weight:700;font-size:34pt;line-height:.8;color:#e07a1f}
.bt{font-size:18pt;text-transform:uppercase;margin:0}
.goal{font-size:10pt;margin:3mm 0 5mm 0}
.whybox{background:#e9ece6;border-left:3px solid #4f8068;padding:3.5mm 5mm;margin-bottom:6mm}
.whybox .lbl,.box .lbl{font-size:6.4pt;letter-spacing:.18em;color:#6f7a73;margin-bottom:1.5mm}
.whybox p{margin:0;font-size:9pt}
.wn{font-size:12pt}.cl{font-size:9.5pt;letter-spacing:.06em}
.sq{display:inline-flex;gap:.8mm;vertical-align:middle}.sq i{width:2.3mm;height:2.3mm;background:#cfcfc8;display:inline-block}.sq i.on{background:#e07a1f}
.runner{font-family:"Barlow Condensed";font-weight:500;font-size:10pt;letter-spacing:.18em;color:#8b918d;border-bottom:1px solid #d8d8d2;padding-bottom:1.5mm;margin-bottom:3mm}
.wbar{display:flex;justify-content:space-between;align-items:center;background:#1d2421;color:#fff;padding:2.5mm 4mm}
.wbar b{font-size:17pt;margin-right:3mm}.wbar .mono{color:#a9b0ac;font-size:8pt}
.wbar .chg{font-size:10pt;letter-spacing:.08em}.wbar .sq i{background:#56605b}.wbar .sq i.on{background:#e07a1f}
.wdesc{background:#f3f3ef;padding:2.3mm 4mm;font-size:8.2pt;border-bottom:1px solid #e1e1db}
.days{width:100%;border-collapse:collapse}
.days td{padding:1.7mm 2mm;vertical-align:top;border-bottom:1px solid #ecece6}
.days tr.first td{border-top:1px solid #dcdcd5}
.dcol{width:25mm;background:#f6f6f2;border-right:1px solid #e1e1db}.dcol b{font-size:10pt;display:block}
.slot{width:12mm;font-size:6.4pt;letter-spacing:.14em;color:#9aa09c;padding-top:3mm!important}
.tagc{width:20mm;padding-top:2.4mm!important}.tag{display:inline-block;border:1px solid;font-size:6.2pt;letter-spacing:.12em;padding:.8mm 1.6mm;background:#fff}
.cont .st{font-size:10pt;line-height:1.15;margin-bottom:.6mm}.cont .sd{font-size:7.6pt;line-height:1.38;color:#2c3330}
.tip{font-style:italic;font-size:7.6pt;color:#4a514d;border-left:2px solid;padding:.6mm 0 .6mm 2.5mm;margin-top:1.4mm}
.prof{width:35mm;text-align:left}.prof svg{display:block}.dur{font-size:7.4pt;color:#5d6460;margin-top:1mm}
.days tr{break-inside:avoid}
.two{display:grid;grid-template-columns:1fr 1fr;gap:4mm;margin:4mm 0}
.box{border:1px solid #e1e1db;background:#fbfbf8;padding:3mm 4mm}.box p{margin:0}.box ul{margin:0;padding-left:4mm}
.proto td{vertical-align:middle;padding:1.4mm 2.5mm}.proto td.mono{white-space:nowrap}.proto tr.hl td{background:#fbe9de}
.pace{border-left:3px solid #e07a1f;background:#fbfbf8;padding:1.4mm 4mm;margin-bottom:1.5mm}.pace p{margin:.5mm 0 0}
.stype{font-size:8pt;border:1px solid #e1e1db;border-left:3px solid;padding:1.9mm 4mm;margin-bottom:2mm;break-inside:avoid;background:#fbfbf8}
.sth{display:flex;justify-content:space-between;margin-bottom:1mm}.sth b{font-size:11pt}
.stype p{margin:.3mm 0}
.rule{border-left:3px solid #c23b2b;padding:1.6mm 0 1.6mm 4mm;margin-bottom:2mm}
.libw{border-left:3px solid;background:#fbfbf8;border-top:1px solid #ecece6;padding:1.8mm 3.5mm;margin-bottom:1.6mm;break-inside:avoid}.libw .sth b{font-size:9.5pt}.libs{display:flex;flex-direction:column;font-size:7.5pt;line-height:1.35}
.p2{font-size:8.1pt}.p2 .tt td{padding:1.3mm 2.5mm}.p2 h2{margin-top:4mm}.p2 .sub{margin-bottom:2.5mm}
.endnote{margin-top:10mm;font-size:6.8pt;color:#8b918d;border-top:1px solid #d8d8d2;padding-top:2mm}
`;
fs.mkdirSync("pdf", { recursive: true });
fs.writeFileSync("pdf/plan-print.html", `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><title>Plan d'entraînement T1-2027 — 4 janvier au 4 avril 2027</title><style>${css}</style></head><body>${html}</body></html>`);
console.log("pdf/plan-print.html écrit (FTP " + FTP + " W)");
