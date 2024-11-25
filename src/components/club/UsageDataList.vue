<template>
    <v-container>
        <v-card>
            <v-card-title>
                <v-row>
                    <v-col cols="12" class="d-flex align-center justify-center">
                        <p>فیلترها</p>
                    </v-col>
                    <v-col cols="4">
                        <v-select
                        :items="usageStates"
                        placeholder="وضعیت سند"
                        solo
                        filled
                        dense
                        item-text="text"
                        item-value="value"
                        v-model="options.state"
                        ></v-select>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field
                        v-model="options.cardCode"
                        label="کد مشتری"></v-text-field>
                    </v-col>                                        
                </v-row>
            </v-card-title>
            <v-card-text>
                <v-data-table
                :items="usages"
                :headers="headers"
                :options.sync="options"
                :server-items-length="itemCount"
                item-key="id"
                :loading="isLoading"
                >
                <template  v-slot:[`item.state`]="props">
                    <v-chip small dark :color="getColorRequestStatus(props.item.state)">
                    {{ transformRequestStatus(props.item.state) }}
                    </v-chip>
                </template>                
                <template v-slot:[`item.action`]="item">
                    <v-row no-gutters justify="center" v-if="needAction(item.item)">
                        <v-col cols="6">
                            <v-btn
                            small
                            color="red"
                            class="mr-2"
                            @click="deny(item.item.id)"
                            >
                            رد
                            </v-btn>
                        </v-col>
                        <v-col cols="6">
                            <v-btn
                            small
                            color="green"
                            class="mr-2"
                            @click="verify(item.item.id)"
                            >
                            تایید
                            </v-btn>
                        </v-col>                        
                    </v-row>
                </template>
                </v-data-table>
            </v-card-text>
        </v-card>
    </v-container>
</template>
<script>
import { TheStatus } from '@/mixins/TheStatus';
export default {
    mixins:[TheStatus],
    data() {
        return{
            options: {
                itemsPerPage: 10,
                page: 1,                
                state: '',
                cardCode: '',
            },
            isLoading: false,
        }
    },
    computed: {
        headers() {
            return [
                {
                    text: 'ردیف',
                    value: 'id'
                },
                {
                    text: 'کد مشتری',
                    value: 'club_user_data.card_code'
                },
                {
                    text: 'نام مشتری',
                    value: 'club_user_data.card_name'
                },
                {
                    text: "جایزه درخواستی",
                    value: 'club_usage_type.title'
                },
                {
                    text: 'تاریخ درخواست',
                    value: 'created_at'
                },
                {
                    text: 'وضعیت',
                    value: 'state'
                },
                {
                    text: '',
                    value: 'action'
                },
            ]
        },

        usageStates() {
            return [
                { text:"درخواست شده", value: 'requested' },
                { text: 'تایید شده', value: 'verified' },
                {text:"رد شده", value: "denied"}]
        },
        usages(){
            return this.$store.getters.getUsageData
        },
        itemCount(){
            return this.$store.getters.getUsageDataItemCount
        }
    },
    methods: {
        needAction(item) {
            return item.state === 'requested'
        },
        loadUsageData() {
            this.isLoading = true;
            this.$store.dispatch('fetchtUsageData', this.options).then(() => this.isLoading = false)
        },
        deny(item) {
            this.isLoading = true;
            this.$store.dispatch('denyUsageData', item).then((resp) => {
                this.isLoading = false
                if (resp.result) {
                    this.$toasted.show("با موفقیت انجام شد.", {
                        position: "bottom-center",
                        duration: 3000,
                        theme: "toasted-primary",
                        type: "success",
                    })
                    this.loadUsageData();
                } else {
                    this.$toasted.show(`خطا در انجام عملیات.:${resp.error}`, {
                        position: "bottom-center",
                        duration: 3000,
                        theme: "toasted-primary",
                        type: "error",
                    })
                }

            })
            this.loadUsageData();
        },
        verify(item) {
            this.isLoading = true;
            this.$store.dispatch('verifyUsageData', item).then((resp) => {
                this.isLoading = false
                if (resp.result) {
                    this.$toasted.show("با موفقیت انجام شد.", {
                        position: "bottom-center",
                        duration: 3000,
                        theme: "toasted-primary",
                        type: "success",
                    })
                    this.loadUsageData();
                } else {
                    this.$toasted.show(`خطا در انجام عملیات.:${resp.error}`, {
                        position: "bottom-center",
                        duration: 3000,
                        theme: "toasted-primary",
                        type: "error",
                    })
                }
            })
            
        }
    },
    watch:{
    options:{
      handler(){   
      this.loadUsageData();    
      },  deep: true
    }},    
}
</script>