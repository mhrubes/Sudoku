# Sudoku

Jednoduchá webová aplikace na hraní klasického Sudoku (9×9). Projekt vznikl jako experiment: **kód byl vygenerovaný a iterovaný výhradně pomocí nástrojů umělé inteligence** (asistent v editoru / LLM), bez ručního programování od nuly. Slouží jako ukázka toho, jak lze podobnou hru složit z hotových knihoven a smysluplných promptů.

## Živá ukázka

Aplikaci si můžeš rovnou vyzkoušet v prohlížeči na adrese <a href="https://mh-sudoku-ai.vercel.app/" target="_blank" rel="noopener noreferrer">https://mh-sudoku-ai.vercel.app/</a> — odkaz se otevře v **novém okně / záložce** (nasazení na Vercel).

## Stack

-   **React** + **TypeScript** + **Vite**
-   **Bootstrap** pro rozhraní, **React Router** pro stránky, lokalizace CZ / EN / SK, tmavý a světlý režim

## Přepínače vpravo nahoře

Ve **fixní liště** v pravém horním rohu (nad obsahem stránky) jsou tři ovládací prvky zleva doprava:

| Prvek                | Funkce                                                                                                                                                                                                                                                                                                                            |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Jazyk**            | Tři tlačítka **CZ / EN / SK** — přepínají jazyk rozhraní (texty tlačítek, nápovědy, hlášky). Volba se ukládá do prohlížeče (`localStorage`).                                                                                                                                                                                      |
| **Nápověda u bloku** | Kulaté tlačítko s ikonou **mřížky** — zapne nebo vypne **bublinu nad vybraným políčkem**, kde se zobrazí jen **číslice**, které v daném 3×3 bloku ještě chybí (když už v bloku nic nechybí, bublina se neukáže). Ve vypnutém stavu je tlačítko šedé, ve zapnutém zvýrazněné (modrý obrys). Nastavení se ukládá do `localStorage`. |
| **Režim zobrazení**  | Kulaté tlačítko se sluncem / měsícem — přepíná **světlý** a **tmavý** motiv (barvy pozadí a mřížky). Volba se ukládá do `localStorage`.                                                                                                                                                                                           |

## Spuštění

```bash
npm install
npm run dev
```

Produkční sestavení: `npm run build`, náhled: `npm run preview`.

## Konfigurace (`.env`)

V kořeni projektu můžeš vytvořit soubor **`.env`** (není v gitu; šablonu najdeš v **`.env.example`**, pokud ji v repozitáři máš). Vite do prohlížeče předává jen proměnné s prefixem **`VITE_`**. Po každé změně `.env` je potřeba **znovu spustit** `npm run dev` nebo znovu spustit build.

| Proměnná                       | Význam                                                                        |
| ------------------------------ | ----------------------------------------------------------------------------- |
| `VITE_SEQUENTIAL_CHECK_EASY`   | Max. počet použití **Postupná kontrola** na jednu hru — **lehká** obtížnost   |
| `VITE_SEQUENTIAL_CHECK_MEDIUM` | Max. počet použití **Postupná kontrola** na jednu hru — **střední** obtížnost |
| `VITE_SEQUENTIAL_CHECK_HARD`   | Max. počet použití **Postupná kontrola** na jednu hru — **těžká** obtížnost   |

-   Pokud proměnná **chybí**, je **prázdná**, nebo hodnota **není nezáporné celé číslo**, použije se výchozí **`5`**.
-   Hodnota **`0`** znamená, že je postupná kontrola pro danou obtížnost **vypnutá** (tlačítko od začátku neaktivní).

Hodnoty se načítají v **`src/config.ts`** při sestavení / startu dev serveru.
