<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Gestão de Produtos</h1>
        <p class="mt-2 text-gray-600">Gerencie o cardápio do seu restaurante</p>
      </div>
      <button
        @click="showProductModal = true"
        class="btn-primary flex items-center space-x-2"
      >
        <Icon name="heroicons:plus" class="w-4 h-4" />
        <span>Novo Produto</span>
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-6">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar produtos..."
            class="input-field"
          />
        </div>
        <div class="sm:w-48">
          <select v-model="selectedCategory" class="input-field">
            <option value="">Todas as categorias</option>
            <option value="Lanches">Lanches</option>
            <option value="Bebidas">Bebidas</option>
            <option value="Sobremesas">Sobremesas</option>
            <option value="Pratos Principais">Pratos Principais</option>
            <option value="Acompanhamentos">Acompanhamentos</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Products Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <StoreProductCard
        v-for="product in filteredProducts"
        :key="product.id"
        :product="product"
        @edit-product="editProduct"
        @toggle-availability="toggleAvailability"
        @view-details="viewProductDetails"
        @duplicate-product="duplicateProduct"
        @view-stats="viewProductStats"
      />
    </div>

    <!-- Product Modal -->
    <div
      v-if="showProductModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div
        class="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ editingProduct ? "Editar Produto" : "Novo Produto" }}
            </h3>
            <button
              @click="closeModal"
              class="text-gray-400 hover:text-gray-600"
            >
              <Icon name="heroicons:x-mark" class="w-6 h-6" />
            </button>
          </div>

          <form @submit.prevent="saveProduct" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Nome do Produto *</label
              >
              <input
                v-model="productForm.name"
                type="text"
                required
                class="input-field"
                placeholder="Ex: Hambúrguer Clássico"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Preço (R$) *</label
                >
                <input
                  v-model.number="productForm.price"
                  type="number"
                  step="0.01"
                  required
                  class="input-field"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Categoria *</label
                >
                <select
                  v-model="productForm.category"
                  required
                  class="input-field"
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="Lanches">Lanches</option>
                  <option value="Bebidas">Bebidas</option>
                  <option value="Sobremesas">Sobremesas</option>
                  <option value="Pratos Principais">Pratos Principais</option>
                  <option value="Acompanhamentos">Acompanhamentos</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Descrição *</label
              >
              <textarea
                v-model="productForm.description"
                required
                rows="3"
                class="input-field"
                placeholder="Descreva o produto..."
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >URL da Imagem</label
              >
              <input
                v-model="productForm.image"
                type="url"
                class="input-field"
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>

            <div class="flex items-center">
              <input
                v-model="productForm.available"
                type="checkbox"
                class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label class="ml-2 block text-sm text-gray-900"
                >Produto disponível</label
              >
            </div>

            <div class="flex space-x-3 pt-4">
              <button
                type="button"
                @click="closeModal"
                class="flex-1 btn-secondary"
              >
                Cancelar
              </button>
              <button type="submit" class="flex-1 btn-primary">
                {{ editingProduct ? "Salvar" : "Criar" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: "owner",
});

const { products } = useAppState();

const showProductModal = ref(false);
const editingProduct = ref(null);
const searchQuery = ref("");
const selectedCategory = ref("");

const productForm = reactive({
  name: "",
  price: 0,
  category: "",
  description: "",
  image: "",
  available: true,
});

const filteredProducts = computed(() => {
  let filtered = products.value;

  if (searchQuery.value) {
    filtered = filtered.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        product.description
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase())
    );
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(
      (product) => product.category === selectedCategory.value
    );
  }

  return filtered;
});

const editProduct = (product) => {
  editingProduct.value = product;
  Object.assign(productForm, product);
  showProductModal.value = true;
};

const toggleAvailability = (product) => {
  product.available = !product.available;
};

const saveProduct = () => {
  if (editingProduct.value) {
    // Update existing product
    Object.assign(editingProduct.value, productForm);
  } else {
    // Add new product
    const newProduct = {
      id: products.value.length + 1,
      ...productForm,
      rating: 4.5,
      prepTime: "20-30 min",
      ingredients: [],
    };
    products.value.push(newProduct);
  }
  closeModal();
};

const closeModal = () => {
  showProductModal.value = false;
  editingProduct.value = null;
  Object.assign(productForm, {
    name: "",
    price: 0,
    category: "",
    description: "",
    image: "",
    available: true,
  });
};

useHead({
  title: "Produtos",
});
</script>
