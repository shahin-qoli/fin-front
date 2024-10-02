<template>
    <v-container>
        <v-card outlined>
            <!-- <v-card-title>
                        <v-form @submit.prevent="submitSearch">
                            <v-row>
                            <v-col cols="4">
                                <date-picker v-model="search.startDate" label="از تاریخ"></date-picker>
                            </v-col>
                            <v-col cols="4">
                                <date-picker v-model="search.endDate" label="تا تاریخ"></date-picker>
                            </v-col>
                            <v-col cols="4">
                                <v-switch
                                    v-model="search.isSuccess"
                                    label="تراکنش های موفق"
                                    class="pa-3"
                                ></v-switch>
                            </v-col>
                            <v-col cols="1">
                                <v-btn dark color="green" type="submit">جستجو</v-btn>
                            </v-col>
                        </v-row>
                        </v-form>
            </v-card-title> -->
            <v-card-text>
                <v-data-table
                fixed-header
                dense
                :headers="headers"
                :options.sync="options"
                :items="items"
                item-key="id"
                class="elevation-1"
                :server-items-length="itemCount">
                </v-data-table>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
var jalaali = require('jalaali-js')
import DatePicker from '../DatePicker.vue'
export default {
    components:{ DatePicker},
    data(){
        return {
            options: {
            itemsPerPage: 10,
            page: 1
            },
            search:{
                startDate: '',
                endDate: '',
                isSuccess: false,
            },
            searchLoaded:{}
        }
    },
    computed:{
        headers(){
            return [
                {
                    text: "شماره",
                    align: "center",
                    //sortable: false,
                    value: "id",
                },                {
                    text: "تاریخ تراکنش",
                    align: "center",
                    //sortable: false,
                    value: "docdate",
                },
                {
                    text: "کد تامین کننده",
                    align: "center",
                    //sortable: false,
                    value: "vendor_code",
                },
                {
                    text: "درخواست صدور سند",
                    align: "center",
                    //sortable: false,
                    value: "is_requested",
                },
                {
                    text: "تکمیل شده",
                    align: "center",
                    //sortable: false,
                    value: "is_completed",
                },
                {
                    text: "پیش نویس",
                    align: "center",
                    //sortable: false,
                    value: "is_draft",
                },
                {
                    text: "کلید سند B1",
                    align: "center",
                    //sortable: false,
                    value: "docentry",
                },
                {
                    text: "تاریخ ثبت",
                    align: "center",
                    //sortable: false,
                    value: "created_at",
                }
            ]
        },
        items(){
            return this.$store.getters.getCreatedGrpo;
        },
        itemCount(){
            return this.$store.getters.getItemCountCreatedGrpo;
        }
    },
    methods:{
        submitSearch(){
        this.loadLogs();
      },
      loadLogs(){
        const payload = {search: this.search, options: this.options}
        this.$store.dispatch('loadLogs',payload)
      }
    },
    watch:{
        options:{
        handler(){   
        this.loadLogs();    
        },  deep: true
        }, 
    },
    filters:{
        formatDate(geoDate){          
            var date = new Date(geoDate);
            let jdate = jalaali.toJalaali(date.getFullYear(), date.getMonth()+1, date.getDate())
            return `${jdate.jy}/${jdate.jm}/${jdate.jd}`
        }
    }
//    ,
 //   created(){
 //       this.loadLogs();
//    }
}
</script>
