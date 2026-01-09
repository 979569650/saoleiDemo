<template>
  <div
    class="flex items-center justify-between bg-gray-200 border-4 border-t-white border-l-white border-b-gray-400 border-r-gray-400 p-2 mb-4">
    <!-- 剩余地雷数 -->
    <div class="flex items-center space-x-2">
      <span class="text-sm font-bold">地雷:</span>
      <span class="text-red-600 font-mono font-bold text-lg">{{ minesRemaining.toString().padStart(3, '0') }}</span>
    </div>

    <!-- 重新开始按钮 -->
    <button @click="$emit('reset')"
      class="px-4 py-2 bg-gray-300 border-2 border-t-white border-l-white border-b-gray-600 border-r-gray-600 hover:bg-gray-200 active:border-t-gray-600 active:border-l-gray-600 active:border-b-white active:border-r-white">
      <span class="text-lg">{{ gameStatus === 'won' ? '😎' : gameStatus === 'lost' ? '😵' : '🙂' }}</span>
    </button>

    <!-- 计时器 -->
    <div class="flex items-center space-x-2">
      <span class="text-sm font-bold">时间:</span>
      <span class="text-blue-600 font-mono font-bold text-lg">{{ timeElapsed.toString().padStart(3, '0') }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  minesRemaining: number
  timeElapsed: number
  gameStatus: 'ready' | 'playing' | 'won' | 'lost'
}

interface Emits {
  (e: 'reset'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>