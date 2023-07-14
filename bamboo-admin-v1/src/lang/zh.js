export default {
  route: {
    dashboard: '首页',
    systemManage: '系统管理',
    userManage: '用户管理',
    roleManage: '角色管理',
    menuManage: '菜单管理',
    permissionManage: '权限管理',
    systemMonitor: '系统监控',
    operationLog: '操作日志',
    apiDoc: 'API文档',
    druidMonitor: 'Druid监控',
    errorPages: '错误页面',
    page401: '401',
    page404: '404',
    i18n: '国际化',
    externalLink: '外链',
    profile: '个人中心'
  },
  navbar: {
    dashboard: '首页',
    github: '项目地址',
    logOut: '退出登录',
    profile: '个人中心',
    theme: '换肤',
    size: '布局大小'
  },
  tagsView: {
    refresh: '刷新',
    close: '关闭',
    closeOthers: '关闭其它',
    closeAll: '关闭所有'
  },
  settings: {
    title: '系统布局配置',
    theme: '主题色',
    tagsView: '开启 Tags-View',
    fixedHeader: '固定 Header',
    sidebarLogo: '侧边栏 Logo'
  },
  common: {
    ok: '确认',
    cancel: '取消',
    search: '搜索',
    title: '提示',
    add: '添加',
    delete: '删除',
    edit: '编辑',
    pChoose: '请选择',
    enabled: '启用',
    disabled: '禁用',
    success: '成功',
    empty: '清空',
    sort: '排序',
    save: '保存',
    close: '关闭',
    operate: '操作'
  },
  login: {
    title: '后台管理系统登录',
    logIn: '登录',
    username: '账号',
    password: '密码',
    any: '随便填'
  },
  profile: {
    account: '账户资料',
    personalInfo: '个人信息',
    nickname: '用户昵称',
    userType: '用户类型',
    phone: '手机号码',
    email: '用户邮箱',
    roles: '所属角色',
    createTime: '创建日期',
    phoneRuleMsg: '请输入正确的手机号码',
    emailRuleMsg: '请输入正确的邮箱地址',
    accountSaveSucceed: '账户信息保存成功'
  },
  system: {
    // 用户管理页面
    username: '用户名',
    userType: '类型',
    userRank: '级别',
    password: '密码',
    nickname: '昵称',
    sex: '性别',
    man: '男',
    woman: '女',
    status: '状态',
    phone: '手机号',
    email: '邮件地址',
    createTime: '创建时间',
    modifyPass: '修改密码',
    editRole: '编辑角色',
    addUser: '新增用户',
    oldPwd: '旧密码',
    newPwd: '新密码',
    roleScope: '角色范围',
    addUserSucceed: '添加用户成功',
    updateSucceed: '更新成功',
    modifyPassSucceed: '修改密码成功',
    deleteSucceed: '删除成功',
    searchUserPlaceholder: '输入用户名或昵称搜索',
    updateUserRoleMessage: '用户角色更新成功，是否刷新即刻生效？',
    handleDeleteMessage: '此操作将永久删除数据，是否继续？',
    // 角色管理页面
    roleName: '角色名称',
    roleCode: '角色标识',
    roleDesc: '角色描述',
    menu: '菜单',
    viewPermission: '指令权限',
    editMenu: '编辑菜单',
    addRole: '新增角色',
    roleDelStartMsg: '确认删除',
    roleDelEndMsg: '角色吗？',
    confirmRoleMsg: '角色权限更新成功，是否刷新即刻生效？',
    addRoleSucceed: '新增角色成功',
    // 菜单管理页面
    menuTitle: '菜单标题',
    menuName: '菜单名称',
    menuPath: '菜单路径',
    menuRedirect: '跳转路径',
    component: '组件映射',
    hidden: '隐藏',
    menuLevel: '菜单层级',
    childPosition: '子级位置',
    menuIcon: '菜单图标',
    menuHidden: '菜单隐藏',
    menuSort: '菜单排序',
    addMenu: '新增菜单',
    topLevel: '顶级',
    childLevel: '子级',
    addMenuSucceed: '菜单新增成功，是否刷新即刻生效？',
    updateMenuSucceed: '菜单更新成功，是否刷新即刻生效？',
    deleteClickMsg: '此操作将删除该菜单, 是否继续?',
    delChildNode: '请删除子节点',
    editSucceed: '编辑成功',
    enterMenuPath: '请输入菜单路径',
    enterComponent: '请输入组件映射',
    enterMenuTitle: '请输入菜单标题',
    enterMenuIcon: '请输入菜单图标',
    enterMenuRedirect: '节点为菜单目录时需要',
    chooseLevel: '请选择层级',
    chooseChildPosition: '请选择子级位置',
    // 权限管理页面
    permissionNum: '权限ID',
    permissionName: '权限名称',
    permissionCode: '权限编码',
    description: '权限描述',
    resourcesId: '资源绑定ID',
    resourcesType: '资源类型',
    source: '权限来源',
    operationScope: '操作范围',
    permissionPlaceholder: '输入权限名或操作范围搜索'
  },
  monitor: {
    // 日志页面
    logNum: '日志编号',
    identity: '操作人员',
    remoteAddress: '操作地址',
    actionType: '操作类型',
    statusCode: '操作状态',
    operatingTime: '操作时间',
    elapsedTime: '耗时（毫秒）',
    content: '操作内容',
    exceptionInfo: '异常信息',
    handleClearMsg: '此操作将永久清空日志数据，是否继续？',
    emptySucceed: '清空成功',
    searchLogPlaceholder: '输入身份标识或IP搜索'
  }
}
