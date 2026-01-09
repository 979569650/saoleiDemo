<template>
  <div class="inline-block border-4 border-t-gray-300 border-l-gray-300 border-b-white border-r-white bg-gray-300 p-2">
    <div v-for="(row, rowIndex) in board" :key="rowIndex" class="flex">
      <CellComponent
        v-for="(cell, colIndex) in row"
        :key="`${rowIndex}-${colIndex}`"
        :cell="cell"
        :row="rowIndex"
        :col="colIndex"
        :disabled="disabled"
        @reveal="(row, col) => $emit('reveal', row, col)"
        @toggle-flag="(row, col) => $emit('toggleFlag', row, col)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Cell } from '@/types/game'
import CellComponent from './CellComponent.vue'

interface Props {
  board: Cell[][]
  disabled?: boolean
}

interface Emits {
  (e: 'reveal', row: number, col: number): void
  (e: 'toggleFlag', row: number, col: number): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>
