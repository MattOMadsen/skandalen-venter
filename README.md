# Skandalen venter

**Dansk politisk satire-spil** i browseren.  
Vælg en næsten-rigtig politiker, snyd dig til magt — og undgå at blive opdaget.

> Open source under **MIT-licens**. Du må bruge, kopiere, ændre og dele frit.

![Licens](https://img.shields.io/badge/license-MIT-yellow)
![Platform](https://img.shields.io/badge/platform-browser-blue)
![Sprog](https://img.shields.io/badge/sprog-dansk-red)

## Spil online

**https://mattomadsen.github.io/skandalen-venter/**  

(Også: https://mattomadsen.github.io/ )

Deployes automatisk fra `main` via GitHub Pages.

## Spil lokalt

1. Klon eller download repoet  
2. Åbn `index.html` i Chrome/Firefox (dobbeltklik eller træk ind i browseren)

```bash
git clone https://github.com/MattOMadsen/skandalen-venter.git
cd skandalen-venter
# Valgfrit: lokal server
python3 -m http.server 8080
# → http://localhost:8080
```

## Om spillet

- **6 karakterer** som dyre-karikaturer (gris, løvinde, høg, bulldog, ræv, påfugl)
- **4 relationer** (Parti, Presse, Vælgere, Lobby) — for lav *eller* for høj = game over (Reigns-vibes)
- **Meters:** Magt, Kasse, Image, Mistanke
- **Fristelser** (kuverter, slettede mapper…) med høj risiko/gevinst
- **Uge-typer:** stille, normal, krise, fristelse
- **Pressemøde-minispil** (3 live-spørgsmål)
- **Bevis-bunke** og gæld der forfalder senere
- **~24 ugers kampagne** + delbar slutrapport

Tone: humoristisk satire over politiske *mønstre* (bilag, netværk, spin) — **fiktive navne**, ikke konkrete sager om rigtige personer.

## Struktur

```
index.html          # Spil-UI
css/style.css       # Design
js/data.js          # Karakterer, handlinger, events
js/game.js          # Spil-loop
img/                # Karikatur-portrætter
content/            # Designnoter (karakterer, skandaler, netværk)
LICENSE             # MIT
```

## Bidrag

Pull requests og issues er velkomne!

Idéer til forbedringer:
- Flere events / karakterer
- Balance-tuning
- Deploy (GitHub Pages)
- Lyd / animationer
- Engelsk oversættelse

1. Fork repoet  
2. Lav en branch (`git checkout -b feature/min-ide`)  
3. Commit og push  
4. Åbn en pull request  

## Licens

[MIT](LICENSE) — frit at bruge og ændre. Bevar copyright-notitsen.

Portrætterne er genererede satire-illustrationer til spillet.

## Inspiration

Design-idéer fra bl.a. *Reigns*, *Papers, Please*, *Tropico*, *Suzerain* og browser-satire-spil — tilpasset dansk kontekst.

---

**Skandalen venter.** Klar til din uge?
