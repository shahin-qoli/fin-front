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
        :items="salePersons"
        item-key="id"
        :search="search"
        :loading="isLoading"
          >
        </v-data-table>
    </v-card>
</template>

<script>
    export default{
        computed:{
        headers(){
            return [
                {
                    text: "نام",
                    align: "center",
                    value: "name",
                },
                {
                    text: "کد بی وان",
                    align: "center",
                    value: "b1_code",
                }
            ]
        }
    }
    }

</script>
