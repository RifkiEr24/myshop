<template>
  <div>
    <div class="mx-auto max-w-7xl p-6 md:p-8 space-y-8">
            <HeroCarousel />
      <ProductCarouselRow
        v-for="c in visibleCategories"
        :key="c"
        :category="c"
        :title="formatTitle(c)"
        :limit="15"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import HeroCarousel from '@/components/HeroCarousel.vue'
import { useQuery } from '@tanstack/vue-query'
import { listCategories } from '@/services/products'
import { computed } from 'vue'
import ProductCarouselRow from '@/components/product/ProductCarouselRow.vue'

const { data: catData } = useQuery<string[]>({
  queryKey: ['categories'],
  queryFn: () => listCategories(),
  staleTime: 60 * 60 * 1000
})
const visibleCategories = computed(() => (catData.value ?? []).slice(0, 7))
function formatTitle(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, m => m.toUpperCase())
}
</script>
