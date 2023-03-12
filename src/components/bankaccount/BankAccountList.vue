<template>
    <v-card outlined>
        <v-card-title>
            <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="جستجو"
            single-line
            hide-details
            ></v-text-field>
        </v-card-title>
        <v-data-table
        fixed-header
        dense
        :headers="headers"
        :items="bankAccounts"
        item-key="id"
        :search="search"
        :loading="isLoading"
          >
            <template v-slot:top>
                <v-toolbar flat color="white">
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                        color="primary"
                        dark
                        class="mb-2"
                        v-bind="attrs"
                        v-on="on"
                        >جدید</v-btn>
                    </template>
                    <v-card>
                        <v-card-title>
                        <span class="headline"><span class="text-h5">{{ formTitle }}</span></span>
                        </v-card-title>
                        <v-card-text>
                        <v-container>
                            <v-row>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field v-model="editedItem.owner_name" label="صاحب حساب"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field v-model="editedItem.account_number" label="شماره حساب"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field v-model="editedItem.b1_account_code" label="سرفصل حساب B1"></v-text-field>
                            </v-col>
                            </v-row>
                        </v-container>
                        </v-card-text>
                        <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="close">لغو</v-btn>
                        <v-btn color="blue darken-1" text @click="save">ذخیره</v-btn>
                        </v-card-actions>
                    </v-card>
                    </v-dialog>
                </v-toolbar>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon
                small
                class="mr-2"
                @click="editItem(item)"
              >
                mdi-pencil
              </v-icon>
            </template>
          </v-data-table>      
    </v-card>
</template>
<script>

export default{
    data(){
        return{
            dialog: false,
            isLoading:null,
            search: '',
            editedIndex: -1,
            editedItem: {
                owner_name: '',
                account_number: '',
                b1_account_code: '',
                bank_id: 1
            },
            defaultItem: {
                owner_name: '',
                account_number: '',
                b1_account_code: '',
                bank_id : 1
            },
        }
    },    watch: {
      dialog (val) {
        val || this.close()
      },
    },
    computed:{
        headers(){
            return [
                {
                text: "صاحب حساب",
                align: "center",
                //sortable: false,
                value: "owner_name",
                },
                {
                text: "شماره حساب",
                align: "center",
                //sortable: false,
                value: "account_number",
                },             {
                text: "سرفصل حساب B1",
                align: "center",
                //sortable: false,
                value: "b1_account_code",
                },             {
                text: "",
                align: "center",
                //sortable: false,
                value: "actions",
                }
            ]
        },
        bankAccounts(){
            return this.$store.getters.getBankAccounts
        },      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      }
    },
    methods:{
      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
      editItem(item){
        this.editedItem = item
        this.editedIndex = item.id
        this.dialog = true
      },
      save () {
        if (this.editedIndex > -1) {
          this.$store.dispatch('editBankAccount', this.editedItem)
        } else {
          this.$store.dispatch('createBankAccount',this.editedItem)
        }
        this.close()
      },
        loadBankAccounts() {
        // console.log(this)
        this.$store.dispatch('loadBankAccounts')
      }
    },
    created(){
        this.loadBankAccounts();
    }
}
</script>