<script lang="tsx">
import { defineComponent, resolveComponent, VNodeArrayChildren } from "vue";

/**
 * icon组件，需要使用tsx，直接使用setup选项式写法
 */
export default defineComponent({
  props: {
    icon: {
      type: String,
      default: "",
    }
  },
  setup(props) {
    const { icon } = props;
    const vnodes: VNodeArrayChildren = [];

    if (icon) {
      if (icon.includes('el-icon')) {
        // 可以不使用resolveComponent转换: vnodes.push(<el-icon><icon class={['sub-el-icon']} /></el-icon>)
        // 主要作用是icon组件如果未在全局注册，resolveComponent会在控制台输出提示信息
        const IconComponent = resolveComponent(icon) as any
        vnodes.push(<el-icon><IconComponent class={['sub-el-icon']} /></el-icon>)
      }
      else {
        vnodes.push(<svg-icon icon-class={icon} />);
      }
    }
    return () => vnodes;
  }
})
</script>