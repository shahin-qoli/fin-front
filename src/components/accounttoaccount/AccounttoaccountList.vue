<template>
    <v-card outlined>
      <v-card-title>
          <v-row >
              <v-col cols="12">
                  <v-form @submit.prevent="submitForm">
                      <v-row>
                          <v-col cols="3">
                            <v-select
                            :items="bankAccounts"
                            v-model="options.bankAccountId"
                            item-text="owner_name"
                            item-value="id"
                            label="انتخاب شماره حساب"
                            ></v-select>
                          </v-col>
                          <v-col cols="3">
                              <v-text-field v-model="options.amount" hint="120000000" label="مبلغ"></v-text-field>
                          </v-col>
                          <v-col cols="3">
                              <v-text-field v-model="options.peygiriNumber" hint="8787656" label="شماره پیگیری"></v-text-field>
                          </v-col>
                          <v-col cols="3">
                              <date-picker label="تاریخ" v-model="options.transactionDate"></date-picker>
                          </v-col>
                      </v-row>
                  </v-form>
  
              </v-col>
          </v-row>
        </v-card-title>
        <v-divider></v-divider>
      <v-data-table
        fixed-header
        dense
        :headers="headers"
        :items="accounttoaccounts"
        item-key="id"
        :loading="isLoading"
        :single-expand="singleExpand"
        :expanded.sync="expanded"
        show-expand
        :options.sync="options"
        :server-items-length="itemCount"
        class="elevation-1"
      >
      <template v-slot:top>
        <v-switch
          v-model="options.isUsed"
          label="تراکنش های استفاده شده"
          class="pa-3"
        ></v-switch>
      </template>
      <template v-slot:expanded-item="{ headers,item}">
        <td :colspan="headers.length">
          <the-row :item="item" @use-row="useRow" :key="item.id">
          </the-row>
        </td>
      </template>
      <template v-slot:[`item.is_used`]="{ item }">
          <v-simple-checkbox
            v-model="item.is_used"
            disabled
          ></v-simple-checkbox>
      </template>
      <template v-slot:[`item.amount`]="{ item }">
        <p>{{ item.amount | formatAmount }}</p>
      </template>
      </v-data-table>
  
    </v-card>
  </template>
  
  <script>
  import DatePicker from '../DatePicker.vue'
  import TheRow from '../TheRow.vue'
    export default {
      components:{TheRow, DatePicker},
      data() {
      return {
        options: {
          itemsPerPage: 10,
          page:1,
          transactionDate: "",
          amount: "",
          peygiriNumber: "",
          isUsed: false,
          bankAccountId: ""
        },
        cardcode: null,
        singleExpand: true,
        expanded: [],
        loading: null
      };
    },watch:{
      options:{
        handler(){
        this.loadAccounttoaccounts();    
        },  deep: true
      }
    },filters:{
      formatAmount(value){
        const stringVlue = String(value)
        const formattedIntegerPart = stringVlue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return formattedIntegerPart
      }
    }
    ,
    computed: {
      headers() {
        return [
          {
            text: "تاریخ تراکنش",
            align: "center",
            //sortable: false,
            value: "transaction_date",
          },
          {
            text: "ساعت تراکنش",
            value: "transaction_time",
            align: "center",
            filterable: false,
          },
          {
            text: "توضیحات",
            value: "description",
            align: "center",
            filterable: false
          },
          {
            text: "مبلغ",
            align: "center",
            value: "amount",
          },

          {
            text: "شماره پیگیری",
            align: "center",
            value: "peygiri_number",
  
          },  
          {
            text: "شماره فایل",
            align: "center",
            value: "job_id"
          },
          {
            text: "استفاده شده",
            align: "center",
            value: "is_used"
          },
          {
            text: "",
            align: "center",
            value: "controls",
            sortable: false
          }
        ];
      }, isLoading(){
        return this.$store.getters.isLoading;
      }, accounttoaccounts(){
        return this.$store.getters.accounttoaccounts;
      }, itemCount(){
        return this.$store.getters.getAccountItemCount;
      },
      bankAccounts(){
        return this.$store.getters.getBankAccounts;
      }
    },
      methods: {
        async clearForm(){
            this.options =  {
          itemsPerPage: 10,
          page:1,
          transactioDate: "",
          amount: "",
          peygiriNumber: "",
          isUsed:false
        };
            await this.$store.dispatch('loadAccounttoaccounts',this.options)
          },
        getCardcode(up){
          return up.used_payments[0].used_for
        },
        useRow(data){
          this.loading = true
          var payload = {
              ...data
              }
              this.$store.dispatch('useAccounttoaccount',payload)
              .finally(() => {
                  this.loading = false
                })
              
            },
            loadAccounttoaccounts() {
          this.$store.dispatch('loadAccounttoaccounts',this.options)
        },
      },
    created(){
      this.$store.dispatch('loadBankAccounts')
    }
  }
  </script>
  
  <style scoped>
  
  </style>