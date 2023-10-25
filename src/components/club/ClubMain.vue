<template>
    <v-container>
        <v-card outlined>
            <v-card-text>
                
                    <v-form @submit.prevent="submitForm">
                        <v-row>
                        <v-col cols="5">
                            <v-text-field
                            label="شماره موبایل"
                            v-model="mobileNumber"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-btn :loading="isLoading" type="submit" color="purple">جستجو</v-btn>
                        </v-col>
                    </v-row>
                    </v-form>
                
            </v-card-text>
        </v-card>
        <v-card v-if="reportData">
            <v-card-text>
                <v-row>
                    <v-col cols="4">
                <v-text-field
                :value="reportData.points.point1.point"
                label="امتیاز 1 میلیون خرید نقدی"
                disabled
                ></v-text-field>
            </v-col>
            <v-col cols="4">
                <v-text-field
                :value="reportData.points.point2.point"
                label="امتیاز 1 میلیون خرید"
                disabled
                ></v-text-field>
            </v-col>
            <v-col cols="4">
                <v-text-field
                :value="reportData.points.point2.point + reportData.points.point1.point"
                label="جمع امتیاز"
                disabled
                ></v-text-field>
            </v-col>
            <v-col cols="6">
                <v-card>
                    <v-card-title>
                        محاسبات امتیاز اول
                    </v-card-title>
                    <v-card-text>
                       <p> کل مبلغ خرید شما {{ reportData.points.point1.summation | formatAmount}} ریال بوده است.</p>
                       <p>با توجه به محاسبه هر {{ reportData.points.point1.divider | formatAmount}} یک امتیاز شما {{  reportData.points.point1.point }} امتیاز برده اید.</p>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="6">
                <v-card>
                    <v-card-title>
                        محاسبات امتیاز دوم
                    </v-card-title>
                    <v-card-text>
                       <p> کل مبلغ خرید نقدی شما {{ reportData.points.point2.summation | formatAmount }} ریال بوده است.</p>
                       <p>با توجه به محاسبه هر {{ reportData.points.point2.divider | formatAmount }} دو امتیاز شما {{  reportData.points.point2.point }} امتیاز برده اید.</p>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12">
                <v-btn color="red" @click="reportData = null,reportData=null,mobileNumber=''" >بستن</v-btn>
            </v-col>
            <v-card>
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
            </v-card>
            </v-row>
            </v-card-text>
        </v-card>
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
            mobileNumber: '',
            reportData:null,
            errorData: null,
            errorModal: false,
            isLoading: false
        }
    },
    methods:{
        submitForm(){
            this.isLoading = true
            this.reportData = null
            this.$store.dispatch('findClubReport', this.mobileNumber).then((response) => {
                this.isLoading = false
                console.log(response)
                if (response.success){
                    this.reportData = response.result
                }
                else{                   
                    this.errorData = "شماره وارد شده صحیح نیست"
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
