<template>
    <v-container>
        <v-card outlined>
            <v-card-title>
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
            </v-card-title>
            <v-card-text>
                <v-data-table
                fixed-header
                dense
                :headers="headers"
                :options.sync="options"
                :items="logs"
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
                    text: "تاریخ تراکنش",
                    align: "center",
                    //sortable: false,
                    value: "created_at",
                },
                {
                    text: "rayID",
                    align: "center",
                    //sortable: false,
                    value: "rey_id",
                },
                {
                    text: "تراکنش موفق",
                    align: "center",
                    //sortable: false,
                    value: "is_success",
                },
                {
                    text: "خطا",
                    align: "center",
                    //sortable: false,
                    value: "error",
                },
                {
                    text: "پاسخ",
                    align: "center",
                    //sortable: false,
                    value: "response",
                },
                {
                    text: "بدنه درخواست",
                    align: "center",
                    //sortable: false,
                    value: "request_body",
                }
            ]
        },
        logs(){
            return this.$store.getters.getLogs;
        },
        itemCount(){
            return this.$store.getters.getItemCount;
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
