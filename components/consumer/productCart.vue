<template>
  <div
    class="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 relative"
    @click="router.push(`/product/${product.id}`)"
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
          @click.stop="emit('quick-view', product)"
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
          <Icon name="heroicons:star-solid" class="w-4 h-4 text-yellow-400" />
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
          <span :class="product.available ? 'text-green-600' : 'text-red-600'">
            {{ product.available ? "Em estoque" : "Esgotado" }}
          </span>
        </div>

        <button
          @click.stop="emit('add-to-cart', product)"
          :disabled="!product.available"
          :class="[
            'flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105',
            product.available
              ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed',
          ]"
        >
          <Icon name="heroicons:plus" class="w-4 h-4" />
          <span>{{ product.available ? "Adicionar" : "Indisponível" }}</span>
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
</template>

<script setup>
const emit = defineEmits(["quick-view", "add-to-cart"]);

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const router = useRouter();

function calculateDiscountPrice(product) {
  if (product.discount) {
    return product.price * (1 - product.discount / 100);
  }
  return product.price;
}
</script>

<style>
.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>
