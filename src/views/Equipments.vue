<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCartStore } from '../stores/cart'
import { API_BASE_URL } from '../config'

const cart = useCartStore()
const equipments = ref<any[]>([])

const fetchEquipments = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products`)
    const data = await response.json()
    equipments.value = data
      .filter((item: any) => item.category === '外设')
      .map((item: any) => ({
        ...item,
        unit: '小时',
        deposit: Math.round(item.price * 10),
        image: item.image_url ? `${API_BASE_URL}${item.image_url}` : (item.image || 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&q=80'),
        desc: item.desc || '顶级电竞外设'
      }))
  } catch (err) {
    console.error('获取外设失败:', err)
  }
}

onMounted(() => {
  fetchEquipments()
})
</script>

<template>
  <div class="flex flex-col min-h-full">
    <div class="text-center mb-16">
      <h2 class="text-5xl font-extrabold text-white mb-4 tracking-tight">顶级外设租赁</h2>
      <p class="text-xl text-gray-400 font-light">不将就，用最顶尖的装备打出你的最佳水平。</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-20 max-w-5xl mx-auto">
      <div 
        v-for="item in equipments" 
        :key="item.id"
        class="group relative bg-[#161618] rounded-[2rem] p-8 border border-white/5 flex flex-col md:flex-row gap-8 hover:border-white/20 transition-all duration-500 overflow-hidden"
      >
        <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

        <div class="w-full md:w-48 h-48 bg-black/50 rounded-2xl overflow-hidden shrink-0 flex items-center justify-center p-4">
           <img :src="item.image" :alt="item.name" class="w-full h-full object-contain filter drop-shadow-2xl transition-transform duration-700 ease-out group-hover:scale-110" />
        </div>
        
        <div class="flex flex-col flex-1 z-10">
          <h3 class="text-2xl font-bold text-white mb-2 tracking-tight">{{ item.name }}</h3>
          <p class="text-gray-400 text-base mb-6 leading-relaxed">{{ item.desc }}</p>
          
          <div class="mt-auto grid grid-cols-2 gap-4 mb-6">
            <div>
              <div class="text-xs text-gray-500 mb-1 font-medium">租金</div>
              <div class="text-xl text-white font-bold">¥{{ item.price }}<span class="text-sm text-gray-500 font-normal">/{{ item.unit }}</span></div>
            </div>
            <div>
              <div class="text-xs text-gray-500 mb-1 font-medium">押金</div>
              <div class="text-xl text-white font-bold">¥{{ item.deposit }}</div>
            </div>
          </div>
          
          <button 
            @click="cart.addToCart(item)"
            :disabled="item.stock <= 0"
            class="w-full py-4 rounded-2xl font-bold text-sm tracking-wide transition-all duration-300 active:scale-95 shadow-lg"
            :class="item.stock <= 0 ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-white text-black hover:bg-gray-200'"
          >
            {{ item.stock <= 0 ? '已租赁' : '租用此装备' }}
          </button>
        </div>
      </div>
      
      <div v-if="equipments.length === 0" class="col-span-1 lg:col-span-2 text-center text-gray-500 py-20 text-lg">
        暂无外设可租赁
      </div>
    </div>
  </div>
</template>