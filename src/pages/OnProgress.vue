<template>
  <main class="min-h-[75vh] flex items-center justify-center p-8">
    <div class="text-center max-w-md">
      <img
        src="/on-progress.svg"
        alt="Feature in progress"
        class="mx-auto mb-6 h-48 w-auto opacity-90"
      />

      <h1 class="text-2xl font-bold">Sorry, this feature is still in progress</h1>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        We’re working hard to finish this. Please check back soon.
      </p>

      <div class="mt-6 flex items-center justify-center gap-3">
        <Button @click="$router.push({ path: '/' })">Back to Home</Button>
        <Button variant="outline" @click="$router.back()">Go Back</Button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
</script>
