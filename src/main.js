import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { supabase } from "./supabase/client";
import "./assets/style.css";

import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/lara-light-pink/theme.css'; 
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';

import Button from 'primevue/button';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Card from 'primevue/card';
import Menubar from 'primevue/menubar';
import Badge from 'primevue/badge';
import Divider from 'primevue/divider';

import { createPinia } from 'pinia'; // Importa Pinia
const pinia = createPinia();        // Declara solo UNA vez

const app = createApp(App);

app.use(router);
app.use(PrimeVue);
app.use(ToastService);
app.use(ConfirmationService);
app.use(pinia); // Usa pinia UNA vez

// Registra componentes globales PrimeVue
app.component('Button', Button);
app.component('Accordion', Accordion);
app.component('AccordionTab', AccordionTab);
app.component('Card', Card);
app.component('Menubar', Menubar);
app.component('Badge', Badge);
app.component('Divider', Divider);

app.mount("#app");
