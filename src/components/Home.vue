<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/img/ptjob.jpg" alt />
        <span>勤工助学管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside width="200px">
        <!-- 侧边栏菜单区域 -->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#ffd04b">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单的模板 -->
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-location"></i>
              <!-- 文本 -->
              <span>{{item.name}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="subItem.id+''" v-for="subItem in item.children" :key="subItem.id">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-location"></i>
                <!-- 文本 -->
                <span>{{subItem.name}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容区域 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data(){
      return{
        //左侧菜单数据
        menuList:[]
      }
  },
  //当一加载该页面时，就立即获取左侧菜单 
  created() {
    this.getMenuList()
  },

  methods: {
    //注销登录
    logout() {
      this.$http
        .post('user/logout')
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
      //window.sessionStorage.clear()
      this.$router.push('/login')
    },
    //获取左侧菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('menu')
      if(res.code!==20000) return this.$message.error(res.message)
      this.menuList=res.data
      console.log(res)
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
}
.el-main {
  background-color: #eaedf1;
}
</style>