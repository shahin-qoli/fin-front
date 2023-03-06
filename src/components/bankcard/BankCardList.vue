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
        :items="bankCards"
        item-key="id"
        class=""
        :search="search"
        :loading="isLoading"
        :single-expand="singleExpand"
        :expanded.sync="expanded"
        show-expand
        
        >
            <template v-slot:expanded-item="{ headers,item}">
                <td :colspan="headers.length">
                    <v-container fluid style="margin: 0px; padding: 0px; width: 100%">
                        <v-row dense >
                        <v-form  @submit.prevent="submitAccount(item)">
                          
                                <v-col cols="12" >
                                    <v-select
                                    :items="bankAccounts"
                                    name="bankAccount"
                                    label="شماره حساب"
                                    solo
                                    item-text="owner_name"
                                    item-value="account_number"
                                    v-model="item.account_number"
                                    ></v-select>
                                    <v-btn dark color="green" :loading="loading" type="submit">ثبت</v-btn>
                                </v-col>                          
                        </v-form>
                    </v-row>
                    </v-container>
                </td>
            </template>
        </v-data-table>      
    </v-card>
</template>


<script>



export default{
    watch: {
      dialog (val) {
        val || this.close()
      },
    },
    data(){
        return{
            loading: null,
            singleExpand: true,
            expanded: [],
            isLoading:null,
            search: ''
        }
    },
    computed:{
        bankAccounts(){
            return this.$store.getters.getBankAccounts;
        },
        headers(){
            return [
                {
                text: "شماره کارت",
                align: "center",
                //sortable: false,
                value: "card_number",
                },
                {
                text: "شماره حساب",
                align: "center",
                //sortable: false,
                value: "account_number",
                }
            ]
        },
        bankCards(){
            return this.$store.getters.getBankCards
        }
    },
    methods:{
        submitAccount(item){
            this.loading = true
            this.$store.dispatch('setAccount', item)
            .finally(() => {
                this.loading = false
              })
        },
        loadBankCards() {
        // console.log(this)
        this.$store.dispatch('loadBankCards')
      }
    },
    created(){
        this.loadBankCards();
        this.$store.dispatch('loadBankAccounts')
    }
}
</script>
