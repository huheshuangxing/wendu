<template>
  <div class="fixed inset-0 z-0 overflow-hidden bg-black">
    <!-- Layer 1: Interactive Dot Grid Canvas -->
    <canvas ref="canvasRef" class="absolute inset-0 block"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const canvasRef = ref<HTMLCanvasElement | null>(null);
let animationFrameId: number;

const mouse = { x: -1000, y: -1000 };
const dots: { x: number; y: number; originX: number; originY: number }[] = [];
const spacing = 15;
const influenceRadius = 244;
const repulsionStrength = 30; 
const flowStrength = 8; // Maximum pixel offset for flowing movement

const initDots = (width: number, height: number) => {
  dots.length = 0;
  for (let x = spacing / 2; x < width; x += spacing) {
    for (let y = spacing / 2; y < height; y += spacing) {
      dots.push({ x, y, originX: x, originY: y });
    }
  }
};

const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  ctx.clearRect(0, 0, width, height);
  const time = performance.now() * 0.0015; // Slow time factor

  dots.forEach(dot => {
    const dx = mouse.x - dot.originX;
    const dy = mouse.y - dot.originY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    let targetX = dot.originX;
    let targetY = dot.originY;
    let fillStyle = 'rgba(100, 100, 100, 0.2)';
    let radius = 1;

    if (distance < influenceRadius) {
      const ratio = 1 - distance / influenceRadius;

      // 1. Repulsion logic
      const angle = Math.atan2(dy, dx);
      targetX = dot.originX - Math.cos(angle) * ratio * repulsionStrength;
      targetY = dot.originY - Math.sin(angle) * ratio * repulsionStrength;

      // 2. Irregular Flow logic (Fluid-like undulating movement)
      // We use overlapping sine waves based on time and position to create "pseudo-noise"
      const flowX = Math.sin(time + dot.originX * 0.02) * 4 + Math.sin(time * 0.7 + dot.originY * 0.015) * 4;
      const flowY = Math.cos(time * 0.8 + dot.originY * 0.02) * 4 + Math.cos(time * 1.1 + dot.originX * 0.015) * 4;

      targetX += flowX * ratio;
      targetY += flowY * ratio;

      // 3. Style & Color
      const r = Math.floor(100 + ratio * 155);
      const g = Math.floor(100 + ratio * 50);
      const b = Math.floor(100 + ratio * 255);
      fillStyle = `rgba(${r}, ${g}, ${b}, ${0.2 + ratio * 0.6})`;
      radius = 1 + ratio * 1.5;
    }

    // Smooth return and movement
    dot.x += (targetX - dot.x) * 0.12;
    dot.y += (targetY - dot.y) * 0.12;

    ctx.beginPath();
    ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = fillStyle;
    ctx.fill();
  });
  
  animationFrameId = requestAnimationFrame(() => draw(ctx, width, height));
};

const handleResize = () => {
  if (!canvasRef.value) return;
  const canvas = canvasRef.value;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initDots(canvas.width, canvas.height);
};

const handleMouseMove = (e: MouseEvent) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
};

onMounted(() => {
  if (!canvasRef.value) return;
  const canvas = canvasRef.value;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  handleResize();
  window.addEventListener('resize', handleResize);
  window.addEventListener('mousemove', handleMouseMove);
  
  draw(ctx, canvas.width, canvas.height);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('mousemove', handleMouseMove);
  cancelAnimationFrame(animationFrameId);
});
</script>

<style scoped>
/* No additional styles needed for Canvas background */
</style>
