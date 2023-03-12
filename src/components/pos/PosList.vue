<template>
    <v-card outlined>
      <v-card-title>
        <v-row >
            <v-col cols="12">
                <v-form @submit.prevent="submitForm">
                    <v-row>
                        <v-col cols="3">
                            <v-text-field v-model="options.amount" hint="120000000" label="مبلغ"></v-text-field>
                        </v-col>
                        <v-col cols="2">
                            <v-text-field v-model="options.peygiriNumber" hint="8787656" label="شماره پیگیری"></v-text-field>
                        </v-col>
                        <v-col cols="2">
                            <v-text-field v-model="options.erjaCode" hint="8787656" label="کد ارجاع"></v-text-field>
                        </v-col>
                        <v-col cols="2">
                            <v-text-field v-model="options.payaneCode" hint="8787656" label="کد پایانه"></v-text-field>
                        </v-col>
                        <v-col cols="3">
                            <date-picker v-model="options.transactionDate"></date-picker>
                        </v-col>
                        <v-col cols="1">
                            <v-btn dark color="green" type="submit">جستجو</v-btn>
                        </v-col>
                        <v-col cols="1">
                            <v-btn dark color="red" @click="clearForm">پاک کردن</v-btn>
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
        :items="poses"
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
      </v-data-table>
    </v-card>
</template>
  
<script>

import DatePicker from '../DatePicker.vue'
import TheRow from '../TheRow.vue'
    export default {
      components:{
        DatePicker,
        TheRow
    },
      data() {
      return {
        options: {
        itemsPerPage: 10,
        page: 1,
        transactionDate: "",
        amount: "",
        peygiriNumber:"",
        payaneCode: "",
        erjaCode: "",
        isUsed:false
      },
      loading: null,
      isLoading: null,
      singleExpand: true,
      expanded: [],
      };
    },
    watch:{
    options:{
      handler(){   
      this.loadPoses();    
      },  deep: true
    }
  },
    computed: {
       itemCount(){
      return this.$store.getters.getPosItemCount;
    },
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
            text: "تاریخ واریز",
            align: "center",
            value: "variz_date",
  
          },
          {
            text: "کد پایانه",
            align: "center",
            value: "payane_code",
  
          },
          {
            text: "شماره ارجاع",
            align: "center",
            value: "erja_code",
            
          },
          {
            text: "شماره فایل",
            align: "center",
            value: "job_id"
          },
          {
            text: "شماره حساب",
            align: "center",
            value: "owner_account_number"
          }
          ,
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
      },
      poses(){    
        return this.$store.getters.poses
      }
    },
      methods: {
        async clearForm(){
          this.options = {
        itemsPerPage: 10,
        page: 1,
        transactionDate: "",
        amount: "",
        peygiriNumber:"",
        payaneCode: "",
        erjaCode: "",
        isUsed:false
      }
          await this.$store.dispatch('loadPoses',this.options)
        },
        async submitForm(){
            this.errorMessage= null
            this.isSuccess = null;
            this.isLoading= true;
           await this.$store.dispatch('loadPoses',this.options)
           this.isLoading= false;
        },
      useRow(data){
        this.loading = true
            var payload = {
            ...data
            }
            this.$store.dispatch('usePos',payload)
            .finally(() => {
                this.loading = false
              })
            
          },
        loadPoses() {
          // console.log(this)
          this.$store.dispatch('loadPoses',this.options)
        } 
      }
  }
  </script>
