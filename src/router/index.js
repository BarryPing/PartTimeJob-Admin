import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import User from '../components/user/Users.vue'
import CenterContent from '../components/center/CenterContent.vue'
import Role from '../components/power/Role.vue'
import Admin from '../components/power/Admin.vue'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/member/student/list', component: User },
      { path: '/center/content', component: CenterContent },
      { path: '/permission/role', component: Role },
      { path: '/permission/user', component: Admin }

    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪一个路径跳转而来
  // next() 放行 next('/login') 强制跳转

  // 如果是登录页直接放行
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  // 如果token不存在，则返回登录页
  if (!tokenStr) return next('/login')
  next()
})
export default router
