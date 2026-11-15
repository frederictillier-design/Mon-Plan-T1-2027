// Génère PLAN.md à partir de plan.js (même source que l'application).
// Usage : node build-doc.js [FTP]   (FTP par défaut : celle de plan.js)
const fs = require("fs");
const P = require("./plan.js");
const FTP = Number(process.argv[2]) || P.meta.ftpDefault;
const DAYS = ["lun", "mar", "mer", "jeu", "ven", "sam", "dim"];
const LBL = { lun: "Lun", mar: "Mar", mer: "Mer", jeu: "Jeu", ven: "Ven", sam: "Sam", dim: "Dim" };
const W = (p) => Math.round(FTP * p / 100);
const watts = (z) => `${W(z[0])}–${W(z[1])} W`;
const hm = (m) => { const h = Math.floor(m / 60), r = m % 60; return h ? `${h}h${r ? String(r).padStart(2, "0") : ""}` : `${r} min`; };
const dateOf = (n, i) => { const d = new Date(P.meta.start + "T12:00:00"); d.setDate(d.getDate() + (n - 1) * 7 + i); return d; };
const fd = (d) => d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
const SP = { velo: "Vélo", test: "Test", natation: "Natation", ppg: "Renfo / PPG", mobilite: "Assouplissement", ski: "Ski", repos: "Repos" };

let md = `# ${P.meta.title}\n\n`;
md += `**Objectif :** ${P.meta.event.name} — ${P.meta.event.note}.  \n`;
md += `**Cibles juin 2027 :** FTP > ${P.meta.ftpGoal} W · poids ${P.meta.weightGoal} kg (départ : ${P.meta.weightStart} kg, FTP ${P.meta.ftpDefault} W, soit ${(P.meta.ftpDefault / P.meta.weightStart).toFixed(2)} → ${(P.meta.ftpGoal / P.meta.weightGoal).toFixed(2)} W/kg).  \n`;
md += `**Période :** 4 janvier → 4 avril 2027 (13 semaines). Test de référence le 19/12/2026.  \n`;
md += `**Référence :** ${P.meta.reference2026}\n\n`;
md += `> Les watts ci-dessous sont calculés sur une FTP de **${FTP} W**. Dans l'application, ils se recalculent automatiquement après chaque test.\n\n`;

md += `## Principes\n\n` + P.principles.map((x) => `- ${x}`).join("\n") + "\n\n";

md += `## Zones de puissance (FTP ${FTP} W)\n\n| Zone | % FTP | Watts |\n|---|---|---|\n`;
md += P.zones.map((z) => `| ${z.z} — ${z.name} | ${z.pct[0]}–${z.pct[1]} % | ${W(z.pct[0])}–${W(z.pct[1])} W |`).join("\n") + "\n\n";

md += `## Vue d'ensemble\n\n| Sem. | Dates | Type | Thème | Vélo | Total |\n|---|---|---|---|---|---|\n`;
P.weeks.forEach((wk) => {
  let v = 0, t = 0;
  DAYS.forEach((d) => wk.days[d].forEach((k) => { const w = P.workouts[k]; t += w.dur; if (w.sport === "velo" || w.sport === "test") v += w.dur; }));
  md += `| S${wk.n} | ${fd(dateOf(wk.n, 0))} → ${fd(dateOf(wk.n, 6))} | ${{ charge: "Charge", recup: "Allégée", ski: "Ski", test: "Reprise + test" }[wk.type]} | ${wk.theme} | ${hm(v)} | ${hm(t)} |\n`;
});
md += "\n";

P.blocks.forEach((b) => {
  md += `## ${b.name}\n\n${b.focus}\n\n| Sem. | ${DAYS.map((d) => LBL[d]).join(" | ")} |\n|---|${DAYS.map(() => "---").join("|")}|\n`;
  b.weeks.forEach((n) => {
    const wk = P.weeks[n - 1];
    md += `| **S${n}** (${fd(dateOf(n, 0))}) | ${DAYS.map((d) => wk.days[d].map((k) => P.workouts[k].title).join(" + ")).join(" | ")} |\n`;
  });
  md += "\n";
});

md += `## Bibliothèque des séances\n\n`;
["velo", "test", "natation", "ppg", "mobilite"].forEach((sp) => {
  md += `### ${SP[sp]}\n\n`;
  Object.entries(P.workouts).filter(([, w]) => w.sport === sp).forEach(([, w]) => {
    const bike = sp === "velo" || sp === "test";
    md += `**${w.title}** — ${hm(w.dur)}${w.outdoor ? " (extérieur si possible)" : ""}\n\n`;
    w.steps.forEach((s) => {
      md += `- ${s.t}${s.d ? " — " + hm(s.d) : ""}${bike && s.z ? ` — **${watts(s.z)}** (${s.z[0]}–${s.z[1]} %)` : ""}${s.c ? ` — ${s.c} rpm` : ""}${s.n ? ` · _${s.n}_` : ""}\n`;
    });
    md += "\n";
  });
});
md += `---\n_Document généré depuis \`plan.js\` (node build-doc.js). Application de suivi : index.html._\n`;
fs.writeFileSync("PLAN.md", md);
console.log("PLAN.md écrit —", md.length, "caractères");
