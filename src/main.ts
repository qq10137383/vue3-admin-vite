import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import svgIcons from '@/icons' // svg icons

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import elementPlus from "element-plus"
import '@/styles/element-variables.scss'

import '@/styles/index.scss' // global css

import './permission' // permission control

import filters from './filters' // global filters

const app = createApp(App)

// register global utility filters
app.config.globalProperties.$filters = filters

app.use(router)
    .use(store)
    .use(svgIcons)
    .use(elementPlus)
    .mount('#app')
