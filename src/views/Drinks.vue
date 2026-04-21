<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCartStore } from '../stores/cart'
import { API_BASE_URL } from '../config'

const cart = useCartStore()

const categories = ['全部', '饮料', '零食', '洗漱']
const activeCategory = ref('全部')

const products = ref([])
const loading = ref(true)

const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products`)
    const data = await response.json()
    // 过滤掉外设分类
    products.value = data
      .filter((item: any) => item.category !== '外设')
      .map((item: any) => ({
        ...item,
        image: item.image_url ? `${API_BASE_URL}${item.image_url}` : (item.image || 'https://images.unsplash.com/photo-1544203072-4127e05ae810?w=500&q=80'),
        desc: item.category || '电竞上分必备'
      }))
  } catch (err) {
    console.error('获取商品失败:', err)
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchProducts()
})
</script>

<template>
  <div class="flex flex-col min-h-full">
    <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-white/10 pb-6">
      <div class="mb-6 md:mb-0">
        <h2 class="text-4xl font-bold text-white mb-2 tracking-tight">DRINKS & SNACKS</h2>
        <p class="text-gray-400 text-sm tracking-wide">24小时即点即送，畅快电竞</p>
      </div>

      <div class="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide bg-white/5 p-1 rounded-2xl border border-white/5 backdrop-blur-md">
        <button 
          v-for="cat in categories" 
          :key="cat"
          @click="activeCategory = cat"
          class="text-sm font-medium transition-all duration-300 whitespace-nowrap px-4 py-2 rounded-xl outline-none"
          :class="activeCategory === cat ? 'bg-white text-black shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/10'"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-24">
      <div 
        v-for="item in products.filter(p => activeCategory === '全部' || p.category === activeCategory)" 
        :key="item.id"
        class="group relative flex flex-col bg-[#161618] rounded-3xl p-4 overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-white/5"
      >
        <div class="relative h-48 rounded-2xl overflow-hidden bg-black/50 mb-4 flex-shrink-0">
          <img :src="item.image" :alt="item.name" class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
          <div class="absolute inset-0 bg-gradient-to-t from-[#161618] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="absolute top-3 right-3 bg-black/40 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full font-bold border border-white/10 shadow-lg">
            ¥{{ item.price }}
          </div>
        </div>
        
        <div class="flex flex-col flex-1 justify-between z-10">
          <div>
            <h3 class="text-lg font-semibold text-white mb-1 tracking-tight">{{ item.name }}</h3>
            <p class="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-4">{{ item.desc }}</p>
          </div>
          <button 
            @click="cart.addToCart(item)"
            class="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white hover:text-black transition-all duration-300 active:scale-95"
          >
            加入购物车
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>