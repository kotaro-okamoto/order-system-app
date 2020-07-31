<template>
  <div class="top">
    <v-app-bar app color="#F52900" dense height="3px" flat></v-app-bar>
    <div>
      <v-card class="pa-0 my-2 mx-10">
        <v-card-title class="pt-4 pb-0 px-0 ma-0">
          <v-row justify="center">
            <v-col cols="12" sm="6" md="4" class="pa-0 ma-0">
              <span>{{$t("CreateForCompany")}}</span>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row align="center" justify="center">
              <v-col cols="12" sm="9" md="10" lg="10" xl="10" class="pa-0 ma-0">
                <v-select
                  :items="company"
                  v-model="selectedCompany"
                  item-text="name"
                  item-value="id"
                  label="Company"
                  return-object
                />
                </v-col>
                <v-col cols="12" sm="3" md="2" lg="2" xl="2" class="pa-0 ma-0">
                  <v-icon medium class="mr-2" @click="clickNew">mdi-plus</v-icon>
                  <v-icon :disabled="!this.selectedCompany.id" medium class="mr-2" @click="clickEdit">mdi-pencil</v-icon>
                  <v-icon medium :disabled="!this.selectedCompany.id" @click="deleteItem">mdi-delete</v-icon>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-container>
            <v-row justify="center">
              <v-col cols="12" class="pa-0 mx-0 my-3">
                <v-btn
                  height="60px"
                  width="16rem"
                  color="#F52900"
                  rounded
                  :disabled="!this.selectedCompany.id" 
                  :to="{name: 'userTop', 
                    query: {
                    company: this.selectedCompany.id,
                  }}"
                  target="_blank"
                >{{$t("CompanyPage")}}</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-actions>
      </v-card>
      <v-dialog v-model="dialog" max-width="500px" >
        <v-card>
          <v-card-title>
            <span class="headline">{{dialogTitle}}</span>
          </v-card-title>
          <v-card-text>
            <v-container id="container-dialog-company-edit" >
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field 
                  v-model="selectedCompany.name"
                  label="Company" 
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="#F52900" text @click="close">{{$t("Cancel")}}</v-btn>
            <v-btn color="blue darken-1" text @click="save">{{$t("Save")}}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
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
  name: "Top",
  components: {
    CommonFooter
  },
  mixins: [utilsMixin],
  data() {
    return {
      selectedCompany: {
        id: "",
        name: ""
      },
      dialog: false,
      dialogTitle: "",
      isNew: true,
      company: []
    };
  },
  created() {
    this.getCompanyDb();
  },
  methods: {
    getCompanyDb: function() {
      console.log("getCategoryDb start");
      this.db = firebase.firestore();
      
      const _this = this;

      this.db.collection("company").onSnapshot(function(querySnapshot) {
        _this.company = []
        querySnapshot.forEach(function(doc) {
          _this.company.push(doc.data());
        });
      });
      console.log("getCategoryDb end");
    },
    clickNew: function(){
      this.selectedCompany={
        id: "",
        name: ""
      }
      this.dialogTitle = "New Item"
      this.isNew = true
      this.dialog = true;
    },
    clickEdit: function(){
      this.dialogTitle = "Edit Item"
      this.isNew = false
      this.dialog = true;
    },
    close() {
      this.selectedCompany={
        id: "",
        name: ""
      }
      this.dialog = false;
    },
    save() {
      this.db = firebase.firestore();
      let newCompanyRef = null;
      if (this.isNew) {
        newCompanyRef = this.db.collection("company").doc();
      } else {
        newCompanyRef = this.db.collection("company").doc(this.selectedCompany.id);
      }

      // later...
      console.log(newCompanyRef);
      let data = {
        id: newCompanyRef.id,
        name: this.selectedCompany.name
      };
      newCompanyRef.set(data, { merge: true });
      this.close();
    },
    deleteItem() {
      confirm("Are you sure you want to delete this item?") &&
        this.db
          .collection("company")
          .doc(this.selectedCompany.id)
          .delete();
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.top .v-btn__content {
  color: white;
}

.top .v-select__selections {
  height: 50px;
  line-height: 30px;
}

.top .v-label {
  font-size: 18px;
}

#container-dialog-company-edit .v-input input {
  max-height: 100px !important;
}
</style>

<style scoped>
.top {
  text-align: center;
  height: 100%;
  width: 100%;
}
</style>

