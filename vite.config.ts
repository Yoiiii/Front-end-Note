import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import eslint from 'vite-plugin-eslint'
import path from 'path'

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  return defineConfig({
    plugins: [vue(), eslint()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    base: process.env.VITE_PUBLIC_PATH
  })
}
