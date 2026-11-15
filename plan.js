/* Plan d'entraînement T1-2027 — Frédéric Tillier
   Source unique du plan : utilisée par l'application (index.html), par build-doc.js (PLAN.md)
   et par build-pdf.js (PDF au format du « Plan FTP sept.-déc. 2026 »).
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
    reference2026: "Volcanique 2026 : 10h55 au total, 9h20 en mouvement, 168 W moyens, −14 % de puissance en 2e moitié, 1h35 d'arrêts.",
    cover: {
      lines: ["TREIZE", "SEMAINES", "VERS", "LA VOLCANIQUE"], accentFrom: 3,
      lead: "Du 4 janvier au 4 avril 2027. Trois tests FTP, trois blocs, une semaine de ski. Vélo le lundi et le mercredi soir, renforcement et éveils le matin, sortie longue le dimanche — en solo puis avec Pol."
    }
  },

  /* Hiérarchie des chantiers : quand deux choses entrent en conflit, celle du haut gagne */
  cadre: [
    { t: "FTP", d: "la priorité. Plus de 300 W en juin. Deux séances de qualité par semaine, non négociables." },
    { t: "Endurance Volcanique", d: "la sortie longue du dimanche, en solo puis 1h45 à 2h avec Pol. Elle construit la durabilité qui a manqué en 2026 (−14 % de puissance en seconde moitié)." },
    { t: "Renforcement", d: "deux séances le matin, plus trois éveils. Ischios, stabilité du bassin et du genou, haut du corps pour le crawl." },
    { t: "Poids", d: "90 → 85 kg en juin, soit environ −0,7 kg par mois. Déficit modéré les jours faciles, jamais les jours de qualité. Environ 1,6 à 2 g de protéines par kg." },
    { t: "Natation", d: "jeudi soir, 1h30. Technique et battement de jambes : ni performance ni récupération." }
  ],

  /* Semaine type : jour, matin, soir, pourquoi là */
  semaineType: [
    { j: "Lundi", m: "Éveil 1 · 18 min", s: "Vélo qualité 1 · ≤ 1h30", why: "La séance la plus dure de la semaine, sur les jambes les plus fraîches : la partie avec Pol du dimanche est en bas de Z2." },
    { j: "Mardi", m: "Éveil 3 · 25 min", s: "—", why: "Le seul jour totalement calme. C'est pour ça qu'il porte la séance d'assouplissement la plus longue." },
    { j: "Mercredi", m: "Éveil 2 · 15 min", s: "Vélo qualité 2 · ≤ 1h30", why: "48 h après Q1 : de quoi encaisser une seconde séance de qualité sans cumul." },
    { j: "Jeudi", m: "Renfo A · bas du corps", s: "Natation 1h30", why: "Pas de vélo ce jour : c'est la seule fenêtre où le travail lourd des jambes ne pénalise rien de prioritaire. Les courbatures (24-48 h) tombent sur le vendredi et le samedi, jours sans vélo." },
    { j: "Vendredi", m: "Renfo B · haut du corps", s: "—", why: "Le haut du corps ne coûte rien aux jambes. La natation étant passée la veille, les épaules sont libres." },
    { j: "Samedi", m: "Repos · 1 fois par mois : Z2 2 h", s: "—", why: "Repos par défaut. Une fois par mois (16/01, 13/02, 13/03), une sortie Z2 pour apprendre à enchaîner deux jours de vélo." },
    { j: "Dimanche", m: "Sortie longue solo + Pol", s: "—", why: "72 h après le renfo A : les courbatures sont résorbées. Toute l'intensité est dans la partie solo ; les 1h45 à 2h avec Pol prolongent l'endurance sur jambes fatiguées." }
  ],

  zones: [
    { z: "Z1", name: "Récupération", pct: [0, 55], fc: "< 75 %", feel: "Pédalage libre, conversation totale." },
    { z: "Z2", name: "Endurance", pct: [56, 75], fc: "75 – 83 %", feel: "Base aérobie. Phrases complètes possibles." },
    { z: "Z3", name: "Tempo", pct: [76, 87], fc: "84 – 91 %", feel: "Soutenu mais confortable. Phrases courtes." },
    { z: "SS", name: "Sweet spot", pct: [88, 94], fc: "92 – 95 %", feel: "Inconfortable, tenable 20 à 40 min. Quelques mots." },
    { z: "Z4", name: "Seuil", pct: [95, 105], fc: "96 – 102 %", feel: "Respiration profonde et rythmée. Un mot à la fois." },
    { z: "Z5", name: "VO₂max", pct: [106, 120], fc: "décalée, non pilotable", feel: "Maximal sur 30 s à 5 min. Aucune parole." },
    { z: "Z6", name: "Anaérobie", pct: [121, 150], fc: "non pilotable", feel: "Sprints et relances." }
  ],

  principles: [
    "Lundi et mercredi soir : séances de qualité sur home trainer (Rouvy), 1h30 maximum.",
    "Renforcement et éveils le matin, vélo le soir. Jamais de travail lourd des jambes la veille d'une séance de qualité.",
    "Jeudi : renfo A (bas du corps) le matin, piscine 1h30 le soir. Vendredi : renfo B (haut du corps). Mardi : éveil 3, assouplissement long.",
    "Dimanche : sortie longue en 2 parties. D'abord une partie solo, qui contient toute l'intensité. Puis 1h45 à 2h avec Pol en bas de Z2 (56-62 % de la FTP). Si la météo est mauvaise : partie solo sur home trainer (2 h maximum), partie avec Pol dehors si possible.",
    "Un samedi par mois (16/01, 13/02, 13/03) : sortie Z2 en plus, pour enchaîner deux jours de vélo.",
    "Cycles de 3 semaines de charge + 1 semaine allégée. La semaine de ski (20-27 février) sert de coupure vélo pour le bloc B.",
    "Tests FTP : 19/12 (point de départ), 27/01, 03/03 et 31/03, toujours avec le même protocole. Après chaque test, mettre à jour la FTP dans Réglages : toutes les cibles en watts se recalculent.",
    "Cadence : 85-95 rpm en intérieur et au moins 75 rpm en montée. Une cadence sous 60 rpm doit alerter (leçon de l'EDT 2026).",
    "Poids : déficit modéré (~300-400 kcal/j) les jours faciles, pas de déficit les jours de qualité et de sortie longue, protéines ~1,6-2 g/kg. Objectif −0,7 kg/mois."
  ],

  blocks: [
    { id: 1, letter: "A", name: "Bloc A — Base & sweet spot", short: "Base & sweet spot", weeks: [1, 2, 3, 4], dates: "4 – 31 janvier",
      goal: "Reconstruire le volume après les fêtes et installer le sweet spot long.",
      why: "Le sweet spot, entre 88 et 94 % de la FTP, offre le meilleur rapport entre stimulus et fatigue pour relancer une base aérobie. En parallèle, la force-vélocité s'attaque à la cadence en montée, point faible mesuré sur l'EDT et sur le Rouvey (56-72 rpm). Le renfo travaille l'endurance de force (3 × 12) avant de charger lourd.",
      focus: "Volume aérobie, sweet spot, force-vélocité, renforcement en endurance de force (3 × 12)." },
    { id: 2, letter: "B", name: "Bloc B — Seuil & VO₂max", short: "Seuil & VO₂max", weeks: [5, 6, 7, 8], dates: "1er – 28 février",
      goal: "Relever le plafond aérobie et rapprocher la FTP de 300 W.",
      why: "Ta FTP stagne entre 270 et 290 W depuis 2023. Pour la faire monter, il faut relever le plafond (VO₂max, 5 × 3 à 5 × 4 min) et travailler directement au seuil (4 × 8, 3 × 12, over-unders). Le renfo passe en force (4 × 6, charges lourdes). La semaine de ski sert de coupure : pas de vélo, mais une vraie charge croisée.",
      focus: "Seuil et VO2max (le levier pour dépasser 300 W), renforcement en force (4 × 6). Semaine de ski en récupération active." },
    { id: 3, letter: "C", name: "Bloc C — Spécifique Volcanique", short: "Spécifique Volcanique", weeks: [9, 10, 11, 12, 13], dates: "1er mars – 4 avril",
      goal: "Tenir la puissance en fin de sortie longue et en montée, cadence au moins 75 rpm.",
      why: "En 2026, tu as perdu 14 % de puissance en seconde moitié, avec quatre arrêts dans le Rouvey. Ce bloc combine du seuil long (2 × 20 min), des over-unders qui reproduisent les variations de pente, et des sorties longues avec qualité en fin de partie solo, suivies de 2 h avec Pol. La sortie de 5 h en S12 est la répétition générale : ravitaillement, sodium, zéro arrêt subi.",
      focus: "Seuil long, over-unders, résistance à la fatigue en fin de sortie longue, cadence en montée. Renforcement en force explosive / maintien." }
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
    test_ftp: { sport: "test", title: "Test FTP 20 min (Rouvy, mode Slope)", dur: 66, tss: 75,
      steps: [
        { t: "Échauffement progressif", d: 10, z: [55, 70], c: "90" },
        { t: "3 × 1 min d'accélération", d: 6, z: [70, 80], c: "100-105", n: "Puissance modérée, récup 1 min entre chaque" },
        { t: "Récupération", d: 5, z: [40, 55], c: "90" },
        { t: "Effort d'ouverture 5 min", d: 5, z: [108, 112], c: "90", n: "Vide la composante anaérobie avant le test" },
        { t: "Récupération", d: 10, z: [40, 55], c: "90", n: "C'est long, c'est normal" },
        { t: "LE TEST — 20 min régulier", d: 20, z: [100, 108], c: "85-90", n: "Partir 5 % sous la cible les 2 premières minutes. FTP = 95 % de la moyenne ; FC seuil = FC moyenne des minutes 5 à 20" },
        { t: "Retour au calme", d: 10, z: [40, 55], c: "90" } ] },

    /* ---------- VÉLO — WEEK-END ---------- */
    sat_z2: { sport: "velo", title: "Samedi : sortie Z2 2 h (doublé)", dur: 120, tss: 90, outdoor: true,
      steps: [ { t: "Z2 régulier", d: 120, z: [60, 72], c: "85-95", n: "La veille de la sortie longue : apprendre à enchaîner. Home trainer : 1h30" } ] },
    long_2h_easy: { sport: "velo", title: "Sortie souple 2 h (avec Pol)", dur: 120, tss: 70, outdoor: true,
      steps: [
        { t: "Solo — mise en route", d: 15, z: [55, 65], c: "90", n: "Semaine allégée : aucune intensité" },
        { t: "Avec Pol — bas de Z2", d: 105, z: [56, 62], c: "85-95", n: "Rythme de Pol : rester en bas de Z2, aucune intensité. Bonne occasion de travailler la cadence et l'alimentation" } ] },
    long_2h30: { sport: "velo", title: "Sortie longue 2h30 (solo + Pol)", dur: 150, tss: 100, outdoor: true,
      steps: [
        { t: "Solo — Z2", d: 40, z: [62, 72], c: "85-95", n: "Home trainer si météo (2 h maximum)" },
        { t: "Avec Pol — bas de Z2", d: 110, z: [56, 62], c: "85-95", n: "Rythme de Pol : rester en bas de Z2, aucune intensité. Bonne occasion de travailler la cadence et l'alimentation" } ] },
    long_3h_tempo: { sport: "velo", title: "Sortie longue 3 h — solo tempo + Pol", dur: 180, tss: 145, outdoor: true,
      steps: [
        { t: "Solo — échauffement Z2", d: 15, z: [60, 72], c: "85-95" },
        { t: "Solo — 2 × 20 min tempo", d: 50, z: [78, 85], c: "80-90", n: "10 min Z2 entre les blocs. En côte si possible" },
        { t: "Avec Pol — bas de Z2", d: 115, z: [56, 62], c: "85-95", n: "Rythme de Pol : rester en bas de Z2, aucune intensité. Bonne occasion de travailler la cadence et l'alimentation" } ] },
    long_3h30_tempo: { sport: "velo", title: "Sortie longue 3h30 — solo tempo + Pol", dur: 210, tss: 170, outdoor: true,
      steps: [
        { t: "Solo — échauffement Z2", d: 15, z: [60, 72], c: "85-95" },
        { t: "Solo — 3 × 20 min tempo", d: 70, z: [78, 85], c: "80-90", n: "5 min Z2 entre les blocs" },
        { t: "Solo — Z2 jusqu'au rendez-vous", d: 5, z: [60, 70], c: "90" },
        { t: "Avec Pol — bas de Z2", d: 120, z: [56, 62], c: "85-95", n: "Rythme de Pol : rester en bas de Z2, aucune intensité. Bonne occasion de travailler la cadence et l'alimentation" } ] },
    long_4h_tempo: { sport: "velo", title: "Sortie longue 4 h — solo tempo + Pol", dur: 240, tss: 195, outdoor: true,
      steps: [
        { t: "Solo — Z2", d: 30, z: [60, 72], c: "85-95" },
        { t: "Solo — 3 × 20 min tempo", d: 70, z: [78, 87], c: "80-90", n: "Montées des Monts d'Or si possible, cadence ≥ 75" },
        { t: "Solo — Z2 jusqu'au rendez-vous", d: 20, z: [60, 72], c: "85-95", n: "S'alimenter toutes les 30 min, boire 500-750 ml/h" },
        { t: "Avec Pol — bas de Z2", d: 120, z: [56, 62], c: "85-95", n: "Rythme de Pol : rester en bas de Z2, aucune intensité. Bonne occasion de travailler la cadence et l'alimentation" } ] },
    long_3h_reprise: { sport: "velo", title: "Sortie longue 3 h — reprise post-ski (solo + Pol)", dur: 180, tss: 135, outdoor: true,
      steps: [
        { t: "Solo — Z2", d: 30, z: [60, 72], c: "85-95" },
        { t: "Solo — 2 × 10 min tempo", d: 25, z: [78, 85], c: "85-90" },
        { t: "Solo — Z2 souple", d: 10, z: [55, 65], c: "90" },
        { t: "Avec Pol — bas de Z2", d: 115, z: [56, 62], c: "85-95", n: "Rythme de Pol : rester en bas de Z2, aucune intensité. Bonne occasion de travailler la cadence et l'alimentation" } ] },
    long_4h_fr: { sport: "velo", title: "Sortie longue 4 h — solo spécifique + Pol", dur: 240, tss: 215, outdoor: true,
      steps: [
        { t: "Solo — Z2 avec montées à cadence ≥ 75", d: 75, z: [60, 75], c: "≥ 75 en montée", n: "Plafond 80 % de FTP en côte : on apprend le départ « Volcanique »" },
        { t: "Solo — 3 × 10 min sweet spot", d: 45, z: [88, 92], c: "≥ 75", n: "Récup 5 min. Simule Saint-Agrève / Rochepaule / Rouvey" },
        { t: "Avec Pol — bas de Z2", d: 120, z: [56, 62], c: "85-95", n: "Rythme de Pol : rester en bas de Z2, aucune intensité. Bonne occasion de travailler la cadence et l'alimentation" } ] },
    long_4h30_fr: { sport: "velo", title: "Sortie longue 4h30 — solo spécifique + Pol", dur: 270, tss: 245, outdoor: true,
      steps: [
        { t: "Solo — Z2 avec montées à cadence ≥ 75", d: 105, z: [60, 75], c: "≥ 75 en montée" },
        { t: "Solo — 2 × 15 min seuil bas", d: 45, z: [90, 95], c: "≥ 75", n: "Récup 15 min entre les blocs. Sans s'arrêter : objectif zéro arrêt subi" },
        { t: "Avec Pol — bas de Z2", d: 120, z: [56, 62], c: "85-95", n: "Rythme de Pol : rester en bas de Z2, aucune intensité. Bonne occasion de travailler la cadence et l'alimentation" } ] },
    long_5h_fr: { sport: "velo", title: "Sortie longue 5 h — répétition Volcanique (solo + Pol)", dur: 300, tss: 275, outdoor: true,
      steps: [
        { t: "Solo — Z2 avec gros dénivelé (≥ 1 500 m D+)", d: 150, z: [60, 78], c: "≥ 75 en montée", n: "Tester la stratégie de ravitaillement : 60-80 g de glucides/h, sodium 500-700 mg/h" },
        { t: "Solo — dernier col : 20-30 min à 88-92 %", d: 30, z: [88, 92], c: "≥ 75" },
        { t: "Avec Pol — bas de Z2", d: 120, z: [56, 62], c: "85-95", n: "Rythme de Pol : rester en bas de Z2, aucune intensité. Bonne occasion de travailler la cadence et l'alimentation" } ] },

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

    /* ---------- ÉVEILS (matin) ---------- */
    eveil1: { sport: "eveil", slot: "matin", title: "Éveil 1 — Mobilité & activation", dur: 18,
      steps: [
        { t: "Réveil articulaire", d: 5, n: "Chevilles, genoux, hanches, épaules en cercles" },
        { t: "Activation des fessiers", d: 6, n: "Pont fessier 15, clamshell 12/côté, marche latérale à l'élastique" },
        { t: "Gainage court", d: 5, n: "Planche 30 s, dead bug 10, bird dog 8/côté" },
        { t: "Respiration", d: 2, n: "Respiration abdominale, 6 cycles lents" } ] },
    eveil2: { sport: "eveil", slot: "matin", title: "Éveil 2 — Mobilité douce & thoracique", dur: 15,
      steps: [
        { t: "Colonne", d: 5, n: "Chat-vache, open book 8/côté" },
        { t: "Épaules (crawl)", d: 6, n: "Rotations au bâton, étirement des grands dorsaux, Y-T-W sans charge" },
        { t: "Hanches", d: 4, n: "90/90 lent, fente basse avec rotation" } ] },
    eveil3: { sport: "eveil", slot: "matin", title: "Éveil 3 — Étirements longs (assouplissement)", dur: 25,
      steps: [
        { t: "Rouleau de massage", d: 5, n: "Quadriceps, fessiers, mollets, dos" },
        { t: "Psoas & quadriceps", d: 6, n: "Fente basse 45 s/côté, quadriceps allongé 45 s/côté" },
        { t: "Ischios & fessiers", d: 6, n: "Ischios à l'élastique, pigeon 60 s/côté" },
        { t: "Adducteurs & mollets", d: 4 },
        { t: "Dos & épaules", d: 4, n: "Posture de l'enfant, étirement pectoraux au mur" } ] },

    /* ---------- RENFORCEMENT (matin) ---------- */
    renfoA_1: { sport: "renfo", slot: "matin", title: "Renfo A — Bas du corps · endurance de force", dur: 45,
      steps: [
        { t: "Activation", d: 6, n: "Corde à sauter ou vélo souple, mobilité des hanches" },
        { t: "Bas du corps 3 × 12", d: 18, n: "Squat gobelet · Fentes arrière · Hip thrust · Mollets sur une jambe" },
        { t: "Ischios : Nordic 2 × 5", d: 6, n: "Descente contrôlée, amplitude progressive" },
        { t: "Gainage lombo-pelvien 3 tours", d: 15, n: "Dead bug 10 · Bird dog 10/côté · Planche latérale 30 s/côté · Pallof press 10/côté" } ] },
    renfoA_2: { sport: "renfo", slot: "matin", title: "Renfo A — Bas du corps · force", dur: 45,
      steps: [
        { t: "Activation", d: 6, n: "Mobilité + 2 séries légères" },
        { t: "Force 4 × 6, charge lourde", d: 22, n: "Squat ou soulevé de terre jambes tendues · Fentes bulgares · Step-up chargé. Récup 2 min" },
        { t: "Ischios : Nordic 3 × 5", d: 7 },
        { t: "Gainage anti-rotation 3 tours", d: 10, n: "Pallof press · Planche latérale avec élévation de jambe · Pont fessier unilatéral 10/côté" } ] },
    renfoA_3: { sport: "renfo", slot: "matin", title: "Renfo A — Bas du corps · force explosive", dur: 45,
      steps: [
        { t: "Activation", d: 6 },
        { t: "Force 3 × 5 + pliométrie", d: 20, n: "Squat lourd 3 × 5 en contraste avec 6 squats sautés · Fentes bulgares 3 × 6 · Step-up explosif" },
        { t: "Ischios : Nordic 3 × 5", d: 7 },
        { t: "Gainage 3 tours", d: 12, n: "Dead bug · Bird dog · Planche latérale 40 s" } ] },
    renfoA_light: { sport: "renfo", slot: "matin", title: "Renfo A — version allégée", dur: 30,
      steps: [
        { t: "Activation", d: 6 },
        { t: "Bas du corps au poids du corps 2 × 10", d: 12, n: "Squat · Fentes · Pont fessier" },
        { t: "Gainage 2 tours", d: 12, n: "Dead bug · Bird dog · Planche latérale" } ] },
    renfoB: { sport: "renfo", slot: "matin", title: "Renfo B — Haut du corps & gainage", dur: 30,
      steps: [
        { t: "Haut du corps 3 tours", d: 18, n: "Tirage élastique ou rowing · Pompes · Rotation externe d'épaule · Y-T-W" },
        { t: "Gainage des épaules", d: 8, n: "Planche avec touchers d'épaule · Planche latérale" },
        { t: "Mobilité des épaules", d: 4 } ] },
    renfoB_light: { sport: "renfo", slot: "matin", title: "Renfo B — version allégée", dur: 20,
      steps: [
        { t: "Haut du corps 2 tours", d: 12, n: "Tirage élastique · Rotation externe · Y-T-W" },
        { t: "Gainage", d: 8 } ] },
    mob_10: { sport: "eveil", slot: "soir", title: "Mobilité 10 min (après ski)", dur: 10,
      steps: [ { t: "Hanches, dos, mollets", d: 10, n: "Psoas, quadriceps, mollets, dos" } ] },

    /* ---------- AUTRES ---------- */
    ski: { sport: "ski", slot: "journée", title: "Ski — charge croisée", dur: 0,
      steps: [ { t: "Journée de ski", n: "Pas de vélo structuré. S'hydrater, bien dormir, mobilité de 10 min le soir" } ] },
    voyage: { sport: "repos", slot: "—", title: "Voyage / repos", dur: 0, steps: [ { t: "Repos" } ] },
    repos: { sport: "repos", slot: "—", title: "Repos", dur: 0, steps: [ { t: "Repos complet ou marche" } ] }
  },

  /* charge : 1 coupure · 2 décharge · 3 modérée · 4 forte · 5 très forte */
  weeks: [
    { n: 1,  block: 1, type: "charge", charge: 3, theme: "Reprise structurée",
      desc: "Première semaine au format définitif. On réinstalle le sweet spot et le geste de cadence, sans chercher la fatigue.",
      days: { lun: ["eveil1", "ss_3x12"], mar: ["eveil3"], mer: ["eveil2", "force_cad"], jeu: ["renfoA_1", "nat_tech"], ven: ["renfoB"], sam: ["repos"], dim: ["long_2h30"] } },
    { n: 2,  block: 1, type: "charge", charge: 4, theme: "Sweet spot + premier doublé",
      desc: "Premier rappel de VO₂max court (30/30) et premier week-end en doublé : samedi Z2, dimanche solo tempo puis Pol.",
      days: { lun: ["eveil1", "ss_3x15"], mar: ["eveil3"], mer: ["eveil2", "vo2_3030"], jeu: ["renfoA_1", "nat_tech"], ven: ["renfoB"], sam: ["sat_z2"], dim: ["long_3h_tempo"] } },
    { n: 3,  block: 1, type: "charge", charge: 4, theme: "Pic du bloc A",
      desc: "Le sweet spot passe à 2 × 20 min. La sortie longue atteint 3h30 avec 3 × 20 min de tempo en solo.",
      days: { lun: ["eveil1", "ss_2x20"], mar: ["eveil3"], mer: ["eveil2", "force_cad"], jeu: ["renfoA_1", "nat_tech"], ven: ["renfoB"], sam: ["repos"], dim: ["long_3h30_tempo"] } },
    { n: 4,  block: 1, type: "recup", charge: 2, theme: "Décharge + test FTP (mer. 27/01)",
      desc: "Semaine de décharge, avec le test FTP n° 2 mercredi. Lundi souple, renfo allégé, aucune intensité en dehors du test.",
      days: { lun: ["eveil1", "z2_easy"], mar: ["eveil3"], mer: ["eveil2", "test_ftp"], jeu: ["renfoA_light", "nat_souple"], ven: ["renfoB_light"], sam: ["repos"], dim: ["long_2h_easy"] } },
    { n: 5,  block: 2, type: "charge", charge: 3, theme: "Entrée en seuil",
      desc: "Nouvelles zones issues du test du 27/01. Premier seuil en 4 × 8 min et premiers 5 × 3 min de VO₂max. Le renfo passe en force.",
      days: { lun: ["eveil1", "th_4x8"], mar: ["eveil3"], mer: ["eveil2", "vo2_5x3"], jeu: ["renfoA_2", "nat_end"], ven: ["renfoB"], sam: ["repos"], dim: ["long_3h30_tempo"] } },
    { n: 6,  block: 2, type: "charge", charge: 4, theme: "Seuil + VO₂max + doublé",
      desc: "Seuil 3 × 12, VO₂max 5 × 4 et doublé du week-end : la semaine la plus chargée du bloc B.",
      days: { lun: ["eveil1", "th_3x12"], mar: ["eveil3"], mer: ["eveil2", "vo2_5x4"], jeu: ["renfoA_2", "nat_end"], ven: ["renfoB"], sam: ["sat_z2"], dim: ["long_4h_tempo"] } },
    { n: 7,  block: 2, type: "charge", charge: 4, theme: "Pic du bloc B · départ au ski samedi",
      desc: "Over-unders lundi, VO₂max mercredi, puis départ au ski. Pas de sortie longue ce dimanche : la journée de ski la remplace.",
      days: { lun: ["eveil1", "ou_3x12"], mar: ["eveil3"], mer: ["eveil2", "vo2_5x4"], jeu: ["renfoA_2", "nat_end"], ven: ["renfoB"], sam: ["voyage"], dim: ["ski"] } },
    { n: 8,  block: 2, type: "ski", charge: 1, theme: "Semaine de ski — coupure vélo",
      desc: "Coupure vélo. Le ski est une vraie charge pour les jambes : mobilité 10 min chaque soir, sommeil et hydratation. Reprise dimanche avec Pol.",
      days: { lun: ["ski", "mob_10"], mar: ["ski", "mob_10"], mer: ["ski", "mob_10"], jeu: ["ski", "mob_10"], ven: ["ski", "mob_10"], sam: ["voyage"], dim: ["long_2h_easy"] } },
    { n: 9,  block: 3, type: "test", charge: 2, theme: "Reprise + test FTP (mer. 03/03)",
      desc: "Retour du ski : lundi d'endurance avec vélocité, test FTP n° 3 mercredi, renfo allégé. Les zones du bloc C partent de ce test.",
      days: { lun: ["eveil1", "z2_cad"], mar: ["eveil3"], mer: ["eveil2", "test_ftp"], jeu: ["renfoA_light", "nat_allure"], ven: ["renfoB"], sam: ["repos"], dim: ["long_3h_reprise"] } },
    { n: 10, block: 3, type: "charge", charge: 4, theme: "Seuil long + fatigue + doublé",
      desc: "Seuil continu 2 × 20 min, VO₂max 6 × 4 min, et le dernier doublé du trimestre avec une sortie de 4 h.",
      days: { lun: ["eveil1", "th_2x20"], mar: ["eveil3"], mer: ["eveil2", "vo2_6x4"], jeu: ["renfoA_3", "nat_allure"], ven: ["renfoB"], sam: ["sat_z2"], dim: ["long_4h_fr"] } },
    { n: 11, block: 3, type: "charge", charge: 4, theme: "Spécifique montée",
      desc: "Force-endurance à 65-70 rpm (la cadence du Rouvey, mais tenue), puis 4h30 dont 2 × 15 min au seuil bas avant de retrouver Pol.",
      days: { lun: ["eveil1", "ou_3x12"], mar: ["eveil3"], mer: ["eveil2", "force_cad2"], jeu: ["renfoA_3", "nat_allure"], ven: ["renfoB"], sam: ["repos"], dim: ["long_4h30_fr"] } },
    { n: 12, block: 3, type: "charge", charge: 5, theme: "Pic du trimestre — répétition Volcanique",
      desc: "La semaine la plus dure du plan. Dimanche, 5 h avec au moins 1 500 m de dénivelé et le dernier col au sweet spot : on teste le ravitaillement et l'objectif zéro arrêt.",
      days: { lun: ["eveil1", "th_2x20"], mar: ["eveil3"], mer: ["eveil2", "vo2_6x4"], jeu: ["renfoA_3", "nat_allure"], ven: ["renfoB"], sam: ["repos"], dim: ["long_5h_fr"] } },
    { n: 13, block: 3, type: "recup", charge: 2, theme: "Décharge + test FTP (mer. 31/03)",
      desc: "Décharge et test FTP n° 4, le bilan du trimestre. Comparer avec le 19/12 : objectif au moins 295 W, en route vers les 300 W de juin.",
      days: { lun: ["eveil1", "z2_easy"], mar: ["eveil3"], mer: ["eveil2", "test_ftp"], jeu: ["renfoA_light", "nat_souple"], ven: ["renfoB_light"], sam: ["repos"], dim: ["long_2h30"] } }
  ],

  /* Pages finales du document */
  sessionTypes: [
    { t: "Endurance Z2", z: "56 – 75 % FTP", format: "La sortie longue (surtout la partie avec Pol) et tout ce qui n'est pas une séance de qualité.", why: "Densité mitochondriale, capillarisation, capacité à brûler les graisses. C'est le socle : sans lui, les séances dures ne se récupèrent pas et la durabilité ne se construit pas.", watch: "Effet lent, invisible d'une semaine à l'autre, décisif sur six mois. C'est la seule zone qu'on ne compresse jamais." },
    { t: "Tempo Z3", z: "76 – 87 % FTP", format: "Blocs de 20 min dans la partie solo du dimanche.", why: "Tolérance à l'effort soutenu et économie de pédalage. C'est l'allure réelle d'un col long comme Mézilhac.", watch: "Zone souvent négligée parce qu'elle n'est ni facile ni vraiment dure. Garder la cadence au-dessus de 80 rpm." },
    { t: "Sweet spot", z: "88 – 94 % FTP", format: "Blocs de 12 à 20 min. Le format dominant du bloc A, puis la qualité finale des sorties longues du bloc C.", why: "Le meilleur rapport entre stimulus et fatigue quand le volume en semaine est limité à 1h30.", watch: "En abuser crée une fatigue chronique sans relever le plafond. D'où le bloc B." },
    { t: "Seuil Z4", z: "95 – 105 % FTP", format: "Blocs de 8 à 20 min. Le cœur des blocs B et C.", why: "Déplace directement la FTP en améliorant la clairance du lactate. C'est la zone la plus rentable du plan pour dépasser 300 W.", watch: "Aussi la plus coûteuse : deux séances de seuil par semaine au maximum, jamais deux jours de suite." },
    { t: "Over-unders", z: "95 % puis 105 %", format: "3 × 12 min, alternance 2 min dessous / 1 min dessus.", why: "Apprend à évacuer le lactate en roulant. C'est exactement la contrainte d'un col dont la pente varie, comme le Rouvey.", watch: "Le retour à 95 % doit rester tenable ; sinon la cible est trop haute." },
    { t: "VO₂max", z: "106 – 120 % FTP", format: "30/30, puis 5 × 3, 5 × 4 et 6 × 4 min.", why: "Relève le plafond aérobie. Sans lui, la FTP plafonne parce qu'elle ne peut pas dépasser un certain pourcentage de la VO₂max.", watch: "Cadence 95-105 rpm. Le mode ERG est acceptable pour ces séances." },
    { t: "Force-vélocité & cadence", z: "Z3, cadence imposée", format: "Blocs à 55-70 rpm alternés avec de la haute cadence (100-110 rpm).", why: "Un problème mécanique plus qu'énergétique : sur la Volcanique, la cadence est tombée à 56-72 rpm dans le Rouvey. On travaille le geste et la stabilité du bassin.", watch: "Buste immobile, pas de déhanchement. Si les genoux tirent, remonter la cadence immédiatement." },
    { t: "Sortie longue solo + Pol", z: "Qualité en solo, puis 56-62 %", format: "Partie solo avec toute l'intensité, puis 1h45 à 2h avec Pol en bas de Z2.", why: "La durabilité : produire encore de la puissance après 4 à 6 h de selle. C'est ce qui a manqué au-delà du km 100 de la Volcanique.", watch: "Partie avec Pol vraiment facile, même si les jambes vont bien. S'alimenter toutes les 30 min dès la partie solo." }
  ],
  combine: [
    { t: "La règle du 80/20", d: "Environ 80 % du temps en Z1-Z2 et 20 % au-dessus. La partie avec Pol et les échauffements font l'essentiel du volume facile ; lundi, mercredi et la partie solo font l'intensité." },
    { t: "Jamais deux jours durs consécutifs", d: "D'où lundi et mercredi, séparés par un mardi d'assouplissement, et le renfo lourd le jeudi, sans vélo." },
    { t: "L'ordre des blocs n'est pas arbitraire", d: "Sweet spot pour reconstruire la base, seuil et VO₂max pour relever le plafond et la FTP, puis spécifique Volcanique pour tenir cette puissance en fin de sortie longue." },
    { t: "Trois semaines de charge, une de décharge", d: "Les décharges tombent en S4, S8 (ski), S9 (reprise) et S13. C'est pendant celles-là que les adaptations se matérialisent." },
    { t: "La sortie longue ne se remplace jamais par de l'intensité", d: "Deux heures de sweet spot ne remplacent pas quatre heures de selle. Ce sont deux adaptations différentes." }
  ],
  rules: [
    { t: "Mode Slope ou Level, jamais ERG", d: "pour les quatre tests, sans exception. Pour les séances de VO₂max courtes, l'ERG est acceptable." },
    { t: "Le renfo passe le matin, le vélo le soir", d: "jamais l'inverse, et jamais de travail lourd des jambes la veille d'une séance de qualité." },
    { t: "Home trainer : 2 h maximum", d: "même le dimanche. Dehors, on cherche la durée ; dedans, on cherche la densité." },
    { t: "Une séance ratée ne se rattrape pas", d: "on la saute et on reprend le fil. Les séances sacrifiables, dans l'ordre : le renfo B, l'éveil, puis la séance vélo du mercredi." },
    { t: "Les zones se recalent après chaque test", d: "travailler sur des plages périmées est la première cause de plateau. L'application recalcule les watts dès que la FTP est mise à jour." },
    { t: "Trois signaux d'alerte", d: "FC de repos élevée trois matins de suite, sommeil dégradé, ou puissance en chute sur une séance facile. Un seul suffit pour transformer la semaine en décharge." }
  ],
  aCaler: [
    { t: "Date de l'Ardéchoise 2027", d: "le 19 juin est une hypothèse (la Volcanique 2026 avait lieu le 13 juin). À confirmer dès l'ouverture des inscriptions." },
    { t: "Test du 19 décembre", d: "il fixe la FTP et la FC seuil de départ. Saisir le résultat dans l'application : tous les watts du plan se recalculent." },
    { t: "Piscine pendant les vacances", d: "vérifier les horaires du jeudi soir pendant les vacances d'hiver. La semaine de ski (S8) n'a pas de natation." },
    { t: "Pol", d: "caler chaque semaine l'heure du rendez-vous du dimanche, pour que la partie solo soit faite avant de le retrouver." }
  ]
};

/* Créneau par défaut quand la séance ne le précise pas */
(function () {
  for (const w of Object.values(PLAN.workouts)) {
    if (!w.slot) w.slot = (w.outdoor ? "matin" : (w.sport === "velo" || w.sport === "test" || w.sport === "natation") ? "soir" : "matin");
  }
  const tips = {
    ss_3x12: "Cadence 85-95 rpm sur les blocs. Si la FC dérive de plus de 5 bpm entre le 1er et le 3e bloc, rester à 88 % la semaine suivante.",
    force_cad: "Les blocs à 55-60 rpm se font assis, sans à-coups. Si les genoux tirent, remonter la cadence immédiatement.",
    force_cad2: "Cadence plancher 65 rpm : c'est l'anti-Rouvey. Sous 65, on baisse la puissance, pas la cadence.",
    vo2_3030: "Les premières répétitions doivent sembler faciles : la difficulté arrive à partir de la 6e.",
    th_2x20: "Position de grimpeur, mains en haut du cintre, buste stable. Le second bloc est le vrai test.",
    ou_3x12: "Le retour à 95 % doit rester tenable ; sinon la cible est trop haute.",
    test_ftp: "Même protocole à chaque test, en mode Slope ou Level. Partir 5 % sous la cible les 2 premières minutes.",
    long_5h_fr: "Répétition générale : même petit-déjeuner, mêmes bidons et barres que le jour J. Objectif zéro arrêt subi.",
    long_4h_fr: "Plafond 80 % de la FTP dans les côtes de la première partie : c'est le départ de la Volcanique qu'on apprend.",
    sat_z2: "Veille de la sortie longue : vraiment en Z2. C'est l'enchaînement qu'on travaille, pas l'intensité."
  };
  for (const [k, v] of Object.entries(tips)) if (PLAN.workouts[k]) PLAN.workouts[k].tip = v;

  const briefs = {"eveil1": "Réveil articulaire, activation des fessiers, gainage court. Prépare la séance vélo du soir.", "eveil2": "Colonne et épaules (open book, rotations au bâton), hanches. Prépare la natation du lendemain.", "eveil3": "La séance d'assouplissement la plus complète : rouleau, psoas, quadriceps, ischios, fessiers, adducteurs, dos.", "renfoA_1": "Squat gobelet, fentes, hip thrust, mollets en 3 × 12 · Nordic 2 × 5 · gainage lombo-pelvien.", "renfoA_2": "Force 4 × 6 lourd : squat ou SDT jambes tendues, fentes bulgares, step-up · Nordic 3 × 5 · gainage anti-rotation.", "renfoA_3": "Squat lourd 3 × 5 en contraste avec des squats sautés, fentes bulgares, step-up explosif · Nordic · gainage.", "renfoA_light": "Poids du corps 2 × 10 et gainage. Aucune charge lourde cette semaine.", "renfoB": "Tirage, pompes, rotation externe d'épaule, Y-T-W · gainage des épaules. Aucun coût pour les jambes.", "renfoB_light": "Tirage, rotation externe, Y-T-W en 2 tours · gainage.", "mob_10": "Psoas, quadriceps, mollets, dos après la journée de ski.", "nat_tech": "Éducatifs crawl, 8 × 50 m jambes à la planche, 6 × 100 m avec palmes puis 4 × 100 m sans. Focus battement depuis la hanche.", "nat_end": "Jambes avec palmes, 4 × 200 m crawl régulier, 2 × 300 m pull-buoy. Endurance de nage.", "nat_allure": "Éducatifs, 10 × 100 m allure soutenue (noter les temps), 400 m continu sans palmes.", "nat_souple": "Nage libre souple, éducatifs et jambes avec palmes. Rien d'intense.", "ski": "Pas de vélo structuré. Hydratation, sommeil, mobilité le soir.", "voyage": "Repos.", "repos": "Repos complet ou marche."};
  for (const [k, v] of Object.entries(briefs)) if (PLAN.workouts[k]) PLAN.workouts[k].brief = v;
})();

if (typeof window !== "undefined") window.PLAN = PLAN;
if (typeof module !== "undefined") module.exports = PLAN;
