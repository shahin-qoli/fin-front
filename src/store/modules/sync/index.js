import { finAgent } from "@/services/agent";

export default {
    state(){
        return{
            syncTemplates: [],
            sourceDocuments:[],
            itemCount: null,
        }
    },
    mutations:{
        setSyncTemplates(state,payload){
            state.syncTemplates = payload
        },
        setItemCount(state, payload){
            state.itemCount = payload
        },
    },
    getters:{
        getSyncTemplates(state){
            return state.syncTemplates
        },
        getSourceDocuments(state){
            return state.sourceDocuments
        }
    },
    actions:{
        async loadSyncTemplates(context){
            try {
                const {data: responseData} = await finAgent.get(`/front/sync_templates`)
                var syncTemplatesData = responseData.data;
                var itemCount = responseData.options.count;
                const syncTemplates = []
                for (const item of syncTemplatesData) {
                    const syncTemplate= {
                        ...item
                    }
                    syncTemplates.push(syncTemplate); 
                }

                context.commit('setSyncTemplates', syncTemplates)
                context.commit('setItemCount', itemCount);
            }
            catch (err) {}
        }
    },

}