# Novuss digitālais protokols

Pilnīgi atsevišķs projekts Swiss Master Novuss turnīra galdu digitālajiem protokoliem.

## Pamatprincipi
- Swiss Master paliek izlozes un turnīra aprēķinu galvenā programma.
- Šī aplikācija lasa Swiss Master Excel `EKSPORT` lapu un sadala pēc `Galds`.
- Katram telefonam ir savs galds un pagaidu piekļuves tokens.
- Maksimums 7 izspēles; 7. izspēle ir pieejama visu laiku.
- `3:3` ir derīgs beigu rezultāts; 7. izspēle nav obligāta.
- `PABEIGT SPĒLI` aktīva pie 4:0, 4:1, 4:2, 0:4, 1:4, 2:4, 3:3, 4:3, 3:4.
- ŠTOSE ir atsevišķa uzskaite un nevar būt negatīva.
- Turnīra beigas deaktivizē telefona piekļuves.
- PostgreSQL šim projektam ir atsevišķs no citiem projektiem.

## Palaide
`npm install` un `npm start`. Render vidē jāiestata atsevišķs `DATABASE_URL`.

## Maršruti
- `/admin` — centrālais panelis
- `/table.html?token=...` — konkrētā galda telefona protokols
- `/api/rounds/import` — Excel imports
- `/api/tournament/end` — turnīra beigas

## Vēlāk
QR kodi, telefona nomaiņa spēles laikā, gada ŠTOSE tabula, mapes uzraudzība un droša 1/2/3 ievade Swiss Master.
