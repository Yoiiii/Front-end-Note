<template>
  <div class="create-post-page">
    <h4>新建文章</h4>
    <!-- <input type="file" name="file" @change.prevent="handleFileChange"> -->
    <Uploader
    class="d-flex align-items-center justify-content-center bg-light text-secondary w-100 my-4"
    action="/upload"
    :beforeUpload="uploadCheck"
    @file-uploaded="handleFileUploaded">
      <h2 v-if="imageUrl===''">点击上传头图</h2>
      <img v-else :src="imageUrl" alt="">
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
    <validate-form @form-submit="onFormSubmit" >
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
        <button class="btn btn-primary btn-large">更新文章</button>
      </template>
    </validate-form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
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
import axios from 'axios'

const store = useStore<GolbalDataProps>()
const router = useRouter()
const route = useRoute()
const titleVal = ref('')

let imageId = ''
const imageUrl = ref('')
const titleRules: RulesProp = [
  { type: 'required', message: '文章标题不能为空' }
]
const contentVal = ref('')
const contentRules: RulesProp = [
  { type: 'required', message: '文章详情不能为空' }
]

onMounted(async () => {
  const { data } = await axios.get(`/post/${route.params.id}`)
  imageUrl.value = data.data.image.url
  titleVal.value = data.data.title
  contentVal.value = data.data.content
})

const handleFileUploaded = (rawData: ResponseType<ImageProps>) => {
  if (rawData.data._id) {
    imageId = rawData.data._id
  }
}
const onFormSubmit = async (result: boolean) => {
  if (result) {
    const md = new MarkdownIt()
    const { column, _id } = store.state.user
    const html = md.render(contentVal.value)
    if (column) {
      const newPost: PostProps = {
        title: titleVal.value,
        content: contentVal.value,
        excerpt: html.replace(/<[^>]*>/g, ''),
        column,
        author: _id
      }
      if (imageId !== '') {
        newPost.image = imageId
      }
      const { data } = await axios.patch(`/post/${route.params.id}`, newPost)
      if (data.success) {
        createMessage('更新成功，2秒跳转到文章', 'success', 2000)
        setTimeout(() => {
          router.push({ name: 'column', params: { id: column } })
        }, 2000)
      }
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
