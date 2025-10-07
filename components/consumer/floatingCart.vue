<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 translate-y-10"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-300 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-10"
  >
    <div
      v-if="cartCount > 0"
      class="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto"
    >
      <UCard
        class="shadow-2xl border-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white overflow-hidden"
        :ui="{
          body: { base: 'p-4' },
          background: 'bg-transparent',
        }"
      >
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-10">
          <div
            class="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-20"
          ></div>
        </div>

        <div class="relative z-10">
          <div class="flex items-center justify-between">
            <!-- Informações do Carrinho -->
            <div class="flex items-center space-x-4 flex-1">
              <!-- Ícone do Carrinho com Badge -->
              <div class="relative">
                <div class="relative">
                  <UIcon
                    name="i-heroicons-shopping-cart-20-solid"
                    class="w-8 h-8 text-white"
                  />
                  <UBadge
                    :value="cartCount"
                    color="white"
                    variant="solid"
                    :ui="{
                      rounded: 'rounded-full',
                      font: 'text-xs font-bold',
                    }"
                    class="absolute -top-2 -right-2 min-w-6 h-6 flex items-center justify-center"
                  />
                </div>
              </div>

              <!-- Detalhes -->
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-white truncate">
                  {{ cartCount }} {{ cartCount === 1 ? "item" : "itens" }} no
                  carrinho
                </p>
                <div class="flex items-center space-x-2 mt-1">
                  <UIcon
                    name="i-heroicons-currency-dollar-20-solid"
                    class="w-4 h-4 text-orange-100"
                  />
                  <p class="text-orange-100 font-medium text-sm">
                    Total: R$ {{ cartTotal.toFixed(2) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Ações -->
            <div class="flex items-center space-x-3 ml-4">
              <!-- Botão Fechar (Mobile) -->
              <UButton
                v-if="isMobile"
                color="white"
                variant="ghost"
                icon="i-heroicons-x-mark-20-solid"
                :padded="false"
                class="flex-shrink-0 text-white hover:bg-white hover:bg-opacity-20"
                @click="closeCart"
              />

              <!-- Botão Ver Carrinho -->
              <UButton
                to="/cart"
                color="white"
                variant="solid"
                :ui="{
                  rounded: 'rounded-xl',
                }"
                class="font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <template #leading>
                  <UIcon name="i-heroicons-eye-20-solid" class="w-4 h-4" />
                </template>
                Ver Carrinho
              </UButton>
            </div>
          </div>

          <!-- Progresso de Frete Grátis -->
          <div
            v-if="showShippingProgress"
            class="mt-3 pt-3 border-t border-orange-400 border-opacity-40"
          >
            <div class="flex justify-between items-center text-xs mb-2">
              <span class="text-orange-100">
                {{ getShippingProgressText() }}
              </span>
              <span class="text-white font-semibold">
                R$ {{ remainingForFreeShipping.toFixed(2) }}
              </span>
            </div>
            <UProgress
              :value="shippingProgress"
              size="xs"
              color="white"
              :ui="{
                rounded: 'rounded-full',
                background: 'bg-white bg-opacity-30',
              }"
            />
          </div>

          <!-- Items Recentes (Expandable) -->
          <div
            v-if="showRecentItems && recentCartItems.length > 0"
            class="mt-3"
          >
            <UButton
              color="white"
              variant="ghost"
              :ui="{ rounded: 'rounded-lg' }"
              class="w-full justify-between text-white hover:bg-white hover:bg-opacity-20"
              @click="showItemsList = !showItemsList"
            >
              <span class="text-sm">Itens adicionados</span>
              <UIcon
                :name="
                  showItemsList
                    ? 'i-heroicons-chevron-up-20-solid'
                    : 'i-heroicons-chevron-down-20-solid'
                "
                class="w-4 h-4 transition-transform duration-300"
              />
            </UButton>

            <Transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 max-h-0"
              enter-to-class="opacity-100 max-h-32"
              leave-active-class="transition-all duration-300 ease-in"
              leave-from-class="opacity-100 max-h-32"
              leave-to-class="opacity-0 max-h-0"
            >
              <div v-if="showItemsList" class="mt-2 space-y-2 overflow-hidden">
                <div
                  v-for="item in recentCartItems"
                  :key="item.id"
                  class="flex items-center space-x-3 bg-white bg-opacity-10 rounded-lg p-2"
                >
                  <img
                    :src="item.image"
                    :alt="item.name"
                    class="w-8 h-8 rounded-lg object-cover"
                  />
                  <div class="flex-1 min-w-0">
                    <p class="text-white text-sm font-medium truncate">
                      {{ item.name }}
                    </p>
                    <p class="text-orange-100 text-xs">
                      R$ {{ item.price.toFixed(2) }} × {{ item.quantity }}
                    </p>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </UCard>

      <!-- Botão Flutuante para Mobile -->
      <div v-if="isMobile" class="flex justify-center mt-3">
        <UButton
          color="white"
          variant="solid"
          icon="i-heroicons-chevron-down-20-solid"
          :ui="{ rounded: 'rounded-full' }"
          class="w-10 h-10 shadow-lg"
          @click="closeCart"
        />
      </div>
    </div>
  </Transition>
</template>

<script setup>
const props = defineProps({
  cartCount: {
    type: Number,
    default: 0,
  },
  cartTotal: {
    type: Number,
    default: 0,
  },
});

const showItemsList = ref(false);
const isMobile = ref(false);

// Dados de exemplo para demonstração
const recentCartItems = ref([
  {
    id: 1,
    name: "Pizza Margherita",
    price: 45.9,
    quantity: 1,
    image: "/images/pizza-margherita.jpg",
  },
  {
    id: 2,
    name: "Coca-Cola Lata",
    price: 6.5,
    quantity: 2,
    image: "/images/coca-cola.jpg",
  },
]);

// Configuração de frete grátis
const freeShippingThreshold = 100;
const remainingForFreeShipping = computed(() => {
  return Math.max(0, freeShippingThreshold - props.cartTotal);
});

const shippingProgress = computed(() => {
  return Math.min(100, (props.cartTotal / freeShippingThreshold) * 100);
});

const showShippingProgress = computed(() => {
  return props.cartTotal < freeShippingThreshold && props.cartTotal > 0;
});

const showRecentItems = computed(() => {
  return recentCartItems.value.length > 0;
});

// Métodos
const getShippingProgressText = () => {
  if (remainingForFreeShipping.value === 0) {
    return "🎉 Frete grátis liberado!";
  }
  return `Faltam R$ ${remainingForFreeShipping.value.toFixed(
    2
  )} para frete grátis`;
};

const closeCart = () => {
  // Implemente lógica para fechar/minimizar o carrinho
  console.log("Fechar carrinho");
};

// Detectar mobile
onMounted(() => {
  isMobile.value = window.innerWidth < 768;
  window.addEventListener("resize", () => {
    isMobile.value = window.innerWidth < 768;
  });
});

// Auto-close após algum tempo (opcional)
watch(
  () => props.cartCount,
  (newCount, oldCount) => {
    if (newCount > oldCount) {
      // Reset do timer quando adiciona novo item
      if (autoCloseTimer) {
        clearTimeout(autoCloseTimer);
      }

      // Auto-close após 10 segundos (apenas mobile)
      if (isMobile.value) {
        autoCloseTimer = setTimeout(() => {
          closeCart();
        }, 10000);
      }
    }
  }
);

let autoCloseTimer = null;

onUnmounted(() => {
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer);
  }
});
</script>

<style></style>
