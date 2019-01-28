import Vue from 'vue'

let treeToArray = (treeData, parent, level, expandedAll) => {
  let tempArr = []

  treeData.forEach((element) => {
    if (typeof (element._expanded) === 'undefined') {
      Vue.set(element, '_expanded', expandedAll)
    }

    if (parent) {
      Vue.set(element, '_parent', parent)
    }

    let _level = 0
    if (level !== null && level !== undefined) {
      _level = level + 1
    }

    Vue.set(element, '_level', _level)

    tempArr.push(element)

    if (element.children && element.children.length > 0) {
      let children = treeToArray(element.children, element, _level, expandedAll)
      tempArr = tempArr.concat(children)
    }
  })

  return tempArr
}

export {
  treeToArray
}
