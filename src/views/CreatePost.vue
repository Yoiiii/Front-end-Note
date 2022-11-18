<template>
  <div class="create-post-page">
    <h4>{{isEditMode ?'编辑文章':'新建文章'}}</h4>
    <!-- <input type="file" name="file" @change.prevent="handleFileChange"> -->
    <Uploader
    class="d-flex align-items-center justify-content-center bg-light text-secondary w-100 my-4"
    action="/upload"
    :beforeUpload="uploadCheck"
    :uploaded="uploadData"
    @file-uploaded="handleFileUploaded">
      <h2>点击上传头图</h2>
      <template #loading>
        <div class="d-flex">
          <div class="spinner-border text-secondary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <h2>正在上传</h2>
        </div>
      </template>
      <template #uploaded="dataProps">
        <img :src="dataProps.uploadData.data.url" />
      </template>
    </Uploader>
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">文章标题:</label>
        <validate-input
          :rules="titleRules"
          v-model="titleVal"
          placeholder="请输入文章标题"
          type="text"
        ></validate-input>
      </div>
      <div class="mb-3">
        <label class="form-label">文章专栏:</label>
        <DropDown ref="dropDown" class="btn-secondary" :title="selectedColumn.title">
            <DropDownItem v-for="column in columnList" :key="column._id"><a href="#" @click.prevent="selectColumn(column)" class="dropdown-item">{{column.title}}</a></DropDownItem>
        </DropDown>
      </div>
      <div class="mb-3">
        <label class="form-label">文章详情:</label>
        <validate-input
          type="text"
          tag="mdEditor"
          rows="10"
          placeholder="请输入文章详情"
          :rules="contentRules"
          v-model="contentVal"
        ></validate-input>
      </div>
      <template #submit>
        <button class="btn btn-primary btn-large">{{isEditMode ?'更新文章':'发表文章'}}</button>
      </template>
    </validate-form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import ValidateInput, { RulesProp } from '@/components/ValidateInput.vue'
import ValidateForm from '@/components/ValidateForm.vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { GolbalDataProps, PostProps, ImageProps, ResponseType } from '../store'
// import axios from 'axios'
import Uploader from '@/components/UploaderInput.vue'
import createMessage from '@/components/createMessage'
import { beforeUploadCheck } from '../helper'
import MarkdownIt from 'markdown-it'
import DropDown from '@/components/DropDown.vue'
import DropDownItem from '@/components/DropDownItem.vue'
import axios from 'axios'

const store = useStore<GolbalDataProps>()
const uploadData = ref()
const router = useRouter()
const route = useRoute()
const isEditMode = !!route.query.id
const titleVal = ref('')
const columnList = ref([])
const selectedColumn = reactive({
  id: '',
  title: '请选择专栏'
})
let imageId = ''
const titleRules: RulesProp = [
  { type: 'required', message: '文章标题不能为空' }
]
const contentVal = ref('')
const contentRules: RulesProp = [
  { type: 'required', message: '文章详情不能为空' }
]
onMounted(async () => {
  await getColumnList()
  if (isEditMode) {
    store.dispatch('fetchPost', route.query.id).then(async (rawData:ResponseType<PostProps>) => {
      const currentPost = rawData.data
      if (currentPost.image) {
        uploadData.value = { data: currentPost.image }
      }
      titleVal.value = currentPost.title || ''
      contentVal.value = currentPost.content || ''
      const currentColumn = await store.dispatch('fetchColumn', currentPost.column)
      selectedColumn.id = currentPost.column || ''
      selectedColumn.title = currentColumn.data.title
    })
  }
})
const dropDown = ref()
const selectColumn = (column:any) => {
  dropDown.value.toggleOpen()
  selectedColumn.id = column._id
  selectedColumn.title = column.title
}
const getColumnList = async () => {
  const { data } = await axios.get('/columnsList')
  columnList.value = data.data
}
const handleFileUploaded = (rawData: ResponseType<ImageProps>) => {
  if (rawData.data._id) {
    imageId = rawData.data._id
  }
}
const onFormSubmit = (result: boolean) => {
  if (result) {
    const md = new MarkdownIt()
    const { _id } = store.state.user
    const html = md.render(contentVal.value)
    if (selectedColumn.id) {
      const newPost: PostProps = {
        title: titleVal.value,
        content: contentVal.value,
        excerpt: html.replace(/<[^>]*>/g, ''),
        column: selectedColumn.id,
        author: _id
      }
      if (imageId !== '') {
        newPost.image = imageId
      }
      const actionName = isEditMode ? 'updatePost' : 'createPost'
      const sendData = isEditMode
        ? {
            id: route.query.id,
            payload: newPost
          }
        : newPost
      store.dispatch(actionName, sendData).then((res) => {
        console.log(res)

        createMessage((isEditMode ? '更新' : '发表') + '成功，2秒跳转到文章', 'success', 2000)
        setTimeout(() => {
          router.push({ name: 'post', params: { id: res.data._id } })
        }, 2000)
      })
    }
  }
}
// const handleFileChange = (e:Event) => {
//   const target = e.target as HTMLInputElement
//   const files = target.files
//   if (files) {
//     const uploadFile = files[0]
//     const fromData = new FormData()
//     fromData.append('file', uploadFile)
//     axios.post('/upload', fromData, {
//       headers: {
//         'Content-Type': 'multipart/form-data'
//       }
//     }).then((res: any) => {
//       console.log(res)
//     })
//   }
// }
// const beforeUpload = (file: File) => {
//   console.log('file.type:', file.type)
//   const isJPG = file.type === 'image/jpeg'
//   if (!isJPG) {
//     createMessage('上传图片只能是JPG/PNG格式!', 'error')
//   }
//   return isJPG
// }
// const onFileUploaded = (rawData: ResponseType<ImageProps>) => {
//   createMessage(`上传图片ID ${rawData.data._id}`, 'success')
// }
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
</script>
<style>
.create-post-page .file-upload-container {
  height: 200px;
  cursor: pointer;
}
.create-post-page .file-upload-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
