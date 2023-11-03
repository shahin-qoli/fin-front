<template>
<v-container>
    <v-card v-if="!isSearchSuccess && !advancedSearchRequired">
        <v-card-title><p>جستجو با شماره موبایل مشتری</p></v-card-title>
        <v-card-text>
            <v-form @submit.prevent="submitFormMobile">
                <v-row>
                    <v-col cols="6">
                        <v-text-field v-model="mobileNumber" label="شماره موبایل" outlined></v-text-field>
                    </v-col>
                    <v-col cols="3">
                        <v-btn color="primary" type="submit">جستجو</v-btn>
                    </v-col>
                    <v-col cols="3">
                        <v-btn color="yellow" @click="advancedSearchRequired = true">جستجو پیشرفته</v-btn>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
    </v-card>
    <v-card v-if="!isSearchSuccess && advancedSearchRequired" >
        <v-card-title><p>جستجو پیشرفته</p></v-card-title>
        <v-card-text>
            <v-form @submit.prevent="submitFormAdvanced">
                <v-row>
                    <v-col cols="6">
                        <v-text-field v-model="advancedSerach.cardName" label="نام" outlined></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field v-model="advancedSerach.county" label="استان" outlined></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field v-model="advancedSerach.countyPhoneCode" label="کد استان" outlined></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field v-model="advancedSerach.idNumber" label="کد ملی" outlined></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field v-model="advancedSerach.address" label="آدرس" outlined></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field v-model="advancedSerach.slpName" label="نام ویزیتور" outlined></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field v-model="advancedSerach.slpCode" label="کد ویزیتور" outlined></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-btn color="primary" type="submit">جستجو</v-btn>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
    </v-card>
    <v-card v-if="isSearchSuccess && !selectedCustomer">
        <v-card-title><p>نتایج جستجو برای شماره {{ mobileNumber }}</p></v-card-title>
        <v-card-text>
            <v-data-table
                :items="searchResult"
                :headers="headers"
                item-key="card_code"

            >
            <template v-slot:[`item.action`]="props">
                <v-btn class="mx-2" color="orange"  @click="selectedCustomer =  props.item.card_code">
                    انتخاب
                </v-btn>
              </template> 
            </v-data-table>
        </v-card-text>
    </v-card>
    <v-card v-if="selectedCustomer && !isGatherData">
        <v-card-text>
            <v-row>
                <v-col v-if="mobileNumber.length == 11" cols="6">
                    <h3>انتخاب شماره {{ this.mobileNumber }} برای مشتری با کد {{ this.selectedCustomer }}</h3>
                </v-col>
                <v-col v-else cols="6">
                   <h3>
                    وارد کردن شماره <v-text-field v-model="mobileNumber"></v-text-field> برای مشتری با کد {{ selectedCustomer }}
                   </h3>
                </v-col>
                <v-col cols="3">
                    <v-btn color="primary" @click="submitMobileForCode">تایید</v-btn>
                </v-col>
                <v-col cols="3">
                    <v-btn color="red" @click="mobileNumber = ''">اصلاح</v-btn>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
    <v-card v-if="isGatherData && !completed">
        <v-card-text>
            <v-form @submit.prevent="submitFormGatherData">  
                <v-row>
                    <v-col cols="6">
                        <v-radio-group row v-model="signedDay">
                            <v-radio label="سه شنبه" value="1"></v-radio>
                            <v-radio label="چهار شنبه" value="2"></v-radio>
                            <v-radio label="پنج شنبه" value="3"></v-radio>
                            <v-radio label="جمعه" value="4"></v-radio>
                        </v-radio-group>
                    </v-col>  
                    <v-col cols="3">
                        <v-text-field v-model="guestCount" label="تعداد مهمان"></v-text-field>
                    </v-col>
                    <v-col cols="3">
                        <v-btn color="primary" type="submit">ثبت</v-btn>
                    </v-col>  
                </v-row> 
            </v-form>
        </v-card-text>
    </v-card>
    <v-card v-if="completed">
        <v-col cols="12">
                    <h3>اطلاعات برای مشتری با شماره {{ this.mobileNumber }} و کد {{ this.selectedCustomer }} ثبت شد.</h3>
        </v-col>
        <v-col cols="6">
            <v-btn @click="refreshData" color="red">شروع مجدد</v-btn>
        </v-col>
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
            advancedSerach:{
                cardName:'',
                idNumber: '',
                slpCode: '',
                slpName: '',
                countyPhoneCode: '',
                county: '',
                address: '',
            },
            advancedSearchRequired: false,
            mobileNumber: '',
            isLoading : false,
            searchResult : null,
            errorData : null,
            errorModal : false,
            isSearchSuccess: false,
            selectedCustomer: null,
            isGatherData : false,
            guestCount: null,
            signedDay: null,
            completed: false,
            itemCount: null,
  
            
        }
    },
    methods:{
        refreshData() {
            this.mobileNumber= '',
            this.isLoading =  false,
            this.searchResult =  null,
            this.errorData =  null,
            this.errorModal =  false,
            this.isSearchSuccess =  false,
            this.selectedCustomer =  null,
            this.isGatherData =  false,
            this.guestCount =  null,
            this.signedDay =  null,
            this.completed =  false
        },
        submitFormMobile(){
            this.isLoading = true
            this.searchResult = null
            this.$store.dispatch('findUserByMobile', this.mobileNumber).then((response) => {
                this.isLoading = false
                console.log(response)
                if (response.success){
                    if (response.result.options.count > 0){
                    this.itemCount =response.result.options.count
                    this.searchResult = response.result.data
                    this.isSearchSuccess = true;}
                    else{
                        this.errorData ="مشتری پیدا نشد"
                        this.errorModal= true
                    }
                }
                else{                   
                    this.errorData = response.result.error || "شماره وارد شده صحیح نیست"
                    this.errorModal= true}
            })
        },
        submitMobileForCode(){
            this.isLoading = true
            this.reportData = null
            let data ={mobileNumber: this.mobileNumber, cardCode: this.selectedCustomer } 
            this.$store.dispatch('submitMobileForCode', data).then((response) => {
                this.isLoading = false
                console.log(response)
                if (response.success){
                    this.isGatherData = true

                }
                else{                   
                    this.errorData =  response.result.error || "کد وارد شده صحیح نیست"
                    this.errorModal= true}
            })
        },
        submitFormGatherData(){
            this.isLoading = true
            let data ={guestCount: this.guestCount, signedDay: this.signedDay, cardCode: this.selectedCustomer } 
            this.$store.dispatch('submitFormGatherData', data).then((response) => {
                this.isLoading = false
                console.log(response)
                if (response.success){
                    this.completed = true
                }
                else{                   
                    this.errorData =  response.result.error || "کد وارد شده صحیح نیست"
                    this.errorModal= true}
            })
        },
        submitFormAdvanced(){
            this.isLoading = true
            this.$store.dispatch('submitFormAdvancedSearch', this.advancedSerach).then((response) => {
                this.isLoading = false
                console.log(response)
                if (response.success){
                    if (response.result.data.length > 0){
                    this.searchResult = response.result.data
                    this.isSearchSuccess = true;}
                    else{
                        this.errorData ="مشتری پیدا نشد"
                        this.errorModal= true
                    }
                }
                else{                   
                    this.errorData = response.result.error || "شماره وارد شده صحیح نیست"
                    this.errorModal= true}
            })
        }
    },
    computed:{
        headers(){
            return [
                {
                text: "نام",
                align: "center",
                //sortable: false,
                value: "card_name",
                },
                {
                text: "کد مشتری",
                align: "center",
                //sortable: false,
                value: "card_code",
                },                {
                text: "استان",
                align: "center",
                //sortable: false,
                value: "county",
                },                {
                text: "شماره موبایل",
                align: "center",
                //sortable: false,
                value: "mobile_number",
                },                {
                text: "شماره 1",
                align: "center",
                //sortable: false,
                value: "phone1",
                },                {
                text: "شماره 2",
                align: "center",
                //sortable: false,
                value: "phone2",
                },
                {
                text: "نام ویزیتور",
                align: "center",
                //sortable: false,
                value: "slp_name",
                }
                ,
                {
                text: "خرید امسال",
                align: "center",
                //sortable: false,
                value: "total_orders[0].total",
                },
                {
                text: "تاریخ آخرین خرید",
                align: "center",
                //sortable: false,
                value: "last_order[0].DocDate",
                },
                {
                text: "انتخاب",
                align: "center",
                //sortable: false,
                value: "action",
                }
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