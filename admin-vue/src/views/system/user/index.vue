<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" clearable :placeholder="$t('system.searchUserPlaceholder')" style="width: 216px; margin-right: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('common.search') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-circle-plus-outline" @click="handleCreate">
        {{ $t('common.add') }}
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
      <el-table-column :label="String($t('system.username'))" align="center">
        <template v-slot="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="String($t('system.userType'))" align="center">
        <template v-slot="{row}">
          <span>{{ row.userType }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="String($t('system.userRank'))" width="60" align="center">
        <template v-slot="{row}">
          <span>{{ row.userRank }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="String($t('system.nickname'))" class-name="status-col" align="center">
        <template v-slot="{row}">
          <span>{{ row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="String($t('system.sex'))" class-name="status-col" width="80" align="center">
        <template v-slot="{row}">
          <span>{{ row.sex | sexFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="String($t('system.phone'))" class-name="status-col" width="120" align="center">
        <template v-slot="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="String($t('system.email'))" class-name="status-col" width="160" align="center">
        <template v-slot="{row}">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="String($t('system.status'))" class-name="status-col" width="100" align="center">
        <template v-slot="{row}">
          <el-tag :type="row.enabled | statusFilter">
            {{ row.enabled ? $t('common.enabled'):$t('common.disabled') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="String($t('system.createTime'))" width="180" align="center">
        <template v-slot="{row}">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="String($t('common.operate'))" align="center" width="361" class-name="small-padding fixed-width">
        <template v-slot="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            {{ $t('common.edit') }}
          </el-button>
          <el-button type="warning" size="mini" @click="handleUseRole(row)">
            {{ $t('system.editRole') }}
          </el-button>
          <el-button type="success" size="mini" @click="handleResetPass(row)">
            {{ $t('system.resetPass') }}
          </el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row,$index)">
            {{ $t('common.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination v-show="total" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="String($t('system.username'))" prop="username">
          <el-input v-model="temp.username" :disabled="dialogStatus==='update'" />
        </el-form-item>
        <el-form-item :label="String($t('system.userType'))" prop="userType">
          <el-select v-model="temp.userType" class="filter-item">
            <el-option v-for="item in userTypeOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
<!--        <el-form-item :label="String($t('system.userType'))" prop="userType">-->
<!--          <el-input v-model="temp.userType" />-->
<!--        </el-form-item>-->
        <el-form-item :label="String($t('system.password'))" :prop="dialogStatus==='update'?'':'password'" :hidden="dialogStatus==='update'">
          <el-input v-model="temp.password" type="password" />
        </el-form-item>
        <el-form-item :label="String($t('system.sex'))">
          <el-select v-model="temp.sex" class="filter-item">
            <el-option v-for="(item, index) in sexOptions" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item :label="String($t('system.status'))" :hidden="dialogStatus==='create'">
          <el-select v-model="temp.enabled" class="filter-item">
            <el-option v-for="(item, index) in statusOptions" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item :label="String($t('system.nickname'))">
          <el-input v-model="temp.nickname" />
        </el-form-item>
        <el-form-item :label="String($t('system.phone'))">
          <el-input v-model="temp.phone" />
        </el-form-item>
        <el-form-item :label="String($t('system.email'))">
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

    <el-dialog :visible.sync="dialogPassVisible" :title="String($t('system.resetPass'))">
      <el-form ref="dataPassForm" :rules="passRules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="String($t('system.username'))" prop="username">
          <el-input v-model="temp.username" disabled />
        </el-form-item>
        <el-form-item :label="String($t('system.newPwd'))" prop="newPassword">
          <el-input v-model="temp.newPassword" type="password" :placeholder="$t('system.resetPassMsg')" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPassVisible = false">
          {{ $t('common.cancel') }}
        </el-button>
        <el-button type="primary" @click="resetPassword()">
          {{ $t('common.ok') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogRoleVisible" :title="String($t('system.editRole'))">
      <el-form ref="dataRoleForm" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="String($t('system.username'))" prop="username">
          <el-input v-model="temp.username" disabled />
        </el-form-item>
        <el-form-item :label="String($t('system.roleScope'))" prop="roleCodes">
          <div class="components-container" style="margin: 0;">
            <el-drag-select v-model="temp.roleCodeAndIds" style="width:360px;" multiple :placeholder="$t('common.pChoose')">
              <el-option v-for="item in allRoles" :key="item.id" :label="item.roleName" :value="item.roleCode + `|` + item.id" />
            </el-drag-select>
            <div style="margin-top:20px; width:400px;">
              <el-tag v-for="item of temp.roleCodeAndIds" :key="item" style="margin-right:15px;">
                {{ item }}
              </el-tag>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRoleVisible=false">
          {{ $t('common.cancel') }}
        </el-button>
        <el-button type="primary" @click="updateUserRole()">
          {{ $t('common.ok') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { add, del, edit, getList, resetPassword, updateUserRole } from '@/api/system/user'
import { getRoles } from '@/api/system/role'
import { getDictData } from '@/api/common'
import Pagination from '@/components/Pagination'
import ElDragSelect from '@/components/DragSelect' // base on element-ui
export default {
  name: 'Users',
  components: { Pagination, ElDragSelect },
  filters: {
    statusFilter(status) {
      const statusMap = {
        true: 'success',
        false: 'info'
      }
      return statusMap[status]
    },
    sexFilter(sex) {
      const sexMap = {
        '0': '女',
        '1': '男',
        '2': '未知'
      }
      return sexMap[sex]
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
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: '',
        roleCodes: [],
        roleCodeAndIds: []
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: this.$t('common.edit'),
        create: this.$t('system.addUser')
      },
      dialogPassVisible: false,
      passData: [],
      userTypeOptions: ['manager', 'general'],
      statusOptions: [
        {
          value: true,
          label: this.$t('common.enabled')
        }, {
          value: false,
          label: this.$t('common.disabled')
        }
      ],
      sexOptions: [
        {
          value: '1',
          label: this.$t('system.man')
        }, {
          value: '0',
          label: this.$t('system.woman')
        }, {
          value: '2',
          label: this.$t('common.unknown')
        }
      ],
      rules: {
        username: [{ required: true, trigger: 'blur' }],
        userType: [{ required: true, trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur' }, { min: 6, max: 20, message: String(this.$t('profile.passLimitMsg')), trigger: 'blur' }]
      },
      passRules: {
        newPassword: [{ min: 6, max: 20, message: String(this.$t('profile.passLimitMsg')), trigger: 'blur' }]
      },
      allRoles: [],
      dialogRoleVisible: false,
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    this.getRoles()
    this.getUserTypeByDict()
  },
  methods: {
    getList() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        const { data } = response
        const { paged } = data
        this.list = data.records
        this.total = paged.total
        this.pageNo = paged.pageNo
        this.pageSize = paged.pageSize
        this.listLoading = false
      })
    },
    async getRoles() {
      const res = await getRoles()
      this.allRoles = res.data
    },
    async getUserTypeByDict() {
      const res = await getDictData('sys_user_type', 'admin', true)
      this.userTypeOptions = res.data
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        username: '',
        userType: '',
        userRank: '',
        password: '',
        phone: '',
        email: '',
        sex: '',
        enabled: '',
        nickname: '',
        createTime: '',
        roles: [],
        roleCodes: [],
        roleCodeAndIds: []
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
          add(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.handleFilter()
            this.$notify({
              title: this.$t('common.success'),
              message: this.$t('system.addUserSucceed'),
              type: 'success',
              duration: 2000
            })
          })
        }
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
          edit(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: this.$t('common.success'),
              message: this.$t('system.updateSucceed'),
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleResetPass(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogPassVisible = true
      this.$nextTick(() => {
        this.$refs['dataPassForm'].clearValidate()
      })
    },
    resetPassword() {
      this.$refs['dataPassForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          const data = {
            id: tempData.id,
            username: tempData.username,
            newPassword: tempData.newPassword
          }
          resetPassword(data).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogPassVisible = false
            this.temp.newPassword = ''
            this.$notify({
              title: this.$t('common.success'),
              message: this.$t('system.resetPassSucceed'),
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUseRole(row) {
      this.temp = Object.assign({}, row)
      this.dialogRoleVisible = true
    },
    updateUserRole() {
      const tempData = Object.assign({}, this.temp)
      const data = {
        id: tempData.id,
        roleCodeAndIds: tempData.roleCodeAndIds
      }
      updateUserRole(data).then((data) => {
        if (data) {
          // 提前渲染结果
          const index = this.list.findIndex(v => v.id === this.temp.id)
          this.list.splice(index, 1, this.temp) // 数组替换
          // 是否立即生效
          this.dialogRoleVisible = false
          this.$confirm(String(this.$t('system.updateUserRoleMessage')), String(this.$t('common.title')), {
            confirmButtonText: this.$t('common.ok'),
            cancelButtonText: this.$t('common.cancel'),
            type: 'warning'
          }).then(() => {
            location.reload()
          })
        }
      })
    },
    handleDelete(row) {
      this.$confirm(String(this.$t('system.handleDeleteMessage')), String(this.$t('common.title')), {
        confirmButtonText: this.$t('common.ok'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        del(row.username).then(() => {
          this.dialogFormVisible = false
          this.handleFilter()
          this.$notify({
            title: this.$t('common.success'),
            message: this.$t('system.deleteSucceed'),
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
