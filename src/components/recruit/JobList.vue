<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>招聘管理</el-breadcrumb-item>
      <el-breadcrumb-item>招聘信息</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            v-model="queryInfo.query"
            placeholder="请输入内容"
            clearable
            @clear="getJobList"
            @keyup.enter.native="getJobList"
          >
            <el-button slot="append" icon="el-icon-search" />
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" icon="el-icon-edit" @click="goAddPage">添加</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" icon="el-icon-download" @click="exportTable">导出</el-button>
        </el-col>
      </el-row>
      <!-- table表格区域 -->
      <el-table
        id="exportTab"
        :data="joblist"
        style="width: 100%"
        border
        stripe
      >
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template v-slot:="scope">
            <el-row>
              <el-col>
                <el-tag type="success">岗位名称</el-tag>
                <label>{{ scope.row.cen_jobname }}</label>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-tag type="success">任职要求</el-tag>
                <label>{{ scope.row.cen_request }}</label>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-tag type="success">负责老师</el-tag>
                <label>{{ scope.row.username }}</label>
                <el-tag type="success">所在学院</el-tag>
                <label>{{ scope.row.college }}</label>
                <el-tag type="success">联系电话</el-tag>
                <label>{{ scope.row.phone }}</label>
                <el-tag type="success">电子邮箱</el-tag>
                <label>{{ scope.row.email }}</label>
              </el-col>
            </el-row>
          </template>
        </el-table-column>

        <el-table-column
          type="index"
          label="#"
        />
        <el-table-column
          prop="cen_jobname"
          label="岗位名称"
        />
        <el-table-column
          prop="cen_unit"
          label="招聘单位"
        />
        <el-table-column
          prop="username"
          label="负责老师"
        />
        <el-table-column
          prop="cen_address"
          label="工作地点"
        />
        <el-table-column
          prop="cen_date"
          label="发布时间"
        />
        <el-table-column prop="点击查看" label="岗位职责">
          <template v-slot:="scope">
            <el-button type="primary" size="mini" @click="showjobdetails(scope.row.cen_duty)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="cen_number"
          label="招聘人数"
        />
        <el-table-column label="是否招满">
          <template v-slot:="scope">
            <el-tag v-if="scope.row.cen_fullstate===false" type="success">未招满</el-tag>
            <el-tag v-else type="danger">已招满</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否过期">
          <template v-slot:="scope">
            <el-tag v-if="scope.row.cen_state===false" type="success">未过期</el-tag>
            <el-tag v-else type="danger">已过期</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="145px">
          <template v-slot:="scope">
            <el-button type="primary" size="mini">编辑</el-button>
            <el-button type="danger" size="mini" @click="removeJobInfo(scope.row.cenId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--分页区域  -->
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
    <!-- 岗位详情对话框 -->
    <el-dialog
      title="岗位详情"
      :visible.sync="jobDetailsDialogVisible"
      width="50%"
    >
      <pre v-text="jobdetailtxt" />
    </el-dialog>
  </div>
</template>

<script>
import FileSaver from 'file-saver'
import XLSX from 'xlsx'

export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 岗位列表
      joblist: [],
      // 总数据条数
      total: 0,
      jobDetailsDialogVisible: false,
      // 岗位详情内容
      jobdetailtxt: ''
    }
  },
  created() {
    this.getJobList()
  },
  methods: {
    // 根据分页获取对应的招聘信息
    async  getJobList() {
      const { data: res } = await this.$http.get('recruit/content', { params: this.queryInfo })
      if (res.code !== 20000) {
        return this.$message.error(res.message)
      }
      // this.$message.success(res.message)
      console.log(res.data)
      this.joblist = res.data.infos
      this.total = res.data.total
    },
    // 展开岗位详情对话框
    showjobdetails(cen_duty) {
      this.jobdetailtxt = cen_duty
      this.jobDetailsDialogVisible = true
    },
    // 监听pagesize改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getJobList()
    },
    // 监听当前页码值 pagenum 的改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getJobList()
    },
    // 导出excel到本地
    exportTable() {
      /* generate workbook object from table */
      var xlsxParam = { raw: true } // 导出的内容只做解析，不进行格式转换
      var wb = XLSX.utils.table_to_book(document.querySelector('#exportTab'), xlsxParam)

      /* get binary string as output */
      var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
      try {
        FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '岗位信息表.xlsx')
      } catch (e) {
        if (typeof console !== 'undefined') {
          console.log(e, wbout)
        }
      }
      return wbout
    },
    // 删除岗位信息
    async removeJobInfo(jobid) {
    // console.log('id=' + id)
      // 弹框询问是否删除分类
      const confirmResult = await this.$confirm('此操作将永久删除该岗位, 是否继续?', '提示', {
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
      const { data: res } = await this.$http.delete('recruit/content/del/' + jobid)
      if (res.code !== 20000) return this.$message.error(res.message)
      this.$message.success(res.message)
      this.getJobList()
    },
    goAddPage() {
      this.$router.push('/recruit/content/add/')
    }
  }
}
</script>

<style lang="less" scoped>

</style>
