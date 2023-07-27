<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :model="listQuery" ref="queryRef" :inline="true">
        <el-form-item label="参数名称" prop="parameterName">
          <el-input v-model="listQuery.parameterName" placeholder="请输入参数名称" clearable style="width: 240px" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="参数键名" prop="parameterKey">
          <el-input v-model="listQuery.parameterKey" placeholder="请输入参数键名" clearable style="width: 240px" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="创建时间" prop="dateRange">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="dateFormat"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="primary" size="medium" icon="el-icon-search" @click="handleFilter">
            {{ $t('common.search') }}
          </el-button>
          <el-button class="filter-item" style="margin-left: 14px;" size="medium" icon="el-icon-refresh" @click="resetQuery">
            {{ $t('common.reset') }}
          </el-button>
        </el-form-item>
      </el-form>

      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-circle-plus-outline" @click="handleCreate">
        {{ $t('common.add') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="warning" icon="el-icon-download" @click="handleCreate">
        导出
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
      style="width: 100%;"
    >
      <el-table-column prop="parameterName" :label="String($t('config.paramName'))" :show-overflow-tooltip="true" />
      <el-table-column prop="parameterKey" :label="String($t('config.paramKey'))" :show-overflow-tooltip="true" />
      <el-table-column prop="parameterValue" :label="String($t('config.paramValue'))" :show-overflow-tooltip="true"/>
      <el-table-column prop="parameterType" :label="String($t('config.paramType'))" align="center" width="100" />
      <el-table-column prop="status" :label="String($t('config.status'))" align="center" width="80" />
      <el-table-column prop="appRange" :label="String($t('config.appRange'))" align="center" width="100" show-overflow-tooltip="true" />
      <el-table-column prop="remark" :label="String($t('config.remark'))" align="center" show-overflow-tooltip="true" />
      <el-table-column prop="creator" :label="String($t('config.creator'))" align="center" width="100" />
      <el-table-column prop="createTime" :label="String($t('config.createTime'))" align="center" width="160" />

      <el-table-column :label="String($t('common.operate'))" align="center" width="200" class-name="small-padding fixed-width">
        <template v-slot="{row, $index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            <i class="el-icon-edit" /> {{ $t('common.edit') }}
          </el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row, $index)">
            <i class="el-icon-delete" />  {{ $t('common.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination v-show="total" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <!-- 添加或修改参数配置对话框 -->
<!--    <el-dialog :title="title" v-model="open" width="500px" append-to-body>-->
<!--      <el-form ref="configRef" :model="form" :rules="rules" label-width="80px">-->
<!--        <el-form-item label="参数名称" prop="configName">-->
<!--          <el-input v-model="form.configName" placeholder="请输入参数名称" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="参数键名" prop="configKey">-->
<!--          <el-input v-model="form.configKey" placeholder="请输入参数键名" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="参数键值" prop="configValue">-->
<!--          <el-input v-model="form.configValue" placeholder="请输入参数键值" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="系统内置" prop="configType">-->
<!--          <el-radio-group v-model="form.configType">-->
<!--            <el-radio-->
<!--              v-for="dict in sys_yes_no"-->
<!--              :key="dict.value"-->
<!--              :label="dict.value"-->
<!--            >{{ dict.label }}</el-radio>-->
<!--          </el-radio-group>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="备注" prop="remark">-->
<!--          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />-->
<!--        </el-form-item>-->
<!--      </el-form>-->
<!--      <template #footer>-->
<!--        <div class="dialog-footer">-->
<!--          <el-button type="primary" @click="submitForm">确 定</el-button>-->
<!--          <el-button @click="cancel">取 消</el-button>-->
<!--        </div>-->
<!--      </template>-->
<!--    </el-dialog>-->
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getList } from '@/api/settings/parameter'

export default {
  name: 'ActionLog',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      dateRange: [],
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        parameterName: '',
        parameterKey: '',
        startDate: '',
        endDate: ''
      },
      paged: {},
      row: {
        id: undefined,
        parameterName: '',
        parameterKey: '',
        parameterValue: '',
        parameterType: '',
        status: '',
        appRange: '',
        creator: '',
        updater: '',
        createTime: ''
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
    dateFormat(picker) {
      if (picker != null) {
        this.listQuery.startDate = picker[0]
        this.listQuery.endDate = picker[1]
      } else {
        this.listQuery.startDate = ''
        this.listQuery.endDate = ''
      }
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
    resetQuery() {
      this.dateRange = []
      this.listQuery.startDate = ''
      this.listQuery.endDate = ''
      this.listQuery.parameterName = ''
      this.listQuery.parameterKey = ''
      this.handleFilter()
    }
  }
}
</script>
