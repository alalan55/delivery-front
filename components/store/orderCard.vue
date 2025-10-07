<template>
  <div
    class="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
  >
    <!-- Header do Pedido -->
    <div
      class="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100"
    >
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-3">
            <div class="bg-orange-500 rounded-xl p-2">
              <Icon
                name="heroicons:shopping-bag-20-solid"
                class="w-5 h-5 text-white"
              />
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-900">
                Pedido #{{ order.id }}
              </h3>
              <p class="text-sm text-gray-500">{{ order.createdAt }}</p>
            </div>
          </div>
        </div>

        <div class="flex items-center space-x-3 mt-3 lg:mt-0">
          <!-- Badge de Status -->
          <span
            :class="[
              'inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-sm',
              order.status === 'Pendente'
                ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                : order.status === 'Preparando'
                ? 'bg-orange-100 text-orange-800 border border-orange-200'
                : order.status === 'Pronto'
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-blue-100 text-blue-800 border border-blue-200',
            ]"
          >
            <Icon
              :name="
                order.status === 'Pendente'
                  ? 'heroicons:clock-20-solid'
                  : order.status === 'Preparando'
                  ? 'heroicons:beaker-20-solid'
                  : order.status === 'Pronto'
                  ? 'heroicons:check-badge-20-solid'
                  : 'heroicons:truck-20-solid'
              "
              class="w-4 h-4 mr-2"
            />
            {{ order.status }}
          </span>

          <!-- Valor Total -->
          <div class="text-right">
            <p class="text-2xl font-bold text-green-600">
              R$ {{ order.total.toFixed(2) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Conteúdo Principal -->
    <div class="p-6">
      <!-- Informações do Cliente -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div class="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
          <div class="bg-orange-100 rounded-lg p-2">
            <Icon
              name="heroicons:user-20-solid"
              class="w-5 h-5 text-orange-600"
            />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Cliente</p>
            <p class="text-gray-900 font-semibold">{{ order.customer }}</p>
          </div>
        </div>

        <div class="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
          <div class="bg-blue-100 rounded-lg p-2">
            <Icon
              name="heroicons:phone-20-solid"
              class="w-5 h-5 text-blue-600"
            />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Telefone</p>
            <p class="text-gray-900 font-semibold">{{ order.phone }}</p>
          </div>
        </div>

        <div class="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
          <div class="bg-green-100 rounded-lg p-2">
            <Icon
              name="heroicons:map-pin-20-solid"
              class="w-5 h-5 text-green-600"
            />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Endereço</p>
            <p class="text-gray-900 font-semibold line-clamp-1">
              {{ order.address }}
            </p>
          </div>
        </div>
      </div>

      <!-- Itens do Pedido -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-4">
          <h4 class="text-lg font-bold text-gray-900">Itens do Pedido</h4>
          <span
            class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full"
          >
            {{ order.items.length }}
            {{ order.items.length === 1 ? "item" : "itens" }}
          </span>
        </div>

        <div class="space-y-3">
          <div
            v-for="item in order.items"
            :key="item.id"
            class="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center space-x-4 flex-1">
              <div
                class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center"
              >
                <Icon
                  name="heroicons:cube-20-solid"
                  class="w-6 h-6 text-gray-400"
                />
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-gray-900 truncate">
                  {{ item.name }}
                </p>
                <p class="text-sm text-gray-500">
                  R$ {{ item.price.toFixed(2) }} cada
                </p>
              </div>
            </div>

            <div class="flex items-center space-x-6">
              <span
                class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full"
              >
                {{ item.quantity }}x
              </span>
              <span class="text-lg font-bold text-gray-900">
                R$ {{ (item.price * item.quantity).toFixed(2) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Ações do Pedido -->
      <div
        class="flex flex-col lg:flex-row lg:items-center lg:justify-between pt-6 border-t border-gray-100"
      >
        <!-- Informações Adicionais -->
        <div
          class="flex items-center space-x-4 text-sm text-gray-500 mb-4 lg:mb-0"
        >
          <div class="flex items-center space-x-2">
            <Icon name="heroicons:clock-20-solid" class="w-4 h-4" />
            <span>Criado em {{ order.createdAt }}</span>
          </div>
          <div v-if="order.estimatedTime" class="flex items-center space-x-2">
            <Icon name="heroicons:rocket-launch-20-solid" class="w-4 h-4" />
            <span>Entrega: {{ order.estimatedTime }}</span>
          </div>
        </div>

        <!-- Botões de Ação -->
        <div
          class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3"
        >
          <!-- Botão Detalhes -->
          <UButton
            @click="emit('show-order-details', order)"
            color="gray"
            variant="outline"
            :ui="{ rounded: 'rounded-xl' }"
            class="flex items-center space-x-2"
          >
            <Icon name="heroicons:eye-20-solid" class="w-4 h-4" />
            <span>Ver Detalhes</span>
          </UButton>

          <!-- Progressão do Status -->
          <div class="flex space-x-2">
            <UButton
              v-if="order.status === 'Pendente'"
              @click="
                emit('update-status', { id: order.id, status: 'Preparando' })
              "
              color="orange"
              variant="solid"
              :ui="{ rounded: 'rounded-xl' }"
              class="flex items-center space-x-2 shadow-lg shadow-orange-200 hover:shadow-xl transition-all"
            >
              <Icon name="heroicons:play-20-solid" class="w-4 h-4" />
              <span>Iniciar Preparo</span>
            </UButton>

            <UButton
              v-if="order.status === 'Preparando'"
              @click="emit('update-status', { id: order.id, status: 'Pronto' })"
              color="green"
              variant="solid"
              :ui="{ rounded: 'rounded-xl' }"
              class="flex items-center space-x-2 shadow-lg shadow-green-200 hover:shadow-xl transition-all"
            >
              <Icon name="heroicons:check-20-solid" class="w-4 h-4" />
              <span>Marcar Pronto</span>
            </UButton>

            <UButton
              v-if="order.status === 'Pronto'"
              @click="
                emit('update-status', { id: order.id, status: 'Entregue' })
              "
              color="blue"
              variant="solid"
              :ui="{ rounded: 'rounded-xl' }"
              class="flex items-center space-x-2 shadow-lg shadow-blue-200 hover:shadow-xl transition-all"
            >
              <Icon name="heroicons:truck-20-solid" class="w-4 h-4" />
              <span>Entregar</span>
            </UButton>
          </div>
        </div>
      </div>

      <!-- Timeline do Pedido (Opcional) -->
      <div v-if="order.timeline" class="mt-6 pt-6 border-t border-gray-100">
        <h5 class="text-sm font-medium text-gray-700 mb-3">
          Histórico do Pedido
        </h5>
        <div class="flex items-center space-x-4 text-xs text-gray-500">
          <div
            v-for="event in order.timeline"
            :key="event.time"
            class="flex items-center space-x-2"
          >
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>{{ event.action }}</span>
            <span class="text-gray-400">{{ event.time }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["show-order-details", "update-status"]);

const props = defineProps({
  order: {
    type: Object,
    required: true,
  },
});
</script>

<style></style>
