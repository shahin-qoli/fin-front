<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-card>
                    <v-card-text>
                        <v-row>
                            <v-col cols="4">
                                <v-select
                                v-model="options.selectedOption"
                                :items="templates"
                                item-text="title"
                                item-value="id"
                                label="لیست قالب ها"
                                solo
                                ></v-select>
                            </v-col>
                            <v-col v-if="isSelectedAnyOption" cols="4">
                                <v-text-field
                                :value="mainDocument"
                                label="سند مادر"
                                disabled
                                ></v-text-field>
                            </v-col>
                            <v-col v-if="isSelectedAnyOption" cols="4">
                                <v-text-field
                                :value="equivalentDocument"
                                label="سند معادل"
                                disabled
                                ></v-text-field>
                            </v-col>
                        </v-row>                       
                        <v-form v-if="isSelectedAnyOption" @submit.prevent="submitUpdate">
                            <v-row >
                                <v-col cols="3"  >
                                    <date-picker v-model="updateStartDate" label="تاریخ شروع"></date-picker>
                                </v-col>
                                <v-col cols="1">
                                    <v-btn dark color="green" type="submit">شروع به روزرسانی</v-btn>
                                </v-col>
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
                        <v-data-table
                        fixed-header
                        dense
                        :headers="headers"
                        :items="syncSourceDocs"
                        item-key="id"
                        :options.sync="options"
                        :server-items-length="itemCountSyncSources"
                        class="elevation-1"
                        >
                        <template v-slot:header="" >
                            <thead>
                            <tr>
                                <th colspan="6" align="center">سند مادر</th>
                                <th colspan="2">سند معادل</th>
                            </tr>
                            </thead>
                        </template>
                        <template v-slot:[`item.controls`]="props">
                         <v-btn  class="mx-2" small  @click="retryJob(props.item)">
                        <v-icon>mdi-check-outline</v-icon>
                        </v-btn>
                        </template>
                        <template v-slot:[`item.mainDocument`]="props">
                            <span>{{ JSON.stringify(props.item.mainDocument) }}</span>
                        </template>
                        <template v-slot:[`item.equivalentDocument`]="props">
                            <span>{{ JSON.stringify(props.item.equivalentDocument) }}</span>
                        </template>
                        </v-data-table>
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
            <v-card-title>Result</v-card-title>
            <v-card-text>{{ message }}</v-card-text>
            <v-card-actions>
            <v-btn color="primary" @click="showResultModal = false">OK</v-btn>
            </v-card-actions>
        </v-card>
        </v-dialog>

    </v-container>
</template>

<script>
import DatePicker from '../DatePicker.vue'
export default{
    components: {DatePicker},
    data() {
        return {
            options: {
          itemsPerPage: 10,
          page:1,
          selectedOption: 0
        },
            jobList:[1,2,3],
            // selectedOption: null,
            updateStartDate: null,
            message: '',
            raws:[],     
            isLoading: false,
            showResultModal: false,
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
            text: "نوع سند",
            align: "center",
            //sortable: false,
            value: "sync_template.source_name",
          },
          {
            text: "کد سند",
            align: "center",
            //sortable: false,
            value: "source_document_id",
          },
          {
            text: "سری سند",
            align: "center",
            //sortable: false,
            value: "source_document_series",
          },
          {
            text: "شماره سند",
            align: "center",
            //sortable: false,
            value: "source_document_number",
          },
          {
            text: "تاریخ سند",
            align: "center",
            //sortable: false,
            value: "source_document_date",
          },
          {
            text:"جمع سند",
            align: "center",
            //sortable: false,
            value: "source_document_total",
          },
          {
            text:"نوع سند",
            align: "center",
            //sortable: false,
            value: "sync_template.equivalent_name",
          },          {
            text:"شماره سند",
            align: "center",
            //sortable: false,
            value: "equivalent_document_id",
          }
        
            ]
        },
        templates(){
            return this.$store.getters.getSyncTemplates;
        },mainDocument(){
            let selected = this.templates.find(item => item.id == this.options.selectedOption)
            return selected.source_name;
        }, equivalentDocument(){
            let selected = this.templates.find(item => item.id == this.options.selectedOption)
            return selected.equivalent_name
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
    },
    watch:{
      options:{
        handler(){
        this.loadSyncSourceDocs();    
        },  deep: true
      }},
    methods:{
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
                    this.message= `عملیات با موفقیت انجام شد، تعداد ${response.created_or_updated_count} سند با موفقیت ایجاد شد یا به روز شد. در حال حاضر تغییرات جزییات سند بررسی نمی شود`
                }else{
                    this.message= `ممکن است بخشی از عملیات کامل نشده باشد،تعداد ${response.created_or_updated_count} سند با موفقیت ایجاد شد یا به روز شد. در حال حاضر تغییرات جزییات سند بررسی نمی شود `
                }
            })
        },
        loadSyncSourceDocs(){
            this.$store.dispatch('loadSyncSourceDocuments', this.options)
        }
    },
    created() {
      this.loadTemplates();
    }
}
</script>