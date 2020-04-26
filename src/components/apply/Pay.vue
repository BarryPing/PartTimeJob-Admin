<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>应聘管理</el-breadcrumb-item>
      <el-breadcrumb-item>报酬管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 确认状态选择 -->
      <template>
        <el-select v-model="isSure" style="margin-left:800px" clearable placeholder="请选择" @change="selectChange">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </template>
      <el-table
        :data="payInfo"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column
          prop="payId"
          label="编号"
          width="150px"
        />
        <el-table-column
          prop="payName"
          label="姓名"
          width="width"
        />
        <el-table-column
          prop="payStuid"
          label="学号"
          width="width"
        />
        <el-table-column
          prop="payCollege"
          label="学院"
          width="width"
        />
        <el-table-column
          prop="payJob"
          label="岗位"
          width="width"
        />
        <el-table-column
          prop="paySumtime"
          label="时长(小时)"
          width="width"
        />
        <el-table-column
          prop="payMoney"
          label="报酬(元)"
          width="width"
        />
        <el-table-column
          prop="prop"
          label="操作"
        >
          <template v-slot:="scope">
            <!-- 确认按钮 -->
            <el-button type="primary" disabled="isSure" @click="sureDia(scope.row.payId)">确认</el-button>
            <template />
          </template></el-table-column>
      </el-table>
    </el-card>
    <!-- 确认对话框 -->
    <el-dialog
      title="确认签名"
      :visible.sync="sureDialogVisible"
      width="30%"
    >
      <el-form ref="sureFormRef" :model="sureForm" :rules="sureFormRules" label-width="80px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="sureForm.name" placeholder="请输入您的姓名" />
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="sureDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureHandle">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: [{
        value: false,
        label: '待确认'
      }, {
        value: true,
        label: '已确认'
      }],
      payInfo: [],
      isSure: false,
      sureDialogVisible: false,
      sureForm: {
        payId: 0,
        name: ''
      },
      sureFormRules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ]
      }

    }
  },
  mounted() {
    this.getInfo()
  },
  methods: {
    // 获取报酬信息
    getInfo() {
      this.$http.get('accept/selectpay/' + this.isSure)
        .then(res => {
          const { code, message, data } = res.data
          if (code !== 20000) return this.$message.error(message)
          this.payInfo = data
          console.log(this.payInfo)
        })
    },
    // 打开确认对话框
    sureDia(id) {
      this.sureForm.payId = id
      this.sureDialogVisible = true
    },
    // 确认报酬信息
    sureHandle() {
      this.$refs.sureFormRef.validate(async valid => {
        if (!valid) return
        this.$http.post('accept/updpay', this.sureForm)
          .then(res => {
            const { code, message } = res.data
            if (code !== 20000) return this.$message.error(message)
            this.$message.error(message)
          })
      })
    },
    selectChange(data) {
      this.getInfo()
      // console.log(this.isSure)
    }
  }

}
</script>

<style lang="less" scoped>

</style>
