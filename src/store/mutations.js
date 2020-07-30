export default {
  setA(state, data) {
    state.a = data
  },
  setTabbar(state, data) {
    state.tabbar = data
  },
  addTabbar(state, data) {
    let index = state.tabbar.findIndex((item) => item.path === data.path)
    if(index > -1) {
      return
    }
    state.tabbar.push(data)
    sessionStorage.setItem('tabbar', JSON.stringify(state.tabbar))
  },
  delTabbar(state, data) {
    state.tabbar.splice(data, 1)
    sessionStorage.setItem('tabbar', JSON.stringify(state.tabbar))
  },
  setModifyPopVisible(state, data) {
    state.modifyPopVisible = data
  }
}
