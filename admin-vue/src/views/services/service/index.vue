<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" clearable :placeholder="$t('services.searchService')" style="width: 216px; margin-right: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('common.search') }}
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      stripe
      fit
      highlight-current-row
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      style="width: 100%; margin-top:20px;"
    >
      <el-table-column :label="String($t('services.appName'))" align="center" :show-overflow-tooltip="true">
        <template v-slot="{row}">
          <span>{{ row.appName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="String($t('services.appCode'))" align="center" :show-overflow-tooltip="true">
        <template v-slot="{row}">
          <span>{{ row.appCode }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="String($t('services.env'))" align="center">
        <template v-slot="{row}">
          <span>{{ row.env }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="String($t('services.host'))" align="center">
        <template v-slot="{row}">
          <span>{{ row.host }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="String($t('services.caption'))" class-name="status-col" align="center" :show-overflow-tooltip="true">
        <template v-slot="{row}">
          <span>{{ row.caption }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="String($t('services.business'))" class-name="status-col" align="center" :show-overflow-tooltip="true">
        <template v-slot="{row}">
          <span>{{ row.business }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="String($t('services.appStatus'))" class-name="status-col">
        <template v-slot="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="String($t('services.scope'))" align="center" :show-overflow-tooltip="true">
        <template v-slot="{row}">
          <span>{{ row.scope }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="String($t('common.operate'))" align="center" width="180" class-name="small-padding fixed-width">
        <template v-slot="{row}">
          <el-button type="info" size="mini" @click="handlePermissionInfo(row)">
            {{ $t('services.permissionInfo') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination v-show="total" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog v-el-drag-dialog :visible.sync="dialogTableVisible" :title="String($t('services.permissionInfo'))" @dragDialog="handleDrag">
      <el-tag type="info" class="permissionTag">{{ temp.appName }}</el-tag>
      <el-tag type="info" class="permissionTag">{{ temp.appCode }}</el-tag>
      <el-table :data="gridData" max-height="500px">
        <el-table-column property="permissionName" :label="String($t('services.permissionName'))" />
        <el-table-column property="permissionCode" :label="String($t('services.permissionCode'))" />
        <el-table-column property="resources" :label="String($t('services.resources'))" />
        <el-table-column property="scope" :label="String($t('services.permissionScope'))" />
        <el-table-column property="roleScope" :label="String($t('services.roleScope'))" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui

import { getServiceList, getPermissionInfo } from '@/api/services/authService'
import Pagination from '@/components/Pagination'
export default {
  name: 'Services',
  directives: { elDragDialog },
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: 'info',
        1: 'success',
        2: 'warning',
        4: 'danger'
      }
      return statusMap[status]
    }
  },
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
      showReviewer: false,
      temp: {
        id: undefined,
        appName: '',
        appCode: '',
        env: '',
        host: '',
        caption: '',
        business: '',
        status: '',
        scope: false
      },
      dialogTableVisible: false,
      statusOptions: [
        {
          value: true,
          label: this.$t('common.enabled')
        }, {
          value: false,
          label: this.$t('common.disabled')
        }
      ],
      gridData: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getServiceList(this.listQuery).then(response => {
        const { data } = response
        const { paged } = data
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
    getStatusText(status) {
      switch (status) {
        case 0:
          return this.$t('common.disable')
        case 1:
          return this.$t('common.normal')
        case 2:
          return this.$t('common.maintaining')
        case 4:
          return this.$t('common.malfunction')
        default:
          return this.$t('common.unknown')
      }
    },
    handlePermissionInfo(row) {
      this.temp = Object.assign({}, row) // copy obj
      getPermissionInfo(this.temp).then(response => {
        this.gridData = Object.assign([], response.data)
        this.dialogTableVisible = true
      })
    },
    // v-el-drag-dialog onDrag callback function
    handleDrag() {
      this.$refs.select.blur()
    }
  }
}
</script>

<style>
  .permissionTag {
    margin-left: 10px;
    margin-bottom: 10px
  }
</style>
