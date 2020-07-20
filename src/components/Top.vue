<template>
  <div class="top">
    <div class="div-orderSheet">
      <div class="btn-ordersheet-page">
        <v-btn rounded color="primary" dark to="/orderSheet" target="_blank">注文確認へ移動</v-btn>
      </div>
    </div>
    <div class="div-createQR">
      <div class="selectbox-storeNum-div">
        <span class="storeNum-span">{{$t("Category")}}</span>
        <select class="storeNum-select" v-model="storeNum">
          <option value="1001">天神</option>
          <option value="1002">博多</option>
          <option value="1003">箱崎</option>
        </select>
      </div>
      <div class="selectbox-tableNum-div">
        <span class="tableNum-span">{{$t("Group")}}</span>
        <select class="tableNum-select" v-model="tableNum">
          <option value="A1">A1</option>
          <option value="B2">B2</option>
          <option value="C3">C3</option>
        </select>
      </div>
      <div class="btn-qr-page">
        <v-btn
          rounded
          color="primary"
          dark
          :to="{name: 'qrPrint', query: {
            store: this.storeNum,
            table: this.tableNum
          }}"
          target="_blank"
        >印刷用ページへ移動</v-btn>
      </div>
      <div class="btn-order-page">
        <v-btn
          rounded
          color="primary"
          dark
          :to="{name: 'order', query: {
            store: this.storeNum,
            table: this.tableNum
          }}"
          target="_blank"
        >生成ページへ移動</v-btn>
      </div>
    </div>
    <div class="maintenance-page">
      <span>メンテナンス</span>
        <v-btn
          rounded
          color="primary"
          dark
          :to="{name: 'CategoryMaintenance'}"
          target="_blank"
        >{{$t("Category")}}</v-btn>
        <v-btn
          rounded
          color="primary"
          dark
          :to="{name: 'GroupMaintenance'}"
          target="_blank"
        >{{$t("Group")}}</v-btn>
        <v-btn
          rounded
          color="primary"
          dark
          :to="{name: 'MenuMaintenance'}"
          target="_blank"
        >メニュー</v-btn>
      </div>
  </div>
</template>

<script>
import utilsMixin from "../utils";

export default {
  name: "Top",
  mixins: [utilsMixin],
  data() {
    return {
      storeNum: "",
      tableNum: ""
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.top {
  text-align: center;
  height: 100%;
  width: 100%;
}

.div-orderSheet {
  display: block;
  height: 100px;
  width: 90%;
  line-height: 100px;
  border: 1px solid gray;
  background-color: #fff;
  margin-right: auto;
  margin-left: auto;
  margin-top: 10px;
  margin-bottom: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  border-radius: 5px;
  box-shadow: 2px 2px 4px gray;
}

.btn-ordersheet-page {
  display: block;
  height: 80px;
  line-height: 80px;
  margin: auto;
  padding: auto;
}

.div-createQR {
  display: block;
  height: 50%;
  width: 90%;
  border: 1px solid gray;
  background-color: #fff;
  margin-right: auto;
  margin-left: auto;
  margin-top: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  border-radius: 5px;
  box-shadow: 2px 2px 4px gray;
}

.selectbox-storeNum-div {
  display: flex;
  justify-content: space-around;
  width: 100%;
  height: 44px;
  margin: 0%;
  padding: 0%;
}

.storeNum-span {
  text-align: center;
  width: 50%;
  height: 40px;
  line-height: 40px;
  margin: 0%;
  padding: 0%;
}

.storeNum-select {
  text-align: center;
  width: 30%;
  height: 40px;
  margin: 0%;
  padding: 0%;
  box-shadow: 2px 2px 4px gray;
}

.selectbox-tableNum-div {
  display: flex;
  justify-content: space-around;
  width: 100%;
  height: 44px;
  margin: 0%;
  padding: 0%;
}

.tableNum-span {
  text-align: center;
  width: 50%;
  height: 40px;
  line-height: 40px;
  margin: 0%;
  padding: 0%;
}

.tableNum-select {
  text-align: center;
  width: 30%;
  height: 40px;
  margin: 0%;
  padding: 0%;
  box-shadow: 2px 2px 4px gray;
}

.btn-qr-page {
  padding-top: 10px;
  padding-bottom: 10px;
}

.btn-order-page {
  padding-top: 10px;
  padding-bottom: 10px;
}

.maintenance-page{
  display: block;
  height: 200px;
  width: 90%;
  border: 1px solid gray;
  background-color: #fff;
  margin-right: auto;
  margin-left: auto;
  margin-top: 10px;
  margin-bottom: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  border-radius: 5px;
  box-shadow: 2px 2px 4px gray;
}

.btn {
  width: 70%;
  max-width: 340px;
}
</style>
