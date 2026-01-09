import { ref } from 'vue'
import type { Cell, GameDifficulty, GameState } from '@/types/game'
import { CellState, CellContent } from '@/types/game'

// 游戏难度配置
const DIFFICULTIES: GameDifficulty[] = [
  { name: '初级', rows: 9, cols: 9, mines: 10 },
  { name: '中级', rows: 16, cols: 16, mines: 40 },
  { name: '高级', rows: 16, cols: 30, mines: 99 }
]

export function useGame() {
  const gameState = ref<GameState>({
    board: [],
    difficulty: DIFFICULTIES[0],
    gameStatus: 'ready',
    timeElapsed: 0,
    minesRemaining: DIFFICULTIES[0].mines,
    cellsRevealed: 0
  })
  // 空占位，无额外声明或语句

  const timer = ref<ReturnType<typeof setInterval> | null>(null)

  // 创建空白棋盘
  const createEmptyBoard = (rows: number, cols: number): Cell[][] => {
    return Array(rows).fill(null).map(() =>
      Array(cols).fill(null).map(() => ({
        state: CellState.Hidden,
        content: CellContent.Empty,
        isMine: false,
        adjacentMines: 0
      }))
    )
  }

  // 随机放置地雷
  const placeMines = (board: Cell[][], mineCount: number, firstClickRow: number, firstClickCol: number) => {
    const rows = board.length
    const cols = board[0].length
    const positions: Array<[number, number]> = []

    // 生成所有可能的位置（除了第一次点击的位置及其周围）
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (Math.abs(r - firstClickRow) <= 1 && Math.abs(c - firstClickCol) <= 1) continue
        positions.push([r, c])
      }
    }

    // 随机选择位置放置地雷
    for (let i = 0; i < mineCount && positions.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * positions.length)
      const [row, col] = positions.splice(randomIndex, 1)[0]
      board[row][col].isMine = true
      board[row][col].content = CellContent.Mine
    }
  }

  // 计算相邻地雷数
  const calculateAdjacentMines = (board: Cell[][]) => {
    const rows = board.length
    const cols = board[0].length

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (board[r][c].isMine) continue

        let count = 0
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue
            const nr = r + dr
            const nc = c + dc
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].isMine) {
              count++
            }
          }
        }

        board[r][c].adjacentMines = count
        if (count > 0) {
          board[r][c].content = count as CellContent
        }
      }
    }
  }

  // 初始化游戏
  const initializeGame = (difficultyIndex: number) => {
    const difficulty = DIFFICULTIES[difficultyIndex]
    const board = createEmptyBoard(difficulty.rows, difficulty.cols)

    gameState.value = {
      board,
      difficulty,
      gameStatus: 'ready',
      timeElapsed: 0,
      minesRemaining: difficulty.mines,
      cellsRevealed: 0
    }

    stopTimer()
  }

  // 第一次点击后开始游戏
  const startGame = (firstClickRow: number, firstClickCol: number) => {
    if (gameState.value.gameStatus !== 'ready') return

    const board = gameState.value.board
    placeMines(board, gameState.value.difficulty.mines, firstClickRow, firstClickCol)
    calculateAdjacentMines(board)

    gameState.value.gameStatus = 'playing'
    startTimer()
  }

  // 揭开方格
  const revealCell = (row: number, col: number) => {
    const cell = gameState.value.board[row][col]
    if (cell.state !== CellState.Hidden || gameState.value.gameStatus === 'won' || gameState.value.gameStatus === 'lost') {
      return
    }

    // 第一次点击
    if (gameState.value.gameStatus === 'ready') {
      startGame(row, col)
    }

    // 踩雷
    if (cell.isMine) {
      cell.state = CellState.Revealed
      gameState.value.gameStatus = 'lost'
      stopTimer()
      return
    }

    // 揭开方格
    revealCellRecursive(row, col)

    // 检查胜利
    if (checkWin()) {
      gameState.value.gameStatus = 'won'
      stopTimer()
    }
  }

  // 递归揭开方格
  const revealCellRecursive = (row: number, col: number) => {
    const cell = gameState.value.board[row][col]
    if (cell.state !== CellState.Hidden || cell.isMine) return

    cell.state = CellState.Revealed
    gameState.value.cellsRevealed++

    // 如果是空白方格，递归揭开相邻方格
    if (cell.adjacentMines === 0) {
      const rows = gameState.value.board.length
      const cols = gameState.value.board[0].length

      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue
          const nr = row + dr
          const nc = col + dc
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            revealCellRecursive(nr, nc)
          }
        }
      }
    }
  }

  // 标记方格
  const toggleFlag = (row: number, col: number) => {
    const cell = gameState.value.board[row][col]
    if (cell.state === CellState.Revealed || gameState.value.gameStatus === 'won' || gameState.value.gameStatus === 'lost') {
      return
    }

    if (cell.state === CellState.Hidden) {
      cell.state = CellState.Flagged
      gameState.value.minesRemaining--
    } else if (cell.state === CellState.Flagged) {
      cell.state = CellState.Hidden
      gameState.value.minesRemaining++
    }
  }

  // 检查胜利
  const checkWin = (): boolean => {
    const totalCells = gameState.value.difficulty.rows * gameState.value.difficulty.cols
    const nonMineCells = totalCells - gameState.value.difficulty.mines
    return gameState.value.cellsRevealed >= nonMineCells
  }

  // 计时器
  const startTimer = () => {
    if (timer.value) return
    timer.value = setInterval(() => {
      if (gameState.value.gameStatus === 'playing') {
        gameState.value.timeElapsed++
      }
    }, 1000)
  }

  const stopTimer = () => {
    if (timer.value) {
      clearInterval(timer.value)
      timer.value = null
    }
  }

  // 重置游戏
  const resetGame = () => {
    const currentDifficultyIndex = DIFFICULTIES.findIndex(d => d.name === gameState.value.difficulty.name)
    initializeGame(currentDifficultyIndex)
  }

  // 切换难度
  const changeDifficulty = (difficultyIndex: number) => {
    initializeGame(difficultyIndex)
  }

  return {
    gameState,
    initializeGame,
    revealCell,
    toggleFlag,
    resetGame,
    changeDifficulty
  }
}
