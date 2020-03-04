import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
//导入全局样式表
import './assets/css/global.css';
//导入阿里字体图标
import './assets/fonts/iconfont.css'
Vue.config.productionTip = false
//导入axios依赖
import axios from 'axios'
//将axios挂载到vue的原型对象上,这样每一个vue组件都能直接通过this.$http，发起ajax请求。
Vue.prototype.$http = axios
//配置发起请求的根路径
axios.defaults.baseURL = 'http://localhost:8888/api/'
//Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
