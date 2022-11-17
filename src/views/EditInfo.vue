<template>
  <div>
    <!-- <ul class="nav nav-tabs">
      <li class="nav-item">
        <a class="nav-link" :class="page==='personal'?'active':' '" @click.prevent="pageChange('personal')" aria-current="page" href="#">编辑个人资料</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" :class="page==='column'?'active':' '" @click.prevent="pageChange('column')" href="#">编辑专栏信息</a>
      </li>
    </ul>
    <div v-if="page==='column'">
      <span>修改专栏信息</span>
      <Uploader
      class="file-upload-container d-flex align-items-center justify-content-center bg-light text-secondary circle mx-auto my-3"
      action="/upload"
      :before-upload="uploadCheck"
      @file-uploaded="handleColumnUploaded"
      >
      <h4 v-show="columnAvator===''">点击上传专栏头像</h4>
      <img v-show="columnAvator!==''" class="avatar circle"  :src="columnAvator" >
      <template #loading>
        <div class="d-flex">
          <div class="spinner-border text-secondary" role="status">
            <span class="sr-only">Loading...</span>
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
    </ValidateForm>
    </div> -->
    <div v-if="page==='personal'">
      <span>修改个人信息</span>
      <Uploader
      class="file-upload-container d-flex align-items-center justify-content-center bg-light text-secondary circle mx-auto my-3"
      action="/upload"
      :before-upload="uploadCheck"
      @file-uploaded="handleUserUploaded"
      >
      <h4 v-show="userAvator===''">点击上传专栏头像</h4>
      <img v-show="userAvator!==''" class="avatar circle"  :src="userAvator" >
      <template #loading>
        <div class="d-flex">
          <div class="spinner-border text-secondary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <h2>正在上传</h2>
      </template>
      <template #uploaded="dataProps">
        <img class="avatar circle" :src="dataProps.uploadData.data.url" >
      </template>
    </Uploader>
    <ValidateForm @form-submit="onUserSubmit">
      <div class="mb-3">
        <label class="form-label">用户昵称</label>
        <ValidateInput
          type="text"
          :rules="userNickNameRules"
          placeholder="请输入用户昵称"
          v-model="userNickName"
        ></ValidateInput>
        <label class="form-label">用户简介</label>
        <validate-input
          :rules="userDescriptionRules"
          v-model="userDescription"
          placeholder="请输入用户简介"
          type="text"
          tag="textarea"
          rows="10"
        >
        </validate-input>
      </div>
    </ValidateForm>
    </div>
  </div>
</template>
<script lang="ts" setup>
import ValidateInput, { RulesProp } from '@/components/ValidateInput.vue'
import Uploader from '@/components/UploaderInput.vue'
import ValidateForm from '@/components/ValidateForm.vue'
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useStore } from 'vuex'
import { GolbalDataProps, ImageProps, ResponseType } from '../store'
import { beforeUploadCheck } from '../helper'
import createMessage from '@/components/createMessage'
// tab
type PageType = 'personal' | 'column'
const page = ref<PageType>('personal')
// const pageChange = (pageType: PageType) => {
//   console.log(pageType)
//   page.value = pageType
// }
// form setting
const store = useStore<GolbalDataProps>()
const userNickName = ref(store.state.user.nickName)
const userNickNameRules: RulesProp = [
  { type: 'required', message: '用户昵称不能为空' }
]
const userDescription = ref(store.state.user.description)
const userDescriptionRules: RulesProp = [
  { type: 'custom', message: '用户简介不能为空' }
]
// const columnTitle = ref('')
// const columnTilteRules: RulesProp = [
//   { type: 'required', message: '专栏标题不能为空' }
// ]
// const columnDescription = ref('')
// const columnDescriptionRules: RulesProp = [
//   { type: 'required', message: '专栏简介不能为空' }
// ]
// 初始获取专栏信息
const userAvator = ref('')
const columnAvator = ref('')
onMounted(async () => {
  const { data } = await axios.get(`columns/${store.state.user.column}`)
  // columnTitle.value = data.data.title
  // columnDescription.value = data.data.description
  if (store.state.user.avatar) {
    userAvator.value = store.state.user.avatar.url
  }
  console.log(data.data)

  if (data.data.avatar) {
    columnAvator.value = data.data.avatar.url
  }
})
// 获取图片url
// const getImageUrl = async (ImageId: string) => {
//   const { data } = await axios.get(`image/${ImageId}`)
//   return data.data.url
// }
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
// 上传完成
// let columnAvatorId = ''
// const handleColumnUploaded = (rawData: ResponseType<ImageProps>) => {
//   if (rawData.data._id) {
//     columnAvatorId = rawData.data._id
//   }
// }
let userAvatorId = ''
const handleUserUploaded = (rawData: ResponseType<ImageProps>) => {
  if (rawData.data._id) {
    userAvatorId = rawData.data._id
  }
}
// 提交
const onUserSubmit = async (result: boolean) => {
  if (result) {
    const { data } = await axios.patch('/user', {
      nickName: userNickName.value,
      description: userDescription.value,
      avatar: userAvatorId
    })
    if (data.success) {
      createMessage(data.msg, 'success')
      store.dispatch('fetchCurrentUser')
    }
  }
}
// const onColumnSubmit = async (result: boolean) => {
//   if (result) {
//     const { column } = store.state.user
//     const { data } = await axios.patch(`columns/${column}`, {
//       title: columnTitle.value,
//       description: columnDescription.value,
//       avatar: columnAvatorId
//     })
//     if (data.success) {
//       createMessage(data.msg, 'success')
//     }
//   }
// }
</script>
<style>
.circle {
  width: 200px;
    height: 200px;
    border-radius: 200px;
    overflow: hidden;
    cursor: pointer;
    border: 1px solid #efefef;
}
.avatar {
  object-fit: cover;
}
</style>
