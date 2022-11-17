<template>
  <teleport to="#message">
    <div class="alert message-info fixed-top w-50 mx-auto d-flex justify-content-between mt-2"
      :class="classObject"
      v-if="isVisible"
    >
      <span>{{props.message}}</span>
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" @click.prevent="hide()">
      </button>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { PropType, ref } from 'vue'
import useDOMCreate from '@/hooks/useDOMCreate'
export type MessageType = 'success' | 'error' | 'default'
const emit = defineEmits(['close-message'])
const props = defineProps({
  message: String,
  type: {
    type: String as PropType<MessageType>,
    default: 'default'
  }
})
useDOMCreate('message')
const isVisible = ref(true)
const classObject = {
  'alert-success': props.type === 'success',
  'alert-danger': props.type === 'error',
  'alert-primary': props.type === 'default'
}
const hide = () => {
  isVisible.value = false
  emit('close-message', true)
}

</script>
