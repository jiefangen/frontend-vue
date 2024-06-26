<template>
  <div class="app-container">
    <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleAddRole">{{ $t('common.add') }}</el-button>
    <el-button class="filter-item" style="margin-left: 14px;" type="primary" size="medium" icon="el-icon-refresh" @click="handleRefresh">
      {{ $t('common.refresh') }}
    </el-button>

    <el-table :data="rolesList" :header-cell-style="{background:'#eef1f6',color:'#606266'}" style="width:100%; margin-top:20px;" border stripe>
      <el-table-column align="center" :label="String($t('system.roleName'))" width="220">
        <template v-slot="scope">
          {{ scope.row.roleName }}
        </template>
      </el-table-column>
      <el-table-column align="center" :label="String($t('system.roleCode'))" width="220">
        <template v-slot="scope">
          {{ scope.row.roleCode }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" :label="String($t('system.roleDesc'))">
        <template v-slot="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column align="center" :label="String($t('common.operate'))">
        <template v-slot="scope">
          <el-button type="warning" size="small" @click="handleEdit(scope)">{{ $t('system.editMenu') }}</el-button>
          <el-button type="success" size="small" @click="handleViewPermission(scope.row)">{{ $t('system.viewPermission') }}</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">{{ $t('common.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?String($t('system.editMenu')):$t('system.addRole')">
      <el-form ref="dataRoleForm" :rules="rules" :model="role" label-width="80px" label-position="left" style="width: 400px; margin-left:50px;">
        <el-form-item :label="String($t('system.roleName'))" prop="roleName">
          <el-input v-model="role.roleName" :disabled="dialogType==='edit'" placeholder="Role Name" />
        </el-form-item>
        <el-form-item :label="String($t('system.roleCode'))" prop="roleCode">
          <el-input v-model="role.roleCode" :disabled="dialogType==='edit'" placeholder="Role Code" />
        </el-form-item>
        <el-form-item :label="String($t('system.roleDesc'))">
          <el-input
            v-model="role.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="Role Description"
            style="width:360px;"
          />
        </el-form-item>
        <el-form-item v-show="dialogType==='edit'" :label="String($t('system.menu'))">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="routesData"
            :props="defaultProps"
            :default-checked-keys="defaultCheckedKeys"
            show-checkbox
            node-key="id"
            default-expand-all
            class="permission-tree"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="confirmRole">{{ $t('common.ok') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="viewPermissionDialog" :title="String($t('system.viewPermission'))">
      <el-tag v-for="item in rolePermissions" :key="item.id" type="success" style="margin-left: 10px; margin-bottom: 10px">
        {{ item.permissionCode }}
      </el-tag>
      <div slot="footer" class="dialog-footer">
        <el-button @click="viewPermissionDialog=false">{{ $t('common.close') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import { getRoutes, getRoles, addRole, deleteRole, updateRole } from '@/api/system/role'
import { getPermission } from '@/api/system/permission'
import { getDictData, rolePerRefresh } from '@/api/common'
import i18n from '@/lang'

const defaultRole = {
  id: '',
  roleCode: '',
  roleName: '',
  description: '',
  routes: []
}

export default {
  data() {
    return {
      role: Object.assign({}, defaultRole),
      routes: [],
      rolesList: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      viewPermissionDialog: false,
      rolePermissions: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      defaultCheckedKeys: [],
      roleCodeOptions: ['GENERAL', 'CUSTOMER'],
      rules: {
        roleName: [{ required: true, message: 'roleName is required', trigger: 'change' }],
        roleCode: [{ required: true, message: 'roleCode is required', trigger: 'change' }]
      }
    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    // get all routes and roles service from server
    this.getRoutes()
    this.getRoles()
    // this.getRoleCodeByDict()
  },
  methods: {
    async getRoutes() {
      const res = await getRoutes()
      this.serviceRoutes = res.data
      const routes = this.generateRoutes(res.data)
      this.routes = this.i18n(routes)
    },
    async getRoles() {
      const res = await getRoles()
      this.rolesList = res.data
    },
    async getRoleCodeByDict() {
      const res = await getDictData('sys_role_code', 'admin', true)
      this.roleCodeOptions = res.data
    },
    i18n(routes) {
      const app = routes.map(route => {
        route.title = i18n.t(`route.${route.title}`)
        if (route.children) {
          route.children = this.i18n(route.children)
        }
        return route
      })
      return app
    },
    // Reshape the routes structure so that it looks the same as the sidebar
    generateRoutes(routes, basePath = '/') {
      const res = []
      for (let route of routes) {
        // skip some route
        if (route.hidden) { continue }

        const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)
        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }

        const data = {
          id: route.id,
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title
        }
        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path)
        }
        res.push(data)
      }
      return res
    },
    generateArr(routes) {
      let data = []
      routes.forEach(route => {
        data.push(route)
        if (route.children) {
          const temp = this.generateArr(route.children)
          if (temp.length > 0) {
            data = [...data, ...temp]
          }
        }
      })
      return data
    },
    generateCheckedKeys(routes) {
      let checkedKeys = []
      routes.forEach(route => {
        checkedKeys.push(route.id)
        if (route.children) {
          const temp = this.generateCheckedKeys(route.children)
          if (temp.length > 0) {
            checkedKeys = [...checkedKeys, ...temp]
          }
        }
      })
      return checkedKeys
    },
    handleAddRole() {
      this.role = Object.assign({}, defaultRole)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataRoleForm'].clearValidate()
      })
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.role = deepClone(scope.row)
      this.$nextTick(() => {
        const routes = this.generateRoutes(this.role.routes)
        // this.$refs.tree.setCheckedNodes(this.generateArr(routes))
        const checkedKeys = this.generateCheckedKeys(routes)
        this.$refs.tree.setCheckedKeys(checkedKeys)
        // set checked state of a node not affects its father and child nodes
        this.checkStrictly = false
        this.$refs['dataRoleForm'].clearValidate()
      })
    },
    handleViewPermission(row) {
      this.viewPermissionDialog = true
      this.$nextTick(async() => {
        const response = await getPermission(row.id)
        this.rolePermissions = response.data
      })
    },
    handleDelete({ $index, row }) {
      this.$confirm(String(this.$t('system.roleDelStartMsg')) + row.roleName + String(this.$t('system.roleDelEndMsg')), String(this.$t('common.title')), {
        confirmButtonText: this.$t('common.ok'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(async() => {
        await deleteRole(row.id)
        this.rolesList.splice($index, 1)
        this.$message({
          type: 'success',
          message: this.$t('system.deleteSucceed')
        })
      }).catch(err => { console.error(err) })
    },
    generateTree(routes, basePath = '/', checkedKeys) {
      const res = []
      for (const route of routes) {
        // const routePath = path.resolve(basePath, route.path)
        const routeId = route.id
        // recursive child routes
        if (route.children) {
          route.children = this.generateTree(route.children, routeId, checkedKeys)
        }
        if (checkedKeys.includes(routeId) || (route.children && route.children.length >= 1)) {
          res.push(route)
        }
      }
      return res
    },
    async confirmRole() {
      const isEdit = this.dialogType === 'edit'
      const checkedKeys = this.$refs.tree.getCheckedKeys()
      this.role.routes = this.generateTree(deepClone(this.serviceRoutes), '/', checkedKeys)
      if (isEdit) {
        await updateRole(this.role.id, this.role)
        for (let index = 0; index < this.rolesList.length; index++) {
          if (this.rolesList[index].id === this.role.id) {
            this.rolesList.splice(index, 1, Object.assign({}, this.role))
            break
          }
        }
        this.dialogVisible = false
        this.$confirm(String(this.$t('system.confirmRoleMsg')), String(this.$t('common.title')), {
          confirmButtonText: this.$t('common.ok'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning'
        }).then(() => {
          location.reload()
        })
      } else {
        this.$refs['dataRoleForm'].validate((valid) => {
          if (valid) {
            addRole(this.role).then(() => {
              this.getRoles()
              this.dialogVisible = false
              this.$notify({
                title: this.$t('common.success'),
                message: String(this.$t('system.addRoleSucceed')),
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      }
    },
    // reference: src/view/layout/components/Sidebar/SidebarItem.vue
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)

      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }
      return false
    },
    handleRefresh() {
      this.$confirm(String(this.$t('system.handleRefreshMsg')), String(this.$t('common.title')), {
        confirmButtonText: String(this.$t('common.ok')),
        cancelButtonText: String(this.$t('common.cancel')),
        type: 'warning'
      }).then(() => {
        rolePerRefresh().then(() => {
          this.$notify({
            title: this.$t('common.success'),
            message: this.$t('system.refreshSucceed'),
            type: 'success',
            duration: 2000
          })
          this.$confirm(String(this.$t('system.confirmRefreshMsg')), String(this.$t('common.title')), {
            confirmButtonText: this.$t('common.ok'),
            cancelButtonText: this.$t('common.cancel'),
            type: 'warning'
          }).then(() => {
            location.reload()
          })
        }).catch(err => { console.error(err) })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
