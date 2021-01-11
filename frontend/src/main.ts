import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";
import { api } from "./services";
const app = createApp(App)
app.config.globalProperties.$api = api
app.mount("#app");

