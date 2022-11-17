<template>
  <div class="file-upload">
    <div class="file-upload-container" @click.prevent="triggerUpload" v-bind="$attrs">
      <slot v-if="fileStatus ==='loading'" name="loading">
        <button class="btn btn-primary" disabled>正在上传...</button>
      </slot>
      <slot v-else-if="fileStatus ==='success'" name="uploaded" :uploadData="uploadData">
        <button class="btn btn-primary">上传成功</button>
      </slot>
      <slot v-else name="default">
        <button class="btn btn-primary">点击上传</button>
      </slot>
    </div>
    <input
    type="file"
    class="file-input d-node"
    ref="fileInput"
    @change="handleFileChange"
    style="display: none;"
    >
  </div>
</template>

<script lang="ts">
import axios from 'axios'
import { PropType, ref, watch } from 'vue'
export default {
  inheritAttrs: false
}
</script>
<script setup lang="ts">
type UploadStatus = 'ready' | 'loading' | 'success' | 'error'
type CheckFunction = (file: File)=> boolean
const props = defineProps({
  action: {
    type: String,
    required: true
  },
  beforeUpload: {
    type: Function as PropType<CheckFunction>
  },
  uploaded: {
    type: Object
  }
})
const emit = defineEmits(['file-uploaded', 'file-uploaded-error'])
const fileInput = ref<null| HTMLInputElement>(null)
const fileStatus = ref<UploadStatus>(props.uploaded ? 'success' : 'ready')
const uploadData = ref(props.uploaded)
watch(() => props.uploaded, (newVal) => {
  if (newVal) {
    fileStatus.value = 'success'
    uploadData.value = newVal
  }
})
const triggerUpload = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}
const handleFileChange = (e: Event) => {
  const currentTarget = e.target as HTMLInputElement
  if (currentTarget.files) {
    const files = Array.from(currentTarget.files)
    console.log('props.beforeUpload', props.beforeUpload)

    if (props.beforeUpload) {
      const result = props.beforeUpload(files[0])
      if (!result) {
        return
      }
    }
    fileStatus.value = 'loading'
    const formData = new FormData()
    formData.append('file', files[0])
    axios.post(props.action, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(res => {
      fileStatus.value = 'success'
      emit('file-uploaded', res.data)
      uploadData.value = res.data
    }).catch((error) => {
      fileStatus.value = 'error'
      emit('file-uploaded-error', { error })
    }).finally(() => {
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    })
  }
}
</script>
