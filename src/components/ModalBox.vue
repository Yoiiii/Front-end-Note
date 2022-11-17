<template>
  <Teleport to="#modal">
    <div class="modal d-block" tabindex="-1" v-if="visable">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{props.title}}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="onClose"></button>
          </div>
          <div class="modal-body">
            <slot></slot>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="onClose" data-bs-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="onConfirm">确定</button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import useDOMCreate from '../hooks/useDOMCreate'
const props = defineProps({
  title: String,
  visable: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['modal-on-close', 'modal-on-confirm'])
useDOMCreate('modal')
const onClose = () => {
  emit('modal-on-close')
}
const onConfirm = () => {
  emit('modal-on-confirm')
}
</script>
