<template>
  <v-card flat tile width="100%" class="text-center" color="#F52900" dark>
    <v-card-text class="ma-0 pa-0">
      <v-container class="ma-0 pa-0" fluid>
        <v-row>
          <v-col cols="6">
            <label class="label-ja" @click="changeLocale('ja')">日本語</label>
          </v-col>
          <v-col cols="6">
            <label class="label-en" @click="changeLocale('en')">English</label>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import utilsMixin from "../utils";

export default {
  name: "CommonFooter",
  mixins: [utilsMixin]
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
