<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Cardápio</h1>
      <p class="mt-2 text-gray-600">Descubra nossos deliciosos pratos</p>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-6">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar pratos..."
            class="input-field"
          />
        </div>
        <div class="flex gap-2 flex-wrap">
          <button
            v-for="category in categories"
            :key="category"
            @click="selectedCategory = category"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              selectedCategory === category
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            {{ category }}
          </button>
        </div>
      </div>
    </div>

    <!-- Products Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="product in filteredProducts" 
        :key="product.id"
        class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
        @click="goToProductDetail(product.id)"
      >
        <div class="aspect-w-16 aspect-h-9">
          <img 
            :src="product.image" 
            :alt="product.name"
            class="w-full h-48 object-cover"
          />
        </div>
        <div class="p-6">
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-lg font-semibold text-gray-900">{{ product.name }}</h3>
            <div class="flex items-center space-x-1">
              <Icon name="heroicons:star-solid" class="w-4 h-4 text-yellow-400" />
              <span class="text-sm text-gray-600">{{ product.rating }}</span>
            </div>
          </div>
          
          <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ product.description }}</p>
          
          <div class="flex items-center justify-between mb-4">
            <span class="text-2xl font-bold text-green-600">R$ {{ product.price.toFixed(2) }}</span>
            <div class="flex items-center space-x-1 text-sm text-gray-500">
              <Icon name="heroicons:clock" class="w-4 h-4" />
              <span>{{ product.prepTime }}</span>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {{ product.category }}
            </span>
            <button 
              @click.stop="quickAddToCart(product)"
              :disabled="!product.available"
              :class="[
                'flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                product.available
                  ? 'bg-orange-500 hover:bg-orange-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              ]"
            >
              <Icon name="heroicons:plus" class="w-4 h-4" />
              <span>{{ product.available ? 'Adicionar' : 'Indisponível' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredProducts.length === 0" class="text-center py-12">
      <Icon name="heroicons:magnifying-glass" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhum produto encontrado</h3>
      <p class="text-gray-600">Tente ajustar os filtros ou buscar por outro termo.</p>
    </div>

    <!-- Cart Summary (Fixed Bottom) -->
    <div 
      v-if="cartCount > 0" 
      class="fixed bottom-4 left-4 right-4 bg-orange-500 text-white rounded-lg shadow-lg p-4 z-50 max-w-md mx-auto"
    >
      <div class="flex items-center justify-between">
        <div>
          <p class="font-medium">{{ cartCount }} {{ cartCount === 1 ? 'item' : 'itens' }} no carrinho</p>
          <p class="text-orange-100">Total: R$ {{ cartTotal.toFixed(2) }}</p>
        </div>
        <NuxtLink 
          to="/cart"
          class="bg-white text-orange-500 px-4 py-2 rounded-lg font-medium hover:bg-orange-50 transition-colors"
        >
          Ver Carrinho
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'customer'
})

const { products, getProductsByCategory, addToCart, cartCount, cartTotal } = useAppState()

const searchQuery = ref('')
const selectedCategory = ref('Todos')

const categories = ['Todos', 'Lanches', 'Bebidas', 'Sobremesas', 'Pratos Principais', 'Acompanhamentos']

const filteredProducts = computed(() => {
  let filtered = getProductsByCategory(selectedCategory.value)

  if (searchQuery.value) {
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  return filtered.filter(product => product.available)
})

const goToProductDetail = (productId) => {
  navigateTo(`/product/${productId}`)
}

const quickAddToCart = (product) => {
  addToCart(product, 1)
  // Feedback visual opcional
  console.log(`${product.name} adicionado ao carrinho!`)
}

useHead({
  title: 'Cardápio'
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
