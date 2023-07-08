<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" :placeholder="$t('system.searchUserPlaceholder')" style="width: 216px; margin-right: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
          <span>{{ row.sex }}</span>
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
          <el-button type="success" size="mini" @click="handleModifyPass(row)">
            {{ $t('system.modifyPass') }}
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
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="String($t('system.username'))" prop="username">
          <el-input v-model="temp.username" :disabled="dialogStatus==='update'?true:false" />
        </el-form-item>
        <el-form-item :label="String($t('system.password'))" :prop="dialogStatus==='update'?'':'password'" :hidden="dialogStatus==='update'?true:false">
          <el-input v-model="temp.password" />
        </el-form-item>
        <el-form-item :label="String($t('system.sex'))">
          <el-select v-model="temp.sex" class="filter-item">
            <el-option v-for="item in sexOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item :label="String($t('system.status'))" :hidden="dialogStatus==='create'?true:false">
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

    <el-dialog :visible.sync="dialogPassVisible" :title="String($t('system.modifyPass'))">
      <el-form ref="dataPassForm" :rules="passRules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="String($t('system.username'))" prop="username" required>
          <el-input v-model="temp.username" disabled />
        </el-form-item>
        <el-form-item :label="String($t('system.oldPwd'))" prop="oldPassword">
          <el-input v-model="temp.oldPassword" />
        </el-form-item>
        <el-form-item :label="String($t('system.newPwd'))" prop="newPassword">
          <el-input v-model="temp.newPassword" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPassVisible = false">
          {{ $t('common.cancel') }}
        </el-button>
        <el-button type="primary" @click="updatePass()">
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
          <div class="components-container" style="margin: 0px;">
            <el-drag-select v-model="temp.roleCodes" style="width:360px;" multiple :placeholder="$t('common.pChoose')">
              <el-option v-for="item in allRoles" :key="item.id" :label="item.roleName" :value="item.roleCode" />
            </el-drag-select>
            <div style="margin-top:20px; width:400px;">
              <el-tag v-for="item of temp.roleCodes" :key="item" style="margin-right:15px;">
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
import { add, del, edit, getList, updatePass, updateUserRole } from '@/api/system/user'
import { getRoles } from '@/api/system/role'
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
        roleCodes: []
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: this.$t('common.edit'),
        create: this.$t('system.addUser')
      },
      dialogPassVisible: false,
      passData: [],
      statusOptions: [
        {
          value: true,
          label: this.$t('common.enabled')
        }, {
          value: false,
          label: this.$t('common.disabled')
        }
      ],
      sexOptions: ['男', '女'],
      rules: {
        username: [{ required: true, message: 'username is required', trigger: 'change' }],
        password: [{ required: true, message: 'password is required', trigger: 'change' }]
      },
      passRules: {
        oldPassword: [{ required: true, message: 'oldPassword is required', trigger: 'change' }],
        newPassword: [{ required: true, message: 'newPassword is required', trigger: 'change' }]
      },
      allRoles: [],
      dialogRoleVisible: false,
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    this.getRoles()
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
        roleCodes: []
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
    handleModifyPass(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogPassVisible = true
      this.$nextTick(() => {
        this.$refs['dataPassForm'].clearValidate()
      })
    },
    updatePass() {
      this.$refs['dataPassForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          const data = {
            userId: tempData.id,
            username: tempData.username,
            oldPassword: tempData.oldPassword,
            newPassword: tempData.newPassword
          }
          updatePass(data).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogPassVisible = false
            this.temp.oldPassword = ''
            this.temp.newPassword = ''
            this.$notify({
              title: this.$t('common.success'),
              message: this.$t('system.modifyPassSucceed'),
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
        roleCodes: tempData.roleCodes
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
