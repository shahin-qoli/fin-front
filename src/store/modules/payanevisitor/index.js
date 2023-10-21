import { finAgent } from "@/services/agent";

export default {
    state(){
        return {
        payaneVisitors: [],
        payaneCodes: [],
        itemCount: null,
    }
    },
    mutations:{
        setItemCount(state, payload){
            state.itemCount = payload
        },
        setPayaneVisitors(state, payload){
            state.payaneVisitors = payload;
        },
        setFreePayaneCodes(state, payload){
            state.payaneCodes = payload
        },
        createPayaneVisitor(state, payload){
           
            state.payaneVisitors.push(payload)
        }
    },
    getters:{
        getPayaneVisitorItemCount(state){
            return state.itemCount;
        },
        getPayaneVisitors(state){
            return state.payaneVisitors;
        },
        getFreePayaneCodes(state){
            return state.payaneCodes;
        }
    },
    actions:{
        async loadPayaneVisitors(context, payload){
            try{
                context.commit('setIsLoading', 'true')
                const {data: responseData} = await finAgent.get(`/front/payane_persons?page=${payload.page}&per_page=${payload.itemsPerPage}&q[is_active_eq]=${payload.isActive}`);
                var payaneVisitorData = responseData.data;
                var itemCount = responseData.options.count;
                const payaneVisitors = []
                for (const item of payaneVisitorData) {
                    const payaneVisitor= {
                        ...item
                    }
                    payaneVisitors.push(payaneVisitor); 
                }
                context.commit('setIsLoading', 'false')
                context.commit('setPayaneVisitors', payaneVisitors)
                context.commit('setItemCount', itemCount);

            } catch (err) {
                //console.log(err.response);
                const error = new Error(
                    err.response.data.error || 'Failed to fetch'
                );
                throw error;
             } 
        },
        async loadFreePayaneCodes(context){
        try{
            context.commit('setIsLoading', 'true')
            const {data: responseData} = await finAgent.get('/front/bank_payanes?without_sale_persons=true');
            var payaneCodeData = responseData.data;
            const payaneCodes = []
            for (const item of payaneCodeData) {
                const payaneCode= {
                    ...item
                }
                payaneCodes.push(payaneCode); 
            }
            context.commit('setIsLoading', 'false')
            context.commit('setFreePayaneCodes', payaneCodes)

        } catch (err) {
            //console.log(err.response);
            const error = new Error(
                err.response.data.error || 'Failed to fetch'
            );
            throw error;
         } 
        },
        async createPayaneVisitor(context, payload,actions){
            try{
                var data = payload
                console.log(data)
                const {data:responseData} = await finAgent.post('/front/payane_persons', data)
                if (responseData){
                    console.log("HERE TO have")
                    console.log(payload)
                    actions.dispatch('loadPayaneVisitors')
                }
            } catch (err) {
                //console.log(err.response);
                const error = new Error(
                    err.response.data.error || 'Failed to fetch'
                );
                throw error;
             }
        },
        async deactivePayanePerson(context,payload){
            try{
    const resonse = await finAgent.put(`/front/payane_persons/${payload.id}/deactivate`)
    if (resonse.status < 300){
    return true
        }
    else
        return false
    }catch (err) {
        //console.log(err.response);
        const error = new Error(
            err.response.data.error || 'Failed to fetch'
        );
        throw error;
     }
}}}