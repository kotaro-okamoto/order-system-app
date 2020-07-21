<template>
  <div class="top">
    <div>
      <v-card class="pa-0 my-2 mx-10">
        <v-card-title class="pa-0 ma-0">
          <v-row justify="center">
            <v-col cols="12" sm="6" md="4" class="pa-0 ma-0">
              <span>{{$t("OrderManage")}}</span>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-actions>
          <v-container>
            <v-row justify="center">
              <v-col cols="12" sm="6" md="4" class="pa-0 ma-0">
                <v-btn
                  rounded
                  color="primary"
                  dark
                  to="/orderSheet"
                  target="_blank"
                >{{$t("OrderHistory")}}</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-actions>
      </v-card>
    </div>
    <div>
      <v-card class="pa-0 my-2 mx-10">
        <v-card-title class="pa-0 ma-0">
          <v-row justify="center">
            <v-col cols="12" sm="6" md="4" class="pa-0 ma-0">
              <span>{{$t("CreateForUser")}}</span>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row justify="center">
              <v-col cols="12" sm="6" md="4" class="pa-0 ma-0">
                <v-select
                  :items="category"
                  v-model="selectedCategory"
                  item-text="name"
                  item-value="name"
                  label="category"
                  return-object
                  class="text-subtitle-1"
                  @change="setSelectedGroup()"
                />
              </v-col>
            </v-row>
          </v-container>
          <v-container>
            <v-row justify="center">
              <v-col cols="12" sm="6" md="4" class="pa-0 ma-0">
                <v-select
                  :items="selectedGroupList"
                  item-text="groupName"
                  item-value="groupName"
                  label="group"
                  v-model="selectedGroup"
                  return-object
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-container>
            <v-row justify="center">
              <v-col cols="12" xs="12" sm="6" md="6" lg="6" xl="6" class="pa-0 mx-0 my-3">
                <v-btn
                  rounded
                  color="primary"
                  dark
                  :to="{name: 'qrPrint', 
                    query: {
                    category: this.selectedCategory.name,
                    group: this.selectedGroup.groupName
                  }}"
                  target="_blank"
                >{{$t("PrintPage")}}</v-btn>
              </v-col>
              <v-col cols="12" xs="12" sm="6" md="6" lg="6" xl="6" class="pa-0 mx-0 my-3">
                <v-btn
                  rounded
                  color="primary"
                  dark
                  target="_blank"
                  :to="{name: 'order', 
                    query: {
                    category: this.selectedCategory.name,
                    group: this.selectedGroup.groupName
                  }}"
                >{{$t("OrderPage")}}</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-actions>
      </v-card>
    </div>
    <div>
      <v-card class="my-2 mx-10">
        <v-card-title>
          <v-row justify="center">
            <v-col cols="12" sm="6" md="4" class="pa-0 ma-0">
              <span>{{$t("Maintenance")}}</span>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text></v-card-text>
        <v-card-actions>
          <v-container>
            <v-row justify="center">
              <v-col cols="12" xs="12" sm="4" md="4" lg="4" xl="4" class="pa-0 my-2 mx-0">
                <v-btn
                  rounded
                  color="primary"
                  dark
                  :to="{name: 'CategoryMaintenance'}"
                  target="_blank"
                >{{$t("Category")}}</v-btn>
              </v-col>
              <v-col cols="12" xs="12" sm="4" md="4" lg="4" xl="4" class="pa-0 my-2 mx-0">
                <v-btn
                  rounded
                  color="primary"
                  dark
                  :to="{name: 'GroupMaintenance'}"
                  target="_blank"
                >{{$t("Group")}}</v-btn>
              </v-col>
              <v-col cols="12" xs="12" sm="4" md="4" lg="4" xl="4" class="pa-0 my-2 mx-0">
                <v-btn
                  rounded
                  color="primary"
                  dark
                  :to="{name: 'MenuMaintenance'}"
                  target="_blank"
                >{{$t("Menu")}}</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-actions>
      </v-card>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import "firebase/firestore";
import utilsMixin from "../utils";

export default {
  name: "Top",
  mixins: [utilsMixin],
  data() {
    return {
      selectedCategory: "",
      selectedGroupList: [],
      selectedGroup: "",
      groupedGroupList: [],
      category: []
    };
  },
  created() {
    this.getCategoryDb();
    this.getGroupDb();
  },
  methods: {
    getCategoryDb: function() {
      console.log("getCategoryDb start");
      this.db = firebase.firestore();
      const _this = this;

      this.db.collection("category").onSnapshot(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          _this.category.push(doc.data());
        });
      });
      console.log("getCategoryDb end");
    },
    getGroupDb: function() {
      console.log("getGroupDb start");
      this.db = firebase.firestore();
      const _this = this;

      this.db.collection("group").onSnapshot(function(querySnapshot) {
        let groupDbList = [];
        querySnapshot.forEach(function(doc) {
          groupDbList.push(JSON.stringify(doc.data()));
        });
        _this.groupedGroupList = _this.groupBy("categoryId", groupDbList);
      });

      console.log("getGroupDb end");
    },
    setSelectedGroup: function() {
      this.selectedGroupList = [];
      for (let group of this.groupedGroupList) {
        if (group.groupByValue === this.selectedCategory.id) {
          this.selectedGroupList = group.products;
          return;
        }
      }
    }
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

.v-select {
  font-size: 19px;
}
</style>
