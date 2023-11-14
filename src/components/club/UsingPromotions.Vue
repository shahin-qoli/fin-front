<template>
    <v-container>
        <v-card>
            <v-from submit.perevent="submit">
            <v-row class="ma-0" align="center">
                <v-col cols="4">
                    <v-text-filed label="کد مشتری" v-model="cardCode"></v-text-filed>
                </v-col>
                <v-col cols="4">
                    <v-text-filed label="شماره سفارش" v-model="OrderNumber"></v-text-filed>
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
    </v-container>
</template>

<script>
import {finAgent} from '@/services/agent'
export default{
    data(){
        return{
            promotions: []
        }
    }
    methods: {
        async submit(){

        }
    }
}
</script>
