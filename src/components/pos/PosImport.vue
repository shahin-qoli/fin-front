
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
                        <v-btn dark color="green" href="http://192.168.1.80:3400/admin/card_to_card_raws/import/get_template">دانلود نمونه فایل</v-btn>
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
                                <v-btn type="submit" dark color="green">ارسال</v-btn>
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
                    <v-btn dark color="green" href="/poslist" >مشاهده همه کارتخوان ها</v-btn>  
                    <v-btn dark color="green" href="/posusedlist" > مشاهده کارتخوان های استفاده شده</v-btn>          
                </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
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
                uploadError: false
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
            formData.append('file', this.file,this.file.name)
            console.log('start')
            try {
                const response = await finAgent.post('/pos_raws/import_file',formData, {responseType: 'blob'} );
                console.log('finish')
                console.log(response.data.type)
                if (response.data.type === 'application/json') {
                    this.uploadError = true;
                    this.file = null;
                } else {
                    FileSaver.saveAs(response.data, this.file.name)
                    this.file = null;
                }


            } catch (err){
                const error = new Error(
                    
                    err.response.data.error || 'Failed to fetch'
                );
                throw error;
            }
        }
          
    }
}
  </script>
  