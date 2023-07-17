import variables from '@/styles/element-variables.scss'
import defaultSettings from '@/settings'

const { showSettings, layoutSettings, tagsView, fixedHeader, sidebarLogo, supportPinyinSearch } = defaultSettings

const state = {
  theme: variables.theme,
  showSettings,
  layoutSettings,
  tagsView,
  fixedHeader,
  sidebarLogo,
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

