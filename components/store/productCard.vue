<template>
  <div
    class="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
  >
    <!-- Container da Imagem -->
    <div class="relative overflow-hidden">
      <img
        :src="product.image"
        :alt="product.name"
        class="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
      />

      <!-- Badge de Status -->
      <div class="absolute top-3 right-3">
        <span
          :class="[
            'inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg',
            product.available
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white',
          ]"
        >
          <Icon
            :name="
              product.available
                ? 'heroicons:check-badge-20-solid'
                : 'heroicons:x-circle-20-solid'
            "
            class="w-3 h-3 mr-1"
          />
          {{ product.available ? "Disponível" : "Indisponível" }}
        </span>
      </div>

      <!-- Badge de Categoria -->
      <div class="absolute top-3 left-3">
        <span
          class="bg-black bg-opacity-70 text-white text-xs font-medium px-2 py-1 rounded-full"
        >
          {{ product.category }}
        </span>
      </div>
    </div>

    <!-- Conteúdo do Card -->
    <div class="p-5">
      <!-- Nome do Produto -->
      <h3
        class="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-orange-600 transition-colors"
      >
        {{ product.name }}
      </h3>

      <!-- Descrição -->
      <p class="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
        {{ product.description }}
      </p>

      <!-- Preço e Informações -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-baseline space-x-2">
          <span class="text-2xl font-bold text-green-600">
            R$ {{ product.price.toFixed(2) }}
          </span>
          <span
            v-if="product.originalPrice"
            class="text-sm text-gray-400 line-through"
          >
            R$ {{ product.originalPrice.toFixed(2) }}
          </span>
        </div>

        <!-- Estoque -->
        <div
          v-if="product.stock !== undefined"
          class="flex items-center space-x-1 text-sm text-gray-500"
        >
          <Icon name="heroicons:archive-box-20-solid" class="w-4 h-4" />
          <span>{{ product.stock }} uni</span>
        </div>
      </div>

      <!-- Estatísticas (opcional) -->
      <div
        v-if="product.salesCount !== undefined"
        class="flex items-center justify-between text-xs text-gray-500 mb-4"
      >
        <div class="flex items-center space-x-1">
          <Icon name="heroicons:chart-bar-20-solid" class="w-3 h-3" />
          <span>{{ product.salesCount }} vendas</span>
        </div>
        <div class="flex items-center space-x-1">
          <Icon
            name="heroicons:star-20-solid"
            class="w-3 h-3 text-yellow-400"
          />
          <span>{{ product.rating || "4.5" }}</span>
        </div>
      </div>

      <!-- Ações Principais -->
      <div class="flex space-x-3">
        <button
          @click.stop="emit('edit-product', product)"
          class="flex-1 flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-md group/edit"
        >
          <Icon
            name="heroicons:pencil-20-solid"
            class="w-4 h-4 transition-transform group-hover/edit:scale-110"
          />
          <span>Editar</span>
        </button>

        <button
          @click.stop="emit('toggle-availability', product)"
          :class="[
            'flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-md',
            product.available
              ? 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
              : 'bg-green-50 hover:bg-green-100 text-green-700 border border-green-200',
          ]"
        >
          <Icon
            :name="
              product.available
                ? 'heroicons:no-symbol-20-solid'
                : 'heroicons:check-20-solid'
            "
            class="w-4 h-4"
          />
          <span>{{ product.available ? "Desativar" : "Ativar" }}</span>
        </button>
      </div>

      <!-- Ações Rápidas Adicionais -->
      <div
        class="flex justify-center space-x-4 mt-4 pt-4 border-t border-gray-100"
      >
        <button
          @click.stop="emit('view-details', product)"
          class="text-xs text-gray-500 hover:text-orange-600 transition-colors flex items-center space-x-1"
        >
          <Icon name="heroicons:eye-20-solid" class="w-3 h-3" />
          <span>Detalhes</span>
        </button>

        <button
          @click.stop="emit('duplicate-product', product)"
          class="text-xs text-gray-500 hover:text-blue-600 transition-colors flex items-center space-x-1"
        >
          <Icon name="heroicons:document-duplicate-20-solid" class="w-3 h-3" />
          <span>Duplicar</span>
        </button>

        <button
          @click.stop="emit('view-stats', product)"
          class="text-xs text-gray-500 hover:text-purple-600 transition-colors flex items-center space-x-1"
        >
          <Icon name="heroicons:chart-bar-square-20-solid" class="w-3 h-3" />
          <span>Estatísticas</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const router = useRouter();

const emit = defineEmits([
  "edit-product",
  "toggle-availability",
  "view-details",
  "duplicate-product",
  "view-stats",
]);
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
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
