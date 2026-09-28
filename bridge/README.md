# Swiss Master Bridge (Windows test)

Šis ir lokāls Windows palīgs Novuss digitālajam protokolam. Tas nolasa pabeigtos galdus no online sistēmas un, tikai pēc operatora komandas, ievada rezultātu atvērtajā Swiss Master **Edit Results** logā.

## Rezultātu kartējums
- komanda 1 = 1-0
- komanda 2 = 0-1
- komanda 3 = 1/2-1/2

Novuss protokolā īstais rezultāts (piem. 4:2 vai 3:3) paliek nemainīts. Bridge uz Swiss Master nosūta tikai turnīra rezultāta komandu.

## Drošības princips
Pirmā testa versija neko nesūta automātiski. Tā:
1. nolasa /api/swiss-master/results;
2. parāda galdu, abus spēlētājus, Novuss rezultātu un Swiss komandu;
3. operators Swiss Master logā vispirms izvēlas pareizo pāra rindu;
4. bridge nosūta tikai 1, 2 vai 3 uz aktīvo Swiss Master logu.

Tādējādi sākumā pārbaudām rezultātu kartējumu bez aklas klikšķināšanas pēc koordinātēm.

## Palaide
Windows datorā ar Python 3:

```
cd bridge
py swiss_bridge.py --url https://novuss-digital-protocol.onrender.com
```

Atver Swiss Master -> Pairings -> Edit Results. Bridge logā izvēlies rezultātu un nospied **Send selected result**. Pirms nosūtīšanas būs 3 sekunžu atskaite, lai aktivizētu Swiss Master logu un izvēlētos pareizo pāri.

Nākamais solis pēc šī testa: Windows UI Automation, lai bridge pats droši atrod pāri pēc spēlētāju numuriem/vārdiem, nevis pēc ekrāna koordinātēm.
