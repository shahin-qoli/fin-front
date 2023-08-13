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
                        <v-btn dark color="green" href="">دانلود نمونه فایل</v-btn>
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
                            </v-col><v-col cols="12" >
                                    <v-select
                                    :items="banks"
                                    name="bank"
                                    label="نام بانک"
                                    solo
                                    item-text="name"
                                    item-value="id"
                                    v-model="bank_id"
                                    ></v-select>
                            </v-col>
                                    <v-select
                                    :items="bankAccounts"
                                    name="bankAccount"
                                    label="شماره حساب"
                                    solo
                                    item-text="owner_name"
                                    item-value="account_number"
                                    v-model="account_number"
                                    ></v-select>

                            <p v-if="uploadError" class="text-center">فایل بارگذاری شده مشکل دارد.</p>
                            <v-card-actions class="justify-center">
                                <v-btn :loading="isLoading" type="submit" dark color="green">ارسال</v-btn>
                            </v-card-actions>                
                    </v-form>  
                </v-card>    
            </v-col>
        </v-row>
    </v-container>
</template>
  


<script>

import {finAgent} from '@/services/agent'
   // import HelloWorld from '../components/HelloWorld'
    import FileSaver from 'file-saver'
    export default {
        data() {
            return {
                file: null,
                uploadError: false,
                isLoading: null,
                account_number: '',
                bank_id : null
            }
        },
      methods: {
        
        loadData() {
        // console.log(this)
        this.$store.dispatch('loadBankAccounts')
        this.$store.dispatch('loadBanks')
      },
        async submitForm(){
            this.uploadError= false
            if (!this.file) return;
            let formData = new FormData()
            this.isLoading = true;
            formData.append('file', this.file,this.file.name)
            try {
                const response = await finAgent.post(`/front/template_import/import_file?account_number=${this.account_number}&bank_id=${this.bank_id}`,formData, {responseType: 'blob'} );
                if (response.data.type === 'application/json') {
                    this.uploadError = true;
                    this.file = null;
                    this.isLoading = false;
                } else {
                    FileSaver.saveAs(response.data, this.file.name)
                    this.file = null;
                    this.isLoading = false;
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
        }
      },computed:{
        bankAccounts(){
            return this.$store.getters.getBankAccounts;
        },
        banks(){
            return this.$store.getters.getBanks;
        }
      },
      components: {
       // HelloWorld,
      },
    created(){
        this.loadData();
    }
    }
  </script>
  
<style scoped>
p {
    color: red;
    align-self: center;
}
</style>