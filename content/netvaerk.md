# Netværk & forhold

> Skjulte og åbne bånd mellem figurer og aktører.
> Bruges til events: “X ringer”, “Y lækker”, “Z vil have en tjeneste tilbage”.

---

## Spillbare karakterer indbyrdes

```
                    [Lykke-Dahl]
                   /     |      \
                  /      |       \
    [Papeir] ----+   (kongemager) +---- [Fredriksen-Møller]
         \           |                    /
          \     [Vanup]                  /
           \       |                    /
            \      |                   /
         [Støjbjerg-Hansen] ---- [Kæftsgaard]
              (konkurrenter om "klar tale"-pladsen)
```

### Relationer (spil-effekt)

| Par | Type | Hvad det betyder |
|-----|------|------------------|
| Lykke-Dahl ↔ næsten alle | **Gammel gæld** | Kan 1× pr. kampagne indløse “favør” (+magt) mod senere bevis eller −image |
| Lykke-Dahl ↔ Fredriksen-Møller | **Respektfuld rivalisering** | Hestehandel nemmere; læk imod hinanden hårdere |
| Papeir ↔ Lykke-Dahl | **Middagsvenner** | Delte netværks-events; bilag kan ramme begge |
| Papeir ↔ erhvervsliv | **Svingdør** | Ekstra kasse-muligheder, ekstra habilitet-events |
| Støjbjerg ↔ Kæftsgaard | **Kamp om basen** | Hvis den ene booster base, kan den anden stjæle image |
| Støjbjerg ↔ Fredriksen-Møller | **Offentlig fejde** | Angreb-handlinger billigere, forlig dyrere |
| Vanup ↔ medier | **Symbiose** | Flere medie-events; både redning og ruin |
| Vanup ↔ Lykke-Dahl | **Mentor/projekt** | Lykke kan give Vanup magt — mod loyalitet |
| Kæftsgaard ↔ “gaden” | **Anti-elite** | Dårlig til fin-spin, god til mobilisering |
| Fredriksen-Møller ↔ parti | **Jern-disciplin** | Parti beskytter længere — indtil du er gift |

---

## Faste NPC-aktører

### Presse
| NPC | Profil | Gør hvad |
|-----|--------|----------|
| **Redaktør Holm** | “Seriøs gravende” | Trækker beviser frem; hader spin |
| **Liv på Deadline** | TV-vært | Pressemøde-events; image coinflip |
| **AnonTip** | Læk-kanal | Kan købes (kasse) eller ramme dig |
| **Trend & Spite (X)** | Folkehavet | Forstærker flop og viral succes |

### Parti & system
| NPC | Profil | Gør hvad |
|-----|--------|----------|
| **Formanden** | Holder på magten | Smider dig hvis image+mistanke er gift |
| **Gruppesekretæren** | Ved alt | Advarer 1× før skandalen; vil have loyalitet |
| **Departementschefen** | Embedsværk | “Instruks”-events; kan ofres eller ofre dig |
| **Stabschefen** | Din skygge | Bonus i krise; lækker hvis du svigter dem |

### Magt uden for salen
| NPC | Profil | Gør hvad |
|-----|--------|----------|
| **Lobby-Lars** (fiktiv) | Erhverv | Kasse mod politiske tjenester |
| **Fagboss Finn** | Organiseret interesse | Image-base eller blokade |
| **Kommissionsdommer Graa** | Sent game | Tæller beviser; game-over-risk |
| **Vælger-Lis fra Holstebro** | “Mennesket” | Random image-check: er du blevet for københavnsk? |

---

## Gæld & favører (mekanik)

Når du bruger netværk, oprettes en **Gæld-markør**:

```
{ fra: "Papeir", til: "Lobby-Lars", type: "job_løfte", forfald: uge+4 }
```

Ved forfald:
- **Betal** (magt/kasse/handling) → ro  
- **Ignorer** → læk / −image / bevis  
- **Snyd dig ud** → +mistanke, måske ok  

Det binder den **lange kampagne** sammen: uge 3’s middag bliver uge 18’s overskrift.

---

## Hemmelige trekanter (kampagne-twists)

1. **Middagsfotoet** — Lykke + Papeir + Lobby i samme restaurant som dig (selv hvis du ikke er dem). Presse: “Hvad lavede *du* der?”  
2. **Læk-kæden** — Din stabschef → AnonTip → Holm. Du kan stoppe den med kasse eller true med magt.  
3. **Base-krigen** — Støjbjerg-type NPC stjæler din dagsorden hvis du er Kæftsgaard (eller omvendt).  
4. **Kongemagerens pris** — Lykke tilbyder dig regeringspost: +magt nu, 2 gæld-markører senere.  
5. **Familie & feed** — Vanup-relateret privat sag; andre karakterer kan “udvise støtte” offentligt for image.

---

## Hvem kender hvis beviser?

| Bevistype | Typisk “ejer” der kan afsløre |
|-----------|-------------------------------|
| Bilag/kvittering | Holm, revisor, intern |
| SMS/chat | Stabschef, eks-ven, AnonTip |
| Hestehandel | Lykke-netværk, Lobby |
| Instruks | Departementschef, kommission |
| Foto/middag | X, livereporter, tilfældig gæst |
| Bestyrelse/habilitet | Holm, rival i parti |

---

## Brug i prototype

MVP behøver ikke fuld graf. Minimum:
- 4–6 NPC-navne i event-tekster  
- 1 gæld-system (simpel tæller)  
- 1 “relation til din karakter” der ændrer 1–2 events  

Resten udvides i fase 2.
