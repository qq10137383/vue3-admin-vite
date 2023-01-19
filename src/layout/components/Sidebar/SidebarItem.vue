<template>
    <div v-if="!item.hidden">
        <template v-if="hasOneShowingChild(item.children, item)
        && (!onlyOneChild?.children || onlyOneChild.noShowingChildren)
        && !item.alwaysShow">
            <AppLink v-if="onlyOneChild?.meta" :to="resolvePath(onlyOneChild.path)">
                <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{ 'submenu-title-noDropdown': !isNest }">
                    <menu-icon :icon="onlyOneChild.meta.icon || (item.meta?.icon)" />
                    <template v-slot:title>
                        <span>{{ onlyOneChild.meta.title }}</span>
                    </template>
                </el-menu-item>
            </AppLink>
        </template>

        <el-sub-menu v-else ref="subMenuRef" :index="resolvePath(item.path)" popper-append-to-body>
            <template v-slot:title>
                <MenuIcon :icon="item.meta?.icon" />
                <span>{{ item.meta?.title }}</span>
            </template>
            <!-- 递归组件使用文件名作为组件名 -->
            <SidebarItem v-for="child in item.children" :key="child.path" :is-nest="true" :item="child"
                :base-path="resolvePath(child.path)" class="nest-menu" />
        </el-sub-menu>
    </div>
</template>

<script lang="ts" setup>
/**
 * SidebarItem为递归组件，在模板中可以使用文件名(SidebarItem)作为组件名
 * see https://v3.cn.vuejs.org/api/sfc-script-setup.html#%E4%BD%BF%E7%94%A8%E7%BB%84%E4%BB%B6
 */
// vite 不支持在浏览器端使用node模块，使用path-browserify代替
import path from 'path-browserify'
import { onMounted, ref } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { storeToRefs } from 'pinia'
import { isExternal } from '@/utils/validate'
import MenuIcon from './Icon.vue'
import AppLink from './Link.vue'
import { useAppStore } from '@/store/modules/app'

const props = withDefaults(defineProps<{
    item: RouteRecordRaw,
    isNest?: boolean,
    basePath?: string
}>(), {
    isNest: false,
    basePath: ''
})

const onlyOneChild = ref<RouteRecordRaw>()

const appStore = useAppStore()
const { device } = storeToRefs(appStore)

const subMenuRef = ref<any>()

function hasOneShowingChild(children: RouteRecordRaw[] = [], parent: RouteRecordRaw) {
    const showingChildren = children.filter(item => {
        if (item.hidden) {
            return false
        } else {
            // Temp set(will be used if only has one showing child)
            onlyOneChild.value = item
            return true
        }
    })

    // When there is only one child router, the child router is displayed by default
    if (showingChildren.length === 1) {
        return true
    }

    // Show parent if there are no child router to display
    if (showingChildren.length === 0) {
        onlyOneChild.value = { ...parent, path: '', noShowingChildren: true }
        return true
    }

    return false
}
function resolvePath(routePath: string) {
    if (isExternal(routePath)) {
        return routePath
    }
    if (isExternal(props.basePath)) {
        return props.basePath
    }
    return path.resolve(props.basePath, routePath)
}
function fixBugIniOS() {
    if (subMenuRef.value) {
        // handleMouseleave为el-sub-menu组件内部方法未暴露出来
        const handleMouseleave = subMenuRef.value.handleMouseleave
        subMenuRef.value.handleMouseleave = (e: boolean) => {
            if (device.value === 'mobile') {
                return
            }
            handleMouseleave(e)
        }
    }
}

onMounted(fixBugIniOS)

</script>
