<template>
  <main class="page-container">
    <header
      v-if="$slots.header"
      ref="header"
      class="page-header"
      :class="headerClass"
    >
      <slot name="header"></slot>
    </header>
    <section class="page-content" @scroll="handleScroll">
      <div class="page-content-wrap" :class="contentClass">
        <slot></slot>
      </div>
    </section>
    <footer
      v-if="$slots.footer"
      ref="footer"
      class="page-footer"
      :class="footerClass"
    >
      <slot name="footer"></slot>
    </footer>
  </main>
</template>
<script setup lang="ts">
defineProps({
  headerClass: {
    type: String,
    default: ''
  },
  footerClass: {
    type: String,
    default: ''
  },
  contentClass: {
    type: String,
    default: ''
  },
  footerOverlay: {
    type: Boolean,
    default: true
  }
})
const emits = defineEmits(['scroll'])

function handleScroll(event: any) {
  emits('scroll', event)
}
</script>
<style lang="less" scoped>
.page-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #fff;
  overflow: hidden;
}
.page-header {
  flex-shrink: 0;
  z-index: 1;
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
  background-color: #fff;
  border-bottom: 1px solid #eeeff1;
}
.page-content {
  position: relative;
  z-index: 0;
  flex: 1;
  box-sizing: content-box;
  overflow-y: auto;
}
.page-content-wrap {
  min-height: 100%;
  box-sizing: content-box;
  overflow: hidden;
}
.page-footer {
  z-index: 1;
  flex-shrink: 0;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  background-color: #fff;
  border-top: 1px solid #eeeff1;
}
</style>
