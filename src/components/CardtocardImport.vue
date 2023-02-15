<template>
    <v-container>
        <v-row >
            <v-col cols="9">
                <v-card
                class="mx-auto"
                prepend-icon="mdi-home"          
                >
                    <v-card-item>
                        <v-card-title class="justify-center">ورود اطلاعات کارت به کارت</v-card-title>
                        <v-btn href="https://burux.ir">دانلود نمونه فایل</v-btn>
                        <v-form v-model="valid">
                                <v-container>
                                    <v-row>
                                        <v-col
                                        cols="12">
                                        <v-file-input
                                            accept="excel/*"
                                            label="File input"
                                        />
                                       </v-col>
                                        <v-card-actions class="justify-center">
                                            <v-btn flat>Submit</v-btn>
                                        </v-card-actions>
                                    </v-row>
                                </v-container>
                        </v-form>
                    </v-card-item>    
                </v-card>    
            </v-col>
            <v-col cols="9">
                <v-card
                class="mx-auto"
                prepend-icon="mdi-home"          
                > 
                <v-card-item>
                    <v-card-title class="justify-center">لیست کارت به کارت ها</v-card-title>
                    <v-btn href="#">مشاهده</v-btn>
                </v-card-item>
                
                
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
  