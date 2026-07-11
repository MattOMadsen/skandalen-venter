# Handlinger & events (indholdskatalog)

> Klar til prototype og udvidelse. Tal er balance-udkast (kan tunes).

**Meters:** Magt (M), Kasse (K), Image (I), Mistanke (S)  
**Bevis:** ja / nej / chance %

---

## Handlinger — alle kan vælge

| id | Navn | Effekt | Bevis | Note |
|----|------|--------|-------|------|
| bilag | Kreativt bilag | +8K, +6S | ja | Klassiker |
| middag | Middag for de rigtige | +5M, +5K, +7S | ja | Netværk |
| laek | Læk til venlig medie | +10I, +8S | 40% | Gæld til presse |
| husker_ikke | “Jeg husker det ikke” | −12S, −5I | nej | Mindre effekt ved gentagelse |
| tale | Stor princip-tale | +12I, +3S | nej | |
| ryd_op | Ryd op i gamle sager | −15S, −8K, −5M | nej | Fjerner 1 tilfældigt bevis |
| angrib | Angrib rival i medierne | +6I, +5S, +3M | 30% | |
| lav_profil | Hold lav profil | −5S, −3M, −3I | nej | Kedeligt men sikkert |
| heste | Hestehandel | +12M, −6I, +6S | 50% | Kræver M≥20 |
| job_ven | Job til en ven | +10M, +5K, +12S | ja | Papeir-bonus |
| slet_sms | Nulstil telefonen | Fjern 1 bevis ELLER +10S meta | — | Risiko |
| live_x | Gå amok online | +15I eller −10I+10S | 20% | Coinflip |

### Unikke (se karakterer.md)
- `brobygning` — Lykke-Dahl  
- `pressemoede` — Fredriksen-Møller  
- `stram_tale` — Støjbjerg-Hansen  
- `salen_amok` — Kæftsgaard  
- `middag_papeir` — Papeir (stærkere middag)  
- `gaa_live` — Vanup  

---

## Events (trækkes ofte hver uge)

| id | Titel | Valg (kort) |
|----|-------|-------------|
| journalist | Journalist Holm ringer | Samarbejd / bluf / luk røret |
| formand | Formanden vil have en snak | Loyalt nikk / kræv noget / ignorer |
| laek_intern | Intern utilfredshed | Betal stilhed / fyr nogen / lad det ligge |
| meningsmaal | Ny måling | Udnyt med spin / ignorer / skift linje |
| foto_middag | Foto fra restaurant | Indrøm / “arbejdsrelateret” / angrib fotograf |
| kommission_rygte | Kommission i luften | Forbered / slet spor / offentlig selvtillid |
| stab_press | Stabschefen er presset | Støt dem / ofre dem / giv bonus |
| vaelger_lis | Lis fra Holstebro på TV | Vær jordnær / vær teknokrat / send stedfortræder |
| lobby | Lobby vil have §-ændring | Tag imod / afvis / tag imod i hemmelighed |
| rival_attack | Rival lækker om dig | Kontra-læk / tavshed / humor |
| bevis_dukker | Gammelt bevis dukker op | Automatisk hvis beviser > 0 |
| gæld_forfald | En gammel tjeneste forfalder | Betal / afvis / snyd |

---

## Overskrifter (skabeloner)

- “Kilder: {navn} midt i ny bilagsballade”  
- “Presset stiger: Kan {navn} overleve ugen?”  
- “Partiet bakker op — for nu”  
- “Eksperter: ‘Det her lugter’”  
- “{navn} afviser alt: ‘Ren smædekampagne’”  
- “Intern mail lækket — og den er ikke pæn”  
- “Vælgerne straffer dobbeltmoral, viser måling”  
- “Kongemager set til middag med begge sider”  

---

## Game over-overskrifter

- “{navn} trækker sig efter massivt pres”  
- “Historisk fald: Fra top til skandale på {uger} uger”  
- “Kommissionen blev dråben”  
- “Partiet smed yndlingsbarnet under bussen”  
- “Det endte med 47 kroner og en taxa”  

## Sejrs-overskrifter

- “{navn} overlever perioden — mod alle odds”  
- “Statsministeren ingen troede på”  
- “Ren på papiret, snu i praksis”  
- “Kaos, kasse og kronen: En usædvanlig sejr”
