<template>
  <footer class="border-t bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg mt-auto">
    <div class="mx-auto max-w-7xl px-6 py-10">
      <div class="grid gap-8 md:grid-cols-3">
        <div>
          <router-link to="/" class="flex items-center gap-2 font-bold text-lg">
            <span>MyShop</span>
          </router-link>
          <p class="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Your one-stop shop for everything. Explore products across categories and brands.
          </p>
        </div>

        <div class="grid grid-cols-2 gap-4 text-sm">
          <div class="space-y-2">
            <h3 class="text-gray-800 dark:text-gray-200 font-semibold text-sm">Shop</h3>
            <router-link to="/products" class="block hover:underline">Products</router-link>
            <router-link to="/coming-soon" class="block hover:underline">Categories</router-link>
          </div>
          <div class="space-y-2">
            <h3 class="text-gray-800 dark:text-gray-200 font-semibold text-sm">Company</h3>
         <router-link to="/coming-soon" class="block hover:underline">About</router-link>
<router-link to="/coming-soon" class="block hover:underline">Contact</router-link>

          </div>
        </div>

        <div class="flex flex-col gap-3">
          <h3 class="text-gray-800 dark:text-gray-200 font-semibold text-sm">Follow us</h3>
          <div class="flex gap-4">
            <a href="#" aria-label="Twitter" class="hover:text-blue-500">
              <Twitter class="h-5 w-5" />
            </a>
            <a href="#" aria-label="Facebook" class="hover:text-blue-600">
              <Facebook class="h-5 w-5" />
            </a>
            <a href="#" aria-label="Instagram" class="hover:text-pink-500">
              <Instagram class="h-5 w-5" />
            </a>
            <a href="#" aria-label="Github" class="hover:text-gray-900 dark:hover:text-gray-100">
              <Github class="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      <div class="mt-8 border-t pt-4 text-center text-xs text-gray-500 dark:text-gray-400">
        © {{ new Date().getFullYear() }} MyShop. All rights reserved.
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { Twitter, Facebook, Instagram, Github } from 'lucide-vue-next'
</script>
