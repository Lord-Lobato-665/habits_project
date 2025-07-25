<template>
  <div class="min-h-screen flex flex-col justify-center items-center bg-orange-50 p-4">
    <div class="w-full max-w-sm bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold text-orange-600 mb-6 text-center">Iniciar Sesión</h2>
      
      <input
        v-model.trim="email"
        type="email"
        placeholder="Correo electrónico"
        class="w-full p-3 mb-4 border rounded"
        :class="{ 'border-red-500': emailError }"
      />
      <p v-if="emailError" class="text-red-600 text-sm mb-3">{{ emailError }}</p>

      <input
        v-model.trim="password"
        type="password"
        placeholder="Contraseña"
        class="w-full p-3 mb-6 border rounded"
        :class="{ 'border-red-500': passwordError }"
      />
      <p v-if="passwordError" class="text-red-600 text-sm mb-4">{{ passwordError }}</p>

      <button 
        @click="login" 
        class="w-full bg-orange-600 text-black py-3 rounded hover:bg-orange-700 transition"
      >
        Entrar
      </button>
      
      <p class="mt-4 text-center text-sm text-gray-600">
        ¿No tienes cuenta? 
        <span
          class="text-orange-600 cursor-pointer hover:underline"
          @click="$router.push('/register')"
        >
          Regístrate aquí
        </span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../supabase/client'

const email = ref('')
const password = ref('')
const router = useRouter()

const emailError = ref('')
const passwordError = ref('')

onMounted(async () => {
  const { data } = await supabase.auth.getUser()
  if (data?.user) {
    router.push('/home')
  }
})

function validate() {
  emailError.value = ''
  passwordError.value = ''

  let valid = true

  if (!email.value) {
    emailError.value = 'El correo es obligatorio'
    valid = false
  } else {
    // Validación simple de email
    const emailRegex = /^\S+@\S+\.\S+$/
    if (!emailRegex.test(email.value)) {
      emailError.value = 'Correo no válido'
      valid = false
    }
  }

  if (!password.value) {
    passwordError.value = 'La contraseña es obligatoria'
    valid = false
  }

  return valid
}

async function login() {
  if (!validate()) return

  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })

  if (error) {
    alert('Error: ' + error.message)
  } else {
    router.push('/home')
  }
}
</script>
