import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 按需导入ElementUI组件库
// import './plugins/element.js'
// 全局导入ElementUI组件库
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 导入全局样式表
import './assets/css/global.css'
// 导入阿里字体图标
import './assets/fonts/iconfont.css'
Vue.config.productionTip = false
// 导入axios依赖
import axios from 'axios'

// 配置发起请求的根路径
axios.defaults.baseURL = 'http://localhost:8888/api/'
// 将axios挂载到vue的原型对象上,这样每一个vue组件都能直接通过this.$http，发起ajax请求。
Vue.prototype.$http = axios
axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization = 'Bearer ' + window.sessionStorage.getItem('token')
  return config
})
// Vue.config.productionTip = false;

Vue.use(ElementUI)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
