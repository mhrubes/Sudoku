export type Difficulty = 'easy' | 'medium' | 'hard'

const TARGET_GIVENS: Record<Difficulty, number> = {
  easy: 44,
  medium: 34,
  hard: 26,
}

function emptyGrid(): number[][] {
  return Array.from({ length: 9 }, () => Array(9).fill(0))
}

function copyGrid(g: number[][]): number[][] {
  return g.map((row) => [...row])
}

function shuffle<T>(items: T[]): T[] {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function allCoords(): [number, number][] {
  const coords: [number, number][] = []
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) coords.push([r, c])
  }
  return coords
}

function isValidMove(board: number[][], row: number, col: number, num: number): boolean {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num || board[i][col] === num) return false
  }
  const br = Math.floor(row / 3) * 3
  const bc = Math.floor(col / 3) * 3
  for (let r = br; r < br + 3; r++) {
    for (let c = bc; c < bc + 3; c++) {
      if (board[r][c] === num) return false
    }
  }
  return true
}

function fillBoard(board: number[][]): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) {
        const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])
        for (const n of nums) {
          if (isValidMove(board, r, c, n)) {
            board[r][c] = n
            if (fillBoard(board)) return true
            board[r][c] = 0
          }
        }
        return false
      }
    }
  }
  return true
}

function generateSolvedGrid(): number[][] {
  const board = emptyGrid()
  fillBoard(board)
  return board
}

function countSolutions(board: number[][], limit: number): number {
  let count = 0

  function dfs(): void {
    if (count >= limit) return
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === 0) {
          for (let n = 1; n <= 9; n++) {
            if (isValidMove(board, r, c, n)) {
              board[r][c] = n
              dfs()
              board[r][c] = 0
              if (count >= limit) return
            }
          }
          return
        }
      }
    }
    count++
  }

  dfs()
  return count
}

function carvePuzzle(solution: number[][], targetGivens: number): number[][] {
  const puzzle = copyGrid(solution)
  let givens = 81
  const positions = shuffle(allCoords())

  for (const [r, c] of positions) {
    if (givens <= targetGivens) break
    const backup = puzzle[r][c]
    puzzle[r][c] = 0
    const trial = copyGrid(puzzle)
    if (countSolutions(trial, 2) === 1) {
      givens--
    } else {
      puzzle[r][c] = backup
    }
  }

  if (givens > targetGivens) {
    const extra = shuffle(allCoords())
    for (const [r, c] of extra) {
      if (givens <= targetGivens) break
      if (puzzle[r][c] === 0) continue
      const backup = puzzle[r][c]
      puzzle[r][c] = 0
      const trial = copyGrid(puzzle)
      if (countSolutions(trial, 2) === 1) {
        givens--
      } else {
        puzzle[r][c] = backup
      }
    }
  }

  return puzzle
}

export function generatePuzzle(difficulty: Difficulty): { puzzle: number[][]; solution: number[][] } {
  const target = TARGET_GIVENS[difficulty]
  for (let attempt = 0; attempt < 80; attempt++) {
    const solution = generateSolvedGrid()
    const puzzle = carvePuzzle(solution, target)
    let givens = 0
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (puzzle[r][c] !== 0) givens++
      }
    }
    if (givens <= target) {
      return { puzzle, solution }
    }
  }
  const solution = generateSolvedGrid()
  return { puzzle: carvePuzzle(solution, target), solution }
}

export function isBoardComplete(board: number[][]): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) return false
    }
  }
  return true
}

export function matchesSolution(board: number[][], solution: number[][]): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] !== solution[r][c]) return false
    }
  }
  return true
}

export function parseDifficulty(param: string | undefined): Difficulty | null {
  if (param === 'easy' || param === 'medium' || param === 'hard') return param
  return null
}
