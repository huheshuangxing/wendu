<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Wrench } from 'lucide-vue-next'
import { io, Socket } from 'socket.io-client'
import { SOCKET_URL } from '../config'
import { useRoute } from 'vue-router'

const route = useRoute()
const roomNumber = ref((route.query.room as string) || '未知包厢')

const services = [
  { id: 's1', name: '呼叫网管', desc: '遇到任何问题，请点击呼叫，我们将竭诚为您服务', icon: Wrench, color: 'text-white' }
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
      room_number: roomNumber.value,
      type: serviceName
    })
    alert(`请求 [${serviceName}] 已发送！\n服务人员已收到请求，正前往您的房间，请稍候。`)
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto pt-10 px-4">
    <div class="mb-16 text-center">
      <h2 class="text-4xl font-extrabold text-white mb-4 tracking-tight">一键呼叫服务</h2>
      <p class="text-xl text-gray-400 font-light">只需轻点，即刻响应您的所有需求。</p>
    </div>

    <div class="max-w-md mx-auto">
      <button 
        v-for="item in services" 
        :key="item.id"
        @click="callService(item.name)"
        class="w-full relative overflow-hidden bg-[#161618] border border-white/5 rounded-[2rem] p-12 text-center transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-white/5 hover:border-white/20 group cursor-pointer active:scale-95"
      >
        <div class="flex flex-col items-center space-y-8">
          <div class="w-32 h-32 rounded-full bg-white/5 flex items-center justify-center shrink-0 transition-all duration-500 group-hover:bg-white/10 group-hover:scale-110">
            <component :is="item.icon" class="w-16 h-16 text-white" />
          </div>
          <div>
            <h3 class="text-4xl font-bold text-white mb-4 tracking-tight">{{ item.name }}</h3>
            <p class="text-gray-400 text-lg leading-relaxed">{{ item.desc }}</p>
          </div>
        </div>
      </button>
    </div>
  </div>
</template>
