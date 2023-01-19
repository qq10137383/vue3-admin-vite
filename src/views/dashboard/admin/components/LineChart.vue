<template>
    <div ref="elRef" :class="className" :style="{ height: height, width: width }" />
</template>

<script lang="ts" setup>
import { ref, watch, nextTick, onBeforeUnmount, onMounted } from 'vue'
import echarts from 'echarts'
import 'echarts/theme/macarons' // echarts theme
import { useResize } from '@/hooks/use-resize'

export interface LineDataType {
    expectedData: number[]
    actualData: number[]
}

const props = withDefaults(defineProps<{
    className?: string,
    width?: string,
    height?: string,
    autoResize?: boolean,
    chartData: LineDataType
}>(), {
    className: 'chart',
    width: '100%',
    height: '350px',
    autoResize: true
})

let chart: echarts.ECharts | null = null

const elRef = ref<HTMLDivElement>()

function setOptions({ expectedData, actualData } = {} as any) {
    if (!chart) return

    chart.setOption({
        xAxis: {
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            boundaryGap: false,
            axisTick: {
                show: false
            }
        },
        grid: {
            left: 10,
            right: 10,
            bottom: 20,
            top: 30,
            containLabel: true
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            },
            padding: [5, 10]
        },
        yAxis: {
            axisTick: {
                show: false
            }
        },
        legend: {
            data: ['expected', 'actual']
        },
        series: [{
            name: 'expected', itemStyle: {
                normal: {
                    color: '#FF005A',
                    lineStyle: {
                        color: '#FF005A',
                        width: 2
                    }
                }
            },
            smooth: true,
            type: 'line',
            data: expectedData,
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
        },
        {
            name: 'actual',
            smooth: true,
            type: 'line',
            itemStyle: {
                normal: {
                    color: '#3888fa',
                    lineStyle: {
                        color: '#3888fa',
                        width: 2
                    },
                    areaStyle: {
                        color: '#f3f8ff'
                    }
                }
            },
            data: actualData,
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
        }]
    })
}
function initChart() {
    chart = echarts.init(elRef.value!, 'macarons')
    setOptions(props.chartData as any)
}

const resizeChart = ref(() => {
    chart?.resize()
})
useResize(resizeChart)

watch(() => props.chartData, (val) => {
    setOptions(val)
}, { deep: true })

onMounted(() => nextTick(initChart))
onBeforeUnmount(() => {
    chart?.dispose()
    chart = null
})
</script>

