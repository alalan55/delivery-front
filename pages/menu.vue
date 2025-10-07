<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Cardápio</h1>
      <p class="mt-2 text-gray-600">Descubra nossos deliciosos pratos</p>
    </div>

    <!-- Search and Filters -->
    <!-- <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-6">
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
    </div> -->

    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
      <!-- Layout Principal -->
      <div
        class="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between"
      >
        <!-- Busca -->
        <div class="flex-1 w-full min-w-0">
          <UInput
            v-model="searchQuery"
            placeholder="Buscar pratos, ingredientes..."
            icon="i-heroicons-magnifying-glass-20-solid"
            size="lg"
            :ui="{
              base: 'w-full',
              icon: {
                base: 'text-orange-500',
              },
              padding: {
                lg: 'px-4 py-3',
              },
            }"
            autocomplete="off"
          >
            <template #trailing>
              <UButton
                v-if="searchQuery"
                color="gray"
                variant="ghost"
                icon="i-heroicons-x-mark-20-solid"
                :padded="false"
                @click="searchQuery = ''"
              />
            </template>
          </UInput>
        </div>

        <!-- Filtros e Ordenação -->
        <div class="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <!-- Filtro por Categoria -->
          <USelectMenu
            v-model="selectedCategory"
            :options="categoryOptions"
            placeholder="Todas as categorias"
            size="lg"
            :ui="{
              width: 'w-full sm:w-48',
            }"
          >
            <template #label>
              <div class="flex items-center gap-2">
                <UIcon
                  name="i-heroicons-tag-20-solid"
                  class="w-4 h-4 text-orange-500"
                />
                <span>{{ selectedCategory || "Categorias" }}</span>
              </div>
            </template>
          </USelectMenu>

          <!-- Ordenação -->
          <USelectMenu
            v-model="selectedSort"
            :options="sortOptions"
            placeholder="Ordenar por"
            size="lg"
            :ui="{
              width: 'w-full sm:w-48',
            }"
          >
            <template #label>
              <div class="flex items-center gap-2">
                <UIcon
                  name="i-heroicons-bars-arrow-down-20-solid"
                  class="w-4 h-4 text-orange-500"
                />
                <span>{{ getSortLabel(selectedSort) }}</span>
              </div>
            </template>
          </USelectMenu>

          <!-- Botão de Filtros Avançados -->
          <UButton
            color="orange"
            variant="outline"
            icon="i-heroicons-funnel-20-solid"
            size="lg"
            @click="showAdvancedFilters = !showAdvancedFilters"
          >
            Filtros
          </UButton>
        </div>
      </div>

      <!-- Filtros Avançados -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 max-h-0"
        enter-to-class="opacity-100 max-h-96"
        leave-active-class="transition-all duration-300 ease-in"
        leave-from-class="opacity-100 max-h-96"
        leave-to-class="opacity-0 max-h-0"
      >
        <div
          v-if="showAdvancedFilters"
          class="mt-6 pt-6 border-t border-gray-100"
        >
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Faixa de Preço -->
            <div>
              <label class="text-sm font-medium text-gray-700 mb-3 block"
                >Faixa de Preço</label
              >
              <div class="space-y-3">
                <URange
                  v-model="priceRange"
                  :min="0"
                  :max="100"
                  :step="5"
                  :ui="{
                    track: {
                      background: 'bg-gray-200',
                    },
                    range: {
                      background: 'bg-orange-500',
                    },
                  }"
                />
                <div class="flex justify-between text-sm text-gray-600">
                  <span>R$ {{ (priceRange[0] * 10).toFixed(2) }}</span>
                  <span>R$ {{ (priceRange[1] * 10).toFixed(2) }}</span>
                </div>
              </div>
            </div>

            <!-- Avaliação Mínima -->
            <div>
              <label class="text-sm font-medium text-gray-700 mb-3 block"
                >Avaliação Mínima</label
              >
              <div class="flex items-center gap-2">
                <URating
                  v-model="minRating"
                  :max="5"
                  size="sm"
                  color="orange"
                />
                <span class="text-sm text-gray-600 ml-2">{{ minRating }}+</span>
              </div>
            </div>

            <!-- Filtros Rápidos -->
            <div>
              <label class="text-sm font-medium text-gray-700 mb-3 block"
                >Mais Opções</label
              >
              <div class="flex flex-wrap gap-2">
                <UButton
                  v-for="filter in quickFilters"
                  :key="filter.key"
                  :color="filter.active ? 'orange' : 'gray'"
                  :variant="filter.active ? 'solid' : 'outline'"
                  size="xs"
                  @click="toggleQuickFilter(filter)"
                >
                  <UIcon :name="filter.icon" class="w-3 h-3 mr-1" />
                  {{ filter.label }}
                </UButton>
              </div>
            </div>
          </div>

          <!-- Ações dos Filtros -->
          <div
            class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100"
          >
            <UButton color="gray" variant="ghost" @click="resetFilters">
              Limpar Filtros
            </UButton>
            <UButton color="orange" @click="applyFilters">
              Aplicar Filtros
            </UButton>
          </div>
        </div>
      </Transition>

      <!-- Categorias Rápidas -->
      <div class="mt-6 pt-6 border-t border-gray-100">
        <div class="flex flex-wrap gap-2">
          <UButton
            v-for="category in categories"
            :key="category"
            :color="selectedCategory === category ? 'orange' : 'gray'"
            :variant="selectedCategory === category ? 'solid' : 'outline'"
            size="sm"
            :ui="{
              rounded: 'rounded-full',
            }"
            @click="toggleCategory(category)"
          >
            {{ category }}
          </UButton>
        </div>
      </div>

      <!-- Status dos Filtros Ativos -->
      <div
        v-if="hasActiveFilters"
        class="mt-4 flex flex-wrap gap-2 items-center"
      >
        <span class="text-sm text-gray-600">Filtros ativos:</span>
        <UBadge
          v-if="selectedCategory"
          color="orange"
          variant="subtle"
          :ui="{ rounded: 'rounded-full' }"
        >
          {{ selectedCategory }}
          <UIcon
            name="i-heroicons-x-mark-20-solid"
            class="w-3 h-3 ml-1 cursor-pointer"
            @click="selectedCategory = null"
          />
        </UBadge>

        <UBadge
          v-if="searchQuery"
          color="gray"
          variant="subtle"
          :ui="{ rounded: 'rounded-full' }"
        >
          "{{ searchQuery }}"
          <UIcon
            name="i-heroicons-x-mark-20-solid"
            class="w-3 h-3 ml-1 cursor-pointer"
            @click="searchQuery = ''"
          />
        </UBadge>

        <UButton
          v-if="hasActiveFilters"
          color="gray"
          variant="ghost"
          size="xs"
          @click="resetFilters"
        >
          Limpar todos
        </UButton>
      </div>
    </div>

    <!-- Products Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ConsumerProductCart
        v-for="product in filteredProducts"
        :key="product.id"
        :product="product"
        @quick-add-to-cart="quickAddToCart"
        @add-to-cart="quickAddToCart"
        @quick-view="quickView"
      />
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
    <ConsumerFloatingCart :cartCount="cartCount" :cartTotal="cartTotal" />
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

const selectedSort = ref("name_asc");
const showAdvancedFilters = ref(false);
const priceRange = ref([0, 100]);
const minRating = ref(0);

const categories = [
  "Todos",
  "Lanches",
  "Bebidas",
  "Sobremesas",
  "Pratos Principais",
  "Acompanhamentos",
];

const categoryOptions = [
  { value: null, label: "Todas as categorias" },
  ...categories
    .filter((cat) => cat !== "Todos")
    .map((cat) => ({ value: cat, label: cat })),
];

const sortOptions = [
  { value: "name_asc", label: "Nome (A-Z)" },
  { value: "name_desc", label: "Nome (Z-A)" },
  { value: "price_asc", label: "Preço (Menor)" },
  { value: "price_desc", label: "Preço (Maior)" },
  { value: "rating_desc", label: "Melhor Avaliado" },
];

const quickFilters = ref([
  {
    key: "available",
    label: "Disponível",
    icon: "i-heroicons-check-badge-20-solid",
    active: false,
  },
  {
    key: "discount",
    label: "Com Desconto",
    icon: "i-heroicons-tag-20-solid",
    active: false,
  },
  {
    key: "freeShipping",
    label: "Frete Grátis",
    icon: "i-heroicons-truck-20-solid",
    active: false,
  },
  {
    key: "featured",
    label: "Destaques",
    icon: "i-heroicons-star-20-solid",
    active: false,
  },
]);

// Computed
const hasActiveFilters = computed(() => {
  return (
    searchQuery.value ||
    selectedCategory.value ||
    minRating.value > 0 ||
    quickFilters.value.some((filter) => filter.active) ||
    priceRange.value[0] > 0 ||
    priceRange.value[1] < 100
  );
});

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

// Métodos
const toggleCategory = (category) => {
  selectedCategory.value =
    selectedCategory.value === category ? null : category;
};

const toggleQuickFilter = (filter) => {
  filter.active = !filter.active;
};

const getSortLabel = (sortValue) => {
  const option = sortOptions.find((opt) => opt.value === sortValue);
  return option ? option.label : "Ordenar por";
};

const resetFilters = () => {
  searchQuery.value = "";
  selectedCategory.value = null;
  selectedSort.value = "name_asc";
  priceRange.value = [0, 100];
  minRating.value = 0;
  quickFilters.value.forEach((filter) => (filter.active = false));
};

const applyFilters = () => {
  showAdvancedFilters.value = false;
  // Aqui você pode emitir um evento ou chamar a função que atualiza os produtos
};

const quickAddToCart = (product) => {
  addToCart(product, 1);
  // Feedback visual opcional
  console.log(`${product.name} adicionado ao carrinho!`);
};

const quickView = (product) => {
  // Implemente modal de visualização rápida
  console.log("Quick view:", product);
};

watch(
  [searchQuery, selectedCategory, selectedSort, priceRange, minRating],
  () => {
    applyFilters();
  },
  { debounce: 300, deep: true }
);

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
