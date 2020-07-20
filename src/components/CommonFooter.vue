<template>
  <div class="footer">
    <div class="div-lang">
      <label class="label-ja" @click="changeLocale('ja')">日本語</label>
      <label class="label-en" @click="changeLocale('en')">English</label>
    </div>
  </div>
</template>

<script>
import utilsMixin from '../utils'

export default {
  name: "CommonFooter",
  mixins: [utilsMixin],
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .div-lang {
    height:50px;
    background-color: black;
    color: white;
    text-align: center;
    display: flex;
    justify-content: space-around;
    margin-top: 10px;
  }

  .div-lang .label-ja,
  .div-lang .label-en
  {
    width: auto;
    height: 50px;
    line-height: 50px;
    display: inline-block;
  }
</style>
