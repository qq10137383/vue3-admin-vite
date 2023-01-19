<template>
  <el-config-provider :size="size" :locale="locale">
    <router-view />
  </el-config-provider>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/modules/app'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'

const locale = ref(zhCn)

const appStore = useAppStore()
const { size } = storeToRefs(appStore)
</script>

