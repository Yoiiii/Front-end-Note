<template>
  <div>
    <h4>{{isEditMode?'编辑专栏':'新建专栏'}}</h4>
    <span>专栏图标</span>
    <Uploader
      class="file-upload-container d-flex align-items-center justify-content-center bg-light text-secondary circle mx-auto my-3"
      action="/upload"
      :before-upload="uploadCheck"
      @file-uploaded="handleColumnUploaded"
      >
      <h4 v-show="columnAvator===''">点击上传专栏图标</h4>
      <img v-show="columnAvator!==''" class="avatar circle"  :src="columnAvator" >
      <template #loading>
        <div class="d-flex">
          <div class="spinner-border text-secondary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <h2>正在上传</h2>
      </template>
      <template #uploaded="dataProps">
        <img class="avatar circle"  :src="dataProps.uploadData.data.url" >
      </template>
    </Uploader>
    <ValidateForm @form-submit="onColumnSubmit">
      <div class="mb-3">
        <label class="form-label">专栏标题</label>
        <ValidateInput
          type="text"
          :rules="columnTilteRules"
          placeholder="请输入专栏标题"
          v-model="columnTitle"
        ></ValidateInput>
        <label class="form-label">专栏简介</label>
        <validate-input
          :rules="columnDescriptionRules"
          v-model="columnDescription"
          placeholder="请输入专栏简介"
          type="text"
          tag="textarea"
          rows="10"
        >
        </validate-input>
      </div>
      <template #submit>
        <div class="btn-group">
          <button class="btn btn-primary btn-large">提交</button>
          <button class="btn btn-secondary" @click.stop="router.push({ name: 'columnList' })">返回</button>
        </div>
      </template>
    </ValidateForm>
  </div>
</template>

<script setup lang="ts">
import ValidateInput, { RulesProp } from '@/components/ValidateInput.vue'
import Uploader from '@/components/UploaderInput.vue'
import ValidateForm from '@/components/ValidateForm.vue'
import { useRoute, useRouter } from 'vue-router'
import { computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import axios from 'axios'
import { GolbalDataProps, ImageProps, ResponseType } from '../store'
import createMessage from '@/components/createMessage'
import { beforeUploadCheck } from '../helper'
const route = useRoute()
const router = useRouter()
const columnId = computed(() => route.query.id)
console.log(columnId)
const isEditMode = !!route.query.id
const store = useStore<GolbalDataProps>()
const columnAvator = ref('')
const columnTitle = ref('')
const columnTilteRules: RulesProp = [
  { type: 'required', message: '专栏标题不能为空' }
]
const columnDescription = ref('')
const columnDescriptionRules: RulesProp = [
  { type: 'required', message: '专栏简介不能为空' }
]
onMounted(async () => {
  if (isEditMode) {
    const { data } = await axios.get(`columns/${route.query.id}`)
    columnTitle.value = data.data.title || ''
    columnDescription.value = data.data.description || ''
    if (data.data.avatar) {
      columnAvator.value = data.data.avatar.url || ''
    }
  }
})
// 图片上传检测
const uploadCheck = (file: File) => {
  const result = beforeUploadCheck(file, { format: ['image/jpeg', 'image/png'], size: 1 })
  const { passed, error } = result
  if (error === 'format') {
    createMessage('上传图片只能是JPG/PNG格式!', 'error')
  }
  if (error === 'size') {
    createMessage('上传图片大小不能超过1MB', 'error')
  }
  return passed
}
let columnAvatorId = ''
const handleColumnUploaded = (rawData: ResponseType<ImageProps>) => {
  if (rawData.data._id) {
    columnAvatorId = rawData.data._id
  }
}
const onColumnSubmit = async (result: boolean) => {
  if (result) {
    if (isEditMode) {
      const { data } = await axios.patch(`columns/${columnId.value}`, {
        title: columnTitle.value,
        description: columnDescription.value,
        avatar: columnAvatorId
      })
      if (data.success) {
        createMessage(data.msg, 'success')
        router.push({ name: 'columnList' })
      }
    } else {
      const { data } = await axios.post('columns', {
        title: columnTitle.value,
        description: columnDescription.value,
        avatar: columnAvatorId,
        author: store.state.user._id
      })
      if (data.success) {
        createMessage(data.msg, 'success')
        router.push({ name: 'columnList' })
      }
    }
  }
}
</script>
