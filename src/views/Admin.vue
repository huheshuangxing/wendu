<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { io, Socket } from 'socket.io-client'
import { SOCKET_URL, API_BASE_URL } from '../config'
import { Package, BellRing, Plus, Pencil, Trash2, X, Search, Calendar, LogOut } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

interface ServiceCall {
  id: number;
  room_number: string;
  type: string;
  status: string;
  created_at: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
  image_url?: string;
}

const router = useRouter()
const activeTab = ref('calls') // 'calls' | 'stock'
const calls = ref<ServiceCall[]>([])
const products = ref<Product[]>([])
const socket = ref<Socket | null>(null)

// 退出登录
const handleLogout = () => {
  if (confirm('确定要退出管理后台吗？')) {
    localStorage.removeItem('admin-token')
    router.push('/login')
  }
}

// 筛选状态
const searchQuery = ref('')
const filterDate = ref('')
// ... (rest of refs and functions)

// 弹窗状态
const showModal = ref(false)
const modalType = ref<'add' | 'edit'>('add')
const currentProduct = ref<Partial<Product>>({
  name: '',
  price: 0,
  category: '饮料',
  stock: 100,
  image_url: ''
})

// 上传状态
const isUploading = ref(false)

// 新呼叫弹窗状态
const showCallAlert = ref(false)
const incomingCall = ref<ServiceCall | null>(null)

const playAlertSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioCtx.createOscillator()
    const gainNode = audioCtx.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioCtx.destination)
    
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.5)
    
    gainNode.gain.setValueAtTime(1, audioCtx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5)
    
    oscillator.start(audioCtx.currentTime)
    oscillator.stop(audioCtx.currentTime + 0.5)
  } catch (e) {
    console.error('Audio play error:', e)
  }
}

// 获取历史呼叫记录
const fetchHistory = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/service_calls`)
    calls.value = await response.json()
  } catch (err) {
    console.error('获取历史记录失败:', err)
  }
}

// 获取商品列表
const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products`)
    products.value = await response.json()
  } catch (err) {
    console.error('获取商品失败:', err)
  }
}

onMounted(() => {
  fetchHistory()
  fetchProducts()

  // 连接 Socket
  socket.value = io(SOCKET_URL)
  
  // 监听新呼叫广播
  socket.value.on('new-service-call', (newCall: ServiceCall) => {
    calls.value.unshift(newCall)
    if (Notification.permission === "granted") {
      new Notification(`新呼叫: ${newCall.room_number}房间`, {
        body: `请求类型: ${newCall.type}`
      });
    }
    
    // 显示自定义弹窗并播放声音
    incomingCall.value = newCall;
    showCallAlert.value = true;
    playAlertSound();
  })

  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }
})

onUnmounted(() => {
  if (socket.value) socket.value.disconnect()
})

const formatDateTime = (dateStr: string) => {
  const date = new Date(dateStr)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const h = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  const s = String(date.getSeconds()).padStart(2, '0')
  return `${y}-${m}-${d} ${h}:${min}:${s}`
}

// 筛选后的呼叫记录
const filteredCalls = computed(() => {
  return calls.value.filter(call => {
    const matchesSearch = call.room_number.includes(searchQuery.value) || 
                         call.type.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const callDate = new Date(call.created_at).toISOString().split('T')[0]
    const matchesDate = !filterDate.value || callDate === filterDate.value
    
    return matchesSearch && matchesDate
  })
})

// 标记为已处理
const markAsProcessed = async (id: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/service_calls/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'completed' })
    })
    if (response.ok) {
      const call = calls.value.find(c => c.id === id)
      if (call) call.status = 'completed'
    }
  } catch (err) {
    console.error('更新状态失败:', err)
  }
}

// 删除呼叫记录
const deleteCall = async (id: number) => {
  if (!confirm('确定要删除这条呼叫记录吗？')) return
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/service_calls/${id}`, {
      method: 'DELETE'
    })
    if (response.ok) {
      calls.value = calls.value.filter(c => c.id !== id)
    }
  } catch (err) {
    console.error('删除呼叫记录失败:', err)
  }
}

// 商品管理操作
const openAddModal = () => {
  modalType.value = 'add'
  currentProduct.value = { name: '', price: 0, category: '饮料', stock: 100, image_url: '' }
  showModal.value = true
}

const openEditModal = (product: Product) => {
  modalType.value = 'edit'
  currentProduct.value = { ...product }
  showModal.value = true
}

const handleSaveProduct = async () => {
  const url = modalType.value === 'add' 
    ? `${API_BASE_URL}/api/products` 
    : `${API_BASE_URL}/api/products/${currentProduct.value.id}`
  
  const method = modalType.value === 'add' ? 'POST' : 'PUT'

  try {
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentProduct.value)
    })

    if (response.ok) {
      fetchProducts()
      showModal.value = false
    }
  } catch (err) {
    console.error('保存失败:', err)
  }
}

const deleteProduct = async (id: number) => {
  if (!confirm('确定要下架该商品吗？')) return

  try {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: 'DELETE'
    })
    if (response.ok) fetchProducts()
  } catch (err) {
    console.error('删除失败:', err)
  }
}

// 图片上传操作
const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;
  
  const file = target.files[0];
  const formData = new FormData();
  formData.append('image', file);
  
  try {
    isUploading.value = true;
    const response = await fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    if (response.ok) {
      currentProduct.value.image_url = data.url;
    } else {
      alert('上传失败: ' + data.error);
    }
  } catch (err) {
    console.error('上传图片出错', err);
    alert('上传失败，请稍后再试');
  } finally {
    isUploading.value = false;
  }
}
</script>

<template>
  <div class="p-8">
    <!-- 头部与标签切换 -->
    <div class="flex flex-col lg:flex-row lg:justify-between lg:items-end mb-8 gap-4">
      <div>
        <h2 class="text-3xl font-bold text-white mb-4 tracking-tight">管理员控制台</h2>
        <div class="flex space-x-1 bg-black/40 p-1 rounded-xl border border-gray-800 w-fit">
          <button 
            @click="activeTab = 'calls'"
            :class="[activeTab === 'calls' ? 'bg-gray-800 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300']"
            class="flex items-center space-x-2 px-6 py-2.5 rounded-lg text-sm transition-all"
          >
            <BellRing class="w-4 h-4" />
            <span>呼叫历史</span>
          </button>
          <button 
            @click="activeTab = 'stock'"
            :class="[activeTab === 'stock' ? 'bg-gray-800 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300']"
            class="flex items-center space-x-2 px-6 py-2.5 rounded-lg text-sm transition-all"
          >
            <Package class="w-4 h-4" />
            <span>商品管理</span>
          </button>
        </div>
      </div>
      
      <div v-if="activeTab === 'calls'" class="flex items-center space-x-4">
        <!-- 搜索和日期筛选 -->
        <div class="relative flex-1 lg:w-64 group">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-brand-blue transition-colors" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="搜索房间或类型..."
            class="w-full bg-black/40 border border-gray-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-brand-blue transition-all"
          />
        </div>
        <div class="relative group">
          <Calendar class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-brand-blue transition-colors" />
          <input 
            v-model="filterDate"
            type="date" 
            class="bg-black/40 border border-gray-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-brand-blue transition-all"
          />
        </div>
        <button @click="searchQuery = ''; filterDate = ''" class="text-xs text-gray-500 hover:text-white transition-colors">重置</button>
      </div>

      <button 
        v-else 
        @click="openAddModal"
        class="flex items-center space-x-2 px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all shadow-lg"
      >
        <Plus class="w-4 h-4" />
        <span>新增商品</span>
      </button>
    </div>

    <!-- 实时呼叫表格 -->
    <div v-if="activeTab === 'calls'" class="bg-dark-card border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
      <table class="w-full text-left text-gray-300">
        <thead class="bg-black/50 text-gray-500 text-xs uppercase tracking-wider">
          <tr>
            <th class="px-6 py-4">呼叫时间</th>
            <th class="px-6 py-4">房间号</th>
            <th class="px-6 py-4">请求内容</th>
            <th class="px-6 py-4">当前状态</th>
            <th class="px-6 py-4 text-right">操作管理</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-800">
          <tr v-for="call in filteredCalls" :key="call.id" class="hover:bg-white/5 transition-colors">
            <td class="px-6 py-4 text-sm font-mono text-gray-500">{{ formatDateTime(call.created_at) }}</td>
            <td class="px-6 py-4">
              <span class="px-3 py-1 bg-white/10 rounded-lg font-bold text-white border border-white/5">{{ call.room_number }}</span>
            </td>
            <td class="px-6 py-4">
              <span class="px-3 py-1 bg-brand-pink/10 text-brand-pink rounded-full text-xs font-medium border border-brand-pink/20">{{ call.type }}</span>
            </td>
            <td class="px-6 py-4">
              <span v-if="call.status === 'pending'" class="flex items-center text-yellow-500 text-xs font-bold uppercase tracking-wider animate-pulse">
                <span class="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                待处理
              </span>
              <span v-else class="flex items-center text-green-500 text-xs font-bold uppercase tracking-wider opacity-60">
                <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                已完成
              </span>
            </td>
            <td class="px-6 py-4 text-right space-x-4">
              <button 
                v-if="call.status === 'pending'" 
                @click="markAsProcessed(call.id)" 
                class="text-xs font-bold text-white bg-green-600/20 hover:bg-green-600 px-3 py-1.5 rounded-lg transition-all border border-green-600/30"
              >
                完成处理
              </button>
              <button 
                @click="deleteCall(call.id)" 
                class="text-gray-500 hover:text-brand-pink transition-colors"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </td>
          </tr>
          <tr v-if="filteredCalls.length === 0">
            <td colspan="5" class="px-6 py-20 text-center">
              <div class="flex flex-col items-center opacity-20">
                <BellRing class="w-12 h-12 mb-4" />
                <p class="text-sm">没有找到符合条件的记录</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 库存管理表格 -->
    <div v-else class="bg-dark-card border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
      <table class="w-full text-left text-gray-300">
        <thead class="bg-black/50 text-gray-500 text-xs uppercase tracking-wider">
          <tr>
            <th class="px-6 py-4 w-16">图片</th>
            <th class="px-6 py-4">商品名称</th>
            <th class="px-6 py-4">所属分类</th>
            <th class="px-6 py-4">销售单价</th>
            <th class="px-6 py-4">剩余库存</th>
            <th class="px-6 py-4 text-right">管理操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-800">
          <tr v-for="item in products" :key="item.id" class="hover:bg-white/5 transition-colors">
            <td class="px-6 py-4">
              <div v-if="item.image_url" class="w-10 h-10 rounded-lg overflow-hidden bg-black/50 border border-white/5">
                <img :src="`${API_BASE_URL}${item.image_url}`" class="w-full h-full object-cover" />
              </div>
              <div v-else class="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-500 text-[10px] uppercase font-bold">
                No Img
              </div>
            </td>
            <td class="px-6 py-4 font-bold text-white">{{ item.name }}</td>
            <td class="px-6 py-4 text-sm text-gray-400">{{ item.category }}</td>
            <td class="px-6 py-4 text-sm font-bold text-white">¥{{ item.price.toFixed(2) }}</td>
            <td class="px-6 py-4">
              <span v-if="item.stock <= 0" class="px-2 py-0.5 bg-brand-pink/20 text-brand-pink text-[10px] font-bold rounded border border-brand-pink/30 uppercase">
                已售罄
              </span>
              <span v-else :class="item.stock < 10 ? 'text-brand-pink font-bold' : 'text-gray-400'" class="text-sm">
                {{ item.stock }}
              </span>
            </td>
            <td class="px-6 py-4 text-right space-x-6">
              <button @click="openEditModal(item)" class="text-gray-500 hover:text-white transition-colors">
                <Pencil class="w-4 h-4" />
              </button>
              <button @click="deleteProduct(item.id)" class="text-gray-500 hover:text-brand-pink transition-colors">
                <Trash2 class="w-4 h-4" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 编辑/新增 弹窗 -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div class="bg-dark-card border border-gray-800 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl">
        <div class="p-6 border-b border-gray-800 flex justify-between items-center">
          <h3 class="text-xl font-bold text-white tracking-tight">{{ modalType === 'add' ? '新增商品' : '修改商品' }}</h3>
          <button @click="showModal = false" class="text-gray-500 hover:text-white transition-colors">
            <X class="w-6 h-6" />
          </button>
        </div>
        
        <div class="p-8 space-y-6">
          <div class="grid grid-cols-2 gap-6">
            <div class="col-span-2">
              <label class="block text-xs text-gray-500 uppercase tracking-widest mb-3 font-bold">商品图片展示</label>
              <div class="flex items-center space-x-6">
                <div v-if="currentProduct.image_url" class="w-20 h-20 rounded-2xl overflow-hidden border border-gray-800 bg-black/40 shadow-inner">
                  <img :src="`${API_BASE_URL}${currentProduct.image_url}`" class="w-full h-full object-cover" />
                </div>
                <div v-else class="w-20 h-20 rounded-2xl border border-gray-800 bg-black/40 flex items-center justify-center text-gray-600 text-xs font-bold uppercase shrink-0">
                  None
                </div>
                <div class="flex-1">
                  <input 
                    type="file" 
                    accept="image/*" 
                    @change="handleImageUpload" 
                    class="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:uppercase file:bg-white file:text-black hover:file:bg-gray-200 transition-all cursor-pointer" 
                    :disabled="isUploading" 
                  />
                  <p v-if="isUploading" class="text-[10px] text-brand-pink mt-2 font-bold animate-pulse uppercase">Uploading...</p>
                </div>
              </div>
            </div>
            <div class="col-span-2">
              <label class="block text-xs text-gray-500 uppercase tracking-widest mb-3 font-bold">商品全名</label>
              <input v-model="currentProduct.name" type="text" class="w-full bg-black/40 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-brand-blue outline-none transition-colors" />
            </div>
            <div>
              <label class="block text-xs text-gray-500 uppercase tracking-widest mb-3 font-bold">商品分类</label>
              <select v-model="currentProduct.category" class="w-full bg-black/40 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-brand-blue outline-none appearance-none cursor-pointer">
                <option value="饮料">饮料</option>
                <option value="零食">零食</option>
                <option value="外设">外设</option>
                <option value="洗漱">洗漱</option>
              </select>
            </div>
            <div>
              <label class="block text-xs text-gray-500 uppercase tracking-widest mb-3 font-bold">单价 (¥)</label>
              <input v-model.number="currentProduct.price" type="number" step="0.1" class="w-full bg-black/40 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-brand-blue outline-none transition-colors" />
            </div>
            <div>
              <label class="block text-xs text-gray-500 uppercase tracking-widest mb-3 font-bold">当前库存</label>
              <input v-model.number="currentProduct.stock" type="number" class="w-full bg-black/40 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-brand-blue outline-none transition-colors" />
            </div>
          </div>
        </div>

        <div class="p-6 bg-black/20 border-t border-gray-800 flex justify-end space-x-4">
          <button @click="showModal = false" class="px-6 py-2 text-gray-400 hover:text-white transition-colors font-medium">取消</button>
          <button @click="handleSaveProduct" class="px-8 py-2 bg-white text-black rounded-xl hover:bg-gray-200 transition-all font-bold">
            保存更改
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
