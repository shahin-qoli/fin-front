import { finAgent } from "@/services/agent";
export default {
    state(){
        return {
            filteredCustomers:[],
            requestAccounts:[],
            requestCards:[],
            paymentRequests:[],
            paymentRequestsCount: null,
        }
    }
    ,
    mutations:{
        setFilteredCustomers(state, payload){
            state.filteredCustomers= payload;
        },
        setRequestAccounts(state, payload){
            state.requestAccounts = payload
        },
        setRequestCards(state, payload){
            state.requestCards = payload;
        },
        setPaymentRequests(state, payload){
            state.paymentRequests = payload;
        },
        setItemCount(state,payload){
            state.paymentRequestsCount = payload;
        }

    },
    actions:{
        async fetchFilteredCustomers(context,payload){
            try{
                context.commit('setIsLoading',true);
                const {data: responseData} = await finAgent.get(`/v2/club_user_data?q[card_code_cont]=${payload}`);
                let customers = responseData.data
                context.commit('setFilteredCustomers',customers);
                context.commit('setIsLoading',false);
            }catch(err){
                console.log(err)
            }
        },
        async fetchRequestAccounts(context){
            try{
                context.commit('setIsLoading',true);
                const {data: responseData} = await finAgent.get(`/front/bank_accounts`);
                let requestAccounts = responseData;
                let cards =[]
                console.log(`this is ${requestAccounts}`)
                for (const item of requestAccounts) {
                    const data= {
                        text: item.account_number,
                        value: item.account_number
                    }
                    cards.push(data); 
                }
                context.commit('setRequestAccounts',cards);
                context.commit('setIsLoading',false);
            }catch(err){
                console.log(err)
            }
        },
        async fetchRequestCards(context){
            try{
                context.commit('setIsLoading',true);
                const {data: responseData} = await finAgent.get(`/front/bank_cards?q[account_number_not_eq]=null`);
                let requestAccounts = responseData;
                let cards =[]
                for (const item of requestAccounts) {
                    if (item.account_number == null){
                        continue
                    }
                    const data= {
                        text: item.card_number,
                        value: item.card_number
                    }
                    cards.push(data); 
                }
                console.log(cards)
                context.commit('setRequestCards',cards);
                context.commit('setIsLoading',false);
            }catch(err){
                console.log(err)
            }
        },
        async createPaymentRequest(context,payload){
            try {
                context.commit('setIsLoading', true);
                let data={request:{transaction_type: payload.transactionType, amount: payload.amount, to_account: payload.toAccount, from_account: payload.fromAccount, card_code: payload.cardCode,
                    requested_by:payload.requestedBy,transaction_date: payload.transactionDate,request_extra_info: payload.requestExtraInfo}};
                console.log(data)    
                const response = await finAgent.post('/front/payment_register_requests', data);
                if (response.status === 201){
                    let id = response.data.id
                    let formData = new FormData()
                    formData.append('file', payload.file,payload.file.name)
                    const{data: responseImage} = await finAgent.post(`/front/payment_register_requests/${id}/upload_image`, formData);
                    if (responseImage.result == true){
                        return true
                    }
                    else{
                        return false
                    }
                }
                context.commit('setIsLoading', false);
                return response;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        async fetchPaymentRequests(context,payload){
            try{
                console.log(payload)
                context.commit('setIsLoading',true);
                const {data: responseData} = await finAgent.get(`/front/payment_register_requests?page=${payload.page}&per_page=${payload.itemsPerPage}&q[state_eq]=${payload.state}&q[requested_by_eq]=${payload.requestedBy}&q[card_code_cont]=${payload.cardCode}`);
                let paymentRequests = responseData.data;
                let itemCount = responseData.options.count
                context.commit('setPaymentRequests',paymentRequests);
                context.commit('setItemCount',itemCount);
                context.commit('setIsLoading',false);
            }catch(err){
                console.log(err)
            }
        },
        async processingPaymentRequest(context,payload){
            try{
                context.commit('setIsLoading',true);
                const  {data: responseData} = await finAgent.post(`/front/payment_register_requests/${payload.id}/processing`,payload);
                context.commit('setIsLoading',false);
                return responseData.result;
            }catch(err){
                console.log(err);
                throw err;
            }
        },
        async verifyPaymentRequest(context,payload){
            try{
                context.commit('setIsLoading',true);
                const  {data: responseData} = await finAgent.post(`/front/payment_register_requests/${payload.id}/verify`,payload);
                context.commit('setIsLoading',false);
                return responseData.result;
            }catch(err){
                console.log(err);
                throw err;
            }
        },
        async denyPaymentRequest(context,payload){
            try{
                
                context.commit('setIsLoading',true);
                const {data: responseData} = await finAgent.post(`/front/payment_register_requests/${payload.id}/deny`,payload);
                context.commit('setIsLoading',false);
                return responseData.result;
            }catch(err){
                console.log(err);
                throw err;
            }
        }
    }
    ,
    getters:{
        getFilteredCustomers: state => {
            return state.filteredCustomers
        },
        getRequestAccounts: state => {
            return state.requestAccounts
        },
        getRequestCards: state => {
            return state.requestCards
        },
        getPaymentRequests: state => {
            return state.paymentRequests
        },
        getPaymentRequestsItemCount: state =>{
            return state.paymentRequestsCount;
        }
    }
}