<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>公告管理</el-breadcrumb-item>
      <el-breadcrumb-item>内容管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="addNoticeDia">添加公告</el-button>
      <h4>已发布公告:</h4>
      <el-card v-for="item in notices" :key="item.buId" style="width:800px;height:100px;margin-top:10px;display: flex;align-items: center;">
        <p>{{ item.buTitle }}</p>
        <el-button type="primary" size="mini" @click="editDia(item.buId)">编辑</el-button>
        <el-button type="danger" size="mini" @click="del(item.buId)">删除</el-button>
      </el-card>
    </el-card>
    <!-- 添加公告对话框 -->
    <el-dialog
      title="公告添加"
      :visible.sync="addDialogVisible"
      width="50%"
    >
      <el-form ref="addFormRef" :model="addForm" label-width="80px">
        <el-form-item label="公告标题">
          <el-input v-model="addForm.title" style="width:80%" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="公告内容">
          <el-input
            v-model="addForm.content"
            type="textarea"
            rows="8"
            placeholder="请输入内容"
            maxlength="180"
            show-word-limit
            resize="none"
            style="width:80%"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addNotice">添加</el-button>
      </span>
    </el-dialog>
    <!-- 编辑公告对话框 -->
    <el-dialog
      title="公告编辑"
      :visible.sync="editDialogVisible"
      width="50%"
    >
      <el-form ref="editFormRef" :model="editForm" label-width="80px">
        <el-form-item label="公告标题">
          <el-input
            v-model="editForm.buTitle"
            type="text"
            placeholder="请输入内容"
            maxlength="25"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="公告内容">
          <el-input
            v-model="editForm.buContent"
            type="textarea"
            rows="8"
            placeholder="请输入内容"
            maxlength="180"
            show-word-limit
            resize="none"
            style="width:80%"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="edit">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      notice: '',
      addDialogVisible: false,
      editDialogVisible: false,
      notices: [],
      // 公告添加
      addForm: {
        // 标题
        title: '',
        // 内容
        content: ''
      },
      // 公告编辑
      editForm: []
    }
  },
  mounted() {
    this.getNotice()
  },
  methods: {
    // 获取公告
    getNotice() {
      this.$http.get('notice/get')
        .then(res => {
          const { code, message, data } = res.data
          if (code !== 20000) return this.$message.error(message)
          this.notices = data
          // this.$message.success(message)
          console.log(this.notices)
        })
    },
    // 添加公告对话框
    addNoticeDia() {
      this.addDialogVisible = true
    },
    // 添加公告
    addNotice() {
      this.$http.post('notice/add', this.addForm)
        .then(res => {
          const { code, message } = res.data
          if (code !== 20000) return this.$message.error(message)
          this.$message.success(message)
          this.addDialogVisible = false
          this.getNotice()
        })
    },
    // 编辑公告对话框
    editDia(id) {
      this.$http.get('notice/getone/' + id)
        .then(res => {
          const { code, message, data } = res.data
          if (code !== 20000) return this.$message.error(message)
          this.editForm = data
          this.editDialogVisible = true
          console.log(this.editForm)
        })
    },
    // 提交编辑
    edit() {
      this.$http.post('notice/upd/', {
        id: this.editForm.buId,
        title: this.editForm.buTitle,
        content: this.editForm.buContent
      })
        .then(res => {
          const { code, message } = res.data
          if (code !== 20000) return this.$message.error(message)
          this.$message.success(message)
          this.getNotice()
          this.editDialogVisible = false
          console.log(res)
        })
    },
    async del(id) {
      // 弹框询问是否删除用户
      const confirmResult = await this.$confirm('此操作将永久删除该公告, 是否继续?', '提示', {
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
      this.$http.delete('notice/del/' + id)
        .then(res => {
          const { code, message } = res.data
          if (code !== 20000) return this.$message.error(message)
          this.$message.success(message)
          this.getNotice()
        })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
