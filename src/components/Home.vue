<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/img/ptjob.jpg" alt>
        <span>勤工助学管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside :width="isCollapse ? '64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="this.$router.history.current.path"
        >
          <!-- 一级菜单 -->
          <el-submenu v-for="item in menuList" :key="item.id" :index="item.id+''">
            <!-- 一级菜单的模板 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]" />
              <!-- 文本 -->
              <span>{{ item.name }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              v-for="subItem in item.children"
              :key="subItem.id"
              :index="subItem.url+''"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu" />
                <!-- 文本 -->
                <span>{{ subItem.name }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容区域 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单数据
      menuList: [],
      // 一级菜单图标设置
      iconsObj: {
        '1': 'el-icon-s-home', // 中心概况
        '5': 'el-icon-user-solid', // 用户管理
        '12': 'el-icon-s-check', // 权限管理"，
        '20': 'el-icon-s-flag', // 招聘管理
        '37': 'el-icon-s-order', // 应聘管理
        '56': 'el-icon-s-comment', // 留言管理
        '61': 'el-icon-s-platform', // 留言管理
        '67': 'el-icon-s-data' // 数据统计
      },
      // 是否折叠左侧菜单
      isCollapse: false
    }
  },
  // 当一加载该页面时，就立即获取左侧菜单
  created() {
    this.getMenuList()
  },

  methods: {
    // 注销登录
    logout() {
      this.$http
        .post('user/logout')
        .then(res => {
          window.sessionStorage.clear()
          console.log(res)
        })
        .catch(err => {
          window.sessionStorage.clear()
          console.log(err)
        })
      this.$router.push('/login')
    },
    // 获取左侧菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('menu')
      if (res.code !== 20000) return this.$message.error(res.message)
      this.menuList = res.data
      console.log(res)
    },
    // 点击按钮切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #ffff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    img {
      height: 50px;
      width: 80px;
    }
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none; //去除边框线
  }
}
.el-main {
  background-color: #eaedf1;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer; //鼠标放上去为小手
}
</style>
