<template>
  <div class="menu-drawer">
    <input type="checkbox" id="chk" v-model="isDrawerShow" />
    <div>
      <v-container>
        <v-row >
          <v-col cols=6 v-for="menu of this.menus" :key="menu.index">
            
      <v-expansion-panels accordion flat>
        <v-expansion-panel>
          <v-expansion-panel-header>
            <template v-slot:actions>
              <v-card height="200px" width="150px">
                {{menu.groupByValue}}
              </v-card>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content
            v-for="product of menu.products"
            :key="product.id"
            @click="select(product.id,product.name)"
          >
             <v-card height="44px" @click="select(product.id,  product.name)" flat>
                {{product.name}}
              </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      </v-col>
        </v-row>
          
    </v-container>
    </div>
    <v-btn rounded color="primary" dark @click="
switchDrawerShow()" class="mt-5">{{$t("Check")}}</v-btn>
<div>
<v-btn
                  rounded
                  color="primary"
                  dark
                  :to="{name: 'order1', 
                    query: {
                    category: this.category,
                    group: this.group
                  }}"
                  target="_blank"
                >パターン2</v-btn>
                </div>
    <label class="other" for="chk"></label>
    <div class="content">
      <div class="drawer-header">
        <div class="div-drawer-continue-btn">
          <v-btn
            rounded
            color="primary"
            dark
            @click="
deleteZeroItem(); switchDrawerShow()"
          >{{$t("Continue")}}</v-btn>
        </div>
        <div class="div-drawer-send-btn">
          <v-btn rounded color="primary" dark @click="
sendOrder">{{$t("Order")}}</v-btn>
        </div>
      </div>
      <div class="menu">
        <div class="menu-selected" v-for="menu of reverseSelectedMenus" v-bind:key="menu.id">
          <div class="menu-selected-child1">
            <button class="btn-delete" @click="deleteSelectItem(menu)">✖</button>
            <span class="menu-selected-child1-name">{{menu.name}}</span>
            <button
              class="btn-menu minus"
              @click="setSelectedMenusCount(menu.id,menu.name,--menu.count)"
            >－</button>
            <span class="menu-selected-child1-count">{{menu.count}}</span>
            <button
              class="btn-menu plus"
              @click="setSelectedMenusCount(menu.id,menu.name,++menu.count)"
            >＋</button>
          </div>
        </div>
      </div>
    </div>
    <div>
      <v-dialog v-model="isOrderComplete" width="500">
        <v-card>
          <v-card-title class="justify-center">注文が完了しました。</v-card-title>
          <v-card-actions class="justify-center">
            <v-btn color="primary" @click="isOrderComplete = !isOrderComplete">OK</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import "firebase/firestore";
import moment from "moment";
import utilsMixin from "../utils";
export default {
  name: "order",
  mixins: [utilsMixin],
  data: function() {
    return {
      db: "",
      menus: [],
      SelectedMenus: [],
      isDrawerShow: false,
      active: "",
      isOrderComplete: false,
      mixins: [utilsMixin]
    };
  },
  created: function() {
    this.getMenusDb();
  },
  methods: {
    getMenusDb: function() {
      console.log("getMenusDb start");
      this.db = firebase.firestore();
      const _this = this;
      this.db.collection("menusDB").onSnapshot(function(querySnapshot) {
        let menusDbData = [];
        querySnapshot.forEach(function(doc) {
          menusDbData.push(JSON.stringify(doc.data()));
        });
        _this.menus = [];
        _this.menus = _this.groupBy("category", menusDbData);
      });
      console.log("getMenusDb end");
    },
    switchDrawerShow: function() {
      this.isDrawerShow = !this.isDrawerShow;
      this.deleteZeroItem();
    },
    // 商品選択後選択リストに追加する関数
    select: function(selectId, selectName) {
      this.switchDrawerShow();
      // 選択リストを検索して同じIDがあれば選択リストの最後に並び替え(表示を一番上にするため)
      for (let menu of this.SelectedMenus) {
        if (menu.id == selectId) {
          this.SelectedMenus.splice(this.SelectedMenus.indexOf(menu), 1);
          menu.count += 1;
          this.SelectedMenus.push(menu);
          return;
        }
      }
      this.deleteZeroItem();
      // 選択リストに同じIDが無ければリストに追加
      this.SelectedMenus.push({ id: selectId, name: selectName, count: 1 });
    },
    // 杯数0を選択リストから削除
    deleteZeroItem: function() {
      // 削除後のリスト
      var deletedArray = [];
      // 選択リストを一つずつ取り出し杯数が0より上のものを削除後リストに追加
      for (var menu of this.SelectedMenus) {
        if (menu.count > 0) {
          deletedArray.push(menu);
        }
      }
      // 削除後リストを選択リストに代入
      this.SelectedMenus = deletedArray;
    },
    deleteSelectItem: function(menu) {
      this.SelectedMenus.splice(this.SelectedMenus.indexOf(menu), 1);
    },
    // 選択リストの杯数(count)を変更する関数
    setSelectedMenusCount: function(selectId, selectName, changedCount) {
      // 変更後の杯数が0未満の場合は0をセット(改善の余地あり)
      if (changedCount < 0) {
        changedCount = 0;
      }
      // 選択リストを検索して同じIDの'count'の値を上書き
      for (var menu of this.SelectedMenus) {
        if (menu.id == selectId) {
          this.$set(menu, "count", changedCount);
        }
      }
    },
    sendOrder: function() {
      this.switchDrawerShow();
      this.deleteZeroItem();
      var orderTime = moment(new Date()).format("HH:mm:ss");
      for (var menu of this.SelectedMenus) {
        let newOrderRef = this.db.collection("orders").doc();
        newOrderRef.set({
          table: this.group,
          id: newOrderRef.id,
          name: menu.name,
          count: menu.count,
          time: orderTime
        });
      }
      this.SelectedMenus = [];
      this.isOrderComplete = !this.isOrderComplete;
    }
  },
  computed: {
    // 配列の要素順番を逆順にする
    reverseSelectedMenus() {
      return this.SelectedMenus.slice().reverse();
    },
    category: function() {
      return this.$route.query.category;
    },
    group: function() {
      return this.$route.query.group;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.v-expansion-panel-content{
  margin:0;
  padding:0;
}

[v-cloak] {
  display: none;
}
.menu-drawer {
  text-align: center;
}
.menu-drawer .menu-top {
  height: 80px;
  border-top: 1px solid gray;
}
.menu-drawer .menu-top-label {
  display: block;
  height: 100%;
  line-height: 80px;
  font-size: 27px;
  background: #fff;
  padding: 4px 0;
  cursor: pointer;
  text-align: center;
  right: 0;
}
.menu-drawer .other {
  background: rgba(0, 0, 0, 0.2);
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
}
.menu-drawer .content {
  display: table;
  height: 90%;
  border: 1px solid #ebebeb;
  border-radius: 4px;
  background: #fff;
  width: 90vw;
  top: 34px;
  right: 0;
  text-align: center;
}
.drawer-header {
  padding-top: 10px;
  padding-bottom: 10px;
  display: flex;
  justify-content: space-around;
}
.div-drawer-continue-btn {
  display: inline-block;
  width: 40%;
  margin-right: 10px;
}
.div-drawer-send-btn {
  display: inline-block;
  width: 40%;
  margin-left: 10px;
}
.btn-continue {
  height: 20px;
  width: 90%;
  background-color: #57ed7f;
}
.btn-send {
  height: 20px;
  width: 90%;
  background-color: #ed576a;
}
@media screen and (min-width: 415px) {
  .menu-drawer .content {
    width: 350px;
  }
}
.menu {
  height: 75%;
  width: 100%;
  margin-top: 10px;
  text-align: left;
  overflow-y: auto;
}
.menu-selected {
  font-size: 25px;
  line-height: 50px;
  align-items: center;
  border-top: 1px solid gray;
}
.menu-selected-child1 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-right: 10px;
  margin-left: 10px;
}
.btn-menu {
  text-decoration: none;
  font-size: 25px;
  font-weight: bold;
  width: 20%;
  height: 44px;
  text-align: center;
  overflow: hidden;
  color: #038da8;
  background: none;
  border: none;
  margin: 0;
  padding: 0;
  flex-grow: 1;
}
.btn-delete {
  text-decoration: none;
  font-size: 20px;
  font-weight: bold;
  width: 10%;
  height: 44px;
  border-radius: 10px;
  text-align: center;
  overflow: hidden;
  border: solid 2px rgba(255, 255, 255, 0.47);
  margin: 0;
  padding: 0px;
  background: #ffffff;
  color: #969696;
  flex-grow: 1;
}
.menu-selected-child1-name {
  margin-left: 20px;
  width: 60%;
  white-space: nowrap;
  overflow: hidden;
}
.menu-selected-child1-count {
  text-align: center;
  width: 13%;
}
.menu-drawer .content,
.menu-drawer .other {
  position: fixed;
}
.menu-drawer .btn,
.menu-drawer .content {
  z-index: 1001;
}
.menu-drawer .other {
  z-index: 1000;
}
.menu-drawer #chk {
  display: none;
}
.menu-drawer #chk ~ .btn::before {
  display: block;
}
.menu-drawer #chk ~ .btn::after {
  display: none;
}
.menu-drawer #chk ~ .other {
  display: none;
}
.menu-drawer #chk:checked ~ .btn::before {
  display: none;
}
.menu-drawer #chk:checked ~ .btn::after {
  display: block;
}
.menu-drawer #chk:checked ~ .other {
  display: block;
}
.menu-drawer #chk ~ .content {
  transform: translate(350%, 0);
  transition: transform 0.3s ease-in-out;
}
.menu-drawer #chk:checked ~ .content {
  transform: none;
}
@keyframes click-wave {
  0% {
    position: relative;
    width: 30px;
    height: 30px;
    opacity: 0.35;
  }
  100% {
    width: 200px;
    height: 200px;
    margin-top: -80px;
    margin-left: -80px;
    opacity: 0;
  }
}
.menu label {
  line-height: 40px;
  display: block;
  border-top: 1px solid gray;
}
.menu .option-input {
  position: relative;
  top: 6px;
  right: 0;
  bottom: 0;
  left: 0;
  width: 30px;
  height: 30px;
  margin-right: 0.5rem;
  cursor: pointer;
  transition: all 0.15s ease-out 0s;
  color: #ffffff;
  border: none;
  outline: none;
  background: #d7cbcb;
  -webkit-appearance: none;
  appearance: none;
}
.menu .option-input:hover {
  background: #406091;
}
.menu .option-input:checked {
  background: #3c80da;
}
.menu .option-input:checked::before {
  font-size: 20px;
  line-height: 30px;
  position: absolute;
  display: inline-block;
  width: 30px;
  height: 30px;
  content: "✔";
  text-align: center;
}
.menu .option-input:checked::after {
  position: relative;
  display: block;
  content: "";
  -webkit-animation: click-wave 0.65s;
  animation: click-wave 0.65s;
  background: #3c80da;
}
.menu .option-input.radio {
  border-radius: 50%;
}
.menu .option-input.radio::after {
  border-radius: 50%;
}
.menu-drawer .content h2 {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  background: #383838;
  margin: 0;
  padding: 0.7em;
  border-radius: 4px 4px 0 0;
}
.hidden {
  display: none;
}
.order-complete-alert {
  margin: 0 auto;
}
</style>