<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { getProductById, type Product } from '@/services/products'

import Badge from '@/components/ui/badge/Badge.vue'
import Button from '@/components/ui/button/Button.vue'
import NumberField from '@/components/ui/number-field/NumberField.vue'
import NumberFieldDecrement from '@/components/ui/number-field/NumberFieldDecrement.vue'
import NumberFieldInput from '@/components/ui/number-field/NumberFieldInput.vue'
import NumberFieldIncrement from '@/components/ui/number-field/NumberFieldIncrement.vue'
import NumberFieldContent from '@/components/ui/number-field/NumberFieldContent.vue'
import ProductDetailSkeleton from '@/components/product/ProductDetailSkeleton.vue'
import RatingStars from '@/components/RatingStars.vue'


import {
    ShoppingCart,
    Truck,
    ShieldCheck,
    RotateCcw,
    Ruler,
    Weight,
    Barcode,
 
    Store,
    ArrowRight,
    MessageSquareText,
} from 'lucide-vue-next'

import { useCartStore } from '@/stores/cart'
import { toast } from 'vue-sonner'
import { formatCurrency } from '@/lib/FormatCurrency'

const route = useRoute()
const router = useRouter()
const id = computed(() => Number(route.params.id))

const { data, isLoading, error } = useQuery<Product>({
    queryKey: ['product', id],
    queryFn: () => getProductById(id.value),
    enabled: computed(() => isFinite(id.value)),
    staleTime: 60_000,
})

const product = computed(() => data.value)

const activeImage = ref<string | null>(null)
watchEffect(() => {
    if (product.value && !activeImage.value) activeImage.value = product.value.thumbnail
})

const discountedPrice = computed(() => {
    if (!product.value) return 0
    const pct = product.value.discountPercentage ?? 0
    return pct > 0 ? product.value.price * (1 - pct / 100) : product.value.price
})

const reviewCount = computed(() => product.value?.reviews?.length ?? 0)

const qty = ref(1)
const minQty = computed(() => Math.max(1, product.value?.minimumOrderQuantity ?? 1))
const maxQty = computed(() => Math.max(minQty.value, product.value?.stock ?? minQty.value))

watchEffect(() => {
    if (!product.value) return
    if (qty.value < minQty.value) qty.value = minQty.value
    if (qty.value > maxQty.value) qty.value = maxQty.value
})

// --- Cart Actions ---
const cart = useCartStore()

const onAddToCart = () => {
    if (!product.value) return
    if ((product.value.stock ?? 0) <= 0) {
        toast.error('Out of stock')
        return
    }

    cart.add(
        {
            id: product.value.id,
            title: product.value.title,
            price: discountedPrice.value,
            discountPercentage: product.value.discountPercentage,
            thumbnail: product.value.thumbnail,
        },
        qty.value
    )

    toast.success('Added to cart', {
        description: `${product.value.title} × ${qty.value}`,
    })
}


</script>

<template>
  <div class="p-6 md:p-10 max-w-7xl mx-auto">
    <div class="mb-6">
      <router-link to="/" class="text-sm text-blue-600 hover:underline"
        >← Back to products</router-link
      >
    </div>

    <div v-if="isLoading" class="text-gray-500">
        <ProductDetailSkeleton />
    </div>
    <div v-else-if="error" class="text-red-600">Failed to load product</div>

    <div v-else-if="product" class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <section class="lg:col-span-6 flex flex-col gap-6">
        <div class="aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-50 border">
          <img :src="activeImage || ''" :alt="product.title" class="h-full w-full object-cover" />
        </div>
        <div class="mt-3 grid grid-cols-5 gap-2">
          <button
            v-for="(img, i) in product.images.slice(0, 10)"
            :key="img + i"
            class="aspect-square overflow-hidden rounded-lg border"
            :class="activeImage === img ? 'ring-2 ring-blue-600' : ''"
            @click="activeImage = img"
          >
            <img
              :src="img"
              :alt="product.title + ' thumbnail ' + i"
              class="h-full w-full object-cover"
            />
          </button>
        </div>
        <div class="mt-auto">
          <RouterLink
            :to="{ path: '/' }"
            class="group relative mt-auto block rounded-xl border bg-gradient-to-br from-sky-50 to-white dark:from-slate-900 dark:to-slate-950 shadow-sm transition hover:shadow-md hover:-translate-y-[1px] hover:ring-1 hover:ring-sky-200/70 dark:hover:ring-sky-400/20"
          >
            <div
              class="absolute inset-x-0 top-0 h-1 rounded-t-xl bg-gradient-to-r from-sky-500/70 to-cyan-300/70 dark:from-sky-400/60 dark:to-cyan-200/40"
            />

            <div class="flex items-center gap-3 p-4">
              <div class="rounded-lg bg-sky-50 dark:bg-sky-950 p-2 text-sky-600 dark:text-sky-300">
                <Store class="h-5 w-5" />
              </div>

              <div class="min-w-0">
                <h3 class="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {{ product.brand }}
                </h3>
                <p class="truncate text-xs text-gray-600 dark:text-gray-400">
                  Visit {{ product.brand }}'s shop • Discover more from this brand
                </p>
              </div>

              <ArrowRight
                class="ml-auto h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-sky-600 dark:group-hover:text-sky-300"
              />
            </div>
          </RouterLink>
        </div>
      </section>

      <section class="lg:col-span-6 space-y-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ product.title }}</h1>
          <p class="text-sm text-gray-500 capitalize">{{ product.brand }}</p>
        </div>

        <div class="flex items-center gap-2 text-sm text-gray-600">
          <RatingStars :rating="product.rating" />
          <span>{{ product.rating.toFixed(2) }}</span>
          <span v-if="reviewCount"
            >· {{ reviewCount }} review{{ reviewCount === 1 ? '' : 's' }}</span
          >
        </div>

        <div class="space-y-1">
          <div class="flex items-baseline gap-3">
            <span class="text-2xl font-extrabold text-gray-900">{{
              formatCurrency(discountedPrice)
            }}</span>
            <span v-if="product.discountPercentage > 0" class="text-sm text-gray-400 line-through">
              {{ formatCurrency(product.price) }}
            </span>
            <Badge v-if="product.discountPercentage > 0" variant="error">
              -{{ product.discountPercentage }}%
            </Badge>
          </div>
          <div>
            <Badge :variant="product.stock > 0 ? 'success' : 'error'">
              Stock: {{ product.stock }}
            </Badge>
          </div>
        </div>

        <p class="text-gray-700 leading-relaxed">
          {{ product.description }}
        </p>

        <div class="flex flex-wrap gap-2">
          <Badge v-for="(tag, i) in product.tags.slice(0, 5)" :key="tag + i" class="capitalize">
            {{ tag }}
          </Badge>
        </div>

        <div
          class="grid grid-cols-1 sm:grid-cols-2 auto-rows-[minmax(140px,auto)] gap-4 pt-2 text-sm"
        >
          <section
            class="rounded-xl border bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 p-4 shadow-sm transition hover:shadow-md hover:-translate-y-[1px] hover:ring-1 hover:ring-blue-200/70 dark:hover:ring-blue-400/20"
          >
            <div class="flex items-center gap-2">
              <div
            class="rounded-lg bg-blue-50 dark:bg-blue-950 p-2 text-blue-600 dark:text-blue-300"
              >
            <Truck class="h-5 w-5" />
              </div>
              <h3 class="font-semibold text-gray-800 dark:text-gray-100">Shipping</h3>
            </div>
            <p class="mt-2 text-gray-600 dark:text-gray-300">
              {{ product.shippingInformation }}
            </p>
          </section>

          <section
            class="rounded-xl border bg-gradient-to-br from-emerald-50/50 to-white dark:from-emerald-950 dark:to-slate-950 p-4 shadow-sm transition hover:shadow-md hover:-translate-y-[1px] hover:ring-1 hover:ring-emerald-200/70 dark:hover:ring-emerald-400/20"
          >
            <div class="flex items-center gap-2">
              <div
            class="rounded-lg bg-emerald-50 dark:bg-emerald-950 p-2 text-emerald-600 dark:text-emerald-300"
              >
            <ShieldCheck class="h-5 w-5" />
              </div>
              <h3 class="font-semibold text-gray-800 dark:text-gray-100">Warranty & Return</h3>
            </div>
            <ul class="mt-2 space-y-1.5 text-gray-700 dark:text-gray-300">
              <li class="flex items-start gap-2">
            <ShieldCheck class="mt-0.5 h-4 w-4 text-emerald-600 dark:text-emerald-300" />
            <span>{{ product.warrantyInformation }}</span>
              </li>
              <li class="flex items-start gap-2">
            <RotateCcw class="mt-0.5 h-4 w-4 text-emerald-600 dark:text-emerald-300" />
            <span>{{ product.returnPolicy }}</span>
              </li>
            </ul>
          </section>

          <section
            class="rounded-xl border bg-gradient-to-br from-violet-50/50 to-white dark:from-violet-950 dark:to-slate-950 p-4 shadow-sm transition hover:shadow-md hover:-translate-y-[1px] hover:ring-1 hover:ring-violet-200/70 dark:hover:ring-violet-400/20"
          >
            <div class="flex items-center gap-2">
              <div
            class="rounded-lg bg-violet-50 dark:bg-violet-950 p-2 text-violet-600 dark:text-violet-300"
              >
            <Ruler class="h-5 w-5" />
              </div>
              <h3 class="font-semibold text-gray-800 dark:text-gray-100">Dimensions</h3>
            </div>
            <p class="mt-2 text-gray-700 dark:text-gray-300">
              <Ruler class="inline h-4 w-4 mr-1 text-violet-600 dark:text-violet-300" />
              W {{ product.dimensions.width }} × H {{ product.dimensions.height }} × D
              {{ product.dimensions.depth }} cm
            </p>
            <p class="mt-1 flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Weight class="h-4 w-4 text-violet-600 dark:text-violet-300" />
              <span>Weight: {{ product.weight }} kg</span>
            </p>
          </section>

          <section
            class="rounded-xl border bg-gradient-to-br from-amber-50/50 to-white dark:from-amber-950 dark:to-slate-950 p-4 shadow-sm transition hover:shadow-md hover:-translate-y-[1px] hover:ring-1 hover:ring-amber-200/70 dark:hover:ring-amber-400/20"
          >
            <div class="flex items-center gap-2">
              <div
            class="rounded-lg bg-amber-50 dark:bg-amber-950 p-2 text-amber-600 dark:text-amber-300"
              >
            <Barcode class="h-5 w-5" />
              </div>
              <h3 class="font-semibold text-gray-800 dark:text-gray-100">Product Info</h3>
            </div>

            <p class="mt-2 text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <ShoppingCart class="h-4 w-4 text-amber-600 dark:text-amber-300" />
              Minimum Order: {{ product.minimumOrderQuantity }}
            </p>
            <p class="text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Store class="h-4 w-4 text-amber-600 dark:text-amber-300" />
              Status: {{ product.availabilityStatus }}
            </p>
          </section>
        </div>

        <div class="mt-3 flex  gap-3 items-center ">
          <div class="sm:w-48">
            <label class="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
              >Quantity</label
            >
            <NumberField v-model="qty" :min="minQty" :max="maxQty" :step="1" class="w-full">
              <NumberFieldContent class="rounded-lg border">
                <NumberFieldDecrement />
                <NumberFieldInput class="text-center" />
                <NumberFieldIncrement />
              </NumberFieldContent>
            </NumberField>
            <p class="mt-1 text-[11px] text-gray-500">MOQ: {{ minQty }} • In stock: {{ maxQty }}</p>
          </div>
          <Button class="flex-1" :disabled="(product?.stock ?? 0) <= 0" @click="onAddToCart">
              <ShoppingCart class="mr-2 h-4 w-4" />
              Add to Cart
          </Button>
       
        </div>
      </section>
    </div>
    <section class="mt-6 space-y-4 w-full">
      <h2 class="text-lg font-semibold">Customer Reviews</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <template v-if="product && product.reviews && product.reviews.length > 0">
          <div
            v-for="(review, i) in product.reviews.slice(0, 6)"
            :key="review.reviewerEmail + i"
            class="relative rounded-xl border bg-gradient-to-br from-gray-50 to-white w-full flex dark:from-slate-900 dark:to-slate-950 shadow-sm transition hover:shadow-md p-4 flex flex-col"
          >
            <div class="mb-2 flex items-center justify-between">
              <div class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <MessageSquareText class="h-4 w-4 text-blue-500" />
            <span class="text-sm font-medium">{{ review.reviewerName }}</span>
              </div>
              <span class="text-xs text-gray-500">{{
            new Date(review.date).toLocaleDateString()
              }}</span>
            </div>

            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">"{{ review.comment }}"</p>

            <div class="flex items-center gap-1 text-xs text-gray-500">
              <RatingStars :rating="review.rating" size="xs" />
              <span>{{ review.rating }}</span>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="col-span-full text-gray-500 text-center py-8">
            No reviews yet.
          </div>
        </template>
      </div>
    </section>
  </div>
</template>
