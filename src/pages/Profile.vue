<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-50 to-pink-100 flex flex-col items-center justify-center p-6">
    <div class="w-full max-w-md bg-white shadow-2xl rounded-xl p-8 border border-orange-200">
      <div class="flex flex-col items-center text-center">
        <div class="w-20 h-20 bg-gradient-to-tr from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-4">
          {{ initials }}
        </div>
        <h2 class="text-xl font-semibold text-gray-800">Perfil de Usuario</h2>
        <p class="text-sm text-gray-500">{{ user?.email }}</p>
      </div>

      <div class="mt-6">
        <h3 class="text-sm font-semibold text-orange-600 mb-2">Información de la cuenta</h3>
        <ul class="text-sm text-gray-600 space-y-1">
          <li><span class="font-medium">Email:</span> {{ user?.email }}</li>
          <li><span class="font-medium">Creado:</span> {{ creationDate }}</li>
        </ul>
      </div>

      <div class="mt-6 flex justify-end">
        <button
          @click="goBack"
          class="bg-orange-500 hover:bg-orange-600 text-black px-4 py-2 rounded-md shadow transition"
        >
          Volver
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../supabase/client';

const router = useRouter();
const user = ref(null);

onMounted(async () => {
  const { data } = await supabase.auth.getUser();
  user.value = data.user;
});

const initials = computed(() => {
  return user.value?.email?.charAt(0).toUpperCase() || '👤';
});

const creationDate = computed(() => {
  const createdAt = user.value?.created_at;
  if (!createdAt) return "Desconocido";
  return new Date(createdAt).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
});

const goBack = () => {
  router.back();
};
</script>
