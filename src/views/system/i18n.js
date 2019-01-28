const system = {
  system_user: {
    pageTitle: '系统用户',
    detailDialog: '用户详细',

    account: '用户帐号',
    name: '用户姓名',
    companyName: '所属公司',
    password: '密码',
    deptName: '所属部门',
    mobile: '手机号码',
    email: '电子邮箱',
    roleIdList: '角色信息',
    status: '状态',
    remark: '备注'

  },
  system_dict: {
    pageTitle: '字典设置',
    detailDialog: '字典详细',

    label: '字典内容',
    value: '字典值',
    type: '字典类型',
    description: '备注'
  },

  system_parameter: {
    pageTitle: '参数配置',
    detailDialog: '参数配置详细',

    label: '内容',
    description: '描述',
    delFlag: '状态'
  },

  system_role: {
    pageTitle: '角色设置',
    detailDialog: '角色详细',
    tabTitle: '资源权限',

    // code: '编码',
    name: '角色名称',
    dataScope: '数据范围',
    status: '状态',
    remarks: '备注'
  },

  system_office: {
    pageTitle: '系统机构',
    detailDialog: '机构详细',

    name: '机构名称',
    code: '机构代码',
    category: '机构类型',
    address: '单位地址',
    phone: '单位电话',
    remarks: '备注',
    delFlag: '状态',
    accountPeriod: '帐期(天)',

    account: {
      tabTitle: '账户列表',
      detailDialog: '账户详细',

      defaultFlag: '默认账户',
      bank: '开户银行',
      bankAccount: '开户账号',
      bankAddress: '开户行地址',
      taxCode: '税号',
      swiftCode: 'SWIFT CODE',
      iban: 'IBAN',
      invoiceName: '发票抬头',
      address: '邮寄地址',
      phone: '电话',
      abroadFlag: '境外银行',
      vatFlag: '增值税一般纳税人'
    }
  },

  system_department: {
    pageTitle: '系统部门',
    detailDialog: '部门详细',

    name: '部门名称',
    code: '部门代码',
    companyName: '所属机构',
    status: '状态',
    remarks: '备注'
  },

  system_menu: {
    pageTitle: '菜单管理',
    detailDialog: '菜单（操作）详细',
    parentTitle: '父节点名称',
    title: '名称',
    name: '标识',
    permission: '权限',
    sort: '排序',
    isShow: '类型',
    icon: '图标'
  }
}
export default system
