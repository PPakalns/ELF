# Executable and Linkable Format visualiser

## Autori

Pēteris Pakalns (pp15008)

Mārtiņš Osmanis (mo15008)

Toms Mucenieks (tm13023)

## Vizualizācija

Izstrādātais darbs ir apskatāms: https://ppakalns.github.io/ELF/

Darba izstrādes repozitorijs: https://github.com/PPakalns/ELF

## Mērķi

Uzskatāmi un ar pareizām attiecībām attēlot:
* ELF faila saturu,
* tā struktūru izvietojumu failā,
* tā struktūru izvietojumu atmiņā pēc programmas ielādes.

## Lietošanas instrukcijas

1. Atveriet lapu,
1. Veiciet elf faila izvēli:
    - testēšanai var izmantot izpildāmos failus no lokālā linux,
    - var izvēlēties 64 bitu elf failus no https://github.com/JonathanSalwan/binary-samples ,
    - *vizualizācija patreiz atbalsta tikai 64bit ELF formātu.*
2. Vizualizācija izvada informāciju par:
    - Elf header saturu,
    - Program header table saturu,
    - Section header table saturu,
    - vizualizē sekcijas, programmas segmentus - atmiņā, failā.

Vizualizācija ir interaktīva, ir iespējams mainīt vizualizācijas `offset` un `zoom`.
Vizualizācijā struktūras var automātiski pietuvināt tās izvēloties vizualizācijas leģendā.

Lokālai uzstādīšanai:
    * uzstādiet jaunāko `npm` un `node.js` versiju,
    * sekojiet instrukcijām `README.md` failā.
