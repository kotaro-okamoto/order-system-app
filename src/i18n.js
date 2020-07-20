import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const messages = {
  en: require('./components/lang/en.json'),
  ja: require('./components/lang/ja.json')
}

export default new VueI18n({
  locale: 'ja',
  messages
})
