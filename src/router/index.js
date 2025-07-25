import { createRouter, createWebHistory } from "vue-router";
import { supabase } from "../supabase/client";

import LoginView from "../pages/LoginView.vue";
import RegisterView from "../pages/RegistroView.vue"; // Registro
import ProfileView from "../pages/Profile.vue";
import Home from "../pages/Home.vue";
import Habits from "../pages/Habits.vue";
import Stats from "../pages/Stats.vue";

const routes = [
  { path: "/", component: LoginView, meta: { requiresAuth: false } }, // raíz = login
  { path: "/register", component: RegisterView, meta: { requiresAuth: false } }, // registro
  { path: "/home", component: Home, meta: { requiresAuth: true } },    // home protegido
  { path: "/profile", component: ProfileView, meta: { requiresAuth: true } },
  { path: "/habits", component: Habits, meta: { requiresAuth: true } },
  { path: "/stats", component: Stats, meta: { requiresAuth: true } },
  { path: "/:pathMatch(.*)*", redirect: "/" }, // rutas no encontradas redirigen a login
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const requiresAuth = to.meta.requiresAuth;

  if ((to.path === "/" || to.path === "/register") && user) {
    // Si ya está logueado, no puede ir a login o registro, lo mando al home
    return next("/home");
  }

  if (requiresAuth && !user) {
    // Si la ruta requiere auth y no está logueado, redirige a login
    return next("/");
  }

  next();
});

export default router;
