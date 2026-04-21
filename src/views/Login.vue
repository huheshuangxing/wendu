<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { API_BASE_URL } from '../config'

const password = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()

const handleLogin = async () => {
  if (!password.value) {
    error.value = '请输入密码'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password: password.value })
    })

    const data = await response.json()

    if (response.ok) {
      localStorage.setItem('admin-token', data.token)
      router.push('/admin')
    } else {
      error.value = data.error || '登录失败'
    }
  } catch (err) {
    error.value = '网络错误，请稍后再试'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-full flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-dark-card border border-gray-800 p-10 rounded-3xl shadow-2xl">
      <div class="text-center mb-10">
        <h1 class="text-2xl font-light tracking-[0.2em] text-white mb-2">
          ADMIN LOGIN<span class="text-brand-pink">.</span>
        </h1>
        <p class="text-gray-500 text-sm uppercase tracking-widest">后台管理系统登录</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">管理密码</label>
          <input 
            v-model="password" 
            type="password" 
            placeholder="••••••••"
            class="w-full bg-black/40 border border-gray-800 rounded-xl px-4 py-4 text-white placeholder-gray-700 focus:outline-none focus:border-brand-pink transition-all"
          />
        </div>

        <div v-if="error" class="text-brand-pink text-xs bg-brand-pink/10 border border-brand-pink/20 py-3 px-4 rounded-lg">
          {{ error }}
        </div>

        <button 
          type="submit" 
          :disabled="loading"
          class="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-brand-pink hover:text-white transition-all duration-500 disabled:opacity-50"
        >
          {{ loading ? '验证中...' : '进入后台' }}
        </button>
      </form>

      <div class="mt-8 text-center">
        <RouterLink to="/" class="text-gray-600 text-xs hover:text-gray-400 transition-colors uppercase tracking-widest">
          返回酒店主页
        </RouterLink>
      </div>
    </div>
  </div>
</template>
