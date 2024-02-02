import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'virtual:svg-icons-register'
import '@/assets/css/index.less'
import 'vant/es/toast/style'
import 'vant/es/dialog/style'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia()).mount('#app')
