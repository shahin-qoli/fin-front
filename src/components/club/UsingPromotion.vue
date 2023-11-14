<template>
    <div>
        <v-card>
            <v-from submit.perevent="submit">
            <v-row class="ma-0" align="center">
                <v-col cols="4">
                    <v-text-filed label="کد مشتری" v-model="cardCode"></v-text-filed>
                </v-col>
                <v-col cols="4">
                    <v-text-filed label="شماره سفارش" v-model="b1doc"></v-text-filed>
                </v-col>
                <v-col cols="4">
                    <v-text-filed label="کد تخفیف" v-model="PromoCode"></v-text-filed>
                </v-col>
                <v-col cols="4">
                    <v-btn type="submit"></v-btn>
                </v-col>
            </v-row>
        </v-from>
        </v-card>
        <v-dialog v-model="okModal" max-width="500">
            <v-card>
                <v-card-title class="text-h5">نتیجه</v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12">                
                            <div class="modal-scroll">
                            <p>با موفقیت انجام شد</p>
                            </div>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                <v-btn color="primary" text @click="okModal = false">بستن</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>


<script>
import {finAgent} from '@/services/agent'
export default{
    data(){
        return{
            promotions: [],
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
                payload ={b1doc: this.b1doc, used_by: this.cardCode,code: this.PromoCode}
                const response = await finAgent.post(`/v2/promotion_code/use_coupon`,payload).then((response) => {
                    if (response.status ==  200){
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
        }
    }
}
</script>
