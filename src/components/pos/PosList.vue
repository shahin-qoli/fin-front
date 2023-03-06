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
        :items="poses"
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
import TheRow from '../TheRow.vue'
    export default {
      data() {
      return {
        search: "",
      singleExpand: true,
      expanded: [],
        transaction_date: "",
        transaction_time: "",
        description: "",
        amount: "",
        peygiri_number: "",
        variz_date: "",
        payane_code: "",
        erja_code: "",
        job_id: "",
        owner_account_number: ""
      };
    },
    components:{TheRow},
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
      },
      isLoading(){
        return this.$store.getters.isLoading;
      }
    },
      methods: {

      useRow(data){

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
          this.$store.dispatch('loadPoses')
        } 
      },
      created() {
        this.loadPoses ();
      }
  }
  </script>
