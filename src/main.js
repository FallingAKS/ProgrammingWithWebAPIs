import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'

import cities from './assets/cities.json';

// 将数据作为全局变量
window.CITIES = JSON.stringify(cities);

createApp(App)
  .use(ElementPlus)
  .use(router)
  .mount('#app')
