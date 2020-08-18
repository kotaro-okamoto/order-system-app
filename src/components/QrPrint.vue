<template>
  <div class="qrPrint">
    <span class="span-category-title">{{$t("Category")}}</span>
    <span class="span-category-value">{{category}}</span>
    <span class="span-group-title">{{$t("Group")}}</span>
    <span class="span-group-value">{{group}}</span>
    <vue-qrcode class="qr-img" :value="qrUrlText" :options="option" tag="img"></vue-qrcode>
  </div>
</template>

<script>
import VueQrcode from "@chenfengyuan/vue-qrcode";
import utilsMixin from "../utils";

export default {
  name: "qrPrint",
  mixins: [utilsMixin],
  components: {
    VueQrcode
  },
  methods: {},
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
    };
  },
  computed: {
    company: function() {
      return this.$route.query.company;
    },
    category: function() {
      return this.$route.query.category;
    },
    group: function() {
      return this.$route.query.group;
    },
    qrUrlText: function() {
      let routerLink = this.$router.resolve({
        name: "order",
        query: {
          company: this.company,
          category: this.category,
          group: this.group
        }
      }).href;
      return location.origin + routerLink;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.qrPrint {
  width: 350px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

span {
  font-size: 30px;
}

.span-category-title {
  margin-top: 15px;
}

.span-category-value {
  margin-top: 10px;
}

.span-group-title {
  margin-top: 50px;
}

.span-group-value {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>