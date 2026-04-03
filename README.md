# Sudoku

Jednoduchá webová aplikace na hraní klasického Sudoku (9×9). Projekt vznikl jako experiment: **kód byl vygenerovaný a iterovaný výhradně pomocí nástrojů umělé inteligence** (asistent v editoru / LLM), bez ručního programování od nuly. Slouží jako ukázka toho, jak lze podobnou hru složit z hotových knihoven a smysluplných promptů.

## Stack

- **React** + **TypeScript** + **Vite**
- **Bootstrap** pro rozhraní, **React Router** pro stránky, lokalizace CZ / EN / SK, tmavý a světlý režim

## Spuštění

```bash
npm install
npm run dev
```

Produkční sestavení: `npm run build`, náhled: `npm run preview`.

## Konfigurace (`.env`)

V kořeni projektu můžeš vytvořit soubor **`.env`** (není v gitu; šablonu najdeš v **`.env.example`**, pokud ji v repozitáři máš). Vite do prohlížeče předává jen proměnné s prefixem **`VITE_`**. Po každé změně `.env` je potřeba **znovu spustit** `npm run dev` nebo znovu spustit build.

| Proměnná | Význam |
|----------|--------|
| `VITE_SEQUENTIAL_CHECK_EASY` | Max. počet použití **Postupná kontrola** na jednu hru — **lehká** obtížnost |
| `VITE_SEQUENTIAL_CHECK_MEDIUM` | Stejné pro **střední** obtížnost |
| `VITE_SEQUENTIAL_CHECK_HARD` | Stejné pro **těžkou** obtížnost |

- Pokud proměnná **chybí**, je **prázdná**, nebo hodnota **není nezáporné celé číslo**, použije se výchozí **`5`**.
- Hodnota **`0`** znamená, že je postupná kontrola pro danou obtížnost **vypnutá** (tlačítko od začátku neaktivní).

Hodnoty se načítají v **`src/config.ts`** při sestavení / startu dev serveru.
