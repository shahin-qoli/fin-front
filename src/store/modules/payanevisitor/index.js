import { finAgent } from "@/services/agent";

export default {
    state(){
        return {
        payaneVisitors: []
    }
    },
    mutations:{
        setPayaneVisitors(state, payload){
            state.payaneVisitors = payload;
        }
    },
    getters:{
        getPayaneVisitors(state){
            return state.payaneVisitors;
        }
    },
    actions:{
        async loadPayaneVisitors(context){
            try{
                context.commit('setIsLoading', 'true')
                const {data: responseData} = await finAgent.get('/front/payane_persons');
                var payaneVisitorData = responseData.data;
                const payaneVisitors = []
                for (const item of payaneVisitorData) {
                    const payaneVisitor= {
                        ...item
                    }
                    payaneVisitors.push(payaneVisitor); 
                }
                context.commit('setIsLoading', 'false')
                context.commit('setPayaneVisitors', payaneVisitors)

            } catch (err) {
                //console.log(err.response);
                const error = new Error(
                    err.response.data.error || 'Failed to fetch'
                );
                throw error;
             } 
        }
    }
}