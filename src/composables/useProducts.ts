// src/composables/useProducts.ts
import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import {
  listProducts,
  searchProducts,
  listProductsByCategory,
  type ProductsResponse,
} from '@/services/products'

export function useProducts(opts: {
  q: Ref<string>
  category: Ref<string | null>
  skip: Ref<number>
  limit: Ref<number>
  sortBy: Ref<'title' | 'price' | 'rating' | 'stock' | 'brand' | 'category' | undefined>
  order: Ref<'asc' | 'desc' | undefined>
}) {
  const key = computed(() => [
    'products',
    {
      q: opts.q.value || undefined,
      category: opts.category.value || undefined,
      skip: opts.skip.value,
      limit: opts.limit.value,
      sortBy: opts.sortBy.value,
      order: opts.order.value,
    },
  ])

  const query = useQuery<ProductsResponse>({
    queryKey: key,
    queryFn: () => {
      const common = {
        skip: opts.skip.value,
        limit: opts.limit.value,
        sortBy: opts.sortBy.value,
        order: opts.order.value,
      }
      if (opts.q.value) return searchProducts(opts.q.value, common)
      if (opts.category.value) return listProductsByCategory(opts.category.value, common)
      return listProducts(common)
    },
    staleTime: 30_000,
  })

  return query
}
