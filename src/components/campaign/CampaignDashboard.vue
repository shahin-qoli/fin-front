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
                <v-stepper v-model="e1">
                    <v-stepper-header class="ma-4">
                        <v-stepper-step
                        :complete="e1 > 1"
                        step="1"
                        >
                        کلیات کمپین
                        </v-stepper-step>

                        <v-divider></v-divider>

                        <v-stepper-step
                        :complete="e1 > 2"
                        step="2"
                        >
                        جزییات کمپین
                        </v-stepper-step>
                        <v-divider></v-divider>
                        <v-stepper-step
                        :complete="e1 > 3"
                        step="3"
                        >
                        خطوط کمپین
                        </v-stepper-step>
                    </v-stepper-header>    

                    <v-stepper-items class="my-4" style="border: 1px solid #000;"> 
                        <v-stepper-content step="1">
                            <v-row>
                                <v-col cols="4">
                                    <v-text-field
                                    v-model="head.camName"
                                    label="نام"></v-text-field>
                                </v-col>
                                <v-col cols="4">
                                    <date-picker v-model="head.camStartDate"
                                    label="تاریخ شروع"></date-picker>
                                </v-col>
                                <v-col cols="4">
                                    <date-picker v-model="head.camEndDate"
                                    label="تاریخ پایان"></date-picker>
                                </v-col>
                                <v-col cols="4">
                                    <v-text-field
                                    v-model="head.camB1CampaignId"
                                    label="B1CampaignId"></v-text-field>
                                </v-col>
                                <v-col cols="4">
                                    <v-checkbox
                                    v-model="head.camActive"
                                    label="فعال"
                                    ></v-checkbox>
                                </v-col>
                                <v-col cols="4">
                                    <v-text-field
                                    label="نوع"
                                    v-model="head.camType"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12">
                                    <v-textarea v-model="head.query"
                                    label="Query"></v-textarea>
                                </v-col>
                                <v-col cols="6">
                                    <v-textarea v-model="head.qParam1"
                                    label="QParam1"></v-textarea>
                                </v-col>
                                <v-col cols="6">
                                    <v-textarea v-model="head.qParam2"
                                    label="QParam2"></v-textarea>
                                </v-col>
                                <v-col cols="6">
                                    <v-textarea v-model="head.qParam3"
                                    label="QParam3"></v-textarea>
                                </v-col>
                                <v-col cols="6">
                                    <v-textarea v-model="head.qParam4"
                                    label="QParam4"></v-textarea>
                                </v-col>
                            </v-row>
                            <v-btn
                                color="primary"
                                @click="e1 = 2"
                            >
                            بعد
                            </v-btn>
                        </v-stepper-content>
                        <v-stepper-content step="2">
                            <!-- پنل کلیات -->
                            <v-form @submit.prevent="addHeadDetail">
                            <v-card>
                                <v-card-title>
                                    <h4>کلیات تخفیف</h4>
                                </v-card-title>
                                <v-card-text>
                                    <v-row>
                                            <v-col cols="3">
                                                <v-text-field label="نام" v-model="headDetail.camName"></v-text-field>
                                            </v-col>
                                            <v-col cols="4">
                                                <v-select solo item-text="Title" item-value="Id" label="قواعد تخفیف" :items="disRelations" v-model="headDetail.camDisRelation"></v-select>
                                            </v-col>         
                                            <v-col cols="4">
                                                <v-select  solo item-text="Name" item-value="Id" label="سیاست تخفیف" :items="disPolicies" v-model="headDetail.camDisPolicy"></v-select>
                                            </v-col>      
                                            <v-col cols="3">
                                                <v-text-field label="تخفیف پایه" v-model="headDetail.camBaseDis"></v-text-field>
                                            </v-col>       
                                            <v-col cols="4">
                                                <v-checkbox
                                                v-model="headDetail.camActive"
                                                label="فعال"
                                                ></v-checkbox>
                                            </v-col>                         
                                    </v-row>
                                </v-card-text>
                            </v-card>
                            <v-card>
                                <v-card-title>
                                    <h4>تنظیمات محدودیت</h4>
                                </v-card-title>
                                <v-card-text>
                                    <v-row>
                                            <v-col cols="6">
                                                <v-autocomplete
                                                v-model="selectedCardCode"
                                                :items="customers"
                                                label="کد مشتریان"
                                                filled
                                                dense
                                                item-text="card_code"
                                                item-value="card_code"
                                                :search-input.sync="searchCustomer"                      
                                                >
                                                </v-autocomplete>
                                                <v-textarea
                                                v-model="headDetail.camCardCodes"
                                                label="کد مشتریان"></v-textarea>
                                            </v-col>
                                            <v-col cols="6">
                                                <v-autocomplete
                                                v-model="selectedCardGroup"
                                                :items="cardGroups"
                                                label="گروه مشتریان"
                                                filled
                                                dense
                                                item-text="groupname"
                                                item-value="groupcode"
                                     
                                                >
                                                </v-autocomplete>
                                                <v-textarea
                                                v-model="headDetail.camCardGroups"
                                                label="گروه مشتریان"></v-textarea>
                                            </v-col>                                            
                                        </v-row>
                                </v-card-text>
                            </v-card>
                            <v-card>
                                <v-card-title>
                                    <h4>جزییات تخفیف</h4>
                                </v-card-title>
                                <v-card-text>
                                    <v-row >
                                            <v-col ma-2 cols="6">
                                                <v-card outlined>
                                                    <v-card-text>
                                                    <v-row>
                                                        <v-col cols="12" class="d-flex justify-center align-center">
                                                            <p>تخفیف تعداد خطوط</p>
                                                        </v-col>
                                                        <v-col cols="4">
                                                            <v-text-field label="حداقل خط" v-model="headDetail.camMinRow"></v-text-field>
                                                        </v-col>
                                                        <v-col cols="4">
                                                            <v-text-field label="حداکثر خط" v-model="headDetail.camMaxRow"></v-text-field>
                                                        </v-col>
                                                        <v-col cols="4">
                                                            <v-text-field label="تخفیف هر خط" v-model="headDetail.camPerRowDis"></v-text-field>
                                                        </v-col>
                                                        <v-col cols="4">
                                                            <v-text-field label="سقف تخفیف" v-model="headDetail.camMaxRowDis"></v-text-field>
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
                                                            <v-text-field label="حداقل مبلغ" v-model="headDetail.camMinValue"></v-text-field>
                                                        </v-col>
                                                        <v-col cols="4">
                                                            <v-text-field label="حداکثر مبلغ" v-model="headDetail.camMaxValue"></v-text-field>
                                                        </v-col>
                                                        <v-col cols="44">
                                                            <v-text-field label="مبلغ پله" v-model="headDetail.camPerValueStep"></v-text-field>
                                                        </v-col>
                                                        <v-col cols="4">
                                                            <v-text-field label="تخفیف هر پله" v-model="headDetail.camPerStepDis"></v-text-field>
                                                        </v-col>
                                                        <v-col cols="4">
                                                            <v-text-field label="سقف تخفیف" v-model="headDetail.camMaxValueDis"></v-text-field>
                                                        </v-col> 
                                                    </v-row>      
                                                    </v-card-text>    
                                                </v-card>   

                                            </v-col>
                                            <v-col cols="3">
                                                <v-text-field v-model="headDetail.camMaxAllDis" label="سقف کلی تخفیف"></v-text-field>
                                            </v-col>
                                        </v-row>
                                </v-card-text>
                            </v-card>
                            <v-card>
                                <v-card-title>
                                    <h4>کانال فروش</h4>
                                </v-card-title>
                                <v-card-text>
                                    <v-row>
                                            <v-col cols="4">
                                                <v-text-field v-model="headDetail.camChannelDis" label="تخفیف کانال"></v-text-field>
                                            </v-col>
                                            <v-col cols="4">
                                                <v-text-field v-model="headDetail.camSalesChannel" label="کانال فروش"></v-text-field>
                                            </v-col>
                                        </v-row>                                   
                                </v-card-text>
                            </v-card>
                            <v-card>
                                <v-card-title>
                                    <h4>پورسانت و بی وان</h4>
                                </v-card-title>
                                <v-card-text>
                                    <v-row>
                                        <v-col cols="3">
                                                <v-checkbox
                                                v-model="headDetail.camCanHaveB1Dis" label="قیمت و تخفیف از بی وان خوانده شود؟"></v-checkbox>
                                        </v-col>
                                        <v-col cols="3">
                                                <v-select :items="settleTypes" solo item-text="text" item-value="value" label="روش پرداخت" v-model="headDetail.camSettleType"></v-select>
                                        </v-col>
                                        <v-col cols="3">
                                                <v-text-field v-model="headDetail.camCommissionEff" label="تاثیر روی پورسانت"></v-text-field>
                                            </v-col>
                                            <v-col cols="3">
                                                <v-select solo item-text="listname" item-value="listnum" v-model="headDetail.camB1PriceList" :items="priceLists" label="لیست قیمت بی وان"></v-select>
                                            </v-col>
                                            <v-col cols="3">
                                                <v-text-field
                                                v-model="headDetail.camMaxCreditTime" label="حداکثر زمان اعتبار"></v-text-field>
                                            </v-col>
                                            <v-col cols="3">
                                                <v-text-field
                                                v-model="headDetail.camPayDueDate" label="موعد تسویهpayduedate"></v-text-field>
                                            </v-col>
                                            <v-col cols="3">
                                                <v-text-field
                                                v-model="headDetail.camPaymentTime" label="زمان تسویه paymenttime"></v-text-field>
                                            </v-col>
                                            <v-col cols="3">
                                                <v-text-field
                                                v-model="headDetail.camDocType" label="نوع سند"></v-text-field>
                                            </v-col>
                                            <v-col cols="3">
                                                <v-checkbox
                                                v-model="headDetail.camIsDraft" label="آیا پیش نویس است؟"></v-checkbox>
                                            </v-col>
                                            <v-col cols="3">
                                                <v-checkbox
                                                v-model="headDetail.camIsHaveItemPrice" label="آیا ItemPrice دارد؟"></v-checkbox>
                                            </v-col>
                                            <v-col cols="3">
                                                <v-checkbox
                                                v-model="headDetail.camIsHaveFreeDiscount" label="آیا FreeDiscount دارد؟"></v-checkbox>
                                            </v-col>
                                            <v-col cols="3">
                                                <v-checkbox
                                                v-model="headDetail.camIsNeedSecondDoc" label="آیا سند دوم نیاز دارد؟"></v-checkbox>
                                            </v-col>
                                            <v-col cols="3">
                                                <v-text-field
                                                v-model="headDetail.camSecDocType" label="نوع سند دوم"></v-text-field>
                                            </v-col>
                                            <v-col cols="3">
                                                <v-checkbox
                                                v-model="headDetail.camIsHaveClubPoints" label="آیا امتیاز باشگاه دارد؟"></v-checkbox>
                                            </v-col>
                                            <v-col cols="3">
                                                <v-text-field
                                                v-model="headDetail.camShouldPassCampaign" label="باید کمپین را پاس کند؟"></v-text-field>
                                            </v-col>
                                            <v-col cols="3">
                                                <v-checkbox
                                                v-model="headDetail.camIsHaveCampaignDis" label="آیا تخفیف کمپین دارد؟"></v-checkbox>
                                            </v-col>
                                        </v-row>                                       
                                </v-card-text>
                            </v-card>
                            <v-card>
                                <v-card-title>
                                    <h4>Query</h4>
                                </v-card-title>
                                <v-card-text>
                                <v-row>
                                    <v-col cols="12">
                                        <v-textarea v-model="headDetail.query"
                                        label="Query"></v-textarea>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-textarea v-model="headDetail.qParam1"
                                        label="QParam1"></v-textarea>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-textarea v-model="headDetail.qParam2"
                                        label="QParam2"></v-textarea>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-textarea v-model="headDetail.qParam3"
                                        label="QParam3"></v-textarea>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-textarea v-model="headDetail.qParam4"
                                        label="QParam4"></v-textarea>
                                    </v-col>
                                </v-row>
                                </v-card-text>
                            </v-card>
                            <v-row>
                                <v-col class="d-flex justify-center" cols="12">
                                    <v-btn color="yellow" type="submit">اضافه کردن</v-btn>
                                </v-col>
                            </v-row>
                            </v-form>
                            <v-card>
                                <v-card-title>
                                    <h4>جزییات اضافه شده</h4>
                                </v-card-title>
                                <v-card-text>
                                    <v-data-table
                                    :items="headDetails"
                                    :headers="headerDetailHeader"
                                    hide-default-footer
                                    ></v-data-table>
                                </v-card-text>
                            </v-card>
                            <v-btn
                                color="primary"
                                @click="e1 = 3"
                            >
                            بعد
                            </v-btn>
                            <v-btn  @click="e1 = 1" color="red">
                            قبل
                            </v-btn>
                        </v-stepper-content>
                        <v-stepper-content step="3">
                            <v-card outlined>
                                <v-card-title>
                                    <h4>خط فاکتور</h4>
                                </v-card-title>
                                <v-card-text>
                                    <v-form @submit.prevent="addRow">
                                        <v-row>
                                            <v-col cols="12">
                                                <v-select solo item-text="camName" item-value="camName" label="جزییات کمپین" :items="headDetails" v-model="row.headDetail"></v-select>
                                            </v-col>   
                                            <v-col cols="6">
                                                <v-autocomplete
                                                :items="itemCodes"
                                                v-model="selectedItemCode"
                                                solo
                                                item-text="item_code"
                                                item-value="item_code"
                                                :search-input.sync="searchItem"  
                                                label="کد کالا"></v-autocomplete>
                                                <v-textarea
                                                v-model="row.itemCodes"
                                                label="کدهای کالا"></v-textarea>
                                            </v-col>
                                            <v-col cols="6">
                                                <v-autocomplete
                                                :items="itemGroups"
                                                v-model="selectedItemGroup"
                                                item-text="itmsgrpnam"
                                                solo
                                                item-value="itmsgrpcod"
                                                label="گروه کالا"></v-autocomplete>
                                                <v-textarea
                                                v-model="row.itemGroups"
                                                label="گروه های کالا"></v-textarea>
                                            </v-col>
                                            <v-col cols="3">
                                                <v-text-field                                
                                                v-model="row.taxon"
                                                label="تکسون کالا"></v-text-field>
                                            </v-col>
                                            <v-col cols="3">
                                                <v-btn @click="fetchTaxonItems" color="yellow" :loading="loadingTaxon">اضافه کردن</v-btn>
                                            </v-col>
                                            <v-col cols="3">
                                                <v-text-field v-model="row.reqCoEff" label="نسبت لازم"></v-text-field>
                                            </v-col>
                                            <v-col cols="2">
                                                <v-checkbox
                                                v-model="row.isRequired" label="اجباری"></v-checkbox>
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
                                                <v-select  solo item-text="Title" item-value="Id" label="قواعد تخفیف" :items="disRelations" v-model="row.disRelation"></v-select>
                                            </v-col>
                                            <v-col cols="6">
                                                <v-select  solo item-text="Name" item-value="Id" label="سیاست تخفیف" :items="disPolicies" v-model="row.disPolicy"></v-select>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col class="d-flex justify-center" cols="12">
                                                <v-btn color="yellow" type="submit">اضافه کردن</v-btn>
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
                            <v-btn
                                color="purple"
                                @click="submitCampaign"
                            >
                            ثبت
                            </v-btn>

                            <v-btn  @click="e1 = 2" color="red">
                            قبل
                            </v-btn>
                        </v-stepper-content>
                    </v-stepper-items>

                </v-stepper>

            </v-col>
        </v-row>
    </v-sheet>
    <v-overlay :value="isLoading">
        <v-progress-circular indeterminate color="green"></v-progress-circular>
        <p>لطفا صبر کنید</p>
    </v-overlay>
    </v-sheet> 
</template>

<script>
import DatePicker from '../DatePicker.vue'
export default{
    components:{ DatePicker},
    data(){
        return{
            e1: 1,
            loadingTaxon: false,
            isLoading: false,
            searchCustomer:'',
            searchItem:'',
            selectedCardCode:'',
            selectedCardGroup:'',
            selectedItemGroup:'',
            selectedItemCode:'',
            head:{
                camName:'',
                camStartDate:'',
                camEndDate:"",
                camActive:false,
                camType:'B',
                camB1CampaignId:'',
                query:'',
                qParam1:'',
                qParam2:'',
                qParam3: '',
                qParam4:''
            },
            headDetail:{
                camActive:false,
                camCardCodes:[]  ,
                camName:""  ,
                camCardGroups:[]  ,
                camBaseDis:''  ,
                camMinRow:''  ,
                camMaxRow:''  ,
                camPerRowDis:''  ,
                camMaxRowDis:''  ,
                camMinValue:''  ,
                camMaxValue:''  ,
                camPerValueStep:''  ,
                camPerStepDis:''  ,
                camMaxValueDis:''  ,
                camDisRelation:''  ,
                camMaxAllDis:''  ,
                camSalesChannel:''  ,
                camChannelDis:''  ,
                camCanHaveB1Dis:false  ,
                camMaxCreditTime:'', 
                camSettleType:''  ,
                camCommissionEff:''  ,
                camB1PriceList:''  ,
                camIsHaveCampaignDis:false  ,
                camDisPolicy:''  ,
                camPayDueDate:'', 
                camPaymentTime:'', 
                camDocType:'', 
                camIsDraft:false, 
                camIsHaveItemPrice:false, 
                camIsHaveFreeDiscount: false,
                camIsNeedSecondDoc: false,
                camSecDocType:'', 
                camIsHaveClubPoints: false,
                camShouldPassCampaign: 'Y',
                query:'',
                qParam1:'',
                qParam2:'',
                qParam3: '',
                qParam4:''
            },
            headDetails:[],
            row:{
                itemCodes:[],
                itemGroups:[],
                isRequired:false,
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
                disRelation:'',
                disPolicy:'',
                taxon:'',
                ItemChckCond:'',
                headDetail:''
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
        },headerDetailHeader(){
            return [
                {
            text:'نام',
            value:'camName'
          }
            ]
        },
        customers(){
            return this.$store.getters.getFilteredCustomers
        },        itemCodes(){
            return this.$store.getters.getFilteredItems
        },
        settleTypes(){
            return [
        {
          text: "نقد",
          value: 1
        },
        {
          text: "چک",
          value: 2
        },
        {
          text: "NotSet",
          value: 3
        },
        {
          text: "ترکیبی",
          value: 4
        },
        {
          text: "pos",
          value: 8
        },
        {
          text: "online",
          value: 16
        },
        {
          text: "card",
          value: 32
        },
        {
          text: "pos_cheque",
          value: 10
        },
        {
          text: "online_cheque",
          value: 18
        },
        {
          text: "card_cheque",
          value: 34
        }
      ]
        },
        disRelations(){
            return this.$store.getters.getDisRelations
        },
        disPolicies(){
            return this.$store.getters.getDisPolicies
        },
        cardGroups(){
            return this.$store.getters.getCardGroups
        },
        priceLists(){
            return this.$store.getters.getPriceLists
        },
        itemGroups(){
            return this.$store.getters.getItemGroups
        }
    },
    methods:{
        addRow(){
            this.rows.push(this.row)
            this.row={
                itemCodes:[],
                itemGroups:[],
            isRequired:false,
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
            disRelation:'',
            disPolicy:'',
            taxon:''     
            }
        },
        addHeadDetail(){
            this.headDetails.push(this.headDetail)
            this.refreshHeadDetai()            
        },
        loadFilteredCustomers(){        
            this.$store.dispatch('fetchFilteredCustomers', this.searchCustomer)
        },
        fetchTaxonItems(){
            this.loadingTaxon = true
            this.$store.dispatch('fetchTaxonItems', this.row.taxon).then((data) => {
                this.loadingTaxon = false
                console.log(data)
                if (data.length > 0 ){
                    data.forEach( item => this.row.itemCodes.push(item))
                    this.$toasted.show("با موفقیت انجام شد", {
                        position: 'bottom-center',
                        type: 'success',
                        duration: 5000
                    })
                }else{
                    this.$toasted.show("کالایی یافت نشد", {
                        position: 'bottom-center',
                        type: 'error',
                        duration: 5000
                    })
                }
            })
        },
        loadInitialeData(){
            this.isLoading = true
            this.$store.dispatch("fetchInitialData").then((response)=>{
                this.isLoading= false
                if (!response.success){
                this.$toasted.show("خطا در بارگذاری، صفحه را رفرش کنید", {
                    position:'bottom-center',
                    duration: 10000,
                    type: 'error'
                })
                }
        })
        },
        loadFilteredItems(){
            this.$store.dispatch('fetchFilteredItems', this.searchItem)
        },
        refreshData(){
            this.rows = []
            this.headDetails = []
                this.row = {
                itemCodes:[],
                itemGroups:[],
            isRequired:false,
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
            disRelation:'',
            disPolicy:'',
            taxon:''     
            };
            this.head = {
                camName:'',
                camStartDate:'',
                camEndDate:"",
                camActive:false,
                camType:'B',
                camB1CampaignId:'',
                query:'',
                qParam1:'',
                qParam2:'',
                qParam3: '',
                qParam4:''
            };
            this.refreshHeadDetai()

        },
        refreshHeadDetai(){
            this.headDetail = {
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
                camSalesChannel:'',
                camChannelDis:'',
                camCanHaveB1Dis:false,
                camSettleType:'',
                camCommissionEff:'',
                camB1PriceList:'',
                camIsHaveCampaignDis:false,
                camDisPolicy:''

            }
        },
        submitCampaign(){
            this.isLoading=true
            let payload = {rows: this.rows, head: this.head,head_details: this.headDetails}
            this.$store.dispatch('createCampaign', payload).then((response)=>{
                this.isLoading= false
                if (response.success){
                    this.$toasted.show("با موفقیت انجام شد",{
                        position: 'bottom-center',
                        type: 'success',
                        duration: 5000
                    })
                    this.refreshData()
                }else{
                    this.$toasted.show(`خطا:${response.error}`,{
                        position: 'bottom-center',
                        type: 'error',
                        duration: 10000
                    })                   
                }
            })
        }
    },
    watch:{
        searchCustomer:{
            handler(){
                setTimeout(() => {
                    this.loadFilteredCustomers();
                }, 1000);
                        
        }
    },searchItem:{
        handler(){
            setTimeout(()=>{
                this.loadFilteredItems();
            })
        }
    },
    selectedCardGroup(newValue){
        if (newValue !== ''){
            this.headDetail.camCardGroups.push(newValue)
            this.$nextTick(() => {
            this.selectedCardGroup = '';
            });
 
        }
    }
    ,
    selectedCardCode(newValue){
        if (newValue !== ''){
            this.headDetail.camCardCodes.push(newValue)
            this.$nextTick(() => {
            this.selectedCardCode = '';
            this.searchCustomer = '';
            });
 
        }
    },selectedGroupCode(newValue){
        if (newValue !== ''){
            this.headDetail.camGroupCodes.push(newValue)
            this.$nextTick(() => {
            this.selectedGroupCode = '';
            });
 
        }
    },
    selectedItemCode(newValue){
        if (newValue !== ''){
            this.row.itemCodes.push(newValue)
            this.$nextTick(() => {
            this.selectedItemCode = '';
            this.searchItem= ''
            });
        }
    },
    selectedItemGroup(newValue){
        if (newValue !== ''){
            this.row.itemGroups.push(newValue)
            this.$nextTick(() => {
            this.selectedItemGroup = '';
            });
        }
    }
    
},
created(){
    this.loadInitialeData()
}
}
</script>
<style scoped>
.v-sheet{
    margin: 10px;
}
</style>