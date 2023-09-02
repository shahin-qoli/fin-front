import { finAgent } from "@/services/agent";

export default {
    state(){
        return{
            syncTemplates: [],
            syncSourceDocs:[],
            itemCount: null,
            itemCountSyncSources: null,
        }
    },
    mutations:{
        setSyncTemplates(state,payload){
            state.syncTemplates = payload
        },
        setItemCount(state, payload){
            state.itemCount = payload
        },
        setItemCountSyncSources(state, payload){
            state.itemCountSyncSources = payload
        },
        setSyncSourceDocs(state, payload){
            state.syncSourceDocs = payload;
        }
    },
    getters:{
        getSyncTemplates(state){
            return state.syncTemplates
        },
        getSyncSourceDocs(state){
            return state.syncSourceDocs
        },
        getItemCountSyncSources(state){
            return state.itemCountSyncSources;
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
            catch (err) {
                const error = new Error(
                    err.response.data.error || 'Failed to fetch'
                );
                throw error;
            }
        },
        async loadSyncSourceDocuments(context, payload){
            try{
                const {data:responseData} = await finAgent.get(`/front/sync_source_documents?page=${payload.page}&per_page=${payload.itemsPerPage}&q[sync_template_id_eq]=${payload.selectedOption}`)
                var syncSourceDocsData = responseData.data
                var itemCount = responseData.options.count;
                const syncSourceDocs =[]
                for(const item of syncSourceDocsData){
                    const syncSourceDoc = {
                        ...item
                    }
                    syncSourceDocs.push(syncSourceDoc)
                }
                context.commit('setSyncSourceDocs', syncSourceDocs);
                context.commit('setItemCountSyncSources', itemCount);
            }catch(err){
                const error = new Error(
                    err.response.data.error || 'Failed to fetch'
                );
                throw error;
            }
        },
        async updateTemplate(context, payload){
            try{
                const {data:responseData} = await finAgent.get(`/front/sync_templates/${payload.templateId}/update_source_list?start_date=${payload.date}`)
                return responseData
            }catch(err){
                const error = new Error(
                    err.response.data.error || 'Failed to fetch'
                );
                throw error;
            }
        },
        async getSyncSources(context, payload){
            try{
                let body ={source_ids: payload}
                const {data:responseData} = await finAgent.post(`/front/sync_source_documents/sync_sources`, body)
                return responseData
            }catch (err){
                const error = new Error(
                    err.response.data.error || 'Failed to fetch'
                );
                throw error;
            }
        },
        async getReadySources(context, payload){
            try{
                let body ={source_ids: payload}
                const {data:responseData} = await finAgent.post(`/front/sync_source_documents/sync_sources_ready`, body)
                return responseData
            }catch (err){
                const error = new Error(
                    err.response.data.error || 'Failed to fetch'
                );
                throw error;
            }
        },
        async updateMasterDataSepidar(){
            try{
                const {data:responseData} = await finAgent.get("/front/sync_source_documents/update_master_data")
                return responseData
            }catch(err){
                const error = new Error(
                    err.response.data.error || 'Failed to fetch'
                );
                throw error;
            }
        }
    },

}