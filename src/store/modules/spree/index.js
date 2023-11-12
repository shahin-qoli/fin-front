import { spreeAgent } from "@/services/agent";

export default {
    state(){
        return {
            orders:[],
            itemCount: null,
        }
    },
    mutations:{
        setOrders(state, orders){
            state.orders = orders;
        },
        setItemCount(state, payload){
            state.itemCount = payload
        },
    },
    getters:{
        getOrders(state){
            return state.orders;
        },
        getItemCount(state){
            return state.itemCount;
        },
    },
    actions:{
        async loadOrders(context, payload) {
            console.log("lets go")
            try {

                const {data: responseData} = await spreeAgent.get(`/platform/orders?page=${payload.page}
                &per_page=${payload.itemsPerPage}&filter[b1_documented_eq]=${payload.hasB1Docs}
                &filter[completed_at_lteq]=${payload.completedAtLteq}&filter[completed_at_gteq]=${payload.completedAtGteq}
                &filter[state_eq]=complete&filter[number_eq]=${payload.number}&filter[need_document_eq]=${payload.needB1Docs}`)
                const orders = []
                const ordersData= responseData.data
                for (const item of ordersData) {
                    const order= {
                        ...item.attributes
                    }
                    orders.push(order); 
                }
                let itemCount = responseData.meta.total_count
                context.commit('setItemCount', itemCount)
                context.commit('setOrders', orders)
            }
            catch(err){
                console.log('sssssssssssss222222222')
                console.log(err);
                const error = new Error(
                    err.response.data.error || 'Failed to fetch'
                );
                throw error;
            }
        },
        async createSo(contex, payload){
            try {
                let orderNumbers= []
                payload.selectedItems.forEach(item => {
                    orderNumbers.push(item.number)
                });
                const body ={order_numbers: orderNumbers, account_code: payload.selectedAccount} 
                const {data: responseData} = await spreeAgent.post(`/storefront/b1_requests/by_order_numbers`, body)

                const results= responseData.results
                return results
                // for (const item of ordersData) {
                //     const order= {
                //         ...item.attributes
                //     }
                //     orders.push(order); 
                // }
                // let itemCount = responseData.meta.total_count
            }
            catch(err){
                const error = new Error(
                    err.response.data.error || 'Failed to fetch'
                );
                throw error;
            }
        },
        async loadOrdersForVendors(context){
            try{

                const {data: responseData} = await spreeAgent.get(`storefront/dashboard_controller`)
                const orders = []
                const ordersData= responseData
                console.log(ordersData)
                for (const item of ordersData) {
                    const order= {
                        ...item.attributes
                    }
                    orders.push(order); 
                }

                context.commit('setOrders', orders)

            }catch(err){
                const error = new Error(
                    err.response.data.error || 'Failed to fetch'
                );
                throw error;
            }
        },
        async retryOrdersVendor(context, payload){
            try {
                let orderIds= []
                payload.forEach(item => {
                    orderIds.push(item.id)
                });
                const body ={order_ids: orderIds} 
                const {data: responseData} = await spreeAgent.post(`/storefront/dashboard_controller/retry_by_orders`, body)

                const results= responseData
                return results
                // for (const item of ordersData) {
                //     const order= {
                //         ...item.attributes
                //     }
                //     orders.push(order); 
                // }
                // let itemCount = responseData.meta.total_count
            }
            catch(err){
                const error = new Error(
                    err.response.data.error || 'Failed to fetch'
                );
                throw error;
            }
        },
        async createInvoice(context, payload){
            try {
                let orderNumbers= []
                payload.selectedItems.forEach(item => {
                    orderNumbers.push(item.number)
                });
                const body ={order_numbers: orderNumbers} 
                const {data: responseData} = await spreeAgent.post(`/storefront/b1_requests/deliver_and_invoice_by_order_numbers`, body)
                const results= responseData.results
                return results
            }
            catch(err){
                const error = new Error(
                    err.response.data.error || 'Failed to fetch'
                );
                throw error;
            }            
        }

    }
}
