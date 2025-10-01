<template>
  <span class="text-amber-500">
    {{ '★'.repeat(rounded) + '☆'.repeat(5 - rounded) }}
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{ rating: number }>()
const rounded = Math.round(props.rating ?? 0)
</script>
