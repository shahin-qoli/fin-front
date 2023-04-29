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
        :items="salePersons"
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
                                <v-text-field v-model="editedItem.name" label="نام ویزیتور"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field v-model="editedItem.b1_slpcode" label="کد بی وان"></v-text-field>
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
            return {
                search: '',
                isLoading:null,
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
            }
        ,
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
          this.$store.dispatch('editSalePerson', this.editedItem)
        } else {
          this.$store.dispatch('createSalePerson',this.editedItem)
        }
        this.close()
      },
            loadSalePersons() {
                // console.log(this)
                this.$store.dispatch('loadSalePersons')
            }
        },
        computed:{
        headers(){
            return [
                {
                    text: "نام",
                    align: "center",
                    value: "name",
                },
                {
                    text: "کد بی وان",
                    align: "center",
                    value: "b1_code",
                },             {
                text: "",
                align: "center",
                //sortable: false,
                value: "actions",
                }

            ]
        },
        salePersons(){
            return this.$store.getters.getSalePersons
        },formTitle () {
        return this.editedIndex === -1 ? 'ویزیتور جدید' : 'ویرایش ویزیتور'
      }
    },
    created(){
        this.loadSalePersons();
    }
    }

</script>
