<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Gestão de Pedidos</h1>
      <p class="mt-2 text-gray-600">Acompanhe e gerencie todos os pedidos</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
      <div class="bg-white rounded-lg shadow-md p-4 border border-gray-200 text-center">
        <p class="text-2xl font-bold text-gray-900">{{ dashboardStats.totalOrders }}</p>
        <p class="text-sm text-gray-600">Total</p>
      </div>
      <div class="bg-white rounded-lg shadow-md p-4 border border-gray-200 text-center">
        <p class="text-2xl font-bold text-yellow-600">{{ dashboardStats.pendingOrders }}</p>
        <p class="text-sm text-gray-600">Pendentes</p>
      </div>
      <div class="bg-white rounded-lg shadow-md p-4 border border-gray-200 text-center">
        <p class="text-2xl font-bold text-orange-600">{{ dashboardStats.preparingOrders }}</p>
        <p class="text-sm text-gray-600">Preparando</p>
      </div>
      <div class="bg-white rounded-lg shadow-md p-4 border border-gray-200 text-center">
        <p class="text-2xl font-bold text-green-600">{{ dashboardStats.readyOrders }}</p>
        <p class="text-sm text-gray-600">Prontos</p>
      </div>
      <div class="bg-white rounded-lg shadow-md p-4 border border-gray-200 text-center">
        <p class="text-2xl font-bold text-blue-600">{{ dashboardStats.deliveredOrders }}</p>
        <p class="text-sm text-gray-600">Entregues</p>
      </div>
      <div class="bg-white rounded-lg shadow-md p-4 border border-gray-200 text-center">
        <p class="text-2xl font-bold text-green-600">R$ {{ dashboardStats.totalRevenue.toFixed(2) }}</p>
        <p class="text-sm text-gray-600">Receita</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-6">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="sm:w-48">
          <select v-model="selectedStatus" class="input-field">
            <option value="">Todos os status</option>
            <option value="Pendente">Pendente</option>
            <option value="Preparando">Preparando</option>
            <option value="Pronto">Pronto</option>
            <option value="Entregue">Entregue</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Orders List -->
    <div class="space-y-4">
      <StoreOrderCard
        v-for="order in filteredOrders"
        :key="order.id"
        :order="order"
        @show-order-details="showOrderDetails"
        @update-status="updateStatus"
      />
      <!-- <div 
        v-for="order in filteredOrders" 
        :key="order.id"
        class="bg-white rounded-lg shadow-md border border-gray-200 p-6"
      >
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-4 mb-4">
              <h3 class="text-lg font-semibold text-gray-900">Pedido #{{ order.id }}</h3>
              <span 
                :class="[
                  'inline-flex px-3 py-1 text-sm font-medium rounded-full',
                  order.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'Preparando' ? 'bg-orange-100 text-orange-800' :
                  order.status === 'Pronto' ? 'bg-green-100 text-green-800' :
                  'bg-blue-100 text-blue-800'
                ]"
              >
                {{ order.status }}
              </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div class="flex items-center space-x-2">
                <Icon name="heroicons:user" class="w-4 h-4 text-gray-400" />
                <span class="text-sm text-gray-600">{{ order.customer }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <Icon name="heroicons:phone" class="w-4 h-4 text-gray-400" />
                <span class="text-sm text-gray-600">{{ order.phone }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <Icon name="heroicons:clock" class="w-4 h-4 text-gray-400" />
                <span class="text-sm text-gray-600">{{ order.createdAt }}</span>
              </div>
            </div>

            <div class="flex items-start space-x-2 mb-4">
              <Icon name="heroicons:map-pin" class="w-4 h-4 text-gray-400 mt-0.5" />
              <span class="text-sm text-gray-600">{{ order.address }}</span>
            </div>

            <div class="mb-4">
              <h4 class="text-sm font-medium text-gray-900 mb-2">Itens do Pedido:</h4>
              <div class="space-y-1">
                <div 
                  v-for="item in order.items" 
                  :key="item.id"
                  class="flex justify-between text-sm"
                >
                  <span class="text-gray-600">{{ item.quantity }}x {{ item.name }}</span>
                  <span class="text-gray-900">R$ {{ (item.price * item.quantity).toFixed(2) }}</span>
                </div>
              </div>
            </div>

            <div class="flex justify-between items-center">
              <span class="text-lg font-bold text-gray-900">Total: R$ {{ order.total.toFixed(2) }}</span>
            </div>
          </div>

          <div class="mt-4 lg:mt-0 lg:ml-6 flex flex-col space-y-2">
            <button 
              @click="showOrderDetails(order)"
              class="btn-secondary text-sm"
            >
              Ver Detalhes
            </button>
            <div class="flex space-x-2">
              <button 
                v-if="order.status === 'Pendente'"
                @click="updateStatus(order.id, 'Preparando')"
                class="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm"
              >
                Preparar
              </button>
              <button 
                v-if="order.status === 'Preparando'"
                @click="updateStatus(order.id, 'Pronto')"
                class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
              >
                Pronto
              </button>
              <button 
                v-if="order.status === 'Pronto'"
                @click="updateStatus(order.id, 'Entregue')"
                class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
              >
                Entregue
              </button>
            </div>
          </div>
        </div>
      </div> -->
    </div>

    <!-- Order Details Modal -->
    <div v-if="selectedOrder" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Detalhes do Pedido #{{ selectedOrder.id }}</h3>
            <button 
              @click="selectedOrder = null"
              class="text-gray-400 hover:text-gray-600"
            >
              <Icon name="heroicons:x-mark" class="w-6 h-6" />
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <h4 class="font-medium text-gray-900 mb-2">Informações do Cliente</h4>
              <div class="bg-gray-50 p-3 rounded-lg space-y-1">
                <p class="text-sm"><strong>Nome:</strong> {{ selectedOrder.customer }}</p>
                <p class="text-sm"><strong>Telefone:</strong> {{ selectedOrder.phone }}</p>
                <p class="text-sm"><strong>Endereço:</strong> {{ selectedOrder.address }}</p>
              </div>
            </div>

            <div>
              <h4 class="font-medium text-gray-900 mb-2">Itens do Pedido</h4>
              <div class="space-y-2">
                <div 
                  v-for="item in selectedOrder.items" 
                  :key="item.id"
                  class="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p class="font-medium text-gray-900">{{ item.name }}</p>
                    <p class="text-sm text-gray-600">Quantidade: {{ item.quantity }}</p>
                  </div>
                  <p class="font-medium text-gray-900">R$ {{ (item.price * item.quantity).toFixed(2) }}</p>
                </div>
              </div>
            </div>

            <div class="border-t pt-4">
              <div class="flex justify-between items-center">
                <span class="text-lg font-bold text-gray-900">Total:</span>
                <span class="text-lg font-bold text-gray-900">R$ {{ selectedOrder.total.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'owner'
})

const { orders, dashboardStats, updateOrderStatus } = useAppState()

const selectedStatus = ref('')
const selectedOrder = ref(null)

const filteredOrders = computed(() => {
  if (!selectedStatus.value) return orders.value
  return orders.value.filter(order => order.status === selectedStatus.value)
})

const updateStatus = (orderId, status) => {
  updateOrderStatus(orderId, status)
}

const showOrderDetails = (order) => {
  selectedOrder.value = order
}

useHead({
  title: 'Pedidos'
})
</script>
