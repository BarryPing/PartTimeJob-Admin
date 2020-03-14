<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="rolelist" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template v-slot:="scope">
            <el-row v-for="(item1,i1) in scope.row.children" :key="item1.id" :class="['bdbottom',i1===0 ? 'bdtop':'','vcenter']">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag>{{ item1.name }}</el-tag>
                <i class="el-icon-caret-right" />
              </el-col>
              <!-- 渲染二级、三级权限 -->
              <el-col :span="19">
                <!-- 通过 for 循环 嵌套渲染二级权限 -->
                <el-row v-for="(item2,i2) in item1.children" :key="item2.id" :class="[i2===0 ? '':'bdtop','vcenter']">
                  <!-- 渲染二级权限 -->
                  <el-col :span="6">
                    <el-tag type="success">{{ item2.name }}
                    </el-tag>
                    <i class="el-icon-caret-right" />
                  </el-col>
                  <!-- 渲染三级权限 -->
                  <el-col :span="18">
                    <el-tag v-for="(item3) in item2.children" :key="item3.id" type="warning" closable @close="removePermissionById()">{{ item3.name }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>{{ scope.row }}</pre> -->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#" />
        <el-table-column label="角色名称" prop="name" />
        <el-table-column label="角色描述" prop="enname" />
        <el-table-column label="操作" width="300px">
          <template v-slot:="scope">
            <!-- 编辑按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <!-- 分配权限 -->
            <el-button type="warning" icon="el-icon-setting" size="mini">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
    // 所有角色列表数据
      rolelist: []
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取所有角色的列表
    async getRolesList() {
      await this.$http
        .get('permission/role/view')
        .then(res => {
          console.log(res)
          if (res.data.code !== 20000) return this.$message.error('获取角色列表失败')
          this.$message.success('获取角色列表成功')
          this.rolelist = res.data.data
          console.log(res)
        })
        .catch(err => {
          this.$message.error('获取角色列表失败:' + err)
        })
    },
    // 根据Id删除对应的权限
    async removePermissionById() {
      // 弹框提示用户是否删除该权限
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除!')
      }
      console.log('确认了删除')
    }
  }
}
</script>

<style lang="less" scope>
.el-tag{
    margin: 7px;
}
// 顶部加上横线
.bdtop{
border-top:1px solid #eee
}
//底部加上横线
.bdbottom{
border-bottom:1px solid #eee
}
// 竖直居中
.vcenter{
    display: flex;
    align-items: center;
}
</style>
