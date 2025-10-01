

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'

const router = useRouter()

const autoplay = Autoplay({ delay: 4000, stopOnInteraction: false })

const slides = [
  {
    src: 'https://images.unsplash.com/photo-1596273501899-336404ed1701?w=500&auto=format&fit=crop&q=60',
    alt: 'New arrivals',
    title: 'Discover Our Latest Collection',
    subtitle: 'Quality products just for you',
    ctaText: 'Shop Now',
    query: {},
  },
  {
    src: 'https://plus.unsplash.com/premium_photo-1733342675493-2464e394a969?q=80&w=1469&auto=format&fit=crop',
    alt: 'Beauty essentials',
    title: 'Beauty & Care Essentials',
    subtitle: 'Elevate your everyday routine',
    ctaText: 'View Products',
    query: { category: 'beauty' },
  },
  {
    src: 'https://images.unsplash.com/photo-1482062364825-616fd23b8fc1?auto=format&fit=crop&w=2000&q=80',
    alt: 'Tech gadgets',
    title: 'Trending Tech Gadgets',
    subtitle: 'Must-have devices for you',
    ctaText: 'Explore Tech',
    query: { category: 'electronics' },
  },
]

const onClick = (slide: (typeof slides)[number]) => {
    router.push({ name: 'products', query: slide.query })
}
</script>

<template>
  <section class="relative w-full h-[45vh]">
    <div class="rounded-2xl overflow-hidden h-full">
      <Carousel :opts="{ loop: true, align: 'start' }" class="h-full" :plugins="[autoplay]">
        <CarouselContent class="h-full">
          <CarouselItem
            v-for="(slide, i) in slides"
            :key="i"
            class="h-full basis-full relative"
          >
            <div class="absolute inset-0">
              <img :src="slide.src" :alt="slide.alt" class="h-full w-full object-cover" />
              <div class="absolute inset-0 bg-black/40" />
            </div>

            <div class="relative z-10 flex h-full items-center justify-center px-6 text-center rounded-2xl">
              <div class="max-w-2xl text-white space-y-3">
                <h2 class="text-3xl md:text-4xl font-extrabold">
                  {{ slide.title }}
                </h2>
                <p class="text-base md:text-lg opacity-90">
                  {{ slide.subtitle }}
                </p>
                <Button size="lg" variant="secondary" @click="onClick(slide)">
                  {{ slide.ctaText }}
                </Button>
              </div>
            </div>
          </CarouselItem>
        </CarouselContent>

        <CarouselPrevious
          class="absolute left-4 top-1/2 -translate-y-1/2 z-20"
        />
        <CarouselNext
          class="absolute right-4 top-1/2 -translate-y-1/2 z-20"
        />
      </Carousel>
    </div>
  </section>
</template>

