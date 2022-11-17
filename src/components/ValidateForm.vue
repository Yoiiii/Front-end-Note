<template>
  <form action="" class="validate-form-container">
    <slot name="default"></slot>
    <div class="submit-area" @click.prevent="submitForm">
      <slot name="submit">
        <button type="submit"  class="btn btn-primary">提交</button>
      </slot>
    </div>
  </form>
</template>
<script lang="ts">
import { onUnmounted } from 'vue'
import mitt from 'mitt'
type ValidateFunc = () => boolean
export const emitter = mitt()
</script>
<script lang="ts" setup>
const emit = defineEmits(['form-submit'])
const submitForm = () => {
  const result = funcArr.map(func => func()).every(result => result)
  emit('form-submit', result)
}
let funcArr: ValidateFunc[] = []
const callback = (func: ValidateFunc) => {
  funcArr.push(func)
}
emitter.on('form-item-created', callback)
onUnmounted(() => {
  emitter.on('form-item-created', callback)
  funcArr = []
})

// defineExpose({
//   emitter
// })
</script>
<style>
.submit-area {
  display:inline
}
</style>
