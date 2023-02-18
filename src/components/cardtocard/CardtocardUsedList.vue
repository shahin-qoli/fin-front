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
        :items="cardtocards"
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
        from_card: "",
        to_card: "",
        peygiri_number: "",
        serial_number: "",
        job_id: "",
        loading: true
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
            text: "کارت مبدا",
            align: "center",
            value: "from_card",
  
          },
          {
            text: "کارت مقصد",
            align: "center",
            value: "to_card",
  
          },
          {
            text: "شماره پیگیری",
            align: "center",
            value: "peygiri_number",
  
          },
          {
            text: "شماره سریال",
            align: "center",
            value: "serial_number",
            
          },
          {
            text: "شماره فایل",
            align: "center",
            value: "job_id"
          }
        ];
      },
      cardtocards(){
        //console.log(this.$store.getters.cardtocards)
        return this.$store.getters.usedcardtocards
        
      }
    },
      methods: {
        loadCardtocards() {
          // console.log(this)
          this.$store.dispatch('loadCardtocards')
        }
      },
      created() {
        this.loadCardtocards ();
      }
  }
  </script>
  
  <style scoped>
  
  </style>