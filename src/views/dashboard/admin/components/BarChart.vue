<template>
    <div ref="elRef" :class="className" :style="{ height: height, width: width }" />
</template>

<script lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import echarts from 'echarts'
import 'echarts/theme/macarons' // echarts theme
import { useResize } from '@/hooks/use-resize'

const animationDuration = 6000

</script>

<script lang="ts" setup>
/**
 * Bar Chart
 */
withDefaults(defineProps<{
    className?: string,
    width?: string,
    height?: string
}>(), {
    className: 'chart',
    width: '100%',
    height: '300px'
})

let chart: echarts.ECharts | null = null

const elRef = ref<HTMLDivElement>()

function initChart() {
    chart = echarts.init(elRef.value!, 'macarons')
    chart.setOption({
        tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            top: 10,
            left: '2%',
            right: '2%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisTick: {
                alignWithLabel: true
            }
        }],
        yAxis: [{
            type: 'value',
            axisTick: {
                show: false
            }
        }],
        series: [{
            name: 'pageA',
            type: 'bar',
            stack: 'vistors',
            // @types/echarts 定义有问题
            barWidth: '60%' as any,
            data: [79, 52, 200, 334, 390, 330, 220],
            animationDuration
        }, {
            name: 'pageB',
            type: 'bar',
            stack: 'vistors',
            barWidth: '60%' as any,
            data: [80, 52, 200, 334, 390, 330, 220],
            animationDuration
        }, {
            name: 'pageC',
            type: 'bar',
            stack: 'vistors',
            barWidth: '60%' as any,
            data: [30, 52, 200, 334, 390, 330, 220],
            animationDuration
        }]
    })
}

const resizeChart = ref(() => {
    chart?.resize()
})
useResize(resizeChart)

onMounted(() => nextTick(initChart))
onBeforeUnmount(() => {
    chart?.dispose()
    chart = null
})
</script>
