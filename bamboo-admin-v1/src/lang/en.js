export default {
  common: {
    ok: 'OK',
    cancel: 'Cancel',
    search: 'Search',
    title: 'Prompt',
    add: 'Add',
    delete: 'Delete',
    edit: 'Edit',
    pChoose: 'Please choose',
    enabled: 'Enabled',
    disabled: 'Disabled',
    success: 'Success',
    sort: 'Sort',
    operate: 'Operate'
  },
  login: {
    title: 'Login Form',
    logIn: 'Login',
    username: 'Username',
    password: 'Password',
    any: 'any'
  },
  system: {
    // User Management Page
    username: 'Username',
    userType: 'Type',
    userRank: 'Rank',
    password: 'Password',
    nickname: 'Nickname',
    sex: 'Gender',
    status: 'Status',
    phone: 'Phone',
    email: 'Email',
    createTime: 'CreateTime',
    modifyPass: 'Modify Password',
    editRole: 'Edit Role',
    addUser: 'Add User',
    oldPwd: 'Old Password',
    newPwd: 'New Password',
    roleScope: 'Role Scope',
    addUserSucceed: 'User added successfully',
    updateSucceed: 'Update successful',
    modifyPassSucceed: 'Password modification successful',
    deleteSucceed: 'Deletion successful',
    searchUserPlaceholder: 'Enter username or nickname to search',
    updateUserRoleMessage: 'User role updated successfully. Do you want to refresh immediately?',
    handleDeleteMessage: 'This operation will permanently delete the data. Do you want to continue?',
    // Role Management Page
    roleName: 'Role Name',
    roleCode: 'Role Code',
    roleDesc: 'Role Description',
    menu: 'Menu',
    editMenu: 'Edit Menu',
    addRole: 'Add Role',
    roleDelStartMsg: 'Confirm deleting ',
    roleDelEndMsg: ' role?',
    confirmRoleMsg: 'Role permissions updated successfully. Do you want to refresh immediately?',
    addRoleSucceed: 'Role added successfully',
    // Menu Management Page
    menuTitle: 'Menu Title',
    menuName: 'Menu Name',
    menuPath: 'Menu Path',
    menuRedirect: 'Redirect',
    component: 'Component',
    hidden: 'Hidden',
    menuLevel: 'Menu Level',
    childPosition: 'Child Position',
    menuIcon: 'Menu Icon',
    menuHidden: 'Menu Hidden',
    menuSort: 'Menu Sort',
    addMenu: 'Add Menu',
    topLevel: 'Top Level',
    childLevel: 'Child Level',
    addMenuSucceed: 'Menu added successfully. Do you want to refresh immediately?',
    updateMenuSucceed: 'Menu updated successfully. Do you want to refresh immediately?',
    deleteClickMsg: 'This action will delete the menu. Do you want to continue?',
    delChildNode: 'Please delete the child nodes',
    editSucceed: 'Edit successful',
    enterMenuPath: 'Please enter menu path',
    enterComponent: 'Please enter component',
    enterMenuTitle: 'Please enter menu title',
    enterMenuIcon: 'Please enter menu icon',
    enterMenuRedirect: 'Required when the node is a menu directory',
    chooseLevel: 'Please choose the level',
    chooseChildPosition: 'Please choose the child position'
  },
  route: {
    dashboard: 'Dashboard',
    guide: 'Guide',
    systemManage: 'System Management',
    userManage: 'User Management',
    roleManage: 'Role Management',
    menuManage: 'Menu Management',
    systemMonitor: 'System Monitor',
    operationLog: 'Operation Log',
    apiDoc: 'API Document',
    druidMonitor: 'Druid Monitor',
    documentation: 'Documentation',
    permission: 'Permission',
    pagePermission: 'Page Permission',
    rolePermission: 'Role Permission',
    directivePermission: 'Directive Permission',
    icons: 'Icons',
    components: 'Components',
    tinymce: 'Tinymce',
    markdown: 'Markdown',
    jsonEditor: 'JSON Editor',
    dndList: 'Dnd List',
    splitPane: 'SplitPane',
    avatarUpload: 'Avatar Upload',
    dropzone: 'Dropzone',
    sticky: 'Sticky',
    countTo: 'Count To',
    componentMixin: 'Mixin',
    backToTop: 'Back To Top',
    dragDialog: 'Drag Dialog',
    dragSelect: 'Drag Select',
    dragKanban: 'Drag Kanban',
    charts: 'Charts',
    keyboardChart: 'Keyboard Chart',
    lineChart: 'Line Chart',
    mixChart: 'Mix Chart',
    example: 'Example',
    nested: 'Nested Routes',
    menu1: 'Menu 1',
    'menu1-1': 'Menu 1-1',
    'menu1-2': 'Menu 1-2',
    'menu1-2-1': 'Menu 1-2-1',
    'menu1-2-2': 'Menu 1-2-2',
    'menu1-3': 'Menu 1-3',
    menu2: 'Menu 2',
    Table: 'Table',
    dynamicTable: 'Dynamic Table',
    dragTable: 'Drag Table',
    inlineEditTable: 'Inline Edit',
    complexTable: 'Complex Table',
    tab: 'Tab',
    form: 'Form',
    createArticle: 'Create Article',
    editArticle: 'Edit Article',
    articleList: 'Article List',
    errorPages: 'Error Pages',
    page401: '401',
    page404: '404',
    errorLog: 'Error Log',
    excel: 'Excel',
    exportExcel: 'Export Excel',
    selectExcel: 'Export Selected',
    mergeHeader: 'Merge Header',
    uploadExcel: 'Upload Excel',
    zip: 'Zip',
    pdf: 'PDF',
    exportZip: 'Export Zip',
    theme: 'Theme',
    clipboardDemo: 'Clipboard',
    i18n: 'I18n',
    externalLink: 'External Link',
    profile: 'Profile'
  },
  navbar: {
    dashboard: 'Dashboard',
    github: 'Github',
    logOut: 'Log Out',
    profile: 'Profile',
    theme: 'Theme',
    size: 'Global Size'
  },
  documentation: {
    documentation: 'Documentation',
    github: 'Github Repository'
  },
  guide: {
    description: 'The guide page is useful for some people who entered the project for the first time. You can briefly introduce the features of the project. ',
    button: 'Show Guide'
  },
  components: {
    documentation: 'Documentation',
    tinymceTips: 'Rich text is a core feature of the management backend, but at the same time it is a place with lots of pits. In the process of selecting rich texts, I also took a lot of detours. The common rich texts on the market have been basically used, and I finally chose Tinymce. See the more detailed rich text comparison and introduction.',
    dropzoneTips: 'Because my business has special needs, and has to upload images to qiniu, so instead of a third party, I chose encapsulate it by myself. It is very simple, you can see the detail code in @/components/Dropzone.',
    stickyTips: 'when the page is scrolled to the preset position will be sticky on the top.',
    backToTopTips1: 'When the page is scrolled to the specified position, the Back to Top button appears in the lower right corner',
    backToTopTips2: 'You can customize the style of the button, show / hide, height of appearance, height of the return. If you need a text prompt, you can use element-ui el-tooltip elements externally',
    imageUploadTips: 'Since I was using only the vue@1 version, and it is not compatible with mockjs at the moment, I modified it myself, and if you are going to use it, it is better to use official version.'
  },
  table: {
    dynamicTips1: 'Fixed header, sorted by header order',
    dynamicTips2: 'Not fixed header, sorted by click order',
    dragTips1: 'The default order',
    dragTips2: 'The after dragging order',
    title: 'Title',
    importance: 'Imp',
    type: 'Type',
    remark: 'Remark',
    search: 'Search',
    add: 'Add',
    export: 'Export',
    reviewer: 'reviewer',
    id: 'ID',
    date: 'Date',
    author: 'Author',
    readings: 'Readings',
    status: 'Status',
    actions: 'Actions',
    edit: 'Edit',
    publish: 'Publish',
    draft: 'Draft',
    delete: 'Delete',
    cancel: 'Cancel',
    confirm: 'Confirm'
  },
  example: {
    warning: 'Creating and editing pages cannot be cached by keep-alive because keep-alive include does not currently support caching based on routes, so it is currently cached based on component name. If you want to achieve a similar caching effect, you can use a browser caching scheme such as localStorage. Or do not use keep-alive include to cache all pages directly. See details'
  },
  errorLog: {
    tips: 'Please click the bug icon in the upper right corner',
    description: 'Now the management system are basically the form of the spa, it enhances the user experience, but it also increases the possibility of page problems, a small negligence may lead to the entire page deadlock. Fortunately Vue provides a way to catch handling exceptions, where you can handle errors or report exceptions.',
    documentation: 'Document introduction'
  },
  excel: {
    export: 'Export',
    selectedExport: 'Export Selected Items',
    placeholder: 'Please enter the file name (default excel-list)'
  },
  zip: {
    export: 'Export',
    placeholder: 'Please enter the file name (default file)'
  },
  pdf: {
    tips: 'Here we use window.print() to implement the feature of downloading PDF.'
  },
  theme: {
    change: 'Change Theme',
    documentation: 'Theme documentation',
    tips: 'Tips: It is different from the theme-pick on the navbar is two different skinning methods, each with different application scenarios. Refer to the documentation for details.'
  },
  tagsView: {
    refresh: 'Refresh',
    close: 'Close',
    closeOthers: 'Close Others',
    closeAll: 'Close All'
  },
  settings: {
    title: 'Page style setting',
    theme: 'Theme Color',
    tagsView: 'Open Tags-View',
    fixedHeader: 'Fixed Header',
    sidebarLogo: 'Sidebar Logo'
  }
}
