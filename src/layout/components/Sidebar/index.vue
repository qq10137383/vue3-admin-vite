<template>
    <div :class="{ 'has-logo': showLogo }">
        <Logo v-if="showLogo" :collapse="isCollapse" />
        <el-scrollbar wrap-class="scrollbar-wrapper">
            <el-menu :default-active="activeMenu" :collapse="isCollapse" :background-color="variables.menuBg"
                :text-color="variables.menuText" :unique-opened="false" :active-text-color="variables.menuActiveText"
                :collapse-transition="false" mode="vertical">
                <SidebarItem v-for="route in permission_routes" :key="route.path" :item="route"
                    :base-path="route.path" />
            </el-menu>
        </el-scrollbar>
    </div>
</template>

<script lang="ts">
export default {
    name: 'Sidebar'
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import variables from '@/styles/variables.module.scss'
import Logo from './Logo.vue'
import SidebarItem from './SidebarItem.vue'
import { useAppStore } from '@/store/modules/app'
import { useSettingsStore } from '@/store/modules/settings'
import { usePermissionStore } from '@/store/modules/permission'

const route = useRoute()
const appStore = useAppStore()
const settingsStore = useSettingsStore()
const permissionStore = usePermissionStore()
const { sidebar } = storeToRefs(appStore)
const { sidebarLogo: showLogo } = storeToRefs(settingsStore)
const { routes: permission_routes } = storeToRefs(permissionStore)

const activeMenu = computed(() => {
    const { meta, path } = route
    // if set path, the sidebar will highlight the path you set
    if (meta.activeMenu) {
        return meta.activeMenu
    }
    return path
})
const isCollapse = computed(() => !sidebar.value.opened)

</script>
