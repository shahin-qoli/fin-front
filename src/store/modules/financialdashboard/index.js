import  {finAgent} from '@/services/agent'

export default {
    state(){
        return {
            orders:[]
        }
    },
    mutations:{
        setOrders(state,payload){
            state.orders=payload;
        }
    },
    getters:{
        getFinancialOrders(state){
            return state.orders;
        }
    },
    actions:{
        async fetchtFinancialOrders(context, payload){
            try{
                let params= {state: payload.state, end_date: payload.endDate, start_date: payload.startDate, card_code: payload.cardCode}
                const {data: responseData} = await finAgent.get(`/front/order_dashboards`,{params: params})
                if (responseData.result)
                    context.commit('setOrders', responseData.result)
            }catch(err){
                const error = new Error(
                    err.response.data.error || 'Failed to fetch'
                );
                throw error;
            }
        },
        async fetchFinancialDashboardData(context, payload){
            try{
                const response = await finAgent.get(`/front/order_dashboards/report?doc_num=${payload}`)
                if(response.status == 200){
                    if(response.data.error == null){
                    return {
                        success: true,
                        data: response.data
                    }}else{
                        return {
                            success: false,
                            error: response.data.error
                        }
                    }
                }else{
                    return {
                        success: false,
                        error: response.data
                    }
                }
            }catch(error){
                return {
                    success: false,
                    error: error
                }
            }
        }
    }
}