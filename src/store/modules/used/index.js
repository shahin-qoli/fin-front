import  {finAgent} from '@/services/agent'


// import actions from './actions'
export default {

    state() {
        return {
        requests:[],
        status: ''       
    }
    },
    mutations:{
        setRequests(state, payload){
            state.requests = payload;
        },
        verifyRequest(state, reqId){
            const toUpdateIndex=state.requests.findIndex(req => req.id === reqId )
            console.log(state.requests[toUpdateIndex].state.value)
            state.requests[toUpdateIndex].state = "verified"
        }
    },
    getters: {
        requests(state) {
            return state.requests;
        }
    },
    actions: {
        async verifyRequest(context, reqId){
            
            try{
                const {data: requestsData} = await finAgent.get(`/used_payments/${reqId}/verify`);
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
        async loadRequests(context) {
            context.commit('setIsLoading', 'true')
            try {
                const {data: requestsData} = await finAgent.get('/used_payments');
                const requests = []
                for (const item of requestsData) {
                    const request= {
                        ...item
                    }
                    requests.push(request); 
                }
                
                context.commit('setRequests', requests)
                context.commit('setIsLoading', 'false')
 
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