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
              @click="sortItems('group')"
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
    <v-snackbar v-model="touchingSnackShow" :timeout="-1" dark top>{{touchingText}}</v-snackbar>
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
                  @mousedown="openText(order.data.group)"
                  @mouseup="closeText()"
                  @touchstart="openText(order.data.group)"
                  @touchend="closeText()"
                >{{order.data.group}}</span>
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
          value: "group"
        },
        { text: "Name", value: "name" },
        { text: "Count", value: "count" },
        { text: "Timestamp", value: "time" }
      ],
      orders: [],
      ordersAscPattern: {
        //0:ソート無し 1:昇順 -1:降順
        group: 0,
        time: 0,
        name: 0,
        count: 0
      },
      ordersIsNumeric: {
        group: false,
        time: false,
        name: false,
        count: true
      },
      touchingSnackShow: false,
      touchingText: ""
    };
  },
  created: function() {
    this.db = firebase.firestore();

    let _this = this;

    this.db
      .collection(this.company)
      .doc("order")
      .onSnapshot(function(doc) {
        _this.orders = [];
        let data = doc.data();
        Object.keys(data).forEach(key =>
          _this.orders.push({
            id: data[key]["id"],
            data: data[key]
          })
        );

        let localOrdersAscPattern = _this.ordersAscPattern;
        Object.keys(localOrdersAscPattern).some(key => {
          if (localOrdersAscPattern[key] == 0) {
            return false;
          } else {
            localOrdersAscPattern[key] = -localOrdersAscPattern[key];
            _this.sortItems(key);
            return true;
          }
        });
      });
  },
  computed: {
    company: function() {
      return this.$route.query.company;
    }
  },
  methods: {
    deleteItem(itemId) {
      let deleteField = {};
      (deleteField[itemId] = firebase.firestore.FieldValue.delete()),
        this.db
          .collection(this.company)
          .doc("order")
          .update(deleteField);
    },
    sortItems(sortByString) {
      //sortByString:並び替えるフィールド名

      //並び替えるフィールド名の現在の昇順降順情報を取得
      let sortByAscPattern = this.ordersAscPattern[sortByString];

      //現在が 1:昇順なら -1:降順にする
      if (sortByAscPattern == 1) {
        sortByAscPattern = -1;
      } else {
        sortByAscPattern = 1;
      }

      //全てのフィールドの昇順降順情報をリセット
      Object.keys(this.ordersAscPattern).forEach(
        key => (this.ordersAscPattern[key] = 0)
      );

      //該当の昇順降順情報を更新
      this.ordersAscPattern[sortByString] = sortByAscPattern;

      //並び替え処理
      return this.orders.sort((a, b) => {
        let isNumeric = this.ordersIsNumeric[sortByString];
        const compare = function(a, b, isNumeric) {
          let dataA = String(a.data[sortByString]);
          let dataB = String(b.data[sortByString]);
          return dataA.localeCompare(dataB, "ja", { numeric: isNumeric });
        };

        return compare(a, b, isNumeric) < 0
          ? -sortByAscPattern
          : compare(a, b, isNumeric) > 0
          ? sortByAscPattern
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
