/* Skandalen venter — spildata
   Reigns-light relationer · fristelser · uge-typer · pressemøde */

const CHARACTERS = [
  {
    id: "lykke",
    name: "Lars Lykke-Dahl",
    animal: "Grisen",
    emoji: "🐷",
    img: "img/lykke.jpg",
    arch: "Den evige overlever",
    blurb: "Har siddet i mere end de fleste kan huske — og husker kun det praktiske.",
    catchphrase: "Man skal kunne tale med alle. Også dem, man ikke kan tåle.",
    color: "#5b8def",
    start: { magt: 55, kasse: 45, image: 40, mistanke: 25 },
    startRel: { parti: 55, presse: 40, vaelgere: 45, lobby: 60 },
    startEvidence: 1,
    traits: { softLanding: true, cheaperDeals: true, pressMore: true },
    uniqueAction: "brobygning",
    strength: "Lander blødere · billigere hestehandler · god lobby",
    weakness: "Presse-events oftere · gammelt bevis fra start",
  },
  {
    id: "mette",
    name: "Mette Fredriksen-Møller",
    animal: "Løvinden",
    emoji: "🦁",
    img: "img/mette.jpg",
    arch: "Jernnæven med varme øjne",
    blurb: "Styrer dagsordenen — indtil dagsordenen styrer dig.",
    catchphrase: "Vi har styr på det. Og hvis ikke, har vi en plan for at få styr på det.",
    color: "#e85d5d",
    start: { magt: 70, kasse: 35, image: 55, mistanke: 15 },
    startRel: { parti: 70, presse: 45, vaelgere: 55, lobby: 40 },
    startEvidence: 0,
    traits: { crisisBoss: true, partyShield: true, towerRisk: true },
    uniqueAction: "pressemoede",
    strength: "Stærk i kriser · partiet holder længere",
    weakness: "Mistanke accelererer · højt tårn",
  },
  {
    id: "inger",
    name: "Inger Støjbjerg-Hansen",
    animal: "Høgen",
    emoji: "🦅",
    img: "img/inger.jpg",
    arch: "Hård linje, klar tale",
    blurb: "Loyale fans — og en presse med blokken klar.",
    catchphrase: "Nogen skal sige det, som det er. Det bliver så mig.",
    color: "#3d5a80",
    start: { magt: 40, kasse: 40, image: 50, mistanke: 20 },
    startRel: { parti: 50, presse: 30, vaelgere: 60, lobby: 45 },
    startEvidence: 0,
    traits: { baseBoost: true, deniability: true, socialRisk: true },
    uniqueAction: "stram_tale",
    strength: "Base-mobilisering · “husker ikke” virker bedre",
    weakness: "Presse starter koldt · X-storme farligere",
  },
  {
    id: "pia",
    name: "Pia Kæftsgaard",
    animal: "Bulldoggen",
    emoji: "🐶",
    img: "img/pia.jpg",
    arch: "Ildsjæl / brandbombe",
    blurb: "Umulig at overse. Enten “ærlig” eller politisk napalm.",
    catchphrase: "Jeg er ikke fin på den. Det er politik, ikke te-selskab.",
    color: "#e8b84a",
    start: { magt: 30, kasse: 30, image: 45, mistanke: 10 },
    startRel: { parti: 35, presse: 40, vaelgere: 55, lobby: 30 },
    startEvidence: 0,
    traits: { cheapMobilise: true, hardFall: true, badSpin: true },
    uniqueAction: "salen_amok",
    strength: "Lav start-mistanke · billig mobilisering",
    weakness: "Svagt parti/lobby · hårdt fald",
  },
  {
    id: "papeir",
    name: "Søren Papeir",
    animal: "Ræven",
    emoji: "🦊",
    img: "img/papeir.jpg",
    arch: "Netværkeren",
    blurb: "Kender en der kender en. Middage, poster, “det ordner vi”.",
    catchphrase: "Det handler om tillid. Og tillid bygges over en god middag.",
    color: "#5dce8a",
    start: { magt: 45, kasse: 60, image: 40, mistanke: 18 },
    startRel: { parti: 50, presse: 42, vaelgere: 40, lobby: 70 },
    startEvidence: 0,
    traits: { networker: true, paperTrail: true, deepPockets: true },
    uniqueAction: "middag_papeir",
    strength: "Lobby-konge · dybe lommer",
    weakness: "Flere beviser · vælgere skeptiske",
  },
  {
    id: "vanup",
    name: "Alex Vanup",
    animal: "Påfuglen",
    emoji: "🦚",
    img: "img/vanup.jpg",
    arch: "Medie-darling",
    blurb: "Politik som content. Ser godt ud i 20-sekunders klip.",
    catchphrase: "Hvis det ikke kan forklares på 15 sekunder, er det bureaukrati.",
    color: "#c084fc",
    start: { magt: 25, kasse: 35, image: 65, mistanke: 12 },
    startRel: { parti: 40, presse: 65, vaelgere: 60, lobby: 35 },
    startEvidence: 0,
    traits: { viral: true, sympathyShield: true, thinFoundation: true, fragileImage: true },
    uniqueAction: "gaa_live",
    strength: "Presse & image · første skandale mildere",
    weakness: "Lav magt · tyndt parti/lobby",
  },
];

const REL_KEYS = ["parti", "presse", "vaelgere", "lobby"];
const REL_META = {
  parti: { label: "Parti", emoji: "🏛️", low: "Partiet smider dig", high: "Intern jalousi spiser dig" },
  presse: { label: "Presse", emoji: "📰", low: "Medierne river dig i stykker", high: "Du er blevet deres mascot — og gidsel" },
  vaelgere: { label: "Vælgere", emoji: "🗳️", low: "Folket har fået nok", high: "Forventningerne knækker dig" },
  lobby: { label: "Lobby", emoji: "💼", low: "Netværket lukker døren", high: "Du er købt — og det kan alle se" },
};

const ACTION_ICONS = {
  bilag: "🧾", middag: "🍷", laek: "📰", husker_ikke: "🤷", tale: "🎤",
  ryd_op: "🧹", angrib: "⚔️", lav_profil: "🥷", heste: "🐴", job_ven: "🤝",
  slet_sms: "📱", live_x: "💥", brobygning: "🌉", pressemoede: "📺",
  stram_tale: "📣", salen_amok: "🔥", middag_papeir: "🥂", gaa_live: "✨",
  kuvert: "✉️", slet_mapper: "🗄️", hemmelig_fond: "🏦", bestik_intern: "🤫",
  smør_parti: "🎂", press_konf: "🎙️",
};

const TENSION_QUIPS = {
  low: ["Ro på. For nu.", "Ingen graver… endnu.", "En stille dag på slottet."],
  mid: ["Presse-radarer tænder.", "Nogen tager notes.", "Du sveder diskret."],
  high: ["Skandalen banker på.", "Hold øje med Holm.", "Én dårlig uge fra katastrofe."],
  max: ["🚨 RØD ALARM", "Telefonen gløder.", "Advokaten har booket bord."],
};

const WEEK_TYPES = {
  quiet: {
    id: "quiet",
    name: "Stille uge",
    emoji: "🌙",
    maxActions: 1,
    eventChance: 0.25,
    hint: "Lav profil. Én handling. Nyd roen — den er midlertidig.",
  },
  normal: {
    id: "normal",
    name: "Normal uge",
    emoji: "📋",
    maxActions: 2,
    eventChance: 0.55,
    hint: "To træk. Business as usual i magtens maskinrum.",
  },
  crisis: {
    id: "crisis",
    name: "Kriseuge",
    emoji: "🚨",
    maxActions: 1,
    eventChance: 1,
    forceEvent: true,
    hint: "Kun ét træk — så rammer krisen. Hold dig skarp.",
  },
  temptation: {
    id: "temptation",
    name: "Fristelsens uge",
    emoji: "😈",
    maxActions: 2,
    eventChance: 0.4,
    showTemptation: true,
    hint: "Nogen har lagt en kuvert. Vil du være snu — eller hellig?",
  },
};

const PHASES = [
  { id: "opstilling", name: "Opstilling", weeks: [1, 3], headlines: [
    "Partierne finder kandidater — og gamle favoritter",
    "Bag kulisserne: Netværket rører på sig",
    "En ny (eller gammel) stjerne melder sig klar",
  ]},
  { id: "valgkamp", name: "Valgkamp", weeks: [4, 7], headlines: [
    "Valgkampen er i fuld gang — og handskerne er af",
    "Meningsmålinger svinger som en dør i træk",
    "Læk og one-liners præger ugen",
  ]},
  { id: "valgaften", name: "Valgaften", weeks: [8, 8], headlines: [
    "Valgaften: Nationens øjne er rettet mod tallene",
  ]},
  { id: "regering", name: "Regeringspoker", weeks: [9, 11], headlines: [
    "Hvem sidder for bordenden efter valget?",
    "Hestehandler og smil til kameraet",
    "Poster fordeles — venskaber testes",
  ]},
  { id: "aar1", name: "Regeringsår", weeks: [12, 17], headlines: [
    "Hverdagen i magtens korridorer",
    "Love, frokoster og små kompromiser",
    "Embedsværket hoster diskret i kulissen",
  ]},
  { id: "midt", name: "Midtvejs-pres", weeks: [18, 20], headlines: [
    "Gamle sager får nyt liv",
    "Presset stiger: Beviser og bagtanker",
    "En kommission nægter at dø",
  ]},
  { id: "valgkamp2", name: "Ny valgkamp", weeks: [21, 23], headlines: [
    "Alt du har gjort kan og vil blive brugt imod dig",
    "Vælgerne har hukommelse — og skærmdumps",
  ]},
  { id: "eftermaele", name: "Eftermæle", weeks: [24, 24], headlines: [
    "Perioden er slut. Historien skriver sig selv.",
  ]},
];

const TOTAL_WEEKS = 24;

/** @type {Record<string, object>} */
const ACTIONS = {
  bilag: {
    id: "bilag",
    name: "Kreativt bilag",
    desc: "Nattaxa og ‘strategimøde’.",
    tags: "+kasse · risiko",
    fuzzy: true,
    run(state) {
      const paper = state.char.traits.paperTrail ? 1.3 : 1;
      add(state, { kasse: 8, mistanke: Math.round(6 * paper) });
      addRel(state, { lobby: 4, presse: -5, vaelgere: -3 });
      addEvidence(state, "Kvittering: taxa efter midnat");
      return pick([
        "Bilaget er bogført. Revisoren nynner. Måske nervøst.",
        "47 kr. til ‘networking-snacks’. Historisk beløb, potentielt.",
      ]);
    },
  },
  middag: {
    id: "middag",
    name: "Middag for de rigtige",
    desc: "Dårlig belysning, god vin, bedre aftaler.",
    tags: "+magt · +lobby",
    run(state) {
      const net = state.char.traits.networker ? 1.4 : 1;
      add(state, { magt: Math.round(5 * net), kasse: Math.round(5 * net), mistanke: 7 });
      addRel(state, { lobby: 10, presse: -4, vaelgere: -4, parti: 2 });
      addEvidence(state, "Bordreservation i dit navn");
      state.debts.push({ label: "Lobby-Lars venter en tjeneste", due: state.week + 4 });
      return "Du skåler. Nogen fotograferer desserten. Og dig.";
    },
  },
  laek: {
    id: "laek",
    name: "Læk til venlig medie",
    desc: "‘Kilder tæt på ministeren’. Spoiler: dig.",
    tags: "+image · +presse?",
    fuzzy: true,
    run(state) {
      const spin = state.char.traits.badSpin ? 0.75 : 1;
      const viral = state.char.traits.viral ? 1.25 : 1;
      add(state, { image: Math.round(10 * spin * viral), mistanke: 8 });
      addRel(state, { presse: 8, parti: -6, lobby: 2 });
      if (Math.random() < 0.4) addEvidence(state, "Mail-tråd med initialer");
      state.debts.push({ label: "Journalist Holm venter eksklusivt", due: state.week + 3 });
      return "Historien er ude — på dine præmisser. Indtil videre.";
    },
  },
  husker_ikke: {
    id: "husker_ikke",
    name: "“Jeg husker det ikke”",
    desc: "Klassikeren. Virker indtil det ikke gør.",
    tags: "−mistanke · −image",
    run(state) {
      state.flags.denials = (state.flags.denials || 0) + 1;
      const n = state.flags.denials;
      let drop = state.char.traits.deniability ? 16 : 12;
      drop = Math.max(4, drop - (n - 1) * 4);
      add(state, { mistanke: -drop, image: -5 - n });
      addRel(state, { presse: n >= 3 ? -8 : -3, vaelgere: -4, parti: 2 });
      return n >= 3
        ? "Folk husker, hvor ofte du ikke husker."
        : "Du smiler tomt ind i kameraet. Håndværk.";
    },
  },
  tale: {
    id: "tale",
    name: "Stor princip-tale",
    desc: "Værdier, nation, flag i baggrunden.",
    tags: "+vælgere · +image",
    run(state) {
      const base = state.char.traits.baseBoost || state.char.traits.cheapMobilise ? 1.4 : 1;
      add(state, { image: Math.round(12 * base), mistanke: 3 });
      addRel(state, { vaelgere: 10, parti: 4, lobby: -3, presse: 2 });
      return "Applaus, klip til nyhederne, intern der ruller øjne.";
    },
  },
  ryd_op: {
    id: "ryd_op",
    name: "Ryd op i gamle sager",
    desc: "Dyrt, kedeligt, nødvendigt.",
    tags: "−mistanke · −kasse",
    run(state) {
      add(state, { mistanke: -15, kasse: -8, magt: -5 });
      addRel(state, { presse: 6, parti: 3, lobby: -5, vaelgere: 4 });
      if (state.evidence.length) {
        const e = state.evidence.pop();
        return `Fejet væk: “${e}”. Det kostede.`;
      }
      return "Ikke meget at rydde. Du betaler for ro alligevel.";
    },
  },
  angrib: {
    id: "angrib",
    name: "Angrib rival i medierne",
    desc: "Bedste forsvar er et godt angreb.",
    tags: "+image · drama",
    run(state) {
      add(state, { image: 6, magt: 3, mistanke: 5 });
      addRel(state, { vaelgere: 4, presse: 3, parti: -5, lobby: -2 });
      if (Math.random() < 0.3) addEvidence(state, "Aggressive briefings-noter");
      return "Rivalen bløder. Du får en ny fjende.";
    },
  },
  lav_profil: {
    id: "lav_profil",
    name: "Hold lav profil",
    desc: "Ingen overskrifter. Ingen ære. Mere overlevelse.",
    tags: "sikkert · kedeligt",
    run(state) {
      add(state, { mistanke: -5, magt: -3, image: -3 });
      addRel(state, { presse: 3, parti: -2, vaelgere: -2, lobby: -2 });
      state.flags.cleanWeeks = (state.flags.cleanWeeks || 0) + 1;
      return "Stille uge. Journalisterne keder sig. Sejr.";
    },
  },
  heste: {
    id: "heste",
    name: "Hestehandel",
    desc: "En høring mindre, en stemme mere.",
    tags: "+magt · −image",
    require: (s) => s.meters.magt >= 20,
    requireText: "Kræver magt 20+",
    run(state) {
      const cheap = state.char.traits.cheaperDeals ? 0.8 : 1;
      const thin = state.char.traits.thinFoundation && state.meters.magt < 40;
      if (thin && Math.random() < 0.35) {
        add(state, { magt: -4, image: -4, mistanke: 4 });
        addRel(state, { parti: -6, lobby: -4 });
        return "Du spillede stor uden kortene. Handelen faldt.";
      }
      add(state, { magt: 12, image: Math.round(-6 * cheap), mistanke: Math.round(6 * cheap) });
      addRel(state, { parti: 8, lobby: 6, vaelgere: -8, presse: -4 });
      if (Math.random() < 0.5) addEvidence(state, "Noter fra baglokale-forlig");
      return "Handelen er i hus. Principperne hænger i garderoben.";
    },
  },
  job_ven: {
    id: "job_ven",
    name: "Job til en ven",
    desc: "En dygtig kandidat. Også din rådgivers fætter.",
    tags: "+magt · ⚠️ bevis",
    run(state) {
      const net = state.char.traits.networker ? 1.35 : 1;
      const paper = state.char.traits.paperTrail ? 1.25 : 1;
      add(state, {
        magt: Math.round(10 * net),
        kasse: Math.round(5 * net),
        mistanke: Math.round(12 * paper),
      });
      addRel(state, { lobby: 12, parti: 4, presse: -10, vaelgere: -8 });
      addEvidence(state, "Ansættelse med bemærkelsesværdig timing");
      state.debts.push({ label: "Vennetjeneste skal gengældes", due: state.week + 5 });
      state.flags.tookTemptation = true;
      return "Stillingen er besat. Kompetencerne er… diskutére.";
    },
  },
  slet_sms: {
    id: "slet_sms",
    name: "Nulstil telefonen",
    desc: "Praktisk timing. Juridisk gråzone.",
    tags: "???",
    fuzzy: true,
    temptation: true,
    run(state) {
      state.flags.tookTemptation = true;
      if (state.evidence.length && Math.random() < 0.55) {
        const e = state.evidence.pop();
        addRel(state, { presse: -6, parti: 2 });
        return `Beskeder væk. Bevis væk (“${e}”). Samvittigheden også.`;
      }
      add(state, { mistanke: 10 });
      addRel(state, { presse: -12, parti: -4, vaelgere: -6 });
      addEvidence(state, "Hvorfor blev telefonen nulstillet?");
      return "Du slettede — og skabte et nyt spørgsmål.";
    },
  },
  live_x: {
    id: "live_x",
    name: "Gå amok online",
    desc: "Ét opslag. To udfald.",
    tags: "coinflip",
    fuzzy: true,
    run(state) {
      const risk = state.char.traits.socialRisk ? 0.4 : 0.5;
      const viral = state.char.traits.viral ? 1.3 : 1;
      if (Math.random() < risk + 0.05) {
        add(state, { image: Math.round(15 * viral), mistanke: 4 });
        addRel(state, { vaelgere: 10, presse: 4, parti: -4 });
        return "Viralt. På den gode måde. I aften.";
      }
      add(state, { image: -10, mistanke: 10 });
      addRel(state, { vaelgere: -8, presse: -6, parti: -5 });
      if (Math.random() < 0.2) addEvidence(state, "Screenshot af opslag kl. 23:41");
      return "Viralt. På den anden måde. Tillykke.";
    },
  },
  smør_parti: {
    id: "smør_parti",
    name: "Smør partiet",
    desc: "Loyalitet, kage og stille løfter.",
    tags: "+parti · −kasse",
    run(state) {
      add(state, { kasse: -6, magt: 3 });
      addRel(state, { parti: 12, lobby: -2, vaelgere: -2 });
      state.flags.partyAnnoy = Math.max(0, (state.flags.partyAnnoy || 0) - 2);
      return "Formanden smiler. Det er dyrt smil.";
    },
  },
  press_konf: {
    id: "press_konf",
    name: "Live pressemøde",
    desc: "3 spørgsmål. Ingen teleprompter. DR-energi.",
    tags: "minispil · medie",
    isPressGame: true,
    run(state) {
      return "PRESS_GAME"; // håndteres i game.js
    },
  },
  // —— Fristelser (⚠️) ——
  kuvert: {
    id: "kuvert",
    name: "Tag kuverten",
    desc: "Tykkere end en lovpakke. Ingen kvittering.",
    tags: "⚠️ FRISTELSE · +kasse",
    temptation: true,
    run(state) {
      state.flags.tookTemptation = true;
      state.flags.temptationCount = (state.flags.temptationCount || 0) + 1;
      add(state, { kasse: 22, mistanke: 14 });
      addRel(state, { lobby: 14, presse: -12, vaelgere: -10, parti: -4 });
      addEvidence(state, "Kuvert uden afsender — men med fingeraftryk");
      state.debts.push({ label: "Kuvert-manden vil have sin lov", due: state.week + 3 });
      return "Kuverten er din. Sjælen? På afbetaling.";
    },
  },
  slet_mapper: {
    id: "slet_mapper",
    name: "Slet mapperne",
    desc: "Aktindsigt kan vente. Helst for evigt.",
    tags: "⚠️ FRISTELSE",
    temptation: true,
    fuzzy: true,
    run(state) {
      state.flags.tookTemptation = true;
      state.flags.temptationCount = (state.flags.temptationCount || 0) + 1;
      const n = Math.min(2, state.evidence.length);
      for (let i = 0; i < n; i++) state.evidence.pop();
      if (n > 0 && Math.random() < 0.45) {
        add(state, { mistanke: -8 });
        addRel(state, { presse: -8, parti: 3 });
        return `${n} bevis(er) væk. For nu.`;
      }
      add(state, { mistanke: 12 });
      addRel(state, { presse: -15, vaelgere: -8, parti: -6 });
      addEvidence(state, "Mistanke om slettede akter");
      return "Du slettede for grundigt. Det er også et spor.";
    },
  },
  hemmelig_fond: {
    id: "hemmelig_fond",
    name: "Hemmelig ‘fond’",
    desc: "Kampagnehjælp. Udenom bøgerne. Lidt.",
    tags: "⚠️ FRISTELSE · +magt",
    temptation: true,
    run(state) {
      state.flags.tookTemptation = true;
      state.flags.temptationCount = (state.flags.temptationCount || 0) + 1;
      add(state, { magt: 14, kasse: 10, mistanke: 16 });
      addRel(state, { lobby: 12, parti: 6, presse: -14, vaelgere: -12 });
      addEvidence(state, "Overførsler til ‘projekt demokrati’");
      return "Fonden elsker dig. Pressen vil elske dig mindre.";
    },
  },
  bestik_intern: {
    id: "bestik_intern",
    name: "Køb intern stilhed",
    desc: "En utilfreds medarbejder. En konvolut. Problem solved?",
    tags: "⚠️ FRISTELSE",
    temptation: true,
    run(state) {
      state.flags.tookTemptation = true;
      state.flags.temptationCount = (state.flags.temptationCount || 0) + 1;
      if (state.meters.kasse < 12) {
        add(state, { mistanke: 10, image: -6 });
        addRel(state, { presse: -8, parti: -8 });
        revealEvidence(state);
        return "Du havde ikke råd. De solgte dig i stedet.";
      }
      add(state, { kasse: -14, mistanke: -6 });
      addRel(state, { parti: 4, presse: -6, lobby: 2 });
      return "Stilhed er købt. Prisen stiger næste gang.";
    },
  },
  // Unikke
  brobygning: {
    id: "brobygning",
    name: "Brobygning bag lukkede døre",
    desc: "Lykke-special: tal med alle, lov lidt.",
    tags: "unik · balance",
    unique: true,
    run(state) {
      add(state, { magt: 9, kasse: 4, mistanke: 4 });
      addRel(state, { parti: 6, lobby: 6, presse: 2, vaelgere: -2 });
      if (Math.random() < 0.2) {
        addEvidence(state, "Hemmelig frokost på tværs af midten");
        return "Broen er bygget — og fotograferet fra gaden.";
      }
      return "Alles ven i 48 timer. En evighed i politik.";
    },
  },
  pressemoede: {
    id: "pressemoede",
    name: "Aftenens pressemøde",
    desc: "Mette-special: tag styringen — eller bliv styret.",
    tags: "unik · minispil",
    unique: true,
    isPressGame: true,
    run() {
      return "PRESS_GAME";
    },
  },
  stram_tale: {
    id: "stram_tale",
    name: "Stram tale på nettet",
    desc: "Base elsker det. Resten tager screenshot.",
    tags: "unik · +base",
    unique: true,
    run(state) {
      add(state, { image: 14, mistanke: 9 });
      addRel(state, { vaelgere: 12, presse: -10, parti: -4, lobby: 2 });
      state.flags.stormNext = true;
      return "Base deler. Elite raser. Algoritmen spiser begge.";
    },
  },
  salen_amok: {
    id: "salen_amok",
    name: "Gå amok i salen",
    desc: "Direkte tale. Formanden får tics.",
    tags: "unik · kaos",
    unique: true,
    run(state) {
      add(state, { image: 11, mistanke: 5, magt: -3 });
      addRel(state, { vaelgere: 10, parti: -12, presse: 4, lobby: -4 });
      state.flags.partyAnnoy = (state.flags.partyAnnoy || 0) + 1;
      return "Klippet er overalt. Partiet ‘bakker op’ med tænder.";
    },
  },
  middag_papeir: {
    id: "middag_papeir",
    name: "Papeir-middagen",
    desc: "Ikke bare en middag. En institution.",
    tags: "unik · lobby",
    unique: true,
    run(state) {
      add(state, { magt: 10, kasse: 10, mistanke: 8 });
      addRel(state, { lobby: 16, parti: 4, presse: -8, vaelgere: -6 });
      addEvidence(state, "Middagsliste med interessante efternavne");
      state.debts.push({ label: "Erhverv venter lov-signal", due: state.week + 4 });
      return "Du betaler ikke regningen. Det gør du senere.";
    },
  },
  gaa_live: {
    id: "gaa_live",
    name: "Gå live",
    desc: "Ingen manus. Maks følelser. Maks risiko.",
    tags: "unik · ekstrem",
    unique: true,
    fuzzy: true,
    run(state) {
      if (Math.random() < 0.48) {
        add(state, { image: 20, mistanke: 2 });
        addRel(state, { vaelgere: 12, presse: 10, parti: 2 });
        return "Autentisk. Rørende. Delingsklart.";
      }
      add(state, { image: -14, mistanke: 12 });
      addRel(state, { vaelgere: -10, presse: -8, parti: -6 });
      addEvidence(state, "Live-optagelse med uheldig bisætning");
      return "Du sagde det højt. Uden filter. Uden livrem.";
    },
  },
};

const COMMON_ACTION_IDS = [
  "bilag", "middag", "laek", "husker_ikke", "tale", "ryd_op",
  "angrib", "lav_profil", "heste", "job_ven", "slet_sms", "live_x",
  "smør_parti", "press_konf",
];

const TEMPTATION_IDS = ["kuvert", "slet_mapper", "hemmelig_fond", "bestik_intern"];

const EVENTS = [
  {
    id: "journalist",
    title: "Journalist Holm ringer",
    text: "“Bare et par opklarende spørgsmål. Har du et øjeblik — eller kører vi historien uden dig?”",
    weight: 1.2,
    choices: [
      {
        label: "Samarbejd (delvist)",
        run(s) {
          add(s, { mistanke: -6, image: 3, kasse: -3 });
          addRel(s, { presse: 8, parti: -2 });
          return "Halv sandhed. De printer den som en hel.";
        },
      },
      {
        label: "Bluf & charmér",
        run(s) {
          if (Math.random() < 0.5 + s.meters.image / 200) {
            add(s, { image: 6, mistanke: -2 });
            addRel(s, { presse: 4, vaelgere: 2 });
            return "Du snakker dig ud. Holm noterer alligevel.";
          }
          add(s, { mistanke: 10, image: -5 });
          addRel(s, { presse: -10 });
          if (s.evidence.length) revealEvidence(s);
          return "Bluffet flopper. Opfølgning i morgen.";
        },
      },
      {
        label: "Luk røret",
        run(s) {
          add(s, { mistanke: 8, image: -4 });
          addRel(s, { presse: -12, vaelgere: -4 });
          return "“Ingen kommentar.” Det er en kommentar.";
        },
      },
    ],
  },
  {
    id: "formand",
    title: "Formanden vil have en snak",
    text: "Døren lukkes. “Vi bakker dig op — men partiet er ikke din forsikring.”",
    weight: 1,
    choices: [
      {
        label: "Vær lytig og loyal",
        run(s) {
          add(s, { magt: -3, mistanke: -4, image: 2 });
          addRel(s, { parti: 10, lobby: -2 });
          s.flags.partyAnnoy = Math.max(0, (s.flags.partyAnnoy || 0) - 1);
          return "Du nikker. Formanden smiler som en tålmodig haj.";
        },
      },
      {
        label: "Kræv noget til gengæld",
        run(s) {
          add(s, { magt: 8, mistanke: 5 });
          addRel(s, { parti: -6, lobby: 4 });
          s.flags.partyAnnoy = (s.flags.partyAnnoy || 0) + 1;
          return "Du får en titelfragten. Og en streg i bogen.";
        },
      },
      {
        label: "Ignorer advarslen",
        run(s) {
          add(s, { magt: 2, mistanke: 6 });
          addRel(s, { parti: -14 });
          s.flags.partyAnnoy = (s.flags.partyAnnoy || 0) + 2;
          return "Du går. Formanden kigger på sin telefon.";
        },
      },
    ],
  },
  {
    id: "laek_intern",
    title: "Intern utilfredshed",
    text: "AnonTip har noget fra dit bagland. De vil have ro — eller drama.",
    weight: 1,
    choices: [
      {
        label: "Betal stilhed (kasse)",
        run(s) {
          if (s.meters.kasse < 10) {
            add(s, { mistanke: 8, image: -6 });
            addRel(s, { presse: -8, parti: -6 });
            revealEvidence(s);
            return "Ikke råd. Lækket kom alligevel.";
          }
          add(s, { kasse: -12, mistanke: -5 });
          addRel(s, { parti: 4, presse: 2 });
          return "Roen er købt. Indtil prisen stiger.";
        },
      },
      {
        label: "Fyr en syndebuk",
        run(s) {
          add(s, { magt: -5, image: -3, mistanke: -3 });
          addRel(s, { parti: -8, presse: 3 });
          return "Nogen ryger. Loyaliteten blandt resten: laber.";
        },
      },
      {
        label: "Lad det ligge",
        run(s) {
          add(s, { mistanke: 7 });
          addRel(s, { presse: -6, vaelgere: -4 });
          if (Math.random() < 0.5) revealEvidence(s);
          return "Historien siver. Du poster om ‘fokus på vælgerne’.";
        },
      },
    ],
  },
  {
    id: "meningsmaal",
    title: "Ny meningsmåling",
    text: "Tallene er inde. Fortolkningen er din.",
    weight: 0.9,
    choices: [
      {
        label: "Spin det som sejr",
        run(s) {
          const ok = Math.random() < 0.55;
          if (ok) {
            add(s, { image: 8, mistanke: 3 });
            addRel(s, { vaelgere: 6, presse: -2 });
            return "Medierne køber rammen. I dag.";
          }
          add(s, { image: -6, mistanke: 5 });
          addRel(s, { vaelgere: -6, presse: -4 });
          return "Alle kan se, at du pynter. Pinsomt.";
        },
      },
      {
        label: "Ignorer og arbejd",
        run(s) {
          add(s, { magt: 4, image: -2 });
          addRel(s, { parti: 4, vaelgere: -2 });
          return "Du nægter at danse. Styrke — eller arrogance.";
        },
      },
      {
        label: "Skift linje efter tallene",
        run(s) {
          add(s, { image: 5, magt: -4, mistanke: 2 });
          addRel(s, { vaelgere: 8, parti: -6, lobby: -4 });
          return "Principper er dyre. Fleksibilitet er billigere.";
        },
      },
    ],
  },
  {
    id: "foto_middag",
    title: "Foto fra restauranten",
    text: "Dig, en lobbyist, og en dessert dyrere end en SU-uge.",
    weight: 1,
    minWeek: 3,
    choices: [
      {
        label: "Indrøm & undskyld",
        run(s) {
          add(s, { image: -4, mistanke: -8 });
          addRel(s, { vaelgere: 4, presse: 6, lobby: -4 });
          return "Du tager den. Sympati: en millimeter.";
        },
      },
      {
        label: "“Arbejdsrelateret”",
        run(s) {
          add(s, { mistanke: 6, image: -2 });
          addRel(s, { presse: -8, vaelgere: -6, lobby: 4 });
          addEvidence(s, "Foto + dårlig forklaring");
          return "Teknisk sandt. Politisk latterligt.";
        },
      },
      {
        label: "Angrib fotografen",
        run(s) {
          add(s, { image: -8, mistanke: 10, magt: 2 });
          addRel(s, { presse: -14, vaelgere: -8 });
          return "Du ser lille ud. Stort drama. Dårlig deal.";
        },
      },
    ],
  },
  {
    id: "lobby",
    title: "Lobby vil have en lille §-ændring",
    text: "Lobby-Lars smiler. “Det er teknisk. Ingen læser bilag 3.”",
    weight: 0.95,
    minWeek: 5,
    choices: [
      {
        label: "Tag imod (åbent)",
        run(s) {
          add(s, { kasse: 12, magt: 4, image: -8, mistanke: 8 });
          addRel(s, { lobby: 12, vaelgere: -10, presse: -8 });
          addEvidence(s, "Korrespondance om §-venlig formulering");
          s.flags.tookTemptation = true;
          return "Pengene er rigtige. Overskrifterne bliver det også.";
        },
      },
      {
        label: "Afvis principfast",
        run(s) {
          add(s, { image: 8, kasse: -2, magt: -3 });
          addRel(s, { vaelgere: 10, presse: 4, lobby: -12 });
          s.flags.refusedTemptation = (s.flags.refusedTemptation || 0) + 1;
          return "Du sover bedre. Netværket sover surt.";
        },
      },
      {
        label: "⚠️ Hemmelig ja",
        run(s) {
          add(s, { kasse: 14, magt: 6, mistanke: 10 });
          addRel(s, { lobby: 14, presse: -6, vaelgere: -4, parti: -2 });
          addEvidence(s, "Hemmelig aftale — bilag 3");
          s.debts.push({ label: "Lobby-Lars’ § skal leveres", due: s.week + 3 });
          s.flags.tookTemptation = true;
          s.flags.temptationCount = (s.flags.temptationCount || 0) + 1;
          return "Ingen så det. Endnu.";
        },
      },
    ],
  },
  {
    id: "vaelger_lis",
    title: "Lis fra Holstebro på TV",
    text: "“De snakker bare københavnsk. Hvad med os andre?”",
    weight: 0.75,
    choices: [
      {
        label: "Vær jordnær",
        run(s) {
          add(s, { image: 9, magt: -2 });
          addRel(s, { vaelgere: 12, lobby: -2, parti: 2 });
          return "Du nævner ventetid og benzin. Lis nikkede. Næsten.";
        },
      },
      {
        label: "Teknokrat-svar",
        run(s) {
          add(s, { magt: 3, image: -6 });
          addRel(s, { vaelgere: -10, parti: 4, presse: -2 });
          return "Du vandt på point. Tabte på følelser.";
        },
      },
      {
        label: "Send en stedfortræder",
        run(s) {
          add(s, { mistanke: 3, image: -3 });
          addRel(s, { vaelgere: -8, presse: -4 });
          return "Du dukkede ikke op. Det gjorde historien.";
        },
      },
    ],
  },
  {
    id: "instruks",
    title: "Instruksen ingen vil eje",
    text: "Departementschefen hoster. “Ordre, idé — eller misforståelse?”",
    weight: 0.75,
    minWeek: 10,
    choices: [
      {
        label: "Tag ansvaret",
        run(s) {
          add(s, { image: 5, mistanke: 6, magt: 4 });
          addRel(s, { parti: 6, presse: 2, vaelgere: 4 });
          return "Du ejer det. Respekt — og en kommende kommission.";
        },
      },
      {
        label: "“Jeg blev ikke briefet”",
        run(s) {
          add(s, { mistanke: -4, magt: -8, image: -5 });
          addRel(s, { parti: -10, presse: -4 });
          s.flags.partyAnnoy = (s.flags.partyAnnoy || 0) + 1;
          return "Embedsværket hørte dig. De glemmer det ikke.";
        },
      },
      {
        label: "⚠️ Mundtlig, ingen mail",
        run(s) {
          add(s, { magt: 8, mistanke: 12 });
          addRel(s, { parti: 2, presse: -10, vaelgere: -6 });
          addEvidence(s, "Vidneudsagn om mundtlig instruks");
          s.flags.tookTemptation = true;
          return "Intet papir. Kun sved og vidner.";
        },
      },
    ],
  },
  {
    id: "kommission_rygte",
    title: "Kommission i luften",
    text: "Ordet ‘undersøgelse’ ligger i studierne som tåge.",
    weight: 0.7,
    minWeek: 16,
    choices: [
      {
        label: "Forbered dig (kasse)",
        run(s) {
          add(s, { kasse: -10, mistanke: -6, magt: 2 });
          addRel(s, { presse: 4, parti: 4 });
          return "Advokater er dyre. Panik er dyrere.";
        },
      },
      {
        label: "⚠️ Slet spor",
        run(s) {
          if (s.evidence.length) s.evidence.pop();
          add(s, { mistanke: 9 });
          addRel(s, { presse: -12, vaelgere: -8 });
          addEvidence(s, "Mistanke om slettede spor");
          s.flags.tookTemptation = true;
          return "Ét bevis væk. Et meta-bevis født.";
        },
      },
      {
        label: "Offentlig selvtillid",
        run(s) {
          const ok = s.meters.image > 45;
          if (ok) {
            add(s, { image: 6, mistanke: 4 });
            addRel(s, { vaelgere: 4, presse: -2 });
            return "Du stråler. Tvivlen venter bag kameraet.";
          }
          add(s, { image: -8, mistanke: 8 });
          addRel(s, { vaelgere: -6, presse: -6 });
          return "Selvtillid uden image er bare sved.";
        },
      },
    ],
  },
  {
    id: "rival_attack",
    title: "Rival lækker om dig",
    text: "En ‘bekymret kollega’ har talt med pressen. Bekymringen er strategisk.",
    weight: 0.85,
    choices: [
      {
        label: "Kontra-læk",
        run(s) {
          add(s, { mistanke: 7, image: 4, magt: 3 });
          addRel(s, { presse: 2, parti: -6, vaelgere: 2 });
          if (Math.random() < 0.35) addEvidence(s, "Gensidig smædekamp — dine prints");
          return "I mudderkaster begge. Publikum elsker det.";
        },
      },
      {
        label: "Tavshed & værdighed",
        run(s) {
          add(s, { image: 3, mistanke: 3 });
          addRel(s, { vaelgere: 4, presse: -2 });
          return "Du siger ingenting. Klasse — eller skyld.";
        },
      },
      {
        label: "Humor på X",
        run(s) {
          if (Math.random() < 0.5) {
            add(s, { image: 10, mistanke: 2 });
            addRel(s, { vaelgere: 8, presse: 4 });
            return "Memet vinder. Rivalen ser sur ud i 4K.";
          }
          add(s, { image: -7, mistanke: 6 });
          addRel(s, { vaelgere: -6, presse: -4 });
          return "Fleipen flopper. Tone-deaf er et politisk ord.";
        },
      },
    ],
  },
  {
    id: "storm",
    title: "Mediestorm",
    text: "Dit seneste udspil brænder videre. Deadline vil have dig. Nu.",
    weight: 0.5,
    onlyIf: (s) => s.flags.stormNext,
    choices: [
      {
        label: "Mød op og stå fast",
        run(s) {
          s.flags.stormNext = false;
          add(s, { image: 6, mistanke: 5, magt: 3 });
          addRel(s, { vaelgere: 6, presse: -2, parti: 2 });
          return "Du stod fast. Ryggrad — eller stædighed.";
        },
      },
      {
        label: "Undskyld på trappen",
        run(s) {
          s.flags.stormNext = false;
          add(s, { mistanke: -10, image: -3 });
          addRel(s, { presse: 6, vaelgere: 2 });
          return "20 sekunder. Øjenkontakt. ‘Det skulle ikke ske.’";
        },
      },
      {
        label: "Gem dig",
        run(s) {
          s.flags.stormNext = false;
          add(s, { image: -10, mistanke: 8 });
          addRel(s, { presse: -10, vaelgere: -8, parti: -4 });
          return "Tom stol. Fyldt kommentarfelt.";
        },
      },
    ],
  },
  {
    id: "fristelse_kuvert",
    title: "En kuvert på bordet",
    text: "Ingen afsender. Tykkelsen taler for sig selv. “Til kampagnen,” mumler nogen.",
    weight: 0.6,
    minWeek: 4,
    choices: [
      {
        label: "⚠️ Tag imod",
        run(s) {
          return ACTIONS.kuvert.run(s);
        },
      },
      {
        label: "Skub den væk",
        run(s) {
          add(s, { image: 4 });
          addRel(s, { vaelgere: 6, presse: 4, lobby: -8 });
          s.flags.refusedTemptation = (s.flags.refusedTemptation || 0) + 1;
          return "Du er hellig i aften. Lommerne er tyndere. Samvittigheden tykkere.";
        },
      },
      {
        label: "Giv den til pressen (spin)",
        run(s) {
          add(s, { image: 10, mistanke: 4, magt: -4 });
          addRel(s, { presse: 10, vaelgere: 8, lobby: -16, parti: -4 });
          return "Du er helten. Lobbyen er fjenden. Krig er erklæret.";
        },
      },
    ],
  },
];

/** Pressemøde: 3 spørgsmål, A/B */
const PRESS_QUESTIONS = [
  {
    q: "Holm: Har du brugt offentlige midler privat?",
    a: { label: "Afvis blankt", effect: { mistanke: 4, image: 2 }, rel: { presse: -4, vaelgere: 2 } },
    b: { label: "“Det undersøger vi”", effect: { mistanke: -2, image: -2 }, rel: { presse: 4, parti: -2 } },
  },
  {
    q: "Deadline: Hvorfor svinger meningsmålingerne?",
    a: { label: "Skyld på medierne", effect: { image: -4, magt: 2 }, rel: { presse: -10, vaelgere: 4 } },
    b: { label: "Tag ansvar & lov bedring", effect: { image: 6, mistanke: -2 }, rel: { vaelgere: 6, presse: 4, parti: 2 } },
  },
  {
    q: "X-reporter: Er du for tæt på lobbyen?",
    a: { label: "Vi taler med alle", effect: { mistanke: 3 }, rel: { lobby: 4, vaelgere: -4, presse: -2 } },
    b: { label: "Distancer dig skarpt", effect: { image: 4, kasse: -4 }, rel: { lobby: -10, vaelgere: 6, presse: 4 } },
  },
  {
    q: "TV: Kan vælgerne stole på dig?",
    a: { label: "Følelsesladet ja", effect: { image: 8, mistanke: 2 }, rel: { vaelgere: 8, presse: 2 } },
    b: { label: "Tør technokrat-snak", effect: { magt: 4, image: -4 }, rel: { vaelgere: -6, parti: 4 } },
  },
  {
    q: "Radio: Hvad med de slettede beskeder?",
    a: { label: "“Jeg husker ikke”", effect: { mistanke: -4, image: -6 }, rel: { presse: -6, vaelgere: -4 } },
    b: { label: "Åbn for aktindsigt", effect: { mistanke: -8, magt: -4 }, rel: { presse: 10, vaelgere: 4, parti: -4 } },
  },
  {
    q: "Live: Er du egnet til magten?",
    a: { label: "Angrib spørgsmålet", effect: { magt: 3, image: -5 }, rel: { presse: -8, parti: 2 } },
    b: { label: "Rolig selvtillid", effect: { image: 7 }, rel: { vaelgere: 6, presse: 4, parti: 2 } },
  },
];

const END_HEADLINES = {
  scandal: [
    "{navn} trækker sig efter massivt pres",
    "Historisk fald: Fra top til skandale på {uger} uger",
    "Partiet smed yndlingsbarnet under bussen",
    "Det endte ikke med principper — det endte med beviser",
  ],
  party: [
    "{navn} er ude — formanden har talt",
    "Intern opgør: Partiet valgte overlevelse",
  ],
  rel: [
    "{navn} væltet: {årsag}",
    "Balancen knækkede — {navn} er færdig",
  ],
  win: [
    "{navn} overlever perioden — mod alle odds",
    "Ren på papiret, snu i praksis: En usædvanlig sejr",
    "Perioden slut: {navn} står stadig",
  ],
  pm: [
    "Statsministeren ingen troede på: {navn}",
    "Magten er din — og skyggerne også",
  ],
};

// —— Shared helpers ——
function clamp(n, a = 0, b = 100) {
  return Math.max(a, Math.min(b, Math.round(n)));
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function add(state, delta) {
  const m = state.meters;
  let mistankeMul = 1;
  if (state.char.traits.towerRisk && (delta.mistanke || 0) > 0 && m.mistanke >= 30) {
    mistankeMul = 1.35;
  }
  if (state.char.traits.fragileImage && m.mistanke >= 50 && (delta.image || 0) < 0) {
    delta = { ...delta, image: Math.round(delta.image * 1.4) };
  }
  if (delta.magt) m.magt = clamp(m.magt + delta.magt);
  if (delta.kasse) m.kasse = clamp(m.kasse + delta.kasse);
  if (delta.image) m.image = clamp(m.image + delta.image);
  if (delta.mistanke) m.mistanke = clamp(m.mistanke + Math.round(delta.mistanke * mistankeMul));
}

function addRel(state, delta) {
  if (!state.rel) return;
  const shield = state.char.traits.partyShield && delta.parti && delta.parti < 0 ? 0.7 : 1;
  REL_KEYS.forEach((k) => {
    if (delta[k] == null) return;
    let v = delta[k];
    if (k === "parti" && v < 0) v = Math.round(v * shield);
    state.rel[k] = clamp(state.rel[k] + v);
  });
}

function addEvidence(state, label) {
  state.evidence.push(label);
  if (state.evidence.length > 12) state.evidence.shift();
}

function revealEvidence(state) {
  if (!state.evidence.length) {
    add(state, { mistanke: 5, image: -3 });
    addRel(state, { presse: -4 });
    state.log.push("Ingen konkrete beviser — men rygterne rækker.");
    return;
  }
  const i = Math.floor(Math.random() * state.evidence.length);
  const e = state.evidence.splice(i, 1)[0];
  let hit = 12;
  if (state.char.traits.softLanding) hit = 8;
  if (state.char.traits.sympathyShield && !state.flags.firstScandalUsed) {
    hit = 6;
    state.flags.firstScandalUsed = true;
  }
  add(state, { mistanke: hit, image: -Math.round(hit * 0.7) });
  addRel(state, { presse: -8, vaelgere: -6, parti: -4 });
  state.log.push(`Bevis afsløret: “${e}”`);
}

function relFace(v) {
  if (v <= 12) return "💀";
  if (v <= 25) return "😠";
  if (v <= 40) return "😐";
  if (v <= 60) return "🙂";
  if (v <= 80) return "😊";
  if (v <= 90) return "🔥";
  return "⚠️";
}

function checkRelCollapse(state) {
  for (const k of REL_KEYS) {
    const v = state.rel[k];
    const meta = REL_META[k];
    if (v <= 0) return { key: k, edge: "low", reason: meta.low };
    if (v >= 100) return { key: k, edge: "high", reason: meta.high };
  }
  return null;
}
