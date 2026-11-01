# Boekstuk: testproject

Statische website waar je financiële Excel-sjablonen kunt kopen, plus één gratis download.

## Bestanden

| Bestand | Wat het doet |
|---|---|
| `index.html` | De pagina: hero, gratis dashboard, winkel, veelgestelde vragen, winkelmand |
| `style.css` | Alle opmaak |
| `script.js` | Producten (bovenaan in `PRODUCTS`) en winkelmand |
| `uitgaven-dashboard.xlsx` | Het gratis Excel-dashboard voor maandelijkse uitgaven |

## Starten

Dubbelklik op `index.html`, of start een lokale server in deze map:

    python -m http.server 8000

en open daarna http://localhost:8000.

## Aanpassen

- Producten toevoegen of prijzen wijzigen: pas de lijst `PRODUCTS` in `script.js` aan. Prijzen staan in eurocenten (4900 is € 49,00).
- Gratis bestand vervangen: overschrijf `uitgaven-dashboard.xlsx` met dezelfde bestandsnaam.
- Afrekenen is nog niet gekoppeld. De knop toont alleen een testmelding. Voor echte betalingen is een betaalprovider nodig (bijvoorbeeld Mollie of Stripe) en een server die bestanden pas na betaling uitlevert.
