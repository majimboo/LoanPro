import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // Import the router
import './assets/global.css'; // Import global CSS with Bulma

createApp(App).use(router).mount('#app') // Use the router