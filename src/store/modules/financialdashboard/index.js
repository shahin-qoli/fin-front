import  {finAgent} from '@/services/agent'

export default {
    state(){
        return {
            orders:[],
            automatedOrders:[]
        }
    },
    mutations:{
        setOrders(state,payload){
            state.orders=payload;
        },
        setAutomateOrders(state,payload){
            state.automatedOrders = payload
        }
    },
    getters:{
        getFinancialOrders(state){
            return state.orders;
        },
        getAutomatedOrders(state){
            return state.automatedOrders;
        }
    },
    actions:{
        async fetchtFinancialOrders(context, payload){
            try{
                let params= {doc_num: payload.docNum,state: payload.orderState, end_date: payload.endDate, start_date: payload.startDate, card_code: payload.cardCode}
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
        async fetchtAutomateOrders(context, payload){
            try{
                let params= {docnum_cont: payload.docNum,state_cont: payload.orderState, card_code_cont: payload.cardCode}
                const {data: responseData} = await finAgent.get(`/front/automate_sale_orders?page=${payload.page}&per_page=${payload.itemsPerPage}`,{params: params})
                if (responseData.result)
                    context.commit('setAutomateOrders', responseData.result)
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
        },
        async prepareFinancialDashboardData(context, payload){
            try{
                const response = await finAgent.get(`/front/order_dashboards/report?doc_entry=${payload}`)
                if(response.status == 200){
                    if(response.data.error == null){
                        let postData = {current_state: `a${response.data.order.docStatus}`,
                        order_docentry:response.data.order.docEntry,
                        operator_group_code: localStorage.getItem("userRole") ,
                        operator_code: Number.parseInt(localStorage.getItem("b1OperatorCode"))}
                        console.log(postData)
                        const responseNext = await finAgent.post(`/v2/bpms/validated_next_states`, postData)
                        if (responseNext.status == 200){
                            if (responseNext.data.error == null){
                            return {
                                success: true,
                                data: response.data,
                                actions: responseNext.data.actions,
                                nextStates: responseNext.data.data
                            }}
                            else{
                                return{
                                    success: true,
                                    data: response.data,
                                    nextStates: []
                                }
                            }
                        }else{
                            return{
                            success: false,
                            error: responseNext.data.error
                            }
                        }
                        }else{
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
        },
        async doB1ActionBpms(context, payload){
            try{
                const response = await finAgent.post(`/front/order_dashboards/do_action`,payload)
                if(response.status == 200){
                    return response.data
                }else{
                    return {
                        is_success: false,
                        error: "خطا در برقراری ارتباط با سرور"
                    }
                }
            }catch(error){
                return {
                    is_success: false,
                    error: error
                }
            }
        
        }}
}