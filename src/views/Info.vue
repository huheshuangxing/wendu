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
        <ul class="space-y-6 text-gray-400 text-base">
          <li class="flex items-start">
            <div class="w-1.5 h-1.5 rounded-full bg-brand-pink mt-2 mr-4 shrink-0 shadow-[0_0_8px_rgba(255,107,157,0.8)]"></div>
            <div>
              <p class="text-white font-medium mb-1">入住时间</p>
              <p class="text-sm">每日 <span class="text-white">14:00</span> 以后即可办理入住。</p>
            </div>
          </li>
          <li class="flex items-start">
            <div class="w-1.5 h-1.5 rounded-full bg-brand-pink mt-2 mr-4 shrink-0 shadow-[0_0_8px_rgba(255,107,157,0.8)]"></div>
            <div>
              <p class="text-white font-medium mb-1">退房时间</p>
              <p class="text-sm">请于每日 <span class="text-white">14:00</span> 前办理退房，超时将酌情加收费用。</p>
            </div>
          </li>
          <li class="flex items-start">
            <div class="w-1.5 h-1.5 rounded-full bg-brand-pink mt-2 mr-4 shrink-0 shadow-[0_0_8px_rgba(255,107,157,0.8)]"></div>
            <div>
              <p class="text-white font-medium mb-1">续住申请</p>
              <p class="text-sm">如需续住，请提前联系前台或通过桌面计费系统申请。</p>
            </div>
          </li>
          <li class="flex items-start">
            <div class="w-1.5 h-1.5 rounded-full bg-brand-pink mt-2 mr-4 shrink-0 shadow-[0_0_8px_rgba(255,107,157,0.8)]"></div>
            <div>
              <p class="text-white font-medium mb-1">设备维护</p>
              <p class="text-sm">请爱护客房电竞设备，如有人为损坏需按价赔偿。</p>
            </div>
          </li>
        </ul>
      </div>

      <!-- 增值服务卡片 -->
      <div class="bg-[#161618] border border-white/5 rounded-[2rem] p-8 hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-white/5">
        <div class="flex items-center space-x-4 mb-8">
          <div class="bg-white/10 p-3 rounded-xl">
            <Gamepad2 class="w-8 h-8 text-white" />
          </div>
          <h3 class="text-2xl font-bold text-white tracking-tight">电竞特权</h3>
        </div>
        <ul class="space-y-6 text-gray-400 text-base">
          <li class="flex items-start">
            <div class="w-1.5 h-1.5 rounded-full bg-brand-blue mt-2 mr-4 shrink-0 shadow-[0_0_8px_rgba(0,210,255,0.8)]"></div>
            <div>
              <p class="text-white font-medium mb-1">金牌网吧特权</p>
              <p class="text-sm">支持英雄联盟、绝地求生等主流游戏全英雄/皮肤特权。</p>
            </div>
          </li>
          <li class="flex items-start">
            <div class="w-1.5 h-1.5 rounded-full bg-brand-blue mt-2 mr-4 shrink-0 shadow-[0_0_8px_rgba(0,210,255,0.8)]"></div>
            <div>
              <p class="text-white font-medium mb-1">海量库内容</p>
              <p class="text-sm">内置 1000+ 款热门单机与网络游戏，极速下载，即点即玩。</p>
            </div>
          </li>
          <li class="flex items-start">
            <div class="w-1.5 h-1.5 rounded-full bg-brand-blue mt-2 mr-4 shrink-0 shadow-[0_0_8px_rgba(0,210,255,0.8)]"></div>
            <div>
              <p class="text-white font-medium mb-1">温馨提示</p>
              <p class="text-sm">为保障账号安全，本店暂不提供任何代练或陪玩相关中介服务。</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>