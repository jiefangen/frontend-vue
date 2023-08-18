<template>
  <div class="app-container">
    <el-button type="success" plain @click="openNewTab">
      <svg-icon icon-class="link" /> {{ $t('route.apiDoc') }}
    </el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  created() {
    this.openNewTab()
  },
  methods: {
    openNewTab() {
      const hrefUrl = process.env.VUE_APP_BASE_API + '/doc.html'
      // 在组件创建时自动跳转到目标页面
      // window.location.href = hrefUrl
      // 在组件创建时自动在新标签页中打开目标页面
      window.open(hrefUrl, '_blank')
    }
  }
}
</script>
