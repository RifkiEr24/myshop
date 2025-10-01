<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { listCategories } from '@/services/products'
import { useProducts } from '@/composables/useProducts'
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select'
import ProductCard from '@/components/product/ProductCard.vue'
import ProductCardSkeleton from '@/components/product/ProductCardSkeleton.vue'

const route = useRoute()
const router = useRouter()

const q = computed(() => String(route.query.q ?? ''))

const selectedCategory = ref<string | null>(null)
const sortBy = ref<'title' | 'price' | 'rating' | 'stock' | 'brand' | 'category'>('title')
const order = ref<'asc' | 'desc'>('asc')
const skip = ref(0)
const limit = ref(30)

watch([q, selectedCategory], () => { skip.value = 0 })

const { data, isLoading, error } = useProducts({ q, category: selectedCategory, skip, limit, sortBy, order })

const { data: catData } = useQuery({
  queryKey: ['categories'],
  queryFn: () => listCategories(),
  staleTime: Infinity,
})
const categories = computed(() => catData.value ?? [])
</script>

<template>
  <div class="p-8 space-y-6 container mx-auto max-w-7xl">
    <div class="flex flex-wrap gap-3 items-center">
      <Select v-model="selectedCategory">
        <SelectTrigger class="w-56">
          <SelectValue placeholder="All categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem :value="null as any">All categories</SelectItem>
          <SelectItem v-for="c in categories" :key="c" :value="c">{{ c }}</SelectItem>
        </SelectContent>
      </Select>

      <Select v-model="sortBy">
        <SelectTrigger class="w-44">
          <SelectValue placeholder="Sort by…" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="title">Title</SelectItem>
          <SelectItem value="price">Price</SelectItem>
          <SelectItem value="rating">Rating</SelectItem>
          <SelectItem value="stock">Stock</SelectItem>
          <SelectItem value="brand">Brand</SelectItem>
          <SelectItem value="category">Category</SelectItem>
        </SelectContent>
      </Select>

      <Select v-model="order">
        <SelectTrigger class="w-36">
          <SelectValue placeholder="Order…" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="asc">Asc</SelectItem>
          <SelectItem value="desc">Desc</SelectItem>
        </SelectContent>
      </Select>

      <div v-if="q" class="ml-auto text-sm text-gray-600">
        Searching for: <span class="font-medium">“{{ q }}”</span>
        <button class="ml-2 underline" @click="router.push({ name: 'products' })">Clear</button>
      </div>
    </div>

 <div v-if="isLoading" class="grid grid-cols-4 gap-6">
  <ProductCardSkeleton v-for="n in 8" :key="n" />
</div>

<div v-else-if="error" class="text-red-600">Failed to load</div>

<div v-else-if="(data?.products?.length ?? 0) === 0">
  <div class="flex flex-col items-center justify-center py-16 text-center text-gray-500">
    <img src="/empty-state.svg" alt="No results" class="h-40 w-auto mb-6 opacity-80" />
    <h2 class="text-lg font-semibold">No products found</h2>
    <p class="mt-1 text-sm">
      Try adjusting your search or filters.
    </p>
    <Button class="mt-4" @click="selectedCategory = null; sortBy = 'title'; order = 'asc'; router.push({ name: 'products' })">
      Reset Filters
    </Button>
  </div>
</div>

<div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
  <ProductCard v-for="p in data?.products" :key="p.id" :product="p" />
</div>


    <div class="flex items-center gap-3 pt-4">
      <button class="border rounded px-3 py-2" :disabled="skip === 0" @click="skip = Math.max(0, skip - limit)">
        Prev
      </button>
      <span class="text-sm text-gray-600">
        Showing {{ (skip + 1) }}–{{ Math.min(skip + limit, data?.total || 0) }} of {{ data?.total || 0 }}
      </span>
      <button class="border rounded px-3 py-2" :disabled="(skip + limit) >= (data?.total || 0)" @click="skip += limit">
        Next
      </button>
    </div>
  </div>
</template>