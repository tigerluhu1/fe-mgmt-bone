import system from '@/views/system/i18n'

export default {
  home: '首页',
  placeholder: {
    username: '请输入用户名',
    password: '请输入密码'
  },
  validate: {
    notBlank: '请输入',
    notSelect: '请选择',
    notZero: '不为0',
    notLessThanZero: '不能小于0',
    notLessThanStart: '不能小于起始项号',

    notNumber: '请输入数字',
    notInInterval: '不在区间内'
  },

  dashboard: {
    prepayTicket: '预付款未结票数',
    unTicketCount: '超期10天未开票票数',
    unReceivableCount: '超期10天未收款票数',
    noPaidCount: '超期10天未付款票数',

    incomeTicket: '收入类票数统计',
    costTicket: '成本类票数统计',

    incomeAmount: '收入类金额统计',
    costAmount: '成本类金额统计',

    voucherNo: '编号',
    projectName: '项目',
    NAME: '客户/供应商名称',
    userName: '申请人'
  },
  field: {
    operation: '操作',
    remarks: '备注',
    status: '状态'
  },
  operation: {
    search: '查询',
    create: '新增',
    view: '查看',
    edit: '编辑',
    delete: '删除',

    submit: '提交',
    confirm: '确认',
    cancel: '取消',
    close: '关闭',

    adjust: '调整',
    issue: '开票',
    pay: '付款',
    file: '文件管理',

    associate: '关联行项目',

    issueSubmit: '确认开票',
    paySubmit: '确认支付',
    gatheringSubmit: '确认收款',
    arrivalSubmit: '确认到账',
    reverseSubmit: '冲账',

    approve: '提交审核',
    reject: '驳回',
    tracking: '追踪状态',
    copy: '复制',
    fee: '运单费用',
    complete: '完成',
    handle: '处理',

    download: '导出',

    collect: '汇总',

    withdraw: '撤回',

    adjustup: '上调',
    adjustdown: '下调',

    addChild: '添加子节点',
    setDefaultAccount: '设置默认账户',

    copyRegistCode: '复制备案单号',
    declarationSubmit: '提交报关',
    declarationComplete: '完成报关',

    exportTracking: '导出运单追踪',
    export: '导出',

    pullSalesTicket: '拉取清单',

    logout: '登出系统',

    generate: '销售出库'
  },
  tip: {
    warning: '提示',
    systemLoading: '数据加载中',
    process: '执行中...',
    deleteSuccess: '删除成功',
    saveSuccess: '保存成功',
    approveSuccess: '提交成功',
    adjustSuccess: '调整成功',
    withdrawSuccess: '撤回成功',
    copySuccess: '复制成功',
    associateSuccess: '关联成功',
    collectSuccess: '汇总成功',
    generateSuccess: '生成成功',

    confirmDelete: '确认删除当前记录？',
    confirmApprove: '确认提交审核当前记录？',
    confirmComplete: '确认完成当前记录？',
    confirmReject: '确认驳回当前记录？',
    confirmAdjust: '确认调整当前库存记录？',
    confirmWithdraw: '确认撤回当前报关记录？',
    confirmDeclarationSubmit: '确认提交当前报关记录？',
    confirmCopy: '复制当前运单后，新运单会初始化相关业务属性，务必重新维护，确认复制当前记录？',
    confirmAssociate: '确认将选中记录关联到运单的行项目中？',
    confirmExport: '确认导出记录？',
    confirmPull: '确认拉取当前日期的销售清单记录？',
    confirmCopyProduct: '确认复制当前货物？',
    confirmCollect: '确认汇总当前时间区间记录？',
    confirmGenerate: '确认生成出库单？',

    defaultPassword: '若不填写，系统默认密码为123456',

    incomeOverflow: '下调金额不能超过未开票金额',
    costOverflow: '下调金额不能超过未支付金额',
    costOverflowThreshold: '上调金额不能超过阈值，上调幅度为'
  },
  ...system
}
