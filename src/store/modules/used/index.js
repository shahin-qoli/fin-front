import  {finAgent} from '@/services/agent'


// import actions from './actions'
export default {

    state() {
        return {
            itemCount:null,
        requests:[],
        status: ''       
    }
    },
    mutations:{
        setItemCount(state, payload){
            state.itemCount = payload;
        },
        setRequests(state, payload){
            state.requests = payload;
        },
        denyRequest(state,reqId){
            const toUpdateIndex=state.requests.findIndex(req => req.id === reqId )
            console.log(state.requests[toUpdateIndex].state.value)
            state.requests[toUpdateIndex].state = "denied"
        },
        verifyRequest(state, reqId){
            const toUpdateIndex=state.requests.findIndex(req => req.id === reqId )
            console.log(state.requests[toUpdateIndex].state.value)
            state.requests[toUpdateIndex].state = "verified"
        }
    },
    getters: {
        getRequestItemCount(state){
            return state.itemCount;
        },
        requests(state) {
            return state.requests;
        }
    },
    actions: {
        async denyRequest(context, reqId){
            try{
                const {data: requestsData} = await finAgent.get(`/front/used_payments/${reqId}/deny`);
                console.log(requestsData)
                if (requestsData.result){
                    context.commit('denyRequest', reqId) 
                    return true
                }else {
                    return false
                }

            } catch(err){
                const error = new Error(
                    err.response.data.error || 'Failed to fetch'
                );
                throw error;
            }
        },
        async verifyRequest(context, reqId){       
            try{
                const {data: requestsData} = await finAgent.get(`/front/used_payments/${reqId}/verify`);
                console.log(requestsData)
                if (requestsData.result){
                    console.log("111")
                    context.commit('verifyRequest', reqId) 
                    return true
                }else {
                    console.log("222")
                    return false
                }

            } catch(err){
                const error = new Error(
                    err.response.data.error || 'Failed to fetch'
                );
                throw error;
            }
        },
        async loadRequests(context, payload) {
            context.commit('setIsLoading', 'true')
            try {
                const {data: responseData} = await finAgent.get(`/front/used_payments?page=${payload.page}&per_page=${payload.itemsPerPage}&q[state_matches]=${payload.state}`);
                const requests = []
                var requestsData = responseData.data;
                var itemCount = responseData.options.count;
                for (const item of requestsData) {
                    const request= {
                        ...item
                    }
                    requests.push(request); 
                }
                
                context.commit('setRequests', requests)
                context.commit('setIsLoading', 'false')
                context.commit('setItemCount', itemCount);
 
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