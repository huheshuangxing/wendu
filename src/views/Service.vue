<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Wrench, Droplets, Wind, PhoneCall } from 'lucide-vue-next'
import { io, Socket } from 'socket.io-client'
import { SOCKET_URL } from '../config'

const services = [
  { id: 's1', name: '呼叫网管', desc: '电脑故障、外设问题', icon: Wrench, color: 'text-white' },
  { id: 's2', name: '呼叫保洁', desc: '清理桌面、打扫卫生', icon: Wind, color: 'text-white' },
  { id: 's3', name: '补充水分', desc: '免费矿泉水补充', icon: Droplets, color: 'text-white' },
  { id: 's4', name: '前台服务', desc: '续房、退房、其他需求', icon: PhoneCall, color: 'text-white' },
]

const socket = ref<Socket | null>(null)

onMounted(() => {
  socket.value = io(SOCKET_URL)
})

onUnmounted(() => {
  if (socket.value) socket.value.disconnect()
})

const callService = (serviceName: string) => {
  if (socket.value) {
    socket.value.emit('guest-call', {
      room_number: '808',
      type: serviceName
    })
    alert(`请求 [${serviceName}] 已发送！\n服务人员已收到请求，正前往您的房间，请稍候。`)
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto pt-10">
    <div class="mb-16 text-center">
      <h2 class="text-4xl font-extrabold text-white mb-4 tracking-tight">一键呼叫服务</h2>
      <p class="text-xl text-gray-400 font-light">只需轻点，即刻响应您的所有需求。</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <button 
        v-for="item in services" 
        :key="item.id"
        @click="callService(item.name)"
        class="relative overflow-hidden bg-[#161618] border border-white/5 rounded-[2rem] p-8 text-left transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-white/5 hover:border-white/20 group cursor-pointer active:scale-95"
      >
        <div class="flex flex-col items-center text-center space-y-6">
          <div class="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center shrink-0 transition-all duration-500 group-hover:bg-white/10 group-hover:scale-110">
            <component :is="item.icon" class="w-10 h-10 text-white" />
          </div>
          <div>
            <h3 class="text-2xl font-bold text-white mb-2 tracking-tight">{{ item.name }}</h3>
            <p class="text-gray-400 text-sm leading-relaxed max-w-[200px] mx-auto">{{ item.desc }}</p>
          </div>
        </div>
      </button>
    </div>
  </div>
</template>