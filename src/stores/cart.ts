import { defineStore } from 'pinia'

export type CartProduct = {
  id: number
  title: string
  price: number
  discountPercentage?: number
  quantity: number
  thumbnail: string
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    products: [] as CartProduct[],
  }),

  getters: {
    total: (s) => s.products.reduce((sum, p) => sum + p.price * p.quantity, 0),

    discountedTotal: (s) =>
      s.products.reduce((sum, p) => {
        const discount = p.discountPercentage ?? 0
        const discounted = p.price * (1 - discount / 100)
        return sum + discounted * p.quantity
      }, 0),

    totalProducts: (s) => s.products.length,
    totalQuantity: (s) => s.products.reduce((sum, p) => sum + p.quantity, 0),
  },

  actions: {
    add(product: Omit<CartProduct, 'quantity'>, qty = 1) {
      const existing = this.products.find((p) => p.id === product.id)
      if (existing) {
        existing.quantity += qty
      } else {
        this.products.push({ ...product, quantity: qty })
      }
    },

    updateQuantity(productId: number, qty: number) {
      const item = this.products.find((p) => p.id === productId)
      if (item) item.quantity = qty
    },

    remove(productId: number) {
      this.products = this.products.filter((p) => p.id !== productId)
    },

    clear() {
      this.products = []
    },
  },

  persist: true,
})
