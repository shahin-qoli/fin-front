
<template>
    <v-container>
        <v-row >
            <v-col cols="9">
                <v-card
                d
                class="mx-auto"      
                >
                  
                        <v-toolbar dark color="gold">
                            <v-row>
                            <v-col cols="12">
                         <h3 class="text-center">ورود اطلاعات کارتخوان</h3>
                        </v-col>
                        </v-row>
                      </v-toolbar>
                        <v-divider/>
                        <v-col col="3">
                        <v-card-actions class="justify-center">

                        <v-btn dark color="green" href="#">دانلود نمونه فایل</v-btn>

                         </v-card-actions>
                       </v-col>
                       <v-divider/>
                        <v-form @submit.prevent="submitForm"> 
                            <v-col
                            cols="12">
                            <v-file-input
                                accept="excel/*"
                                label="بارگذاری فایل"
                                v-model="file"
                            />
                            </v-col>
                            <p v-if="uploadError" class="text-center">فایل بارگذاری شده مشکل دارد.</p>
                            <v-card-actions class="justify-center">
                                <v-btn :loading="isLoading" type="submit" dark color="green">ارسال</v-btn>
                            </v-card-actions>                
                    </v-form>  
                </v-card>    
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="9">
                <v-card
                class="mx-auto"
                prepend-icon="mdi-home"  
                name="list"        
                > 
                    <v-toolbar dark color="gold">
                        <v-row>
                            <v-col cols="12">
                            <h3 class="text-center">لیست کارتخوان ها</h3>
                        </v-col>
                        </v-row>
                    </v-toolbar>               
                    <v-card-actions class="justify-center">
                        <v-btn dark color="green" to="/poslist" >مشاهده همه کارتخوان ها</v-btn>
                        <v-btn dark color="green" @click="updateReport" >به‌روزرسانی گزارش صندوق
                            <v-progress-circular
                            v-if="loadingUpdate"
                            indeterminate
                            color="primary"
                            >
                            </v-progress-circular>
                        </v-btn>           
                    </v-card-actions>
                    <p v-if="updateError" class="text-center">به روز رسانی به مشکل خورد. با مدیر سیستم تماس بگیرید.</p>
                </v-card>
            </v-col>
        </v-row>
<!-- Modal -->
        <v-dialog v-model="showModal" max-width="500">
        <v-card>
            <v-card-title class="text-h5">Result</v-card-title>
            <v-card-text>
            <div class="modal-scroll">
                <p v-html="reportResult"></p>
            </div>
            </v-card-text>
            <v-card-actions>
            <v-btn color="primary" text @click="showModal = false">Close</v-btn>
            </v-card-actions>
        </v-card>
        </v-dialog>
    </v-container>
</template>
  


<script>
   // import HelloWorld from '../components/HelloWorld'
   
    import { finAgent } from '@/services/agent';
    import FileSaver from 'file-saver'

    export default {   
        data(){
            return{
                file: null,
                uploadError: false,
                updateError: false,
                isLoading: null,
                loadingUpdate: false,
                showModal: false,
                reportResult: '',
            }
        },
        components: {
        // HelloWorld,
        },
        methods: {
            async submitForm(){
            this.uploadError= false
            if (!this.file) return;
            let formData = new FormData()
            this.isLoading= true;
            formData.append('file', this.file,this.file.name)
            console.log('start')
            try {
                const response = await finAgent.post('/front/pos_raws/import_file',formData, {responseType: 'blob'} );
                console.log('finish')
                console.log(response.data.type)
                if (response.data.type === 'application/json') {
                    this.uploadError = true;
                    this.file = null;
                    this.isLoading = false;
                } else {
                    FileSaver.saveAs(response.data, this.file.name)
                    this.file = null;
                    this.isLoading = false
                }


            } catch (err){
                const error = new Error(
                    
                    err.response.data.error || 'Failed to fetch'
                );
                this.uploadError = true;
                    this.file = null;
                    this.isLoading = false;
                throw error;

            }
        },
        async updateReport(){
            try {
                this.loadingUpdate = true;
                const {data:responseData} = await finAgent.get('/front/pos_payane_reports/update_report' );
                console.log('finish')
                console.log(responseData.error)
                if (responseData.error == "") {
                    this.loadingUpdate = false;
                    this.showModal = true; // Show the modal
                    const details = responseData.results.map(result => {
                    return `Transaction Date: ${result.transaction_date}, Payane Code: ${result.payane_code}`;
                      });
                    this.reportResult = `تعداد ردیف های گزارش شده : ${responseData.updated_count} و جزییات شامل : ${details.join(', ')}`;
                }
            } catch (err){
                const error = new Error(               
                    err.response.data.error || 'Failed to fetch'
                );
                this.updateError = true;
                this.loadingUpdate = false;
                throw error;

            }
        }
          
    }
}
  </script>
  
  <style scoped>
p {
    color: red;
    align-self: center;
}
.modal-scroll {
  max-height: 300px; /* Adjust the height as needed */
  overflow-y: auto;
}
</style>