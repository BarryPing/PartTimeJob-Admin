<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/member/student/list' }">会员管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/member/student/list' }">学生管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            v-model="queryInfo.query"
            placeholder="请输入内容"
            clearable
            @clear="getUserList"
            @keyup.enter.native="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList" />
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button v-if="false" type="primary" @click="addDialogVisible=true">添加用户</el-button>
          <el-button type="primary" @click="exportTable">导出</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table id="exportTab" v-loading="loading" :data="userlist" border stripe>
        <el-table-column type="index" label="#" />
        <el-table-column label="时间" prop="createTime" />
        <el-table-column label="学号" prop="stuid" />
        <el-table-column label="姓名" prop="username" />
        <el-table-column label="学院" prop="college" />
        <el-table-column label="电话" prop="phone" />
        <el-table-column label="邮箱" prop="email" />
        <el-table-column label="是否贫困生 ">
          <template v-slot:="scope">
            <el-switch
              v-model="scope.row.needyStudents"
              @change="needyStudentStateChanged(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作 ">
          <template v-slot:="scope">
            <!-- 重置按钮 -->
            <el-tooltip effect="dark" content="重置密码" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="resetPasswordById(scope.row.id)" />
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>

  </div>
</template>

<script>
import FileSaver from 'file-saver'
import XLSX from 'xlsx'

export default {
  data() {
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '', // 查询参数
        pagenum: 1, // 当前页数
        pagesize: 2// 每页显示条数
      },
      userlist: [],
      total: 0,
      loading: true

    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      await this.$http
        .post('member/student/list', this.queryInfo)
        .then(res => {
          console.log(res)
          if (res.data.code !== 20000) return this.$message.error('获取学生列表失败')
          // this.$message.success('获取学生列表成功')
          this.userlist = res.data.data.users
          this.total = res.data.data.totalpage
          this.loading = false
        })
        .catch(err => {
          this.$message.error('获取学生列表失败:' + err)
        })
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize
      // 改变每页显示的数据条数后，重写发起请求，获取数据。
      this.getUserList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      // 改变获取的第几页的数据后，重写发起请求，获取数据
      this.getUserList()
    },
    // 监听 switch 开关状态的改变
    async needyStudentStateChanged(userInfo) {
      // console.log(userInfo)
      await this.$http
        .post('member/student/upd', { 'id': userInfo.id, 'state': userInfo.needyStudents })
        .then(res => {
          console.log(res)
          if (res.data.code !== 20000) {
            // 更新失败后，重置switch开关状态为未点击状态
            userInfo.needyStudents = !userInfo.needyStudents
            this.getUserList()
            return this.$message.error(res.data.message + '')
          }
          this.$message.success('更新学生状态成功')
          this.getUserList()
        })
        .catch(err => {
          // 更新失败后，重置switch开关状态为未点击状态
          userInfo.needyStudents = !userInfo.needyStudents
          this.$message.error('更新学生状态失败:' + err)
          this.getUserList()
        })
    },
    // 根据用户ID重置用户密码
    async resetPasswordById(id) {
      // console.log('id=' + id)
      // 弹框询问是否重置密码
      const confirmResult = await this.$confirm('此操作将重置该用户的密码, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 如果用户确认了重置，则返回值为字符串 confirm
      // 如果用户取消了重置，则返回值为字符串 cancel
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消重置')
      }
      const { data: res } = await this.$http.put(`member/student/reset/${id}`)
      if (res.code !== 20000) return this.$message.error(res.message)
      this.$message.success('密码已重置为: 123456')
    },
    // 根据用户ID删除用户
    async removeUserById(id) {
      // console.log('id=' + id)
      // 弹框询问是否删除用户
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 如果用户确认了删除，则返回值为字符串 confirm
      // 如果用户取消了删除，则返回值为字符串 cancel
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('member/student/del/' + id)
      if (res.code !== 20000) return this.$message.error(res.message)
      this.$message.success('用户删除成功!')
      this.getUserList()
    },
    // 导出excel到本地
    exportTable() {
      /* generate workbook object from table */
      var xlsxParam = { raw: true } // 导出的内容只做解析，不进行格式转换
      var wb = XLSX.utils.table_to_book(document.querySelector('#exportTab'), xlsxParam)

      /* get binary string as output */
      var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
      try {
        FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '学生信息表.xlsx')
      } catch (e) {
        if (typeof console !== 'undefined') {
          console.log(e, wbout)
        }
      }
      return wbout
    }
  }
}
</script>

<style lang="less" scoped>

</style>
