import Vue from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import vuetify from '@/plugins/vuetify'

Vue.config.productionTip = false

Vue.config.devtools = true;

import firebase from 'firebase'
var firebaseConfig = {
  apiKey: "AIzaSyB-ioZUSOhshOl2UJH7H3zFv31UG6bF6ic",
  authDomain: "pwa-test-project-93f2a.firebaseapp.com",
  databaseURL: "https://pwa-test-project-93f2a.firebaseio.com",
  projectId: "pwa-test-project-93f2a",
  storageBucket: "pwa-test-project-93f2a.appspot.com",
  messagingSenderId: "516732838177",
  appId: "1:516732838177:web:cc9caada83cfcdeba51e60",
  measurementId: "G-4FB4CG9BWD"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

new Vue({
  router,
  i18n,
  vuetify,
  render: h => h(App)
}).$mount('#app')




