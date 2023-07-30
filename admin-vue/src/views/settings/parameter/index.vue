<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :model="listQuery" :inline="true">
        <el-form-item :label="String($t('config.paramName'))" prop="paramName">
          <el-input v-model="listQuery.paramName" :placeholder="$t('common.pleaseEnter', { text: $t('config.paramName') })" clearable style="width: 200px" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item :label="String($t('config.paramKey'))" prop="paramKey">
          <el-input v-model="listQuery.paramKey" :placeholder="$t('common.pleaseEnter', { text: $t('config.paramKey') })" clearable style="width: 200px" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item :label="String($t('config.createTime'))" prop="dateRange">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            range-separator="-"
            :start-placeholder="$t('common.startDate')"
            :end-placeholder="$t('common.endDate')"
            style="width: 280px"
            @change="dateFormat"
          />
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
      <el-button class="filter-item" :loading="downloadLoading" style="margin-left: 10px;" type="warning" icon="el-icon-download" @click="handleDownload">
        {{ $t('common.export') }}
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
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column prop="paramName" :label="String($t('config.paramName'))" show-overflow-tooltip />
      <el-table-column prop="paramKey" :label="String($t('config.paramKey'))" show-overflow-tooltip />
      <el-table-column prop="paramValue" :label="String($t('config.paramValue'))" show-overflow-tooltip />
      <el-table-column prop="paramType" :label="String($t('config.paramType'))" align="center" width="100">
        <template v-slot="scope">
          <el-tag type="primary">
            {{ scope.row.paramType == 'internal' ? $t('config.internal'):$t('config.external') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" :label="String($t('config.status'))" align="center" width="80">
        <template v-slot="scope">
          <el-tag :type="scope.row.status | statusRenderFilter">
            {{ scope.row.status == 1 ? $t('common.turnOn'):$t('common.close') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="appRange" :label="String($t('config.appRange'))" align="center" width="100" show-overflow-tooltip />
      <el-table-column prop="remark" :label="String($t('config.remark'))" align="center" show-overflow-tooltip />
      <el-table-column prop="creator" :label="String($t('config.creator'))" align="center" width="100" />
      <el-table-column prop="createTime" :label="String($t('config.createTime'))" align="center" width="160" />

      <el-table-column :label="String($t('common.operate'))" align="center" width="200" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">
            <i class="el-icon-edit" /> {{ $t('common.edit') }}
          </el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">
            <i class="el-icon-delete" />  {{ $t('common.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <!-- 添加或修改参数配置弹窗 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="paramRef" :model="tempParam" :rules="rules" label-position="left" label-width="100px" style="width: 400px; margin-left: 50px">
        <el-form-item :label="String($t('config.paramName'))" prop="paramName">
          <el-input v-model="tempParam.paramName" :placeholder="$t('common.pleaseEnter', { text: $t('config.paramName') })" />
        </el-form-item>
        <el-form-item :label="String($t('config.paramKey'))" prop="paramKey">
          <el-input v-model="tempParam.paramKey" :placeholder="$t('common.pleaseEnter', { text: $t('config.paramKey') })" :disabled="dialogStatus==='update'" />
        </el-form-item>
        <el-form-item :label="String($t('config.paramValue'))" prop="paramValue">
          <el-input v-model="tempParam.paramValue" :placeholder="$t('common.pleaseEnter', { text: $t('config.paramValue') })" />
        </el-form-item>
        <el-form-item :label="String($t('config.paramType'))" prop="paramType" :hidden="dialogStatus==='update'">
          <el-radio-group v-model="tempParam.paramType">
            <el-radio label="internal" value="internal"> {{ $t('config.internal') }} </el-radio>
            <el-radio label="external" value="external"> {{ $t('config.external') }} </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="String($t('config.status'))" prop="status">
          <el-select v-model="tempParam.status" class="filter-item">
            <el-option v-for="item in paramStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item :label="String($t('config.appRange'))" prop="appRange">
          <el-input v-model="tempParam.appRange" :placeholder="$t('common.pleaseEnter', { text: $t('config.appRange') })" />
        </el-form-item>
        <el-form-item :label="String($t('config.remark'))" prop="remark">
          <el-input v-model="tempParam.remark" type="textarea" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer" size="small">
        <el-button @click="dialogFormVisible = false">
          {{ $t('common.cancel') }}
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'? createData():updateData()">
          {{ $t('common.ok') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getList, add, del, edit } from '@/api/settings/parameter'

export default {
  name: 'Parameter',
  components: { Pagination },
  filters: {
    statusRenderFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'info'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      downloadLoading: false,
      dateRange: [],
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        paramName: '',
        paramKey: '',
        startDate: '',
        endDate: ''
      },
      paged: {},
      row: {
        id: undefined,
        paramName: '',
        paramKey: '',
        paramValue: '',
        paramType: '',
        status: '',
        appRange: '',
        remark: '',
        creator: '',
        updater: '',
        createTime: ''
      },
      typeOptions: [
        {
          value: 'internal',
          label: this.$t('config.internal')
        }, {
          value: 'external',
          label: this.$t('config.external')
        }
      ],
      paramStatusOptions: [
        {
          value: 1,
          label: this.$t('common.turnOn')
        }, {
          value: 0,
          label: this.$t('common.close')
        }
      ],
      tempParam: {},
      selectionData: {},
      textMap: {
        update: this.$t('common.edit'),
        create: this.$t('config.addParam')
      },
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        paramName: [{ required: true, trigger: 'blur' }],
        paramKey: [{ required: true, trigger: 'blur' }],
        paramValue: [{ required: true, trigger: 'blur' }]
      },
      filename: 'excel-list',
      autoWidth: true,
      bookType: 'xlsx'
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
      this.listQuery.paramName = ''
      this.listQuery.paramKey = ''
      this.handleFilter()
    },
    // 临时容器置空
    resetTemp() {
      this.tempParam = {}
    },
    // 打开添加
    handleCreate() {
      this.resetTemp()
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
      this.$nextTick(() => {
        this.$refs['paramRef'].clearValidate()
      })
    },
    createData() {
      this.$refs['paramRef'].validate((valid) => {
        if (valid) {
          add(this.tempParam).then(() => {
            this.list.unshift(this.tempParam)
            this.dialogFormVisible = false
            this.handleFilter()
            this.$notify({
              title: this.$t('common.success'),
              message: this.$t('config.addParamSucceed'),
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 打开更新
    handleUpdate(row) {
      this.tempParam = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['paramRef'].clearValidate()
      })
    },
    updateData() {
      this.$refs['paramRef'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.tempParam)
          edit(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.tempParam.id)
            this.list.splice(index, 1, this.tempParam)
            this.dialogFormVisible = false
            this.$notify({
              title: this.$t('common.success'),
              message: this.$t('common.updateSucceed'),
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 数据删除
    handleDelete(item) {
      // 此操作将删除参数键为"{}"的数据项, 是否继续?
      this.$confirm(String(this.$t('config.delParamClickMsg', { parameterKey: item.paramKey })), String(this.$t('common.title')), {
        confirmButtonText: this.$t('common.ok'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        del(item.id).then(() => {
          this.$notify({
            title: this.$t('common.success'),
            message: this.$t('common.operationSucceed'),
            type: 'success',
            duration: 2000
          })
          this.resetQuery()
        })
      }).catch((err) => { console.log(err) })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = [this.$t('config.paramName'), this.$t('config.paramKey'), this.$t('config.paramValue'),
          this.$t('config.appRange'), this.$t('config.remark'), this.$t('config.creator'), this.$t('config.createTime')]
        const filterVal = ['paramName', 'paramKey', 'paramValue', 'appRange', 'remark', 'creator', 'createTime']
        let list = this.list
        if (Object.keys(this.selectionData).length !== 0) { // 有元素被选中
          list = this.selectionData
        }
        const data = this.filterJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader, // Header Required
          data, // Specific data Required
          filename: this.filename, // Optional
          autoWidth: this.autoWidth, // Optional
          bookType: this.bookType // Optional
        })
        this.downloadLoading = false
      })
    },
    filterJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.selectionData = selection
    }
  }
}
</script>
