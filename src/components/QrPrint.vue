<template>
  <div class="qrPrint">
    <span class="span-category">{{$t("Category")}}</span>
    <vue-qrcode class="qr-img" :value="qrUrlText" :options="option" tag="img"></vue-qrcode>
    <span class="span-group">{{$t("Group")}}</span>
  </div>
</template>

<script>
import VueQrcode from "@chenfengyuan/vue-qrcode";
import utilsMixin from '../utils'

export default {
  name: 'qrPrint',
  mixins: [utilsMixin],
  components: {
    VueQrcode
  },
  methods: {
  },
  data() {
    return {
      option: {
        errorCorrectionLevel: "M",
        maskPattern: 0,
        margin: 10,
        scale: 2,
        width: 300,
        color: {
          dark: "#000000FF",
          light: "#FFFFFFFF"
        }
      }
    }
  },
  computed: {
    storeNum: function() {
      return this.$route.query.store;
    },
    tableNum: function() {
      return this.$route.query.table;
    },
    qrUrlText: function() {
      let routerLink = this.$router.resolve({
          name: 'order',
          query: {
            store: this.storeNum,
            table: this.tableNum
          }
      }).href;
      return location.origin + routerLink;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.qrPrint {
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-left: 20px;
}

.span-category,
.span-group {
  height: 30px;
  line-height: 30px;
  font-size: 30px;
  margin-top: 15px;
  margin-bottom: 15px;
}
</style>
