<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { createGuid, createIntRandom } from '@fssgis/utils'

// eslint-disable-next-line @typescript-eslint/ban-types
const copyTextFunc = ref<Function>(() => Promise.resolve())
onMounted(() => {
  import('@fssgis/utils').then(module => {
    copyTextFunc.value = module.copyText
  })
})

const guidList : string[] = reactive([])

function loaedGuidList () {
  guidList.splice(0, guidList.length, ...Array.from({ length: 10 }, () => createGuid()))
}

function copyOne () {
  const index = createIntRandom(0, guidList.length - 1)
  copyTextFunc.value(guidList[index]).then(loaedGuidList)
}

onMounted(loaedGuidList)

</script>

<template>
  <div>
    <button @click="loaedGuidList">
      创建GUID
    </button> |
    <button @click="copyOne">
      复制一个（复制后会重新生成）
    </button>
    <div
      v-for="id in guidList"
      :key="id"
    >
      {{ id }}
    </div>
  </div>
</template>

<style scoped>

</style>
