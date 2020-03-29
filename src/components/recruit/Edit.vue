<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>招聘管理</el-breadcrumb-item>
      <el-breadcrumb-item>岗位修改</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <h3>基本信息</h3>
      <div>
        <el-form ref="basicFormRef" :model="EditForm" :rules="basicFormRules" label-width="100px">
          <el-form-item label="岗位Id" prop="cen_id">
            <el-input v-model="EditForm.cen_id" disabled />
          </el-form-item>
          <el-form-item label="岗位名称" prop="cen_jobname">
            <el-input v-model="EditForm.cen_jobname" />
          </el-form-item>
          <el-form-item label="用工单位" prop="cen_unit">
            <el-input v-model="EditForm.cen_unit" />
          </el-form-item>
          <el-form-item label="招聘人数 " prop="cen_number">
            <el-input v-model="EditForm.cen_number" />
          </el-form-item>
          <el-form-item label="报名人数 " prop="cen_appronumber">
            <el-input v-model="EditForm.cen_appronumber" />
          </el-form-item>
          <el-form-item label="是否招满 " prop="cen_fullstate">
            <el-radio v-model="EditForm.cen_fullstate" :label="true">已招满</el-radio>
            <el-radio v-model="EditForm.cen_fullstate" :label="false">未招满</el-radio>
          </el-form-item>
          <el-form-item label="是否过期 " prop="cen_state">
            <el-radio v-model="EditForm.cen_state" :label="true">已过期</el-radio>
            <el-radio v-model="EditForm.cen_state" :label="false">未过期</el-radio>
          </el-form-item>
          <el-form-item v-show="false" label="岗位分类" prop="cen_jid">
            <el-cascader
              v-model="EditForm.cen_jid"
              :options="catelist"
              :props="cateProps"
              clearable
              @change="handleChange"
            />
          </el-form-item>

          <h3>岗位描述</h3>
          <div>
            <el-form-item label="岗位职责" prop="cen_duty">
              <el-input
                v-model="EditForm.cen_duty"
                type="textarea"
                rows="8"
                placeholder="请输入内容"
                maxlength="180"
                show-word-limit
                resize="none"
                style="width:80%"
              />
            </el-form-item>
            <el-form-item label="任职要求" prop="cen_request">
              <el-input
                v-model="EditForm.cen_request"
                type="textarea"
                rows="8"
                placeholder="请输入内容"
                maxlength="180"
                show-word-limit
                resize="none"
                style="width:80%"
              />
            </el-form-item>
            <h3>工作地点</h3>
            <div>
              <el-form-item label="工作地点" prop="cen_address">
                <el-input v-model="EditForm.cen_address" />
              </el-form-item>
              <el-form-item v-show="false" label="负责老师" prop="cen_fzPerson">
                <el-cascader
                  v-model="EditForm.cen_fzPerson"
                  :options="fzlslist"
                  :props="fzlsProps"
                  clearable
                />
              </el-form-item>

            </div>
            <div style="text-align:center">
              <el-button @click="cancel">取消</el-button>
              <el-button type="primary" @click="updateJob">更新岗位</el-button>
            </div>

          </div></el-form></div></el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 基本信息表单数据对象
      EditForm: {},
      // 表单数据规则验证对象
      basicFormRules: {
        cen_jobname: [
          { required: true, message: '请输入岗位名称', trigger: 'blur' }
        ],
        cen_unit: [
          { required: true, message: '请输入用工单位', trigger: 'blur' }
        ],
        cen_number: [
          { required: true, message: '请输入招聘人数', trigger: 'blur' }
        ],
        cen_jid: [
          { required: true, message: '请输入岗位类型', trigger: 'blur' }
        ],
        cen_duty: [
          { required: true, message: '请输入岗位职责', trigger: 'blur' }
        ],
        cen_request: [
          { required: true, message: '请输入任职要求', trigger: 'blur' }
        ],
        cen_address: [
          { required: true, message: '请输入工作地点', trigger: 'blur' }
        ],
        cen_fzPerson: [
          { required: true, message: '请输入负责老师', trigger: 'blur' }
        ],
        cen_appronumber: [
          { required: true, message: '请输入报名人数', trigger: 'blur' }
        ]
      },
      // 招聘信息的Id，用于获取数据
      cen_id: 0,
      // 岗位分类级联选择器配置对象
      cateProps: {
        expandTrigger: 'hover',
        value: 'jtId',
        label: 'jtName',
        children: 'children'
      },
      // 岗位负责老师的级联选择器配置对象
      fzlsProps: {
        expandTrigger: 'hover',
        value: 'id',
        label: 'username'
      },
      // 岗位分类数据列表
      catelist: [],
      // 负责老师数据
      fzlslist: []
    }
  },
  created() {
    this.getJobInfo()
    this.getCateList()
    this.getfzlsList()
  },
  methods: {
    // 查询某个岗位信息
    async getJobInfo() {
      this.cen_id = this.$route.params.id
      // console.log(this.cen_id)
      const { data: res } = await this.$http.get('recruit/content/view/' + this.cen_id)
      console.log(res)
      this.EditForm = res.data
    },
    // 级联选择器选中项变化，会触发这个函数
    handleChange() {
      console.log(this.EditForm)
      // 设置只能选择三级分类
      if (this.EditForm.job_cat.length < 3) {
        this.EditForm.job_cat = []
      }
    },
    // 获取岗位分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('recruit/class', { params: this.querInfo })
      if (res.code !== 20000) {
        return this.$message.error(res.message)
      }
      // 把数据列表，赋值给 catelist
      this.catelist = res.data.categorys
      this.removeChildren(this.catelist)
      // console.log(this.catelist)
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
    // 获取负责老师信息列表
    async getfzlsList() {
      const { data: res } = await this.$http.get('permission/user/all')
      this.fzlslist = res.data
      // console.log(this.fzlslist)
    },
    // 取消按钮点击事件
    cancel() {
      this.$router.push('/recruit/content')
    },
    // 确定更新按钮
    updateJob() {
      console.log(this.EditForm)
      this.$refs.basicFormRef.validate(async valid => {
        if (!valid) {
          // 验证不通过，则返回
          return this.$message.error('请填写必要的信息!')
        }
        // 发起修改就是信息的数据请求
        const { data: res } = await this.$http.put('recruit/content/upd/' + this.EditForm.cen_id,
          {
            cen_jobname: this.EditForm.cen_jobname,
            cen_unit: this.EditForm.cen_unit,
            cen_number: this.EditForm.cen_number,
            cen_appronumber: this.EditForm.cen_appronumber,
            cen_fullstate: this.EditForm.cen_fullstate,
            cen_state: this.EditForm.cen_state,
            cen_jid: this.EditForm.cen_jid,
            cen_duty: this.EditForm.cen_duty,
            cen_request: this.EditForm.cen_request,
            cen_address: this.EditForm.cen_address,
            cen_fzPerson: this.EditForm.cen_fzPerson
          }
        )
        // console.log(res)
        if (res.code !== 20000) {
          return this.$message.error(res.message)
        }
        // 提示修改成功
        this.$message.success(res.message)
        this.$router.push('/recruit/content')
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
