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
                <template v-slot:[`item.docdate`]="{item}">
                    <p>{{ item.docdate | formatDate }}</p>
                </template>
                <template v-slot:[`item.created_at`]="{item}">
                    <p>{{ item.created_at | formatDate }}</p>
                </template>    
                <template v-slot:[`item.is_requested`]="{ item }">
                    <v-simple-checkbox
                        v-model="item.is_requested"
                        disabled
                    ></v-simple-checkbox>
                </template>
                <template v-slot:[`item.is_synced`]="{ item }">
                    <v-simple-checkbox
                        v-model="item.is_synced"
                        disabled
                    ></v-simple-checkbox>
                </template>
                <template v-slot:[`item.is_draft`]="{ item }">
                    <v-simple-checkbox
                        v-model="item.is_draft"
                        disabled
                    ></v-simple-checkbox>
                </template> 
                <template v-slot:[`item.details`]="item">
                    <v-btn @click="detailsDialog(item)">  دیدن </v-btn>
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
            <grpo-detail :purchase="dialogItem" @close="closeDialog"></grpo-detail>
        </v-dialog>
    </v-container>
</template>

<script>
import GrpoDetail from './_GrpoDetails.vue'
var jalaali = require('jalaali-js')
import DatePicker from '../DatePicker.vue'
export default {
    components:{ DatePicker, GrpoDetail},
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
            searchLoaded:{},
            dialog: false,
            dialogItem:{vendor_code:'', vendor_name:''},
            disableEdit: true,
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
                    value: "is_synced",
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
                },
                {
                    text: "جزییات",
                    align: "center",
                    //sortable: false,
                    value: "details",
                },
            ]
        },
        items(){
            return this.$store.getters.getCreatedGrpo;
        },
        itemCount(){
            return this.$store.getters.getItemCountCreatedGrpo;
        },
        disableEditBtn(){
            this.dialogItem.is_synced || !this.disableEdit
        }
    },
    methods:{
        submitSearch(){
        // this.loadLogs();
      },
      loadCreatedGrpo(){
        this.$store.dispatch('loadCreatedGrpo',this.options)
      },
      detailsDialog(item){
            this.dialog=true;
            this.dialogItem= {...item.item}
        },
        closeDialog(){
            this.dialog = false
        }
    },
    watch:{
        options:{
        handler(){   
            this.loadCreatedGrpo();    
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
