import variables from '@/styles/element-variables.scss'
import defaultSettings from '@/settings'

const { showSettings, layoutSettings, tagsView, fixedHeader, sidebarLogo, supportPinyinSearch } = defaultSettings

const storageSetting = JSON.parse(localStorage.getItem('layout-setting')) || ''

const state = {
  theme: storageSetting.theme || variables.theme,
  tagsView: storageSetting.tagsView === undefined ? tagsView : storageSetting.tagsView,
  fixedHeader: storageSetting.fixedHeader === undefined ? fixedHeader : storageSetting.fixedHeader,
  sidebarLogo: storageSetting.sidebarLogo === undefined ? sidebarLogo : storageSetting.sidebarLogo,
  showSettings,
  layoutSettings,
  supportPinyinSearch
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  },
  TOGGLE_SETTINGS: state => {
    state.layoutSettings = !state.layoutSettings
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  },
  toggleSettings({ commit }) {
    commit('TOGGLE_SETTINGS')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

