<template>
    <v-container>
        <v-card>
            <v-card-title>
                <v-row>
                    <v-col cols="12" class="d-flex align-center justify-center">
                        <p>فیلترها</p>
                    </v-col>
                    <v-col cols="4">
                        <v-select
                        :items="requestStates"
                        placeholder="وضعیت سند"
                        solo
                        filled
                        dense
                        item-text="text"
                        item-value="value"
                        v-model="options.selectedState"
                        ></v-select>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-card-text>
                <v-data-table
                :headers="headers"
                :items="requests"
                item-key="id"
                :options.sync="options"
                :server-items-length="itemCount">
                <template v-slot:[`item.details`]="item">
                        <v-btn @click="detailsDialog(item)">  <v-icon>mdi-eye</v-icon> </v-btn>
                    </template>       
                    <template v-slot:[`item.state`]="item">
                        <v-chip small dark :color="getColorRequestStatus(item.item.state)">
                  {{ transformRequestStatus(item.item.state) }}
                </v-chip>
                    </template>    
                    <template v-slot:[`item.created_at`]="item">
                        <p>{{ item.item.created_at | formatDate }}</p>
                    </template>
                    <template v-slot:[`item.attendance_date`]="item">
                        <p>{{ item.item.attendance_date | formatDate }}</p>
                    </template>           
                </v-data-table>
            </v-card-text>
        </v-card>
        <v-dialog
            v-model="dialog"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
            >
            <v-card>
                <v-card-text>
                    <v-row class="dialogCard">
                        <v-col cols="4">
                            <v-text-field
                            disabled
                            v-model="formattedAttendanceDate"
                            label="تاریخ تردد"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field
                                :value="formatToExtractTime(dialogItem.attendance_entrance_time)"
                                label="ساعت ورود"
                                disabled
                            ></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field
                                :value="formatToExtractTime(dialogItem.attendance_exit_time)"

                                label="ساعت خروج"
                                disabled
                            ></v-text-field>
                        </v-col>
                        <v-col cols="9">
                            <v-textarea
                            placeholder="در صورت لزوم توضیحات اضافی ارائه کنید."
                            label="توضیحات"
                            v-model="updateItem.request_extra_info"
                            ></v-textarea>
                        </v-col>
                        <v-col cols="9">
                            <v-textarea
                            placeholder="در صورت لزوم توضیحات اضافی ارائه کنید."
                            label=" دلیل رد"
                            
                            v-model="updateItem.reject_extra_info"
                            ></v-textarea>
                        </v-col>
                        <v-col cols="6">
                            <v-btn dark  color="green" @click="completeRequest">تکمیل کردن درخواست</v-btn>
                            <v-btn dark   color="purple" @click="denyRequest">رد درخواست</v-btn>
                            <v-btn dark  color="red" @click="dialog=false">بستن</v-btn>
                        </v-col>
                    </v-row>

                </v-card-text>
            </v-card>
        
        
        </v-dialog>
    </v-container>
</template>

<script>
import { debounce } from 'lodash';
var jalaali = require('jalaali-js')
export default{
    data(){
        return {
            dialog: false,
            isLoading: false,
            options:{
            itemsPerPage: 10,
            page:1,
            state:'',
            personnel_id: '',
            selectedState:'processing',
            manager_id:'',
            selfRequests: true,
            },
            updateItem:{
            reject_extra_info:'',
            request_extra_info:'',
            id:'',
            handle_by:''
        
            ,},
            dialogItem:{id:''},
            requestStatus: new Map([
                ["referred", 'ارجاع شده به مدیر'],
                ["denied", "رد شده"],
                ["completed", "تکمیل شده"],
                ["processing", 'منابع انسانی در حال بررسی'],
            ]),
            requestStatusColor: new Map([
                ["referred", "yellow"],
                ["processing", "blue"],
                ["denied", "red"],
                ["completed", "green"],


            ])
            }
        },
        methods:{
            transformRequestStatus(status){
            return this.requestStatus.get(status)
        },
        getColorRequestStatus(status){
            return this.requestStatusColor.get(status)
        }, 
            loadAttendanceRequests: debounce(function() {
    this.isLoading = true;
    this.$store.dispatch('LoadAttendanceRequest', this.options)
      .finally(() => this.isLoading = false);
  }, 300),
  detailsDialog(item){
            this.dialog=true;
            this.updateItem.id= item.item.id
            this.updateItem.attendance_date = item.item.attendance_date
            this.updateItem.updated_by = item.item.handle_by
            this.updateItem.reject_extra_info = item.item.reject_extra_info
            this.updateItem.request_extra_info = item.item.request_extra_info

            this.dialogItem= {...item.item}
        },
        isAdmin(item){
            return 1==1            
            
        },
        formatToExtractTime(data){
            if (data != null){
                return data.split('T')[1].split('.')[0];
            }
            else return data
        },
        denyRequest(){    this.isLoading = true;
    this.$store.dispatch('denyAttendanceRequest', this.updateItem)
    .then((response) =>{
        this.isLoading = false;
    if(response.success){
        this.$toasted.show("با موفقیت انجام شد",{
                        position: 'bottom-center',
                        type: 'success',
                        duration: 5000
                    })
    }else{
        this.$toasted.show(`خطا: ${response.error}`, {
                        position: 'bottom-center',
                        type: 'error',
                        duration: 5000
                    })
    }
    }
);
    this.dialog= false
    this.loadAttendanceRequests()},
        completeRequest(){
            this.isLoading = true;
    this.$store.dispatch('completeAttendanceRequest', this.updateItem)
    .then((response) =>{
        this.isLoading = false;
    if(response.success){
        this.$toasted.show("با موفقیت انجام شد",{
                        position: 'bottom-center',
                        type: 'success',
                        duration: 5000
                    })
    }else{
        this.$toasted.show(`خطا: ${response.error}`, {
                        position: 'bottom-center',
                        type: 'error',
                        duration: 5000
                    })
    }
    }
);
    this.dialog= false
    this.loadAttendanceRequests()
        }
        },
        filters:{
    formatDate(geoDate){
            
            var date = new Date(geoDate);
            let jdate = jalaali.toJalaali(date.getFullYear(), date.getMonth()+1, date.getDate())
            return `${jdate.jy}/${jdate.jm}/${jdate.jd}`
        }
    },
    computed:{
        formattedAttendanceDate() {
            if (!this.dialogItem.attendance_date) return ''
            
            const date = new Date(this.dialogItem.attendance_date)
            const jdate = jalaali.toJalaali(
                date.getFullYear(),
                date.getMonth() + 1,
                date.getDate()
            )
            
            // فرمت تاریخ: ۱۴۰۲/۰۵/۱۵
            return `${jdate.jy}/${String(jdate.jm).padStart(2, '0')}/${String(jdate.jd).padStart(2, '0')}`
            },
        headers(){
            return [
                {
                    text: 'ردیف',
                    value: 'id'
                },
                {
                    text: 'درخواست دهنده',
                    value: 'hrm_personnel.name'                   
                },
                {
                    text: 'تاریخ تردد',
                    value: 'attendance_date'                   
                },
                {
                    text: 'تاریخ درخواست',
                    value: 'created_at'                   
                },
                {
                    text: 'وضعیت',
                    value: 'state'
                }
                ,
                {
                    text: 'جزییات',
                    value: 'details'
                }
            ]},
            requests(){
                return this.$store.getters.getAttendanceRequest;
            },
            itemCount(){
                return this.$store.getters.getAttendanceRequestCount;
            },
            requestStates(){
            return [
                {
                    text: 'ارجاع شده به مدیر',
                    value: 'referred'
                },
                {
                    text: 'رد شده',
                    value: 'denied'
                },
                {
                    text: 'تکمیل شده',
                    value: 'completed'
                },
                {
                    text: ' منابع انسانی در حال بررسی',
                    value: 'processing'
                },
            ]
        },},
            watch:{
    options:{
      handler(){   
      this.loadAttendanceRequests();    
      },  deep: true
    }}
}
</script>
<style scoped>
.dialogCard{
    margin: 1px;
    border: 2px;
    border-style: solid;
}
</style>