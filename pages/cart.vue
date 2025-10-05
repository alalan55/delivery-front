<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Meu Carrinho</h1>
        <p class="mt-2 text-gray-600">{{ cartCount }} {{ cartCount === 1 ? 'item' : 'itens' }} no carrinho</p>
      </div>
      <NuxtLink 
        to="/menu"
        class="flex items-center space-x-2 text-orange-600 hover:text-orange-700"
      >
        <Icon name="heroicons:arrow-left" class="w-4 h-4" />
        <span>Continuar Comprando</span>
      </NuxtLink>
    </div>

    <div v-if="cart.length > 0" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Cart Items -->
      <div class="lg:col-span-2 space-y-4">
        <div 
          v-for="item in cart" 
          :key="item.id"
          class="bg-white rounded-lg shadow-md border border-gray-200 p-6"
        >
          <div class="flex items-center space-x-4">
            <img 
              :src="item.image" 
              :alt="item.name"
              class="w-20 h-20 object-cover rounded-lg"
            />
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900">{{ item.name }}</h3>
              <p class="text-gray-600 text-sm">{{ item.category }}</p>
              <p class="text-green-600 font-bold">R$ {{ item.price.toFixed(2) }} cada</p>
            </div>
            <div class="flex items-center space-x-3">
              <button 
                @click="decreaseQuantity(item.id)"
                class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              >
                <Icon name="heroicons:minus" class="w-4 h-4" />
              </button>
              <span class="text-lg font-medium w-8 text-center">{{ item.quantity }}</span>
              <button 
                @click="increaseQuantity(item.id)"
                class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              >
                <Icon name="heroicons:plus" class="w-4 h-4" />
              </button>
            </div>
            <div class="text-right">
              <p class="text-lg font-bold text-gray-900">R$ {{ (item.price * item.quantity).toFixed(2) }}</p>
              <button 
                @click="removeItem(item.id)"
                class="text-red-600 hover:text-red-700 text-sm mt-1"
              >
                <Icon name="heroicons:trash" class="w-4 h-4 inline mr-1" />
                Remover
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow-md border border-gray-200 p-6 sticky top-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Resumo do Pedido</h3>
          
          <div class="space-y-3 mb-4">
            <div class="flex justify-between">
              <span class="text-gray-600">Subtotal</span>
              <span class="text-gray-900">R$ {{ cartTotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Taxa de entrega</span>
              <span class="text-gray-900">R$ {{ deliveryFee.toFixed(2) }}</span>
            </div>
            <div class="text-sm text-orange-600">
              Adicione R$ {{ (freeDeliveryThreshold - cartTotal).toFixed(2) }} para frete grátis
            </div>
            <hr>
            <div class="flex justify-between text-lg font-bold">
              <span class="text-gray-900">Total</span>
              <span class="text-gray-900">R$ {{ finalTotal.toFixed(2) }}</span>
            </div>
          </div>

          <button 
            @click="proceedToCheckout"
            class="w-full btn-primary mb-4"
          >
            <Icon name="heroicons:credit-card" class="w-4 h-4 mr-2" />
            Finalizar Pedido
          </button>

          <div class="bg-blue-50 p-3 rounded-lg">
            <div class="flex items-start space-x-2">
              <Icon name="heroicons:information-circle" class="w-4 h-4 text-blue-500 mt-0.5" />
              <div class="text-sm text-blue-700">
                <p class="font-medium">Entrega estimada</p>
                <p>20-30 minutos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty Cart -->
    <div v-else class="text-center py-16">
      <Icon name="heroicons:shopping-cart" class="w-24 h-24 text-gray-300 mx-auto mb-6" />
      <h2 class="text-2xl font-bold text-gray-900 mb-4">Seu carrinho está vazio</h2>
      <p class="text-gray-600 mb-8">Adicione alguns deliciosos pratos do nosso cardápio!</p>
      <NuxtLink to="/menu" class="btn-primary">
        Ver Cardápio
      </NuxtLink>
    </div>

    <!-- Checkout Modal -->
    <div v-if="showCheckoutModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Finalizar Pedido</h3>
            <button 
              @click="showCheckoutModal = false"
              class="text-gray-400 hover:text-gray-600"
            >
              <Icon name="heroicons:x-mark" class="w-6 h-6" />
            </button>
          </div>

          <p class="text-sm text-gray-600 mb-6">Preencha seus dados para confirmar o pedido</p>

          <form @submit.prevent="submitOrder" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nome Completo *</label>
              <input
                v-model="orderForm.name"
                type="text"
                required
                class="input-field"
                :placeholder="user.name"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Telefone *</label>
              <input
                v-model="orderForm.phone"
                type="tel"
                required
                class="input-field"
                placeholder="(11) 99999-9999"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Endereço de Entrega *</label>
              <textarea
                v-model="orderForm.address"
                required
                rows="3"
                class="input-field"
                placeholder="Rua, número, bairro, cidade"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Observações</label>
              <textarea
                v-model="orderForm.observations"
                rows="2"
                class="input-field"
                placeholder="Instruções especiais, ponto de referência..."
              ></textarea>
            </div>

            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span>Subtotal:</span>
                  <span>R$ {{ cartTotal.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Entrega:</span>
                  <span>R$ {{ deliveryFee.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between font-bold text-base">
                  <span>Total:</span>
                  <span>R$ {{ finalTotal.toFixed(2) }}</span>
                </div>
              </div>
              <p class="text-xs text-gray-600 mt-2">
                Pagamento na entrega. Aceitamos dinheiro, cartão de débito e crédito.
              </p>
            </div>

            <div class="flex space-x-3 pt-4">
              <button
                type="button"
                @click="showCheckoutModal = false"
                class="flex-1 btn-secondary"
              >
                Voltar
              </button>
              <button
                type="submit"
                class="flex-1 btn-primary"
              >
                Confirmar Pedido
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-md w-full p-6 text-center">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="heroicons:check" class="w-8 h-8 text-green-600" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Pedido Realizado com Sucesso!</h3>
        <p class="text-gray-600 mb-4">Seu pedido #{{ lastOrderId }} foi confirmado e está sendo preparado</p>
        
        <div class="bg-gray-50 p-4 rounded-lg mb-6 text-left">
          <h4 class="font-medium text-gray-900 mb-2">Resumo do Pedido:</h4>
          <div class="space-y-1 text-sm text-gray-600">
            <p><strong>Total:</strong> R$ {{ finalTotal.toFixed(2) }}</p>
            <p><strong>Entrega para:</strong> {{ orderForm.name }}</p>
            <p><strong>Endereço:</strong> {{ orderForm.address }}</p>
          </div>
          <div class="flex items-center space-x-2 mt-3 text-orange-600">
            <Icon name="heroicons:clock" class="w-4 h-4" />
            <span class="text-sm font-medium">Tempo estimado: 20-30 minutos</span>
          </div>
        </div>

        <div class="flex space-x-3">
          <button
            @click="makeNewOrder"
            class="flex-1 btn-primary"
          >
            Fazer Novo Pedido
          </button>
          <button
            @click="viewMyOrders"
            class="flex-1 btn-secondary"
          >
            Ver Meus Pedidos
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'customer'
})

const { 
  cart, 
  cartCount, 
  cartTotal, 
  user,
  updateCartQuantity, 
  removeFromCart, 
  createOrder,
  clearCart
} = useAppState()

const showCheckoutModal = ref(false)
const showSuccessModal = ref(false)
const lastOrderId = ref(null)

const deliveryFee = ref(5.90)
const freeDeliveryThreshold = ref(50.00)

const finalTotal = computed(() => {
  return cartTotal.value >= freeDeliveryThreshold.value 
    ? cartTotal.value 
    : cartTotal.value + deliveryFee.value
})

const orderForm = reactive({
  name: '',
  phone: '',
  address: '',
  observations: ''
})

const increaseQuantity = (productId) => {
  const item = cart.value.find(item => item.id === productId)
  if (item) {
    updateCartQuantity(productId, item.quantity + 1)
  }
}

const decreaseQuantity = (productId) => {
  const item = cart.value.find(item => item.id === productId)
  if (item && item.quantity > 1) {
    updateCartQuantity(productId, item.quantity - 1)
  }
}

const removeItem = (productId) => {
  removeFromCart(productId)
}

const proceedToCheckout = () => {
  orderForm.name = user.value.name
  showCheckoutModal.value = true
}

const submitOrder = () => {
  const order = createOrder({
    customer: orderForm.name,
    phone: orderForm.phone,
    address: orderForm.address,
    observations: orderForm.observations
  })
  
  lastOrderId.value = order.id
  showCheckoutModal.value = false
  showSuccessModal.value = true
}

const makeNewOrder = () => {
  showSuccessModal.value = false
  navigateTo('/menu')
}

const viewMyOrders = () => {
  showSuccessModal.value = false
  // Implementar página de pedidos do cliente
  navigateTo('/menu')
}

useHead({
  title: 'Carrinho'
})
</script>
