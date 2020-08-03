import Vue from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import vuetify from '@/plugins/vuetify'
import firebaseSetting from "./firebaseSetting"

Vue.config.productionTip = false

Vue.config.devtools = true;

new Vue({
  router,
  i18n,
  vuetify,
  firebaseSetting,
  render: h => h(App)
}).$mount('#app')




