<script setup lang="ts">
import Footer from './components/ui/Footer.vue'
import Navbar from './components/ui/Navbar.vue'
import { useRoute } from 'vue-router'
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css' 
const route = useRoute()
</script>

<template>
  <Navbar v-if="route.name !== 'login'" />

  <router-view />

  <Footer v-if="route.name !== 'login'" />
    <Toaster  theme="light" :rich-colors="true"/>
</template>
