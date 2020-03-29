<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文件管理</el-breadcrumb-item>
      <el-breadcrumb-item>文件上传</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 文件上传 -->
      <el-tag type="warning">请选择将要上传的文件</el-tag>
      <el-cascader
        v-model="fileNameValue"
        :options="fileNameList"
        :props="upFileProps"
        clearable
        @change="handleChange"
      />
      <el-upload
        drag
        show-file-list
        action="http://localhost:8888/api/files/upload"
        :headers="headerObj"
        :on-success="handleSuccess"
        accept=".doc"
        :data="paramObj"
        :before-upload="handleBefore"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip">只能上传后缀为.doc 文件，且不超过2M</div>
      </el-upload>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 图片请求头
      headerObj: {
        Authorization: 'Bearer ' + window.sessionStorage.getItem('token')
      },
      paramObj: {
        remark: ''
      },
      // 文件上传级联选择器的数据源
      fileNameList: [
        {
          value: '岗位申请表(基础)',
          label: '岗位申请表'
        },
        {
          value: '工作考核表(基础)',
          label: '工作考核表'
        }
      ],
      fileNameValue: '',
      // 上传文件类型的级联选择器配置对象
      upFileProps: {
        expandTrigger: 'hover'
      }
    }
  },
  created() {
  },
  methods: {
    // 监听文件上传成功的事件
    handleSuccess(response, file) {
      console.log(response)
      console.log(file)
      if (response.code !== 20000) {
        return this.$message.error(response.message)
      }
      this.$message.success(response.message)
    },
    // 监听级联选择器的选中变化
    handleChange() {
      // console.log(this.fileNameValue)
      this.isDisabled = false
      this.paramObj.remark = this.fileNameValue
    },
    // 监听上传之前
    handleBefore() {
      if (this.paramObj.remark === '' || this.fileNameValue.length < 1) {
        this.$message.error('请选择所要上传的文件')
        return false
      }
      return true
    }
  }
}
</script>

<style lang="less" scoped>

</style>
