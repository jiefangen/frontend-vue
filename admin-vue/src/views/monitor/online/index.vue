<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="queryRef" :model="listQuery" :inline="true">
        <el-input
          v-model="listQuery.keyword"
          :placeholder="$t('monitor.searchOnlinePlaceholder')"
          size="medium"
          clearable
          style="width: 200px; margin-right: 10px;"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <el-button class="filter-item" type="primary" size="medium" icon="el-icon-search" @click="handleFilter">
          {{ $t('common.search') }}
        </el-button>
        <el-button class="filter-item" style="margin-left: 14px;" size="medium" icon="el-icon-refresh" @click="resetQuery">
          {{ $t('common.reset') }}
        </el-button>
      </el-form>
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
      <el-table-column prop="token" :label="String($t('monitor.token'))" align="center" :show-overflow-tooltip="true" />
      <el-table-column prop="identity" :label="String($t('monitor.onlineIdentity'))" align="center" />
      <el-table-column prop="host" :label="String($t('monitor.host'))" align="center" />
      <el-table-column prop="ipAddress" :label="String($t('monitor.loginAddress'))" align="center" />
      <el-table-column prop="terminalDevice" :label="String($t('monitor.terminalDevice'))" align="center" />
      <el-table-column prop="terminalOs" :label="String($t('monitor.terminalOs'))" align="center" />
      <el-table-column prop="createTime" :label="String($t('monitor.loginTime'))" align="center" width="160" />
      <el-table-column prop="expirationTime" :label="String($t('monitor.expirationTime'))" align="center" width="160" />

      <!-- 操作功能区 -->
      <el-table-column :label="String($t('common.operate'))" align="center" width="120">
        <template v-slot="scope">
          <el-button type="danger" size="small" @click="quitClick(scope.row)">
            {{ $t('monitor.forceQuit') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination v-show="total" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getOnlineUser" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getOnlineUser, onlineQuit } from '@/api/monitor/online'

export default {
  name: 'OnlineUser',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        keyword: ''
      },
      paged: {},
      row: {
        tokenId: undefined,
        token: '',
        identity: '',
        host: '',
        ipAddress: '',
        terminalDevice: '',
        terminalOs: '',
        createTime: '',
        expirationTime: ''
      }
    }
  },
  created() {
    this.getOnlineUser()
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
    getOnlineUser() {
      this.listLoading = true
      getOnlineUser(this.listQuery).then(response => {
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
      this.getOnlineUser()
    },
    resetQuery() {
      this.listQuery.keyword = ''
      this.handleFilter()
    },
    // 强制退出
    quitClick(item) {
      // 此操作将强退名称为"admin"的用户, 是否继续?
      this.$confirm(String(this.$t('monitor.quitClickMsg', { identity: item.identity })), String(this.$t('common.title')), {
        confirmButtonText: this.$t('common.ok'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        onlineQuit(item.tokenId).then(() => {
          this.$notify({
            title: this.$t('common.success'),
            message: this.$t('common.operationSucceed'),
            type: 'success',
            duration: 2000
          })
          this.resetQuery()
        })
      }).catch((err) => { console.log(err) })
    }
  }
}
</script>
