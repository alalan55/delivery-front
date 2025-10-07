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
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
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
        class="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 relative"
        @click="goToProductDetail(product.id)"
      >
        <!-- Badge de destaque -->
        <div v-if="product.featured" class="absolute top-3 left-3 z-10">
          <span
            class="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg"
          >
            Destaque
          </span>
        </div>

        <!-- Badge de desconto -->
        <div v-if="product.discount" class="absolute top-3 right-3 z-10">
          <span
            class="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg"
          >
            -{{ product.discount }}%
          </span>
        </div>

        <!-- Container da imagem -->
        <div class="relative overflow-hidden">
          <img
            :src="product.image"
            :alt="product.name"
            class="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
          />

          <!-- Overlay de ações na imagem -->
          <div
            class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"
          >
            <button
              @click.stop="quickView(product)"
              class="bg-white bg-opacity-90 rounded-full p-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-opacity-100 hover:scale-110"
            >
              <Icon name="heroicons:eye" class="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>

        <!-- Conteúdo do card -->
        <div class="p-5">
          <!-- Categoria -->
          <div class="mb-2">
            <span
              class="text-xs font-semibold text-orange-500 uppercase tracking-wide"
            >
              {{ product.category }}
            </span>
          </div>

          <!-- Nome e rating -->
          <div class="flex justify-between items-start mb-2">
            <h3
              class="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-orange-600 transition-colors"
            >
              {{ product.name }}
            </h3>
            <div
              class="flex items-center space-x-1 bg-gray-50 rounded-full px-2 py-1"
            >
              <Icon
                name="heroicons:star-solid"
                class="w-4 h-4 text-yellow-400"
              />
              <span class="text-sm font-semibold text-gray-700">{{
                product.rating
              }}</span>
            </div>
          </div>

          <!-- Descrição -->
          <p class="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
            {{ product.description }}
          </p>

          <!-- Preço e tempo -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-baseline space-x-2">
              <span class="text-2xl font-bold text-green-600">
                R$ {{ calculateDiscountPrice(product).toFixed(2) }}
              </span>
              <span
                v-if="product.discount"
                class="text-sm text-gray-400 line-through"
              >
                R$ {{ product.price.toFixed(2) }}
              </span>
            </div>
            <div
              class="flex items-center space-x-1 text-sm text-gray-500 bg-gray-50 rounded-full px-3 py-1"
            >
              <Icon name="heroicons:clock" class="w-4 h-4" />
              <span>{{ product.prepTime }}</span>
            </div>
          </div>

          <!-- Ações -->
          <div
            class="flex items-center justify-between pt-3 border-t border-gray-100"
          >
            <div class="flex items-center space-x-1 text-sm text-gray-500">
              <Icon
                name="heroicons:check-circle"
                :class="[
                  'w-4 h-4',
                  product.available ? 'text-green-500' : 'text-red-500',
                ]"
              />
              <span
                :class="product.available ? 'text-green-600' : 'text-red-600'"
              >
                {{ product.available ? "Em estoque" : "Esgotado" }}
              </span>
            </div>

            <button
              @click.stop="quickAddToCart(product)"
              :disabled="!product.available"
              :class="[
                'flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105',
                product.available
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed',
              ]"
            >
              <Icon name="heroicons:plus" class="w-4 h-4" />
              <span>{{
                product.available ? "Adicionar" : "Indisponível"
              }}</span>
            </button>
          </div>

          <!-- Informações adicionais -->
          <div
            v-if="product.freeShipping"
            class="mt-3 pt-3 border-t border-gray-100"
          >
            <div class="flex items-center space-x-2 text-green-600 text-sm">
              <Icon name="heroicons:truck" class="w-4 h-4" />
              <span class="font-medium">Frete grátis</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredProducts.length === 0" class="text-center py-12">
      <Icon
        name="heroicons:magnifying-glass"
        class="w-16 h-16 text-gray-300 mx-auto mb-4"
      />
      <h3 class="text-lg font-medium text-gray-900 mb-2">
        Nenhum produto encontrado
      </h3>
      <p class="text-gray-600">
        Tente ajustar os filtros ou buscar por outro termo.
      </p>
    </div>

    <!-- Cart Summary (Fixed Bottom) -->
    <div
      v-if="cartCount > 0"
      class="fixed bottom-4 left-4 right-4 bg-orange-500 text-white rounded-lg shadow-lg p-4 z-50 max-w-md mx-auto"
    >
      <div class="flex items-center justify-between">
        <div>
          <p class="font-medium">
            {{ cartCount }} {{ cartCount === 1 ? "item" : "itens" }} no carrinho
          </p>
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
  middleware: "customer",
});

const { products, getProductsByCategory, addToCart, cartCount, cartTotal } =
  useAppState();

const searchQuery = ref("");
const selectedCategory = ref("Todos");

const categories = [
  "Todos",
  "Lanches",
  "Bebidas",
  "Sobremesas",
  "Pratos Principais",
  "Acompanhamentos",
];

const filteredProducts = computed(() => {
  let filtered = getProductsByCategory(selectedCategory.value);

  if (searchQuery.value) {
    filtered = filtered.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        product.description
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase())
    );
  }

  return filtered.filter((product) => product.available);
});

const goToProductDetail = (productId) => {
  navigateTo(`/product/${productId}`);
};

const quickAddToCart = (product) => {
  addToCart(product, 1);
  // Feedback visual opcional
  console.log(`${product.name} adicionado ao carrinho!`);
};

const calculateDiscountPrice = (product) => {
  if (product.discount) {
    return product.price * (1 - product.discount / 100);
  }
  return product.price;
};

const quickView = (product) => {
  // Implemente modal de visualização rápida
  console.log("Quick view:", product);
};

useHead({
  title: "Cardápio",
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
