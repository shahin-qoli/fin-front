import { finAgent, spreeAgent } from "@/services/agent";

export default {
    state(){
        return {
            miarzeOrders:[],
            itemCount: null,
            itemCountMessageTemplate: null,
            miarzeMessageTemplates:[],
            miarzeOrderMessageTemplates:[],
            filteredProducts: [],
            createdGrpo:[],
            itemCountCreatedGrpo: null,
        }
    },
    mutations:{
        setMiarzeOrders(state, payload){
            state.miarzeOrders = payload;
        },
        setItemCountMiarze(state, payload){
            state.itemCount = payload;
        },
        setMiarzeMessageTemplatesItemCount(state,payload){
            state.itemCountMessageTemplate = payload
        },
        setMiarzeMessageTemplates(state,payload){
         state.miarzeMessageTemplates = payload
        },
        setMiarzeOrderMessageTemplates(state,payload){
            state.miarzeOrderMessageTemplates= payload
        },
        setFilteredProducts(state,payload){
            state.filteredProducts = payload
        },
        setCreatedGrpo(state,payload){
            state.createdGrpo = payload
        },
        setItemCountCreatedGrpo(state,payload){
            state.itemCountCreatedGrpo = payload
        }
    },
    actions:{
        async loadMiarzeOrders(context, payload){
            try{
                
                const filters = {
                    'q[order_created_at_gt]': payload.orderCreatedAtGt,
                    'q[order_updated_at_gt]': payload.orderUpdatedAtGt,
                    'q[order_state_eq]': payload.orderState,
                  };
                  const sorting = payload.sortBy + ' ' + (payload.sortDesc[0] ? 'desc' : 'asc')
                  console.log(payload)
                  console.log(filters)
                  const params= {
                    ...filters,
                    page:payload.page,
                    per_page: payload.itemsPerPage,   
                    sorts: sorting               
                }
                console.log("start")
                console.log( params);
                 
                  const apiUrl = '/front/miarze_orders?' + Object.entries(params).map(([key, value]) => `${key}=${value}`).join('&');
                  console.log("API URL:", apiUrl);
                  
                  const {data: responseData} = await finAgent.get(apiUrl)
                
                var miarzeOrderData = responseData.data;
                const miarzeOrders = []
                var itemCount = responseData.options.count;
                for (const item of miarzeOrderData) {
                    const miarzeOrder= {
                        ...item
                    }
                    miarzeOrders.push(miarzeOrder); 
                }

                context.commit('setMiarzeOrders', miarzeOrders)
                context.commit('setItemCountMiarze', itemCount);
            }catch(err){
            const error = new Error(
                err.response.data.error || 'Failed to fetch'
            );
            throw error;
            }
        },
        async loadMiarzeMessageTemplates(context){
            try{

                const {data: responseData} = await finAgent.get(`/front/miarze_message_templates`);
                var miarzeMessageTemplateData = responseData.data;
                const miarzeMessageTemplates = []
                var itemCount = responseData.options.count;
                for (const item of miarzeMessageTemplateData) {
                    const miarzeMessageTemplate= {
                        ...item
                    }
                    miarzeMessageTemplates.push(miarzeMessageTemplate); 
                }
                context.commit('setMiarzeMessageTemplates', miarzeMessageTemplates)
                context.commit('setMiarzeMessageTemplatesItemCount', itemCount);
            }catch(err){
            const error = new Error(
                err.response.data.error || 'Failed to fetch'
            );
            throw error;
        }},
        async sendMessageToOrder(context, payload){
            try{
                let data = {order_ids: payload.selectedOrders.map(item=> item.key), template_id: payload.selectedTemplate} 
                const {data: responseData} = await finAgent.post(`/front/miarze_orders/send_sms`, data);
                console.log(responseData)
                return responseData
            }catch(err){
            const error = new Error(
                err.response.data.error || 'Failed to fetch'
            );
            throw error;
        }
        },        
        async editMiarzeMessageTemplate(context, payload){
            try{

                console.log(payload)
                var body = {miarze_message_template: payload}
                const {data: responseData} = await finAgent.put(`/front/miarze_message_templates/${payload.id}`,body);
                console.log(responseData)
                if (responseData.id){
                    return responseData.id
                }
            }catch(err){
            const error = new Error(
                err.response.data.error || 'Failed to fetch'
            );
            throw error;
        }},        
        async createMiarzeMessageTemplate(context,payload){
            try{

                var body = {miarze_message_template: payload}
                const {data: responseData} = await finAgent.post(`/front/miarze_message_templates`,body);
                if (responseData){
                    return responseData.id
                }
            }catch(err){
            const error = new Error(
                err || 'Failed to fetch'
            );
            throw error;
        }},
        async updateMiarzeOrders(context,payload){
            try{
                console.log(payload)
                const {data: responseData} = await finAgent.get(`/front/miarze_orders/update_orders?start_date=${payload}`);
                if (responseData)
                    return responseData
            }catch(err){
            const error = new Error(
                err.response.data.error || 'Failed to fetch'
            );
            throw error;
            }
        },
        async loadOrderMessageTemplates(context){
            try{
                const {data: responseData} = await spreeAgent.get(`/storefront/message_templates`);
                var miarzeOrderMessageTemplateData = responseData.result;
                const miarzeOrderMessageTemplates = []
                for (const item of miarzeOrderMessageTemplateData) {
                    const miarzeMessageTemplate= {
                        ...item
                    }
                    miarzeOrderMessageTemplates.push(miarzeMessageTemplate); 
                }    
                context.commit('setMiarzeOrderMessageTemplates', miarzeOrderMessageTemplates)

            }catch(err){
                    const error = new Error(
                        err.response.data.error || 'Failed to fetch'
                    );
                    throw error;
            }
        },
        async updateMiarzeOrderMessageTemplate(context,payload){
            console.log("AAAAAAAAAAAAAAAAAA")
            console.log(payload)
            try{
                const {data: responseData} = await spreeAgent.put(`/storefront/message_templates/${payload.id}`,payload);
                return responseData
            }catch(err){
                return{success: false, error: err}
            }
        },
        async fetchFilteredProducts(context,payload){
            try{
                context.commit('setIsLoading',true);
                const {data: responseData} = await finAgent.get(`/front/b1_items_data?q[item_code_cont]=${payload}`);
                let products = responseData.data
                context.commit('setFilteredProducts',products);
                context.commit('setIsLoading',false);
            }catch(err){
                console.log(err)
            }
        },
        async createGrpo(context,payload){

            let data =  {grpo: {docdate: payload.docdate, vendor_code: payload.vendor_code,vendor_name: payload.vendor_name, data: payload}}
            try{
                const {data: responseData} = await finAgent.post(`/front/create_grpos`,data);
                return responseData
            }catch(err){
                return{is_success: false, error: err}
            }
        },        
        async updateRetryCreateGrpo(context,payload){
            console.log("lllllllllll")   
            console.log(payload)
            let data =  {grpo: { data: payload.data}}
            try{
                const {data: responseData} = await finAgent.post(`/front/create_grpos/${payload.id}/retry_create`,data);
                return responseData
            }catch(err){
                return{is_success: false, error: err}
            }
        },
        async loadCreatedGrpo(context,payload){
            try{
                const {data: responseData} = await finAgent.get(`/front/create_grpos?page=${payload.page}&per_page=${payload.itemsPerPage}`);
                var miarzeOrderData = responseData.data;
                const miarzeOrders = []
                var itemCount = responseData.options.count;
                for (const item of miarzeOrderData) {
                    const miarzeOrder= {
                        ...item
                    }
                    miarzeOrders.push(miarzeOrder); 
                }

                context.commit('setCreatedGrpo', miarzeOrders)
                context.commit('setItemCountCreatedGrpo', itemCount);  
            }catch(err){
                console.log(err)
            }
        }
    },
    getters:{
        getMiarzeOrders(state){
            return state.miarzeOrders;
        },
        getMiarzeOrdersItemCount(state){
            return state.itemCount;
        },
        getMiarzeMessageTemplatesItemCount(state){
            return state.itemCountMessageTemplate;
        },
        getMiarzeMessageTemplates(state){
        return state.miarzeMessageTemplates;
        },
        getMiarzeOrderMessageTemplates(state){
            return state.miarzeOrderMessageTemplates;
        },
        getFilteredProducts: state => {
            return state.filteredProducts;
        },
        getCreatedGrpo: state => {
            return state.createdGrpo;
        },
        getItemCountCreatedGrpo(state){
            return state.itemCountCreatedGrpo;
        }
    }
}