import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref<any[]>([])
  const isCartOpen = ref(false)

  const totalItems = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })

  const totalPrice = computed(() => {
    return items.value.reduce((total, item) => total + item.price * item.quantity, 0)
  })

  function addToCart(product: any) {
    if (product.stock !== undefined && product.stock <= 0) {
      alert('该商品已售罄/已租赁')
      return
    }
    const existingItem = items.value.find(item => item.id === product.id)
    if (existingItem) {
      existingItem.quantity++
    } else {
      items.value.push({ ...product, quantity: 1 })
    }
  }

  function removeFromCart(productId: string | number) {
    const index = items.value.findIndex(item => item.id === productId)
    if (index > -1) {
      items.value.splice(index, 1)
    }
  }

  function clearCart() {
    items.value = []
  }

  function toggleCart() {
    isCartOpen.value = !isCartOpen.value
  }

  return {
    items,
    isCartOpen,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    clearCart,
    toggleCart
  }
})