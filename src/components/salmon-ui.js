import simpleTable from './base/simple-table/simple-table'
import simpleForm from './base/simple-form/simple-form'
import numberInput from './base/number-input/number-input'
import language from './base/language/language'
import sidebar from './base/sidebar/sidebar'
import pageTagController from './base/page-tag-controller/page-tag-controller'
import searchableInput from './base/searchable-input/searchable-input'
import formComponent from './base/form-component/form-component'
const components = {
  sidebar,
  pageTagController,
  language,
  simpleTable,
  simpleForm,
  numberInput,
  searchableInput,
  formComponent
}

let install = (Vue) => {
  Object.keys(components).forEach(key => {
    Vue.component(key, components[key])
    console.log(`[Component Installed] ${key}`)
  })
}

export {
  install
}
