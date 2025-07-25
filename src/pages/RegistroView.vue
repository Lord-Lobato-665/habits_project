<template>
  <div class="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-orange-50 to-pink-100 px-4">
    <div class="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
      <h2 class="text-2xl font-bold text-orange-600 mb-6 text-center">Crear una cuenta</h2>

      <div class="space-y-5">
        <div>
          <label for="email" class="block text-gray-700 font-semibold mb-1">Correo electrónico</label>
          <input
            id="email"
            type="email"
            v-model="email"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="ejemplo@correo.com"
          />
        </div>

        <div>
          <label for="password" class="block text-gray-700 font-semibold mb-1">Contraseña</label>
          <input
            id="password"
            type="password"
            v-model="password"
            required
            minlength="6"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        <div class="pt-2">
          <button
            @click="handleRegister"
            type="button"
            class="w-full bg-orange-600 text-black font-semibold py-2 rounded-md hover:bg-orange-700 transition"
            :disabled="loading"
          >
            {{ loading ? "Registrando..." : "Confirmar registro" }}
          </button>
        </div>
      </div>

      <p class="mt-4 text-center text-gray-600">
        ¿Ya tienes cuenta?
        <router-link to="/" class="text-orange-600 font-semibold hover:underline">Inicia sesión aquí</router-link>
      </p>

      <p v-if="errorMsg" class="mt-4 text-center text-red-600 font-semibold">
        {{ errorMsg }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { supabase } from "../supabase/client";

const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMsg = ref("");

async function handleRegister() {
  errorMsg.value = "";
  loading.value = true;

  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
  });

  loading.value = false;

  if (error) {
    errorMsg.value = error.message;
  } else {
    alert("Registro exitoso. Verifica tu correo antes de iniciar sesión.");
    window.location.href = "/";
  }
}
</script>
