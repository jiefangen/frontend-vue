<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :model="listQuery" ref="queryRef" :inline="true">
        <el-form-item :label="String($t('config.dictName'))" prop="dictKey">
          <el-select v-model="listQuery.dictKey">
            <el-option
              v-for="item in dictOptions"
              :key="item.dictId"
              :label="item.dictName"
              :value="item.dictKey"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="String($t('config.dictLabel'))" prop="dictLabel">
          <el-input v-model="listQuery.dictLabel" :placeholder="$t('common.pleaseEnter', { text: $t('config.dictLabel') })" clearable style="width: 200px" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item :label="String($t('config.dictStatus'))" prop="status">
          <el-select v-model="listQuery.status" class="filter-item">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" clearable />
          </el-select>
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
      <el-button class="filter-item" style="margin-left: 10px;" type="warning" icon="el-icon-close" @click="handleClose">
        {{ $t('common.close') }}
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
      <el-table-column prop="dictLabel" :label="String($t('config.dictLabel'))" align="center" show-overflow-tooltip />
      <el-table-column prop="dictValue" :label="String($t('config.dictValue'))" align="center" show-overflow-tooltip />
      <el-table-column prop="status" :label="String($t('config.dictStatus'))" align="center" width="100">
        <template v-slot="scope">
          <el-tag :type="scope.row.status | statusRenderFilter">
            {{ scope.row.status == 1 ? $t('common.normal'):$t('common.disable') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sort" :label="String($t('config.dictSort'))" align="center" width="80" />
      <el-table-column prop="isDefault" :label="String($t('config.isDefault'))" align="center" width="80" />
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
      <el-form ref="dictDataRef" :model="temp" :rules="rules" label-position="left" label-width="100px" style="width: 400px; margin-left: 50px">
        <el-form-item :label="String($t('config.dictKey'))" prop="dictKey">
          <el-input v-model="temp.dictKey" disabled />
        </el-form-item>
        <el-form-item :label="String($t('config.dictLabel'))" prop="dictLabel">
          <el-input v-model="temp.dictLabel" :placeholder="$t('common.pleaseEnter', { text: $t('config.dictLabel') })" />
        </el-form-item>
        <el-form-item :label="String($t('config.dictValue'))" prop="dictValue">
          <el-input v-model="temp.dictValue" :placeholder="$t('common.pleaseEnter', { text: $t('config.dictValue') })" />
        </el-form-item>
        <el-form-item :label="String($t('config.echoClass'))" prop="echoClass">
          <el-input v-model="temp.echoClass" :placeholder="$t('common.pleaseEnter', { text: $t('config.echoClass') })" />
        </el-form-item>
        <el-form-item :label="String($t('config.dictStatus'))" prop="status">
          <el-select v-model="temp.status" class="filter-item">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item :label="String($t('config.styleAttribute'))" prop="styleAttribute">
          <el-input v-model="temp.styleAttribute" :placeholder="$t('common.pleaseEnter', { text: $t('config.styleAttribute') })" />
        </el-form-item>
        <el-form-item label="排序" prop="sort" :hidden="dialogStatus==='create'">
          <el-input-number v-model="temp.sort" controls-position="right" :min="0" />
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
import { getAllDictOption } from '@/api/settings/dictionary'
import { getList, add, del, edit } from '@/api/settings/dictData'

export default {
  name: 'DictData',
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
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        dictId: undefined,
        dictKey: this.$route.params && this.$route.params.dictKey,
        dictLabel: undefined,
        status: undefined
      },
      paged: {},
      row: {
        id: undefined,
        dictKey: undefined,
        dictLabel: '',
        dictValue: '',
        status: '',
        isDefault: '',
        remark: '',
        sort: undefined,
        echoClass: '',
        styleAttribute: '',
        creator: '',
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
      tempDictKey: undefined,
      selectionData: {},
      textMap: {
        update: this.$t('common.edit'),
        create: this.$t('config.addDict')
      },
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        dictKey: [{ required: true, trigger: 'blur' }],
        dictLabel: [{ required: true, trigger: 'blur' }],
        dictValue: [{ required: true, trigger: 'blur' }]
      },
      dictOptions: [],
      filename: 'excel-list',
      autoWidth: true,
      bookType: 'xlsx'
    }
  },
  created() {
    getAllDictOption().then(response => {
      this.dictOptions = response.data
    })
    this.getList()
  },
  methods: {
    tableRowClassName({ row }) {
      if (row.statusCode === 5000) {
        return 'danger-row'
      } else if (row.statusCode === 2000) {
        return 'success-row'
      }
      return 'warning-row'
    },
    getList() {
      this.listLoading = true
      this.tempDictKey = this.listQuery.dictKey
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
      this.listQuery.dictLabel = ''
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
      this.temp.dictKey = this.listQuery.dictKey
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
      this.$nextTick(() => {
        this.$refs['dictDataRef'].clearValidate()
      })
    },
    createData() {
      this.$refs['dictDataRef'].validate((valid) => {
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
      this.temp.dictKey = this.tempDictKey
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dictDataRef'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dictDataRef'].validate((valid) => {
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
      // 此操作将删除字典数据标签为"{dictLabel}"的数据项, 是否继续?
      this.$confirm(String(this.$t('config.delDictDataClickMsg', { dictLabel: item.dictLabel })), String(this.$t('common.title')), {
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
        const tHeader = [this.$t('config.dictLabel'), this.$t('config.dictValue'), this.$t('config.isDefault'),
          this.$t('config.remark'), this.$t('config.creator'), this.$t('config.createTime')]
        const filterVal = ['dictLabel', 'dictValue', 'isDefault', 'remark', 'creator', 'createTime']
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
    },
    handleClose() {
      if (this.$route.query.noGoBack) {
        this.$router.push({ path: '/settings/dictionary' })
      } else {
        this.$router.go(-1)
      }
    }
  }
}
</script>
