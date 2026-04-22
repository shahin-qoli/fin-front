<template>
    <v-container>
          <v-card outlined>
            <v-card-title>
              <v-col cols="6">
                <v-select
                          :items="states"
                          v-model="options.transactionState"
                          item-text="text"
                          item-value="value"
                          label="انتخاب وضعیت درخواست"
                          ></v-select>
              </v-col>
              <v-col cols="6">
                <v-select
                          :items="transactionTypes"
                          v-model="options.transactionType"
                          item-text="text"
                          item-value="value"
                          label="انتخاب نوع تراکنش"
                          ></v-select>
              </v-col>
              <v-col cols="3">
                <v-text-field v-model="options.amount" hint="120000000" label="مبلغ"></v-text-field>
              </v-col>
              <v-col cols="3">                                      
                  <v-text-field v-model="options.customer_code" hint="120000000" label="کد مشتری"></v-text-field>
              </v-col>  
              <v-col cols="3">
                            <date-picker label="تاریخ" v-model="options.transactionDate"></date-picker>
                        </v-col> 
                                             
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
              <!-- <template v-slot:top>
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
              </template> -->
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
              <template v-slot:[`item.b1requests`]="props">
                <v-btn v-if="props.item.job_results.length > 0" @click="showJobResults(props.item.job_results)">  دیدن </v-btn>
              </template>
              <template v-slot:[`item.retry`]="props">
                <v-btn v-if="needRetry(props.item)" class="mx-2" small  @click="retryJob(props.item)">
                  <v-icon>mdi-check-outline</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card> 
          <v-dialog v-model="showJobResultsDialog" max-width="1600px">
            <v-card>
              <v-card-text>
                <v-row>
                  <v-col v-if="errorMessage==null" cols="12">
                    <v-data-table
                      fixed-header
                      hide-default-footer
                      dense
                      :headers="requestHeaders"
                      :items-per-page="-1"
                      :items="resultsToShow">
                    </v-data-table>
                  </v-col>
                  <v-col v-esle cols="12">
                    <p>{{errorMessage}}</p>
                  </v-col>
                </v-row>

              </v-card-text>
            </v-card>
          </v-dialog>
          <v-overlay :value="isLoadingLocal">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
            <p>در حال عملیات</p>
        </v-overlay>
    </v-container>
</template>

<script>
import {TheStatus} from '../../mixins/TheStatus.js'
import DatePicker from '../DatePicker.vue'
    // import TheRequest from "./TheRequest.vue";
    export default {
      components:{ DatePicker},
      mixins:[TheStatus],
        data(){
            return {
              errorMessage: null,
            isLoadingLocal: false,
            showJobResultsDialog: false,
            resultsToShow: [],
            options: {
            itemsPerPage: 10,
            page:1,
            transactionState: '',
            transactionType: '',
            transactionDate: '',
            amount: '',
            customer_code:"",
            },
            search: '',
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
        computed: {
          transactionTypes(){
            return [
              {
                text:"صندوق",
                value:"posreport"
              },
              {
                text:"حساب به حساب",
                value:"accounttoaccount"
              },
              {
                text:"کارت به کارت",
                value:"cardtocard"
              },
              {
                text:"همه",
                value:""
              },

            ]
          },
          states(){
            return [
              {
                text:"درخواست شده",
                value:"requested"
              },
              {
                text:"رد شده",
                value:"denied"
              },
              {
                text:"تکمیل شده",
                value:"complete"
              },
              {
                text:"همه",
                value:""
              },
              {
                text:"تلاش مجدد شده",
                value:"retried"
              },
              {
                text:"تایید شده",
                value:"verified"
              },
              {
                text:"خطا در همگام سازی",
                value:"api_error"
              },
            ]
          },
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
          text: "درخواستهایB1",
          align: "center",
          value: "b1requests",
          sortable: false
        },
        {
          text: "درخواست مجدد",
          align: "center",
          value: "retry",
          sortable: false,
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
          sortable: true,
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
          },
          requestHeaders(){
            return [
                {
                text: "تاریخ",
                align: "center",
                sortable: false,
                value: "created_at",
                }, 
                {
                text: "کد پاسخ",
                align: "center",
                sortable: false,
                value: "response_status",
                }, 
                {
                text: "متن درخواست",
                align: "center",
                sortable: false,
                value: "request",
                },
                {
                text: "متن جواب",
                align: "center",
                sortable: false,
                value: "response",
                }
            ]
        },
    },
        methods:{
          needRetry(item){
            return (item.state != "complete" && item.state != "requested")
          },
          retryJob(item){
            this.errorMessage = null
            this.resultsToShow =[],
            this.isLoadingLocal = true
             this.$store.dispatch('retryJob', item).then(res => {
              this.isLoadingLocal = false
              this.showJobResultsDialog = true;

              this.resultsToShow.push(res.job_result)
              this.loadRequests();
             }).catch((err)=>{
              console.log(err)
              this.showJobResultsDialog = true;
              this.isLoadingLocal = false
              this.errorMessage = err
             }
             
             )
          },
          showJobResults(results){
            this.errorMessage = null
            this.resultsToShow =[],
            this.showJobResultsDialog = true;
            this.resultsToShow = [...results];
          },
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