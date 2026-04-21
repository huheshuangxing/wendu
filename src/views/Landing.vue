<template>
  <div class="relative min-h-screen flex flex-col items-center justify-center px-6">
    <!-- Content Layer -->
    <div class="relative z-10 w-full max-w-5xl flex flex-col items-center text-center space-y-12">
      <!-- Title Section -->
      <div class="space-y-4">
        <h1 class="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white">
          Design at the speed of AI
        </h1>
        <p class="text-lg md:text-xl text-gray-400 font-medium max-w-2xl mx-auto">
          Experience the future of creativity with our intelligent design engine.
        </p>
      </div>

      <!-- Glassmorphism Prompt Input -->
      <div class="w-full max-w-3xl transform transition-all duration-500 hover:scale-[1.01]">
        <div class="relative group">
          <!-- Glow effect behind input -->
          <div class="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-magenta-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
          
          <div class="relative flex items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 px-4 shadow-2xl">
            <!-- Left Icon (Plus) -->
            <button class="p-2.5 rounded-xl hover:bg-white/10 text-gray-400 transition-colors">
              <Plus class="w-5 h-5" />
            </button>

            <!-- Input Field -->
            <input 
              type="text" 
              placeholder="Describe your design vision..." 
              class="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 px-4 py-3 text-lg outline-none"
            />

            <!-- Right Icons -->
            <div class="flex items-center space-x-1">
              <button class="p-2.5 rounded-xl hover:bg-white/10 text-gray-400 transition-colors">
                <Mic class="w-5 h-5" />
              </button>
              <button class="ml-2 bg-white text-black p-2.5 rounded-xl hover:bg-gray-200 transition-transform active:scale-95 shadow-lg">
                <ArrowUpRight class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        <!-- Quick Suggestions -->
        <div class="mt-6 flex flex-wrap justify-center gap-2 opacity-60">
          <span class="text-xs text-gray-400 uppercase tracking-widest font-bold mr-2 self-center">Try:</span>
          <button v-for="tag in ['Cyberpunk City', 'Minimalist UI', 'Hyper-realistic Portrait']" :key="tag" 
            class="px-3 py-1 rounded-full border border-white/10 text-xs text-gray-300 hover:bg-white/5 transition-colors">
            {{ tag }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus, Mic, ArrowUpRight } from 'lucide-vue-next';
</script>

<style scoped>
.from-blue-500 { --tw-gradient-from: #00ffff; --tw-gradient-to: rgb(0 255 255 / 0); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); }
.to-magenta-500 { --tw-gradient-to: #ec4899; }
</style>
