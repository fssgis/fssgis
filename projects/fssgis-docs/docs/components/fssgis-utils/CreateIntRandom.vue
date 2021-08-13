<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import { createIntRandom } from '@fssgis/utils'

const minInt = ref(0)
const maxInt = ref(10)

const result = ref(0)

watchEffect(() => {
  result.value = createIntRandom(minInt.value, maxInt.value)
})

function loadResult () {
  result.value = createIntRandom(minInt.value, maxInt.value)
}

</script>

<template>
  <div>
    最小值：<input
      type="number"
      :value="minInt"
      @change="e => minInt = Number((e.target)?.value)"
      @input="e => minInt = Number((e.target)?.value)"
    >{{ minInt }}
    <br>
    最大值：<input
      type="number"
      :value="maxInt"
      @change="e => maxInt = Number((e.target)?.value)"
      @input="e => maxInt = Number((e.target)?.value)"
    >{{ maxInt }}
    <br>
    <button @click="loadResult">
      创建
    </button> | 结果：{{ result }}
  </div>
</template>

<style scoped>

</style>
