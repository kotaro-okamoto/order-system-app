<template>
  <div>
    <v-app-bar app color="#F52900" dense height="3px" flat></v-app-bar>
    <v-data-table
      :headers="headers"
      :items="menus"
      class="elevation-1"
      group-by="category"
      hide-default-footer
      :items-per-page="-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>My MENU</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="#F52900" fab dark top right v-bind="attrs" v-on="on" class="mt-10">
                <v-icon dark>mdi-plus</v-icon>
              </v-btn>
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
                        id="text-input-dialog-name"
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
import utilsMixin from "../utils";
import CommonFooter from "./CommonFooter.vue";

export default {
  components: {
    CommonFooter
  },
  mixins: [utilsMixin],
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
      category: {},
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
    },
    company: function() {
      return this.$route.query.company;
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

      this.db
        .collection(this.company)
        .doc("menu")
        .onSnapshot(function(doc) {
          _this.menus = [];
          _this.menuCategories = [
            {
              name: "新規作成",
              isNew: true
            }
          ];

          let data = doc.data();
          Object.keys(data).forEach(key => {
            _this.menus.push(data[key]);
            _this.menuCategories.push({
              name: data[key].category,
              isNew: false
            });
          });
        });
    },
    editItem(item) {
      this.editedIndex = this.menus.indexOf(item);
      let tempEditedItem = {
        category: {
          isNew: false,
          name: item.category
        },
        id: item.id,
        name: item.name
      };
      console.log(item);
      this.editedItem = Object.assign({}, tempEditedItem);
      // this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      let deleteField = {};
      (deleteField[item.id] = firebase.firestore.FieldValue.delete()),
        confirm("Are you sure you want to delete this item?") &&
          this.db
            .collection(this.company)
            .doc("menu")
            .update(deleteField);
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
      let newMenuRef = this.db.collection(this.company).doc("menu");
      let updateId = "";
      if (this.editedIndex > -1) {
        // Add a new document with a generated id.
        updateId = this.editedItem.id;
      } else {
        updateId = this.createRandomId();
      }

      let categoryData = "";
      if (this.categoryIsNew) {
        categoryData = this.editedItem.newCategoryName;
      } else {
        categoryData = this.editedItem.category.name;
      }

      let updateData = {};
      updateData[updateId] = {
        id: updateId,
        name: this.editedItem.name,
        category: categoryData
      };

      console.log(updateData);
      newMenuRef.set(updateData, { merge: true });
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
.v-dialog .v-select__selections {
  line-height: 30px;
}

#text-input-dialog-name {
  margin: 0;
  padding: 0;
}
</style>
