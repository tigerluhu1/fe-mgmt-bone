let install = (Vue, store) => {
  Vue.directive('permission', {
    inserted: function (el, binding) {
      let permissionStr = binding.value
      let hasPermission = store.state.app.sysPermission.find(item => {
        return item.permission === permissionStr
      })

      if (!hasPermission) {
        el.remove()
      }
    }
  })
}

export default install
