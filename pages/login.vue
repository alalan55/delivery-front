<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <div
          class="mx-auto w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center"
        >
          <Icon
            name="heroicons:building-storefront"
            class="w-8 h-8 text-white"
          />
        </div>
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">MenuJá</h2>
        <p class="mt-2 text-sm text-gray-600">Seu sistema completo de delivery</p>
      </div>

      <div class="bg-white rounded-lg shadow-md p-8">
        <div class="flex mb-6">
          <button
            @click="activeTab = 'login'"
            :class="[
              'flex-1 py-2 px-4 text-sm font-medium rounded-l-lg border',
              activeTab === 'login'
                ? 'bg-orange-500 text-white border-orange-500'
                : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100',
            ]"
          >
            Entrar
          </button>
          <button
            @click="activeTab = 'register'"
            :class="[
              'flex-1 py-2 px-4 text-sm font-medium rounded-r-lg border border-l-0',
              activeTab === 'register'
                ? 'bg-orange-500 text-white border-orange-500'
                : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100',
            ]"
          >
            Cadastrar
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ activeTab === "login" ? "Fazer Login" : "Criar Conta" }}
          </h3>
          <p class="text-sm text-gray-600 mb-6">
            {{
              activeTab === "login"
                ? "Entre com suas credenciais para acessar o sistema"
                : "Crie sua conta para começar a usar o sistema"
            }}
          </p>

          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="input-field"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Senha
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="input-field"
              placeholder="Sua senha"
            />
          </div>

          <div v-if="error" class="text-red-600 text-sm">
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon
              v-if="loading"
              name="heroicons:arrow-path"
              class="w-4 h-4 mr-2 animate-spin"
            />
            {{ activeTab === "login" ? "Entrar" : "Cadastrar" }}
          </button>
        </form>

        <div class="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 class="text-sm font-medium text-gray-700 mb-2">
            Contas de teste:
          </h4>
          <div class="text-xs text-gray-600 space-y-1">
            <div><strong>Proprietário:</strong> admin@delivery.com</div>
            <div><strong>Cliente:</strong> qualquer outro email</div>
            <div><strong>Senha:</strong> qualquer</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false,
});

const { login, isLoggedIn, isOwner } = useAppState();

const activeTab = ref("login");
const loading = ref(false);
const error = ref("");

const form = reactive({
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
  loading.value = true;
  error.value = "";

  try {
    const success = login(form.email, form.password);

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

useHead({
  title: "Login",
});
</script>
