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
          <v-form  @submit.prevent="submitForm(item,cardcode,b1docnum)">
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
              <v-col cols="4">
              <v-select
              label="انتخاب سفارش"
              :items="data.Documents"
              v-model="selected.document"></v-select>
            </v-col>
            <v-col cols="4">
                <v-btn dark color="green" @click="addToToPaid">اضافه</v-btn>
            </v-col>
            <v-col cols="4">
            <v-select
              label="انتخاب چک"
              :items="data.ReturnedChecks"
              v-model="selected.document"></v-select>
            </v-col>
            <v-col cols="4">
                <v-btn dark color="green" @click="addToToPaid">اضافه</v-btn>
            </v-col>
            <v-col cols="12">
              <v-data-table
              fixed-header
              hide-default-footer
              dense
              :headers="headers"
              :items="toPaid"></v-data-table>
            </v-col>
              <v-col cols="12">
                <v-btn dark color="green" type="submit">استفاده تراکنش</v-btn>
              </v-col>
            </v-row>

            
        </v-form>
        </v-container>
    </div>
</template>

<script>
export default{
    emits: ['use-row'],
    data(){return {
      selected:{document:null,amount:null},
      toPaid:[],
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
            documents:[]
        },
    } 
       
    },
    computed:{
      user(){
        return this.$store.getters.getUser
      },
      headers(){
        return[
          {
            text: 'نوع سند',
            align: 'start',
            sortable: false,
            value: 'cardcode',
          },
          {
            text: 'شماره سند',
            align: 'start',
            sortable: false,
            value: 'cardcode',
          },
          {
            text: 'مبلغ سند',
            align: 'start',
            sortable: false,
            value: 'cardcode',
          },
          {
            text: 'مبلغ انتخابی',
            align: 'start',
            sortable: false,
            value: 'cardcode',
          },
        ]
      }
    },
    methods:{
        addToToPaid(){
          this.toPaid.push(...this.selected)
          this.selected={document:null,amount:null}
        },
        getCardcode(up){
          return up.used_payments[0].used_for
        },
        submitForm(item,cardcode,b1docnum) {
            const obj = {item: item, cardcode:cardcode,b1docnum:b1docnum, userid: this.user.id}
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
            this.errorMessage = null
            this.isCardcodeChecked = false
            let payload = {cardcode: this.searchCardCode}
            this.isLoading = true;            
            this.$store.dispatch('getCustomerDataForPayment', payload).then((response)=>{
                
                if (response.is_success){
                    this.isCardcodeChecked = true
                  
                    this.data = {...response.result}

                    this.searchCardCode = null
                }else{
                  this.errorMessage = response.error
                }
                this.isLoading = false;  
            })
        }
    },

    props: {
        item: {}
    }
}
</script>
