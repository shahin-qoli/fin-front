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
                                                v-model="head.camName"
                                                label="نام"></v-text-field>
                                            </v-col>
                                            <v-col cols="3">
                                                <date-picker v-model="head.camStartDate"
                                                label="تاریخ شروع"></date-picker>
                                            </v-col>
                                            <v-col cols="3">
                                                <date-picker v-model="head.camEndDate"
                                                label="تاریخ پایان"></date-picker>
                                            </v-col>
                                            <v-col cols="3">
                                                <v-text-field
                                                v-model="head.camB1CampaignId"
                                                label="B1CampaignId"></v-text-field>
                                            </v-col>
                                            <v-col cols="3">
                                                <v-checkbox
                                                v-model="head.camActive"
                                                label="فعال"
                                                ></v-checkbox>
                                            </v-col>
                                            <v-col cols="3">
                                                <v-text-field
                                                label="نوع"
                                                v-model="head.camType"></v-text-field>
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
                                                v-model="head.camCardCodes"
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
                                                v-model="head.camCardGroups"
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
                                                <v-text-field label="تخفیف پایه" v-model="head.camBaseDis"></v-text-field>
                                            </v-col>
                                            <v-col cols="9">
                                                <v-select solo item-text="Title" item-value="Id" label="قواعد تخفیف" :items="disRelations" v-model="head.camDisRelation"></v-select>
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
                                                            <v-text-field label="حداقل خط" v-model="head.camMinRow"></v-text-field>
                                                        </v-col>
                                                        <v-col cols="4">
                                                            <v-text-field label="حداکثر خط" v-model="head.camMaxRow"></v-text-field>
                                                        </v-col>
                                                        <v-col cols="4">
                                                            <v-text-field label="تخفیف هر خط" v-model="head.camPerRowDis"></v-text-field>
                                                        </v-col>
                                                        <v-col cols="4">
                                                            <v-text-field label="سقف تخفیف" v-model="head.camMaxRowDis"></v-text-field>
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
                                                            <v-text-field label="حداقل مبلغ" v-model="head.camMinValue"></v-text-field>
                                                        </v-col>
                                                        <v-col cols="4">
                                                            <v-text-field label="حداکثر مبلغ" v-model="head.camMaxValue"></v-text-field>
                                                        </v-col>
                                                        <v-col cols="44">
                                                            <v-text-field label="مبلغ پله" v-model="head.camPerValueStep"></v-text-field>
                                                        </v-col>
                                                        <v-col cols="4">
                                                            <v-text-field label="تخفیف هر پله" v-model="head.camPerStepDis"></v-text-field>
                                                        </v-col>
                                                        <v-col cols="4">
                                                            <v-text-field label="سقف تخفیف" v-model="head.camMaxValueDis"></v-text-field>
                                                        </v-col> 
                                                    </v-row>      
                                                    </v-card-text>    
                                                </v-card>   

                                            </v-col>
                                            <v-col cols="3">
                                                <v-text-field v-model="head.camMaxAllDis" label="سقف کلی تخفیف"></v-text-field>
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
                                                <v-text-field v-model="head.camChannelDis" label="تخفیف کانال"></v-text-field>
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
                                                v-model="head.camCanHaveB1Dis" label="قیمت و تخفیف از بی وان خوانده شود؟"></v-checkbox>
                                        </v-col>
                                        <v-col cols="3">
                                                <v-select :items="settleTypes" solo item-text="text" item-value="value" label="روش پرداخت" v-model="head.camSettleType"></v-select>
                                        </v-col>
                                        <v-col cols="3">
                                                <v-text-field v-model="head.camCommissionEff" label="تاثیر روی پورسانت"></v-text-field>
                                            </v-col>
                                            <v-col cols="3">
                                                <v-select solo item-text="listname" item-value="listnum" v-model="head.camB1PriceList" :items="priceLists" label="لیست قیمت بی وان"></v-select>
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
                                                <v-select  solo item-text="Title" item-value="Id" label="قواعد تخفیف" :items="disRelations" v-model="row.disRelation"></v-select>
                                            </v-col>
                                            <v-col cols="6">
                                                <v-select  solo item-text="Name" item-value="Id" label="سیاست تخفیف" :items="disPolicies" v-model="row.disPolicies"></v-select>
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
            loadingTaxon: false,
            loadingInitial: false,
            searchCustomer:'',
            searchItem:'',
            selectedCardCode:'',
            selectedItemGroup:'',
            selectedItemCode:'',
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
            disRelation:'',
            disPolicy:'',
            taxon:''
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
            disRelation:'',
            disPolicy:'',
            taxon:''     
            }
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
            this.loadingInitial = true
            this.$store.dispatch("fetchInitialData").then(()=> this.loadingInitial= false)
        },
        loadFilteredItems(){
            this.$store.dispatch('fetchFilteredItems', this.searchItem)
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
    }
    ,selectedCardCode(newValue){
        if (newValue !== ''){
            this.head.camCardCodes.push(newValue)
            this.$nextTick(() => {
            this.selectedCardCode = '';
            this.searchCustomer = '';
            });
 
        }
    },selectedGroupCode(newValue){
        if (newValue !== ''){
            this.head.camGroupCodes.push(newValue)
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