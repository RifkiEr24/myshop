<template>
  <header class="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-lg dark:bg-slate-950/80">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <!-- Brand -->
      <router-link to="/" class="flex items-center gap-2 font-bold text-lg">
        <span>MyShop</span>
      </router-link>

      <!-- Desktop nav -->
      <nav class="hidden md:flex items-center gap-6 text-sm font-medium">
        <router-link to="/" active-class="text-blue-600 dark:text-blue-400">Home</router-link>
        <router-link to="/products" active-class="text-blue-600 dark:text-blue-400">Products</router-link>
      </nav>

      <!-- Right actions -->
      <div class="flex items-center gap-3">
        <!-- Desktop search -->
        <div class="hidden sm:flex items-center gap-2">
          <Input v-model="search" placeholder="Search products…" class="md:w-64" @keyup.enter="onSearch" />
          <Button size="sm" @click="onSearch">
            <Search class="mr-1 h-4 w-4" /> Search
          </Button>
        </div>

        <!-- Cart -->
      <!-- Cart -->
<router-link to="/cart" class="relative">
  <ShoppingCart class="h-6 w-6 text-gray-600 dark:text-gray-300" />
  <span
    v-if="cart.totalQuantity > 0"
    class="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-medium text-white shadow"
  >
    {{ cart.totalQuantity }}
  </span>
</router-link>


        <!-- Account dropdown (desktop) -->
        <DropdownMenu class="hidden sm:block">
          <DropdownMenuTrigger as-child>
            <Button variant="outline" size="sm">
              <User class="h-4 w-4 mr-1" /> Account
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent class="w-40">
            <DropdownMenuItem><router-link to="/profile">Profile</router-link></DropdownMenuItem>
            <DropdownMenuItem><router-link to="/orders">Orders</router-link></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem @click="handleLogout()">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <!-- Mobile menu toggle -->
        <button
          class="inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100 dark:hover:bg-slate-800 md:hidden"
          @click="isOpen = !isOpen"
          :aria-expanded="isOpen"
          aria-controls="mobile-menu"
        >
          <Menu v-if="!isOpen" class="h-6 w-6 text-gray-700 dark:text-gray-200" />
          <X v-else class="h-6 w-6 text-gray-700 dark:text-gray-200" />
        </button>
      </div>
    </div>

    <!-- Mobile panel -->
    <div
      id="mobile-menu"
      class="md:hidden overflow-hidden border-t"
      :class="isOpen ? 'max-h-[480px] opacity-100' : 'max-h-0 opacity-0'"
      style="transition: max-height 250ms ease, opacity 200ms ease;"
    >
      <div class="px-4 py-4 space-y-4">
        <!-- Mobile search -->
        <div class="flex items-center gap-2">
          <Input v-model="search" placeholder="Search products…" class="w-full" @keyup.enter="goAndClose" />
          <Button size="sm" @click="goAndClose">
            <Search class="mr-1 h-4 w-4" /> Go
          </Button>
        </div>

        <!-- Mobile links -->
        <nav class="flex flex-col gap-2 text-sm font-medium">
          <router-link to="/" class="rounded px-2 py-2 hover:bg-gray-100 dark:hover:bg-slate-800" @click="close">
            Home
          </router-link>
          <router-link to="/products" class="rounded px-2 py-2 hover:bg-gray-100 dark:hover:bg-slate-800" @click="close">
            Products
          </router-link>
        </nav>

        <!-- Mobile account actions -->
        <div class="pt-2 border-t">
          <template v-if="auth.isAuthenticated">
            <div class="flex items-center justify-between py-2">
              <span class="text-sm text-gray-700 dark:text-gray-300">Hi, {{ auth.user?.name }}</span>
              <Button size="sm" variant="outline" @click="handleLogout(); close()">Logout</Button>
            </div>
          </template>
          <template v-else>
            <router-link to="/login" class="block">
              <Button class="w-full">Login</Button>
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search, ShoppingCart, User, Menu, X } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const isOpen = ref(false)
const search = ref<string>('')

watch(() => route.query.q, q => { search.value = (q as string) ?? '' }, { immediate: true })

const onSearch = () => {
    const q = search.value?.trim()
    router.push({ name: 'products', query: q ? { q } : {} })
}
const goAndClose = () => { onSearch(); isOpen.value = false }
const close = () => { isOpen.value = false }

const handleLogout = () => {
    auth.signOut()
    router.push({ name: 'login' })
}
</script>
