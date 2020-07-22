<template>
  <div>
    <v-app-bar app color="#F52900" dense height="3px" flat></v-app-bar>
    <v-data-table
      :headers="headers"
      :items="menus"
      class="elevation-1"
      group-by="category"
      hide-default-footer
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>My MENU</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="#F52900" dark class="mb-2" v-bind="attrs" v-on="on">{{$t("NewItem")}}</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" md="6" lg="6" xl="6">
                      <v-select
                        v-model="editedItem.category"
                        :items="menuCategories"
                        item-text="name"
                        item-value="name"
                        label="Category"
                        @change="checkNew"
                        height="44px"
                        return-object
                      ></v-select>
                      <v-text-field
                        v-if="categoryIsNew"
                        v-model="editedItem.newCategoryName"
                        label="NewCategory"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6" lg="6" xl="6">
                      <v-text-field
                        id="text-input-new-name"
                        v-model="editedItem.name"
                        label="Name"
                        height="44px"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#00BFBF" text @click="close">{{$t("Cancel")}}</v-btn>
                <v-btn color="#F52900" text @click="save">{{$t("Save")}}</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>
    <v-footer app padless height="44px">
      <CommonFooter />
    </v-footer>
  </div>
</template>

<script>
import firebase from "firebase";
import "firebase/firestore";
import CommonFooter from "./CommonFooter.vue";

export default {
  components: {
    CommonFooter
  },
  data: () => ({
    dialog: false,
    headers: [
      { text: "Name", value: "name" },
      { text: "Category", value: "category" },
      { text: "Actions", value: "actions", sortable: false }
    ],
    menus: [],
    menuCategories: [],
    categoryIsNew: false,
    editedIndex: -1,
    editedItem: {
      name: "",
      category: "",
      newCategoryName: ""
    },
    defaultItem: {
      name: "",
      category: "",
      newCategoryName: ""
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {
    this.getMenusDb();
  },

  methods: {
    getMenusDb: function() {
      console.log("getMenusDb start");
      this.db = firebase.firestore();
      const _this = this;

      this.db.collection("menusDB").onSnapshot(function(querySnapshot) {
        _this.menus = [];
        _this.menuCategories = [
          {
            name: "新規作成",
            isNew: true
          }
        ];
        querySnapshot.forEach(function(doc) {
          let data = doc.data();
          _this.menus.push(data);
          _this.menuCategories.push({
            name: data.category,
            isNew: false
          });
        });
      });

      console.log("getMenusDb end");
    },
    editItem(item) {
      this.editedIndex = this.menus.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      confirm("Are you sure you want to delete this item?") &&
        this.db
          .collection("menusDB")
          .doc(item.id)
          .delete();
    },

    close() {
      this.dialog = false;
      this.categoryIsNew = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      this.db = firebase.firestore();
      let newMenuRef = null;
      if (this.editedIndex > -1) {
        // Add a new document with a generated id.
        newMenuRef = this.db.collection("menusDB").doc(this.editedItem.id);
      } else {
        newMenuRef = this.db.collection("menusDB").doc();
      }

      let categoryData = "";
      if (this.categoryIsNew) {
        categoryData = this.editedItem.newCategoryName;
      } else {
        categoryData = this.editedItem.category.name;
      }

      let data = {
        id: newMenuRef.id,
        name: this.editedItem.name,
        category: categoryData
      };
      newMenuRef.set(data, { merge: true });
      this.close();
    },
    checkNew: function(item) {
      this.categoryIsNew = item.isNew;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
