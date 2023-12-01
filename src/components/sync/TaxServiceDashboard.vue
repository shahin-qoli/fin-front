<template>
    <v-container>
     <!-- <v-card>
        <v-row>
            <v-col cols="12">              
                <v-card outlined>
                    <v-card-text>
                        <v-form  @submit.prevent="submitUpdate">
                            <v-row >
                                <v-col cols="3"  >
                                    <date-picker v-model="updateStartDate" label="تاریخ شروع"></date-picker>
                                </v-col>
                                <v-col cols="3">
                                    <v-btn dark color="green" type="submit">به روزرسانی اسناد</v-btn>
                                </v-col>
                                <v-col cols="3">
                                    <v-btn dark color="green" @click="updateMasterData">به روزرسانی اطلاعات پایه</v-btn>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-card> -->
    <v-card>
        <v-row>
            <v-col cols="12" class="center-text">
                <p>فیلتر فاکتور</p>
            </v-col>
            <v-col>
                <v-form @submit.prevent="filterSourceDocs">
                    <v-row>
                        <v-col cols="4">
                            <v-select
                            :items="selectStateOptions"
                            v-model="selectedFilter"
                            v-on:change="handleChangeFilter"
                            ></v-select>
                        </v-col>
                    </v-row>
                </v-form>
            </v-col>
        </v-row>
    </v-card>
    <v-card>
        <v-row>
            <v-col cols="12">
                <v-card>
                    <v-card-text>
                        <v-data-table
                        fixed-header
                        dense
                        :headers="headers"
                        :items="syncSourceDocs"
                        item-key="id"
                        show-select
                        item-value="id"

                        :options.sync="options"
                        :server-items-length="itemCountSyncSources"
                        class="elevation-1"
                        >
                        <template v-slot:[`item.is_synced`]="{ item }">
                            <v-simple-checkbox
                            v-model="item.is_synced"
                            disabled
                            ></v-simple-checkbox>
                        </template>
                        <template v-slot:[`item.equivalent_created`]="{ item }">
                            <v-simple-checkbox
                            v-model="item.equivalent_created"
                            disabled
                            ></v-simple-checkbox>
                        </template>
                        <template v-slot:[`item.source_document_total`]="{ item }">
                        <p>{{ item.source_document_total | formatAmount }}</p>
                    </template>
                    
                    <template v-slot:[`item.source_document_date`]="{ item }">
                        <p>{{ item.source_document_date | formatDate }}</p>
                    </template>
                    <template v-slot:[`item.is_ready_for_tax_service`]="{ item }">
                        <p>{{ item.is_ready_for_tax_service[0] ? true : item.is_ready_for_tax_service[1]  }}</p>
                    </template>
                        <!-- <template v-slot:[`item.controls`]="props">
                         <v-btn  class="mx-2" small  @click="retryJob(props.item)">
                        <v-icon>mdi-check-outline</v-icon>
                        </v-btn>
                        </template>
                        <template v-slot:[`item.mainDocument`]="props">
                            <span>{{ JSON.stringify(props.item.mainDocument) }}</span>
                        </template>
                        <template v-slot:[`item.equivalentDocument`]="props">
                            <span>{{ JSON.stringify(props.item.equivalentDocument) }}</span>
                        </template> -->
                        </v-data-table>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-card>
    </v-container>
</template>

<script>
var jalaali = require('jalaali-js')
export default{
    data(){
        return{
            options: {
          itemsPerPage: 10,
          page:1,
          selectedOption: 5,
          isSynced: false,
          equivalentCreated: false,
          docsStartDate: '',
            docsEndDate: '',
            isReadyToTax: false,
        },
        selectedFilter: 0,
        }
    },
    methods:{
        loadSyncSourceDocs(){
            this.$store.dispatch('loadTaxSourceDocuments', this.options)
        },
        handleChangeFilter(){
            console.log("start to handle"+ this.selectedFilter)
            switch (parseInt(this.selectedFilter, 10)){
                case 1:
                this.options= {
          itemsPerPage: 10,
          page:1,
          isSynced: false,
          equivalentCreated: false,
          docsStartDate: '',
            docsEndDate: '',
            isReadyToTax: false,
        }
        break;
        case 2:
        
        this.options= {
          itemsPerPage: 10,
          page:1,
          isSynced: false,
          equivalentCreated: false,
          docsStartDate: '',
            docsEndDate: '',
            isReadyToTax: false,
        }
        break;
        case 3:
        this.options= {
          itemsPerPage: 10,
          page:1,
          isSynced: false,
          equivalentCreated: false,
          docsStartDate: '',
            docsEndDate: '',
            isReadyToTax: true,
        }
        break;
        case 4:
        this.options= {
          itemsPerPage: 10,
          page:1,
          isSynced: false,
          equivalentCreated: true,
          docsStartDate: '',
            docsEndDate: '',
            isReadyToTax: true,
        }
        break;
        case 5:
        this.options= {
          itemsPerPage: 10,
          page:1,
          isSynced: true,
          equivalentCreated: true,
          docsStartDate: '',
            docsEndDate: '',
            isReadyToTax: true,
        };
            }
        }
    },
    computed:{
        headers(){
            return [
                {
            text: "ردیف",
            align: "center",
            //sortable: false,
            value: "id",
          },
          {
            text: "کلید",
            align: "center",
            //sortable: false,
            value: "source_document_id",
          },
           {
            text: "شماره",
            align: "center",
            //sortable: false,
            value: "source_document_number",
          },
          {
            text: "طرف حساب",
            align: "center",
            //sortable: false,
            value: "owner_card_code",
          },
          {
            text: "تاریخ",
            align: "center",
            //sortable: false,
            value: "source_document_date",
          },
          {
            text:"مبلغ",
            align: "center",
            //sortable: false,
            value: "source_document_total",
          },
          {
            text:"اطلاعات پایه",
            align: "center",
            //sortable: false,
            value: "is_ready_for_tax_service",
          },
          {
            text:"وضعیت آماده سازی",
            align: "center",
            //sortable: false,
            value: "equivalent_created",
          }, 
          {
            text:"وضعیت همگام سازی",
            align: "center",
            //sortable: false,
            value: "is_synced",
          }
        
            ]
        },
        selectStateOptions(){
            return [
                {
                    text:"همه اسناد",
                    value:"0"
                },
                {
                    text:"اسناد خام",
                    value:"1"
                },
                {
                    text:"خطای اطلاعات پایه",
                    value:"2"
                },
                {
                    text:"نیاز به آماده سازی",
                    value:"3"
                },
                {
                    text:"آماده ارسال",
                    value:"4"
                },
                {
                    text:"اسناد ارسال شده",
                    value:"5"
                },
                {
                    text:"خطای ارسال",
                    value:"6"
                },
                {
                    text:"پایان یافته",
                    value:"7"
                }
            ]
        },
        syncSourceDocs(){
            return this.$store.getters.getSyncSourceDocs;
        },
        itemCountSyncSources(){
            return this.$store.getters.getItemCountSyncSources;
        },
    },
    watch:{
      options:{
        handler(){
        this.loadSyncSourceDocs();    
        },  deep: true
      }},
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
<style scoped>
.center-text{
    display: flex;
    align-items: center;
  justify-content: center;
  text-align: center;
}
</style>