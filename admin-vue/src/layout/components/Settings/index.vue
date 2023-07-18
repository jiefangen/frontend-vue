<template>
  <div class="drawer-container">
    <div>
      <h3 class="drawer-title">{{ $t('settings.styleTitle') }}</h3>
      <div class="drawer-item">
        <span>{{ $t('settings.theme') }}</span>
        <theme-picker style="float: right;height: 26px;margin: -3px 8px 0 0;" @change="themeChange" />
      </div>

      <el-divider />

      <h3 class="drawer-title">{{ $t('settings.title') }}</h3>
      <div class="drawer-item">
        <span>{{ $t('settings.tagsView') }}</span>
        <el-switch v-model="tagsView" class="drawer-switch" />
      </div>
      <div class="drawer-item">
        <span>{{ $t('settings.fixedHeader') }}</span>
        <el-switch v-model="fixedHeader" class="drawer-switch" />
      </div>
      <div class="drawer-item">
        <span>{{ $t('settings.sidebarLogo') }}</span>
        <el-switch v-model="sidebarLogo" class="drawer-switch" />
      </div>
    </div>

    <el-divider />

    <el-button type="primary" plain icon="el-icon-set-up" size="small" @click="saveSetting">
      {{ $t('settings.saveSetting') }}
    </el-button>
    <el-button plain icon="el-icon-refresh" size="small" @click="resetSetting">{{ $t('settings.resetSetting') }}</el-button>
  </div>
</template>

<script>
import ThemePicker from '@/components/ThemePicker'

export default {
  components: { ThemePicker },
  data() {
    return {
    }
  },
  computed: {
    isShowJob() {
      return this.$store.getters.language === 'zh'
    },
    fixedHeader: {
      get() {
        return this.$store.state.settings.fixedHeader
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'fixedHeader',
          value: val
        })
      }
    },
    tagsView: {
      get() {
        return this.$store.state.settings.tagsView
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'tagsView',
          value: val
        })
      }
    },
    sidebarLogo: {
      get() {
        return this.$store.state.settings.sidebarLogo
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'sidebarLogo',
          value: val
        })
      }
    },
    supportPinyinSearch: {
      get() {
        return this.$store.state.settings.supportPinyinSearch
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'supportPinyinSearch',
          value: val
        })
      }
    },
    lang() {
      return this.$store.getters.language
    }
  },
  methods: {
    themeChange(val) {
      this.$store.dispatch('settings/changeSetting', {
        key: 'theme',
        value: val
      })
    },
    saveSetting() {
      const saveLoading = this.$loading({
        lock: true,
        text: String(this.$t('settings.saveLoading')),
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const layoutSetting = {
        'tagsView': this.$store.state.settings.tagsView,
        'fixedHeader': this.$store.state.settings.fixedHeader,
        'sidebarLogo': this.$store.state.settings.sidebarLogo,
        'theme': this.$store.state.settings.theme
      }
      localStorage.setItem('layout-setting', JSON.stringify(layoutSetting))
      setTimeout(() => {
        saveLoading.close()
      }, 1000)
    },
    resetSetting() {
      this.$loading({
        lock: true,
        text: String(this.$t('settings.resetLoading')),
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      localStorage.removeItem('layout-setting')
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, .85);
    font-size: 14px;
    line-height: 22px;
  }

  .drawer-item {
    color: rgba(0, 0, 0, .65);
    font-size: 14px;
    padding: 12px 0;
  }

  .drawer-switch {
    float: right
  }

  .job-link{
    display: block;
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 0;
  }
}
</style>
