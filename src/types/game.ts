// 方格状态枚举
export enum CellState {
  Hidden = 'hidden',      // 未揭开
  Revealed = 'revealed',   // 已揭开
  Flagged = 'flagged',     // 已标记
  Questioned = 'questioned' // 标记问号
}

// 方格内容枚举
export enum CellContent {
  Empty = 0,      // 空白
  Mine = -1,      // 地雷
  Number1 = 1,    // 数字1-8
  Number2 = 2,
  Number3 = 3,
  Number4 = 4,
  Number5 = 5,
  Number6 = 6,
  Number7 = 7,
  Number8 = 8
}

// 单个方格接口
export interface Cell {
  state: CellState
  content: CellContent
  isMine: boolean
  adjacentMines: number
}

// 游戏难度配置
export interface GameDifficulty {
  name: string
  rows: number
  cols: number
  mines: number
}

// 游戏状态接口
export interface GameState {
  board: Cell[][]
  difficulty: GameDifficulty
  gameStatus: 'ready' | 'playing' | 'won' | 'lost'
  timeElapsed: number
  minesRemaining: number
  cellsRevealed: number
}