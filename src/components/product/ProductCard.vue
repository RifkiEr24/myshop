<script lang="ts" setup>
import type { Product } from '@/services/products'
import { ShieldCheck, Truck } from 'lucide-vue-next'
import { computed } from 'vue'
import Button from '../ui/button/Button.vue'
import Badge from '../ui/badge/Badge.vue'
import { useCartStore } from '@/stores/cart'
import { toast } from 'vue-sonner'  
import { formatCurrency } from '@/lib/FormatCurrency'

const props = defineProps<{
  product: Product
}>()

const cart = useCartStore()

const discountedPrice = computed(() => {
  const pct = props.product.discountPercentage ?? 0
  return pct > 0 ? props.product.price * (1 - pct / 100) : props.product.price
})

const reviewCount = computed(() => props.product.reviews?.length ?? 0)



function handleAddToCart() {
  if (props.product.stock <= 0) return
  cart.add(
    {
      id: props.product.id,
      title: props.product.title,
      price: discountedPrice.value,
      discountPercentage: props.product.discountPercentage,
      thumbnail: props.product.thumbnail,
    },
    1
  )
  toast.success(`Added ${props.product.title} to cart`)

}
</script>

<template>
  <article
    class="group relative flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md"
  >
    <!-- Image -->
    <div class="relative h-44 w-full overflow-hidden bg-gray-50">
      <img
        :src="product.thumbnail"
        :alt="product.title"
        class="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
        loading="lazy"
      />

      <!-- Discount badge -->
      <Badge
        variant="error"
        v-if="product.discountPercentage > 0"
        class="absolute left-2 top-2 px-2 py-0.5 text-xs font-semibold text-white"
      >
        -{{ product.discountPercentage }}%
      </Badge>

      <!-- Availability -->
      <Badge
        :variant="product.availabilityStatus === 'In Stock' ? 'success' : 'error'"
        class="absolute right-2 top-2 px-2 py-0.5 text-[10px] font-medium text-white"
      >
        {{ product.availabilityStatus }}
      </Badge>
    </div>

    <!-- Body -->
    <div class="flex flex-1 flex-col gap-2 p-4">
      <!-- Title & brand -->
      <router-link :to="{ name: 'product-detail', params: { id: product.id } }">
        <h3 class="text-sm font-semibold line-clamp-2 hover:underline">{{ product.title }}</h3>
      </router-link>

      <p class="text-xs text-gray-500">
        <span class="font-medium">{{ product.brand }}</span> · {{ product.category }}
      </p>

      <!-- Rating & reviews -->
      <div class="flex items-center gap-2">
        <div class="flex items-center text-amber-500" aria-label="rating">
          <span v-for="i in 5" :key="i" class="text-sm leading-none">
            {{ i <= Math.round(product.rating) ? '★' : '☆' }}
          </span>
        </div>
        <span class="text-xs text-gray-500">
          {{ product.rating.toFixed(2) }} · {{ reviewCount }} review{{ reviewCount === 1 ? '' : 's' }}
        </span>
      </div>

      <!-- Price -->
      <div class="mt-1">
        <div class="flex items-baseline gap-2">
          <span class="text-lg font-bold text-primary">
            {{ formatCurrency(discountedPrice) }}
          </span>
          <span v-if="product.discountPercentage > 0" class="text-xs text-gray-500 line-through">
            {{ formatCurrency(product.price) }}
          </span>
        </div>
      </div>

      <!-- Stock -->
      <div class="mt-auto flex items-center justify-between pt-1">
        <span
          :class="[
            'rounded-md px-2 py-0.5 text-[11px] font-medium',
            product.stock > 10
              ? 'bg-emerald-50 text-emerald-700'
              : product.stock > 0
              ? 'bg-amber-50 text-amber-700'
              : 'bg-rose-50 text-rose-700',
          ]"
        >
          Stock: {{ product.stock }}
        </span>

        <!-- Tags -->
        <div class="flex gap-1">
          <Badge
            v-for="(tag, idx) in product.tags.slice(0, 2)"
            :key="tag + idx"
            class="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-700"
            variant="outline"
          >
            #{{ tag }}
          </Badge>
        </div>
      </div>

      <!-- Warranty/Shipping -->
      <div class="mt-2 grid grid-cols-2 gap-2 text-[11px] text-gray-600">
        <p class="flex items-center gap-1 truncate" title="Warranty">
          <ShieldCheck class="h-3.5 w-3.5 text-gray-500" />
          {{ product.warrantyInformation }}
        </p>
        <p class="flex items-center gap-1 truncate" title="Shipping">
          <Truck class="h-3.5 w-3.5 text-gray-500" />
          {{ product.shippingInformation }}
        </p>
      </div>

      <!-- CTA row -->
      <div class="mt-3 flex gap-2 w-full">
        <router-link
          :to="{ name: 'product-detail', params: { id: product.id } }"
          class="w-1/2"
        >
          <Button type="button" variant="outline" class="w-full">
            View
          </Button>
        </router-link>
        <Button
          type="button"
          class="font-semibold w-1/2"
          :disabled="product.stock <= 0"
          @click="handleAddToCart"
        >
          {{ product.stock > 0 ? 'Add to Cart' : 'Out of Stock' }}
        </Button>
      </div>
    </div>
  </article>
</template>
