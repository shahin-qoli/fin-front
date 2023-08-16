<template>
    <div>
        <v-menu
        ref="menu"
        v-model="menu"
        :close-on-content-click="false"
        :return-value.sync="date"
        transition="scale-transition"
        offset-y
        min-width="190px"
        >
            <template v-slot:activator="{on, attrs}">
                <v-text-field
                v-model="date"
                readonly
                v-bind="attrs"
                v-on="on"
                :label="label"
                ></v-text-field>
            </template>
            <date-picker
                @change="submit"
                v-model="date"
                append-to="body"
                format="YYYY-MM-DD"
                input-format="jYYYY/jMM/jDD"
                displayFormat="jYYYY/jMM/jDD"
                :label="label">
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
                <v-btn text color="primary" @click="submit">OK</v-btn>
            </date-picker>
        </v-menu>
    </div>
</template>

<script>
import VuePersianDatetimePicker from 'vue-persian-datetime-picker'
export default{
    // emits:['ret-date'],
    props:['value', 'label'],
    data(){
        return{
            menu: false,
            date: this.value,
            content: this.value
        }
    },
    methods:{
        submit(){
            this.$refs.menu.save(this.date)
            this.$emit('input', this.date)
        }
    },
  components: {
    datePicker: VuePersianDatetimePicker
  }
}
</script>

<style scoped>
.custom-date-picker {
  height: 300px; /* Adjust the height as per your requirement */
}
</style>