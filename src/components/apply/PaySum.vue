<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>应聘管理</el-breadcrumb-item>
      <el-breadcrumb-item>报酬报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 分院选择器 -->

      <template>
        <el-select v-model="college" style="margin-left:800px" clearable placeholder="请选择分院" @change="selectChange">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </template>
      <el-table
        :data="payData"
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
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      payData: [],
      college: '',
      options: [{
        value: '工学院',
        label: '工学院'
      }, {
        value: '理学院',
        label: '理学院'
      }, {
        value: '商学院',
        label: '商学院'
      }, {
        value: '文学院',
        label: '文学院'
      }, {
        value: '法学院',
        label: '法学院'
      }, {
        value: '设艺学院',
        label: '设艺学院'
      }
      ]
    }
  },
  mounted() {
    this.getPaySum()
  },
  methods: {
    // 获取所有报酬信息
    getPaySum() {
      this.$http.get('accept/getPay', { params: { 'college': this.college }})
        .then(res => {
          const { code, message, data } = res.data
          if (code !== 20000) return this.$message.error(message)
          this.payData = data
          console.log(this.payData)
        })
    },
    selectChange(data) {
      this.getPaySum()
    }
  }
}
</script>

<style lang="less" scoped>

</style>
