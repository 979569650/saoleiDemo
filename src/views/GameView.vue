<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full">
      <h1 class="text-3xl font-bold text-center mb-6 text-gray-800">扫雷游戏</h1>

      <!-- 难度选择 -->
      <DifficultySelector :difficulties="difficulties" :current-difficulty-index="currentDifficultyIndex"
        @change-difficulty="handleDifficultyChange" />

      <div class="flex justify-center mb-4">
        <button
          class="px-6 py-2 bg-gray-300 border-2 border-t-white border-l-white border-b-gray-600 border-r-gray-600 hover:bg-gray-200 active:border-t-gray-600 active:border-l-gray-600 active:border-b-white active:border-r-white disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!isWaitingToStart || gameState.gameStatus === 'playing'" @click="handleStart">
          开始游戏
        </button>
      </div>

      <!-- 游戏状态 -->
      <GameStatus :mines-remaining="gameState.minesRemaining" :time-elapsed="gameState.timeElapsed"
        :game-status="gameState.gameStatus" @reset="handleReset" />

      <!-- 游戏棋盘 -->
      <div class="flex justify-center">
        <GameBoard :board="gameState.board" :disabled="isWaitingToStart" @reveal="handleReveal"
          @toggle-flag="handleToggleFlag" />
      </div>

      <!-- 游戏结果提示 -->
      <div v-if="gameState.gameStatus === 'won'" class="mt-4 text-center">
        <div class="text-green-600 text-xl font-bold">🎉 恭喜你获胜！</div>
      </div>
      <div v-else-if="gameState.gameStatus === 'lost'" class="mt-4 text-center">
        <div class="text-red-600 text-xl font-bold">💥 游戏结束！</div>
      </div>

      <!-- 游戏说明 -->
      <div class="mt-6 text-sm text-gray-600 text-center">
        <p>左键点击揭开方格，右键点击标记地雷</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useGame } from '@/composables/useGame'
import GameBoard from '@/components/GameBoard.vue'
import GameStatus from '@/components/GameStatus.vue'
import DifficultySelector from '@/components/DifficultySelector.vue'

const {
  gameState,
  initializeGame,
  revealCell,
  toggleFlag,
  resetGame,
  changeDifficulty
} = useGame()

const difficulties = [
  { name: '初级', rows: 9, cols: 9, mines: 10 },
  { name: '中级', rows: 16, cols: 16, mines: 40 },
  { name: '高级', rows: 16, cols: 30, mines: 99 }
]

const currentDifficultyIndex = ref(0)
const isWaitingToStart = ref(true)

const handleReveal = (row: number, col: number) => {
  revealCell(row, col)
}

const handleToggleFlag = (row: number, col: number) => {
  toggleFlag(row, col)
}

const handleDifficultyChange = (index: number) => {
  currentDifficultyIndex.value = index
  changeDifficulty(index)
  isWaitingToStart.value = true
}

const handleStart = () => {
  isWaitingToStart.value = false
}

const handleReset = () => {
  resetGame()
  isWaitingToStart.value = true
}

onMounted(() => {
  initializeGame(0)
  isWaitingToStart.value = true
})
</script>
