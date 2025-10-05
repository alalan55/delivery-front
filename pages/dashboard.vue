<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p class="mt-2 text-gray-600">Visão geral do seu restaurante</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <Icon name="heroicons:clipboard-document-list" class="w-8 h-8 text-blue-500" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total de Pedidos</p>
            <p class="text-2xl font-bold text-gray-900">{{ dashboardStats.totalOrders }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <Icon name="heroicons:clock" class="w-8 h-8 text-yellow-500" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Pendentes</p>
            <p class="text-2xl font-bold text-gray-900">{{ dashboardStats.pendingOrders }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <Icon name="heroicons:fire" class="w-8 h-8 text-orange-500" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Preparando</p>
            <p class="text-2xl font-bold text-gray-900">{{ dashboardStats.preparingOrders }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <Icon name="heroicons:banknotes" class="w-8 h-8 text-green-500" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Receita Total</p>
            <p class="text-2xl font-bold text-gray-900">R$ {{ dashboardStats.totalRevenue.toFixed(2) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts and Recent Orders -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Status Chart -->
      <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Status dos Pedidos</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
              <span class="text-sm text-gray-600">Pendentes</span>
            </div>
            <span class="text-sm font-medium text-gray-900">{{ dashboardStats.pendingOrders }}</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
              <span class="text-sm text-gray-600">Preparando</span>
            </div>
            <span class="text-sm font-medium text-gray-900">{{ dashboardStats.preparingOrders }}</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span class="text-sm text-gray-600">Prontos</span>
            </div>
            <span class="text-sm font-medium text-gray-900">{{ dashboardStats.readyOrders }}</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
              <span class="text-sm text-gray-600">Entregues</span>
            </div>
            <span class="text-sm font-medium text-gray-900">{{ dashboardStats.deliveredOrders }}</span>
          </div>
        </div>
      </div>

      <!-- Recent Orders -->
      <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Pedidos Recentes</h3>
          <NuxtLink to="/orders" class="text-orange-600 hover:text-orange-700 text-sm font-medium">
            Ver todos
          </NuxtLink>
        </div>
        <div class="space-y-4">
          <div v-for="order in recentOrders" :key="order.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p class="text-sm font-medium text-gray-900">Pedido #{{ order.id }}</p>
              <p class="text-xs text-gray-600">{{ order.customer }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium text-gray-900">R$ {{ order.total.toFixed(2) }}</p>
              <span 
                :class="[
                  'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                  order.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'Preparando' ? 'bg-orange-100 text-orange-800' :
                  order.status === 'Pronto' ? 'bg-green-100 text-green-800' :
                  'bg-blue-100 text-blue-800'
                ]"
              >
                {{ order.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="mt-8">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <NuxtLink 
          to="/products" 
          class="flex items-center p-4 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
        >
          <Icon name="heroicons:cube" class="w-8 h-8 text-orange-500 mr-3" />
          <div>
            <p class="text-sm font-medium text-gray-900">Gerenciar Produtos</p>
            <p class="text-xs text-gray-600">Adicionar ou editar produtos</p>
          </div>
        </NuxtLink>

        <NuxtLink 
          to="/orders" 
          class="flex items-center p-4 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
        >
          <Icon name="heroicons:clipboard-document-list" class="w-8 h-8 text-blue-500 mr-3" />
          <div>
            <p class="text-sm font-medium text-gray-900">Ver Pedidos</p>
            <p class="text-xs text-gray-600">Acompanhar pedidos ativos</p>
          </div>
        </NuxtLink>

        <button 
          @click="refreshData"
          class="flex items-center p-4 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
        >
          <Icon name="heroicons:arrow-path" class="w-8 h-8 text-green-500 mr-3" />
          <div>
            <p class="text-sm font-medium text-gray-900">Atualizar Dados</p>
            <p class="text-xs text-gray-600">Sincronizar informações</p>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'owner'
})

const { dashboardStats, orders } = useAppState()

const recentOrders = computed(() => {
  return orders.value.slice(-3).reverse()
})

const refreshData = () => {
  // Simular atualização de dados
  console.log('Dados atualizados!')
}

useHead({
  title: 'Dashboard'
})
</script>
