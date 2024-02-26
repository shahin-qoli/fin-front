<template>
            <v-card v-if="order">
            <v-card-title>
                <v-row>
                    <v-col cols="12" class="d-flex justify-center align-center">
                        <h2>اطلاعات مشتری</h2>
                    </v-col>
                </v-row>               
            </v-card-title>
            <v-card-text>
                <v-row>
                    <v-col cols="4">
                        <v-text-field
                        :value="order.customer.cardCode"
                        label="کد"
                        ></v-text-field>    
                    </v-col>
                    <v-col cols="4">
                        <v-text-field
                        :value="order.customer.cardName"
                        label="نام"
                        ></v-text-field>    
                    </v-col>
                    <v-col cols="4">
                        <v-text-field
                        :value="order.customer.city"
                        label="شهر"
                        ></v-text-field>    
                    </v-col>
                    <v-col cols="4">
                        <v-text-field
                        :value="order.customer.groupName"
                        label="گروه مشتری"
                        ></v-text-field>    
                    </v-col>
                    <v-col cols="4">
                        <v-text-field
                        :value="order.customer.slpname"
                        label="ویزیتور"
                        ></v-text-field>    
                    </v-col>
                    <v-col cols="4">
                        <v-text-field
                        :value="order.order.docTime"
                        label="تاریخ فاکتور"
                        ></v-text-field>    
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>  
</template>

<script>
export default{
    props:{
        order: Object
    }
}
</script>
