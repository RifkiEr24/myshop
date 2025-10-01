<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { toast } from 'vue-sonner'
import { Trash2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import Badge from '@/components/ui/badge/Badge.vue'
import NumberField from '@/components/ui/number-field/NumberField.vue'
import NumberFieldContent from '@/components/ui/number-field/NumberFieldContent.vue'
import NumberFieldDecrement from '@/components/ui/number-field/NumberFieldDecrement.vue'
import NumberFieldInput from '@/components/ui/number-field/NumberFieldInput.vue'
import NumberFieldIncrement from '@/components/ui/number-field/NumberFieldIncrement.vue'
import { formatCurrency } from '@/lib/FormatCurrency'

const router = useRouter()
const cart = useCartStore()
const updateQty = (id: number, qty: number) => {
    const q = Math.max(1, Math.min(99, Number(qty) || 1))
    cart.updateQuantity(id, q)
    const item = cart.products.find((p: any) => p.id === id)
    toast.success('Quantity updated', { description: `"${item?.title || id}" set to ${q}` })
}

const remove = (id: number) => {
    const item = cart.products.find((p: any) => p.id === id)
    cart.remove(id)
    toast.error('Removed from cart', { description: `"${item?.title || id}" removed` })
}

const clearAll = () => {
    if (cart.totalQuantity === 0) return
    cart.clear()
    toast('Cart cleared', { description: 'All items removed' })
}

const checkout = () => {
    router.push({ name: 'coming-soon' })
}

</script>



<template>
  <div class="mx-auto max-w-7xl p-6 md:p-8">
    <h1 class="mb-6 text-2xl font-bold">Your Cart</h1>

    <!-- Empty state -->
    <div v-if="cart.totalQuantity === 0" class="flex min-h-[50vh] items-center justify-center">
      <div class="text-center max-w-md">
        <img src="/empty-state.svg" alt="Empty cart" class="mx-auto mb-6 h-44 w-auto opacity-90" />
        <h2 class="text-xl font-semibold">Your cart is empty</h2>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Browse our products and add items to your cart.
        </p>
        <div class="mt-6">
          <Button @click="router.push({ name: 'products' })">Go to Products</Button>
        </div>
      </div>
    </div>

    <!-- Cart content -->
    <div v-else class="grid grid-cols-1 gap-8 lg:grid-cols-12">
      <!-- Items -->
      <section class="lg:col-span-8 space-y-4">
        <div
          v-for="item in cart.products"
          :key="item.id"
          class="flex items-start gap-4 rounded-xl border bg-white p-4 shadow-sm"
        >
          <img
            :src="item.thumbnail"
            :alt="item.title"
            class="h-20 w-20 shrink-0 rounded-lg object-cover"
          />

          <div class="min-w-0 flex-1">
            <router-link
              :to="{ name: 'product-detail', params: { id: item.id } }"
              class="line-clamp-2 text-sm font-semibold hover:underline"
              >{{ item.title }}</router-link
            >
            <p class="mt-1 text-xs text-gray-500">
              Unit price:
              <span class="font-medium">{{ formatCurrency(item.price) }}</span>
            </p>

            <!-- Quantity / Total / Actions -->
            <div class="mt-3 flex flex-wrap items-center gap-3">
              <!-- Quantity -->
              <div class="w-36">
                <label class="mb-1 block text-[11px] text-gray-500">Qty</label>
                <NumberField
                  :modelValue="item.quantity"
                  :min="1"
                  :max="99"
                  :step="1"
                  @update:modelValue="(v:number) => updateQty(item.id, v)"
                >
                  <NumberFieldContent class="rounded-lg border">
                    <NumberFieldDecrement />
                    <NumberFieldInput class="text-center" />
                    <NumberFieldIncrement />
                  </NumberFieldContent>
                </NumberField>
              </div>

              <!-- Line total -->
              <div class="ml-auto text-right">
                <div class="text-xs text-gray-500">Line total</div>
                <div class="text-base font-semibold">
                  {{ formatCurrency(item.price * item.quantity) }}
                </div>
              </div>

              <!-- Remove -->
              <Button variant="outline" size="sm" @click="remove(item.id)">
                <Trash2 class="mr-1 h-4 w-4" /> Remove
              </Button>
            </div>
          </div>
        </div>

        <div class="flex justify-between">
          <Button variant="outline" @click="clearAll">
            <Trash2 class="mr-1 h-4 w-4" /> Clear Cart
          </Button>
          <Button variant="secondary" @click="router.push({ name: 'products' })">
            Continue Shopping
          </Button>
        </div>
      </section>

      <!-- Summary -->
      <aside class="lg:col-span-4">
        <div class="sticky top-24 rounded-xl border bg-white p-5 shadow-sm">
          <h2 class="mb-3 text-lg font-semibold">Order Summary</h2>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span>Items ({{ cart.totalQuantity }})</span>
              <span>{{ formatCurrency(cart.total) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="flex items-center gap-1">
                Discounts
              </span>
              <span class="text-red-500">-{{ formatCurrency(Math.max(cart.total - cart.discountedTotal, 0)) }}</span>
            </div>
            <div class="border-t pt-2 font-semibold flex justify-between">
              <span>Subtotal</span>
              <span >{{ formatCurrency(cart.discountedTotal) }}</span>
            </div>
          </div>

          <Button class="mt-4 w-full" @click="checkout">
            Proceed to Checkout
          </Button>

          <p class="mt-2 text-[11px] text-gray-500">
            Taxes and shipping will be calculated at checkout.
          </p>
        </div>
      </aside>
    </div>
  </div>
</template>

