/* Plan d'entraînement T1-2027 — Frédéric Tillier
   Source unique du plan : utilisée par l'application (index.html) et par build-doc.js (PLAN.md).
   Les cibles de puissance sont exprimées en % de FTP : l'app les convertit en watts
   avec la FTP réglée dans « Réglages » (288 W par défaut, à mettre à jour après le test du 19/12/2026). */

const PLAN = {
  meta: {
    title: "Plan d'entraînement T1-2027",
    athlete: "Frédéric",
    start: "2027-01-04",
    end: "2027-04-04",
    ftpDefault: 288,
    ftpGoal: 300,
    weightStart: 90,
    weightGoal: 85,
    event: { name: "L'Ardéchoise — La Volcanique", date: "2027-06-19", note: "185 km · 3 300 m D+ · Saint-Félicien (date à confirmer)" },
    baselineTest: "2026-12-19",
    reference2026: "Volcanique 2026 : 10h55 au total, 9h20 en mouvement, 168 W moyens, −14 % de puissance en 2e moitié, 1h35 d'arrêts."
  },

  principles: [
    "Lundi et mercredi : séances de qualité sur home trainer (Rouvy), 1h30 maximum.",
    "Jeudi : piscine 1h30 (technique crawl, battement de jambes, endurance).",
    "Dimanche : sortie longue (extérieur si possible, sinon home trainer en version raccourcie). Un samedi par mois : sortie Z2 en plus, pour enchaîner deux jours de vélo.",
    "Mardi : renforcement et PPG (vélo + natation), 45 min. Vendredi : assouplissement et mobilité, 30 min.",
    "Cycles de 3 semaines de charge + 1 semaine allégée. La semaine de ski (20-27 février) remplace la semaine de récupération vélo du bloc 2.",
    "Tests FTP : 19/12 (point de départ), 27/01, 03/03 et 31/03. Après chaque test, mettre à jour la FTP dans Réglages : toutes les cibles en watts se recalculent.",
    "Cadence : viser 85-95 rpm en intérieur et au moins 75 rpm en montée. Une cadence sous 60 rpm doit alerter (leçon de l'EDT 2026).",
    "Poids : déficit modéré (~300-400 kcal/j) les jours faciles, pas de déficit les jours de qualité et de sortie longue, protéines ~1,6-2 g/kg. Objectif −0,7 kg/mois."
  ],

  zones: [
    { z: "Z1", name: "Récupération", pct: [0, 55] },
    { z: "Z2", name: "Endurance", pct: [56, 75] },
    { z: "Z3", name: "Tempo", pct: [76, 87] },
    { z: "SS", name: "Sweet spot", pct: [88, 94] },
    { z: "Z4", name: "Seuil", pct: [95, 105] },
    { z: "Z5", name: "VO2max", pct: [106, 120] },
    { z: "Z6", name: "Anaérobie", pct: [121, 150] }
  ],

  blocks: [
    { id: 1, name: "Bloc 1 — Base & sweet spot", weeks: [1, 2, 3, 4], focus: "Volume aérobie, sweet spot, force-vélocité, renforcement en endurance de force (3 × 12)." },
    { id: 2, name: "Bloc 2 — Seuil & VO2max", weeks: [5, 6, 7, 8], focus: "Seuil et VO2max (le levier pour dépasser 300 W), renforcement en force (4 × 6). Semaine de ski en récupération active." },
    { id: 3, name: "Bloc 3 — Spécifique montée", weeks: [9, 10, 11, 12, 13], focus: "Seuil long, over-unders, résistance à la fatigue en fin de sortie longue, cadence en montée. Renforcement en force explosive / maintien." }
  ],

  workouts: {
    /* ---------- VÉLO — HOME TRAINER (≤ 1h30) ---------- */
    ss_3x12: { sport: "velo", title: "Sweet spot 3 × 12 min", dur: 75, tss: 70,
      steps: [
        { t: "Échauffement progressif", d: 15, z: [50, 70], c: "85-95", n: "3 accélérations de 10 s à 110 rpm" },
        { t: "3 × 12 min sweet spot", d: 46, z: [88, 92], c: "85-95", n: "Récup 5 min à 55 % entre les blocs" },
        { t: "Z2 + retour au calme", d: 14, z: [50, 65], c: "90" } ] },
    ss_3x15: { sport: "velo", title: "Sweet spot 3 × 15 min", dur: 85, tss: 80,
      steps: [
        { t: "Échauffement progressif", d: 15, z: [50, 70], c: "85-95", n: "3 accélérations de 10 s" },
        { t: "3 × 15 min sweet spot", d: 55, z: [88, 93], c: "85-95", n: "Récup 5 min à 55 %" },
        { t: "Retour au calme", d: 15, z: [50, 60], c: "90" } ] },
    ss_2x20: { sport: "velo", title: "Sweet spot 2 × 20 min", dur: 80, tss: 78,
      steps: [
        { t: "Échauffement progressif", d: 15, z: [50, 70], c: "85-95", n: "2 × 1 min à 100 %" },
        { t: "2 × 20 min sweet spot", d: 46, z: [88, 94], c: "85-95", n: "Récup 6 min à 55 %" },
        { t: "Z2 + retour au calme", d: 19, z: [55, 68], c: "90" } ] },
    th_4x8: { sport: "velo", title: "Seuil 4 × 8 min", dur: 75, tss: 78,
      steps: [
        { t: "Échauffement progressif", d: 15, z: [50, 75], c: "85-95", n: "3 accélérations de 10 s" },
        { t: "4 × 8 min au seuil", d: 44, z: [96, 102], c: "88-95", n: "Récup 4 min à 55 %" },
        { t: "Retour au calme", d: 16, z: [50, 60], c: "90" } ] },
    th_3x12: { sport: "velo", title: "Seuil 3 × 12 min", dur: 80, tss: 85,
      steps: [
        { t: "Échauffement progressif", d: 15, z: [50, 75], c: "85-95", n: "2 × 1 min à 105 %" },
        { t: "3 × 12 min au seuil", d: 48, z: [95, 100], c: "88-95", n: "Récup 6 min à 55 %" },
        { t: "Retour au calme", d: 17, z: [50, 60], c: "90" } ] },
    th_2x20: { sport: "velo", title: "Seuil continu 2 × 20 min", dur: 85, tss: 92,
      steps: [
        { t: "Échauffement progressif", d: 15, z: [50, 75], c: "85-95", n: "2 × 1 min à 105 %" },
        { t: "2 × 20 min au seuil", d: 48, z: [95, 100], c: "85-92", n: "Récup 8 min à 55 %. Position de grimpeur, buste stable" },
        { t: "Z2 + retour au calme", d: 22, z: [50, 65], c: "90" } ] },
    ou_3x12: { sport: "velo", title: "Over-unders 3 × 12 min", dur: 80, tss: 88,
      steps: [
        { t: "Échauffement progressif", d: 15, z: [50, 75], c: "85-95", n: "3 accélérations de 10 s" },
        { t: "3 × 12 min : (2 min à 95 % + 1 min à 105 %) × 4", d: 48, z: [95, 105], c: "85-95", n: "Récup 6 min à 55 %. Simule les relances en col" },
        { t: "Retour au calme", d: 17, z: [50, 60], c: "90" } ] },
    vo2_3030: { sport: "velo", title: "VO2max 30/30 — 2 × 10", dur: 70, tss: 65,
      steps: [
        { t: "Échauffement progressif", d: 15, z: [50, 75], c: "85-95", n: "3 accélérations de 10 s" },
        { t: "2 × (10 × 30 s à 120 % / 30 s à 50 %)", d: 25, z: [118, 125], c: "95-105", n: "5 min de récup entre les 2 séries" },
        { t: "Z2", d: 20, z: [60, 70], c: "90" },
        { t: "Retour au calme", d: 10, z: [45, 55], c: "90" } ] },
    vo2_5x3: { sport: "velo", title: "VO2max 5 × 3 min", dur: 70, tss: 70,
      steps: [
        { t: "Échauffement progressif", d: 15, z: [50, 75], c: "85-95", n: "2 × 1 min à 105 %" },
        { t: "5 × 3 min VO2max", d: 30, z: [110, 115], c: "95-105", n: "Récup 3 min à 50 %" },
        { t: "Z2", d: 15, z: [60, 70], c: "90" },
        { t: "Retour au calme", d: 10, z: [45, 55], c: "90" } ] },
    vo2_5x4: { sport: "velo", title: "VO2max 5 × 4 min", dur: 75, tss: 78,
      steps: [
        { t: "Échauffement progressif", d: 15, z: [50, 75], c: "85-95", n: "2 × 1 min à 105 %" },
        { t: "5 × 4 min VO2max", d: 40, z: [108, 115], c: "95-105", n: "Récup 4 min à 50 %" },
        { t: "Z2 + retour au calme", d: 20, z: [50, 65], c: "90" } ] },
    vo2_6x4: { sport: "velo", title: "VO2max 6 × 4 min", dur: 85, tss: 88,
      steps: [
        { t: "Échauffement progressif", d: 15, z: [50, 75], c: "85-95", n: "2 × 1 min à 105 %" },
        { t: "6 × 4 min VO2max", d: 48, z: [108, 115], c: "95-105", n: "Récup 4 min à 50 %" },
        { t: "Z2 + retour au calme", d: 22, z: [50, 65], c: "90" } ] },
    force_cad: { sport: "velo", title: "Force-vélocité", dur: 85, tss: 72,
      steps: [
        { t: "Échauffement progressif", d: 15, z: [50, 70], c: "85-95" },
        { t: "5 × 5 min force à 55-60 rpm", d: 37, z: [80, 85], c: "55-60", n: "Récup 3 min à 55 %. Buste immobile, pas de déhanchement" },
        { t: "4 × 3 min tempo à 100 rpm", d: 20, z: [76, 82], c: "100", n: "Récup 2 min. Bassin stable à haute cadence" },
        { t: "Retour au calme", d: 13, z: [50, 60], c: "90" } ] },
    force_cad2: { sport: "velo", title: "Force-endurance en montée + vélocité", dur: 85, tss: 85,
      steps: [
        { t: "Échauffement progressif", d: 15, z: [50, 70], c: "85-95" },
        { t: "4 × 8 min à 88-92 % à 65-70 rpm", d: 44, z: [88, 92], c: "65-70", n: "Récup 4 min. Cadence type « Rouvey » mais tenue au-dessus de 65" },
        { t: "6 × 1 min à 110 rpm", d: 12, z: [70, 80], c: "110", n: "Récup 1 min" },
        { t: "Retour au calme", d: 14, z: [50, 60], c: "90" } ] },
    z2_cad: { sport: "velo", title: "Endurance + vélocité", dur: 75, tss: 50,
      steps: [
        { t: "Z2 continu", d: 60, z: [60, 72], c: "88-95", n: "6 × 1 min à 110 rpm, une toutes les 8 min" },
        { t: "Retour au calme", d: 15, z: [45, 55], c: "90" } ] },
    z2_easy: { sport: "velo", title: "Récupération active", dur: 60, tss: 35,
      steps: [ { t: "Z1-Z2 souple", d: 60, z: [50, 65], c: "90-95", n: "Aucune intensité" } ] },
    test_ftp: { sport: "test", title: "Test FTP 20 min (Rouvy)", dur: 65, tss: 70,
      steps: [
        { t: "Échauffement", d: 20, z: [50, 75], c: "90", n: "Inclure 3 × 1 min à 105 % et 1 effort de 5 min à 100 %" },
        { t: "Récup", d: 8, z: [45, 55], c: "90" },
        { t: "20 min à fond, effort régulier", d: 20, z: [100, 110], c: "85-95", n: "Partir prudemment les 5 premières min. FTP = 95 % de la moyenne" },
        { t: "Retour au calme", d: 17, z: [45, 55], c: "90" } ] },

    /* ---------- VÉLO — WEEK-END ---------- */
    sat_z2: { sport: "velo", title: "Samedi : sortie Z2 2 h (doublé)", dur: 120, tss: 90, outdoor: true,
      steps: [ { t: "Z2 régulier", d: 120, z: [60, 72], c: "85-95", n: "La veille de la sortie longue : apprendre à enchaîner. Home trainer : 1h30" } ] },
    long_2h_easy: { sport: "velo", title: "Sortie souple 2 h", dur: 120, tss: 75, outdoor: true,
      steps: [ { t: "Z1-Z2", d: 120, z: [55, 70], c: "85-95", n: "Semaine allégée : aucune intensité" } ] },
    long_2h30: { sport: "velo", title: "Sortie longue 2h30 Z2", dur: 150, tss: 105, outdoor: true,
      steps: [ { t: "Z2 régulier", d: 150, z: [60, 72], c: "85-95", n: "Home trainer si météo : 2 h Z2" } ] },
    long_3h_tempo: { sport: "velo", title: "Sortie longue 3 h avec tempo", dur: 180, tss: 150, outdoor: true,
      steps: [
        { t: "Z2", d: 60, z: [60, 72], c: "85-95" },
        { t: "2 × 20 min tempo", d: 50, z: [78, 85], c: "80-90", n: "10 min Z2 entre les blocs. En côte si possible" },
        { t: "Z2", d: 70, z: [60, 72], c: "85-95" } ] },
    long_3h30_tempo: { sport: "velo", title: "Sortie longue 3h30 avec tempo", dur: 210, tss: 175, outdoor: true,
      steps: [
        { t: "Z2", d: 60, z: [60, 72], c: "85-95" },
        { t: "3 × 20 min tempo", d: 70, z: [78, 85], c: "80-90", n: "5 min Z2 entre les blocs" },
        { t: "Z2", d: 80, z: [60, 72], c: "85-95", n: "S'alimenter toutes les 30 min, boire 500-750 ml/h" } ] },
    long_4h_tempo: { sport: "velo", title: "Sortie longue 4 h avec tempo", dur: 240, tss: 200, outdoor: true,
      steps: [
        { t: "Z2", d: 75, z: [60, 72], c: "85-95" },
        { t: "3 × 20 min tempo", d: 70, z: [78, 87], c: "80-90", n: "Montées des Monts d'Or si possible, cadence ≥ 75" },
        { t: "Z2", d: 95, z: [60, 72], c: "85-95" } ] },
    long_3h_reprise: { sport: "velo", title: "Sortie longue 3 h — reprise post-ski", dur: 180, tss: 140, outdoor: true,
      steps: [
        { t: "Z2", d: 140, z: [60, 72], c: "85-95" },
        { t: "2 × 10 min tempo", d: 25, z: [78, 85], c: "85-90" },
        { t: "Z2 souple", d: 15, z: [55, 65], c: "90" } ] },
    long_4h_fr: { sport: "velo", title: "Sortie longue 4 h — résistance à la fatigue", dur: 240, tss: 220, outdoor: true,
      steps: [
        { t: "Z2 avec montées à cadence ≥ 75", d: 150, z: [60, 75], c: "≥ 75 en montée", n: "Plafond 80 % de FTP en côte : on apprend le départ « Volcanique »" },
        { t: "Dernière heure : 3 × 10 min sweet spot", d: 45, z: [88, 92], c: "≥ 75", n: "Simule Saint-Agrève / Rochepaule / Rouvey" },
        { t: "Z2 retour", d: 45, z: [55, 70], c: "85-95" } ] },
    long_4h30_fr: { sport: "velo", title: "Sortie longue 4h30 — résistance à la fatigue", dur: 270, tss: 250, outdoor: true,
      steps: [
        { t: "Z2 avec montées à cadence ≥ 75", d: 170, z: [60, 75], c: "≥ 75 en montée" },
        { t: "Dernière heure : 2 × 15 min seuil bas", d: 45, z: [90, 95], c: "≥ 75", n: "Sans s'arrêter : objectif zéro arrêt subi" },
        { t: "Z2 retour", d: 55, z: [55, 70], c: "85-95" } ] },
    long_5h_fr: { sport: "velo", title: "Sortie longue 5 h — répétition Volcanique", dur: 300, tss: 280, outdoor: true,
      steps: [
        { t: "Z2 avec gros dénivelé (≥ 1 500 m D+)", d: 200, z: [60, 78], c: "≥ 75 en montée", n: "Tester la stratégie de ravitaillement : 60-80 g de glucides/h, sodium 500-700 mg/h" },
        { t: "Dernier col : 20-30 min à 88-92 %", d: 30, z: [88, 92], c: "≥ 75" },
        { t: "Z2 retour", d: 70, z: [55, 70], c: "85-95" } ] },

    /* ---------- NATATION (jeudi 1h30) ---------- */
    nat_tech: { sport: "natation", title: "Natation — technique & battement", dur: 90,
      steps: [
        { t: "Échauffement 400 m", d: 12, n: "200 m crawl souple + 4 × 50 m jambes avec palmes" },
        { t: "Éducatifs 8 × 50 m", d: 15, n: "Rattrapé, 3 temps, poing fermé, sculling. Récup 20 s" },
        { t: "Battement 8 × 50 m jambes", d: 18, n: "Planche, palmes courtes : battement depuis la hanche, chevilles souples, petite amplitude" },
        { t: "6 × 100 m crawl avec palmes", d: 20, n: "Focus : jambes continues, 6 battements par cycle de bras. Récup 20 s" },
        { t: "4 × 100 m crawl sans palmes", d: 15, n: "Garder les sensations de jambes" },
        { t: "Retour au calme 200 m", d: 10, n: "Dos / brasse souple" } ] },
    nat_end: { sport: "natation", title: "Natation — endurance crawl", dur: 90,
      steps: [
        { t: "Échauffement 400 m", d: 12, n: "Crawl souple + 4 × 25 m éducatifs" },
        { t: "Jambes 6 × 50 m (palmes)", d: 12, n: "Récup 15 s" },
        { t: "Série principale 4 × 200 m crawl", d: 30, n: "Allure régulière, récup 30 s. Palmes autorisées sur le 4e" },
        { t: "2 × 300 m pull-buoy", d: 18, n: "Travail des bras et de la glisse" },
        { t: "8 × 25 m jambes sans palmes", d: 10 },
        { t: "Retour au calme 200 m", d: 8 } ] },
    nat_allure: { sport: "natation", title: "Natation — allure & seuil", dur: 90,
      steps: [
        { t: "Échauffement 400 m", d: 12, n: "Crawl + jambes avec palmes" },
        { t: "Éducatifs 6 × 50 m", d: 10 },
        { t: "10 × 100 m crawl allure soutenue", d: 30, n: "Récup 20 s. Viser des temps réguliers (noter le meilleur et le moins bon)" },
        { t: "6 × 50 m jambes (palmes)", d: 12 },
        { t: "400 m continu crawl", d: 14, n: "Sans palmes, rythme confortable" },
        { t: "Retour au calme 200 m + étirements", d: 12 } ] },
    nat_souple: { sport: "natation", title: "Natation — semaine allégée", dur: 75,
      steps: [
        { t: "Nage libre souple", d: 30, n: "Alterner crawl, dos, brasse" },
        { t: "Éducatifs + jambes avec palmes", d: 30, n: "Rien d'intense, uniquement la qualité du geste" },
        { t: "Retour au calme", d: 15 } ] },

    /* ---------- RENFORCEMENT / PPG (mardi) ---------- */
    ppg_A: { sport: "ppg", title: "PPG — endurance de force (3 × 12)", dur: 45,
      steps: [
        { t: "Activation", d: 6, n: "Corde à sauter ou vélo souple + mobilité hanches/épaules" },
        { t: "Bas du corps 3 × 12", d: 18, n: "Squat gobelet · Fentes arrière · Hip thrust · Mollets sur une jambe" },
        { t: "Gainage lombo-pelvien 3 tours", d: 12, n: "Dead bug 10 · Bird dog 10/côté · Planche latérale 30 s/côté · Pallof press 10/côté" },
        { t: "Haut du corps (natation) 2 × 12", d: 9, n: "Tirage élastique · Pompes · Rotation externe d'épaule à l'élastique · Y-T-W" } ] },
    ppg_B: { sport: "ppg", title: "PPG — force (4 × 6)", dur: 45,
      steps: [
        { t: "Activation", d: 6, n: "Mobilité + 2 séries légères" },
        { t: "Force 4 × 6 (charge lourde, récup 2 min)", d: 20, n: "Squat ou soulevé de terre jambes tendues · Fentes bulgares · Step-up chargé" },
        { t: "Gainage anti-rotation 3 tours", d: 11, n: "Pallof press · Planche latérale avec élévation de jambe · Pont fessier unilatéral 10/côté" },
        { t: "Haut du corps (natation) 2 × 10", d: 8, n: "Tirage élastique · Rotation externe · Gainage des épaules (planche + touchers d'épaule)" } ] },
    ppg_C: { sport: "ppg", title: "PPG — force explosive & maintien", dur: 45,
      steps: [
        { t: "Activation", d: 6 },
        { t: "Force 3 × 5 + pliométrie 3 × 6", d: 20, n: "Squat lourd 3 × 5 en contraste avec 6 squats sautés · Fentes bulgares 3 × 6 · Step-up explosif" },
        { t: "Gainage 3 tours", d: 11, n: "Dead bug · Bird dog · Planche latérale 40 s" },
        { t: "Haut du corps (natation)", d: 8, n: "Tirage élastique · Rotation externe · Y-T-W" } ] },
    ppg_light: { sport: "ppg", title: "PPG allégée — gainage & mobilité", dur: 30,
      steps: [
        { t: "Gainage 2 tours", d: 15, n: "Dead bug · Bird dog · Planche latérale · Pont fessier" },
        { t: "Mobilité", d: 15, n: "Hanches, thoracique, épaules" } ] },

    /* ---------- ASSOUPLISSEMENT ---------- */
    mob_30: { sport: "mobilite", title: "Assouplissement & mobilité 30 min", dur: 30,
      steps: [
        { t: "Rouleau de massage", d: 6, n: "Quadriceps, fessiers, mollets, dos" },
        { t: "Hanches", d: 8, n: "90/90 · Fente basse psoas 45 s/côté · Pigeon 45 s/côté" },
        { t: "Chaîne arrière", d: 6, n: "Ischios à l'élastique · Mollets contre le mur" },
        { t: "Thoracique & épaules (crawl)", d: 10, n: "Open book · Chat-vache · Étirement des grands dorsaux · Rotation des épaules au bâton" } ] },
    mob_10: { sport: "mobilite", title: "Mobilité 10 min", dur: 10,
      steps: [ { t: "Hanches + dos + mollets", d: 10, n: "Après le ski : psoas, quadriceps, mollets, dos" } ] },

    /* ---------- AUTRES ---------- */
    ski: { sport: "ski", title: "Ski (récupération active croisée)", dur: 0,
      steps: [ { t: "Journée de ski", n: "Pas de vélo structuré. S'hydrater, bien dormir. Ajouter la mobilité de 10 min le soir" } ] },
    voyage: { sport: "repos", title: "Voyage / repos", dur: 0, steps: [ { t: "Repos" } ] },
    repos: { sport: "repos", title: "Repos", dur: 0, steps: [ { t: "Repos complet ou marche" } ] }
  },

  /* Jours : lun mar mer jeu ven sam dim */
  weeks: [
    { n: 1,  block: 1, type: "charge", theme: "Reprise structurée",
      days: { lun: ["ss_3x12"], mar: ["ppg_A"], mer: ["force_cad"], jeu: ["nat_tech"], ven: ["mob_30"], sam: ["repos"], dim: ["long_2h30"] } },
    { n: 2,  block: 1, type: "charge", theme: "Sweet spot + premier doublé",
      days: { lun: ["ss_3x15"], mar: ["ppg_A"], mer: ["vo2_3030"], jeu: ["nat_tech"], ven: ["mob_30"], sam: ["sat_z2"], dim: ["long_3h_tempo"] } },
    { n: 3,  block: 1, type: "charge", theme: "Pic du bloc 1",
      days: { lun: ["ss_2x20"], mar: ["ppg_A"], mer: ["force_cad"], jeu: ["nat_tech"], ven: ["mob_30"], sam: ["repos"], dim: ["long_3h30_tempo"] } },
    { n: 4,  block: 1, type: "recup", theme: "Semaine allégée + test FTP (mer. 27/01)",
      days: { lun: ["z2_easy"], mar: ["ppg_light"], mer: ["test_ftp"], jeu: ["nat_souple"], ven: ["mob_30"], sam: ["repos"], dim: ["long_2h_easy"] } },
    { n: 5,  block: 2, type: "charge", theme: "Entrée en seuil",
      days: { lun: ["th_4x8"], mar: ["ppg_B"], mer: ["vo2_5x3"], jeu: ["nat_end"], ven: ["mob_30"], sam: ["repos"], dim: ["long_3h30_tempo"] } },
    { n: 6,  block: 2, type: "charge", theme: "Seuil + VO2max + doublé",
      days: { lun: ["th_3x12"], mar: ["ppg_B"], mer: ["vo2_5x4"], jeu: ["nat_end"], ven: ["mob_30"], sam: ["sat_z2"], dim: ["long_4h_tempo"] } },
    { n: 7,  block: 2, type: "charge", theme: "Pic du bloc 2 · départ au ski samedi",
      days: { lun: ["ou_3x12"], mar: ["ppg_B"], mer: ["vo2_5x4"], jeu: ["nat_end"], ven: ["mob_30"], sam: ["voyage"], dim: ["ski"] } },
    { n: 8,  block: 2, type: "ski", theme: "Semaine de ski — récupération croisée",
      days: { lun: ["ski", "mob_10"], mar: ["ski", "mob_10"], mer: ["ski", "mob_10"], jeu: ["ski", "mob_10"], ven: ["ski", "mob_10"], sam: ["voyage"], dim: ["long_2h_easy"] } },
    { n: 9,  block: 3, type: "test", theme: "Reprise + test FTP (mer. 03/03)",
      days: { lun: ["z2_cad"], mar: ["ppg_light"], mer: ["test_ftp"], jeu: ["nat_allure"], ven: ["mob_30"], sam: ["repos"], dim: ["long_3h_reprise"] } },
    { n: 10, block: 3, type: "charge", theme: "Seuil long + fatigue + doublé",
      days: { lun: ["th_2x20"], mar: ["ppg_C"], mer: ["vo2_6x4"], jeu: ["nat_allure"], ven: ["mob_30"], sam: ["sat_z2"], dim: ["long_4h_fr"] } },
    { n: 11, block: 3, type: "charge", theme: "Spécifique montée",
      days: { lun: ["ou_3x12"], mar: ["ppg_C"], mer: ["force_cad2"], jeu: ["nat_allure"], ven: ["mob_30"], sam: ["repos"], dim: ["long_4h30_fr"] } },
    { n: 12, block: 3, type: "charge", theme: "Pic du trimestre — répétition Volcanique",
      days: { lun: ["th_2x20"], mar: ["ppg_C"], mer: ["vo2_6x4"], jeu: ["nat_allure"], ven: ["mob_30"], sam: ["repos"], dim: ["long_5h_fr"] } },
    { n: 13, block: 3, type: "recup", theme: "Semaine allégée + test FTP (mer. 31/03)",
      days: { lun: ["z2_easy"], mar: ["ppg_light"], mer: ["test_ftp"], jeu: ["nat_souple"], ven: ["mob_30"], sam: ["repos"], dim: ["long_2h30"] } }
  ]
};

if (typeof window !== "undefined") window.PLAN = PLAN;
if (typeof module !== "undefined") module.exports = PLAN;
