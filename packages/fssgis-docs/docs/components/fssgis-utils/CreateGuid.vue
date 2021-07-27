<script lang="ts" setup>
import { onMounted, reactive } from 'vue'
import { createGuid, createIntRandom, copyText } from '@fssgis/utils'

const guidList : string[] = reactive([])

function loaedGuidList () {
  guidList.splice(0, guidList.length, ...Array.from({ length: 10 }, () => createGuid()))
}

function copyOne () {
  const index = createIntRandom(0, guidList.length - 1)
  copyText(guidList[index]).then(loaedGuidList)
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
