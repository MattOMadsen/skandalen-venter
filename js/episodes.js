/* Episode-uger — hovedhistorier, boss-uger, karakter-replikker */

/**
 * Hver episode: 3 valg, meters + relationer, og en reply-tekst.
 * reply kan være string eller { default, [charId]: "..." }
 */
const EPISODES = [
  {
    id: "bilag_bolge",
    title: "Bilags-bølgen",
    emoji: "🧾",
    npc: "Journalist Holm",
    headline: "Medier graver i politiske bilag — igen",
    text: "Holm ringer kl. 07:12. “Vi har 47 kvitteringer. Én af dem har dit navn. Har du en kommentar — eller kører vi historien uden dig?”",
    weight: 1.2,
    choices: [
      {
        label: "Indrøm småfejl og undskyld",
        effect: { image: 4, mistanke: -6, kasse: -3 },
        rel: { presse: 6, vaelgere: 4, parti: 2 },
        note: "Du tager den på hagen. Sympatien stiger en millimeter.",
        reply: {
          default: "“Det skulle ikke være sket.” Klassikeren virker. Næsten.",
          lykke: "🐷 “Man laver fejl. Jeg laver… bilag.”",
          mette: "🦁 “Vi har styr på det. Nu.”",
        },
      },
      {
        label: "“Arbejdsrelateret. Punktum.”",
        effect: { mistanke: 8, image: -2, magt: 2 },
        rel: { presse: -8, vaelgere: -4, lobby: 2 },
        note: "Teknisk sandt. Politisk giftigt.",
        reply: {
          default: "Holm noterer. Det er aldrig et godt tegn.",
          papeir: "🦊 “Det er sådan man spiller. På papiret.”",
        },
        evidence: "Bilagsforklaring der lugter",
      },
      {
        label: "Læk noget værre om en rival",
        effect: { image: 6, mistanke: 10, magt: 3 },
        rel: { presse: 2, parti: -6, vaelgere: -2 },
        note: "Mudderkrig. Du vinder nyheden — og en fjende.",
        reply: {
          default: "Rivalen bløder. Du får en SMS: “Det glemmer jeg ikke.”",
          pia: "🐶 “Sådan gør man politik. Velkommen.”",
        },
        evidenceChance: 0.4,
        evidence: "Aggressive briefings-noter",
      },
    ],
  },
  {
    id: "formand_middag",
    title: "Formandens middag",
    emoji: "🍽️",
    npc: "Parti-formanden",
    headline: "Internt topmøde bag lukkede døre",
    text: "Formanden smiler med tænderne. “Vi bakker dig op. Men partiet er ikke din personlige forsikring. Hvad har du tænkt dig at levere?”",
    weight: 1.1,
    choices: [
      {
        label: "Lov loyalitet og resultater",
        effect: { magt: -2, image: 3 },
        rel: { parti: 12, lobby: -2 },
        note: "Du nikker dig til ro. Formanden noterer dig som ‘håndterbar’.",
        reply: {
          default: "“Godt. Så er vi enige.” Kaffen er stadig kold.",
          mette: "🦁 “Partiet først. Altid.” Formanden næsten smiler.",
        },
      },
      {
        label: "Kræv en post til gengæld",
        effect: { magt: 10, mistanke: 4 },
        rel: { parti: -6, lobby: 4, vaelgere: -2 },
        note: "Du får en titel. Og en streg i regnskabet.",
        reply: {
          default: "“Du er sulten. Det kan jeg respektere.”",
          lykke: "🐷 “Man skal jo også have noget at sidde på.”",
        },
      },
      {
        label: "Tru med at gå til pressen",
        effect: { mistanke: 12, image: -6, magt: 4 },
        rel: { parti: -16, presse: 4 },
        note: "Atomknappen. Formanden holder op med at smile.",
        reply: {
          default: "“Pas på dig selv.” Døren smækker blødt. For højt.",
          vanup: "🦚 Det er dårlig content. Men det er content.",
        },
      },
    ],
  },
  {
    id: "x_storm",
    title: "X-stormen",
    emoji: "💥",
    npc: "Algoritmen",
    headline: "Dit navn trender — og det er ikke pænt",
    text: "Et gammelt citat, et klip, en vinkel. På tre timer er du dagens hadeobjekt / helt. Hvad gør du?",
    weight: 1.15,
    choices: [
      {
        label: "Gå live og forklar dig",
        effect: { image: 8, mistanke: 4 },
        rel: { vaelgere: 6, presse: 4, parti: -2 },
        note: "Autentisk. Svedigt. Delingsklart.",
        reply: {
          default: "Du taler i 90 sekunder. Kommentarfeltet er krig.",
          vanup: "🦚 “Det her er mit medium.” Ring light ON.",
          inger: "🦅 “Jeg siger det, som det er.” Base elsker det.",
        },
        maybePress: 0.25,
      },
      {
        label: "Ignorer og lad det dø",
        effect: { mistanke: -2, image: -4, magt: 2 },
        rel: { presse: -4, vaelgere: -4, parti: 4 },
        note: "Stille strategi. Virker — indtil det ikke gør.",
        reply: {
          default: "Du poster en solnedgang. Ingen køber den.",
          lykke: "🐷 “Storme går over. Det gør jeg også.”",
        },
      },
      {
        label: "Angrib “eliten / medierne”",
        effect: { image: 6, mistanke: 8 },
        rel: { vaelgere: 10, presse: -12, parti: -4 },
        note: "Base brøler. Presse noterer dig som problem.",
        reply: {
          default: "Klippene er overalt. Du er brand — eller brandfare.",
          pia: "🐶 “ENDELIG siger nogen det!”",
          inger: "🦅 Stram tale. Algoritmen spiser den rå.",
        },
        flagStorm: true,
      },
    ],
  },
  {
    id: "lobby_kuvert",
    title: "Kuverten på bordet",
    emoji: "✉️",
    npc: "Lobby-Lars",
    headline: "Erhvervslivet vil “hjælpe kampagnen”",
    text: "Lobby-Lars skubber en kuvert hen over mahognien. “Til demokratiet. Ingen kvittering. Ingen problemer. Vel?”",
    weight: 1.1,
    choices: [
      {
        label: "⚠️ Tag imod",
        temptation: true,
        effect: { kasse: 18, mistanke: 12, magt: 4 },
        rel: { lobby: 14, presse: -10, vaelgere: -8, parti: -2 },
        note: "Kuverten er din. Samvittigheden er på afbetaling.",
        reply: {
          default: "Lars skåler i vand. “Vi forstår hinanden.”",
          papeir: "🦊 “Tillid. Og tykke konvolutter.”",
        },
        evidence: "Kuvert uden afsender",
        debt: { label: "Lobby-Lars vil have sin §", dueAdd: 3 },
        setFlag: "tookTemptation",
      },
      {
        label: "Skub den høfligt væk",
        effect: { image: 6 },
        rel: { vaelgere: 8, presse: 6, lobby: -12 },
        note: "Du er hellig i aften. Lommerne er tyndere.",
        reply: {
          default: "Lars smiler stramt. “En anden gang.”",
          mette: "🦁 “Vi gør det rigtigt. Ellers slet ikke.”",
        },
        setFlag: "refusedTemptation",
      },
      {
        label: "Giv den til pressen (spin)",
        effect: { image: 12, mistanke: 4, magt: -4 },
        rel: { presse: 12, vaelgere: 10, lobby: -18, parti: -4 },
        note: "Du er helten. Lobbyen erklærer krig.",
        reply: {
          default: "Holm får en scoop. Lars får dit nummer slettet.",
          vanup: "🦚 “Integrity is the new content.”",
        },
      },
    ],
  },
  {
    id: "stabschef",
    title: "Stabschefen knækker",
    emoji: "😰",
    npc: "Din stabschef",
    headline: "Intern uro i inderkredsen",
    text: "Din skygge bankede på. Øjnene er røde. “Hvis jeg falder, falder mapperne med. Sig mig at vi har en plan.”",
    weight: 1,
    choices: [
      {
        label: "Støt dem fuldt ud",
        effect: { kasse: -8, image: 4, mistanke: -4 },
        rel: { parti: 4, presse: 2 },
        note: "Loyalitet købt med rygdækning.",
        reply: {
          default: "“Tak.” De mener det. Det er dyrt — og rigtigt.",
          mette: "🦁 “Vi taber ingen. Ikke i dag.”",
        },
        setFlag: "staffLoyal",
      },
      {
        label: "Ofre dem diskret",
        effect: { magt: -4, mistanke: -6 },
        rel: { parti: -4, presse: 2, vaelgere: -2 },
        note: "De er væk. Mapperne… de fleste af dem.",
        reply: {
          default: "En pressemeddelelse om ‘nye udfordringer’. Koldt.",
          lykke: "🐷 “Nogen skal jo lande på ryggen. Helst ikke mig.”",
        },
        evidenceChance: 0.35,
        evidence: "Hævn-læk fra eks-stab",
      },
      {
        label: "Giv bonus og skift emne",
        effect: { kasse: -12, mistanke: -2 },
        rel: { parti: 2, lobby: 2 },
        note: "Penge er nemmere end følelser. Indtil de ikke er.",
        reply: {
          default: "De nikker. Smilets pris stod på regningen.",
          papeir: "🦊 “Alle har en pris. Din er rimelig.”",
        },
      },
    ],
  },
  {
    id: "lis_holstebro",
    title: "Lis fra Holstebro",
    emoji: "🗳️",
    npc: "Vælger-Lis",
    headline: "Debat: København vs. resten af landet",
    text: "På live-TV: “I snakker bare indbyrdes. Hvad med os, der ikke bor i en ministerbil?” Værten kigger på dig.",
    weight: 1,
    choices: [
      {
        label: "Vær jordnær og konkret",
        effect: { image: 10, magt: -2 },
        rel: { vaelgere: 14, lobby: -2, parti: 2 },
        note: "Du nævner ventetid og benzin. Lis nikkede. Næsten.",
        reply: {
          default: "Publikum klapper forsigtigt. Det er en sejr i politik.",
          pia: "🐶 “DET er rigtige mennesker!”",
        },
      },
      {
        label: "Teknokrat-svar med tal",
        effect: { magt: 4, image: -6 },
        rel: { vaelgere: -10, parti: 4, presse: -2 },
        note: "Du vandt på point. Tabte på følelser.",
        reply: {
          default: "Lis ruller øjne. Det er værre end et nej.",
          mette: "🦁 “Tallene er vigtige.” Lis er uenig.",
        },
      },
      {
        label: "Send en stedfortræder",
        effect: { mistanke: 3, image: -5 },
        rel: { vaelgere: -10, presse: -6, parti: -2 },
        note: "Du dukkede ikke op. Det gjorde historien.",
        reply: {
          default: "Overskrift: “Fraværende igen.”",
          vanup: "🦚 Dårlig optik. Selv du ved det.",
        },
      },
    ],
  },
  {
    id: "laek_intern",
    title: "Intern læk",
    emoji: "🕵️",
    npc: "AnonTip",
    headline: "Kilder tæt på dig — for tæt",
    text: "AnonTip har noget fra dit bagland. De vil have ro, penge — eller drama. Du har 20 minutter.",
    weight: 1.05,
    choices: [
      {
        label: "Køb stilhed (kasse)",
        effect: { kasse: -14, mistanke: -6 },
        rel: { parti: 2, presse: 2 },
        note: "Roen er købt. Prisen stiger næste gang.",
        reply: {
          default: "En SMS: “Tak for samarbejdet.” Kvalt latter.",
          papeir: "🦊 “Sådan ordner man det.”",
        },
        requireKasse: 10,
        failNote: "Du havde ikke råd. Lækket kom alligevel.",
        failEffect: { mistanke: 10, image: -6 },
        failRel: { presse: -8, parti: -6 },
        failReveal: true,
      },
      {
        label: "Fyr en syndebuk",
        effect: { magt: -5, image: -3, mistanke: -3 },
        rel: { parti: -8, presse: 3 },
        note: "Nogen ryger. Loyaliteten blandt resten: laber.",
        reply: {
          default: "“Det var en svær beslutning.” Det var den ikke.",
          mette: "🦁 “Vi rydder op.” Ingen spørger hvordan.",
        },
      },
      {
        label: "Gå i offensiven i medierne",
        effect: { image: 5, mistanke: 7, magt: 2 },
        rel: { presse: -4, vaelgere: 4, parti: -2 },
        note: "Du snakker dig til en dag mere. Måske.",
        reply: {
          default: "Spin er en sport. Du er i form. I dag.",
          lykke: "🐷 “Man skal kunne lande på benene. Og på forsiden.”",
        },
      },
    ],
  },
  {
    id: "foto_restaurant",
    title: "Foto fra restauranten",
    emoji: "📸",
    npc: "En gæst med telefon",
    headline: "Middag, lobby og dessert til SU-pris",
    text: "Billedet cirkulerer: dig, en lobbyist, og en regning der kunne have betalt en månedsløn. Kommentarsporet er ondt.",
    weight: 1.1,
    minWeek: 3,
    choices: [
      {
        label: "Undskyld på trappen",
        effect: { image: -2, mistanke: -8 },
        rel: { presse: 6, vaelgere: 4, lobby: -4 },
        note: "20 sekunder. Øjenkontakt. Det klædte dig næsten.",
        reply: {
          default: "“Det skulle ikke være sket.” Du mener det 40 %.",
        },
      },
      {
        label: "Kald det networking",
        effect: { mistanke: 6, image: -3 },
        rel: { presse: -6, vaelgere: -6, lobby: 6 },
        note: "Ordet ‘networking’ er nu et meme.",
        reply: {
          default: "Holm twittrer ordbogsdefinitionen. Ouch.",
          papeir: "🦊 “Alt er networking. Også det her.”",
        },
        evidence: "Foto + dårlig forklaring",
      },
      {
        label: "Angrib fotografen",
        effect: { image: -10, mistanke: 10, magt: 2 },
        rel: { presse: -14, vaelgere: -8 },
        note: "Du ser lille ud. Stort drama. Dårlig deal.",
        reply: {
          default: "Nu er historien dig — ikke middagen.",
          pia: "🐶 “De er ude efter os alle!”",
        },
      },
    ],
  },
  {
    id: "rival_smud",
    title: "Rivalens smædekamp",
    emoji: "⚔️",
    npc: "En ‘bekymret kollega’",
    headline: "Læk rettet mod dig — med timing",
    text: "En kollega har ‘bekymringer’. Bekymringerne er strategiske. Pressen elsker dem. Du har tre muligheder.",
    weight: 1,
    choices: [
      {
        label: "Kontra-læk",
        effect: { mistanke: 7, image: 4, magt: 3 },
        rel: { presse: 2, parti: -6, vaelgere: 2 },
        note: "Mudder. Begge veje. Publikum spiser popcorn.",
        reply: {
          default: "I er begge beskidte. Det er et uafgjort.",
          lykke: "🐷 “Velkommen til voksenbordet.”",
        },
        evidenceChance: 0.3,
        evidence: "Gensidig smædekamp — dine prints",
      },
      {
        label: "Tavshed og værdighed",
        effect: { image: 4, mistanke: 2 },
        rel: { vaelgere: 6, presse: -2, parti: 2 },
        note: "Du siger ingenting. Klasse — eller skyld.",
        reply: {
          default: "Nogle kalder det styrke. Andre kalder det panik.",
          mette: "🦁 “Vi fokuserer på danskerne.”",
        },
      },
      {
        label: "Humor på X",
        effect: {},
        rel: {},
        note: "Coinflip: meme-gud eller tone-deaf.",
        reply: { default: "…" },
        coinflip: {
          chance: 0.5,
          win: {
            effect: { image: 12, mistanke: 2 },
            rel: { vaelgere: 10, presse: 4 },
            note: "Memet vinder. Rivalen ser sur ud i 4K.",
            reply: {
              default: "Du er internettets konge. I aften.",
              vanup: "🦚 “Called it.”",
            },
          },
          lose: {
            effect: { image: -8, mistanke: 6 },
            rel: { vaelgere: -6, presse: -4 },
            note: "Fleipen flopper. Tone-deaf er et politisk ord.",
            reply: {
              default: "Slet-knappen findes ikke på TV.",
            },
          },
        },
      },
    ],
  },
  {
    id: "meningsmaal",
    title: "Meningsmålingen",
    emoji: "📊",
    npc: "Analysechefen",
    headline: "Nye tal: Du svinger — eller styrtdykker",
    text: "Tallene er inde. De er… tal. Din analysechef venter på spin-linjen. Hvad er historien?",
    weight: 0.95,
    choices: [
      {
        label: "Spin det som sejr",
        effect: {},
        rel: {},
        note: "Spin er et coinflip.",
        reply: { default: "…" },
        coinflip: {
          chance: 0.55,
          win: {
            effect: { image: 8, mistanke: 2 },
            rel: { vaelgere: 6, presse: -2 },
            note: "Medierne køber rammen. I dag.",
            reply: { default: "“Fremgang!” stod der. Du ved bedre." },
          },
          lose: {
            effect: { image: -6, mistanke: 5 },
            rel: { vaelgere: -6, presse: -4 },
            note: "Alle kan se, at du pynter. Pinsomt.",
            reply: { default: "Faktatjek-kontoen har fest." },
          },
        },
      },
      {
        label: "Ignorer og arbejd",
        effect: { magt: 5, image: -2 },
        rel: { parti: 4, vaelgere: -2 },
        note: "Du nægter at danse. Styrke — eller arrogance.",
        reply: {
          default: "Formanden nikker. Pressen keder sig.",
          mette: "🦁 “Vi leverer. Ikke snak.”",
        },
      },
      {
        label: "Skift linje efter tallene",
        effect: { image: 5, magt: -4, mistanke: 2 },
        rel: { vaelgere: 8, parti: -6, lobby: -4 },
        note: "Principper er dyre. Fleksibilitet er billigere.",
        reply: {
          default: "Du er en vejrhan. Det virker. Desværre.",
          inger: "🦅 “Base glemmer ikke en u-vending.”",
        },
      },
    ],
  },
  // —— Boss-uger (trækkes fast på bestemte uger) ——
  {
    id: "boss_press",
    title: "BOSS: Aftenens pressemøde",
    emoji: "🎙️",
    npc: "Deadline + Holm",
    headline: "LIVE: Du skal svare — nu",
    text: "Studiet er tændt. Tre spørgsmål. Ingen teleprompter. Nationens øjne (og memes) venter.",
    boss: true,
    bossWeek: 6,
    weight: 0,
    isPressBoss: true,
    choices: [], // håndteres som press game
  },
  {
    id: "boss_kommission",
    title: "BOSS: Kommissionen kalder",
    emoji: "⚖️",
    npc: "Kommissionsdommer Graa",
    headline: "Undersøgelse: Dine mapper er på bordet",
    text: "Graa ser dig over brillerne. “Vi har spørgsmål. Og beviser. Hvordan vil De forklare Deres prioriteringer?”",
    boss: true,
    bossWeek: 12,
    weight: 0,
    choices: [
      {
        label: "Samarbejd fuldt ud",
        effect: { mistanke: -10, magt: -4, image: 4 },
        rel: { presse: 8, parti: 4, vaelgere: 4, lobby: -4 },
        note: "Du åbner bøgerne. Nogle sider er… kreative.",
        reply: {
          default: "Graa nikker. “Interessant.” Det er aldrig godt.",
          mette: "🦁 “Vi har intet at skjule.” (Næsten.)",
        },
        clearOneEvidence: true,
      },
      {
        label: "“Jeg husker det ikke”",
        effect: { mistanke: -4, image: -8 },
        rel: { presse: -8, vaelgere: -6, parti: -2 },
        note: "Klassikeren. I en kommission lyder den tynd.",
        reply: {
          default: "Notaren skriver langsomt. Pinligt langsomt.",
          lykke: "🐷 “Hukommelsen er en politisk muskel.”",
        },
      },
      {
        label: "⚠️ Slet spor inden mødet",
        temptation: true,
        effect: { mistanke: 14, magt: 2 },
        rel: { presse: -14, vaelgere: -10, parti: -8 },
        note: "Ét bevis væk. Et meta-bevis født.",
        reply: {
          default: "Graa: “Hvorfor er der huller i journalen?”",
        },
        clearOneEvidence: true,
        evidence: "Mistanke om slettede spor",
        setFlag: "tookTemptation",
      },
    ],
  },
  {
    id: "boss_midtvalg",
    title: "BOSS: Midtvejs-dommen",
    emoji: "🗳️",
    npc: "Vælgerne",
    headline: "Nationens midtvejs-måling — din skæbne i tal",
    text: "Analytikerne er enige om én ting: Det her uge afgør, om du er statsminister-materiale — eller gårsdagens nyhed.",
    boss: true,
    bossWeek: 18,
    weight: 0,
    choices: [
      {
        label: "Stor visionstale",
        effect: { image: 12, mistanke: 3, magt: 4 },
        rel: { vaelgere: 10, parti: 6, presse: 2 },
        note: "Flag, følelser, fremtid. Det virker — hvis du har image.",
        reply: {
          default: "Applaus. Ægte eller købt? Ligegyldigt i aften.",
          vanup: "🦚 Clip det. Post det. Dominér det.",
        },
      },
      {
        label: "Angrib oppositionen hårdt",
        effect: { magt: 8, image: 4, mistanke: 6 },
        rel: { vaelgere: 4, parti: 4, presse: -4, lobby: 2 },
        note: "Krigstone. Dine fans elsker det. Resten tager screenshot.",
        reply: {
          default: "Debatten er gift. Du er giftigere.",
          pia: "🐶 “NU snakker vi!”",
        },
      },
      {
        label: "Hold lav profil og saml brikker",
        effect: { mistanke: -8, magt: -2, image: -2 },
        rel: { presse: 4, parti: 2, vaelgere: -2 },
        note: "Kedelig uge. Overlevelses-uge. Smart uge.",
        reply: {
          default: "Du vinder ikke forsiden. Du vinder mandagen.",
          lykke: "🐷 “De hurtige dør. De seje bliver siddende.”",
        },
      },
    ],
  },
];

/** Karakter-repliker generelt efter handling (fallback) */
const CHAR_QUIPS = {
  lykke: [
    "🐷 “Man skal kunne tale med alle. Også dem man ikke kan tåle.”",
    "🐷 “Jeg har set værre. Jeg har været værre.”",
  ],
  mette: [
    "🦁 “Vi har en plan. Og en plan B.”",
    "🦁 “Partiet holder — så længe vi leverer.”",
  ],
  inger: [
    "🦅 “Nogen skal sige det. Det bliver mig.”",
    "🦅 “Base glemmer ikke. Det er en styrke.”",
  ],
  pia: [
    "🐶 “Politik er ikke te-selskab!”",
    "🐶 “Jeg er ikke fin på den. Punktum.”",
  ],
  papeir: [
    "🦊 “Tillid bygges over en god middag.”",
    "🦊 “Netværk er den eneste rigtige valuta.”",
  ],
  vanup: [
    "🦚 “Hvis det ikke kan forks på 15 sek, er det bureaukrati.”",
    "🦚 “Optik er politik.”",
  ],
};

function resolveReply(reply, charId) {
  if (!reply) return "";
  if (typeof reply === "string") return reply;
  return reply[charId] || reply.default || "";
}

function pickEpisodeForWeek(state) {
  const w = state.week;
  // Boss-uger
  const boss = EPISODES.find((e) => e.boss && e.bossWeek === w);
  if (boss) return boss;

  const pool = EPISODES.filter((e) => {
    if (e.boss) return false;
    if (e.minWeek && w < e.minWeek) return false;
    if (e.maxWeek && w > e.maxWeek) return false;
    // undgå gentagelse for nylig
    if (state.flags.recentEpisodes && state.flags.recentEpisodes.includes(e.id)) {
      return Math.random() < 0.15;
    }
    return true;
  });
  if (!pool.length) return EPISODES.find((e) => !e.boss) || EPISODES[0];
  const total = pool.reduce((s, e) => s + (e.weight || 1), 0);
  let r = Math.random() * total;
  for (const e of pool) {
    r -= e.weight || 1;
    if (r <= 0) return e;
  }
  return pool[pool.length - 1];
}
