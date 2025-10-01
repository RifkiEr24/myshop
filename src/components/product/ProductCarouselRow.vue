<template>
  <section class="space-y-3">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold">{{ title }}</h2>
 
    </div>

<Carousel class="w-full" orientation="horizontal" setApi="setApi">
  <CarouselContent>
    <!-- Loading state: show skeleton slides -->
    <template v-if="isLoading">
      <CarouselItem v-for="n in 6" :key="'skel-' + n" class="basis-auto w-72">
        <ProductCardSkeleton />
      </CarouselItem>
    </template>

    <!-- Loaded state: real products -->
    <template v-else>
      <CarouselItem
        v-for="p in data?.products"
        :key="p.id"
        class="basis-auto w-72"
      >
        <ProductCard
        class="mb-2"
          :product="p"
          @view="onView"
          @add-to-cart="onAddToCart"
        />
      </CarouselItem>
    </template>
  </CarouselContent>

  <CarouselPrevious />
  <CarouselNext />
</Carousel>

    <div v-if="isLoading" class="text-sm text-gray-500">Loading {{ category }}…</div>
    <div v-else-if="error" class="text-sm text-red-600">Failed to load {{ category }}</div>
  </section>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { listProductsByCategory, type ProductsResponse, type Product } from '@/services/products'
import { Button } from '@/components/ui/button'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { useRouter } from 'vue-router'
import ProductCard from './ProductCard.vue'
import CarouselPrevious from '../ui/carousel/CarouselPrevious.vue'
import CarouselNext from '../ui/carousel/CarouselNext.vue'
import ProductCardSkeleton from './ProductCardSkeleton.vue'

const router = useRouter()
const props = defineProps<{ category: string; title?: string; limit?: number }>()

const { data, isLoading, error } = useQuery<ProductsResponse>({
  queryKey: ['products', 'category', { category: props.category, limit: props.limit ?? 12 }],
  queryFn: () =>
    listProductsByCategory(props.category, {
      limit: props.limit ?? 12,
      sortBy: 'rating',
      order: 'desc',
    }),
  staleTime: 30_000,
})

const embla = ref<any | null>(null)

const canScrollPrev = ref(false)
const canScrollNext = ref(false)
const onSelect = () => {
    if (!embla.value) return
    canScrollPrev.value = embla.value.canScrollPrev()
    canScrollNext.value = embla.value.canScrollNext()
}
onBeforeUnmount(() => {
    embla.value?.off('select', onSelect)
    embla.value?.off('reInit', onSelect)
})

const onView = (p: Product) => {
    router.push({ name: 'product-detail', params: { id: p.id } })
}
const onAddToCart = (p: Product) => {
    console.log('add to cart', p.id)
}
</script>
