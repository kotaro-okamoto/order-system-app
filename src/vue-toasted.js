import Vue from 'vue'
import Toasted from 'vue-toasted';

// オプション設定
// 今回はポジション・表示されてから消えるまでの時間・横幅についてのオプション追加

let option = {
  position: "top-center",
  duration: 2000,
  fullwidth: true
}

Vue.use(Toasted, option);

