<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :model="listQuery" :inline="true">
        <el-form-item :label="String($t('config.dictName'))" prop="dictName">
          <el-input v-model="listQuery.dictName" :placeholder="$t('common.pleaseEnter', { text: $t('config.dictName') })" clearable style="width: 200px" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item :label="String($t('config.dictKey'))" prop="dictKey">
          <el-input v-model="listQuery.dictKey" :placeholder="$t('common.pleaseEnter', { text: $t('config.dictKey') })" clearable style="width: 200px" @keyup.enter.native="handleFilter" />
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
      <el-table-column prop="dictName" :label="String($t('config.dictName'))" align="center" show-overflow-tooltip />
      <el-table-column prop="dictKey" :label="String($t('config.dictKey'))" align="center" show-overflow-tooltip>
        <template #default="scope">
          <router-link :to="'/settings/dictionary/data/index/' + scope.row.dictKey" class="link-type">
            <span> {{ scope.row.dictKey }} </span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="dictType" :label="String($t('config.dictType'))" align="center" show-overflow-tooltip />
      <el-table-column prop="status" :label="String($t('config.status'))" align="center" width="100">
        <template v-slot="scope">
          <el-tag :type="scope.row.status | statusRenderFilter">
            {{ scope.row.status == 1 ? $t('common.normal'):$t('common.disable') }}
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

    <!-- 添加或修改字典配置弹窗 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dictRef" :model="temp" :rules="rules" label-position="left" label-width="100px" style="width: 400px; margin-left: 50px">
        <el-form-item :label="String($t('config.dictName'))" prop="dictName">
          <el-input v-model="temp.dictName" :placeholder="$t('common.pleaseEnter', { text: $t('config.dictName') })" />
        </el-form-item>
        <el-form-item :label="String($t('config.dictKey'))" prop="dictKey">
          <el-input v-model="temp.dictKey" :placeholder="$t('common.pleaseEnter', { text: $t('config.dictKey') })" :disabled="dialogStatus==='update'" />
        </el-form-item>
        <el-form-item :label="String($t('config.dictType'))" prop="dictType">
          <el-input v-model="temp.dictType" :placeholder="$t('common.pleaseEnter', { text: $t('config.dictType') })" />
        </el-form-item>
        <el-form-item :label="String($t('config.status'))" prop="status">
          <el-select v-model="temp.status" class="filter-item">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item :label="String($t('config.appRange'))" prop="appRange">
          <el-input v-model="temp.appRange" :placeholder="$t('common.pleaseEnter', { text: $t('config.appRange') })" />
        </el-form-item>
        <el-form-item :label="String($t('config.remark'))" prop="remark">
          <el-input v-model="temp.remark" type="textarea" />
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
import { getList, add, del, edit } from '@/api/settings/dictionary'

export default {
  name: 'Dictionary',
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
        dictName: '',
        dictKey: '',
        status: null,
        startDate: '',
        endDate: ''
      },
      paged: {},
      row: {
        id: undefined,
        dictName: '',
        dictKey: '',
        dictType: '',
        status: '',
        appRange: '',
        remark: '',
        creator: '',
        updater: '',
        createTime: ''
      },
      statusOptions: [
        {
          value: 1,
          label: this.$t('common.normal')
        }, {
          value: 0,
          label: this.$t('common.disable')
        }
      ],
      temp: {},
      selectionData: {},
      textMap: {
        update: this.$t('common.edit'),
        create: this.$t('config.addDict')
      },
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        dictName: [{ required: true, trigger: 'blur' }],
        dictKey: [{ required: true, trigger: 'blur' }]
      },
      filename: 'excel-service',
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
      this.listQuery.dictName = ''
      this.listQuery.dictKey = ''
      this.listQuery.status = null
      this.handleFilter()
    },
    // 临时容器置空
    resetTemp() {
      this.temp = {}
    },
    // 打开添加
    handleCreate() {
      this.resetTemp()
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
      this.$nextTick(() => {
        this.$refs['dictRef'].clearValidate()
      })
    },
    createData() {
      this.$refs['dictRef'].validate((valid) => {
        if (valid) {
          add(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.handleFilter()
            this.$notify({
              title: this.$t('common.success'),
              message: this.$t('config.addDictSucceed'),
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 打开更新
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dictRef'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dictRef'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          edit(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
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
      // 此操作将删除字典键为"{}"的数据项, 是否继续?
      this.$confirm(String(this.$t('config.delDictClickMsg', { dictKey: item.dictKey })), String(this.$t('common.title')), {
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
        const tHeader = [this.$t('config.dictName'), this.$t('config.dictKey'), this.$t('config.dictType'),
          this.$t('config.appRange'), this.$t('config.remark'), this.$t('config.creator'), this.$t('config.createTime')]
        const filterVal = ['dictName', 'dictKey', 'dictType', 'appRange', 'remark', 'creator', 'createTime']
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
