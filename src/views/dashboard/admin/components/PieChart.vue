<template>
    <div ref="elRef" :class="className" :style="{ height: height, width: width }" />
</template>

<script lang="ts" setup>
import { ref, nextTick, onBeforeUnmount, onMounted } from 'vue'
import echarts from 'echarts'
import 'echarts/theme/macarons' // echarts theme
import { useResize } from '@/hooks/use-resize'

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
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
            left: 'center',
            bottom: '10',
            data: ['Industries', 'Technology', 'Forex', 'Gold', 'Forecasts']
        },
        series: [
            {
                name: 'WEEKLY WRITE ARTICLES',
                type: 'pie',
                roseType: 'radius',
                radius: [15, 95],
                center: ['50%', '38%'],
                data: [
                    { value: 320, name: 'Industries' },
                    { value: 240, name: 'Technology' },
                    { value: 149, name: 'Forex' },
                    { value: 100, name: 'Gold' },
                    { value: 59, name: 'Forecasts' }
                ],
                animationEasing: 'cubicInOut',
                animationDuration: 2600
            }
        ]
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
