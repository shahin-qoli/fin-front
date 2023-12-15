<template>
    <v-container>
        <v-card>
            <v-card-text>
                <v-select
                    v-model="selectedPayaneCode"
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
            </v-card-text>
        </v-card>
        <v-card v-if="selectedPayaneCode">
            <v-card-text>
                <v-data-table
                fixed-header
                dense
                :headers="orderHeaders"
                :items="orders"
                item-key="id"
                >
                <template v-slot:[`item.total`]="{item}">
                {{ orderTotal(item).toFixed(0) | formatAmount }}
                </template>  
                <template v-slot:[`item.order.DocDate`]="{item}">
                {{ item.order.DocDate | formatDate }}
                </template>  
                </v-data-table>
            </v-card-text>
        </v-card>
        <v-card v-if="selectedPayaneCode">
            <v-data-table
            fixed-header
            dense
            :headers="posHeaders"
            :items="payaneReports"
            item-key="id"     
            :options.sync="options"
            :server-items-length="itemCount"
            >
            <template v-slot:[`item.transaction_date`]="{item}">
                <p>{{ item.transaction_date | formatDate }}</p>
            </template>  
            <template v-slot:[`item.amount`]="{ item }">
            <p>{{ item.amount | formatAmount }}</p>
            </template>
            <template v-slot:[`item.payane_code`]="{ item }">
            <p>{{ item.bank_payane.payane_code }}</p>
            </template>
            <template v-slot:[`item.visitor_name`]="{ item }">
            <p>{{ item.active_payane_person?.sale_person_name }}</p>
            </template>
            <template v-slot:[`item.sale_person_type`]="{ item }">
                <p>{{ item.active_payane_person?.sale_person_type }}</p>
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
        <v-overlay :value="isLoading">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
                <p>در حال بارگذاری</p>
        </v-overlay>
    </v-container>
</template>

<script>
var jalaali = require('jalaali-js')
export default {
    data(){
        return {
            options: {
            itemsPerPage: 10,
            page:1, 
            selectedPayaneCodes: '',
            selectedDate:'',
            selectedType: 'customer'
            },
            selectedPayaneCode:'',
            dialog: false,
            posRawsDetails: [],
            isLoading: false,
        }
    },
    computed:{
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
        orderHeaders(){
            return [
                {
                    text: 'شماره',
                    value: 'order.DocNum'
                },
                {
                    text: 'تاریخ',
                    value: 'order.DocDate'
                },
                {
                    text: 'وضعیت',
                    value: 'order.orderstate'
                },
                {
                    text: 'مبلغ سفارش',
                    value: 'total'
                },
                {
                    text: 'مبلغ تسویه',
                    value: 'payment.totalpaymentforLine'
                }
            ]},
        orders(){
            return this.$store.getters.getGoldOrders
        },
        payaneCodes(){
      return this.$store.getters.getGoldenPayanes.map((item) => {
        return {
          payane_code: item.bank_payane.payane_code,
          card_name: item.sale_person.name,
          card_code: item.sale_person.b1_slpcode
        };
      });
        },           
        customItemText() {
                return this.payaneCodes.map((item) => this.displayText(item));
        },
        payaneReports(){
            return this.$store.getters.getPayaneReports
        },
        posHeaders(){
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
                        text: "نام صاحب کارتخوان",
                        align: "center",
                        value: "visitor_name",
                    },
                    {
                        text: "کد صاحب کارتخوان",
                        align: "center",
                        value: "visitor_b1_slpcode",
                    },
                    {
                        text: "نوع صاحب کارتخوان",
                        align: "center",
                        value: "sale_person_type",
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
        itemCount(){
            return this.$store.getters.getPosReportItemCount;
        },
    },
    methods:{    
        isUsed(isUsed){
            return isUsed != true;
        },
        noSalePerson(salePerson){
            return salePerson == null;
        },
        displayText(item) {
            return item.payane_code + ' - ' + item.card_name;
            },
        loadPayanes(){
            this.$store.dispatch('loadGoldenPayanes')
        },
        orderTotal(item){
            console.log("item")
            console.log(item)
            return (Number.parseFloat(item.order.LineTot) + Number.parseFloat(item.order.VatTot) - Number.parseFloat(item.order.DiscTot))
        },
        loadPayaneReports() {
                // console.log(this)
                this.$store.dispatch('loadPayaneReports',this.options)
        },
        loadGoldOrders(cardCode){
            this.isLoading = true
            this.$store.dispatch('loadGoldOrders', cardCode).then(()=> this.isLoading=false)
        },
        viewMore(item) {
            console.log(item)
            this.posRawsDetails = item.pos_raws
         },
     },
    watch:{
        selectedPayaneCode:{
            handler(){
                this.options.selectedPayaneCodes = this.selectedPayaneCode
                let cardCode = this.payaneCodes.filter(item => item.payane_code == this.selectedPayaneCode)[0].card_code
                this.loadGoldOrders(cardCode)
            }
        },
        options:{
      handler(){
      this.loadPayaneReports();    
      },  deep: true
         }},        filters:{
    formatAmount(value){
      const stringVlue = String(value)
      const formattedIntegerPart = stringVlue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return formattedIntegerPart
    },
    formatDate(geoDate){
            
            var date = new Date(geoDate);
            let jdate = jalaali.toJalaali(date.getFullYear(), date.getMonth()+1, date.getDate())
            return `${jdate.jy}/${jdate.jm}/${jdate.jd}`
        }
    },
    created(){
        this.loadPayanes()
    }
}
</script>
