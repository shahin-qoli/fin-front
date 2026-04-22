<template>
    <div>
        <v-container v-if="item.is_used==true" fluid style="margin: 0px; padding: 0px; width: 100%">
          <v-row dense >
            <v-col cols="1" >
              <p> کد مشتری :</p>
              <!-- <v-text-field > {{item.transaction_date}}</v-text-field> -->
            </v-col>
            <v-col cols="1" >
            {{ getCardcode(item) }}
          </v-col>
          </v-row>
        </v-container>
        <v-container v-if="item.is_used==false">
          <v-row v-if="!isCardcodeChecked">
            <v-col cols="4">
              <v-text-field v-model="searchCardCode" hint="c50000" label="کد مشتری"> </v-text-field>
            </v-col>
            <v-col cols="4">
              <v-btn dark color="green" @click="getCustomerData">بررسی مشتری</v-btn>
            </v-col>
            <v-col cols="4" v-if="errorMessage != null">
              <p style="color: red">{{ errorMessage }}</p>
            </v-col>
          </v-row>
          <v-row v-else>
            <v-col cols="12">
              <v-card>
                <v-card-title>
                  <p>اطلاعات مشتری</p>
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="4">
                    <v-text-field          
                        v-model="data.customer.cardCode"
                        label="کد مشتری"
                        single-line
                        required
                        disabled
                        hide-details></v-text-field>
                    </v-col>  
                    <v-col cols="4">
                        <v-text-field          
                        v-model="data.customer.cardName"
                        label="نام مشتری"
                        single-line
                        required
                        disabled
                        hide-details></v-text-field>
                    </v-col>
                    <v-col cols="4">
                    <v-file-input
                                accept="jpg/*"
                                label="بارگذاری عکس"
                                v-model="data.image"
                            />   
                          </v-col>                 
                    <v-col cols="4">
                      <v-checkbox
                      label="پرداخت روی سند"
                      v-model="onDcoument"></v-checkbox>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>

            </v-col>
            <v-col v-if="onDcoument" cols="12">
              <v-card>
                <v-card-title>
                  اطلاعات اسناد پایه- توجه: این قابلیت هنوز راه اندازی نشده است، استفاده نشود
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="4">
                    <v-select
                    label="انتخاب سفارش"
                    :items="formattedDocuments"
                    item-text="displayText"
                    item-value="docEntry"
                    v-model="selected.document"></v-select>
                    </v-col>
                    <v-col cols="2">
                    <v-btn dark color="green" @click="addDocumentToToPaid">اضافه</v-btn>
                    </v-col>
                    <v-col cols="6">
                      <h3>سفارش های انتخابی</h3>
                      <v-data-table
                      fixed-header
                      hide-default-footer
                      dense
                      :headers="headersDocument"
                      :items="toPaidDocument"></v-data-table>
                    </v-col>
                    <v-col cols="4">
                      <v-select 
                      label="انتخاب چک"
                      item-text="displayText"
                      item-value="checkKey"
                      :items="formattedReturnedChecks"
                      v-model="selected.returnedCheck"></v-select>
                    </v-col>
                    <v-col cols="2">
                    <v-btn dark color="green" @click="addCheckToToPaid">اضافه</v-btn>
                    </v-col>
                    <v-col cols="6">
                      <h3>چک های انتخابی</h3>
                      <v-data-table
                      fixed-header
                      hide-default-footer
                      dense
                      :headers="headersCheck"
                      :items="toPaidCheck"></v-data-table>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col> 
            <v-col cols="12">
              <v-btn dark color="green"  @click="submitForm">استفاده تراکنش</v-btn>
            </v-col>
          </v-row>
        </v-container>
        <v-overlay :value="isLoading">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
            <p>در حال عملیات</p>
        </v-overlay>
    </div>
</template>

<script>
export default{
    emits: ['use-row'],
    data(){return {
      selected:{document:null,dockAmount:null, returnedCheck:null, returnedCheckAmount:null},
      toPaidDocument:[],
      toPaidCheck:[],
   
      onDcoument:false,
      searchCardCode: null,
      errorMessage:null,
        b1docnum: null,
        isCardcodeChecked: false,
        data:{
          customer : {
            cardCode:"",
            cardName: ""
            },
            returnedChecks:[],
            documents:[],
            image: null,
        },
        isLoading: false,
    } 
       
    },
    computed:{

      formattedDocuments() {
        if(this.data.documents){
          return this.data.documents.map((doc) => ({
            ...doc,
            displayText: `شماره:${doc.docEntry} -جمع کل: ${this.formatAmount(doc.documentTotal.toFixed(0))}`
          }));
        }else{
          return []
        }
      // Map through documents and create a new property with formatted text

    },formattedReturnedChecks(){
      if (this.data.returnedChecks){   
           return this.data.returnedChecks.map((doc) => ({
        ...doc,
        displayText: `شماره:${doc.checkNum} -جمع کل: ${this.formatAmount(doc.value.toFixed(0))}`
      }));
      }
      else
      {
        return []
      }

    },
      user(){
        return this.$store.getters.getUser
      },headersCheck(){
        return[
          {
            text: 'شماره',
            align: 'start',
            sortable: false,
            value: 'checkNum',
          },
          {
            text: 'جمع',
            align: 'start',
            sortable: false,
            value: 'value',
          },
          {
            text: 'تاریخ سررسید',
            align: 'start',
            sortable: false,
            value: 'DueDate',
          }]
      },
      headersDocument(){
        return[
          {
            text: 'شماره',
            align: 'start',
            sortable: false,
            value: 'docNum',
          },
          {
            text: 'جمع',
            align: 'start',
            sortable: false,
            value: 'documentTotal',
          },
          {
            text: 'تاریخ',
            align: 'start',
            sortable: false,
            value: 'docTime',
          }]
      }
    },
    methods:{
        addDocumentToToPaid(){
          let doc = this.data.documents.filter((item) => item.docEntry == this.selected.document )
          this.toPaidDocument.push(...doc)
          this.selected.document=null
          this.selected.documentAmount=null
        },        
        addCheckToToPaid(){
          let check = this.data.returnedChecks.filter((item) => item.checkKey == this.selected.returnedCheck )
          this.toPaidCheck.push(...check)
          this.selected.returnedCheck=null
          this.selected.returnedCheckAmount=null
        },
        getCardcode(up){
          return up.used_payments[0].used_for
        },
        submitForm() {
            const obj = {item: this.item, cardcode: this.data.customer.cardCode, documents: this.toPaidDocument,
                        checks: this.toPaidCheck, userid: this.user.id, image: this.data.image}
            this.$emit('use-row', obj)
        },
        getCustomerData(){

          this.data ={
          Customer : {
          CardCode:"",
          CardName: ""
          },
          ReturnedChecks:[],
          Documents:[]
          }
          this.onDcoument= false,
          this.isLoading = true;
          this.errorMessage = null
          this.isCardcodeChecked = false
          let payload = {cardcode: this.searchCardCode}
          this.isLoading = true;            
          this.$store.dispatch('getCustomerDataForPayment', payload).then((response)=>{
            
          if (response.is_success){
                this.isCardcodeChecked = true
              
                this.data = {...response.result}

                this.searchCardCode = null
          }
          else
          {
              this.errorMessage = response.error
          }
          this.isLoading = false;  
        })
        },
        formatAmount(value){
          const stringVlue = String(value)
          const formattedIntegerPart = stringVlue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          return formattedIntegerPart
        } 
    },

    props: {
        item: {}
    }
}
</script>
