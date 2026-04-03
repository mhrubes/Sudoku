import type { Locale } from './locale'

export type MessageTree = {
  home: { title: string; easy: string; medium: string; hard: string }
  difficulty: { easy: string; medium: string; hard: string }
  game: {
    back: string
    level: string
    grid: string
    sequential: string
    finish: string
    checking: string
    help: string
    timerAria: string
    numpadAria: string
    clearCell: string
    boxTooltipAria: string
  }
  theme: {
    lightTitle: string
    darkTitle: string
    lightAria: string
    darkAria: string
  }
  toast: {
    fillAll: string
    solved: string
    wrong: string
    sequentialNeedCells: string
    sequentialExhausted: string
  }
  lang: {
    pickerAria: string
  }
  hints: {
    boxTooltipOnTitle: string
    boxTooltipOffTitle: string
    boxTooltipOnAria: string
    boxTooltipOffAria: string
  }
}

export const messages: Record<Locale, MessageTree> = {
  cs: {
    home: {
      title: 'Sudoku',
      easy: 'Lehká',
      medium: 'Střední',
      hard: 'Těžká',
    },
    difficulty: {
      easy: 'Lehká',
      medium: 'Střední',
      hard: 'Těžká',
    },
    game: {
      back: '← Zpět',
      level: 'Úroveň:',
      grid: 'Sudoku mřížka',
      sequential: 'Postupná kontrola',
      finish: 'Dokončit',
      checking: 'Kontroluji…',
      help:
        'Klikněte na prázdné políčko a zadejte číslici 1–9 (Backspace smaže). Na mobilu použijte číselník pod mřížkou. Postupná kontrola projde vaše vyplněná pole a zvýrazní správná zeleně a chybná červeně.',
      timerAria: 'Uplynulý čas hry',
      numpadAria: 'Zadání číslice',
      clearCell: 'Smazat',
      boxTooltipAria: 'Chybějící číslice v bloku:',
    },
    theme: {
      lightTitle: 'Světlý režim',
      darkTitle: 'Tmavý režim',
      lightAria: 'Přepnout na světlý režim',
      darkAria: 'Přepnout na tmavý režim',
    },
    toast: {
      fillAll: 'Vyplňte všechna políčka před kontrolou.',
      solved: 'Správně! Sudoku je vyřešeno.',
      wrong: 'Řešení není správné. Zkuste to znovu.',
      sequentialNeedCells:
        'Nejdřív vyplňte alespoň jedno pole (mimo zadaná čísla).',
      sequentialExhausted:
        'Dobrý pokus, ale už jsi vyčerpal počet postupných kontrol pro tuto hru.',
    },
    lang: {
      pickerAria: 'Jazyk aplikace',
    },
    hints: {
      boxTooltipOnTitle: 'Zapnout nápovědu u bloku',
      boxTooltipOffTitle: 'Vypnout nápovědu u bloku',
      boxTooltipOnAria: 'Zapnout zobrazení chybějících číslic v označeném 3×3 bloku',
      boxTooltipOffAria: 'Vypnout nápovědu u políčka',
    },
  },
  en: {
    home: {
      title: 'Sudoku',
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard',
    },
    difficulty: {
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard',
    },
    game: {
      back: '← Back',
      level: 'Level:',
      grid: 'Sudoku grid',
      sequential: 'Step-by-step check',
      finish: 'Finish',
      checking: 'Checking…',
      help:
        'Click an empty cell and enter a digit 1–9 (Backspace clears). On mobile, use the keypad below the grid. Step-by-step check goes through your filled cells and highlights correct answers in green and wrong ones in red.',
      timerAria: 'Elapsed play time',
      numpadAria: 'Digit entry',
      clearCell: 'Clear',
      boxTooltipAria: 'Missing digits in box:',
    },
    theme: {
      lightTitle: 'Light mode',
      darkTitle: 'Dark mode',
      lightAria: 'Switch to light mode',
      darkAria: 'Switch to dark mode',
    },
    toast: {
      fillAll: 'Fill all cells before checking.',
      solved: 'Correct! Sudoku is solved.',
      wrong: 'The solution is not correct. Try again.',
      sequentialNeedCells:
        'Fill at least one cell first (other than the given numbers).',
      sequentialExhausted:
        "Nice try, but you've used all step-by-step checks for this game.",
    },
    lang: {
      pickerAria: 'App language',
    },
    hints: {
      boxTooltipOnTitle: 'Turn on box hints',
      boxTooltipOffTitle: 'Turn off box hints',
      boxTooltipOnAria: 'Show which digits are still missing in the 3×3 box',
      boxTooltipOffAria: 'Hide the hint above the selected cell',
    },
  },
  sk: {
    home: {
      title: 'Sudoku',
      easy: 'Ľahká',
      medium: 'Stredná',
      hard: 'Ťažká',
    },
    difficulty: {
      easy: 'Ľahká',
      medium: 'Stredná',
      hard: 'Ťažká',
    },
    game: {
      back: '← Späť',
      level: 'Úroveň:',
      grid: 'Sudoku mriežka',
      sequential: 'Postupná kontrola',
      finish: 'Dokončiť',
      checking: 'Kontrolujem…',
      help:
        'Kliknite na prázdne políčko a zadajte číslicu 1–9 (Backspace vymaže). Na mobile použite číselník pod mriežkou. Postupná kontrola prejde vaše vyplnené polia a zvýrazní správne zelenou a nesprávne červenou.',
      timerAria: 'Čas hrania',
      numpadAria: 'Zadanie číslice',
      clearCell: 'Zmazať',
      boxTooltipAria: 'Chýbajúce číslice v bloku:',
    },
    theme: {
      lightTitle: 'Svetlý režim',
      darkTitle: 'Tmavý režim',
      lightAria: 'Prepnúť na svetlý režim',
      darkAria: 'Prepnúť na tmavý režim',
    },
    toast: {
      fillAll: 'Pred kontrolou vyplňte všetky políčka.',
      solved: 'Správne! Sudoku je vyriešené.',
      wrong: 'Riešenie nie je správne. Skúste to znova.',
      sequentialNeedCells:
        'Najprv vyplňte aspoň jedno pole (mimo zadané čísla).',
      sequentialExhausted:
        'Dobrý pokus, ale už si vyčerpal počet postupných kontrol pre túto hru.',
    },
    lang: {
      pickerAria: 'Jazyk aplikácie',
    },
    hints: {
      boxTooltipOnTitle: 'Zapnúť nápovedu pri bloku',
      boxTooltipOffTitle: 'Vypnúť nápovedu pri bloku',
      boxTooltipOnAria: 'Zapnúť zobrazenie chýbajúcich číslic v označenom 3×3 bloku',
      boxTooltipOffAria: 'Vypnúť nápovedu pri políčku',
    },
  },
}
