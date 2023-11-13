<template>
    <v-container>
        <v-card>
            <v-card-text>
                <v-form>
                    <v-row>
                        <v-col cols="4">
                            <v-text-field 
                            label="شماره موبایل"
                            v-model="mobileNumber">
                            </v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field 
                            label="کد مشتری- c50000"
                            v-model="cardCode">
                            </v-text-field>
                        </v-col>
                        <v-col v-if="customer.id" cols="4">
                            <v-text-field 
                            label="نام مشتری"
                            v-model="customer.cardName">
                            </v-text-field>
                        </v-col>
                        <v-col v-if="customer.id" cols="4">
                            <v-file-input
                                accept="image/*"
                                label="بارگذاری فایل"
                                v-model="file"
                            />
                        </v-col>
                        <v-col cols="4">
                            <v-card-actions class="justify-center">
                                <v-btn v-if="!customer.id" :loading="isLoading" @click="submitFindCustomer" dark color="green">جستجو</v-btn>
                                <v-btn v-if="customer.id" :loading="isLoading" @click="submitUploadForm" dark color="yellow">بارگذاری</v-btn>
                            </v-card-actions> 
                        </v-col>

                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
        <v-dialog v-model="notFoundModal" max-width="500">
            <v-card>
                <v-card-title class="text-h5">نتیجه</v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12">                
                            <div class="modal-scroll">
                            <p v-html="errorMessage"></p>
                            </div>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                <v-btn color="primary" text @click="notFoundModal = false, errorMessage = ''">بستن</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container> 
</template>
<script>
import {finAgent} from '@/services/agent'
export default {
    data() {
        return {
            file: null,
            mobileNumber: '',
            cardCode: '',
            customer: {
                id: null,
                cardCode: null,
                cardName: null,
            },
            notFoundModal: false,
            errorMessage:'',
            isLoading: false,
        }
    },
    methods:{
        async submitUploadForm(){
            if (!this.file) return;
            let formData = new FormData()
            this.isLoading = true;
            console.log("customer:", this.customer)
            let userId = this.customer.id
            formData.append('file', this.file,this.file.name)
            //move to store
            try {
                const response = await finAgent.post(`/v2/club_user_data/upload_image?user_id=${userId}`,formData );
                if (response.status == 200) {
                    this.notFoundModal = true;
                    this.errorMessage = "با موفقیت انجام شد"
                    this.isLoading = false;
                    this.refreshData();
   
                } else {
                    this.notFoundModal = true;
                    this.file = null;
                    this.isLoading = false;
                    this.errorMessage = "مشکلی پیش آمده است. لطفا دوباره تلاش کنید"
                    this.refreshData();
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
        async submitFindCustomer(){
            try {
                console.log("go to find")
                const response = await finAgent.get(`/v2/club_user_data/find_customer_for_image?mobile_number=${this.mobileNumber}&card_code=${this.cardCode}` );
                console.log(response.data.id)
                if (response.status == 200) {
                    this.customer = {id: response.data.id, cardCode: response.data.card_code, cardName: response.data.card_name};
                    this.isLoading = false;
                } else {
                    this.notFoundModal = true;
                    this.isLoading = false;
                    this.errorMessage = response.data.error || 'مشتری یافت نشد.';
                }

            } catch (err){ 
                this.notFoundModal = true;
                    this.errorMessage = err.response.data.error || 'Failed to fetch';
                    this.isLoading = false;

            }
        }
        ,
        refreshData(){
            this.file= null;
            this.mobileNumber = null;
            this.cardCode = null;
            this.isLoading = false;
            this.customer = {
                id: null,
                cardCode: null,
                cardName: null,
            };
    }
}
}
</script>
