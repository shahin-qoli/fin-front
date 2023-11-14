<template>
    <v-container>
        <v-row >
            <v-col cols="12" class="d-flex justify-center align-center">
            <h3>باشگاه مشتریان بروکس</h3>
        </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
        <v-card>
            <v-tabs
            @change="refreshData"
            v-model="tab"
            align-with-title
            ><v-tabs-slider color="yellow"></v-tabs-slider>
                <v-tab>
                    <p>جستجو با شماره موبایل</p>
                </v-tab>
                <v-tab>
                    <p>جستجو با شماره مشتری</p>
                </v-tab>
            </v-tabs>
            <v-tabs-items 
            v-model="tab">
                <v-tab-item>
                    <v-card class="section section_dark ma-5 pa-5" outlined>
                        <v-card-text>  
                                <v-form @submit.prevent="submitFormMobile">
                                    <v-row no-gutters>
                                    <v-col cols="12" md="6">
                                        <v-text-field
                                        label="شماره موبایل"
                                        v-model="mobileNumber"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-btn :loading="isLoading" type="submit" color="purple">جستجو</v-btn>
                                    </v-col>
                                </v-row>
                                </v-form>
                        </v-card-text>
                    </v-card>
                </v-tab-item>
                <v-tab-item>
                    <v-card class="section section_dark ma-5 pa-5" outlined>
                        <v-card-text>  
                                <v-form @submit.prevent="submitFormCode">
                                    <v-row no-gutters>
                                    <v-col cols="12" md="6">
                                        <v-text-field
                                        label="شماره مشتری"
                                        v-model="cardCode"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-btn :loading="isLoading" type="submit" color="purple">جستجو</v-btn>
                                    </v-col>
                                </v-row>
                                </v-form>
                        </v-card-text>
                    </v-card>
                </v-tab-item>
            </v-tabs-items>
        </v-card>
        <v-card class="ma-5 pa-5" v-if="reportData">
            <v-card class=" ma-5 pa-5">
                <v-card-title>
                    <p>مشخصات مشتری</p>
                </v-card-title>
                <v-card-text >
                    <v-row no-gutters>
                        <v-col cols="12" lg="4" sm="6" md="6">
                            <v-text-field
                    :value="reportData.customer_data.cardName"
                    label="نام مشتری"
                    disabled
                    ></v-text-field>
                        </v-col>
                        <v-col cols="12" lg="4" sm="6" md="6">
                            <v-text-field
                    :value="reportData.customer_data.cardCode"
                    label="کد مشتری"
                    disabled
                    ></v-text-field>
                        </v-col>
                        <v-col cols="12" lg="4" sm="6" md="6">
                            <v-text-field
                    :value="reportData.customer_data.city"
                    label="شهر "
                    disabled
                    ></v-text-field>
                        </v-col>
                        <v-col cols="12" lg="4" sm="6" md="6">
                            <v-text-field
                    :value="reportData.customer_data.cellular"
                    label="شماره موبایل "
                    disabled
                    ></v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
            <v-card>
                <v-card-text class="section section_dark">
                    <v-row>
                        <v-col cols="12" lg="3" sm="3" md="3">
                    <v-text-field
                    :value="reportData.points.point1.point"
                    label="امتیاز خرید"
                    disabled
                    ></v-text-field>
                </v-col>
                <v-col cols="12" lg="3" sm="3" md="3">
                    <v-text-field
                    :value="reportData.points.point2.point"
                    label="امتیاز نقدی"
                    disabled
                    ></v-text-field>
                </v-col>
                <v-col cols="12" lg="3" sm="3" md="3">
                    <v-text-field
                    :value="reportData.points.point3.point"
                    label="امتیاز همایش"
                    disabled
                    ></v-text-field>
                </v-col>
                <v-col cols="12" lg="3" sm="3" md="3">
                    <v-text-field
                    :value="reportData.points.point2.point + reportData.points.point1.point + reportData.points.point3.point"
                    label="جمع امتیاز"
                    disabled
                    ></v-text-field>
                </v-col>
                <v-col cols="12" lg="6" sm="6" md="6">
                    <v-card>
                        <v-card-title>
                            محاسبات امتیاز اول
                        </v-card-title>
                        <v-card-text>
                        <p> کل مبلغ خرید شما {{ reportData.points.point1.summation | formatAmount}} ریال بوده است.</p>
                        <p>با توجه به محاسبه هر {{ reportData.points.point1.divider | formatAmount}} یک امتیاز شما {{  reportData.points.point1.point }} امتیاز کسب کرده اید.</p>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="12" lg="6" sm="6" md="6">
                    <v-card>
                        <v-card-title>
                            محاسبات امتیاز دوم
                        </v-card-title>
                        <v-card-text>
                        <p> کل مبلغ خرید نقدی شما {{ reportData.points.point2.summation | formatAmount }} ریال بوده است.</p>
                        <p>با توجه به محاسبه هر {{ reportData.points.point2.divider | formatAmount }} دو امتیاز شما {{  reportData.points.point2.point }} امتیاز کسب کرده اید.</p>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="12" lg="6" sm="6" md="6">
                    <v-card>
                        <v-card-title>
                            محاسبات امتیاز همایش BELEX
                        </v-card-title>
                        <v-card-text>
                            <p>با توجه به خریدهای شما در همایش، برنده {{  reportData.points.point3.point }} امتیاز شده‌اید.</p>
                            <p>جهت مشاهده امتیاز هر خرید، جزییات فاکتور را ببینید.</p>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="12">
                <v-card>
                    <v-card-title>
                        <p>جزییات فاکتور</p>
                    </v-card-title>
                    <v-card-text>
                    <v-data-table
                    fixed-header
                    dense
                    :headers="headers"
                    :items="reportData.data.order"
                    class="elevation-1"
                    >
                    <template v-slot:[`item.Total`]="{ item }">
                    <p>{{ item.Total | formatAmount }}</p>
                    </template>
                    <template v-slot:[`item.DocDate`]="{ item }">
                    <p>{{ item.DocDate | formatDate }}</p>
                    </template>
                    </v-data-table>
                </v-card-text>
                </v-card>
            </v-col>
                <v-col cols="12">
                    <v-btn color="red" @click="refreshData" >بستن</v-btn>
                </v-col>
                </v-row>
                </v-card-text>
            </v-card>
        </v-card>
    </v-col>
    </v-row>
        <v-dialog v-model="errorModal" max-width="500">
            <v-card>
                <v-card-title class="text-h5">خطا</v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12">                
                            <div class="modal-scroll">
                            <p v-html="errorData"></p>
                            </div>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                <v-btn color="primary" text @click="errorModal = false, errorData = ''">بستن</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        
    </v-container>
</template>

<script>
var jalaali = require('jalaali-js')
export default {
    data(){
        return {
            tab: null,
            mobileNumber: '',
            cardCode: '',
            reportData: null,
            errorData: null,
            errorModal: false,
            isLoading: false
        }
    },
    methods:{
        refreshData() {
            console.log("Refreshing data...");
            this.reportData = null;
            this.mobileNumber = '';
            this.cardCode = '';
        },
        submitFormMobile(){
            this.isLoading = true
            this.reportData = null
            this.$store.dispatch('findClubReportMobile', this.mobileNumber).then((response) => {
                this.isLoading = false
                console.log(response)
                if (response.success){
                    this.reportData = response.result
                }
                else{                   
                    this.errorData = response.result.error || "شماره وارد شده صحیح نیست"
                    this.errorModal= true}
            })
        },
        submitFormCode(){
            this.isLoading = true
            this.reportData = null
            this.$store.dispatch('findClubReportCode', this.cardCode).then((response) => {
                this.isLoading = false
                console.log(response)
                if (response.success){
                    this.reportData = response.result
                }
                else{                   
                    this.errorData =  response.result.error || "کد وارد شده صحیح نیست"
                    this.errorModal= true}
            })
        }
    },
    computed:{
        headers(){
            return [
                {
                text: "شماره",
                align: "center",
                //sortable: false,
                value: "DocNum",
                },
                {
                text: "کد مشتری",
                align: "center",
                //sortable: false,
                value: "CardCode",
                },                {
                text: "تاریخ",
                align: "center",
                //sortable: false,
                value: "DocDate",
                },                {
                text: "وضعیت",
                align: "center",
                //sortable: false,
                value: "DocStatus",
                },                {
                text: "جمع",
                align: "center",
                //sortable: false,
                value: "Total",
                },                {
                text: "روش پرداخت",
                align: "center",
                //sortable: false,
                value: "U_Settle_Type",
                },
                {
                text: "زمان پرداخت",
                align: "center",
                //sortable: false,
                value: "U_PayDueDate",
                },
                {
                text: "امتیاز همایش",
                align: "center",
                //sortable: false,
                value: "U_ClubPoint",
                },
            ]
        }
    },
    filters:{
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
    }
    

}

</script>
