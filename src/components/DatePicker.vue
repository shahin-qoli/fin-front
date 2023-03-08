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
                label="تاریخ تراکنش"
                readonly
                v-bind="attrs"
                v-on="on"
                ></v-text-field>
            </template>
            <v-date-picker
                no-title
                scrollable
                close
                width="190"
                class="mt-4"
                locale="fa-IR"
                :first-day-of-week="6"
                v-model="date"
                hint="6273" 
                label="تاریخ تراکنش">
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
                <v-btn text color="primary" @click="submit">OK</v-btn>
            </v-date-picker>
        </v-menu>
    </div>
</template>

<script>

export default{
    // emits:['ret-date'],
    props:['value'],
    data(){
        return{
            menu: false,
            date: new Date().toISOString().substr(0, 10),
            content: this.value
        }
    },
    methods:{
        submit(){
            this.$refs.menu.save(this.date)
            this.$emit('input',this.date)
        }
    }
}
</script>
