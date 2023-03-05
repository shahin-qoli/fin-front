<template>
    <v-container>
    <v-row>  
        <v-col cols="6">
    <use-cardtocard></use-cardtocard>
</v-col>
<v-col cols="6">
    <use-pos></use-pos>
    </v-col>
</v-row>  
</v-container>
</template>


<script>
import UseCardtocard from './UseCardtocard.vue'
import UsePos from "./UsePos.vue"
export default{
    components:{
        UseCardtocard,
        UsePos
    }
}
</script>
