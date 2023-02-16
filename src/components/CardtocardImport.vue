<template>
    <v-container>
        <v-row >
            <v-col cols="9">
                <v-card
                d
                class="mx-auto"      
                >
                        <v-card-title class="justify-center">ورود اطلاعات کارت به کارت</v-card-title>
                        <v-divider/>
                        <v-col col="3">
                        <v-card-actions class="justify-center">
                        <v-btn dark color="gold" href="https://burux.ir">دانلود نمونه فایل</v-btn>
                         </v-card-actions>
                       </v-col>
                       <v-divider/>
                        <v-form > 
                            <v-col
                            cols="12">
                            <v-file-input
                                accept="excel/*"
                                label="بارگذاری فایل"
                            />
                            </v-col>
                            <v-card-actions class="justify-center">
                                <v-btn dark color="green">ارسال</v-btn>
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
                    <v-card-title class="justify-center">لیست کارت به کارت ها</v-card-title>
                    <v-card-actions class="justify-center">
                    <v-btn dark color="green" href="/cardtocardlist" >مشاهده</v-btn>            
                </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
  


<script>
   // import HelloWorld from '../components/HelloWorld'
  
    export default {
  
      components: {
       // HelloWorld,
      },
    }
  </script>
  