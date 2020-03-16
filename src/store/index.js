import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
import menu from './menu'
import error from './error'
import theme from './theme'
import system from './system'
import router from './router'
import storage from './storage'
import components from './components'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    error,
    menu,
    theme,
    system,
    router,
    storage,
    components
  }
})
