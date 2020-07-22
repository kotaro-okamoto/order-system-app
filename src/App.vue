<template>
  <v-app>
    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>


export default {
  name: "app",
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
* {
  font-family: "Hiragino Kaku Gothic Pro", "ヒラギノ角ゴ Pro W3", "メイリオ",
    Meiryo, "ＭＳ Ｐゴシック", sans-serif;
  touch-action: manipulation;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  outline: none;
  font-size: 22px;
}

html,
body,
div.background {
  height: 100%; /* 「div.background」に対してはmin-heightに対応していないブラウザ用 */
  margin: 0;
  padding: 0;
}

div.background {
  min-height: 100%; /* 最小の高さ */
  width: 300px;
}

.text-start {
  font-size: 22px !important;
}
</style>