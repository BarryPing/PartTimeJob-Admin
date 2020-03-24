<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>招聘管理</el-breadcrumb-item>
      <el-breadcrumb-item>岗位分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格:tree-table插件 具体详见：https://github.com/MisterTaki/vue-table-with-tree-grid-->
      <tree-table
        class="treeTable"
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        border
      >
        <!-- 是否有效模板列 -->
        <template v-slot:isok="scope">
          <i v-if="scope.row.jtState===true" class="el-icon-success" style="color:lightgreen" />
          <i v-else class="el-icon-error" style="color:red" />
        </template>
        <!-- 排序模板列 -->
        <template v-slot:order="scope">
          <el-tag v-if="scope.row.jtLevel===1" size="mini">一级</el-tag>
          <el-tag v-else-if="scope.row.jtLevel===2" size="mini" type="success">二级</el-tag>
          <el-tag v-else size="mini" type="warning">三级</el-tag>
        </template>
        <!-- 操作模板列 -->
        <template v-slot:opt="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditCateDialog(scope.row.jtId,scope.row.jtName)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCate(scope.row.jtId)">删除</el-button>
        </template>
      </tree-table>
      <!--分页区域  -->
      <el-pagination
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
    >
      <!-- 添加分类的表单 -->
      <el-form ref="addCateFormRulesRef" :model="addCateForm" :rules="addCateFormRules" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name" />
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- options:用来指定数据源 -->
          <!-- props:用来指定配置对象 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类的对话框 -->
    <el-dialog
      title="修改分类"
      :visible.sync="editCateDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form ref="editFormRef" :model="editFormInfo" :rules="addCateFormRules" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editFormInfo.cat_name" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
export default {
  data() {
    return {
      // 查询条件
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 岗位分类的数据列表，默认为空
      catelist: [],
      // 总数据条数
      total: 0,
      // 为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'jtName'
        },
        {
          label: '是否有效',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示,当前这一列使用的模板名称
          template: 'isok'

        },
        {
          label: '排序',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示,当前这一列使用的模板名称
          template: 'order'

        },
        {
          label: '操作',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示,当前这一列使用的模板名称
          template: 'opt'

        }
      ],
      // 控制添加分类对话框的显示与隐藏
      addCateDialogVisible: false,
      // 控制修改分类对话框的显示与隐藏
      editCateDialogVisible: false,
      // 添加分类的表达数据对象
      addCateForm: {
        // 将要添加的分类的名称
        cat_name: '',
        // 父级分类的id
        cat_pid: 0
      },
      // 编辑分类的表达数据对象
      editFormInfo: {
        cat_id: 0,
        cat_name: ''
      },
      // 添加分类的验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 父级分类的数据列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'jtId',
        label: 'jtName',
        children: 'children'
      },
      // 选中的父级分类的ID数组
      selectedKeys: []
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取岗位分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('recruit/class', { params: this.querInfo })
      if (res.code !== 20000) {
        return this.$message.error(res.message)
      }
      // 把数据列表，赋值给 catelist
      this.catelist = res.data.categorys
      // 为总数据条数赋值
      this.total = res.data.totalpage
      console.log(res)
    },
    // 监听pagesize改变
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听当前页码值 pagenum 的改变
    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage
      this.getCateList()
    },
    // 点击按钮显示添加分类的对话框
    showAddCateDialog() {
      // 先获取父级分类的数据列表
      this.getParentCateList()
      // 再展示对话框
      this.addCateDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('recruit/parentclass', { params: this.querInfo })
      if (res.code !== 20000) {
        return this.$message.error(res.message)
      }
      // 把数据列表，赋值给 catelist
      this.parentCateList = res.data.categorys
      // console.log(this.parentCateList)
    },
    // 级联选择器选项发生变化触发该函数
    parentCateChange() {
      console.log(this.selectedKeys)
    },
    // 监听编辑按钮的点击事件
    showEditCateDialog(jtId, jtName) {
      this.editFormInfo.cat_id = jtId
      this.editFormInfo.cat_name = jtName
      this.editCateDialogVisible = true
    },
    // 监听修改角色Dialog关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 监听编辑按钮的 确定 点击事件
    editCate() {
      // 表单预验证
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return // 验证不通过，则返回
        // 发起修改就是信息的数据请求
        const { data: res } = await this.$http.put('recruit/class/upd/' + this.editFormInfo.cat_id,
          {
            jtName: this.editFormInfo.cat_name
          }
        )
        // console.log(res)
        if (res.code !== 20000) {
          return this.$message.error(res.message)
        }
        // 关闭对话框
        this.editCateDialogVisible = false
        // 刷新数据列表
        this.getCateList()
        // 提示修改成功
        this.$message.success(res.message)
      })
    },
    // 删除分类信息
    async removeCate(id) {
    // console.log('id=' + id)
      // 弹框询问是否删除分类
      const confirmResult = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
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
      const { data: res } = await this.$http.delete('recruit/class/del/' + id)
      if (res.code !== 20000) return this.$message.error(res.message)
      this.$message.success(res.message)
      this.getCateList()
    }
  }
}
</script>

<style lang="less" scoped>

.treeTable{
    margin-top:15px;
}

.el-cascader{
    width:100%
}
</style>
