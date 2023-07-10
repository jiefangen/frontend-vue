<template>
  <div class="iframe-container">
    <iframe :src="iframeUrl" class="frame" />
  </div>
</template>

<script>
export default {
  data() {
    const iframeUri = '/doc.html'
    return {
      iframeUrl: process.env.VUE_APP_BASE_API + iframeUri
    }
  }
}
</script>

<style scoped>
  .frame {
    overflow-y: scroll;
    border: none;
    width: 100%;
    height: 912px;
  }
</style>
