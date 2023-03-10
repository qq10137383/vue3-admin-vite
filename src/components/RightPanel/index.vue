<template>
    <teleport to="body">
        <div :class="{ show: show }" class="rightPanel-container">
            <div class="rightPanel-background"></div>
            <div class="rightPanel">
                <div class="handle-button" :style="{ 'top': buttonTop + 'px', 'background-color': theme }"
                    @click="toggle">
                    <el-icon>
                        <component :is="show ? Close : Setting" />
                    </el-icon>
                </div>
                <div class="rightPanel-items">
                    <slot></slot>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script lang="ts">
export default {
    name: "RightPanel",
}
</script>

<script lang="ts" setup>
import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { Close, Setting } from '@element-plus/icons-vue'
import { useToggle } from '@/hooks/use-toggle'
import { addClass, removeClass } from '@/utils'
import { useSettingsStore } from '@/store/modules/settings'

const props = withDefaults(defineProps<{
    clickNotClose?: boolean,
    buttonTop?: number
}>(), {
    clickNotClose: false,
    buttonTop: 250
})

const { state: show, toggle } = useToggle(false)
const settingsStore = useSettingsStore()
const { theme } = storeToRefs(settingsStore)

const closeSidebar = (evt: MouseEvent) => {
    const target = evt.target as HTMLElement
    // element-plus color-picker控件使用teleport创建下拉颜色带，元素不在rightPanel，增加样式
    // inside-right-panel标记过滤掉，否则点击下拉就会关闭rightPanel
    const parent = target.closest('.rightPanel') || target.closest('.inside-right-panel')
    if (!parent) {
        show.value = false
        window.removeEventListener('click', closeSidebar)
    }
}
function addEventClick() {
    window.addEventListener('click', closeSidebar)
}

watch(() => show.value, (value) => {
    if (value && !props.clickNotClose) {
        addEventClick()
    }
    if (value) {
        addClass(document.body, 'showRightPanel')
    } else {
        removeClass(document.body, 'showRightPanel')
    }
})
</script>

<style>
.showRightPanel {
    overflow: hidden;
    position: relative;
    width: calc(100% - 15px);
}
</style>

<style lang="scss" scoped>
.rightPanel-background {
    position: fixed;
    top: 0;
    left: 0;
    opacity: 0;
    transition: opacity 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
    background: rgba(0, 0, 0, 0.2);
    z-index: -1;
}

.rightPanel {
    width: 100%;
    max-width: 260px;
    height: 100vh;
    position: fixed;
    top: 0;
    right: 0;
    box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.05);
    transition: all 0.25s cubic-bezier(0.7, 0.3, 0.1, 1);
    transform: translate(100%);
    background: #fff;
    z-index: 40000;
}

.show {
    transition: all 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);

    .rightPanel-background {
        z-index: 20000;
        opacity: 1;
        width: 100%;
        height: 100%;
    }

    .rightPanel {
        transform: translate(0);
    }
}

.handle-button {
    width: 48px;
    height: 48px;
    position: absolute;
    left: -48px;
    text-align: center;
    font-size: 24px;
    border-radius: 6px 0 0 6px !important;
    z-index: 0;
    pointer-events: auto;
    cursor: pointer;
    color: #fff;
    line-height: 48px;
    padding-top: 4px;

    i {
        font-size: 24px;
        line-height: 48px;
        pointer-events: none;
    }
}
</style>
