<script setup lang="ts">
import { RouterView, RouterLink, useRoute } from 'vue-router'
import { Coffee, Mouse, BellRing, Info, ShoppingCart } from 'lucide-vue-next'
import { useCartStore } from './stores/cart'
import CartDrawer from './components/CartDrawer.vue'
import InteractiveBackground from './components/InteractiveBackground.vue'
import { ref, watch } from 'vue'

const route = useRoute()
const cart = useCartStore()

const roomNumber = ref('未知包厢')

// 监听路由变化以更新房间号
watch(() => route.query.room, (newRoom) => {
  if (newRoom) {
    roomNumber.value = `ROOM ${newRoom}`
  } else {
    roomNumber.value = '未知包厢'
  }
}, { immediate: true })

const navItems = [
  { path: '/drinks', name: '饮品零食', icon: Coffee },
  { path: '/equipments', name: '外设租赁', icon: Mouse },
  { path: '/service', name: '呼叫服务', icon: BellRing },
  { path: '/info', name: '酒店信息', icon: Info },
]
</script>

<template>
  <div class="h-screen w-screen overflow-hidden bg-black text-dark-text font-sans relative selection:bg-brand-pink/30">
    <!-- Global Interactive Background -->
    <InteractiveBackground />

    <header v-if="route.path !== '/login'" class="fixed top-0 left-0 right-0 z-40 px-6 py-2 flex items-center justify-between bg-black/50 backdrop-blur-2xl border-b border-white/5 saturate-150">
      <div class="flex items-center space-x-4">
        <RouterLink :to="{ path: '/', query: route.query }" class="flex items-center py-1">
          <img src="/wendulogo.jpg" alt="温渡" class="h-14 md:h-16 w-auto object-contain hover:opacity-80 transition-opacity" />
        </RouterLink>
        <div class="px-2.5 py-1 rounded-full bg-white/10 text-[10px] font-bold tracking-widest text-gray-300 backdrop-blur-md border border-white/5 uppercase">
          {{ roomNumber }}
        </div>
      </div>

      <nav class="hidden md:flex items-center space-x-2 bg-white/5 p-1 rounded-full border border-white/5 backdrop-blur-md">
        <RouterLink 
          v-for="item in navItems" 
          :key="item.path" 
          :to="{ path: item.path, query: route.query }"
          class="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 relative group flex items-center space-x-2"
          :class="[route.path === item.path || (item.path === '/drinks' && route.path === '/') ? 'text-white' : 'text-gray-400 hover:text-white']"
        >
          <component :is="item.icon" class="w-4 h-4 relative z-10" :class="route.path === item.path || (item.path === '/drinks' && route.path === '/') ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'" />
          <span class="relative z-10">{{ item.name }}</span>
        </RouterLink>
      </nav>

      <div class="flex items-center">
        <button 
          v-if="route.path === '/' || route.path === '/drinks' || route.path === '/equipments'" 
          @click="cart.toggleCart()"
          class="relative p-3 rounded-full hover:bg-white/10 transition-all duration-300 group border border-transparent hover:border-white/10 cursor-pointer active:scale-95"
        >
          <ShoppingCart class="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
          <span v-if="cart.totalItems > 0" class="absolute top-0 right-0 bg-white text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center transform scale-100 group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            {{ cart.totalItems }}
          </span>
        </button>
      </div>
    </header>

    <nav v-if="route.path !== '/login'" class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-black/60 backdrop-blur-xl border-t border-white/10 flex justify-around p-4 pb-safe">
       <RouterLink 
          v-for="item in navItems" 
          :key="item.path" 
          :to="{ path: item.path, query: route.query }"
          class="flex flex-col items-center space-y-1"
          :class="route.path === item.path || (item.path === '/drinks' && route.path === '/') ? 'text-white' : 'text-gray-500'"
        >
          <component :is="item.icon" class="w-6 h-6" />
          <span class="text-[10px]">{{ item.name }}</span>
        </RouterLink>
    </nav>

    <main class="h-full relative z-10 overflow-y-auto scroll-smooth" :class="{ 'pt-24 pb-20 md:pb-0': route.path !== '/login' }">
      <div :class="route.path === '/login' ? 'w-full' : 'max-w-6xl mx-auto p-6 md:p-10'">
        <RouterView v-slot="{ Component }">
          <transition name="apple-fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </RouterView>
      </div>
    </main>

    <CartDrawer />
  </div>
</template>

<style scoped>
.apple-fade-enter-active,
.apple-fade-leave-active {
  transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1), transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

.apple-fade-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.98);
}

.apple-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.98);
}

.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>