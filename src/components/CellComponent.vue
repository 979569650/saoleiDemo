<template>
  <div class="minesweeper-cell" :class="{
    'revealed': cell.state === 'revealed',
    'flagged': cell.state === 'flagged',
    'cursor-pointer': !disabled,
    'cursor-not-allowed opacity-60': disabled
  }" @click="handleLeftClick" @contextmenu.prevent="handleRightClick">
    <!-- 已揭开的方格 -->
    <template v-if="cell.state === 'revealed'">
      <MineIcon v-if="cell.isMine" />
      <span v-else-if="cell.adjacentMines > 0" :class="`number-${cell.adjacentMines}`">
        {{ cell.adjacentMines }}
      </span>
    </template>

    <!-- 标记的方格 -->
    <template v-else-if="cell.state === 'flagged'">
      <FlagIcon />
    </template>
  </div>
</template>

<script setup lang="ts">
import { type Cell } from '@/types/game'
import MineIcon from './MineIcon.vue'
import FlagIcon from './FlagIcon.vue'

interface Props {
  cell: Cell
  row: number
  col: number
  disabled?: boolean
}

interface Emits {
  (e: 'reveal', row: number, col: number): void
  (e: 'toggleFlag', row: number, col: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleLeftClick = () => {
  if (props.disabled) return
  emit('reveal', props.row, props.col)
}

const handleRightClick = () => {
  if (props.disabled) return
  emit('toggleFlag', props.row, props.col)
}
</script>
