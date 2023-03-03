<template>
    <div>
        <v-container v-if="item.is_used==true" fluid style="margin: 0px; padding: 0px; width: 100%">
          <v-row dense >
            <v-col cols="1" >
              <p> کد مشتری :</p>
              <!-- <v-text-field > {{item.transaction_date}}</v-text-field> -->
            </v-col>
            <v-col cols="1" >
            {{ getCardcode(item) }}
          </v-col>
          </v-row>
        </v-container>
        <v-container v-if="item.is_used==false">
          <v-form  @submit.prevent="submitForm(item,cardcode)">
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="cardcode" hint="c50000" label="کد مشتری"> </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-btn dark color="green" type="submit">استفاده تراکنش</v-btn>
              </v-col>
            </v-row>
        </v-form>
        </v-container>
    </div>
</template>

<script>
export default{
    emits: ['use-row'],
    methods:{
                getCardcode(up){
        
        // const ups = JSON.parse(up);
        console.log("HERE")
        console.log(up)
        return up.used_payments[0].used_for
      },
        submitForm(item,cardcode) {
            const obj = {item: item, cardcode:cardcode}
            this.$emit('use-row', obj)
        }
    },
    data(){return {
        cardcode: null
    } 
       
    },
    props: {
        item: {}
    }
}
</script>
