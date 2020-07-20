<template>
  <v-app>
    <router-view/>
    <CommonFooter />
  </v-app>
</template>

<script>
import CommonFooter from './components/CommonFooter.vue'

export default {
  name: "app",
  components: {
    CommonFooter
  }
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
* {
  font-family: 'Hiragino Kaku Gothic Pro','ヒラギノ角ゴ Pro W3','メイリオ',Meiryo,'ＭＳ Ｐゴシック',sans-serif;
  touch-action: manipulation;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  outline: none;
  font-size: 20px
}

html,
body,
div.background {
  height: 100%; /* 「div.background」に対してはmin-heightに対応していないブラウザ用 */
  margin: 0;
  padding: 0;
}

footer {
  position: sticky;
  bottom: 0;
}

div.background {
  min-height: 100%; /* 最小の高さ */
  width: 300px;
}

.btn {
  width: 50%;
  max-width: 340px;
  padding: 15px 10px;
  display: inline-block;
  text-align: center;
  text-decoration: none;
  letter-spacing: 0.1em;
  color: #fff;
  background-color: #57ed7f;
  box-shadow: 2px 2px 4px gray;
  border-radius: 5px;
}

.btn:active {
  position: relative;
  top: 3px;
  left: 3px;
}

</style>