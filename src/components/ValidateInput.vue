<template>
  <div class="validate-input-container pb-3">
    <textarea
    v-if="tag ==='textarea'"
      class="form-control"
      :class="{'is-invalid': inputRef.error}"
      v-model="inputRef.val"
      @blur="validateInput"
      v-bind:="$attrs"
    />
    <div
    v-else-if="tag ==='mdEditor'"
    class="md-editor"
    :class="{'is-invalid': inputRef.error}"
    >
    <v-md-editor
    v-model="inputRef.val"
    height="400px"
    @change="updateValueMd"
    @blur="validateInput"
    :disabled-menus="[]"
    @upload-image="handleUploadImage"
    >
    </v-md-editor>
    </div>
    <input
      v-else
      class="form-control"
      :class="{'is-invalid': inputRef.error}"
      v-model="inputRef.val"
      @blur="validateInput"
      v-bind:="$attrs"
    />
    <span v-if="inputRef.error" class="invalid-feedback">{{inputRef.message}}</span>
  </div>
</template>
<script lang="ts">
import { computed, reactive, PropType, onMounted } from 'vue'
import axios from 'axios'

import { emitter } from './ValidateForm.vue'
interface RuleProp{
  type: 'required' | 'email' | 'custom';
  message: string;
  validator?: ()=> boolean;
}
export type RulesProp = RuleProp[]
export type TagType = 'input' | 'textarea' | 'mdEditor'

// 是否启用默认的组件 attribute 透传行为
export default {
  inheritAttrs: false
}
</script>
<script lang="ts" setup>
// console.log(useAttrs())

const props = defineProps({
  rules: Array as PropType<RulesProp>,
  modelValue: String,
  tag: {
    type: String as PropType<TagType>,
    default: 'input'
  }
})
const emit = defineEmits(['update:modelValue'])
const emailReg = /^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/
const inputRef = reactive({
  val: computed({
    get: () => props.modelValue || '',
    set: val => {
      emit('update:modelValue', val)
    }
  }),
  error: false,
  message: ''
})
// const updateValue = (e: Event) => {
//   const targetValue = (e.target as HTMLInputElement).value
//   inputRef.val = targetValue
//   emit('update:modelValue', targetValue)
// }
const updateValueMd = (md :string) => {
  inputRef.val = md
  emit('update:modelValue', md)
}
const validateInput = () => {
  if (props.rules) {
    const allPassed = props.rules.every(rule => {
      let passed = true
      inputRef.message = rule.message
      switch (rule.type) {
        case 'required':
          passed = (inputRef.val.trim() !== '')
          break
        case 'email':
          passed = emailReg.test(inputRef.val)
          break
        case 'custom':
          passed = rule.validator ? rule.validator() : true
          break
        default:
          break
      }
      return passed
    })
    inputRef.error = !allPassed
    return allPassed
  }
  return true
}
onMounted(() => {
  emitter.emit('form-item-created', validateInput)
})
// 将方法暴露给父组件
defineExpose({
  validateInput
})

const handleUploadImage = (event, insertImage, files) => {
  const formData = new FormData()
  formData.append('file', files[0])
  axios.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(res => {
    insertImage({
      url: res.data.data.url,
      desc: files[0].name
    })
  })
}
</script>
<style>
.md-editor {
  border: 1px solid #ced4da;
  border-radius: 0.375rem;
  padding: 1px;
}
.md-editor.is-invalid{
border: 1px solid #dc3545;
}
</style>
