<template>
  <div v-if="product" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Back Button -->
    <button 
      @click="$router.back()"
      class="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
    >
      <Icon name="heroicons:arrow-left" class="w-5 h-5" />
      <span>Voltar</span>
    </button>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Product Image -->
      <div class="aspect-w-1 aspect-h-1">
        <img 
          :src="product.image" 
          :alt="product.name"
          class="w-full h-96 object-cover rounded-lg shadow-md"
        />
      </div>

      <!-- Product Info -->
      <div class="space-y-6">
        <div>
          <div class="flex items-center justify-between mb-2">
            <h1 class="text-3xl font-bold text-gray-900">{{ product.name }}</h1>
            <div class="flex items-center space-x-1">
              <Icon name="heroicons:star-solid" class="w-5 h-5 text-yellow-400" />
              <span class="text-lg text-gray-600">{{ product.rating }}</span>
            </div>
          </div>
          <p class="text-gray-600">{{ product.description }}</p>
        </div>

        <div class="flex items-center space-x-4">
          <span class="text-3xl font-bold text-green-600">R$ {{ product.price.toFixed(2) }}</span>
          <span class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {{ product.category }}
          </span>
        </div>

        <div class="flex items-center space-x-2 text-gray-600">
          <Icon name="heroicons:clock" class="w-5 h-5" />
          <span>Tempo de preparo: {{ product.prepTime }}</span>
        </div>

        <!-- Ingredients -->
        <div v-if="product.ingredients && product.ingredients.length > 0">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Ingredientes</h3>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="ingredient in product.ingredients" 
              :key="ingredient"
              class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
            >
              {{ ingredient }}
            </span>
          </div>
        </div>

        <!-- Quantity Selector -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Quantidade</h3>
          <div class="flex items-center space-x-4">
            <button 
              @click="decreaseQuantity"
              :disabled="quantity <= 1"
              class="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon name="heroicons:minus" class="w-4 h-4" />
            </button>
            <span class="text-xl font-medium w-8 text-center">{{ quantity }}</span>
            <button 
              @click="increaseQuantity"
              class="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
            >
              <Icon name="heroicons:plus" class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Total Price -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <div class="flex justify-between items-center">
            <span class="text-lg font-medium text-gray-900">Total:</span>
            <span class="text-2xl font-bold text-green-600">R$ {{ (product.price * quantity).toFixed(2) }}</span>
          </div>
        </div>

        <!-- Add to Cart Button -->
        <button 
          @click="addToCartHandler"
          :disabled="!product.available"
          :class="[
            'w-full py-4 rounded-lg text-lg font-medium transition-colors flex items-center justify-center space-x-2',
            product.available
              ? 'bg-orange-500 hover:bg-orange-600 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          ]"
        >
          <Icon name="heroicons:shopping-cart" class="w-5 h-5" />
          <span>
            {{ product.available ? `Adicionar ao carrinho - R$ ${(product.price * quantity).toFixed(2)}` : 'Produto indisponível' }}
          </span>
        </button>

        <!-- Additional Info -->
        <div class="bg-blue-50 p-4 rounded-lg">
          <div class="flex items-start space-x-3">
            <Icon name="heroicons:information-circle" class="w-5 h-5 text-blue-500 mt-0.5" />
            <div class="text-sm text-blue-700">
              <p class="font-medium mb-1">Entrega estimada</p>
              <p>{{ product.prepTime }} + tempo de entrega</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Related Products -->
    <div v-if="relatedProducts.length > 0" class="mt-16">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Você também pode gostar</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          v-for="relatedProduct in relatedProducts" 
          :key="relatedProduct.id"
          class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          @click="goToProduct(relatedProduct.id)"
        >
          <img 
            :src="relatedProduct.image" 
            :alt="relatedProduct.name"
            class="w-full h-32 object-cover"
          />
          <div class="p-4">
            <h3 class="font-semibold text-gray-900 mb-1">{{ relatedProduct.name }}</h3>
            <p class="text-green-600 font-bold">R$ {{ relatedProduct.price.toFixed(2) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Product Not Found -->
  <div v-else class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
    <Icon name="heroicons:exclamation-triangle" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
    <h1 class="text-2xl font-bold text-gray-900 mb-2">Produto não encontrado</h1>
    <p class="text-gray-600 mb-6">O produto que você está procurando não existe ou foi removido.</p>
    <NuxtLink to="/menu" class="btn-primary">
      Voltar ao Cardápio
    </NuxtLink>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'customer'
})

const route = useRoute()
const { getProductById, products, addToCart } = useAppState()

const productId = computed(() => parseInt(route.params.id))
const product = computed(() => getProductById(productId.value))
const quantity = ref(1)

const relatedProducts = computed(() => {
  if (!product.value) return []
  return products.value
    .filter(p => p.category === product.value.category && p.id !== product.value.id)
    .slice(0, 3)
})

const increaseQuantity = () => {
  quantity.value++
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const addToCartHandler = () => {
  if (product.value && product.value.available) {
    addToCart(product.value, quantity.value)
    // Feedback visual opcional
    console.log(`${quantity.value}x ${product.value.name} adicionado ao carrinho!`)
  }
}

const goToProduct = (id) => {
  navigateTo(`/product/${id}`)
}

// Reset quantity when product changes
watch(productId, () => {
  quantity.value = 1
})

useHead({
  title: computed(() => product.value ? product.value.name : 'Produto não encontrado')
})
</script>
