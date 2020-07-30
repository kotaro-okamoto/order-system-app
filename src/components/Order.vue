<template>
  <div class="order">
    <v-app-bar app fixed color="#F52900" dense height="55px" flat>
      <v-app-bar-nav-icon dark @click="switchDrawerShow()"></v-app-bar-nav-icon>
      <v-tabs
        center-active
        centered
        v-model="tab"
        background-color="#F52900"
        dark
        grow
        icons-and-text
      >
        <v-tab v-for="menu of menus" :key="menu.index" class="text-h5" fixed>{{menu.groupByValue}}</v-tab>
      </v-tabs>
    </v-app-bar>
    <v-snackbar v-model="touchingSnackShow" :timeout="10000" dark top>{{touchingText}}</v-snackbar>
    <v-snackbar
      v-model="completeSnackShow"
      :timeout="timeout"
      color="#00BFBF"
      transition="scroll-y-reverse-transition"
      multiLine
    >
      <v-row justify="center">
        <v-col cols="12" align="center" class="pl-8 ma-0">{{$t("OrderComplete")}}</v-col>
      </v-row>
    </v-snackbar>
    <div>
      <v-tabs-items v-model="tab">
        <v-tab-item v-for=" menu of menus" :key="menu.index">
          <v-card
            flat
            v-for="product of menu.products"
            :key="product.id"
            @click="select(product.id,product.name)"
          >
            <v-card-text class="text-h5 black--text">{{product.name}}</v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </div>
    <v-navigation-drawer app v-model="isDrawerShow" temporary right>
      <v-list class="ma-0 pa-0">
        <v-btn
          color="#F52900"
          height="50px"
          width="14rem"
          class="my-2 mx-0 pa-0"
          rounded
          dark
          @click="sendOrder"
        >{{$t("Order")}}</v-btn>

        <v-divider></v-divider>

        <v-list-item
          v-for="menu of reverseSelectedMenus"
          v-bind:key="menu.id"
          class="ma-0 py-0 px-2"
        >
          <v-list-item-content class="ma-0 pa-0">
            <v-list-item-title>
              <v-container class="ma-0 pa-0">
                <v-row align="center" class="ma-0 pa-0">
                  <v-col cols="1" class="ma-0 pa-0">
                    <v-btn icon small @click="deleteSelectItem(menu)">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col cols="6" class="mx-3 my-0 pa-0 text-truncate">
                    <span
                      class="menu-selected-child1-name"
                      @mousedown="openText(menu.name)"
                      @mouseup="closeText()"
                      @touchstart="openText(menu.name)"
                      @touchend="closeText()"
                    >{{menu.name}}</span>
                  </v-col>
                  <v-col cols="1" class="ma-0 pa-0">
                    <v-btn
                      icon
                      small
                      color="#038da8"
                      @click="setSelectedMenusCount(menu.id,menu.name,--menu.count)"
                    >
                      <v-icon>mdi-minus</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col cols="2" class="ma-0 pa-0">{{menu.count}}</v-col>
                  <v-col cols="1" class="ma-0 pa-0">
                    <v-btn
                      icon
                      small
                      color="#038da8"
                      @click="setSelectedMenusCount(menu.id,menu.name,++menu.count)"
                    >
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-fab-transition>
      <v-btn
        :key="activeFab.icon"
        :color="activeFab.color"
        fab
        small
        dark
        fixed
        bottom
        right
        @click="changeButton()"
      >
        <v-icon>{{activeFab.icon}}</v-icon>
      </v-btn>
    </v-fab-transition>
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
      tab: "",
      buttonPattern: 0,
      menus: [],
      SelectedMenus: [],
      isDrawerShow: false,
      active: "",
      isOrderComplete: false,
      isSelectedMenusEmpty: true,
      mixins: [utilsMixin],
      completeSnackShow: false,
      touchingSnackShow: false,
      touchingText: "",
      timeout: 4000
    };
  },
  created: function() {
    this.getMenusDb();
  },
  methods: {
    changeButton: function() {
      this.buttonPattern += 1;
      if (this.buttonPattern > 1) {
        this.buttonPattern = 0;
      }
    },
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
      if (this.SelectedMenus.length > 0) {
        this.completeSnackShow = true;
      }

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
    },
    openText: function(thisText) {
      this.touchingText = thisText;
      this.touchingSnackShow = true;
    },
    closeText: function() {
      this.touchingText = "";
      this.touchingSnackShow = false;
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
    },
    activeFab: function() {
      switch (this.buttonPattern) {
        case 1:
          this.changeLocale("en");
          return {
            color: "red",
            icon: "mdi-alphabetical-variant"
          };
        default:
          this.changeLocale("ja");
          return {
            color: "success",
            icon: "mdi-syllabary-hiragana"
          };
      }
    }
  },
  watch: {
    SelectedMenus: function() {
      if (this.SelectedMenus.length > 0) {
        this.isSelectedMenusEmpty = false;
      } else {
        this.isSelectedMenusEmpty = true;
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
nav {
  width: 350px !important;
  max-width: 85vw !important;
}

.fav-enter-active,
.fav-leave-active {
  transition: all 0.1s ease;
}
.fav-enter,
.fav-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.order {
  text-align: center;
}
</style>