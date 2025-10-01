import api from './axios'

/** Types (same as before) */
export interface Dimensions {
  width: number
  height: number
  depth: number
}
export interface Review {
  rating: number
  comment: string
  date: string
  reviewerName: string
  reviewerEmail: string
}
export interface ProductMeta {
  createdAt: string
  updatedAt: string
  barcode: string
  qrCode: string
}
export interface Product {
  id: number
  title: string
  description: string
  category: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  tags: string[]
  brand: string
  sku: string
  weight: number
  dimensions: Dimensions
  warrantyInformation: string
  shippingInformation: string
  availabilityStatus: string
  reviews: Review[]
  returnPolicy: string
  minimumOrderQuantity: number
  meta: ProductMeta
  thumbnail: string
  images: string[]
}
export interface ProductsResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

/** Query params */
export interface ListProductsParams {
  skip?: number // default 0
  limit?: number // default 30
  q?: string // search text (for /products/search)
  category?: string // for /products/category/:category
  sortBy?: 'title' | 'price' | 'rating' | 'stock' | 'brand' | 'category'
  order?: 'asc' | 'desc'
}

/** Base list with sort/order support: GET /products?sortBy=title&order=asc */
export async function listProducts(params: ListProductsParams = {}): Promise<ProductsResponse> {
  const { skip = 0, limit = 30, sortBy, order } = params
  const res = await api.get<ProductsResponse>('/products', {
    params: {
      skip,
      limit,
      ...(sortBy ? { sortBy } : {}),
      ...(order ? { order } : {}),
    },
  })
  return res.data
}

/** Search: GET /products/search?q=phone */
export async function searchProducts(
  q: string,
  params: Omit<ListProductsParams, 'q' | 'category'> = {},
): Promise<ProductsResponse> {
  const { skip = 0, limit = 30, sortBy, order } = params
  const res = await api.get<ProductsResponse>('/products/search', {
    params: { q, skip, limit, ...(sortBy ? { sortBy } : {}), ...(order ? { order } : {}) },
  })
  return res.data
}

/** Category list: GET /products/category-list (returns string[]) */
export async function listCategories(): Promise<string[]> {
  const res = await api.get<string[]>('/products/category-list')
  return res.data
}

/** Get products by category: GET /products/category/:category */
export async function listProductsByCategory(
  category: string,
  params: Omit<ListProductsParams, 'category' | 'q'> = {},
): Promise<ProductsResponse> {
  const { skip = 0, limit = 30, sortBy, order } = params
  const res = await api.get<ProductsResponse>(
    `/products/category/${encodeURIComponent(category)}`,
    {
      params: { skip, limit, ...(sortBy ? { sortBy } : {}), ...(order ? { order } : {}) },
    },
  )
  return res.data
}

export async function getProductById(id: number): Promise<Product> {
  const res = await api.get<Product>(`/products/${id}`)
  return res.data
}
