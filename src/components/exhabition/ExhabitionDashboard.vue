<template>
    <v-container>
        <v-card outlined>
            <v-card-title><h1>داشبورد نمایشگاه</h1></v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <v-row >
                    <v-col cols="6">                  
                    <v-select
                    :items="customersData"
                    item-key="code"
                    item-text="name"
                    item-value="code"
                    solo
                    label="انتخاب مشتری"
                    v-model="selectedCustomer"
                    >
                    </v-select>
                </v-col>
                </v-row>
                <v-form @submit.prevent="validateCustomer">
                <v-row v-if="selectedCustomer">
                    
                    <v-col cols="6">                  
                        <v-text-field label="نام مشتری" :value="customersDetails.name" readonly></v-text-field>
                    </v-col>
                    <v-col cols="6"> 
                        <v-text-field label="کد" :value="customersDetails.code" readonly></v-text-field>
                    </v-col>
                    <v-col cols="6"> 
                        <v-text-field label="شهر" :value="customersDetails.city" readonly></v-text-field>
                    </v-col>
                    <v-col cols="6"> 
                        <v-text-field label="بدهی" :value="customersDetails.debt" readonly></v-text-field>
                    </v-col>
                    <v-col v-if="!isUserValid" cols="6">
                        <v-btn color="yellow" type="submit">اعتبار سنجی</v-btn>
                    </v-col>

                </v-row>
            </v-form>
            <v-col v-if="isUserValid" cols="6">
                        <v-btn color="green" @click="submitRequest">ثبت درخواست</v-btn>
                    </v-col>
            </v-card-text>
        </v-card>
        <div>
    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="snackbarTimeout">
      {{ snackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn text color="white" v-bind="attrs" @click="snackbar = false">بستن</v-btn>
      </template>
    </v-snackbar>
  </div>
    </v-container>
</template>

<script>
export default {
    data(){
        return{
            snackbar: false,
      snackbarText: 'موفقیت‌آمیز بود',
      snackbarColor: 'success', // You can change this to 'error', 'info', or 'warning'
      snackbarTimeout: 1000, // Adjust the timeout as needed
            selectedCustomer: null,
            selectedCustomer2: null,
            isUserValid: false
        }
    },
    methods:{
        validateCustomer(){
            setTimeout(() => this.snackbar = true, 500);
            this.isUserValid= true
        },
        submitRequest(){
            setTimeout(() => {this.selectedCustomer = null; this.isUserValid= false}, 500);
                    }
    },
    computed:{
        customersData(){
            return [
            {
                name: 'Customer 1',
                code: 'C5001'
            },
            {
                name: 'Customer 2',
                code: 'C5002'
            }
            ]
        },
        customersDetails(){
            return {
                name: 'آقای الکتریکی',
                code: 'C5003',
                city: 'تهران',
                debt: 30000000
            }
        }
    },
}
</script>