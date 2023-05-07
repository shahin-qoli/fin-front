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
      <template v-slot:top>

      <v-radio-group inline v-model="options.state">
        <v-row>
          <v-col cols="12" class="text-right">
        <v-radio label="همه" value="" class="d-inline-block radio-with-margin"></v-radio>
        <v-radio label="درخواست شده" value="requested" class="d-inline-block radio-with-margin"></v-radio>
        <v-radio label="رد شده" value="denied" class="d-inline-block radio-with-margin"></v-radio>
        <v-radio label="تکمیل شده" value="complete" class="d-inline-block radio-with-margin"></v-radio>
        <v-radio label="تلاش مجدد شده" value="retried" class="d-inline-block radio-with-margin"></v-radio>
        <v-radio label="تایید شده" value="verified" class="d-inline-block radio-with-margin"></v-radio>
        <v-radio label="خطا در همگام سازی" value="api_error" class="d-inline-block radio-with-margin"></v-radio>
    </v-col>
    </v-row>
  </v-radio-group>
    </template>
      <template  v-slot:[`item.transaction_date`]="props">
        {{ props.item.payfull.transaction_date }}
      </template>
      <template  v-slot:[`item.amount`]="props">
        {{ props.item.payfull.amount | formatAmount }}
      </template>
      <template  v-slot:[`item.image`]="props">
        <v-btn v-if="props.item.image" :href="props.item.image" target="_blank">  <v-icon>mdi-download</v-icon> </v-btn>
      </template>
      <template  v-slot:[`item.state`]="props">
        <v-chip small dark :color="getColorRequestStatus(props.item.state)">
          {{ transformRequestStatus(props.item.state) }}
        </v-chip>
      </template>
      <template v-slot:[`item.controls`]="props">
        <v-btn v-if="isRequested(props.item.state)" :disabled="saleRole" class="mx-2" small  @click="verifyRequest(props.item)">
            تایید
        </v-btn>
        <v-btn style="color: red" v-if="isRequested(props.item.state)" :disabled="saleRole" class="mx-2" small  @click="denyRequest(props.item)">
            عدم تایید
        </v-btn>
      </template> 
      </v-data-table>
    </v-card>
</template> 
    </nav>
</template>

<script>
import {TheStatus} from '../../mixins/TheStatus.js'
    // import TheRequest from "./TheRequest.vue";
    export default {
      mixins:[TheStatus],
        data(){
            return {
            options: {
            itemsPerPage: 10,
            page:1,
            state: 'requested'
            },
            search: ''
            }
        },filters:{
        formatAmount(value){
          const stringVlue = String(value)
          const formattedIntegerPart = stringVlue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          return formattedIntegerPart
        }
         },
        watch:{
          options:{
            handler(){   
            this.loadRequests();    
            },  deep: true
          }, 
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
            text: "شماره درخواست",
            align: "center",
            //sortable: false,
            value: "id",
          },
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
          denyRequest(item){
            this.$store.dispatch('denyRequest',item.id)
          },
          verifyRequest(item){
            this.$store.dispatch('verifyRequest',item.id)
          },
          isRequested(state){
            return state=="requested"
          },
            loadRequests(){
                this.$store.dispatch('loadRequests',this.options)
            }
        }
    }
</script>

<style>
  .radio-with-margin {
    margin-right: 10px;
  }
</style>