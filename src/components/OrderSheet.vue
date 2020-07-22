<template>
  <div>
    <v-app-bar app color="#F52900" dense height="3px" flat></v-app-bar>
    <div class="pa-0 ma-0">
      <v-card height="44px" color="#F52900">
        <v-container fill-height width="40px" class="pa-0 font-weight-bold white--text">
          <v-row class="pa-0 mx-2">
            <v-col cols="1"></v-col>
            <v-col
              cols="3"
              class="pa-0 text-truncate"
              align="center"
              @click="sortItems('table')"
            >{{$t("Table")}}</v-col>
            <v-col
              cols="3"
              class="pa-0 text-truncate"
              align="center"
              @click="sortItems('name')"
            >{{$t("Name")}}</v-col>
            <v-col
              cols="1"
              class="pa-0 text-truncate"
              align="center"
              @click="sortItems('count')"
            >{{$t("Count")}}</v-col>
            <v-col
              cols="4"
              class="pa-0 text-truncate"
              align="center"
              @click="sortItems('time')"
            >{{$t("TimestampOfOrder")}}</v-col>
          </v-row>
        </v-container>
      </v-card>
    </div>
    <v-snackbar v-model="touchingSnackShow" :timeout="0" dark top>{{touchingText}}</v-snackbar>
    <transition-group name="slide-fade">
      <div v-for="order of orders" v-bind:key="order.id" class="order-top pa-0 my-1">
        <v-card height="44px" color="#f7f39c">
          <v-container fill-height width="40px" class="pa-0">
            <v-row class="pa-0 mx-2">
              <v-col cols="1" class="pa-0" align="center">
                <v-btn color="secondary" fab small icon depressed @click="deleteItem(order.id)">
                  <v-icon>✖</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="3" class="pa-0 text-truncate" align="center">
                <span
                  @mousedown="openText(order.data.table)"
                  @mouseup="closeText()"
                  @touchstart="openText(order.data.table)"
                  @touchend="closeText()"
                >{{order.data.table}}</span>
              </v-col>
              <v-col cols="3" class="pa-0 text-truncate" align="left">
                <span
                  @mousedown="openText(order.data.name)"
                  @mouseup="closeText()"
                  @touchstart="openText(order.data.name)"
                  @touchend="closeText()"
                >{{order.data.name}}</span>
              </v-col>
              <v-col cols="1" class="pa-0 text-truncate" align="center">{{order.data.count}}</v-col>
              <v-col cols="4" class="pa-0 text-truncate" align="center">{{order.data.time}}</v-col>
            </v-row>
          </v-container>
        </v-card>
      </div>
    </transition-group>
    <v-footer app padless height="44px">
      <CommonFooter />
    </v-footer>
  </div>
</template>

<script>
import firebase from "firebase";
import "firebase/firestore";
import utilsMixin from "../utils";
import CommonFooter from "./CommonFooter.vue";

export default {
  name: "orderSheet",
  components: {
    CommonFooter
  },
  mixins: [utilsMixin],
  data: function() {
    return {
      db: null,
      headers: [
        {
          text: "Group",
          align: "start",
          sortable: false,
          value: "table"
        },
        { text: "Name", value: "name" },
        { text: "Count", value: "count" },
        { text: "Timestamp", value: "time" }
      ],
      orders: [],
      ordersIsAsc: {},
      ordersIsNumeric: {
        table: false,
        time: false,
        name: false,
        count: true
      },
      touchingSnackShow: false,
      touchingText: ""
    };
  },
  methods: {
    deleteItem(itemId) {
      this.db
        .collection("orders")
        .doc(itemId)
        .delete();
    },
    sortItems(sortByString) {
      //sortByString:並び替えるフィールド名

      //sort関数に使用する昇順降順判別 1:昇順 -1:降順
      let ascOrDescNum = 1;

      //並び替えるフィールド名の現在の昇順降順情報を取得
      let sortByIsAsc = this.ordersIsAsc[sortByString];

      //現在がtrue(昇順)なら降順にする
      if (sortByIsAsc) {
        ascOrDescNum = -1;
      }

      //全てのフィールドの昇順降順情報をリセット
      Object.keys(this.ordersIsAsc).forEach(
        key => (this.ordersIsAsc[key] = false)
      );

      //処理前がfalseの場合のみ該当の昇順降順情報をtrue(昇順)にする
      if (!sortByIsAsc) {
        this.ordersIsAsc[sortByString] = true;
      }

      //並び替え処理
      return this.orders.sort((a, b) => {
        let isNumeric = this.ordersIsNumeric[sortByString];
        const compare = function(a, b, isNumeric) {
          let dataA = String(a.data[sortByString]);
          let dataB = String(b.data[sortByString]);
          return dataA.localeCompare(dataB, "ja", { numeric: isNumeric });
        };

        return compare(a, b, isNumeric) < 0
          ? -ascOrDescNum
          : compare(a, b, isNumeric) > 0
          ? ascOrDescNum
          : 0;
      });
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
  created: function() {
    this.db = firebase.firestore();

    var _this = this;
    // todos コレクションを監視する
    this.db.collection("orders").onSnapshot(function(querySnapshot) {
      _this.orders = [];
      querySnapshot.forEach(function(doc) {
        let pushData = {
          id: doc.id,
          data: doc.data()
        };
        _this.orders.push(pushData);
      });
    });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.1s ease;
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(100px);
  opacity: 0;
}
</style>
