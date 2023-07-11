<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" :placeholder="$t('system.permissionPlaceholder')" size="medium" style="width: 200px; margin-right: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" size="medium" icon="el-icon-search" @click="handleFilter">
        {{ $t('common.search') }}
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
      <el-table-column prop="id" :label="String($t('system.permissionNum'))" align="center" width="80" />
      <el-table-column prop="permissionName" :label="String($t('system.permissionName'))" align="center" />
      <el-table-column prop="permissionCode" :label="String($t('system.permissionCode'))" align="center" :show-overflow-tooltip="true" />
      <el-table-column prop="resourcesType" :label="String($t('system.resourcesType'))" align="center" width="100" />
      <el-table-column prop="resourcesId" :label="String($t('system.resourcesId'))" align="center" />
      <el-table-column prop="source" :label="String($t('system.source'))" align="center" />
      <el-table-column prop="description" :label="String($t('system.description'))" align="center" width="220" :show-overflow-tooltip="true" />
      <el-table-column prop="operationScope" :label="String($t('system.operationScope'))" :show-overflow-tooltip="true" />
    </el-table>
    <!--分页组件-->
    <pagination v-show="total" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getList } from '@/api/system/permission'
export default {
  name: 'Permissions',
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
        permissionName: '',
        permissionCode: '',
        description: '',
        resourcesId: '',
        resourcesType: '',
        source: '',
        operationScope: ''
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
    }
  }
}
</script>
