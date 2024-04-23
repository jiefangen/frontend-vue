<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" clearable :placeholder="$t('monitor.searchLogPlaceholder')" size="medium" style="width: 200px; margin-right: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" size="medium" icon="el-icon-search" @click="handleFilter">
        {{ $t('common.search') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 14px;" type="primary" size="medium" icon="el-icon-refresh" @click="handleClear">
        {{ $t('common.empty') }}
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
      <el-table-column prop="id" :label="String($t('monitor.logNum'))" align="center" />
      <el-table-column prop="identity" :label="String($t('monitor.identity'))" align="center" />
      <el-table-column prop="host" :label="String($t('monitor.host'))" align="center" />
      <el-table-column prop="ipAddress" :label="String($t('monitor.ipAddress'))" align="center" />
      <el-table-column prop="actionType" :label="String($t('monitor.actionType'))" align="center" />
      <el-table-column prop="statusCode" :label="String($t('monitor.statusCode'))" align="center" />
      <el-table-column prop="operatingTime" :label="String($t('monitor.operatingTime'))" align="center" width="160" />
      <el-table-column prop="elapsedTime" :label="String($t('monitor.elapsedTime'))" align="center" width="112" />
      <el-table-column prop="content" :label="String($t('monitor.content'))" width="160" :show-overflow-tooltip="true" />
      <el-table-column prop="exceptionInfo" :label="String($t('monitor.exceptionInfo'))" width="240" :show-overflow-tooltip="true" />
    </el-table>
    <!--分页组件-->
    <pagination v-show="total" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />
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
        pageNo: 1,
        pageSize: 10
      },
      paged: {},
      row: {
        id: undefined,
        identity: '',
        remoteAddress: '',
        actionType: '',
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
      if (row.statusCode === 5000) {
        return 'danger-row'
      } else if (row.statusCode === 2000) {
        return 'success-row'
      }
      return 'warning-row'
    },
    getList() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        const data = response.data
        const paged = data.paged
        this.list = data.records
        this.total = paged.total
        this.pageNo = paged.pageNo
        this.pageSize = paged.pageSize
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    handleClear() {
      this.$confirm(String(this.$t('monitor.handleClearMsg')), String(this.$t('common.title')), {
        confirmButtonText: String(this.$t('common.ok')),
        cancelButtonText: String(this.$t('common.cancel')),
        type: 'warning'
      }).then(() => {
        empty().then(() => {
          this.handleFilter()
          this.$notify({
            title: this.$t('common.success'),
            message: this.$t('monitor.emptySucceed'),
            type: 'success',
            duration: 2000
          })
        }).catch(err => { console.error(err) })
      })
    }
  }
}
</script>
