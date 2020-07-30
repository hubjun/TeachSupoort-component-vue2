import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import { autoFontSize } from './util'
import { infoMsg, successMsg, error, errorMsg, formatDate, limitInt, limitFloat, deleteFile, getCode, getAssetsRecordList, planlist, getDataType } from './axios/common.js'

Vue.config.productionTip = false

Vue.use(ElementUI)

console.log('当前的环境是', process.env)
// autoFontSize()
Vue.prototype.$info = infoMsg
Vue.prototype.$success = successMsg
Vue.prototype.$error = error
Vue.prototype.$errorMsg = errorMsg

Vue.prototype.$limitFloat = limitFloat
Vue.prototype.$limitInt = limitInt

Vue.prototype.$formatDate = formatDate
Vue.prototype.$deleteFile = deleteFile
Vue.prototype.$getCode = getCode
Vue.prototype.$getAssetsRecordList = getAssetsRecordList
Vue.prototype.$planlist = planlist
Vue.prototype.$getDataType = getDataType


Vue.prototype.$go = function(route) {
  if(typeof route === 'number') {
    router.go(route)
  }
  if(typeof route === 'string' && route.substr(0, 1) === '/') {
    router.push(route)
  }
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
