<template>
  <div class="border rounded-lg p-3 space-y-3">
    <Skeleton class="h-40 w-full rounded-md" />
    <div class="space-y-2">
      <Skeleton class="h-4 w-3/4" />
      <Skeleton class="h-4 w-1/2" />
    </div>
    <div class="flex gap-2">
      <Skeleton class="h-6 w-16 rounded" />
      <Skeleton class="h-6 w-12 rounded" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Skeleton } from "@/components/ui/skeleton"
</script>
