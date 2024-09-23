import  {cheqAgent, finAgent} from '@/services/agent'

export default{
    state(){
        return {
            cheques:[],
            errorResponse: null,
            foundCheques: [],
        }
    },
    mutations:{  
              setFoundCheques(state, cheques){
        state.foundCheques = cheques;
    },
        setCheques(state, cheques){
            state.cheques = cheques;
        },setError(state, err){
            state.errorResponse = err
        },
        nillError(state){
            state.errorResponse = null
        }
    },
    getters:{
        getCheques(state){
            return state.cheques;
        },       
        getFoundCheques(state){
            return state.foundCheques;
        },
        getError(state){
            return state.errorResponse
        }
    },
    actions:{
        async loadCheques(context, payload){
            try {
                if (payload.startDate == ""){
                    payload.startDate = "2024-01-01"
                }
                const {data: chequesData} = await cheqAgent.get(`/GetCheckList`,{ params: payload, paramsSerializer: {
                      indexes: null // by default: false
                    } })
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
        async validateCardCode(context, payload){
            context.commit('setError', null)
            try {
              
                const resp = await finAgent.post(`/front/cheques/validate_cardcode`, payload)
              
                return resp
            }catch (err){
                context.commit('setError', err)
            }
        },
        async updateChequeStates(context, payload){
            context.commit('setError', null)
       
            try {
                const {data:resp} = await finAgent.post(`/front/cheques/update_check_state`, payload)
                context.commit('setFoundCheques',[])
                return resp
            }catch (err){
                context.commit('setError', err)
            }
            
  
        },
        async searchCheques(context, payload){
            context.commit('setError', null)
            try {
                var ChecKNum = Number(payload)
                const {data: chequesData} = await cheqAgent.get(`/GetCheckListByCheckNumber?CheckNum=${ChecKNum}`)
                const cheques = []
                for (const item of chequesData) {
                    const cheque= {
                        ...item
                    }
                    cheques.push(cheque); 
                }
                context.commit('setFoundCheques',cheques)
                return cheques.length
            }catch (err){
                context.commit('setError', err)
                return err
            }
            
  
        },
        nillError(context){
            context.commit('nillError') 
        },
        async loadChequeHistory(context, payload){
            context.commit('setError', null)
            try {
                const {data: historyData} = await finAgent.get(`/front/cheques/get_check_history?check_key=${payload[0].checkKey}`);
                return historyData
            } catch (err) {
                context.commit('setError', err)
            }
        }
    }
}