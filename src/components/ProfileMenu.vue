<template>
  <div class="absolute top-1 right-2 z-50">
    <div class="relative">
      <!-- Círculo de perfil -->
      <button
        @click="toggleMenu"
        class="w-13 h-12 rounded-full bg-orange-500 text-black font-bold flex items-center justify-center shadow hover:bg-orange-600 transition"
        title="Perfil"
      >
        {{ initials }}
      </button>

      <!-- Menú desplegable -->
      <div
        v-if="menuOpen"
        class="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-md border border-orange-200"
      >
        <button
          @click="goToProfile"
          class="w-full px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 text-left transition"
        >
          Ver perfil
        </button>
        <button
          @click="logout"
          class="w-full px-4 py-2 text-sm text-red-500 hover:bg-orange-50 hover:text-red-600 text-left transition"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "../supabase/client";

const menuOpen = ref(false);
const user = ref(null);
const router = useRouter();

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

onMounted(async () => {
  const { data } = await supabase.auth.getUser();
  user.value = data.user;
});

const logout = async () => {
  await supabase.auth.signOut();
  router.push("/");
};

const goToProfile = () => {
  menuOpen.value = false;
  router.push("/profile");
};

const initials = computed(() => {
  return user.value?.email?.charAt(0)?.toUpperCase() || "👤";
});
</script>
