<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>管理员</el-breadcrumb-item>
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
          <el-button type="primary" @click="addUserdialogVisible=true">添加管理员</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table id="exportTab" :data="userlist" border stripe>
        <el-table-column type="index" label="#" />
        <el-table-column label="姓名" prop="username" />
        <el-table-column label="学院" prop="college" />
        <el-table-column label="电话" prop="phone" />
        <el-table-column label="邮箱" prop="email" />
        <el-table-column label="角色" prop="role" />
        <el-table-column label="状态" prop="status">
          <template v-slot:="scope">

            <el-switch
              v-model="scope.row.status"
              @change="needyStudentStateChanged(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="175x">
          <template v-slot:="scope">
            <!-- 编辑按钮 -->
            <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditRoleDialog(scope.row.id)" />
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)" />
            </el-tooltip>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)" />
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
    <!-- 编辑管理员用户对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form ref="editFormRef" :model="editForm" :rules="addFormRules" label-width="100px">
        <el-form-item label="姓名" prop="username">
          <el-input v-model="editForm.username" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" />
        </el-form-item>
        <el-form-item label="手机 " prop="phone">
          <el-input v-model="editForm.phone" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加管理员的对话框 -->
    <el-dialog
      title="添加管理员"
      :visible.sync="addUserdialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" />
        </el-form-item>
        <el-form-item label="学院 " prop="college">
          <el-input v-model="addForm.college" />
        </el-form-item>
        <el-form-item label="邮箱 " prop="email">
          <el-input v-model="addForm.email" />
        </el-form-item>
        <el-form-item label="手机号 " prop="phone">
          <el-input v-model="addForm.phone" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 验证角色名称的规则
    var checkName = (rule, value, callback) => {
      // 中文校验
      if (!value) {
        return callback(new Error('请输入中文'))
      }
      if (!/^[\u0391-\uFFE5A-Za-z]+$/.test(value)) {
        callback(new Error('不可输入特殊字符、数字'))
      } else {
        callback()
      }
    }
    // 验证邮箱的规则
    var checkEmail = (rule, value, callback) => {
      const reg = /^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/
      if (value === '' || value === undefined || value === null) {
        callback()
      } else {
        if (!reg.test(value)) {
          callback(new Error('请输入正确的邮箱'))
        } else {
          callback()
        }
      }
    }
    // 验证手机号/固话的校验规则
    var checkPhone = (rule, value, callback) => {
      const reg = /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/
      if (value === '' || value === undefined || value === null) {
        callback()
      } else {
        if ((!reg.test(value)) && value !== '') {
          callback(new Error('请输入正确的电话号码或者固话号码'))
        } else {
          callback()
        }
      }
    }
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '', // 查询参数
        pagenum: 1, // 当前页数
        pagesize: 2// 每页显示条数
      },
      userlist: [],
      total: 0,
      editForm: {},
      editDialogVisible: false,
      // 添加用户的表单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 10, message: '角色名的长度在3~10个字符之间', trigger: 'blur' },
          { validator: checkName, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱账号', trigger: 'blur' },
          { min: 3, max: 10, message: '邮箱名称的长度在3~25个字符之间', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 3, max: 11, message: '手机号的长度为11个字符', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ]
      },
      // 控制添加用户对话框的显示与隐藏
      addUserdialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        // 用户名
        username: '',
        // 密码
        password: '',
        // 学院
        college: '',
        // 邮箱
        email: '',
        // 手机号
        phone: ''
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 获取管理员列表
    async getUserList() {
      await this.$http
        .post('permission/user/list', this.queryInfo)
        .then(res => {
          console.log(res)
          if (res.data.code !== 20000) return this.$message.error('获取管理员列表失败')
          // this.$message.success('获取学生列表成功')
          this.userlist = res.data.data.users
          this.total = res.data.data.totalpage
          // console.log(res.data.data.users)
          console.log(this.userlist)
        })
        .catch(err => {
          this.$message.error('获取管理员列表失败:' + err)
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
        .put(`permission/user/${userInfo.id}/upd/${userInfo.status}`)
        .then(res => {
          console.log(res)
          if (res.data.code !== 20000) {
            // 更新失败后，重置switch开关状态为未点击状态
            userInfo.status = !userInfo.status
            this.getUserList()
            return this.$message.error(res.data.message + '')
          }
          this.$message.success('更新管理员状态成功')
          this.getUserList()
        })
        .catch(err => {
          // 更新失败后，重置switch开关状态为未点击状态
          userInfo.status = !userInfo.status
          this.$message.error('更新管理员状态失败:' + err)
          this.getUserList()
        })
    },
    // 展示编辑用户的对话框
    async showEditRoleDialog(id) {
      const { data: res } = await this.$http.get('permission/user/' + id)
      if (res.code !== 20000) {
        return this.$message.error(res.message)
      }
      this.editForm = res.data
      // 点击编辑按钮时展开对话框
      this.editDialogVisible = true
      // console.log(res)
    },
    // 监听修改角色Dialog关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并提交
    editRoleInfo() {
      // 表单预验证
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return // 验证不通过，则返回
        // 发起修改就是信息的数据请求
        const { data: res } = await this.$http.put('permission/user/upd/' + this.editForm.id,
          {
            username: this.editForm.username,
            email: this.editForm.email,
            phone: this.editForm.phone
          }
        )
        // console.log(res)
        if (res.code !== 20000) {
          return this.$message.error(res.message)
        }
        // 关闭对话框
        this.editDialogVisible = false
        // 刷新数据列表
        this.getUserList()
        // 提示修改成功
        this.$message.success(res.message)
      })
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
      const { data: res } = await this.$http.delete('permission/user/del/' + id)
      if (res.code !== 20000) return this.$message.error(res.message)
      this.$message.success('用户删除成功!')
      this.getUserList()
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮，添加新用户
    addUser() {
      // 表单预校验
      this.$refs.addFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return // 验证失败，则返回
        // 验证通过，发起添加角色的请求
        const { data: res } = await this.$http.post('permission/role/add', this.addForm)
        if (res.code !== 20000) {
          this.$message.error('添加角色失败!')
        }
        this.$message.success('添加角色成功!')
        // 关闭Dialog
        this.addUserdialogVisible = false
        // 刷新角色列表
        this.getRolesList()
      })
    }

  }
}
</script>

<style lang="less" scoped>

</style>
