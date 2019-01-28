/**
 * 通过 type 字段获取字典列表
 * @param {String} type 字典类型
 * @returns {Array} 满足条件的字典列表
 */
function getDictList (type) {
  let sysDict = this.$store.state.app.sysDict

  // return sysDict.filter(item => {
  //   return item.type === type
  // })

  return sysDict[type]
}

/**
 * 通过 type 字段和 value 字段获取对应字典的 label
 * @param {Object} type:字典类型，value: 字典值
 * @returns {String} 满足条件的 label 值
 */
function getDictLabel ({
  type,
  value
}) {
  let sysDict = this.$store.state.app.sysDict

  let resultDict = sysDict[type].filter(item => {
    // eslint-disable-next-line
    return item.value == value
  })

  if (resultDict.length > 0) {
    return resultDict[0].label
  }
  return ''
}

let install = (Vue) => {
  Vue.prototype.$getDictList = getDictList
  Vue.prototype.$getDictLabel = getDictLabel
}

export default install
