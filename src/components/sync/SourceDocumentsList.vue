<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-card>
                    <v-card-text>
                        <v-row>
                            <v-col cols="4">
                                <v-select
                                v-model="selectedOption"
                                :items="jobList"
                                item-text="title"
                                item-value="document.title"
                                label="لیست کارها"
                                solo
                                ></v-select>
                            </v-col>
                            <v-col v-if="selectedOption" cols="4">
                                <v-text-field
                                :value=mainDocument
                                label="سند مادر"
                                disabled
                                ></v-text-field>
                            </v-col>
                            <v-col v-if="selectedOption" cols="4">
                                <v-text-field
                                :value=equivalentDocument
                                label="سند معادل"
                                disabled
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-card>
                    <v-card-text>
                        <v-data-table
                        fixed-header
                        dense
                        :headers="headers"
                        :items="raws"
                        item-key="id"
                        :options.sync="options"
                        :server-items-length="itemCount"
                        class="elevation-1"
                        >
                        <template v-slot:header="" >
                            <thead>
                            <tr>
                                <th colspan="6" align="center">سند مادر</th>
                                <th colspan="2">سند معادل</th>
                            </tr>
                            </thead>
                        </template>
                        <template v-slot:[`item.controls`]="props">
                         <v-btn  class="mx-2" small  @click="retryJob(props.item)">
                        <v-icon>mdi-check-outline</v-icon>
                        </v-btn>
                        </template>
                        <template v-slot:[`item.mainDocument`]="props">
                            <span>{{ JSON.stringify(props.item.mainDocument) }}</span>
                        </template>
                        <template v-slot:[`item.equivalentDocument`]="props">
                            <span>{{ JSON.stringify(props.item.equivalentDocument) }}</span>
                        </template>
                        </v-data-table>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default{
    data() {
        return {
            jobList:[1,2,3],
            selectedOption: null,
            mainDocument:"something",
            equivalentDocument:"equivalent",
            raws:[]
        }
    },
    computed:{
        headers(){
            return [
                {
            text: "ردیف",
            align: "center",
            //sortable: false,
            value: "id",
          },
          {
            text: "نوع سند",
            align: "center",
            //sortable: false,
            value: "sync_template.source_name",
          },
          {
            text: "کد سند",
            align: "center",
            //sortable: false,
            value: "source_document_id",
          },
          {
            text: "سری سند",
            align: "center",
            //sortable: false,
            value: "source_document_series",
          },
          {
            text: "شماره سند",
            align: "center",
            //sortable: false,
            value: "source_document_number",
          },
          {
            text: "تاریخ سند",
            align: "center",
            //sortable: false,
            value: "source_document_date",
          },
          {
            text:"جمع سند",
            align: "center",
            //sortable: false,
            value: "source_document_total",
          },
          {
            text:"نوع سند",
            align: "center",
            //sortable: false,
            value: "sync_template.equivalent_name",
          },          {
            text:"شماره سند",
            align: "center",
            //sortable: false,
            value: "equivalent_document_id",
          }
        
            ]
        }
    }
}
</script>