<template>
  <div class="app-container">
    <!-- 按钮尺寸：mini/small/medium -->
    <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleCreate">{{ $t('common.add') }}</el-button>
    <el-table
      :data="tableData"
      row-key="id"
      :tree-props="defaultProps"
      border
      class="menu-tree"
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      style="width: 100%; margin-top: 20px"
    >
      <!-- meta元素 -->
      <el-table-column :label="String($t('system.menuTitle'))" align="center" width="208">
        <template v-slot="{row}">
          <svg-icon :icon-class="row.icon" />
          <span style="margin-left: 16px">{{ row.title }}</span>
        </template>
      </el-table-column>

      <!-- 菜单节点元素 -->
      <el-table-column prop="menuName" :label="String($t('system.menuName'))" align="center" />
      <el-table-column prop="menuPath" :label="String($t('system.menuPath'))" align="center" :show-overflow-tooltip="true" />
      <el-table-column prop="redirect" :label="String($t('system.menuRedirect'))" align="center" />
      <el-table-column prop="component" :label="String($t('system.component'))" align="center" />
      <el-table-column :label="String($t('system.hidden'))" align="center" width="120">
        <template v-slot="{row}">
          <el-tag :type="row.hidden | statusFilter">
            {{ row.hidden? 'YES':'NO' }}
          </el-tag>
        </template>
      </el-table-column>

      <!-- 菜单列表排序 -->
      <el-table-column prop="sort" :label="String($t('common.sort'))" align="center" width="100" />

      <!-- 树节点操作 -->
      <el-table-column :label="String($t('common.operate'))" :align="alignDir" width="220">
        <template v-slot="scope">
          <el-button type="primary" size="small" @click="handleUpdate(scope.row)">
            <i class="el-icon-edit" /> {{ $t('common.edit') }}
          </el-button>
          <el-button type="danger" size="small" @click="deleteClick(scope.row)">
            <i class="el-icon-delete" /> {{ $t('common.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left: 50px">
        <el-form-item v-if="dialogStatus !== 'update'" :label="String($t('system.menuLevel'))" prop="location">
          <el-select v-model="temp.location" :placeholder="String($t('system.chooseLevel'))" size="small" @change="locationChange">
            <el-option v-for="item in locationData" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="sonStatus && dialogStatus !== 'update'" :label="String($t('system.childPosition'))" prop="children">
          <el-cascader
            :key="isResouceShow"
            v-model="temp.children"
            :placeholder="String($t('system.chooseChildPosition'))"
            :options="tableData"
            :props="{ checkStrictly: true, label: 'title', value: 'id', children: 'children' }"
            size="small"
            clearable
            @change="getCasVal"
          />
        </el-form-item>
        <el-form-item :label="String($t('system.menuTitle'))" prop="title">
          <el-input v-model="temp.title" :disabled="dialogStatus==='update'?true:false" size="small" autocomplete="off" :placeholder="$t('system.enterMenuTitle')" />
        </el-form-item>
        <el-form-item :label="String($t('system.menuIcon'))" prop="icon">
          <el-input v-model="temp.icon" size="small" autocomplete="off" :placeholder="$t('system.enterMenuIcon')" />
        </el-form-item>
        <el-form-item :label="String($t('system.menuPath'))" prop="menuPath">
          <el-input v-model="temp.menuPath" size="small" autocomplete="off" :placeholder="$t('system.enterMenuPath')" />
        </el-form-item>
        <el-form-item v-if="sonStatus" :label="String($t('system.component'))" prop="component">
          <el-input v-model="temp.component" size="small" autocomplete="off" :placeholder="$t('system.enterComponent')" />
        </el-form-item>
        <el-form-item :label="String($t('system.menuRedirect'))" prop="redirect">
          <el-input v-model="temp.redirect" size="small" autocomplete="off" :placeholder="$t('system.enterMenuRedirect')" />
        </el-form-item>

        <!-- 编辑面板专用 -->
        <el-form-item v-if="dialogStatus === 'update'" :label="String($t('system.menuHidden'))">
          <el-select v-model="temp.hidden" size="small" class="filter-item">
            <el-option v-for="(item, index) in statusOptions" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="dialogStatus === 'update'" :label="String($t('system.menuSort'))" prop="sort">
          <el-input v-model="temp.sort" size="small" autocomplete="off" placeholder="请输入菜单排序" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer" size="small">
        <el-button @click="dialogFormVisible = false">
          {{ $t('common.cancel') }}
        </el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">
          {{ $t('common.ok') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getMenus, getChildKeys, addMenu, deleteMenu, updateMenu } from '@/api/system/menu'
import i18n from '@/lang'

export default {
  filters: {
    statusFilter(status) {
      if (status === null) {
        return 'success'
      } else {
        const statusMap = {
          false: 'success',
          true: 'info'
        }
        return statusMap[status]
      }
    }
  },
  data() {
    return {
      tableData: [],
      checkStrictly: false,
      defaultProps: {
        children: 'children'
      },
      alignDir: 'center',
      textMap: {
        update: this.$t('common.edit'),
        create: this.$t('system.addMenu')
      },
      statusOptions: [
        {
          value: false,
          label: 'NO'
        }, {
          value: true,
          label: 'YES'
        }
      ],
      dialogStatus: '',
      dialogFormVisible: false,
      temp: {},
      isResouceShow: 1,
      sonStatus: false,
      casArr: [],
      idx: '',
      rules: {
        location: [{ required: true, message: this.$t('system.chooseLevel'), trigger: 'blur' }],
        children: [{ required: true, message: this.$t('system.chooseChildPosition'), trigger: 'blur' }],
        menuPath: [{ required: true, message: this.$t('system.enterMenuPath'), trigger: 'blur' }],
        component: [{ required: true, message: this.$t('system.enterComponent'), trigger: 'blur' }],
        title: [{ required: true, message: this.$t('system.enterMenuTitle'), trigger: 'blur' }],
        icon: [{ required: true, message: this.$t('system.enterMenuIcon'), trigger: 'blur' }]
      },
      locationData: [
        { id: '1', name: this.$t('system.topLevel') },
        { id: '2', name: this.$t('system.childLevel') }
      ]
    }
  },
  computed: {
  },
  created() {
    this.getMenus()
  },
  methods: {
    // 获取菜单tree数据源
    async getMenus() {
      const res = await getMenus()
      this.tableData = this.i18n(res.data)
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
    // 是否显示子级位置(初始化添加面板)
    locationChange(v) {
      if (v === '2') {
        this.sonStatus = true
      } else {
        this.sonStatus = false
      }
    },
    // 获取子级位置(子级位置选择变更事件)
    getCasVal(v) {
      this.casArr = v
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
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 递归表格数据(添加)
    find(arr, i) {
      let currVal
      for (let j = 0; j < arr.length; j++) {
        if (arr[j].id === this.casArr[i]) {
          currVal = j
          break
        }
      }
      if (i === (this.casArr.length - 1)) {
        return arr[currVal].children
      } else {
        return this.find(arr[currVal].children, (i += 1))
      }
    },
    // 添加
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          delete this.temp.children
          const obj = Object.assign({}, this.temp)
          obj.children = []
          if (this.sonStatus === false) { // 顶级菜单
            // 新增节点自动排在末尾
            obj.parentId = 0
            this.tableData.push(obj)
          } else { // 子级菜单
            obj.parentId = this.casArr[this.casArr.length - 1]
            // 获取当前子级节点位置下的集合
            const currentArr = this.find(this.tableData, 0)
            currentArr.push(obj)
          }
          // 新增菜单
          addMenu(obj).then(response => {
            if (response.code === 2000) {
              this.dialogFormVisible = false
              this.$confirm(String(this.$t('system.addMenuSucceed')), String(this.$t('common.title')), {
                confirmButtonText: this.$t('common.ok'),
                cancelButtonText: this.$t('common.cancel'),
                type: 'warning'
              }).then(() => {
                location.reload()
              })
            }
          })
        } else {
          return false
        }
      })
    },
    // 删除根节点
    deleteRootNode(item) {
      this.tableData.forEach((it, ix, arrs) => {
        if (it === item) {
          return arrs.splice(ix, 1)
        }
      })
    },
    // 递归表格删除子级数据(删除，最少两个层级)
    findDel(arr, i, item, childKeys) {
      let index
      for (let j = 0; j < arr.length; j++) {
        if (arr[j].id === childKeys[i]) {
          index = j
          break
        }
      }
      if (i === (childKeys.length - 2)) {
        arr[index].children.forEach((it, ix, arrs) => {
          if (it === item) {
            return arrs.splice(ix, 1)
          }
        })
      } else {
        return this.findDel(arr[index].children, (i += 1), item, childKeys)
      }
    },
    // 删除节点
    deleteClick(item) {
      this.$confirm(String(this.$t('system.deleteClickMsg')), String(this.$t('common.title')), {
        confirmButtonText: this.$t('common.ok'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        if (item.children.length !== 0) {
          this.$message.warning({
            message: this.$t('system.delChildNode'),
            duration: 1000
          })
        } else {
          ++this.isResouceShow
          this.toDelete(item)
        }
      }).catch((err) => { console.log(err) })
    },
    async toDelete(item) {
      const res = await deleteMenu(item.id)
      if (res && res.code === 2000) {
        if (item.parentId === 0) { // 根结点
          this.deleteRootNode(item)
        } else { // 子节点
          // 获取childKeys
          const resChildKeys = await getChildKeys(item.parentId)
          const childKeys = resChildKeys.data
          childKeys.push(item.id)
          this.findDel(this.tableData, 0, item, childKeys)
        }
        this.$message({
          type: 'success',
          message: this.$t('system.deleteSucceed')
        })
      }
    },
    findIndex(arr, id) {
      for (let index = 0; index < arr.length; index++) {
        if (arr[index].id === id) {
          return index
        }
      }
    },
    // 打开更新
    handleUpdate(row) {
      row.parentId !== 0 ? (this.sonStatus = true) : (this.sonStatus = false)
      this.temp = Object.assign({}, row) // copy obj
      this.idx = this.findIndex(this.tableData, row.id)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 递归表格修改子级节点数据(编辑)
    findSd(arr, i, childKeys) {
      let index
      for (let j = 0; j < arr.length; j++) {
        if (arr[j].id === childKeys[i]) {
          index = j
          break
        }
      }
      if (i === (childKeys.length - 1)) {
        return arr.splice(index, 1, this.temp)
      } else {
        return this.findSd(arr[index].children, (i += 1), childKeys)
      }
    },
    // 更新
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.toUpdate(this.temp)
        } else {
          return false
        }
      })
    },
    async toUpdate(temp) {
      const res = await updateMenu(temp)
      if (res && res.code === 2000) {
        if (temp.parentId === 0) { // 根节点
          this.tableData.splice(this.idx, 1, temp)
        } else {
          // 获取childKeys
          const resChildKeys = await getChildKeys(temp.parentId)
          const childKeys = resChildKeys.data
          childKeys.push(temp.id)
          this.findSd(this.tableData, 0, childKeys)
        }
        this.dialogFormVisible = false
        this.$confirm(String(this.$t('system.updateMenuSucceed')), String(this.$t('common.title')), {
          confirmButtonText: this.$t('common.ok'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning'
        }).then(() => {
          location.reload()
        })
      }
    }
  }
}
</script>
