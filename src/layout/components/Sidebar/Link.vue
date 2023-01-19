<template>
    <component :is="type" v-bind="linkProps(to)">
        <slot></slot>
    </component>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { isExternal } from '@/utils/validate'

type LinkProps = Partial<HTMLLinkElement>
type RouterLinkProps = InstanceType<typeof RouterLink>["$props"]

const props = defineProps<{
    to: string
}>()

const external = computed(() => isExternal(props.to))
const type = computed(() => external.value ? 'a' : 'router-link')

function linkProps(to: string): LinkProps | RouterLinkProps {
    if (external.value) {
        return {
            href: to,
            target: '_blank',
            rel: 'noopener'
        } as LinkProps
    }
    return {
        to: to
    } as RouterLinkProps
}
</script>
