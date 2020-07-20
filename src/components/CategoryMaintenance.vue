<template>
  <v-data-table :headers="headers" :items="category" class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>My MENU</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">New Item</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.name" label="Category"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save()">Save</v-btn>
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
</template>

<script>
import firebase from "firebase";
import "firebase/firestore";

export default {
  data: () => ({
    dialog: false,
    headers: [
      { text: "Category", value: "name" },
      { text: "Actions", value: "actions", sortable: false }
    ],
    category: [],
    editedIndex: -1,
    editedItem: {
      id: "",
      name: ""
    },
    defaultItem: {
      id: "",
      name: ""
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
    this.getCategoryDb();
  },

  methods: {
    getCategoryDb: function() {
      console.log("getCategoryDb start");
      this.db = firebase.firestore();
      const _this = this;

      this.db.collection("category").onSnapshot(function(querySnapshot) {
        _this.category = [];
        querySnapshot.forEach(function(doc) {
          _this.category.push(doc.data());
        });
      });
      console.log("getCategoryDb end");
    },
    editItem(item) {
      this.editedIndex = this.category.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      confirm("Are you sure you want to delete this item?") &&
        this.db
          .collection("category")
          .doc(item.id)
          .delete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      this.db = firebase.firestore();
      let newCategoryRef = null;
      if (this.editedIndex > -1) {
        // Add a new document with a generated id.
        newCategoryRef = this.db.collection("category").doc(this.editedItem.id);
      } else {
        newCategoryRef = this.db.collection("category").doc();
      }

      // later...
      console.log(newCategoryRef);
      let data = {
        id: newCategoryRef.id,
        name: this.editedItem.name
      };
      newCategoryRef.set(data, { merge: true });
      this.close();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
