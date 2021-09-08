<template>
  <div class="flex flex-wrap">
    <div
      v-for="([source, target], index) in items"
      :key="index"
      class="mx-8"
    >
      <code>{{ source }}</code>
      -&gt;
      <b>{{ target }}</b>
    </div>
  </div>
  <input
    type="number"
    :value="inputNumber"
    @input="updateInputNumber"
  > result: {{ toChineseResult }}
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { ext, extNumber } from '@fssgis/ext'
import { deepCopyJSON } from '@fssgis/utils'

const nums : number[] = [
  ...Array.from({ length: 11 }, (_, i) => i),
  100,
  1000,
  10000,
  100000,
  1000000,
  10000000,
  100000000,
  1000000000,
  -1,
]
const map = reactive(new Map())
nums.forEach((num, index) => map.set(index, [num, ext(num).toChineseString()]))
const items = computed(() => [...map.values()])

const inputNumber = ref(54230789)
const updateInputNumber = e => inputNumber.value = +e.target.value
const toChineseResult = computed(() => ext(inputNumber.value).toChineseString())

</script>

<style lang="scss" scoped>

</style>
