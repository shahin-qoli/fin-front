<template>
    <v-container>
        <v-data-table
        :items="campaigns"
        :headers="campaignHeader">
        <template v-slot:[`item.StartDate`]="{item}">
            <p v-if="item.StartDate">{{ item.StartDate | formatDate}}</p>
            <p v-else>{{ item.StartDate }}</p>
        </template>
        <template v-slot:[`item.EndDate`]="{item}">
            <p v-if="item.EndDate">{{ item.EndDate | formatDate }}</p>
            <p v-else>{{ item.EndDate }}</p>
        </template>
        <template v-slot:[`item.isActive`]="{ item }">
          <v-simple-checkbox
            v-model="item.isActive"
            disabled
          ></v-simple-checkbox>
        </template>   
        <template v-slot:[`item.more`]="{ item }">
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
                <v-card outlined v-if="selectedCampaignDetails">
                    <!-- <v-card-title>
                    <span class="text-h5">لیست واریزهای کارتخوان</span>
                    </v-card-title> -->
                    <v-tabs 
                    v-model="tab"
                    align-with-title><v-tabs-slider color="yellow"></v-tabs-slider>
                    <v-tab>
                            <p>جزییات کمپین</p>
                        </v-tab>
                        <v-tab>
                            <p>جزییات خطوط</p>
                    </v-tab>
                    <v-tabs-items 
                    v-model="tab">
                        <v-tab-item>
                            <v-card class="section section_dark ma-5 pa-5" outlined>
                                <v-card-text>  
                                    <v-row>
                                        <v-col cols="3">
                                            <v-textarea label="کد مشتری1" disabled v-model="selectedCampaignDetails.CardCode1"></v-textarea>
                                        </v-col>
                                        <v-col cols="3">
                                            <v-textarea label="کد مشتری2" disabled v-model="selectedCampaignDetails.CardCode2"></v-textarea>
                                        </v-col>
                                        <v-col cols="3">
                                            <v-textarea label="گروه مشتری1" disabled v-model="selectedCampaignDetails.GroupCode1"></v-textarea>
                                        </v-col>
                                        <v-col cols="3">
                                            <v-textarea label="گروه مشتری2" disabled v-model="selectedCampaignDetails.GroupCode2"></v-textarea>
                                        </v-col>
                                        <v-col cols="3">
                                            <v-text-field label="تخفیف پایه" disabled v-model="selectedCampaignDetails.BaseDis"></v-text-field>
                                        </v-col>
                                        <v-col cols="3">
                                            <v-text-field label="سیاست تخفیف" disabled v-model="selectedCampaignDetails.DisPolicy"></v-text-field>
                                        </v-col>
                                        <v-col cols="3">
                                            <v-text-field label="فواعد تخفیف" disabled v-model="selectedCampaignDetails.DisRelation"></v-text-field>
                                        </v-col>
                                        <v-col cols="3">
                                            <v-text-field label="حداقل خط" disabled v-model="selectedCampaignDetails.MinRow"></v-text-field>
                                        </v-col>
                                        <v-col cols="3">
                                            <v-text-field label="حداکثر خط" disabled v-model="selectedCampaignDetails.MaxRow"></v-text-field>
                                        </v-col>
                                        <v-col cols="3">
                                            <v-text-field label="تخفیف هر خط" disabled v-model="selectedCampaignDetails.RowDisPrcnt"></v-text-field>
                                        </v-col>
                                        <v-col cols="3">
                                            <v-text-field label="حداکثر تخفیف خط" disabled v-model="selectedCampaignDetails.MaxRowDisPrcnt"></v-text-field>
                                        </v-col>
                                        <v-col cols="3">
                                            <v-text-field label="حداقل مبلغ" disabled v-model="selectedCampaignDetails.MinValue"></v-text-field>
                                        </v-col>
                                        <v-col cols="3">
                                            <v-text-field label="حداکثر مبلغ" disabled v-model="selectedCampaignDetails.MaxValue"></v-text-field>
                                        </v-col>
                                        <v-col cols="3">
                                            <v-text-field label="مبلغ پله" disabled v-model="selectedCampaignDetails.ValueStep"></v-text-field>
                                        </v-col>
                                        <v-col cols="3">
                                            <v-text-field label="تخفیف هر پله مبلغ" disabled v-model="selectedCampaignDetails.ValueDisPrcnt"></v-text-field>
                                        </v-col>
                                        <v-col cols="3">
                                            <v-text-field label="حداکثر تخفیف مبلغ" disabled v-model="selectedCampaignDetails.MaxValueDisPrcnt"></v-text-field>
                                        </v-col>
                                        <v-col cols="3">
                                            <v-text-field label="حداکثر تخفیف" disabled v-model="selectedCampaignDetails.MaxDisPrcnt"></v-text-field>
                                        </v-col>
                                        <v-col cols="3">
                                            <v-text-field label="کانال فروش" disabled v-model="selectedCampaignDetails.SaleChannel"></v-text-field>
                                        </v-col>
                                        <v-col cols="3">
                                            <v-text-field label="تخفیف کانال فروش" disabled v-model="selectedCampaignDetails.SaleChannelDis"></v-text-field>
                                        </v-col>
                                        <v-col cols="3">
                                            <v-checkbox label="تخیف بی وان دارد؟" disabled v-model="selectedCampaignDetails.CanHaveB1Dis"></v-checkbox>
                                        </v-col>
                                        <v-col cols="3">
                                            <v-text-field label="حداکثر زمان اعتبار" disabled v-model="selectedCampaignDetails.MaxCreditTime"></v-text-field>
                                        </v-col>
                                        <v-col cols="3">
                                            <v-text-field label="تاثیر روی پورسانت" disabled v-model="selectedCampaignDetails.CommissionEffect"></v-text-field>
                                        </v-col>
                                        <v-col cols="3">
                                            <v-text-field label="لیست قیمت بی وان" disabled v-model="selectedCampaignDetails.B1PriceList"></v-text-field>
                                        </v-col>
                                        <v-col cols="3">
                                            <v-text-field label="وضعیت محاسبه لیست قیمت" disabled v-model="selectedCampaignDetails.PriceListCalcState"></v-text-field>
                                        </v-col>
                                        <v-col cols="3">
                                            <v-checkbox label="آیا تخفیف کمپین دارد" disabled v-model="selectedCampaignDetails.isHaveCampaignDis"></v-checkbox>
                                        </v-col>
                                        <v-col cols="3">
                                            <v-text-field label="موعد تسویه" disabled v-model="selectedCampaignDetails.PayDueDate"></v-text-field>
                                        </v-col>
                                        <v-col cols="3">
                                            <v-text-field label="زمان تسویه" disabled v-model="selectedCampaignDetails.PaymentTime"></v-text-field>
                                        </v-col>
                                        <v-col cols="3">
                                            <v-text-field label="روش تسویه" disabled v-model="selectedCampaignDetails.SettleType"></v-text-field>
                                        </v-col>
                                        <v-col cols="3">
                                            <v-text-field label="درخواست کننده" disabled v-model="selectedCampaignDetails.Issuer"></v-text-field>
                                        </v-col>
                                        <v-col cols="3">
                                            <v-text-field label="نوع سند" disabled v-model="selectedCampaignDetails.DocType"></v-text-field>
                                        </v-col>
                                        <v-col cols="3">
                                            <v-text-field label="درفت" disabled v-model="selectedCampaignDetails.isDraft"></v-text-field>
                                        </v-col>
                                        <v-col cols="3">
                                            <v-text-field label="قیمت آیتم دارد" disabled v-model="selectedCampaignDetails.isHaveItemPrice"></v-text-field>
                                        </v-col>
                                        <v-col cols="3">
                                            <v-text-field label="تخفیف آزاد دارد" disabled v-model="selectedCampaignDetails.isHaveFreeDiscount"></v-text-field>
                                        </v-col>
                                        <v-col cols="3">
                                            <v-text-field label="سند دوم نیاز دارد" disabled v-model="selectedCampaignDetails.isNeedSecondDoc"></v-text-field>
                                        </v-col>
                                        <v-col cols="3">
                                            <v-text-field label="نوع سند دوم" disabled v-model="selectedCampaignDetails.SecDocType"></v-text-field>
                                        </v-col>
                                        <v-col cols="3">
                                            <v-text-field label="امتیاز باشگاه دارد" disabled v-model="selectedCampaignDetails.isHaveClubPoints"></v-text-field>
                                        </v-col>
                                        <v-col cols="3">
                                            <v-text-field label="باید کمپین را پاس کند" disabled v-model="selectedCampaignDetails.shouldPassCampaign"></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                            </v-card>
                        </v-tab-item>
                        <v-tab-item>
                            <v-card class="section section_dark ma-5 pa-5" outlined>
                                <v-card-text>  
                                    <v-data-table
                                    :headers="bundleRowsHeaders"
                                    :items="selectedBundleRows"></v-data-table>
                                </v-card-text>
                            </v-card>
                        </v-tab-item>
                    </v-tabs-items>
                    </v-tabs>
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
        </template>     
        </v-data-table>
        <v-overlay :value="isLoading">
        <v-progress-circular indeterminate color="green"></v-progress-circular>
        <p>لطفا صبر کنید</p>
    </v-overlay>
    </v-container>
</template>

<script>
  var jalaali = require('jalaali-js')
export default{
    data(){
        return{
            tab: null,
            isLoading: false,
            dialog: false,
            selectedCampaignDetails:null,
            selectedBundleRows:null,
        }
    },
    methods:{
        fetchCampaignData(){
            this.isLoading = true
            this.$store.dispatch("fetchCampaignsData").then((resp)=>{
                this.isLoading = false
                if (!resp.success){
                    this.$toasted.show(`خطا در بارگذاری:${resp.error}`,{
                        type: "error",
                        position: 'bottom-center',
                        duration: 5000
                    })
                }
            })
        },
        viewMore(item){
            console.log(item)
            this.selectedCampaignDetails= this.campaignDetails.filter(x=>x.CampaignID == item.Id)[0]
            this.selectedBundleRows = this.bundleRows.filter(x=>x.CamDetailID == this.selectedCampaignDetails.Id)
        }
    },
    computed:{
        bundleRows(){
            return this.$store.getters.getBundleRows
        },
        campaigns(){
            return this.$store.getters.getCampaigns
        },
        campaignDetails(){
            return this.$store.getters.getCampaignDetails
        },
        campaignHeader(){
            return[
                {
                    text:'شماره',
                    value:'Id'
                },
                {
                    text:'نام',
                    value:'Name'
                },
                {
                    text:'تاریخ شروع',
                    value:'StartDate'
                },
                {
                    text:'تاریخ پایان',
                    value:'EndDate'
                },
                {
                    text:'کد بی وان',
                    value:'B1CampaignId'
                },
                {
                    text:'نوع',
                    value:'Type'
                },
                {
                    text:'فعال',
                    value:'isActive'
                },
                {
                    text: 'جزییات',
                    value: 'more'
                }
            ]
        },
        bundleRowsHeaders(){
            return [
                {
                    text:'شماره',
                    value:'Id'
                },
                {
                    text:'کدهای کالا',
                    value:'ItemCodes'
                },
                {
                    text:'گروه های کالا',
                    value:'ItemGrpCodes'
                },
                {
                    text:'اجباری',
                    value:'isRequired'
                },
                {
                    text:'نسبت لازم',
                    value:'ReqCoEff'
                },
                {
                    text:'حداقل تعداد لازم',
                    value:'MinReqQty'
                },
                {
                    text:'حداکثر تعداد لازم',
                    value:'MaxReqQty'
                },
                {
                    text:'پله تعدادی',
                    value:'StepReqQty'
                },
                {
                    text:'حداقل مبلغ لازم',
                    value:'MinReqValue'
                },
                {
                    text:'حداکثر مبلغ لازم',
                    value:'MaxReqValue'
                },
                {
                    text:'پله مبلغی',
                    value:'StepReqValue'
                },
                {
                    text:'تخفیف هر پله تعدادی',
                    value:'DisPerQtyStp'
                },
                {
                    text:'تخفیف هر پله مبلغی',
                    value:'DisPerValueStp'
                },
                {
                    text:'حداکثر تخفیف تعدادی',
                    value:'MaxDisPerQty'
                },
                {
                    text:'حداکثر تخفیف مللغی',
                    value:'MaxDisPerValue'
                },
                {
                    text:'حداکثر تخفیف',
                    value:'MaxDis'
                },
                {
                    text:'قواعد تخفیف',
                    value:'DisRelation'
                },
                {
                    text:'سیاست تخفیف',
                    value:'DisPolicy'
                },
                {
                    text:'تخفیف ثابت',
                    value:'FixedValue'
                },
                {
                    text:'تخفیف پایه',
                    value:'BaseDis'
                },
                {
                    text:'قیمت پایه',
                    value:'BasePrice'
                },
                {
                    text:'کد تکسون',
                    value:'TaxonId'
                },
                {
                    text:'کد کمپین',
                    value:'CampaignId'
                }
    ]
    }},
      filters:{
        
        formatDate(geoDate){
            
            var date = new Date(geoDate);
            let jdate = jalaali.toJalaali(date.getFullYear(), date.getMonth()+1, date.getDate())
            return `${jdate.jy}/${jdate.jm}/${jdate.jd}`
        }
      },
      created(){
        this.fetchCampaignData()
      }
}
</script>
