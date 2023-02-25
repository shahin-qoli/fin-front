<template>
    <v-card outlined>
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="جستجو"
          single-line
          hide-details
          :loading="isLoading"
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
      >
      </v-data-table>
    </v-card>
</template>
  
<script>
    export default {
      data() {
      return {
        search: "",
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
