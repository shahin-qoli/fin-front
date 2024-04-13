<template>
    <v-container>
        <v-row >
            <v-col cols="9">
                <v-card
                d
                class="mx-auto"      
                >
                    <v-spacer></v-spacer>
                    <v-toolbar dark color="gold">
                        <v-row>
                        <v-col cols="12">
                        <h3 class="text-center">ورود اطلاعات</h3>
                    </v-col>
                    </v-row>
                    </v-toolbar>
                    <v-divider/>
                    <v-col col="3">
                        <v-card-actions class="justify-center">
                        <v-btn dark color="green" href="https://backfinancial.burux.ir/api/front/b1_actions/get_inventory_transfer_template">دانلود نمونه فایل</v-btn>
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

                            
                            <v-card-actions class="justify-center">
                                <v-btn :loading="isLoading" :disabled="!isRequiredFieldsFilled" type="submit" dark color="green">ارسال</v-btn>
                            </v-card-actions>            
                            <p v-if="uploadError" class="text-center">{{ errorMessage }}</p>    
                            <p> {{ successResult }}</p>
                    </v-form>  
                </v-card>    
            </v-col>
        </v-row>
    </v-container>
</template>
  


<script>

import {finAgent} from '@/services/agent'
    export default {
        data() {
            return {
                file: null,
                uploadError: false,
                isLoading: null,
                errorMessage: '',
                successResult: ''
            }
        },
      methods: {
        
        async submitForm(){
            this.uploadError= false
            this.successResult= ''
            this.errorMessage = ''
            if (!this.file) return;
            if (!this.isRequiredFieldsFilled) return;
            let formData = new FormData()
            this.isLoading = true;
            formData.append('file', this.file,this.file.name)
            try {
                const response = await finAgent.post(`/front/b1_actions/create_inventory_transfer`,formData );
                console.log(response.data)
                if (response.data.error) {
                    this.uploadError = true;
                    this.file = null;
                    this.isLoading = false;
                    this.errorMessage= response.data.error
                } else {
                    console.log(response.data.result)
                    this.successResult = response.data.result
                    this.file = null;
                    this.isLoading = false;
                }


            } catch (err){
                this.uploadError = true;
                    this.file = null;
                    this.isLoading = false;
                    this.errorMessage= err.response.data.error

            }
        }
      },
      computed:{
        isRequiredFieldsFilled() {
        return this.file 
        }
      },

    }
  </script>
  
<style scoped>
p {
    color: red;
    align-self: center;
}
</style>
