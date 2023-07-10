<template>
  <div class="iframe-container">
    <iframe :src="iframeUrl" class="iframe" />
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

<style scoped>
  .iframe {
    overflow-y: scroll;
    border: none;
    width: 100%;
    height: 912px;
  }
</style>
