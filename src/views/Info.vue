<script setup lang="ts">
import { Wifi, Clock, Gamepad2 } from 'lucide-vue-next'

const copyWifi = () => {
  navigator.clipboard.writeText('CyberHotel_8888')
  alert('Wi-Fi 密码已复制！')
}
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-10 pb-10 pt-10">
    <div class="mb-12 text-center">
      <h2 class="text-4xl font-extrabold text-white mb-4 tracking-tight">酒店信息指南</h2>
      <p class="text-xl text-gray-400 font-light">尽享沉浸式电竞体验。</p>
    </div>

    <!-- Wi-Fi 信息卡片 -->
    <div class="bg-[#161618] border border-white/10 rounded-[2.5rem] p-10 relative overflow-hidden group hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-white/5">
      <div class="flex items-center space-x-6 mb-8 relative z-10">
        <div class="bg-white/10 p-4 rounded-2xl backdrop-blur-md">
          <Wifi class="w-10 h-10 text-white" />
        </div>
        <div>
          <h3 class="text-3xl font-bold text-white tracking-tight">温渡电竞 Wi-Fi</h3>
          <p class="text-gray-400 text-base mt-2">千兆上下行，不限速，畅快联机无延迟</p>
        </div>
      </div>
      
      <div class="bg-black/50 rounded-3xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between border border-white/5 relative z-10 gap-6">
        <div class="space-y-4">
          <div>
            <div class="text-sm text-gray-500 mb-1 font-medium tracking-wide">Wi-Fi 账号</div>
            <div class="text-xl text-white font-mono bg-white/5 px-3 py-1 rounded-lg inline-block border border-white/10">CyberHotel_8888_5G</div>
          </div>
          <div>
            <div class="text-sm text-gray-500 mb-1 font-medium tracking-wide">Wi-Fi 密码</div>
            <div class="text-2xl text-white font-mono font-bold tracking-wider bg-white/5 px-3 py-1 rounded-lg inline-block border border-white/10">CyberHotel_8888</div>
          </div>
        </div>
        <button 
          @click="copyWifi"
          class="w-full md:w-auto px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition-all duration-300 active:scale-95 shadow-lg text-lg"
        >
          一键复制密码
        </button>
      </div>
      <!-- 装饰背景 -->
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-1000"></div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- 规章制度卡片 -->
      <div class="bg-[#161618] border border-white/5 rounded-[2rem] p-8 hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-white/5">
        <div class="flex items-center space-x-4 mb-8">
          <div class="bg-white/10 p-3 rounded-xl">
            <Clock class="w-8 h-8 text-white" />
          </div>
          <h3 class="text-2xl font-bold text-white tracking-tight">入住与退房</h3>
        </div>
        <ul class="space-y-5 text-gray-400 text-base">
          <li class="flex items-start"><div class="w-1.5 h-1.5 rounded-full bg-white mt-2 mr-4 shrink-0 shadow-[0_0_5px_white]"></div>退房时间为每日 <strong class="text-white mx-1">14:00</strong> 前，超时将加收半天房费。</li>
          <li class="flex items-start"><div class="w-1.5 h-1.5 rounded-full bg-white mt-2 mr-4 shrink-0 shadow-[0_0_5px_white]"></div>如需续住，请提前联系前台或在桌面计费系统中操作。</li>
          <li class="flex items-start"><div class="w-1.5 h-1.5 rounded-full bg-white mt-2 mr-4 shrink-0 shadow-[0_0_5px_white]"></div>房内设备如有人为损坏，需照价赔偿。</li>
        </ul>
      </div>

      <!-- 增值服务卡片 -->
      <div class="bg-[#161618] border border-white/5 rounded-[2rem] p-8 hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-white/5">
        <div class="flex items-center space-x-4 mb-8">
          <div class="bg-white/10 p-3 rounded-xl">
            <Gamepad2 class="w-8 h-8 text-white" />
          </div>
          <h3 class="text-2xl font-bold text-white tracking-tight">电竞特权与增值</h3>
        </div>
        <ul class="space-y-5 text-gray-400 text-base">
          <li class="flex items-start"><div class="w-1.5 h-1.5 rounded-full bg-white mt-2 mr-4 shrink-0 shadow-[0_0_5px_white]"></div>本店提供绝地求生、英雄联盟等主流网吧特权。</li>
          <li class="flex items-start"><div class="w-1.5 h-1.5 rounded-full bg-white mt-2 mr-4 shrink-0 shadow-[0_0_5px_white]"></div>内置多款游戏加速器（UU、雷神等），免费使用。</li>
          <li class="flex items-start"><div class="w-1.5 h-1.5 rounded-full bg-white mt-2 mr-4 shrink-0 shadow-[0_0_5px_white]"></div>如需代练、陪玩服务，请联系前台获取官方推荐平台。</li>
        </ul>
      </div>
    </div>
  </div>
</template>