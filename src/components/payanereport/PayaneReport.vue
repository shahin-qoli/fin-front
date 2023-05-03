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
        :items="payaneReports"
        item-key="id"
        :search="search"
        :loading="isLoading"
        :options.sync="options"
      :server-items-length="itemCount"
          >
        <template v-slot:[`item.sum`]="{ item }">
          <p>{{ item.sum | formatAmount }}</p>
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
              <v-btn class="mx-2" small  @click="userPoses(item)">
                        <v-icon>mdi-check-outline</v-icon>
                    </v-btn>
        </template>
        </v-data-table>
    </v-card>
</template>

<script>
    export default{
        data(){
        return{
            dialog: false,
            isLoading:null,
            search: '',
            options: {
        itemsPerPage: 10,
        page:1,
      }
            
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
            viewMore(item) {
                console.log(item)
                this.$store.dispatch('loadPosRawsDetails', {payaneCode:item.payane_code, transactionDate: item.transaction_date})
            },
            loadPayaneReports() {
                // console.log(this)
                this.$store.dispatch('loadPayaneReports',this.options)
            },
            userPoses(){
                
            }
        },filters:{
    formatAmount(value){
      const stringVlue = String(value)
      const formattedIntegerPart = stringVlue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return formattedIntegerPart
    }
  },
        computed:{itemCount(){
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
                    value: "sum",
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
        },posRawsDetails(){
            return this.$store.getters.getPosRawsDetails
        }
    },
    created(){
        this.loadPayaneReports();
    }
    }

</script>
