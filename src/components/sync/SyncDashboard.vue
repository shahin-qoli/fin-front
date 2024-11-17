<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-card outlined>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12">
                                <v-select v-model="options.selectedOption" :items="templates" item-text="title"
                                    item-value="id" label="لیست قالب ها" solo></v-select>
                            </v-col>
                            <v-col v-if="isSelectedAnyOption" cols="3">
                                <v-text-field :value="mainDocument" label="سند مادر" disabled></v-text-field>
                            </v-col>
                            <v-col v-if="isSelectedAnyOption" cols="3">
                                <v-text-field :value="equivalentDocument" label="سند معادل" disabled></v-text-field>
                            </v-col>
                            <v-col v-if="isSelectedAnyOption" cols="6">
                                <v-text-field :value="equivalentDocumentDescription" label="توضیحات" disabled></v-text-field>
                            </v-col>
                            <v-col cols="3">
                                <v-switch v-model="options.isSynced" label="همگام ها را نشان بده"></v-switch>
                            </v-col>
                            <v-col cols="3">
                                <v-switch v-model="options.equivalentCreated"
                                    label="آماده شده ها را نشان بده"></v-switch>
                            </v-col>                            
                            <v-col cols="3">
                                <date-picker v-model="options.docsStartDate" label="تاریخ شروع"></date-picker>
                            </v-col>
                            <v-col cols="3">
                                <date-picker v-model="options.docsEndDate" label="تاریخ پایان"></date-picker>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-card outlined>
                    <v-card-text>
                        <v-form @submit.prevent="submitUpdate">
                            <v-row>
                                <v-col cols="3">
                                    <date-picker v-model="updateStartDate" label="تاریخ شروع"></date-picker>
                                </v-col>
                                <v-col cols="3">
                                    <v-btn dark color="green" type="submit">به روزرسانی اسناد</v-btn>
                                </v-col>
                                <!-- <v-col cols="3">
                                    <v-btn dark color="green" @click="updateMasterData">به روزرسانی اطلاعات پایه</v-btn>
                                </v-col> -->
                            </v-row>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-card>
                    <v-card-text>
                        <v-data-table fixed-header dense :headers="headers" :items="syncSourceDocs" item-key="id"
                            show-select item-value="id" v-model="selectedDocs" @input="handleTableSelectionChange"
                            :options.sync="options" :server-items-length="itemCountSyncSources" class="elevation-1">
                            <template v-slot:header="">
                                <thead>
                                    <tr>
                                        <th colspan="10" class="text-center custom-header">سند مادر</th>
                                        <th colspan="3" class="text-center custom-header">سند معادل</th>
                                    </tr>
                                </thead>
                            </template>
                            <template v-slot:[`item.is_synced`]="{ item }">
                                <v-simple-checkbox v-model="item.is_synced" disabled></v-simple-checkbox>
                            </template>
                            <template v-slot:[`item.equivalent_created`]="{ item }">
                                <v-simple-checkbox v-model="item.equivalent_created" disabled></v-simple-checkbox>
                            </template>
                            <template v-slot:[`item.source_document_total`]="{ item }">
                                <p>{{ item.source_document_total | formatAmount }}</p>
                            </template>
                            <template v-slot:[`item.source_document_date`]="{ item }">
                                <p>{{ item.source_document_date | formatDate }}</p>
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
        <v-row v-if="isSelectedDocs">
            <v-col cols="12">
                <v-card>
                    <v-card-title>
                        <p>عملیات</p>
                    </v-card-title>
                    <v-card-text>
                        <v-row>
                            <v-col v-if="isOkForReady" cols="6">
                                <v-btn color="green" @click="getReady">آماده سازی</v-btn>
                            </v-col>
                            <v-col v-if="isOkForSync" cols="6">
                                <v-btn color="green" @click="getSync">همگام سازی</v-btn>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <!-- Loading Spinner -->
        <v-overlay :value="isLoading">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </v-overlay>
        <!-- Result Modal -->
        <v-dialog v-model="showResultModal" max-width="500">
            <v-card>
                <v-card-title>
                    <h2>نتیجه</h2>
                </v-card-title>
                <v-card-text v-if="message.success">
                    <h3>نتایج موفق</h3>
                    تعداد سند های موفقیت آمیز: {{ message.success.length }}
                </v-card-text>
                <v-card-text v-if="message.failed">
                    <h3>نتایج ناموفق</h3>
                    تعداد سند های ناموفق: {{ message.failed.length }}
                    <v-col v-for="(item,index) in message.failed" :key="index">
                        <p> خطای سند ردیف {{ item.src.id }} برابر است با :
                                {{ item.result }}
                        </p>
                    </v-col>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="primary" @click="showResultModal = false">OK</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-container>
</template>

<script>
var jalaali = require('jalaali-js')
import DatePicker from '../DatePicker.vue'
export default{
    components: {DatePicker},
    data() {
        return {
            options: {
          itemsPerPage: 10,
          page:1,
          selectedOption: 1,
          isSynced: false,
          equivalentCreated: false,
          docsStartDate: '',
            docsEndDate: '',
        },selectedDocs: [],
            // selectedOption: null,
            updateStartDate: null,
            message: {
                success: [],
                failed: []
            },   
            isLoading: false,
            showResultModal: false,
            isOkForReady: false,
            isOkForSync: false,

        }
    },

    // attributes :id, :source_document_id,:equivalent_document_id, :source_document_number, 
    //     :source_document_date, :source_document_total, :source_document_series, :is_synced, :source_document_total_qty,
    //     :source_document_total_line, :owner_card_code
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
            text: "سری",
            align: "center",
            //sortable: false,
            value: "source_document_series",
          },
          {
            text: "تعداد خط",
            align: "center",
            //sortable: false,
            value: "source_document_total_line",
          },
          {
            text: "تعداد قلم",
            align: "center",
            //sortable: false,
            value: "source_document_total_qty",
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
          },      
          {
            text:"شماره همگام",
            align: "center",
            //sortable: false,
            value: "equivalent_document_id",
          }
        
            ]
        },
        templates(){
            return this.$store.getters.getSyncTemplates;
        },
        mainDocument(){
            let selected = this.templates.find(item => item.id == this.options.selectedOption)
            console.log(this.templates)
            return selected.source_name;
        },
        equivalentDocument(){
            let selected = this.templates.find(item => item.id == this.options.selectedOption)
            return selected.equivalent_name
        },
        equivalentDocumentDescription(){
            let selected = this.templates.find(item => item.id == this.options.selectedOption)
            return selected.description
        },
        syncSourceDocs(){
            return this.$store.getters.getSyncSourceDocs;
        },
        itemCountSyncSources(){
            return this.$store.getters.getItemCountSyncSources;
        },
        isSelectedAnyOption(){
            return this.options.selectedOption > 0
        },
        isSelectedDocs(){
            return this.selectedDocs.length > 0
        }
    },
    watch:{
      options:{
        handler(){
        this.loadSyncSourceDocs();    
        },  deep: true
      }},
    methods:{
        updateMasterData(){
            this.isLoading = true;
            this.$store.dispatch('updateMasterDataSepidar').then(response => {
                this.isLoading = false
                this.showResultModal = true;
                this.message.success= response
            })
        },
        handleTableSelectionChange() {
            this.isOkForReady = this.selectedDocs.every(item => !item.is_synced && !item.equivalent_created )
            this.isOkForSync = this.selectedDocs.every(item => !item.is_synced && item.equivalent_created)
        },
        async getReady() {
            this.message.success = []
            this.message.failed = []
            this.isLoading = true;
            let docIds = this.selectedDocs.map(item => item.id)
            await this.$store.dispatch('getReadySources',docIds).then(response => {
                this.isLoading = false;
                this.showResultModal = true;
                this.message.success = response.success_results;
                this.message.failed = response.faild_in_update_src_results;
            })
            this.selectedDocs= []
            await this.loadSyncSourceDocs();
           
        },
        async getSync(){
            this.isLoading = true;
            this.message.success = []
            this.message.failed = []
            let docIds = this.selectedDocs.map(item => item.id)
            await this.$store.dispatch('getSyncSources',docIds).then(response => {
                this.isLoading = false;
                this.showResultModal = true;
                this.message.success = response.success_results;
                this.message.failed = response.faild_in_sync_results;
            })
            this.selectedDocs= []
            await this.loadSyncSourceDocs();
        },
        loadTemplates(){
            this.$store.dispatch('loadSyncTemplates')
        },
        submitUpdate(){
            this.isLoading = true;
            let payload = {templateId: this.options.selectedOption, date: this.updateStartDate}
            this.$store.dispatch('updateTemplate', payload).then(response =>{
                this.isLoading = false;
                this.showResultModal = true;
                if (response.is_success){
                    this.message.success= `عملیات با موفقیت انجام شد، تعداد ${response.created_or_updated_count} سند با موفقیت ایجاد شد یا به روز شد. در حال حاضر تغییرات جزییات سند بررسی نمی شود`
                }else{
                    this.message.failed= `ممکن است بخشی از عملیات کامل نشده باشد،تعداد ${response.created_or_updated_count} سند با موفقیت ایجاد شد یا به روز شد. در حال حاضر تغییرات جزییات سند بررسی نمی شود `
                }
            })
        },
        loadSyncSourceDocs(){
            this.$store.dispatch('loadSyncSourceDocuments', this.options)
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
    },
    created() {
      this.loadTemplates();
    }
}
</script>