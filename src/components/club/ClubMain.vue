<template>
    <v-container>
        <v-card outlined>
            <v-card-text>
                
                    <v-form @submit.prevent="submitForm">
                        <v-row>
                        <v-col cols="5">
                            <v-text-field
                            label="شماره موبایل"
                            v-model="mobileNumber"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-btn type="submit" color="purple">جستجو</v-btn>
                        </v-col>
                    </v-row>
                    </v-form>
                
            </v-card-text>
        </v-card>
        <v-card v-if="reportData">
            <v-card-text>
                <v-row>
                    <v-col cols="4">
                <v-text-field
                :value="reportData.points.point1"
                label="امتیاز 1 میلیون خرید نقدی"
                disabled
                ></v-text-field>
            </v-col>
            <v-col cols="4">
                <v-text-field
                :value="reportData.points.point2"
                label="امتیاز 1 میلیون خرید"
                disabled
                ></v-text-field>
            </v-col>
            <v-col cols="4">
                <v-text-field
                :value="reportData.points.point3"
                label="امتیاز خرید محصول بالای 2 میلیون تومن"
                disabled
                ></v-text-field>
            </v-col>
            <v-col cols="6">
                <v-text-field
                :value="reportData.data.order"
                label="جزییات فاکتورها"
                disabled
                ></v-text-field>
            </v-col>
            <v-col cols="6">
                <v-text-field
                :value="reportData.data.lines"
                label="جزییات خط فاکتورها"
                disabled
                ></v-text-field>
            </v-col>
            <v-col cols="6">
                <v-btn color="red" @click="reportData = null,reportData=null,mobileNumber=''" >بستن</v-btn>
            </v-col>
            </v-row>
            </v-card-text>
        </v-card>
        <v-dialog v-model="errorModal" max-width="500">
            <v-card>
                <v-card-title class="text-h5">خطا</v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12">                
                            <div class="modal-scroll">
                            <p v-html="errorData"></p>
                            </div>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                <v-btn color="primary" text @click="errorModal = false, errorData = ''">بستن</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
export default {
    data(){
        return {
            mobileNumber: '',
            reportData:null,
            errorData: null,
            errorModal: false,
        }
    },
    methods:{
        submitForm(){
            this.$store.dispatch('findClubReport', this.mobileNumber).then((response) => {
                console.log(response)
                if (response.success){
                    this.reportData = response.result
                }
                else{                   
                    this.errorData = "شماره وارد شده صحیح نیست"
                    this.errorModal= true}
            })
        }
    },
    computed:{

    },

}
</script>
