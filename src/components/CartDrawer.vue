<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useCartStore } from '../stores/cart'
import { X, QrCode, CreditCard, CheckCircle, ShoppingCart } from 'lucide-vue-next'
import { io, Socket } from 'socket.io-client'
import { SOCKET_URL, API_BASE_URL } from '../config'
import { useRoute } from 'vue-router'

const cart = useCartStore()
const route = useRoute()

const paymentState = ref<'none' | 'qr' | 'room' | 'success'>('none')
const roomNumber = ref('未知')
const socket = ref<Socket | null>(null)

// 自动从网址获取 room 参数
watch(() => route.query.room, (newRoom) => {
  roomNumber.value = (newRoom as string) || '未知'
}, { immediate: true })

onMounted(() => {
  socket.value = io(SOCKET_URL)
})

onUnmounted(() => {
  if (socket.value) socket.value.disconnect()
})

const startQRPay = () => {
  paymentState.value = 'qr'
}

const startRoomPay = () => {
  paymentState.value = 'room'
}

const confirmPayment = async () => {
  if (cart.items.length === 0) return

  try {
    // 1. 调用后端接口更新库存
    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cart.items.map(item => ({ id: item.id, quantity: item.quantity }))
      })
    })

    const result = await response.json()
    if (!response.ok) {
      alert(result.error || '下单失败')
      paymentState.value = 'none'
      return
    }

    // 2. 发送 Socket 实时呼叫通知管理员
    if (socket.value) {
      const itemsDetails = cart.items.map(item => `${item.name} x${item.quantity}`).join(', ')
      const hasEquipment = cart.items.some(item => item.category === '外设' || item.unit === '小时')
      const actionType = hasEquipment ? '租赁/购买' : '购买'
      
      socket.value.emit('guest-call', {
        room_number: roomNumber.value,
        type: `${actionType}: ${itemsDetails}`
      })
    }

    // 3. 进入成功状态
    paymentState.value = 'success'
    setTimeout(() => {
      cart.clearCart()
      paymentState.value = 'none'
      cart.isCartOpen = false
      // 触发页面数据刷新（可选，如果需要立即看到库存变化）
      window.location.reload() 
    }, 2000)

  } catch (err) {
    console.error('支付确认过程出错:', err)
    alert('网络错误，请稍后再试')
  }
}
</script>

<template>
  <div>
    <!-- 遮罩层 -->
    <div 
      v-if="cart.isCartOpen" 
      class="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity"
      @click="cart.isCartOpen = false"
    ></div>

    <!-- 购物车抽屉 -->
    <div 
      class="fixed top-0 right-0 w-full sm:w-96 h-full bg-dark-bg border-l border-gray-900 z-50 transform transition-transform duration-500 ease-in-out flex flex-col"
      :class="cart.isCartOpen ? 'translate-x-0' : 'translate-x-full'"
    >
      <!-- 头部 -->
      <div class="h-24 border-b border-gray-900 flex items-center justify-between px-8 bg-dark-bg">
        <h2 class="text-lg font-light tracking-widest text-white flex items-center">
          购物车
          <span class="ml-2 w-1.5 h-1.5 bg-brand-pink rounded-full"></span>
        </h2>
        <button @click="cart.isCartOpen = false" class="text-gray-500 hover:text-brand-pink transition-colors">
          <X class="w-5 h-5 stroke-[1.5]" />
        </button>
      </div>

      <!-- 商品列表区 -->
      <div class="flex-1 overflow-y-auto p-8 space-y-6">
        <div v-if="cart.items.length === 0" class="h-full flex flex-col items-center justify-center text-gray-600 space-y-4">
          <ShoppingCart class="w-12 h-12 opacity-50 stroke-[1]" />
          <p class="text-sm tracking-wide">购物车空空如也</p>
        </div>

        <div 
          v-for="item in cart.items" 
          :key="item.id"
          class="flex items-center space-x-6 pb-6 border-b border-gray-900/50 last:border-0"
        >
          <div class="w-16 h-16 rounded-xl overflow-hidden bg-gray-900">
            <img :src="item.image" class="w-full h-full object-cover opacity-80" />
          </div>
          <div class="flex-1">
            <h4 class="text-white font-medium text-sm tracking-wide line-clamp-1 mb-1">{{ item.name }}</h4>
            <div class="text-gray-400 text-xs">¥ {{ item.price }}</div>
          </div>
          <div class="flex items-center space-x-3 bg-dark-card rounded-lg p-1 border border-gray-800">
            <button @click="item.quantity > 1 ? item.quantity-- : cart.removeFromCart(item.id)" class="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:text-white transition-colors">-</button>
            <span class="w-4 text-center text-xs font-medium text-white">{{ item.quantity }}</span>
            <button @click="item.quantity++" class="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:text-white transition-colors">+</button>
          </div>
        </div>
      </div>

      <!-- 底部结算区 -->
      <div class="p-8 border-t border-gray-900 bg-dark-bg" v-if="cart.items.length > 0">
        <div class="flex justify-between items-end mb-8">
          <span class="text-xs text-gray-500 tracking-widest uppercase">总计</span>
          <span class="text-white font-light text-2xl tracking-wide">¥ {{ cart.totalPrice }}</span>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <button 
            @click="startQRPay"
            class="py-4 rounded-xl bg-transparent border border-gray-800 text-gray-400 text-xs tracking-widest flex flex-col items-center justify-center hover:border-white hover:text-white transition-all duration-500"
          >
            <QrCode class="w-5 h-5 mb-2 stroke-[1.5]" />
            <span>微信 / 支付宝</span>
          </button>
          <button 
            @click="startRoomPay"
            class="py-4 rounded-xl bg-brand-pink/10 border border-brand-pink/20 text-brand-pink text-xs tracking-widest flex flex-col items-center justify-center hover:bg-brand-pink hover:text-white transition-all duration-500"
          >
            <CreditCard class="w-5 h-5 mb-2 stroke-[1.5]" />
            <span>挂账到房间</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 支付弹窗区 -->
    <div v-if="paymentState !== 'none'" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md px-4">
      <div class="bg-dark-bg border border-gray-900 rounded-2xl w-full max-w-sm p-10 text-center shadow-2xl relative overflow-hidden">
        
        <button @click="paymentState = 'none'" class="absolute top-6 right-6 text-gray-600 hover:text-white transition-colors">
          <X class="w-5 h-5 stroke-[1.5]" />
        </button>

        <div v-if="paymentState === 'qr'" class="space-y-6">
          <h3 class="text-lg font-light tracking-widest text-white">扫码支付</h3>
          <div class="bg-white p-4 rounded-2xl inline-block mx-auto">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=WenduPay" class="w-48 h-48" />
          </div>
          <p class="text-gray-500 text-xs tracking-wide">请使用微信或支付宝扫描二维码</p>
          <div class="pt-6">
            <button @click="confirmPayment" class="w-full py-4 bg-transparent border border-gray-800 text-gray-300 text-xs tracking-widest rounded-xl hover:border-white hover:text-white transition-all duration-500">
              模拟：已完成支付
            </button>
          </div>
        </div>

        <div v-if="paymentState === 'room'" class="space-y-8">
          <h3 class="text-lg font-light tracking-widest text-white">挂账到房间</h3>
          <div class="bg-dark-card py-8 rounded-2xl border border-gray-800">
            <div class="text-gray-600 text-xs tracking-widest uppercase mb-3">房间号</div>
            <div class="text-4xl text-white font-light tracking-widest">{{ roomNumber }}</div>
          </div>
          <p class="text-gray-500 text-xs tracking-wide leading-relaxed">
            总计 <span class="text-white">¥{{ cart.totalPrice }}</span> 将计入您的房费。
          </p>
          <button @click="confirmPayment" class="w-full py-4 bg-brand-pink text-white text-xs tracking-widest font-medium rounded-xl hover:bg-brand-pink/90 transition-all duration-500">
            确认挂账
          </button>
        </div>

        <div v-if="paymentState === 'success'" class="space-y-6 py-10">
          <CheckCircle class="w-16 h-16 text-brand-pink mx-auto stroke-[1]" />
          <h3 class="text-xl font-light tracking-widest text-white">支付成功</h3>
          <p class="text-gray-500 text-xs tracking-wide">订单已提交，将很快送达</p>
        </div>

      </div>
    </div>
  </div>
</template>