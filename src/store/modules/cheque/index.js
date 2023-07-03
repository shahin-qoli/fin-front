import  {cheqAgent, finAgent} from '@/services/agent'

export default{
    state(){
        return {
            cheques:[],
            errorResponse: null
        }
    },
    mutations:{
        setCheques(state, cheques){
            state.cheques = cheques;
        },setError(state, err){
            state.errorResponse = err
        },
        nillError(state){
            state.errorResponse = null
        }
        // updateCheques(state, checkKeys){
            
        // }
    },
    getters:{
        getCheques(state){
            return state.cheques;
        },
        getError(state){
            return state.errorResponse
        }
    },
    actions:{
        async loadCheques(context, payload){
            try {
                console.log(payload)
                const {data: chequesData} = await cheqAgent.get(`/GetCheckList`,{ params: payload, paramsSerializer: {
                      indexes: null // by default: false
                    } })
                console.log(chequesData)
                const cheques = []
                for (const item of chequesData) {
                    const cheque= {
                        ...item
                    }
                    cheques.push(cheque); 
                }
                context.commit('setCheques',cheques)
            }
            catch(err){
                //console.log(err.response);
                const error = new Error(
                    err.response.data.error || 'Failed to fetch'
                );
                throw error;
            }
        },
        async updateCheques(context, payload){
            context.commit('setError', null)
            try {
                const {data:resp} = await finAgent.post(`/front/cheques/update_check`, payload)
                return resp
            }catch (err){
                context.commit('setError', err)
            }
            
  
        },
        nillError(context){
            context.commit('nillError') 
        }
    }
}