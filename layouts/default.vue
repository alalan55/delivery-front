<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav v-if="isLoggedIn" class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <NuxtLink to="/" class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <Icon name="heroicons:building-storefront" class="w-5 h-5 text-white" />
              </div>
              <span class="text-xl font-bold text-gray-900">DeliveryApp</span>
            </NuxtLink>
          </div>

          <!-- Owner Navigation -->
          <div v-if="isOwner" class="flex items-center space-x-4">
            <NuxtLink 
              to="/dashboard" 
              class="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium"
              :class="$route.path === '/dashboard' ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:text-gray-900'"
            >
              <Icon name="heroicons:chart-bar" class="w-4 h-4" />
              <span>Dashboard</span>
            </NuxtLink>
            <NuxtLink 
              to="/products" 
              class="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium"
              :class="$route.path === '/products' ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:text-gray-900'"
            >
              <Icon name="heroicons:cube" class="w-4 h-4" />
              <span>Produtos</span>
            </NuxtLink>
            <NuxtLink 
              to="/orders" 
              class="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium"
              :class="$route.path === '/orders' ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:text-gray-900'"
            >
              <Icon name="heroicons:clipboard-document-list" class="w-4 h-4" />
              <span>Pedidos</span>
            </NuxtLink>
          </div>

          <!-- Customer Navigation -->
          <div v-if="isCustomer" class="flex items-center space-x-4">
            <NuxtLink 
              to="/menu" 
              class="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium"
              :class="$route.path === '/menu' ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:text-gray-900'"
            >
              <Icon name="heroicons:book-open" class="w-4 h-4" />
              <span>Cardápio</span>
            </NuxtLink>
            <NuxtLink 
              to="/cart" 
              class="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium relative"
              :class="$route.path === '/cart' ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:text-gray-900'"
            >
              <Icon name="heroicons:shopping-cart" class="w-4 h-4" />
              <span>Carrinho</span>
              <span v-if="cartCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {{ cartCount }}
              </span>
            </NuxtLink>
          </div>

          <!-- User Menu -->
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2 text-sm text-gray-600">
              <Icon name="heroicons:user-circle" class="w-5 h-5" />
              <span>{{ user.name }}</span>
              <span class="px-2 py-1 bg-gray-100 rounded-full text-xs">
                {{ isOwner ? 'Proprietário' : 'Cliente' }}
              </span>
            </div>
            <button 
              @click="handleLogout"
              class="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900"
            >
              <Icon name="heroicons:arrow-right-on-rectangle" class="w-4 h-4" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup>
const { user, isLoggedIn, isOwner, isCustomer, cartCount, logout } = useAppState()

const handleLogout = () => {
  logout()
  navigateTo('/login')
}
</script>
