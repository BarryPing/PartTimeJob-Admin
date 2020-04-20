<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>审核管理</el-breadcrumb-item>
      <el-breadcrumb-item>审核列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row class="serachRow">
        <!-- 学号搜索 -->
        <el-col :span="5">
          <el-input v-model="queryInfo.apc_stuid" placeholder="请输入学生学号" />
        </el-col>
        <!-- 日期搜索 -->
        <el-col :span="7.5">
          <el-date-picker
            v-model="aoc_date"
            type="daterange"
            value-format="yyyy-MM-dd HH:mm:ss"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          />
        </el-col>
        <!-- 处理状态搜索区域 -->
        <el-col :span="5">
          <template>
            <el-select v-model="queryInfo.apc_state" placeholder="请选择">
              <el-option
                v-for="item in state"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-col>
        <!-- 查找和导出按钮区域 -->
        <el-col :span="2.5">
          <el-button type="primary" @click="getApplyList">查找</el-button>
        </el-col>
        <el-col :span="3.5">
          <el-button type="primary">导出</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table id="exportTab" v-loading="loading" :data="applylist" border stripe>
        <el-table-column type="index" label="#" />
        <el-table-column label="应聘编号" prop="apcId" />
        <el-table-column label="学生学号" prop="apcStuid" />
        <el-table-column label="处理状态">
          <template v-slot:="scope">
            <el-tag v-if="scope.row.aocFinalState===0" type="warning">未处理</el-tag>
            <el-tag v-else-if="scope.row.aocFinalState===1" type="success">已同意</el-tag>
            <el-tag v-else-if="scope.row.aocFinalState===2" type="danger">已拒绝</el-tag>
            <el-tag v-else type="info">处理中</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="申请时间" prop="aocDate" />
        <el-table-column label="操作 ">
          <template v-slot:="scope">
            <!-- 详情按钮 -->
            <el-tooltip effect="dark" content="详情" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-info" size="mini" @click="showDetailsById(scope.row.apcId)" />
            </el-tooltip>
            <!-- 处理进度按钮 -->
            <el-tooltip effect="dark" content="处理流程" placement="top" :enterable="false">
              <el-button type="success" icon="el-icon-location-outline" size="mini" @click="showProgressBox(scope.row.apcId)" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        background
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <!--查看详情的对话框 -->
      <el-dialog
        v-loading="loading2"
        element-loading-text="提交操作，请稍后......"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        title="申请详情"
        :visible.sync="DetailsDialogVisible"
        width="55%"
        @close="applyDetailsDialogClosed"
      >
        <el-form :model="applyDetails" label-width="100px" label-position="top">
          <el-form-item label="申请编号">
            <el-tag type="warning">{{ applyDetails.apcId }}</el-tag>
          </el-form-item>
          <el-form-item label="申请状态">
            <el-tag v-if="applyDetails.aocFinalState===0" type="warning">未处理</el-tag>
            <el-tag v-else-if="applyDetails.aocFinalState===1" type="success">已同意</el-tag>
            <el-tag v-else-if="applyDetails.aocFinalState===2" type="danger">已拒绝</el-tag>
            <el-tag v-else type="info">处理中</el-tag>
          </el-form-item>
          <el-form-item label="申请时间">
            <el-tag type="primary">{{ applyDetails.aocDate }}</el-tag>
          </el-form-item>
          <el-form-item label="申请人信息">
            <div>
              <el-table :data="applyTableInfo" border>
                <el-table-column align="center" label="姓名" prop="student.username" />
                <el-table-column align="center" label="学院" prop="student.college" />
                <el-table-column align="center" label="班级" prop="atStuclass" />
                <el-table-column align="center" label="学号" prop="student.stuid" />
                <el-table-column align="center" label="寝室" prop="atStudorm" />
                <el-table-column align="center" label="银行" prop="atStubank" />
                <el-table-column align="center" label="困难" prop="atStudiff" />
                <el-table-column align="center" label="手机" prop="student.phone" />
                <el-table-column label="身份证号" prop="atStuidcard" />
                <el-table-column label="银行卡号" prop="atStubankcard" />
              </el-table>
            </div>
          </el-form-item>
          <el-form-item label="岗位信息">
            <div>
              <el-table :data="jobInfo" border>
                <el-table-column align="center" label="岗位名称" prop="cenJobname" />
                <el-table-column align="center" label="用工单位" prop="cenUnit" />
                <el-table-column align="center" label="工作地址" prop="cenAddress" />
                <el-table-column align="center" label="负责人姓名" prop="fuzels.username" />
                <el-table-column align="center" label="负责人手机" prop="fuzels.phone" />
                <el-table-column align="center" label="负责人邮箱" prop="fuzels.email" />
                <el-table-column width="300px" align="center" label="工作内容" prop="cenDuty" />
                <el-table-column width="300px" align="center" label="工作要求" prop="cenRequest" />
              </el-table>
            </div>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="danger" @click="refuse(applyDetails.apcId)">拒绝</el-button>
          <el-button type="primary" @click="agree(applyDetails.apcId)">同意</el-button>
        </span>
      </el-dialog>
      <!--查看处理进度的对话框 -->
      <el-dialog
        title="处理进度"
        :visible.sync="ProgressDialogVisible"
        width="40%"
      >
        <!-- timeline组件 -->
        <el-timeline :reverse="true">
          <el-timeline-item
            v-for="(activity, index) in dealwithlist"
            :key="index"
          >
            <el-card>
              <el-tag v-if="activity.jdwResult===1" type="success">已同意</el-tag>
              <el-tag v-else type="danger">已拒绝</el-tag>
              <p>{{ activity.jdwContext }}提交于：{{ activity.jdwTime }}
              </p></el-card>
          </el-timeline-item>
        </el-timeline>
      </el-dialog>
      <!-- timeline组件 -->
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading2: false,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },

      queryInfo: {
        pagenum: 1,
        pagesize: 10,
        // 学生学号
        apc_stuid: '',
        // 处理状态
        apc_state: 0,
        // 开始日期
        start_date: '',
        // 结束日期
        end_date: ''
      },
      state: [{
        value: 0,
        label: '未处理'
      }, {
        value: 1,
        label: '已同意'
      }, {
        value: 2,
        label: '已拒绝'
      }
      ],
      // 申请日期
      aoc_date: '',
      // 岗位申请数据列表对象
      applylist: [],
      // 岗位申请详情数据对象
      applyDetails: [],
      // 岗位申请学生数据
      applyTableInfo: [],
      // 岗位详细信息
      jobInfo: [],
      total: 0,
      loading: true,
      DetailsDialogVisible: false,
      ProgressDialogVisible: false,
      // 处理流程数据
      dealwithlist: []
    }
  },
  mounted() {
    this.getApplyList()
  },
  methods: {
    // 获取岗位申请数据
    async getApplyList() {
      // console.log(this.queryInfo)
      if (this.aoc_date !== null) {
        this.queryInfo.start_date = this.aoc_date[0]
        this.queryInfo.end_date = this.aoc_date[1]
      }
      this.queryInfo.start_date = this.aoc_date[0]
      this.queryInfo.end_date = this.aoc_date[1]
      const { data: res } = await this.$http.get('accept/handle', { params: this.queryInfo })
      if (res.code !== 20000) {
        return this.$message.error(res.message)
      }
      this.applylist = res.data.infos
      this.total = res.data.total
      this.loading = false
      this.aoc_date = ''
      console.log(res)
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
    // 获取岗位申请的详细信息
    async  showDetailsById(id) {
      // console.log(id)
      const { data: res } = await this.$http.get('accept/content/view/' + id)
      console.log(res)
      if (res.code !== 20000) {
        return this.$message.error(res.message)
      }
      this.applyDetails = res.data
      // 申请表及学生信息
      this.applyTableInfo.push(res.data.applytable)
      // 岗位
      this.jobInfo.push(res.data.centerjob)
      // console.log(this.applyDetails)

      this.DetailsDialogVisible = true
    },
    // 关闭详情对话框
    applyDetailsDialogClosed() {
      this.applyTableInfo = []
      this.jobInfo = []
    },
    async  showProgressBox(id) {
      // console.log(id)
      const { data: res } = await this.$http.get('accept/content/dealwith/' + id)
      console.log(res)
      if (res.code !== 20000) {
        return this.$message.error(res.message)
      }
      this.dealwithlist = res.data
      this.ProgressDialogVisible = true
    },
    // 拒绝申请
    refuse(id) {
      this.loading2 = true
      this.$http.post('accept/upd', {
        'apcId': id,
        'state': 2
      })
        .then(res => {
          this.loading2 = false
          const { code, message } = res.data
          if (code !== 20000) return this.$message.error(message)
          this.$notify({
            title: '成功',
            message: '您的处理操作成功',
            type: 'success'
          })
          this.DetailsDialogVisible = false
          this.getApplyList()
          console.log(res)
        })
    },
    // 同意申请
    agree(id) {
      this.loading2 = true
      this.$http.post('accept/upd', {
        'apcId': id,
        'state': 1
      })
        .then(res => {
          this.loading2 = false
          const { code, message } = res.data
          if (code !== 20000) return this.$message.error(message)
          this.$notify({
            title: '成功',
            message: '您的处理操作成功',
            type: 'success'
          })
          this.DetailsDialogVisible = false
          this.getApplyList()
          console.log(res)
        })
    }
  }

}
</script>

<style lang="less" scoped>
.serachRow{
    .el-col{
        margin-left: 10px;
    }
}

</style>
