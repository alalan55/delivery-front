<template>
  <div class="flex">
    <button
      v-for="option in options"
      :key="option.value"
      @click="$emit('update:modelValue', option.value)"
      :class="[
        'flex-1 py-2 px-4 text-sm font-medium border',
        option.value === modelValue
          ? 'bg-orange-500 text-white border-orange-500'
          : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100',
        option.position === 'left' ? 'rounded-l-lg' : '',
        option.position === 'right' ? 'rounded-r-lg border-l-0' : '',
      ]"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  options: {
    type: Array,
    required: true,
    // [{ label: 'Cliente', value: 'login', position: 'left' }, { label: 'Proprietário', value: 'register', position: 'right' }]
  },
});
</script>
