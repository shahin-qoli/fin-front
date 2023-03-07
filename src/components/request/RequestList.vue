<template>
    <nav>
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
        :items="requests"
        item-key="id"
        :search="search"
        :loading="isLoading"
        :options.sync="options"
        :server-items-length="itemCount"
        class="elevation-1"
      >
      <template  v-slot:[`item.transaction_date`]="props">
        {{ props.item.payfull.transaction_date }}
      </template>
      <template  v-slot:[`item.amount`]="props">
        {{ props.item.payfull.amount }}
      </template>
      <template  v-slot:[`item.image`]="props">
        <v-btn v-if="props.item.image" :href="props.item.image" target="_blank">  <v-icon>mdi-download</v-icon> </v-btn>
      </template>
      <template v-slot:[`item.controls`]="props">
        <v-btn v-if="isRequested(props.item.state)" :disabled="saleRole" class="mx-2" small  @click="verifyRequest(props.item)">
            <v-icon>mdi-check-outline</v-icon>
        </v-btn>
      </template>
      </v-data-table>
    </v-card>
</template> 
    </nav>
</template>

<script>
    // import TheRequest from "./TheRequest.vue";
    export default {
        data(){
            return {
              options: {
        itemsPerPage: 10
      },
                search: ''
            }
        },    watch:{
    options:{
      handler(){   
      this.loadRequests();    
      },  deep: true
    }
  },
        components: {
            // TheRequest
        },
        computed: {
          itemCount(){
      return this.$store.getters.getRequestItemCount;
    },
          saleRole(){
            return this.$store.getters.getUser.role === 'sale';
          },
            isLoading(){
        return this.$store.getters.isLoading;
      },
            requests() {
             return this.$store.getters.requests
            },
            headers() {
        return [
          {
            text: "شماره سند B1",
            align: "center",
            //sortable: false,
            value: "b1_docnum",
          },
          {
            text: "اخذ شده توسط",
            value: "captured_by",
            align: "center",
            filterable: false,
          },
          {
            text: "تاریخ درخواست",
            value: "created_at",
            align: "center",
            filterable: false
          },
          {
            text: "نوع",
            align: "center",
            value: "name",
          },          {
            text: "وضعیت",
            align: "center",
            value: "state",
          },          {
            text: "کد مشتری",
            align: "center",
            value: "used_for",
          },       {
            text: "تاریخ تراکنش",
            align: "center",
            value: "transaction_date",
          },          {
            text: "مبلغ",
            align: "center",
            value: "amount",
          },
          {
            text: "ثبت توسط",
            align: "center",
            value: "created_by_name",
          },
          {
            text: "دانلود عکس",
            align: "center",
            value: "image",
          },
          {
            text: "",
            align: "center",
            value: "controls",
            sortable: false
          }
          
        ];
        }
    },
        methods:{
          verifyRequest(item){
            this.$store.dispatch('verifyRequest',item.id)
          },
          isRequested(state){
            return state=="requested"
          },
          // transactionDate(payfull){
          //   if(payfull.type=="pos_raw"){
          //           console.log(payfull.pos_raw.transaction_date)
          //           return payfull.pos_raw.transaction_date
          //       }else{
          //           return payfull.card_to_card_raw.transaction_date
          //       }
          // },
          // rowAmount(payfull){
          //       console.log(payfull)
          //       if(payfull.type=="pos_raw"){
          //           return payfull.pos_raw.amount
          //       }else{
          //           return payfull.card_to_card_raw.amount
          //       }
                
          //   },
            loadRequests(){
                this.$store.dispatch('loadRequests',this.options)
            }
        }
    }
</script>
