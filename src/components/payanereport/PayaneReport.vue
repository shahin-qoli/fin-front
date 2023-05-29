<template>
    <v-card outlined>
        <v-card-title>
            <v-form @submit.prevent="searchReport">
                <v-row>
        <v-col
          cols="3"
        >    
          <v-select
            v-model="searchReportOptions.selectedPayaneCodes"
            :items="payaneCodes"
            item-value="payane_code"
            item-text="customItemText"
            label="پایانه"
            multiple
            filled
            outlined
            small-chips
          >   
           <template v-slot:item="{ item }">
            <div>{{ displayText(item) }}</div>
         </template>
         <template v-slot:selection="{ item }">
            <div>{{ displayText(item) }}</div>
         </template>
        </v-select>
        </v-col>
        <v-col
          cols="3"
        ><date-picker v-model="searchReportOptions.selectedDate"></date-picker>
        </v-col>
        <v-col cols="3">
            <v-select 
                v-model="searchReportOptions.selectedType" 
                label="نوع"
                :items="personTypes"
                item-text="type_name"
                item-value="type"
             ></v-select>
        </v-col>
        <v-col cols="3">
            <v-btn dark color="green" type="submit">جستجو</v-btn>
        </v-col>
    </v-row>
    </v-form>
        </v-card-title>
        <v-data-table
        fixed-header
        dense
        :headers="headers"
        :items="payaneReports"
        item-key="id"
        :loading="isLoading"
        :options.sync="options"
        :server-items-length="itemCount"
          >
        <template v-slot:[`item.amount`]="{ item }">
          <p>{{ item.amount | formatAmount }}</p>
        </template>
        <template v-slot:[`item.payane_code`]="{ item }">
          <p>{{ item.bank_payane.payane_code }}</p>
        </template>
        <template v-slot:[`item.visitor_name`]="{ item }">
          <p>{{ item.active_payane_person?.sale_person_name }}</p>
        </template>
        <template v-slot:[`item.visitor_b1_slpcode`]="{ item }">
          <p>{{ item.active_payane_person?.sale_person_code }}</p>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
              <v-dialog
                v-model="dialog"
                fullscreen
                hide-overlay
                transition="dialog-bottom-transition"
                >
                <template v-slot:activator="{ on, attrs }">
                    <v-icon
                    small
                    class="mr-2"
                    v-bind="attrs"
                    v-on="on"
                    @click="viewMore(item)"
                    >
                    mdi-eye
                    </v-icon>
                </template>
                <v-card outlined>
                    <v-card-title>
                    <span class="text-h5">لیست واریزهای کارتخوان</span>
                    </v-card-title>
                    <v-data-table
                fixed-header
                dense
                :headers="detailHeaders"
                :items="posRawsDetails"
                item-key="id"
                     >
          <template v-slot:[`item.is_used`]="{ item }">
            <v-simple-checkbox
            v-model="item.is_used"
            disabled
            ></v-simple-checkbox>
             </template>
          </v-data-table>
                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="green darken-1"
                        text
                        @click="dialog = false"
                    >
                        بستن
                    </v-btn>
                    </v-card-actions>
                </v-card>
              </v-dialog>
              <v-btn v-if="isUsed(item.is_used)" :disabled="noSalePerson(item.active_payane_person)" class="mx-2" small  @click="usePoses(item)">
                        <v-icon>mdi-check-outline</v-icon>
              </v-btn>
        </template>
        </v-data-table>
    </v-card>
</template>

<script>
import DatePicker from '../DatePicker.vue'
    export default{
        components:{
        DatePicker
    },
        data(){
        return{
            dialog: false,
            isLoading:null,
            posRawsDetails: [],
            options: {
            itemsPerPage: 10,
            page:1, 
            selectedPayaneCodes: '',
            selectedDate:'',
            selectedType: ''
            },
            searchReportOptions: {
            itemsPerPage: 10,
            page:1,
            selectedPayaneCodes: '',
            selectedDate:'',
            selectedType: '',
            },
            personTypes: [
              {type: 'sale_person', type_name: 'ویزیتور'},
              {type: 'driver', type_name: 'راننده'},
              {type: 'customer', type_name: 'مشتری'},  
        ]          
        }
    }
        ,watch:{
    options:{
      handler(){
      this.loadPayaneReports();    
      },  deep: true
    }
  },
        methods:{
            searchReport(){
                this.$store.dispatch('loadPayaneReports',this.searchReportOptions)
            },
            displayText(item) {
            if (item.active_payane_person && item.active_payane_person.sale_person_name) {
                return item.active_payane_person.sale_person_name;
            } else {
                return item.payane_code;
            }
                    },
            viewMore(item) {
                console.log(item)
                this.posRawsDetails = item.pos_raws
            },
            loadPayaneReports() {
                // console.log(this)
                this.$store.dispatch('loadPayaneReports',this.options)
            },
            loadBankPayanes() {
                 console.log("this is going to loading")
                this.$store.dispatch('loadBankPayanes')
            },
            usePoses(item){
                this.loading = true;
            var payload = {
            ...item
            }
            this.$store.dispatch('usePayaneReport',payload)
            .finally(() => {
                this.loading = false;
              })
            },
            isUsed(isUsed){
                return isUsed != true;
            },
            noSalePerson(salePerson){
                return salePerson == null;
            }
            },
            filters:{
    formatAmount(value){
      const stringVlue = String(value)
      const formattedIntegerPart = stringVlue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return formattedIntegerPart
    }
             },
        computed:{
            customItemText() {
            return this.payaneCodes.map((item) => this.displayText(item));
            },
            itemCount(){
            return this.$store.getters.getPosReportItemCount;
            },
            detailHeaders(){
                
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
                }
                ];
      
            },
            headers(){
                return [
                    {
                        text: "تاریخ",
                        align: "center",
                        value: "transaction_date",
                    },
                    {
                        text: "کد پایانه",
                        align: "center",
                        value: "payane_code",
                    },                {
                        text: "نام ویزیتور",
                        align: "center",
                        value: "visitor_name",
                    },
                    {
                        text: "کد ویزیتور",
                        align: "center",
                        value: "visitor_b1_slpcode",
                    },
                    {
                        text: "مبلغ تجمیعی",
                        align: "center",
                        value: "amount",
                    },
                    {
                    text: "",
                    align: "center",
                    //sortable: false,
                    value: "actions",
                    }

                ]
            },
            payaneReports(){
                return this.$store.getters.getPayaneReports
            },
    salePersons(){
      return this.$store.getters.getSalePersons
    },
    payaneCodes(){
      return this.$store.getters.getBankPayanes.map((item) => {
        return {
          payane_code: item.payane_code,
          active_payane_person: item.active_payane_person,
        };
      });
    }
         },
    created(){

        this.loadBankPayanes();
    }
    }

</script>
