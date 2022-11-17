<template>
  <teleport to="#back">
    <div class="d-flex justify-content-center align-items-center h-100 loading-container"
    :style="{backgroundColor:props.background|| ''}"
    >
    <div class="loading-content">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p v-if="props.text" class="text-primary small">{{props.text}}</p>
    </div>
  </div>
  </teleport>
</template>

<script lang="ts" setup>
import useDOMCreate from '@/hooks/useDOMCreate'
const props = defineProps({
  text: {
    type: String
  },
  background: {
    type: String
  }
})

useDOMCreate('back')

</script>
<style>
.loading-container{
  background: rgba(255,255 255,0.5);
  z-index:100;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.loading-container {
  text-align: center;
}
</style>
