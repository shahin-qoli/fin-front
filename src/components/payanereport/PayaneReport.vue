<template>
    <v-card outlined>
        <v-card-title>
            <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="جستجو"
            single-line
            hide-details
            ></v-text-field>
        </v-card-title>
        <v-data-table
        fixed-header
        dense
        :headers="headers"
        :items="payaneReports"
        item-key="id"
        :search="search"
        :loading="isLoading"
          >
        <template  v-slot:[`item.payane_code`]="props">
        {{ props.item.bank_payane.payane_code }}
        </template>
        <template  v-slot:[`item.visitor_name`]="props">
        {{ props.item.sale_person.name }}
        </template>
        <template  v-slot:[`item.b1_slpcode`]="props">
        {{ props.item.sale_person.b1_slpcode }}
        </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon
                small
                class="mr-2"
                @click="editItem(item)"
              >
                mdi-pencil
              </v-icon>
            </template>
        </v-data-table>
    </v-card>
</template>

<script>
    export default{
        data(){
        return{
            dialog: false,
            isLoading:null,
            search: '',
        }
    }
        ,
        methods:{
            loadPayaneReports() {
                // console.log(this)
                this.$store.dispatch('loadPayaneReports')
            }
        },
        computed:{
        headers(){
            return [
                {
                    text: "تاریخ",
                    align: "center",
                    value: "transaction_date",
                },
                {
                    text: "کد پایانه",
                    align: "center",
                    value: "payane_code",
                },                {
                    text: "نام ویزیتور",
                    align: "center",
                    value: "visitor_name",
                },
                {
                    text: "کد ویزیتور",
                    align: "center",
                    value: "visitor_b1_slpcode",
                },
                {
                    text: "مبلغ تجمیعی",
                    align: "center",
                    value: "sum",
                },
                {
                text: "",
                align: "center",
                //sortable: false,
                value: "actions",
                }

            ]
        },
        payaneReports(){
            return this.$store.getters.getPayaneReports
        },
    },
    created(){
        this.loadPayaneReports();
    }
    }

</script>
