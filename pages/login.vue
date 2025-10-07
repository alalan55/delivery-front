<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-gray-100 py-8 px-4">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <div class="flex justify-center">
          <div class="relative">
            <div class="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200">
              <Icon
                name="heroicons:building-storefront"
                class="w-10 h-10 text-white"
              />
            </div>
            <div class="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
              <Icon name="heroicons:check" class="w-3 h-3 text-white" />
            </div>
          </div>
        </div>
        <h2 class="mt-6 text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
          MenuJá
        </h2>
        <p class="mt-3 text-gray-600 font-medium">
          Seu sistema completo de delivery
        </p>
      </div>

      <!-- Card Principal -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <!-- Tabs -->
        <div class="flex bg-gray-50 p-2">
          <button
            @click="activeTab = 'login'"
            :class="[
              'flex-1 py-3 px-4 text-sm font-semibold rounded-xl transition-all duration-300',
              activeTab === 'login'
                ? 'bg-white text-orange-600 shadow-md border border-orange-100'
                : 'text-gray-500 hover:text-gray-700',
            ]"
          >
            <div class="flex items-center justify-center space-x-2">
              <Icon 
                name="heroicons:key" 
                class="w-4 h-4" 
              />
              <span>Entrar</span>
            </div>
          </button>
          <button
            @click="activeTab = 'register'"
            :class="[
              'flex-1 py-3 px-4 text-sm font-semibold rounded-xl transition-all duration-300',
              activeTab === 'register'
                ? 'bg-white text-orange-600 shadow-md border border-orange-100'
                : 'text-gray-500 hover:text-gray-700',
            ]"
          >
            <div class="flex items-center justify-center space-x-2">
              <Icon 
                name="heroicons:user-plus" 
                class="w-4 h-4" 
              />
              <span>Cadastrar</span>
            </div>
          </button>
        </div>

        <!-- Conteúdo do Form -->
        <div class="p-8">
          <div class="text-center mb-8">
            <h3 class="text-2xl font-bold text-gray-900">
              {{ activeTab === "login" ? "Bem-vindo de volta" : "Crie sua conta" }}
            </h3>
            <p class="mt-2 text-gray-600">
              {{
                activeTab === "login"
                  ? "Entre com suas credenciais para acessar o sistema"
                  : "Preencha os dados abaixo para começar"
              }}
            </p>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Formulário de Registro -->
            <template v-if="activeTab === 'register'">
              <UFormGroup label="Nome Completo" class="space-y-2">
                <UInput
                  v-model="form.name"
                  icon="heroicons:user-20-solid"
                  size="lg"
                  variant="outline"
                  color="orange"
                  placeholder="Seu nome completo"
                  :ui="{ 
                    icon: { base: 'text-orange-500' },
                    padding: { lg: 'px-4 py-3' }
                  }"
                />
              </UFormGroup>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UFormGroup label="Email" class="space-y-2">
                  <UInput
                    v-model="form.email"
                    icon="heroicons:envelope-20-solid"
                    size="lg"
                    variant="outline"
                    color="orange"
                    type="email"
                    placeholder="seu@email.com"
                    :ui="{ 
                      icon: { base: 'text-orange-500' },
                      padding: { lg: 'px-4 py-3' }
                    }"
                  />
                </UFormGroup>

                <UFormGroup label="Telefone" class="space-y-2">
                  <UInput
                    v-model="form.phone"
                    icon="heroicons:phone-20-solid"
                    size="lg"
                    variant="outline"
                    color="orange"
                    type="tel"
                    placeholder="(99) 99999-9999"
                    :ui="{ 
                      icon: { base: 'text-orange-500' },
                      padding: { lg: 'px-4 py-3' }
                    }"
                  />
                </UFormGroup>
              </div>

              <UFormGroup label="Tipo de Conta" class="space-y-3">
                <SharedButtonToggle
                  v-model="form.userType"
                  :options="[
                    { 
                      label: 'Cliente', 
                      value: 'CUSTOMER', 
                      position: 'left',
                      icon: 'heroicons:user-20-solid'
                    },
                    {
                      label: 'Proprietário',
                      value: 'STORE_OWNER',
                      position: 'right',
                      icon: 'heroicons:building-storefront-20-solid'
                    },
                  ]"
                />
                <p class="text-xs text-gray-500 mt-2">
                  {{
                    form.userType === 'CUSTOMER' 
                      ? 'Irá fazer pedidos no sistema' 
                      : 'Irá gerenciar um estabelecimento'
                  }}
                </p>
              </UFormGroup>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UFormGroup label="Senha" class="space-y-2">
                  <UInput
                    v-model="form.password"
                    icon="heroicons:lock-closed-20-solid"
                    size="lg"
                    variant="outline"
                    color="orange"
                    type="password"
                    placeholder="Sua senha"
                    :ui="{ 
                      icon: { base: 'text-orange-500' },
                      padding: { lg: 'px-4 py-3' }
                    }"
                  />
                </UFormGroup>

                <UFormGroup label="Confirmar Senha" class="space-y-2">
                  <UInput
                    v-model="form.passwordConfirmation"
                    icon="heroicons:lock-closed-20-solid"
                    size="lg"
                    variant="outline"
                    color="orange"
                    type="password"
                    placeholder="Confirme sua senha"
                    :ui="{ 
                      icon: { base: 'text-orange-500' },
                      padding: { lg: 'px-4 py-3' }
                    }"
                  />
                </UFormGroup>
              </div>
            </template>

            <!-- Formulário de Login -->
            <template v-else>
              <UFormGroup label="Email" class="space-y-2">
                <UInput
                  v-model="formLogin.email"
                  icon="heroicons:envelope-20-solid"
                  size="lg"
                  variant="outline"
                  color="orange"
                  type="email"
                  placeholder="seu@email.com"
                  :ui="{ 
                    icon: { base: 'text-orange-500' },
                    padding: { lg: 'px-4 py-3' }
                  }"
                />
              </UFormGroup>

              <UFormGroup label="Senha" class="space-y-2">
                <UInput
                  v-model="formLogin.password"
                  icon="heroicons:lock-closed-20-solid"
                  size="lg"
                  variant="outline"
                  color="orange"
                  type="password"
                  placeholder="Sua senha"
                  :ui="{ 
                    icon: { base: 'text-orange-500' },
                    padding: { lg: 'px-4 py-3' }
                  }"
                />
              </UFormGroup>

              <div class="flex justify-end">
                <a href="#" class="text-sm text-orange-600 hover:text-orange-500 font-medium">
                  Esqueceu sua senha?
                </a>
              </div>
            </template>

            <!-- Mensagem de Erro -->
            <div 
              v-if="error" 
              class="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700"
            >
              <Icon name="heroicons:exclamation-triangle" class="w-5 h-5 flex-shrink-0" />
              <span class="text-sm font-medium">{{ error }}</span>
            </div>

            <!-- Botão de Submit -->
            <UButton
              type="submit"
              :loading="loading"
              :disabled="loading"
              color="orange"
              variant="solid"
              size="lg"
              :ui="{
                rounded: 'rounded-xl',
                padding: { lg: 'px-6 py-3' }
              }"
              class="w-full font-semibold text-lg shadow-lg shadow-orange-200 hover:shadow-xl transition-all duration-300"
            >
              <template #leading>
                <Icon
                  v-if="!loading"
                  :name="activeTab === 'login' ? 'heroicons:arrow-right-20-solid' : 'heroicons:user-plus-20-solid'"
                  class="w-5 h-5"
                />
              </template>
              {{ loading ? "Processando..." : activeTab === "login" ? "Entrar na Conta" : "Criar Conta" }}
            </UButton>
          </form>

          <!-- Contas de Teste -->
          <div class="mt-8 p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100">
            <div class="flex items-center space-x-2 mb-3">
              <Icon name="heroicons:information-circle-20-solid" class="w-5 h-5 text-orange-600" />
              <h4 class="text-sm font-semibold text-orange-800">
                Contas de teste:
              </h4>
            </div>
            <div class="text-sm text-orange-700 space-y-2">
              <div class="flex justify-between items-center p-2 bg-white rounded-lg">
                <span class="font-medium">Proprietário:</span>
                <code class="text-xs bg-orange-100 px-2 py-1 rounded">admin@delivery.com</code>
              </div>
              <div class="flex justify-between items-center p-2 bg-white rounded-lg">
                <span class="font-medium">Cliente:</span>
                <code class="text-xs bg-orange-100 px-2 py-1 rounded">qualquer email</code>
              </div>
              <div class="flex justify-between items-center p-2 bg-white rounded-lg">
                <span class="font-medium">Senha:</span>
                <code class="text-xs bg-orange-100 px-2 py-1 rounded">qualquer</code>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center">
        <p class="text-gray-500 text-sm">
          © 2024 MenuJá. Todos os direitos reservados.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false,
});

const http = useApi();
const toast = useToast();

const { login, isLoggedIn, isOwner } = useAppState();

const activeTab = ref("login");
const loading = ref(false);
const error = ref("");

const form = reactive({
  email: "",
  password: "",
  name: "",
  phone: "",
  userType: "CUSTOMER",
  passwordConfirmation: "",
});

const formLogin = reactive({
  email: "",
  password: "",
});

// Redirect se já estiver logado
watchEffect(() => {
  if (isLoggedIn.value) {
    if (isOwner.value) {
      navigateTo("/dashboard");
    } else {
      navigateTo("/menu");
    }
  }
});

const handleSubmit = async () => {
  if (activeTab.value === "login") {
    await loginUser();
  } else {
    await register();
  }
};

const loginUser = async () => {
  loading.value = true;
  error.value = "";

  try {
    const success = login(formLogin.email, formLogin.password);

    if (success) {
      // Redirect será feito pelo watchEffect
    } else {
      error.value = "Credenciais inválidas";
    }
  } catch (err) {
    error.value = "Erro ao fazer login";
  } finally {
    loading.value = false;
  }
};

const register = async () => {
  loading.value = true;
  error.value = "";

  if (form.password !== form.passwordConfirmation) {
    error.value = "As senhas não coincidem";
    loading.value = false;
    toast.add({
      title: "Erro",
      description: "As senhas não coincidem",
      icon: "heroicons:exclamation-circle",
      color: "red",
    });
    return;
  }

  try {
    await http.post("/users", {
      name: form.name,
      email: form.email,
      phone: form.phone,
      userType: form.userType,
      password: form.password,
    });

    toast.add({
      title: "Sucesso",
      description: "Usuário registrado com sucesso! Faça login.",
      icon: "heroicons:check-circle",
      color: "green",
    });
    activeTab.value = "login";
  } catch (err) {
    error.value = "Erro ao registrar usuário";
  } finally {
    loading.value = false;
  }
};

useHead({
  title: "Login - MenuJá",
});
</script>