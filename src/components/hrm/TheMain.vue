<template>
    <v-container>
        <v-card class="ma-5 pa-5" v-if="personnel == null">
            <v-tabs                   
                    v-model="tab"
                    align-with-title
                    ><v-tabs-slider color="yellow"></v-tabs-slider>
                        <v-tab>
                            <p>ورود</p>
                        </v-tab>
                        <v-tab>
                            <p>ثبت</p>
                        </v-tab>
            </v-tabs>
            <v-tabs-items 
            v-model="tab">
                <v-tab-item>
                    <v-card class="section section_dark ma-5 pa-5" outlined>
                        <v-card-text>  
                                <v-form @submit.prevent="submitFormMobile">
                                    <v-row>
                                        <v-col cols="12" md="6">
                                            <v-text-field
                                            label="کد ملی"
                                            v-model="nationalId"
                                            ></v-text-field>
                                        </v-col>
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
                                <v-form @submit.prevent="submitFormId">
                                    <v-row>
                                        <v-col cols="12" md="6">
                                            <v-text-field
                                            label="کد ملی"
                                            v-model="nationalId"
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
        <!-- کارت بالای صفحه، شامل مشخصات و فیلتر ماه -->
        <v-card v-if="personnel != null" class="ma-5 pa-5">
            <v-card-text>
                <v-row>
                    <v-col cols="6">
                        <v-sheet         
                        elevation="10"
                        rounded="xl" class="pa-3 text-right">
                            <v-row>
                                <v-col cols="6">
                                    <v-text-field disabled :value="personnel.name" label="نام" ></v-text-field>
                                </v-col>
                                <v-col cols="6">
                                    <v-text-field disabled :value="personnel.b1_code" label="کد پرسنلی" ></v-text-field>
                                </v-col>
                                <v-col cols="6">
                                    <v-text-field disabled :value="personnel.national_id" label="کد ملی" ></v-text-field>
                                </v-col>
                                <v-col cols="6">
                                    <v-text-field disabled :value="personnel.mobile_number" label="موبایل" ></v-text-field>
                                </v-col>
                            </v-row>    
                        </v-sheet>                 
                    </v-col>
                    <v-col cols="6">
                        <v-sheet                         
                        elevation="10"
                        rounded="xl">
                            <v-chip-group
                            mandatory
                            active-class="primary--text"
                            column
                            v-model="selectedMonth"
                            @change="realodToShowData"
                            >            
                            <v-row>
                                <v-col v-for="month in months" :key="month.value" cols="4">
                                    <v-chip  color="green" dark :key="month.value" :value="month.value">{{ month.text }}</v-chip>
                                </v-col>
                            </v-row>
                                <!-- <v-chip
                                v-for="month in months"
                                :key="month.value"
                                :value="month.value"
                                >
                                {{ month.text }}
                                </v-chip> -->
                            </v-chip-group>
                        </v-sheet>
                        
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
        <!-- کارت روزها -->
        <v-card v-if="toShowData" class="ma-5 pa-5">
            <v-data-iterator
            class="ma-5 pa-5"
            :items="toShowData"
            items-per-page=31
            item-key="DateData"
            hide-default-footer>
            <template v-slot:default="props">
                <v-row>
                    <table>
                        <tr>
                            <th>
                            روز
                            </th>
                            <th>
                            تاریخ
                            </th>
                            <th>
                            ترددها
                            </th>
                        </tr>
                        <tr v-for="item in props.items" :key="item.DateData" cols="12">
                        <td>{{ item.DateData | formatDate}} </td>
                        <td>{{  formatWeekDay(item.DateData) }}</td>
                        <td>
                        <v-chip  class="ma-5 pa-5" v-for="it in item.time_array.split(',')" :key="it">
                            {{ it }}
                        </v-chip>
                    </td>
                    </tr>
                    </table>

                </v-row>
    
            </template>
            </v-data-iterator>

            <v-btn @click="refreshData">بازنشانی</v-btn>
        </v-card>
        <!-- مدال برای وارد کردن شماره موبایل -->
        <v-dialog v-model="initDialog">
            <v-card class="ma-5 pa-5">
                <v-card-title>
                    شماره موبایل خود را ثبت کنید.
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="6">
                            <v-text-field disabled :value="initData.Name" label="نام" ></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field disabled :value="initData.LastName" label="نام خانوادگی" ></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field disabled :value="initData.IdentificationCode" label="کد ملی" ></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field v-model="iniMobileNumber" label="موبایل" ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-btn :loading="isLoading" @click="submitInit" color="purple">ثبت</v-btn>
                        </v-col>                        
                    </v-row>     
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-container>
</template>
<script>
var jalaali = require('jalaali-js')
export default{
    data(){
        return{
            tab: null,
            isLoading: false,
            mobileNumber:"09124769631",
            nationalId:"0075016907",
            selectedMonth:'',
            allData: null,
            personnel: null,
            toShowData:null,
            initDialog: false,
            initData:{Name:'', LastName:'', IdentificationCode:''},
            iniMobileNumber:''
        }
    },
    methods:{
        refreshData(){
            this.tab= null,
            this.isLoading = false,
            this.mobileNumber ="09124769631",
            this.nationalId = "0075016907",
            this.selectedMonth ='',
            this.allData = null,
            this.personnel = null,
            this.toShowData = null,
            this.initDialog = false,
            this.initData ={Name:'', LastName:'', IdentificationCode:''},
            this.iniMobileNumber =''
        },
        getPersonnel(){
            // Call API to get personnel details
            return 'John Doe'
        },
        submitInit(){
            this.isLoading = true
            this.$store.dispatch('updateMobileNumber', {
                national_id: this.initData.IdentificationCode,
                mobile_number: this.iniMobileNumber
            }).then((response) =>{
                this.isLoading= false
                if (response.success){
                    this.initDialog = false
                    this.tab=null
                    this.mobileNumber = this.iniMobileNumber
                    this.nationalId = this.initData.IdentificationCode
                    this.$toasted.show('شماره موبایل با موفقیت ثبت شد، وارد شوید',{
                        position: 'bottom-center',
                        type: 'success',
                        duration: 5000
                    })
                }else{
                    this.$toasted.show(response.error,{
                        position: 'bottom-center',
                        type: 'error',
                        duration: 5000
                    })
                }
            })
        },
        submitFormId(){
            this.isLoading = true
            this.$store.dispatch('findPersonnelById', {
                id: this.nationalId
            }).then((response) =>{
                this.isLoading= false
                if (response.success){
                    
                    this.initData= response.data
                    this.initDialog = true
                }else{
                    this.$toasted.show(response.error,{
                        position: 'bottom-center',
                        type: 'error',
                        duration: 5000
                    })
                }
            })
        },
        submitFormMobile(){
            this.isLoading = true
            this.$store.dispatch('findPersonnelByMobileAndId', {
                mobile: this.mobileNumber,
                id: this.nationalId
            }).then((response) =>{
                this.isLoading= false
                if (response.success){
                    
                    this.allData= response.data
                    this.personnel = response.personnel
                    this.realodToShowData()
                }else{
                    this.$toasted.show(response.error,{
                        position: 'bottom-center',
                        type: 'error',
                        duration: 5000
                    })
                }
            })
        },
        realodToShowData(){
           
            if (this.allData != null && this.selectedMonth != '') {
                let month = this.months.find(m => m.value === this.selectedMonth)
                this.toShowData = this.allData.filter((item) => {
                    let startDate = new Date(month.start)
                    let endDate = new Date(month.end)
                    let date = new Date(item.DateData)
                    return date >= startDate && date <= endDate
                })
            // let month = this.months.find(m => m.value === this.selectedMonth)
            // this.toShowData = this.allData.filter((item) => {
            //     let startDate = new Date(month.start)
            //     let endDate = new Date(month.end)
            //     let date = new Date(item.DateData)
            //     console.log(date >= startDate && date <= endDate)
            //     return date >= startDate && date <= endDate
            // })
        }},
        formatWeekDay(day){
           console.log(this.weekDays)
            let date = new Date(day)
            return this.weekDays.filter((item)=> item.value == date.getDay() )[0].text

        }
    },computed:{
        months(){
            return[
                {
                    text: 'فروردین',
                    value: '1',
                    start:'2023-03-21',
                    end: '2023-04-20'
                },{
                    text: 'اردیبهشت',
                    value: '2',
                    start:'2023-04-21',
                    end: '2023-05-21'
                },{
                    text: 'خرداد',
                    value: '3',
                    start:'2023-05-22',
                    end: '2023-06-21'
                },
                {
                    text: 'تیر',
                    value: '4',
                    start:'2023-06-22',
                    end: '2023-07-22'
                },
                {
                    text: 'مرداد',
                    value: '5',
                    start:'2023-07-23',
                    end: '2023-08-22'
                },
                {
                    text: 'شهریور',
                    value: '6',
                    start:'2023-08-23',
                    end: '2023-09-22'
                },
                {
                    text: 'مهر',
                    value: '7',
                    start:'2023-09-23',
                    end: '2023-10-22'
                },
                {
                    text: 'آبان',
                    value: '8',
                    start:'2023-10-23',
                    end: '2023-11-21'
                },
                {
                    text: 'آذر',
                    value: '9',
                    start:'2023-11-22',
                    end: '2023-12-21'
                },
                {
                    text: 'دی',
                    value: '10',
                    start:'2023-12-22',
                    end: '2024-01-20'
                },
                {
                    text: 'بهمن',
                    value: '11',
                    start:'2024-01-21',
                    end: '2024-02-19'
                },
                {
                    text: 'اسفند',
                    value: '12',
                    start:'2024-02-20',
                    end: '2024-03-19'
                }
            ]
        },
        weekDays(){
            return[
                {
                    text: 'شنبه',
                    value: 6
                },{
                    text: 'یکشنبه',
                    value: 0
                },{
                    text: 'دوشنبه',
                    value: 1
                },{
                    text: 'سه شنبه',
                    value: 2
                },{
                    text: 'چهارشنبه',
                    value: 3
                },{
                    text: 'پنجشنبه',
                    value: 4
                },{
                    text: 'جمعه',
                    value: 5
                }
            ]
        }

    },
    filters:{
        formatDate(geoDate){
            
            var date = new Date(geoDate);
            let jdate = jalaali.toJalaali(date.getFullYear(), date.getMonth()+1, date.getDate())
            return `${jdate.jy}/${jdate.jm}/${jdate.jd}`
        }
    }
}
</script>

<style scoped>
table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
}
</style>