import { App } from 'vue'
import SvgIcon from '@/components/SvgIcon/index.vue'// svg component

import 'virtual:svg-icons-register' // 导入所有svg icons

/**
 * 注册svg-icon组件
 * @param app 
 */
function install(app: App<Element>): void {
    app.component('svg-icon', SvgIcon)
}

export default install