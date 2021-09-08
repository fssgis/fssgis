<template>
  <div>
    <div
      v-for="([description, source, target], index) in items"
      :key="index"
    >
      {{ index + 1 }}.
      <b>{{ description }}：</b>
      <code>{{ source }}</code> -&gt; <code>{{ target }}</code>
      | <code>{{ source === target }}</code>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive } from 'vue'
import { deepCopyJSON } from '@fssgis/utils'

const dic = [
  ['string', { a: 'a' }],
  ['string', { a: '' }],
  ['number', { a: 1 }],
  ['number', { a: 0 }],
  ['function', {
    a: function (i, j) {
      return i + j
    }
  }],
  ['function', { a: i => i++ }],
  ['deep', { a: { b: 2 } }],
  ['deep', { a: { b: {} } }],
  ['boolean', { a: true }],
  ['boolean', { a: false }],
  ['symbol', { a: Symbol() }],
  ['null', { a: null }],
  ['undefined', { a: undefined }],
]

const map = reactive(new Map())
dic
  .forEach(([description, source], index) => {
    map.set(index, [description, source, deepCopyJSON(source)])
  })

const items = computed(() => [...map.values()])
</script>

<style lang="scss" scoped>

</style>
