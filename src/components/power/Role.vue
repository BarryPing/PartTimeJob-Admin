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
          <el-button type="primary" @click="addRoledialogVisible=true">添加角色</el-button>
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
                <el-tag closable @close="removePermissionById(scope.row,item1.id)">{{ item1.name }}</el-tag>
                <i class="el-icon-caret-right" />
              </el-col>
              <!-- 渲染二级、三级权限 -->
              <el-col :span="19">
                <!-- 通过 for 循环 嵌套渲染二级权限 -->
                <el-row v-for="(item2,i2) in item1.children" :key="item2.id" :class="[i2===0 ? '':'bdtop','vcenter']">
                  <!-- 渲染二级权限 -->
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removePermissionById(scope.row,item2.id)">{{ item2.name }}
                    </el-tag>
                    <i class="el-icon-caret-right" />
                  </el-col>
                  <!-- 渲染三级权限 -->
                  <el-col :span="18">
                    <el-tag v-for="(item3) in item2.children" :key="item3.id" type="warning" closable @close="removePermissionById(scope.row,item3.id)">{{ item3.name }}</el-tag>
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
        <el-table-column label="角色描述" prop="description" />
        <el-table-column label="操作" width="300px">
          <template v-slot:="scope">
            <!-- 编辑按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditRoleDialog(scope.row.id)">编辑</el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRoleById(scope.row.id)">删除</el-button>
            <!-- 分配权限 -->
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetPermissionDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setPermissionDialogVisible"
      width="50%"
      @close="setPermissionDialogClosed"
    >
      <!-- 树型控件 -->
      <el-tree
        ref="treeRef"
        :data="permissionList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="setPermissionDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotPermissions">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色的对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoledialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="100px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="addForm.name" />
        </el-form-item>
        <el-form-item label="英文名称" prop="enname">
          <el-input v-model="addForm.enname" />
        </el-form-item>
        <el-form-item label="角色描述 " prop="description">
          <el-input v-model="addForm.description" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoledialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!--编辑角色的对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form ref="editFormRef" :model="editForm" :rules="addFormRules" label-width="100px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="editForm.name" />
        </el-form-item>
        <el-form-item label="英文名称" prop="enname">
          <el-input v-model="editForm.enname" />
        </el-form-item>
        <el-form-item label="角色描述 " prop="description">
          <el-input v-model="editForm.description" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleInfo">确 定</el-button>
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
    // 验证角色英文名称的规则
    var checkEnName = (rule, value, callback) => {
      if (!/^[\u0391-\uFFE5A-Za-z]+$/.test(value)) {
        callback(new Error('不可输入特殊字符'))
      } else {
        callback()
      }
    }
    // 验证角色描述的校验规则
    var checkDescription = (rule, value, callback) => {
      // 中文描述校验
      if (!value) {
        return callback(new Error('请输入中文描述'))
      }
      if (!/^[\u0391-\uFFE5A-Za-z]+$/.test(value)) {
        callback(new Error('不可输入特殊字符'))
      } else {
        callback()
      }
    }
    return {
      // 所有角色列表数据
      rolelist: [],
      // 控制权对话框的显示与隐藏
      setPermissionDialogVisible: false,
      // 所有权限的数据列表
      permissionList: [],
      // 树型控件的属性绑定对象
      treeProps: {
        label: 'name',
        children: 'children'
      },
      // 默认选中的节点Id值数组
      defKeys: [],
      // 将要分配权限的角色Id值
      roleId: '',
      // 控制添加角色对话框的显示与隐藏
      addRoledialogVisible: false,
      // 添加角色的表单数据
      addForm: {
        // 角色名称
        name: '',
        // 角色英文名
        enname: '',
        // 角色描述
        description: ''
      },
      // 添加角色的表单的验证规则对象
      addFormRules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 10, message: '角色名的长度在3~10个字符之间', trigger: 'blur' },
          { validator: checkName, trigger: 'blur' }
        ],
        enname: [
          { required: true, message: '请输入英文名称', trigger: 'blur' },
          { min: 3, max: 10, message: '英文名称的长度在3~15个字符之间', trigger: 'blur' },
          { validator: checkEnName, trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 3, max: 10, message: '角色描述的长度在3~50个字符之间', trigger: 'blur' },
          { validator: checkDescription, trigger: 'blur' }
        ]
      },
      // 控制编辑角色的对话框的显示与隐藏
      editDialogVisible: false,
      // 查询到的角色信息对象
      editForm: {}
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
          // this.$message.success('获取角色列表成功')
          this.rolelist = res.data.data
          console.log(res)
        })
        .catch(err => {
          this.$message.error('获取角色列表失败:' + err)
        })
    },
    // 根据Id删除对应的权限
    async removePermissionById(role, permissionId) {
      // 弹框提示用户是否删除该权限
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除!')
      }
      const { data: res } = await this.$http.delete(`permission/role/${role.id}/give/${permissionId}`)
      if (res.code !== 20000) {
        return this.$message.error('删除权限失败!')
      }
      this.$message.success('删除权限成功!')
      // 将服务器返回的当前角色的数据直接复制给当前角色的children属性。
      role.children = res.data
      console.log(res)
    },
    // 展示分配权限的对话框
    async showSetPermissionDialog(role) {
      this.roleId = role.id
      // 获取所有权限的数据
      const { data: res } = await this.$http.get('permission/list')
      if (res.code !== 20000) {
        return this.$message.error('获取权限失败!')
      }
      // 把获取到的权限数据保存到permissionList中
      this.permissionList = res.data
      console.log(this.permissionList)
      // 递归获取三级节点的Id值
      this.getLeafKeys(role, this.defKeys)
      this.setPermissionDialogVisible = true
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到 defKeys 数组中
    getLeafKeys(node, arry) {
      // 如果当前 node 节点中的 children 为空的话，则是三级节点
      if (node.children.length === 0) {
        return arry.push(node.id)
        // console.log(node.id)
      }
      node.children.forEach(item =>
        this.getLeafKeys(item, arry))
    },
    // 监听分配权限对话框的关闭事件
    setPermissionDialogClosed() {
      // 关闭分配权限对话框时，清空数组。
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allotPermissions() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      console.log(idStr)
      const { data: res } = await this.$http.post(`permission/role/${this.roleId}/give`, { idS: idStr })
      if (res.code !== 20000) {
        return this.$message.error('分配权限失败!')
      }
      this.$message.success('分配权限成功!')
      this.getRolesList()
      this.setPermissionDialogVisible = false
      // console.log(res)
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮，添加新角色
    addRole() {
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
        this.addRoledialogVisible = false
        // 刷新角色列表
        this.getRolesList()
      })
    },
    // 展示编辑用户的对话框
    async showEditRoleDialog(id) {
      const { data: res } = await this.$http.get('permission/role/' + id)
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
        const { data: res } = await this.$http.put('permission/role/upd/' + this.editForm.id,
          {
            name: this.editForm.name,
            enname: this.editForm.enname,
            description: this.editForm.description
          }
        )
        // console.log(res)
        if (res.code !== 20000) {
          return this.$message.error(res.message)
        }
        // 关闭对话框
        this.editDialogVisible = false
        // 刷新数据列表
        this.getRolesList()
        // 提示修改成功
        this.$message.success(res.message)
      })
    },
    async removeRoleById(id) {
      // console.log('id=' + id)
      // 弹框询问是否删除角色
      const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
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
      const { data: res } = await this.$http.delete('permission/role/del/' + id)
      if (res.code !== 20000) return this.$message.error(res.message)
      this.$message.success(res.message)
      this.getRolesList()
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
