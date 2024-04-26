<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" clearable :placeholder="$t('services.searchPlaceholder')" style="width: 216px; margin-right: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('common.search') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-circle-plus-outline" @click="handleCreate">
        {{ $t('services.addAccount') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-circle-plus-outline" @click="handleQuickCreate">
        {{ $t('services.quickAddAccount') }}
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
      <el-table-column :label="String($t('services.username'))" align="center">
        <template v-slot="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="String($t('services.merchantNum'))" class-name="status-col" width="280">
        <template v-slot="{row}">
          <span>{{ row.merchantNum }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="String($t('services.secretKey'))" align="center" :show-overflow-tooltip="true">
        <template v-slot="{row}">
          <span>{{ row.secretKey }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="String($t('services.credentials'))" align="center" :show-overflow-tooltip="true">
        <template v-slot="{row}">
          <span>{{ row.credentials }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="String($t('services.accountType'))" class-name="status-col" align="center">
        <template v-slot="{row}">
          <span>{{ row.accountType }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="String($t('services.email'))" class-name="status-col" align="center" :show-overflow-tooltip="true">
        <template v-slot="{row}">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="String($t('services.status'))" class-name="status-col" width="80">
        <template v-slot="{row}">
          <el-tag :type="row.enabled | statusFilter">
            {{ row.enabled ? $t('common.enabled'):$t('common.disabled') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="String($t('services.createTime'))" width="180" align="center">
        <template v-slot="{row}">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="String($t('common.operate'))" align="center" width="180" class-name="small-padding fixed-width">
        <template v-slot="{row}">
          <el-button type="warning" size="mini" @click="handleUpdate(row)">
            {{ $t('services.editAccount') }}
          </el-button>
          <el-button type="info" size="mini" @click="handleAccountInfo(row)">
            {{ $t('services.accountInfo') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination v-show="total" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="String($t('services.username'))" prop="username">
          <el-input v-model="temp.username" :disabled="dialogStatus==='update'" />
        </el-form-item>
        <el-form-item :label="String($t('services.password'))" :prop="dialogStatus==='update'?'':'password'" :hidden="dialogStatus==='update'">
          <el-input v-model="temp.password" type="password" />
        </el-form-item>
        <el-form-item :label="String($t('services.accountType'))" prop="userType" :hidden="dialogStatus==='update'">
          <el-select v-model="temp.accountType" class="filter-item">
            <el-option v-for="item in accountTypeOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item :label="String($t('services.status'))" :hidden="dialogStatus==='create'">
          <el-select v-model="temp.enabled" class="filter-item">
            <el-option v-for="(item, index) in statusOptions" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item :label="String($t('services.email'))">
          <el-input v-model="temp.email" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('common.cancel') }}
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'? createData():updateData()">
          {{ $t('common.ok') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="accountDialogVisible" width="30%">
      <el-form ref="dataAccountForm" :model="tempInfo" label-position="left" style="margin-left:25px;">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="label">{{ $t('services.accountInfo') }}</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="copyToClipboard">
              一键复制
            </el-button>
          </div>
          <div class="text item">
            <span class="label">{{ $t('services.merchantAccount') }}</span>
            <span class="value">{{ tempInfo.username }}</span>
          </div>
          <div class="text item">
            <span class="label">{{ $t('services.initialPassword') }}</span>
            <span class="value">{{ tempInfo.password }}</span>
          </div>
          <div class="text item">
            <span class="label">{{ $t('services.apiInvokerInfo') }}</span>
          </div>
          <div class="text item">
            <span class="label">{{ $t('services.merchantNum') }}</span>
            <span class="value" style="margin-left: 28px">{{ tempInfo.merchantNum }}</span>
          </div>
          <div class="text item">
            <span class="label">{{ $t('services.apiSecretKey') }}</span>
            <span class="value">{{ tempInfo.secretKey }}</span>
          </div>
          <div class="text item">
            <span class="label">{{ $t('services.apiCredentials') }}</span>
            <span class="value">{{ tempInfo.credentials }}</span>
          </div>
        </el-card>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getAccountList, addAccount, updateAccount, getAccountDetails } from '@/api/services/authService'
import Pagination from '@/components/Pagination'
export default {
  name: 'Services',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        true: 'success',
        false: 'info'
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
        username: '',
        password: '',
        secretKey: '',
        credentials: '',
        merchantNum: '',
        accountType: '',
        accountRank: '',
        enabled: false,
        email: ''
      },
      tempInfo: {},
      dialogFormVisible: false,
      accountDialogVisible: false,
      dialogStatus: '',
      textMap: {
        update: this.$t('common.edit'),
        create: this.$t('services.addMerchantAccount')
      },
      dialogPassVisible: false,
      passData: [],
      accountTypeOptions: ['account', 'customer'],
      statusOptions: [
        {
          value: true,
          label: this.$t('common.enabled')
        }, {
          value: false,
          label: this.$t('common.disabled')
        }
      ],
      rules: {
        username: [{ required: true, trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur' }, { min: 6, max: 20, message: String(this.$t('profile.passLimitMsg')), trigger: 'blur' }]
      },
      dialogRoleVisible: false,
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getAccountList(this.listQuery).then(response => {
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
    resetTemp() {
      this.temp = {
        id: undefined,
        username: '',
        password: '',
        secretKey: '',
        credentials: '',
        merchantNum: '',
        accountType: '',
        accountRank: '',
        enabled: false,
        email: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addAccount(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.handleFilter()
            this.$notify({
              title: this.$t('common.success'),
              message: this.$t('services.addAccountSucceed'),
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleQuickCreate() {
      this.$confirm(String(this.$t('services.handleQuickCreateMessage')), String(this.$t('common.info')), {
        confirmButtonText: this.$t('common.ok'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'info'
      }).then(() => {
        const data = {}
        addAccount(data).then(() => {
          this.dialogFormVisible = false
          this.handleFilter()
          this.$notify({
            title: this.$t('common.success'),
            message: this.$t('services.quickCreateSucceed'),
            type: 'success',
            duration: 2000
          })
        }).catch(err => { console.error(err) })
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateAccount(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: this.$t('common.success'),
              message: this.$t('services.updateSucceed'),
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleAccountInfo(row) {
      getAccountDetails(row).then(response => {
        this.tempInfo = Object.assign({}, response.data)
        this.accountDialogVisible = true
      })
    },
    copyToClipboard() {
      const el = document.createElement('textarea')
      el.value = `${this.$t('services.merchantAccount')}: ${this.tempInfo.username}\n${this.$t('services.initialPassword')}: ${this.tempInfo.password}\n\n${this.$t('services.merchantNum')}: ${this.tempInfo.merchantNum}\n${this.$t('services.apiSecretKey')}: ${this.tempInfo.secretKey}\n${this.$t('services.apiCredentials')}: ${this.tempInfo.credentials}`
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      this.accountDialogVisible = false
      this.$notify({
        title: this.$t('common.success'),
        message: this.$t('services.copyAccountSucceed'),
        type: 'success',
        duration: 2000
      })
    }
  }
}
</script>

<style>
  .text {
    font-size: 14px;
  }
  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 480px;
  }

  .label {
    font-weight: bold;
  }
  .value {
    margin-left: 20px;
  }
</style>
