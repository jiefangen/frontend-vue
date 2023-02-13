<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" placeholder="输入用户名或IP搜索" size="medium" style="width: 200px; margin-right: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" size="medium" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 14px;" type="primary" size="medium" icon="el-icon-refresh" @click="handleClear">
        清空
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      size="medium"
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      :row-class-name="tableRowClassName"
      style="width: 100%; margin-top:20px;"
    >
      <el-table-column prop="ipAddress" label="IP地址" align="center" />
      <el-table-column prop="username" label="用户名" align="center" />
      <el-table-column prop="actionDesc" label="操作类型" align="center" />
      <el-table-column prop="elapsedTime" label="耗时（毫秒）" align="center" />
      <el-table-column prop="statusCode" label="状态码" align="center" />
      <el-table-column prop="operatingTimeStr" label="操作时间" align="center" width="160" />
      <el-table-column prop="content" label="操作内容" width="160" :show-overflow-tooltip="true"/>
      <el-table-column prop="exceptionInfo" label="异常信息" width="240" :show-overflow-tooltip="true"/>
    </el-table>
    <!--分页组件-->
    <pagination v-show="total" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination'
  import { getList, empty } from '@/api/monitor/log'
  export default {
    name: 'ActionLog',
    components: { Pagination },
    data() {
      return {
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          pageNum: 1,
          pageSize: 10
        },
        row: {
          id: undefined,
          username: '',
          ipAddress: '',
          actionDesc: '',
          operatingTimeStr: '',
          elapsedTime: '',
          statusCode: '',
          content: '',
          exceptionInfo: ''
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      tableRowClassName({ row, rowIndex }) {
        if (row.statusCode === 500) {
          return 'danger-row'
        } else if (row.statusCode === 20000) {
          return 'success-row'
        }
        return 'warning-row'
      },
      getList() {
        this.listLoading = true
        getList(this.listQuery).then(response => {
          const data = response.data
          this.list = data.list
          this.total = data.total
          this.pageNum = data.pageNum
          this.pageSize = data.pageSize
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.pageNum = 1
        this.getList()
      },
      handleClear() {
        this.$confirm('此操作将永久清空日志数据，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          empty().then(() => {
              this.handleFilter()
              this.$notify({
                title: '成功',
                message: '清空成功',
                type: 'success',
                duration: 2000
              })
            }).catch(err => { console.error(err) })
          }
        )
      }
    }
  }
</script>

