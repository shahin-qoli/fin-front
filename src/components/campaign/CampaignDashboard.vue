<template>
    <v-sheet>
        <v-row>
            <v-col class="d-flex justify-center align-center">
                <h1>کمپین</h1>
            </v-col>
        </v-row>
        <v-sheet>
        <v-row>
            <v-col cols="12">
                <v-expansion-panels>
                    <v-expansion-panel>
                        <v-expansion-panel-header>
                           <h3>کلیات کمپین</h3> 
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-expansion-panels>
                                <v-expansion-panel>
                                    <v-expansion-panel-header>
                                        <h4>تنظیمات کلی</h4>
                                    </v-expansion-panel-header>
                                    <v-expansion-panel-content>
                                        <v-row>
                                            <v-col cols="3">
                                                <v-text-field
                                                v-model="camName"
                                                label="نام"></v-text-field>
                                            </v-col>
                                            <v-col cols="3">
                                                <date-picker v-model="camStartDate"
                                                label="تاریخ شروع"></date-picker>
                                            </v-col>
                                            <v-col cols="3">
                                                <date-picker v-model="camEndDate"
                                                label="تاریخ پایان"></date-picker>
                                            </v-col>
                                            <v-col cols="3">
                                                <v-text-field
                                                v-model="camB1CampaignId"
                                                label="B1CampaignId"></v-text-field>
                                            </v-col>
                                            <v-col cols="3">
                                                <v-checkbox
                                                v-model="camActive"
                                                label="فعال"
                                                ></v-checkbox>
                                            </v-col>
                                            <v-col cols="3">
                                                <v-text-field
                                                label="نوع"
                                                v-model="camType"></v-text-field>
                                            </v-col>
                                        </v-row>
                                    </v-expansion-panel-content>
                                </v-expansion-panel>
                                <v-expansion-panel>
                                    <v-expansion-panel-header>
                                        <h4>تنظیمات محدودیت</h4>
                                    </v-expansion-panel-header>
                                    <v-expansion-panel-content>
                                        <v-row>
                                            <v-col cols="6">
                                                <v-textarea
                                                v-model="camCardCodes"
                                                label="کد مشتریان"></v-textarea>
                                            </v-col>
                                            <v-col cols="6">
                                                <v-textarea
                                                v-model="camCardGroups"
                                                label="گروه مشتریان"></v-textarea>
                                            </v-col>                                            
                                        </v-row>
                                    </v-expansion-panel-content>
                                </v-expansion-panel>   
                                <v-expansion-panel>
                                    <v-expansion-panel-header>
                                        <h4>کلیات تخفیف</h4>
                                    </v-expansion-panel-header> 
                                    <v-expansion-panel-content>
                                        <v-row>
                                            <v-col cols="3">
                                                <v-text-field label="تخفیف پایه" v-model="camBaseDis"></v-text-field>
                                            </v-col>
                                            <v-col cols="9">
                                                <v-text-field label="قواعد تخفیف" v-model="camDisRelation"></v-text-field>
                                            </v-col>                                            
                                        </v-row>
                                    </v-expansion-panel-content>                                  
                                </v-expansion-panel>       
                                <v-expansion-panel>
                                    <v-expansion-panel-header>
                                        <h4>جزییات تخفیف</h4>
                                    </v-expansion-panel-header>   
                                    <v-expansion-panel-content>
                                        <v-row >
                                            <v-col ma-2 cols="6">
                                                <v-card outlined>
                                                    <v-card-text>
                                                    <v-row>
                                                        <v-col cols="12" class="d-flex justify-center align-center">
                                                            <p>تخفیف تعداد خطوط</p>
                                                        </v-col>
                                                        <v-col cols="4">
                                                            <v-text-field label="حداقل خط" v-model="camMinRow"></v-text-field>
                                                        </v-col>
                                                        <v-col cols="4">
                                                            <v-text-field label="حداکثر خط" v-model="camMaxRow"></v-text-field>
                                                        </v-col>
                                                        <v-col cols="4">
                                                            <v-text-field label="تخفیف هر خط" v-model="camPerRowDis"></v-text-field>
                                                        </v-col>
                                                        <v-col cols="4">
                                                            <v-text-field label="سقف تخفیف" v-model="camMaxRowDis"></v-text-field>
                                                        </v-col>
                                                    </v-row></v-card-text>
                                                </v-card>
                                            </v-col>
                                            <v-col calss="d-flex" cols="6">
                                                <v-card outlined>
                                                    <v-card-text>
                                                    <v-row>
                                                        <v-col cols="12" class="d-flex justify-center align-center">
                                                            <p>تخفیف مبلغ کل</p>
                                                        </v-col> 
                                                        <v-col cols="4">
                                                            <v-text-field label="حداقل مبلغ" v-model="camMinValue"></v-text-field>
                                                        </v-col>
                                                        <v-col cols="4">
                                                            <v-text-field label="حداکثر مبلغ" v-model="camMaxValue"></v-text-field>
                                                        </v-col>
                                                        <v-col cols="44">
                                                            <v-text-field label="مبلغ پله" v-model="camPerValueStep"></v-text-field>
                                                        </v-col>
                                                        <v-col cols="4">
                                                            <v-text-field label="تخفیف هر پله" v-model="camPerStepDis"></v-text-field>
                                                        </v-col>
                                                        <v-col cols="4">
                                                            <v-text-field label="سقف تخفیف" v-model="camMaxValueDis"></v-text-field>
                                                        </v-col> 
                                                    </v-row>      
                                                    </v-card-text>    
                                                </v-card>   

                                            </v-col>
                                            <v-col cols="3">
                                                <v-text-field v-model="camMaxAllDis" label="سقف کلی تخفیف"></v-text-field>
                                            </v-col>
                                        </v-row>
                                    </v-expansion-panel-content>                                
                                </v-expansion-panel> 
                                <v-expansion-panel>
                                    <v-expansion-panel-header>
                                        <h4>کانال فروش</h4>
                                    </v-expansion-panel-header>
                                    <v-expansion-panel-content>
                                        <v-row>
                                            <v-col cols="4">
                                                <v-text-field v-model="camChannelDis" label="تخفیف کانال"></v-text-field>
                                            </v-col>
                                        </v-row>
                                    </v-expansion-panel-content>                                    
                                </v-expansion-panel>     
                                <v-expansion-panel>
                                    <v-expansion-panel-header>
                                        <h4>پورسانت و بی وان</h4>
                                    </v-expansion-panel-header>  
                                    <v-expansion-panel-content>
                                        <v-row>
                                        <v-col cols="3">
                                                <v-checkbox
                                                v-model="camCanHaveB1Dis" label="CanHaveB1Dis"></v-checkbox>
                                        </v-col>
                                        <v-col cols="3">
                                                <v-select :items="settleTypes" label="روش پرداخت" v-model="camSettleType"></v-select>
                                        </v-col>
                                        <v-col cols="3">
                                                <v-text-field v-model="camCommissionEff" label="تاثیر روی پورسانت"></v-text-field>
                                            </v-col>
                                            <v-col cols="3">
                                                <v-text-field v-model="camB1PriceList" label="لیست قیمت بی وان"></v-text-field>
                                            </v-col>
                                        </v-row>
                                    </v-expansion-panel-content>                              
                                </v-expansion-panel>                                                 
                            </v-expansion-panels>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                    <v-expansion-panel>
                        <v-expansion-panel-header>
                            <h3>جزییات کمپین</h3>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-card outlined>
                                <v-card-title>
                                    <h4>خط فاکتور</h4>
                                </v-card-title>
                                <v-card-text>
                                    <v-form @submit.prevent="addRow">
                                        <v-row>
                                            <v-col cols="6">
                                                <v-autocomplete
                                                :items="itemCodes"
                                                v-model="row.itemCodes"
                                                label="کد کالا"></v-autocomplete>
                                            </v-col>
                                            <v-col cols="6">
                                                <v-autocomplete
                                                :items="itemGroups"
                                                v-model="row.itemGroups"
                                                label="گروه کالا"></v-autocomplete>
                                            </v-col>
                                            <v-col cols="3">
                                                <v-text-field                                
                                                v-model="row.taxon"
                                                label="تکسون کالا"></v-text-field>
                                            </v-col>
                                            <v-col cols="3">
                                                <v-text-field v-model="row.reqCoEff" label="نسبت لازم"></v-text-field>
                                            </v-col>
                                            <v-col cols="2">
                                                <v-checkbox
                                                v-model="row.idRequired" label="اجباری"></v-checkbox>
                                            </v-col>                                        
                                        </v-row>
                                        <v-divider></v-divider>
                                        <v-row>
                                            <v-col cols="6">
                                                <v-card outlined>
                                                    <v-card-title>
                                                        <v-row>
                                                            <v-col cols="12" class="d-flex align-center justify-center">
                                                                <p>تخفیف تعدادی</p>
                                                            </v-col>
                                                        </v-row>
                                                    </v-card-title>
                                                    <v-card-text>
                                                        <v-row>
                                                            <v-col cols="3">
                                                                <v-text-field label="حداقل تعداد" v-model="row.minQty"></v-text-field>
                                                            </v-col>
                                                            <v-col cols="3">
                                                                <v-text-field label="حداکثر تعداد" v-model="row.maxQty"></v-text-field>
                                                            </v-col>
                                                            <v-col cols="3">
                                                                <v-text-field label="تعداد پله" v-model="row.stepQty"></v-text-field>
                                                            </v-col>
                                                            <v-col cols="3">
                                                                <v-text-field label="تخفیف هر پله" v-model="row.disPerStepQty"></v-text-field>
                                                            </v-col>
                                                            <v-col cols="3">
                                                                <v-text-field label="سقف تخفیف" v-model="row.maxDisQty"></v-text-field>
                                                            </v-col>
                                                        </v-row>
                                                    </v-card-text>
                                                </v-card>
                                            </v-col>
                                            <v-col cols="6">
                                                <v-card outlined>
                                                    <v-card-title>
                                                        <v-row>
                                                            <v-col cols="12" class="d-flex align-center justify-center">
                                                                <p>تخفیف مبلغی</p>
                                                            </v-col>
                                                        </v-row>
                                                    </v-card-title>
                                                    <v-card-text>
                                                        <v-row>
                                                            <v-col cols="3">
                                                                <v-text-field label="حداقل مبلغ" v-model="row.minValue"></v-text-field>
                                                            </v-col>
                                                            <v-col cols="3">
                                                                <v-text-field label="حداکثر مبلغ" v-model="row.maxValue"></v-text-field>
                                                            </v-col>
                                                            <v-col cols="3">
                                                                <v-text-field label="مبلغ پله" v-model="row.stepValue"></v-text-field>
                                                            </v-col>
                                                            <v-col cols="3">
                                                                <v-text-field label="تخفیف هر پله" v-model="row.disPerStepValue"></v-text-field>
                                                            </v-col>
                                                            <v-col cols="3">
                                                                <v-text-field label="سقف تخفیف" v-model="row.maxDisValue"></v-text-field>
                                                            </v-col>
                                                        </v-row>
                                                    </v-card-text>
                                                </v-card>
                                            </v-col>    
                                            <v-col cols="4">
                                                <v-text-field v-model="row.maxAllDis" label="حداکثر کل تخفیف"></v-text-field>
                                            </v-col>                                    
                                        </v-row>
                                        <v-divider></v-divider>
                                        <v-row>
                                            <v-col cols="3">
                                                <v-text-field label="قیمت پایه" v-model="row.basePrice"></v-text-field>
                                            </v-col>
                                            <v-col cols="3">
                                                <v-text-field label="تخفیف پایه" v-model="row.baseDis"></v-text-field>
                                            </v-col>
                                            <v-col cols="3">
                                                <v-text-field label="تخفیف مبلغ ثابت" v-model="row.fixDisValue"></v-text-field>
                                            </v-col>
                                            <v-col cols="6">
                                                <v-text-field label="قواعد تخفیف" v-model="row.disRelation"></v-text-field>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col class="d-flex justify-center" cols="12">
                                                <v-btn color="purple" type="submit">اضافه کردن</v-btn>
                                            </v-col>
                                        </v-row>
                                    </v-form>    
                                </v-card-text>
                            </v-card>
                            <v-card>
                                <v-card-title>
                                    <h4>خطوط</h4>
                                </v-card-title>
                                <v-card-text>
                                    <v-data-table
                                    :items="rows"
                                    :headers="lineHeaders"
                                    hide-default-footer
                                    ></v-data-table>
                                </v-card-text>
                            </v-card>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-col>
        </v-row>
    </v-sheet>
    <v-row>
        <v-col cols="12" class="d-flex align-center justify-center py-5">
            <v-btn color="primary" @click="submitCampaign">ثبت کمپین</v-btn>
        </v-col>
    </v-row>
    </v-sheet> 
</template>

<script>
import DatePicker from '../DatePicker.vue'
export default{
    components:{ DatePicker},
    data(){
        return{
            head:{
                camName:'',
                camStartDate:'',
                camEndDate:"",
                camActive:false,
                camType:'B',
                camB1CampaignId:'',
                camCardCodes:[],
                camCardGroups:[],
                camBaseDis:'',
                camDisRelation:'',
                camMinRow:'',
                camMaxRow:'',
                camPerRowDis:'',
                camMaxRowDis:'',
                camMinValue:'',
                camMaxValue:'',
                camPerValueStep:'',
                camPerStepDis:'',
                camMaxValueDis:'',
                camMaxAllDis:'',
                camChannelDis:'',
                camCanHaveB1Dis:false,
                camSettleType:'',
                camCommissionEff:'',
                camB1PriceList:''

            },
            row:{
                itemCodes:[],
                itemGroups:[],
            idRequired:false,
            reqCoEff:'',
            minQty:'',
            maxQty:'',
            stepQty:'',
            disPerStepQty:'',
            maxDisQty:'',
            minValue:'',
            maxValue:'',
            stepValue:'',
            disPerStepValue:'',
            maxDisValue:'',
            maxAllDis:'',
            basePrice:'',
            baseDis:'',
            fixDisValue:'',
            disRelation:''

            },
            rows:[]
        }
    },
    computed:{
        lineHeaders(){
            return [
                {
            text:'کدهای کالا',
            value:'itemCodes'
          },
          {
            text:'گروه های کالا',
            value:'itemGroups'
          },
          {
            text:'قواعد تخفیف',
            value:'disRelation'
          },
            ]
        },
        itemCodes(){
            return []
        },
        itemGroups(){
            return[]
        }
    },
    methods:{
        addRow(){
            this.rows.push(this.row)
            this.row={
                itemCodes:[],
                itemGroups:[],
            idRequired:false,
            reqCoEff:'',
            minQty:'',
            maxQty:'',
            stepQty:'',
            disPerStepQty:'',
            maxDisQty:'',
            minValue:'',
            maxValue:'',
            stepValue:'',
            disPerStepValue:'',
            maxDisValue:'',
            maxAllDis:'',
            basePrice:'',
            baseDis:'',
            fixDisValue:'',
            disRelation:''               
            }
        }
    }
}
</script>
<style scoped>
.v-sheet{
    margin: 10px;
}
</style>