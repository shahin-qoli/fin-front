import  {finAgent} from '@/services/agent'

export default {
    state(){
        return {
            orders:[],
            automatedOrders:[],
            automatedOrdersItemCount: null 
        }
    },
    mutations:{
        setOrders(state,payload){
            state.orders=payload;
        },
        setAutomateOrders(state,payload){
            state.automatedOrders = payload
        },
        setItemCount(state, payload){
            state.automatedOrdersItemCount = payload
        },
    },
    getters:{
        getFinancialOrders(state){
            return state.orders;
        },
        getAutomatedOrders(state){
            return state.automatedOrders;
        },
        getAutomatedOrdersItemCount(state){
            return state.automatedOrdersItemCount;
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
                if(payload.startDate == null){
                    payload.startDate = '2024-03-20'
                }
                let params= {'q[ready_to_invoice_eq]':payload.readyToInvoice,'q[is_synced_eq]':payload.isSynced,
                'q[docnum_cont]': payload.docNum,'q[state_cont]': payload.orderState, 'q[card_code_cont]': payload.cardCode,
                'q[need_invoice_eq]': payload.needInvoice,'q[docdate_gt]': payload.startDate}
                const {data: responseData} = await finAgent.get(`/front/automate_sale_orders?page=${payload.page}&per_page=${payload.itemsPerPage}`,{params: params})
                var orders = responseData.data;
                var itemCount = responseData.options.count;
                context.commit('setAutomateOrders', orders)
                context.commit('setItemCount', itemCount);
                return true
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
        
        },
        async updateReadyToInvoiceSingle(context,payload){
            try {
                const response = await finAgent.post(`/front/automate_sale_orders/${payload}/update_ready_to_invoice_single`)
                if(response.status == 200){
                    return response.data
                }else{
                    return {
                        is_success: false,
                        error: "خطا در برقراری ارتباط با سرور"
                    }
                }
            }
            catch(error){
                return {
                    is_success: false,
                    error
                }
            }
        },
        async createInvoiceSingle(context,payload){
            try {
                const response = await finAgent.post(`/front/automate_sale_orders/${payload}/create_invoice_single`)
                if(response.status == 200){
                    return response.data
                }else{
                    return {
                        is_success: false,
                        error: "خطا در برقراری ارتباط با سرور"
                    }
                }
            }
            catch(error){
                return {
                    is_success: false,
                    error
                }
            }
        },
        async updateDataFromB1AutomateOrder(){
            try {
                const response = await finAgent.post('/front/automate_sale_orders/update_orders')
                if(response.status == 200){
                    return response.data
                }else{
                    return {
                        is_success: false,
                        error: "خطا در برقراری ارتباط با سرور"
                    }
                }
            }
            catch(error){
                return {
                    is_success: false,
                    error
                }
            }
        },
        async checkAllOrdersAutomateOrder(){
            try {
                const response = await finAgent.post('/front/automate_sale_orders/update_ready_to_invoice')
                if(response.status == 200){
                    return response.data
                }else{
                    return {
                        is_success: false,
                        error: "خطا در برقراری ارتباط با سرور"
                    }
                }
            }
            catch(error){
                return {
                    is_success: false,
                    error
                }
            }
        }
        ,
        async createInvoiceAllAutomateOrder(){
            try {
                const response = await finAgent.post('/front/automate_sale_orders/create_invoice')
                if(response.status == 200){
                    return response.data
                }else{
                    return {
                        is_success: false,
                        error: "خطا در برقراری ارتباط با سرور"
                    }
                }
            }
            catch(error){
                return {
                    is_success: false,
                    error
                }
            }
        }
}
}