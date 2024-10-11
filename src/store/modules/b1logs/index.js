import { finAgent } from "@/services/agent";

export default{
    state(){
        return {
            logs: [],
            itemCount: null
        }
    },
    mutations:{
        setLogs(state, logs){
            state.logs = logs;
        },
        setItemCount(state, itemCount){
            state.itemCount = itemCount;
        }
    },
    getters:{
        getLogs(state){
            return state.logs;
        },
        getItemCount(state){
            return state.itemCount;
        }
    },
    actions:{
        async loadLogs(context,payload){
            try{
                console.log("SSSSSSSSSSSSSSSSSSSS")
                console.log(payload)
                //?page=${payload.page}&per_page=${payload.itemsPerPage} payload
                const {data:responseData} = await finAgent.get(`/front/b1_cheque_logs?page=${payload.options.page}
                &per_page=${payload.options.itemsPerPage}&q[is_success_eq]=${payload.search.isSuccess}`)

                var logsData = responseData.data;
                
                var itemCount = responseData.options.count;
                var logs= []
              
                for(const item of logsData){
                    const log ={
                        ...item
                    }
                    logs.push(log);
                }
                context.commit('setLogs', logs)
                context.commit('setItemCount', itemCount);
            }
            catch(err){
                const error = new Error(
                    err || 'Failed to fetch'
                );
                throw error;
            }
        }
    }
}