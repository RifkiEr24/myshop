<!-- src/components/ProductDetailSkeleton.vue -->
<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse">
    <!-- Left: gallery -->
    <section class="lg:col-span-6 flex flex-col gap-6">
      <Skeleton class="aspect-[4/3] w-full rounded-xl" />
      <div class="grid grid-cols-5 gap-2">
        <Skeleton v-for="n in 5" :key="n" class="aspect-square rounded-lg" />
      </div>
      <Skeleton class="h-16 w-full rounded-xl" />
    </section>

    <!-- Right: product info -->
    <section class="lg:col-span-6 space-y-4">
      <Skeleton class="h-8 w-3/4" />
      <Skeleton class="h-4 w-1/3" />

      <div class="flex items-center gap-2">
        <Skeleton class="h-4 w-20" />
        <Skeleton class="h-4 w-8" />
      </div>

      <div class="space-y-2">
        <Skeleton class="h-6 w-32" />
        <Skeleton class="h-4 w-20" />
      </div>

      <Skeleton class="h-20 w-full" />

      <div class="flex gap-2">
        <Skeleton v-for="n in 3" :key="n" class="h-6 w-16 rounded" />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Skeleton v-for="n in 4" :key="n" class="h-28 w-full rounded-xl" />
      </div>

      <div class="flex gap-3 items-center">
        <Skeleton class="h-10 w-24" />
        <Skeleton class="h-10 flex-1 rounded" />
      </div>
    </section>
  </div>

  <!-- Reviews -->
  <section class="mt-6 space-y-4">
    <Skeleton class="h-6 w-40" />
    <div class="grid grid-cols-2 gap-4">
      <Skeleton v-for="n in 4" :key="n" class="h-28 w-full rounded-xl" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton'
</script>
