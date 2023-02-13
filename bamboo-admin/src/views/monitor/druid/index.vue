<template>
  <div class="iframe-container">
    <iframe :src="iframeUrl" scrolling="auto" frameborder="0" class="frame" />
  </div>
</template>

<script>
export default {
  data() {
    const iframeUri = '/druid/index.html'
    return {
      iframeUrl: process.env.VUE_APP_BASE_API + iframeUri
    }
  }
}
</script>
