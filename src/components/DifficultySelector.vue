<template>
  <div class="mb-4">
    <div class="flex space-x-2">
      <button
        v-for="(diff, index) in difficulties"
        :key="diff.name"
        @click="$emit('changeDifficulty', index)"
        class="px-4 py-2 border-2 border-t-white border-l-white border-b-gray-600 border-r-gray-600 hover:bg-gray-200 active:border-t-gray-600 active:border-l-gray-600 active:border-b-white active:border-r-white"
        :class="{
          'bg-blue-200': currentDifficultyIndex === index,
          'bg-gray-300': currentDifficultyIndex !== index
        }"
      >
        {{ diff.name }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GameDifficulty } from '@/types/game'

interface Props {
  difficulties: GameDifficulty[]
  currentDifficultyIndex: number
}

interface Emits {
  (e: 'changeDifficulty', index: number): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>