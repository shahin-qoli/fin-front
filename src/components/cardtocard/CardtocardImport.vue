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
                         <h3 class="text-center">ورود اطلاعات کارت به کارت</h3>
                        </v-col>
                        </v-row>
                      </v-toolbar>
                        <v-divider/>
                        <v-col col="3">
                        <v-card-actions class="justify-center">
                        <v-btn dark color="green" href="http://192.168.127.215:3400/admin/pos_raws/import/get_template">دانلود نمونه فایل</v-btn>
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
                         <h3 class="text-center">لیست کارت به کارت ها</h3>
                        </v-col>
                        </v-row>
                      </v-toolbar>
                    <v-card-actions class="justify-center">
                    <v-btn dark color="green" to="/cardtocardlist" >مشاهده همه کارت به کارت ها</v-btn>  
                    <v-btn dark color="green" href="/cardtocardusedlist" > مشاهده کارت به کارت های استفاده شده</v-btn>          
                </v-card-actions>
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
                isLoading: null
            }
        },
      methods: {
        async submitForm(){
            this.uploadError= false
            if (!this.file) return;
            let formData = new FormData()
            this.isLoading = true;
            formData.append('file', this.file,this.file.name)
            console.log('start')
            try {
                const response = await finAgent.post('/front/card_to_card_raws/import_file',formData, {responseType: 'blob'} );
                console.log('finish')
                console.log(response.data.type)
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
      },
      components: {
       // HelloWorld,
      },
    }
  </script>
  
<style scoped>
p {
    color: red;
    align-self: center;
}
</style>