<template>
    <v-container>
        <v-card>
            <v-row class="ma-0" align="center">
                <v-col cols="4">
                    <v-text-field class="border" label="کد مشتری" v-model="cardCode"></v-text-field>
                </v-col>
                <v-col cols="4">
                    <v-text-field label="شماره سفارش" v-model="b1doc"></v-text-field>
                </v-col>
                <v-col cols="4">
                    <v-text-field label="کد تخفیف" v-model="PromoCode"></v-text-field>
                </v-col>
                <v-col cols="4">
                    <v-btn @click="submit">ثبت</v-btn>
                </v-col>
            </v-row>
        </v-card>
        <v-dialog v-model="okModal" max-width="500">
            <v-card>
                <v-card-title class="text-h5">نتیجه</v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12">                
                            <div class="modal-scroll">
                            <p>{{ errorMessage }}</p>
                            </div>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                <v-btn color="primary" text @click="refreshData">بستن</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>


<script>
import {finAgent} from '@/services/agent'
export default{
    data(){
        return{
            cardCode:'',
            PromoCode:'',
            b1doc:'',
            okModal: false,
            errorModal: false,
            errorMessage: '',
        }
    },
    methods: {
        async submit(){
            try { 
                let payload ={b1doc: this.b1doc, used_by: this.cardCode,code: this.PromoCode}
                await finAgent.post(`/v2/promotion_code/use_coupon`,payload).then((response) => {

                    if (response.data.state > 0){
                        this.okModal = true;
                        this.errorMessage= "با موفقیت انجام شد."
                    }else{
                        this.okModal = true;
                        this.errorMessage= response.data.error
                    }
                })

            }             catch(err){
                const error = new Error(
                    err || 'Failed to fetch'
                );
                throw error;
            }
        },
        refreshData(){
            this.cardCode ='',
            this.PromoCode ='',
            this.b1doc ='',
            this.okModal= false,
            this.errorMessage= ''
        }
    }
}
</script>
