import qs from 'qs'
export default {
  namespaced: true,
  state: {
    appId: 1
  },
  mutations: {
    /**
     * [setAppId 通过url设置系统应用标识]
     */
    setAppId (state) {
      let appId = qs.parse(window.location.search.substr(1)).appId || 1
      state.appId = parseInt(appId)
    }
  }
}
