export const useAppState = () => {
  // Estado do usuário
  const user = useState('user', () => null)
  const isLoggedIn = computed(() => !!user.value)
  const isOwner = computed(() => user.value?.type === 'owner')
  const isCustomer = computed(() => user.value?.type === 'customer')

  // Estado do carrinho
  const cart = useState('cart', () => [])
  const cartCount = computed(() => cart.value.reduce((total, item) => total + item.quantity, 0))
  const cartTotal = computed(() => cart.value.reduce((total, item) => total + (item.price * item.quantity), 0))

  // Estado dos produtos
  const products = useState('products', () => [
    {
      id: 1,
      name: 'Hambúrguer Clássico',
      price: 25.90,
      category: 'Lanches',
      description: 'Hambúrguer artesanal com carne bovina, alface, tomate, cebola e molho especial',
      ingredients: ['Pão brioche', 'Carne bovina 150g', 'Alface', 'Tomate', 'Cebola', 'Molho especial'],
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
      available: true,
      rating: 4.5,
      prepTime: '20-30 min'
    },
    {
      id: 2,
      name: 'Pizza Margherita',
      price: 32.90,
      category: 'Pratos Principais',
      description: 'Pizza tradicional com molho de tomate, mussarela e manjericão fresco',
      ingredients: ['Massa artesanal', 'Molho de tomate', 'Mussarela', 'Manjericão', 'Azeite'],
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
      available: true,
      rating: 4.8,
      prepTime: '25-35 min'
    },
    {
      id: 3,
      name: 'Refrigerante Cola',
      price: 5.90,
      category: 'Bebidas',
      description: 'Refrigerante cola gelado 350ml',
      ingredients: [],
      image: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=400',
      available: true,
      rating: 4.2,
      prepTime: '5 min'
    },
    {
      id: 4,
      name: 'Brownie de Chocolate',
      price: 12.90,
      category: 'Sobremesas',
      description: 'Brownie artesanal de chocolate com nozes',
      ingredients: ['Chocolate belga', 'Nozes', 'Manteiga', 'Ovos', 'Açúcar'],
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400',
      available: true,
      rating: 4.7,
      prepTime: '10 min'
    }
  ])

  // Estado dos pedidos
  const orders = useState('orders', () => [
    {
      id: 1,
      customer: 'João Silva',
      phone: '(11) 99999-9999',
      address: 'Rua das Flores, 123 - Centro',
      items: [
        { id: 1, name: 'Hambúrguer Clássico', price: 25.90, quantity: 2 }
      ],
      total: 57.70,
      status: 'Preparando',
      createdAt: '15/01/2024, 10:30'
    },
    {
      id: 2,
      customer: 'Maria Santos',
      phone: '(11) 88888-8888',
      address: 'Av. Principal, 456 - Jardim',
      items: [
        { id: 2, name: 'Pizza Margherita', price: 32.90, quantity: 1 },
        { id: 3, name: 'Refrigerante Cola', price: 5.90, quantity: 2 }
      ],
      total: 50.60,
      status: 'Pronto',
      createdAt: '15/01/2024, 11:15'
    }
  ])

  // Funções de autenticação
  const login = (email, password) => {
    if (email === 'admin@delivery.com' && password === '123456') {
      user.value = {
        id: 1,
        name: 'Admin Restaurante',
        email: email,
        type: 'owner'
      }
      return true
    } else if (password === 'qualquer') {
      user.value = {
        id: 2,
        name: 'Cliente Teste',
        email: email,
        type: 'customer'
      }
      return true
    }
    return false
  }

  const logout = () => {
    user.value = null
    cart.value = []
  }

  // Funções do carrinho
  const addToCart = (product, quantity = 1) => {
    const existingItem = cart.value.find(item => item.id === product.id)
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.value.push({
        ...product,
        quantity
      })
    }
  }

  const removeFromCart = (productId) => {
    const index = cart.value.findIndex(item => item.id === productId)
    if (index > -1) {
      cart.value.splice(index, 1)
    }
  }

  const updateCartQuantity = (productId, quantity) => {
    const item = cart.value.find(item => item.id === productId)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId)
      } else {
        item.quantity = quantity
      }
    }
  }

  const clearCart = () => {
    cart.value = []
  }

  // Funções de produtos
  const getProductsByCategory = (category) => {
    if (category === 'Todos') return products.value
    return products.value.filter(product => product.category === category)
  }

  const getProductById = (id) => {
    return products.value.find(product => product.id === parseInt(id))
  }

  // Funções de pedidos
  const createOrder = (orderData) => {
    const newOrder = {
      id: orders.value.length + 1,
      ...orderData,
      items: [...cart.value],
      total: cartTotal.value + 5.90, // Taxa de entrega
      status: 'Pendente',
      createdAt: new Date().toLocaleString('pt-BR')
    }
    orders.value.push(newOrder)
    clearCart()
    return newOrder
  }

  const updateOrderStatus = (orderId, status) => {
    const order = orders.value.find(order => order.id === orderId)
    if (order) {
      order.status = status
    }
  }

  // Estatísticas do dashboard
  const dashboardStats = computed(() => {
    const totalOrders = orders.value.length
    const pendingOrders = orders.value.filter(order => order.status === 'Pendente').length
    const preparingOrders = orders.value.filter(order => order.status === 'Preparando').length
    const readyOrders = orders.value.filter(order => order.status === 'Pronto').length
    const deliveredOrders = orders.value.filter(order => order.status === 'Entregue').length
    const totalRevenue = orders.value.reduce((total, order) => total + order.total, 0)

    return {
      totalOrders,
      pendingOrders,
      preparingOrders,
      readyOrders,
      deliveredOrders,
      totalRevenue
    }
  })

  return {
    // Estado
    user,
    isLoggedIn,
    isOwner,
    isCustomer,
    cart,
    cartCount,
    cartTotal,
    products,
    orders,
    dashboardStats,
    
    // Funções
    login,
    logout,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getProductsByCategory,
    getProductById,
    createOrder,
    updateOrderStatus
  }
}
