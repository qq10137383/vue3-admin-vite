<template>
    <div ref="elRef" id="tags-view-container" class="tags-view-container">
        <ScrollPane ref="scrollPaneRef" class="tags-view-wrapper">
            <router-link v-for="tag in visitedViews" :ref="setTagRef" :key="tag.path"
                :class="isActive(tag) ? 'active' : ''"
                :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }" tag="span" class="tags-view-item"
                @click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''" @contextmenu.prevent="openMenu(tag, $event)">
                {{ tag.title }}
                <el-icon v-if="!isAffix(tag)" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)">
                    <close />
                </el-icon>
            </router-link>
        </ScrollPane>
        <ul v-show="ctxState.visible" :style="{ left: ctxState.left + 'px', top: ctxState.top + 'px' }"
            class="contextmenu">
            <li @click="refreshSelectedTag(ctxState.selectedTag)">Refresh</li>
            <li v-if="!isAffix(ctxState.selectedTag)" @click="closeSelectedTag(ctxState.selectedTag)">Close</li>
            <li @click="closeOthersTags">Close Others</li>
            <li @click="closeAllTags(ctxState.selectedTag)">Close All</li>
        </ul>
    </div>
</template>

<script lang="ts">
export default {
    name: 'TagsView'
}
</script>

<script lang="ts" setup>
// vite 不支持在浏览器端使用node模块，使用path-browserify代替
import path from 'path-browserify'
import { reactive, ref, onBeforeUpdate, onMounted, nextTick, watch, ComponentPublicInstance } from 'vue'
import { useRoute, useRouter, RouteLocationNormalizedLoaded, RouteRecordRaw, RouteLocationRaw, RouterLinkProps } from 'vue-router'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { usePermissionStore } from '@/store/modules/permission'
import { Close } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'
import ScrollPane from './ScrollPane.vue'

// 自定义RouteLink，修改to属性
export type CustomRouteLink = ComponentPublicInstance<
    Omit<RouterLinkProps, 'to'> & {
        to: Pick<RouteLocationNormalizedLoaded, 'path' | 'query' | 'fullPath'>
    }
>

let affixTags: RouteLocationNormalizedLoaded[] = []

const elRef = ref<HTMLElement>()
const scrollPaneRef = ref<InstanceType<typeof ScrollPane>>()
let tagRefs: CustomRouteLink[] = []

const route = useRoute()
const router = useRouter()

const tagsViewStore = useTagsViewStore()
const permissionStore = usePermissionStore()
const { visitedViews } = storeToRefs(tagsViewStore)
const { routes } = storeToRefs(permissionStore)

const ctxState = reactive({
    visible: false,
    top: 0,
    left: 0,
    selectedTag: {} as RouteLocationNormalizedLoaded
})

function setTagRef(inst: CustomRouteLink) {
    if (inst && !tagRefs.includes(inst)) {
        tagRefs.push(inst)
    }
}
function isActive(tag: RouteLocationNormalizedLoaded) {
    return tag.path === route.path
}
function isAffix(tag: RouteLocationNormalizedLoaded) {
    return tag.meta?.affix
}
function filterAffixTags(routes: RouteRecordRaw[], basePath = '/') {
    let tags: RouteLocationNormalizedLoaded[] = []
    routes.forEach(route => {
        if (route.meta && route.meta.affix) {
            const tagPath = path.resolve(basePath, route.path)
            tags.push({
                fullPath: tagPath,
                path: tagPath,
                name: route.name,
                meta: { ...route.meta },
                matched: [],
                query: {},
                params: {},
                hash: '',
                redirectedFrom: undefined
            })
        }
        if (route.children) {
            const tempTags = filterAffixTags(route.children, route.path)
            if (tempTags.length >= 1) {
                tags = [...tags, ...tempTags]
            }
        }
    })
    return tags
}
function initTags() {
    affixTags = filterAffixTags(routes.value as RouteRecordRaw[])
    for (const tag of affixTags) {
        // Must have tag name
        if (tag.name) {
            tagsViewStore.addVisitedView(tag)
        }
    }
}
function addTags() {
    const { name } = route
    if (name) {
        tagsViewStore.addView(route)
    }
    return false
}
function moveToCurrentTag() {
    nextTick(() => {
        for (const tag of tagRefs) {
            if (tag.to.path === route.path) {
                scrollPaneRef.value!.moveToTarget(tag)
                // when query is different then update
                if (tag.to.fullPath !== route.fullPath) {
                    tagsViewStore.updateVisitedView(route)
                }
                break
            }
        }
    })
}
function refreshSelectedTag(view: RouteLocationNormalizedLoaded) {
    tagsViewStore.delCachedView(view).then(() => {
        const { fullPath } = view
        nextTick(() => {
            router.replace({ path: '/redirect' + fullPath })
        })
    })
}
function toLastView(visitedViews: RouteLocationNormalizedLoaded[], view: RouteLocationNormalizedLoaded) {
    const latestView = visitedViews.slice(-1)[0]
    if (latestView) {
        router.push(latestView.fullPath)
    } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === 'Dashboard') {
            // to reload home page
            router.replace({ path: '/redirect' + view.fullPath })
        } else {
            router.push('/')
        }
    }
}
function closeSelectedTag(view: RouteLocationNormalizedLoaded) {
    tagsViewStore.delView(view).then(({ visitedViews }) => {
        if (isActive(view)) {
            toLastView(visitedViews, view)
        }
    })
}
function closeOthersTags() {
    router.push(ctxState.selectedTag as RouteLocationRaw)
    tagsViewStore.delOthersViews(ctxState.selectedTag as RouteLocationNormalizedLoaded).then(() => {
        moveToCurrentTag()
    })
}
function closeAllTags(view: RouteLocationNormalizedLoaded) {
    tagsViewStore.delAllViews().then(({ visitedViews }) => {
        if (affixTags.some(tag => tag.path === view.path)) {
            return
        }
        toLastView(visitedViews, view)
    })
}
function openMenu(tag: RouteLocationNormalizedLoaded, e: MouseEvent) {
    const menuMinWidth = 105
    const el = elRef.value!
    const offsetLeft = el.getBoundingClientRect().left // container margin left
    const offsetWidth = el.offsetWidth // container width
    const maxLeft = offsetWidth - menuMinWidth // left boundary
    const left = e.clientX - offsetLeft + 15 // 15: margin right

    if (left > maxLeft) {
        ctxState.left = maxLeft
    } else {
        ctxState.left = left
    }

    ctxState.top = e.clientY
    ctxState.visible = true
    ctxState.selectedTag = tag
}
function closeMenu() {
    ctxState.visible = false
}

watch(() => route.path, () => {
    addTags()
    moveToCurrentTag()
})
watch(() => ctxState.visible, (value) => {
    if (value) {
        document.body.addEventListener('click', closeMenu)
    } else {
        document.body.removeEventListener('click', closeMenu)
    }
})

onBeforeUpdate(() => {
    tagRefs = []
})
onMounted(() => {
    initTags()
    addTags()
})

defineExpose({
    tagRefs
})
</script>

<style lang="scss" scoped>
.tags-view-container {
    height: 34px;
    width: 100%;
    background: #fff;
    border-bottom: 1px solid #d8dce5;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);

    .tags-view-wrapper {
        .tags-view-item {
            display: inline-block;
            position: relative;
            cursor: pointer;
            height: 26px;
            line-height: 26px;
            border: 1px solid #d8dce5;
            color: #495060;
            background: #fff;
            padding: 0 8px;
            font-size: 12px;
            margin-left: 5px;
            margin-top: 4px;

            &:first-of-type {
                margin-left: 15px;
            }

            &:last-of-type {
                margin-right: 15px;
            }

            &.active {
                background-color: #42b983;
                color: #fff;
                border-color: #42b983;

                &::before {
                    content: "";
                    background: #fff;
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    position: relative;
                    margin-right: 4px;
                }
            }
        }
    }

    .contextmenu {
        margin: 0;
        background: #fff;
        z-index: 3000;
        position: absolute;
        list-style-type: none;
        padding: 5px 0;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 400;
        color: #333;
        box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

        li {
            margin: 0;
            padding: 7px 16px;
            cursor: pointer;

            &:hover {
                background: #eee;
            }
        }
    }
}
</style>

<style lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
    .tags-view-item {
        .el-icon-close {
            width: 16px;
            height: 16px;
            padding-top: 3px;
            border-radius: 50%;
            text-align: center;
            font-size: 9px;
            transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
            transform-origin: 100% 50%;

            &:hover {
                background-color: #b4bccc;
                color: #fff;
            }
        }
    }
}
</style>
