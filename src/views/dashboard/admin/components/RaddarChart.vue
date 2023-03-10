<template>
    <div ref="elRef" :class="className" :style="{ height: height, width: width }" />
</template>

<script lang="ts">
import { ref, nextTick, onBeforeUnmount, onMounted } from 'vue'
import echarts from 'echarts'
import 'echarts/theme/macarons' // echarts theme
import { useResize } from '@/hooks/use-resize'

const animationDuration = 3000
</script>

<script lang="ts" setup>
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
        radar: {
            radius: '66%',
            center: ['50%', '42%'],
            splitNumber: 8,
            splitArea: {
                areaStyle: {
                    color: 'rgba(127,95,132,.3)',
                    opacity: 1,
                    shadowBlur: 45,
                    shadowColor: 'rgba(0,0,0,.5)',
                    shadowOffsetX: 0,
                    shadowOffsetY: 15
                }
            },
            indicator: [
                { name: 'Sales', max: 10000 },
                { name: 'Administration', max: 20000 },
                { name: 'Information Technology', max: 20000 },
                { name: 'Customer Support', max: 20000 },
                { name: 'Development', max: 20000 },
                { name: 'Marketing', max: 20000 }
            ]
        },
        legend: {
            left: 'center',
            bottom: '10',
            data: ['Allocated Budget', 'Expected Spending', 'Actual Spending']
        },
        series: [{
            type: 'radar',
            symbolSize: 0,
            areaStyle: {
                normal: {
                    shadowBlur: 13,
                    shadowColor: 'rgba(0,0,0,.2)',
                    shadowOffsetX: 0,
                    shadowOffsetY: 10,
                    opacity: 1
                }
            } as any,
            data: [
                {
                    value: [5000, 7000, 12000, 11000, 15000, 14000],
                    name: 'Allocated Budget'
                },
                {
                    value: [4000, 9000, 15000, 15000, 13000, 11000],
                    name: 'Expected Spending'
                },
                {
                    value: [5500, 11000, 12000, 15000, 12000, 12000],
                    name: 'Actual Spending'
                }
            ],
            animationDuration: animationDuration
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
