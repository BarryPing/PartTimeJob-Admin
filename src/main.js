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

import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

// 导入nprogress进度条 包和对应的JS、CSS
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// 配置发起请求的根路径
axios.defaults.baseURL = 'http://localhost:8888/api/'
// 将axios挂载到vue的原型对象上,这样每一个vue组件都能直接通过this.$http，发起ajax请求。
Vue.prototype.$http = axios

// 在 request 拦截器中，展示进度条 NProgress.start()
axios.interceptors.request.use(config => {
  // 展示进度条
  NProgress.start()
  // console.log(config)
  config.headers.Authorization = 'Bearer ' + window.sessionStorage.getItem('token')
  return config
})
// 在 response 拦截器中隐藏进度条 NProgress.done()
axios.interceptors.response.use(config => {
  // 隐藏进度条
  NProgress.done()
  return config
})
Vue.use(ElementUI)

Vue.component('tree-table', TreeTable)
// 将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
