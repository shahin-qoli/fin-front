
<template>
    <v-container>
        <v-row >
            <v-col cols="9">
                <v-card
                d
                class="mx-auto"      
                >
                        <v-card-title class="justify-center">ورود اطلاعات کارتخوان</v-card-title>
                        <v-divider/>
                        <v-col col="3">
                        <v-card-actions class="justify-center">
                        <v-btn dark color="gold" href="http://192.168.142.128:3400/admin/card_to_card_raws/import/get_template">دانلود نمونه فایل</v-btn>
                         </v-card-actions>
                       </v-col>
                       <v-divider/>
                        <v-form @submit.prevent="submit"> 
                            <v-col
                            cols="12">
                            <v-file-input
                                accept="excel/*"
                                label="بارگذاری فایل"
                                v-model="file"
                            />
                            </v-col>
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
                    <v-card-title class="justify-center">لیست کارتخوان ها</v-card-title>
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
    import axios from 'axios';

    export default {   
        data(){
            return{
                file: null,
            }
        },
        components: {
        // HelloWorld,
        },
        methods: {
            submit() {
                console.log(this.file)
                if (this.file){
                    let dataImport = new FormData();
                    dataImport.append("file", this.file, this.file.name);
                    axios.post(`http://192.168.142.128:3400/api/card_to_card_raws/import_file`,dataImport).then(response => {
                     console.log("Success!");
                     console.log({ response });
                    
                      }).catch(error => {
                console.log({ error });
            });
            } else {
        console.log("there are no files.");
    }
        }
    }
}
  </script>
  