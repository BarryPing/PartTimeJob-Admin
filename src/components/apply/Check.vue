<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>应聘管理</el-breadcrumb-item>
      <el-breadcrumb-item>考核信息</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <template>
        <h3>{{ month }}月勤工助学上岗学生工作情况考核表</h3>
        <el-carousel indicator-position="outside" :autoplay="false" trigger="click" height="400px">
          <el-carousel-item v-for="item in checkForm" :key="item.ckId">
            <el-form ref="checkFormRef" label-width="100px">
              <!-- 第一行 -->
              <el-row :gutter="10">
                <el-col :span="8">
                  <el-form-item label="姓名">
                    <el-input v-model="item.student.username" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="工作岗位">
                    <el-input v-model="item.jobCenterjob.cenJobname" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="身份证号">
                    <el-input v-model="item.applytable.atStuidcard" disabled />
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 第二行 -->
              <el-row :gutter="10">
                <el-col :span="8">
                  <el-form-item label="银行卡号">
                    <el-input v-model="item.applytable.atStubankcard" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="学号">
                    <el-input v-model="item.applytable.atStuid" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="手机长短号">
                    <el-input v-model="item.student.phone" disabled />
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 第三行 -->
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item label="每周工作时长">
                    <el-input v-model="item.ckWeektime" placeholder="单位：小时" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="本月总时长">
                    <el-input v-model="item.ckSumtime" placeholder="单位：小时" />
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 第四行 -->
              <el-row :gutter="10">
                <el-col :span="8">
                  <el-form-item label="旷到次数">
                    <el-input v-model="item.ckNull" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="请假次数">
                    <el-input v-model="item.ckVaca" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="迟到早退次数">
                    <el-input v-model="item.ckLateearly" />
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 第五行 -->
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item label="考核等级">
                    <template>
                      <el-select v-model="item.ckLevel" placeholder="请选择">
                        <el-option
                          v-for="item in levels"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </template>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="负责人签字">
                    <el-input v-model="item.ckFuze" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item style="margin-left:800px">
                <el-button type="info" @click="reset(item)">重置</el-button>
                <el-button type="primary" @click="submit(item)">提交</el-button>
              </el-form-item>
            </el-form>
          </el-carousel-item>
        </el-carousel>
      </template>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checkForm: [],
      checkFormRules: {

      },

      // 当月
      month: '',
      levels: [{
        value: 'A级',
        label: 'A级'
      }, {
        value: 'B级',
        label: 'B级'
      }, {
        value: 'C级',
        label: 'C级'
      }, {
        value: 'D级',
        label: 'D级'
      }]
    }
  },
  mounted() {
    this.getDate()
    this.getCheck()
  },
  methods: {
    getDate() {
      var nowDate = new Date()
      const date = {
        year: nowDate.getFullYear(),
        month: nowDate.getMonth() + 1,
        date: nowDate.getDate()
      }
      this.month = date.month
      console.log(date.month)
    },
    // 获取岗位考核信息
    getCheck() {
      this.$http.get('accept/checkcontent')
        .then(res => {
          const { code, message, data } = res.data
          if (code !== 20000) return this.$message.error(message)
          this.checkForm = data
          console.log(this.checkForm)
        })
    },
    // 提交岗位考核数据
    submit(item) {
      this.$http.post('accept/add', {
        ckId: item.ckId,
        ckTbid: item.ckTbid,
        ckWeektime: item.ckWeektime,
        ckSumtime: item.ckSumtime,
        ckNull: item.ckNull,
        ckVaca: item.ckVaca,
        ckLateearly: item.ckLateearly,
        ckLevel: item.ckLevel,
        ckFuze: item.ckFuze
      })
        .then(res => {
          const { code, message } = res.data
          if (code !== 20000) return this.$message.error(message)
          this.$message.success(message)
          this.getCheck()
          console.log(this.checkForm)
        })
    },
    // 重置填写表单
    reset(item) {
      item.ckWeektime = '',
      item.ckSumtime = '',
      item.ckNull = '',
      item.ckVaca = '',
      item.ckLateearly = '',
      item.ckLevel = '',
      item.ckFuze = ''
    }
  }
}
</script>

<style lang="less" scoped>

</style>
