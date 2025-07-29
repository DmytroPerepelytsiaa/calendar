import { createApp } from 'vue';
import { createVfm } from 'vue-final-modal';
import 'vue-final-modal/style.css';
import 'verte-vue3/dist/verte.css';

import App from './App.vue';
import router from './router';
import './assets/main.scss';

const app = createApp(App);
const vfm = createVfm();

app.use(router);
app.use(vfm);
app.mount('#app');
