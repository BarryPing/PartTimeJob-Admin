<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>招聘管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加岗位</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert
        title="添加岗位信息"
        type="info"
        center
        show-icon
        :closable="false"
      />
      <!-- 步骤条区域 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息" />
        <el-step title="岗位描述" />
        <el-step title="工作地点" />
        <el-step title="申请表" />
        <el-step title="完成" />
      </el-steps>
      <!-- tab栏区域 -->
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="100px" label-position="top">
        <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="beforeTabLeave">
          <el-tab-pane name="0" label="基本信息">
            <el-form-item label="岗位名称" prop="cen_jobname">
              <el-input v-model="addForm.cen_jobname" />
            </el-form-item>
            <el-form-item label="招聘单位" prop="cen_unit">
              <el-input v-model="addForm.cen_unit" />
            </el-form-item>
            <el-form-item label="招聘人数" prop="cen_number">
              <el-input v-model="addForm.cen_number" type="number" />
            </el-form-item>
            <el-form-item label="岗位分类" prop="job_cat">
              <el-cascader
                v-model="addForm.job_cat"
                :options="catelist"
                :props="cateProps"
                clearable
                @change="handleChange"
              />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="1" label="岗位描述">
            <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="100px" label-position="top">
              <el-form-item label="岗位描述" prop="cen_duty">
                <el-input
                  v-model="addForm.cen_duty"
                  type="textarea"
                  rows="8"
                  placeholder="请输入内容"
                  maxlength="80"
                  show-word-limit
                  resize="none"
                  style="width:80%"
                />
              </el-form-item>
              <el-form-item label="任职要求" prop="cen_request">
                <el-input
                  v-model="addForm.cen_request"
                  type="textarea"
                  rows="8"
                  placeholder="请输入内容"
                  maxlength="80"
                  show-word-limit
                  resize="none"
                  style="width:80%"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane name="3" label="工作地点">
            <el-form-item label="工作地点" prop="cen_address">
              <el-input v-model="addForm.cen_address" />
            </el-form-item>
            <el-form-item label="负责老师" prop="cen_fzPerson">
              <el-cascader
                v-model="addForm.cen_fzPerson"
                :options="fzlslist"
                :props="fzlsProps"
                clearable
              />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="4" label="岗位申请">
            <!-- 富文本编辑器组件 -->
            <!-- <quill-editor v-model="addForm.cen_form" /> -->
            <!-- 文件上传 -->
            <el-upload
              class="upload-demo"
              drag
              action="https://jsonplaceholder.typicode.com/posts/"
              multiple
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div slot="tip" class="el-upload__tip">只能上传docx文件，且不超过500kb</div>
            </el-upload>
            <!-- 添加岗位的按钮 -->
            <el-button type="primary" class="btnAdd" @click="addJob">添加岗位</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: '0',
      // 添加商品额表单数据对象
      addForm: {
        cen_jobname: '',
        cen_unit: '',
        cen_number: 0,
        // 工作地点
        cen_address: '',
        // 岗位所属的分类数组
        job_cat: [],
        // 职位描述
        cen_duty: '',
        // 任职要求
        cen_request: '',
        // 负责老师编号
        cen_fzPerson: 0,
        // 岗位申请
        cen_form: ''

      },
      addFormRules: {
        cen_jobname: [
          { required: true, message: '请输入岗位名称', trigger: 'blur' }
        ],
        cen_address: [
          { required: true, message: '请输入工作地点', trigger: 'blur' }
        ],
        cen_number: [
          { required: true, message: '请输入招聘人数', trigger: 'blur' }
        ],
        cen_unit: [
          { required: true, message: '请输入招聘单位', trigger: 'blur' }
        ],
        job_cat: [
          { required: true, message: '请输入选择岗位分类', trigger: 'blur' }
        ],
        cen_duty: [
          { required: true, message: '请输入职位描述', trigger: 'blur' }
        ],
        cen_request: [
          { required: true, message: '请输入任职要求', trigger: 'blur' }
        ],
        cen_fzPerson: [
          { required: true, message: '请选择岗位负责老师', trigger: 'blur' }
        ]
      },
      // 岗位分类数据
      catelist: [],
      // 负责老师数据
      fzlslist: [],
      // 岗位分类级联选择器配置对象
      cateProps: {
        expandTrigger: 'hover',
        value: 'jtId',
        label: 'jtName',
        children: 'children'
      },
      fzlsProps: {
        expandTrigger: 'hover',
        value: 'id',
        label: 'username'
      }
    }
  },
  created() {
    this.getCateList()
    this.getfzlsList()
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
      this.removeChildren(this.catelist)
      console.log(this.catelist)
    },
    // 递归删除岗位分类数据当中子节点为空的children对象
    removeChildren(array) {
      array.forEach(element => {
        if (element.children.length === 0) {
          delete element.children
        } else {
          this.removeChildren(element.children)
        }
      })
    },

    // 级联选择器选中项变化，会触发这个函数
    handleChange() {
      // console.log(this.addForm.job_cat)
      // 设置只能选择三级分类
      if (this.addForm.job_cat.length !== 3) {
        this.addForm.job_cat = []
      }
    },

    // 监听标签页切换时，触发的函数
    beforeTabLeave(activeName, oldActiveName) {
      // console.log('即将进入的标签页的Id是：' + activeName + '  即将离开的标签页的Id是：' + oldActiveName)
      if (oldActiveName === '0' &&
    this.addForm.job_cat.length !== 3) {
        this.$message.error('请先选择岗位分类!')
        return false
      }
    },
    // 获取负责老师信息列表
    async getfzlsList() {
      const { data: res } = await this.$http.get('permission/user/all')
      this.fzlslist = res.data
      console.log(this.fzlslist)
    },
    // 添加岗位信息
    addJob() {
      console.log(this.addForm)
    }
  }
}
</script>

<style lang="less" scoped>
.btnAdd{
    margin-top:15px
}
</style>
