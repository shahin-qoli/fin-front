import  {finAgent} from '@/services/agent'

export default{
    state() {
        return {
            usageData: [],
            usageDataItemCount: null,
        }
    },
    mutations: {
        setUsageData(state, payload){
            state.usageData = payload;
        },
        setUsageDataItemCount(state,payload){
            state.usageDataItemCount = payload;
        }        
    },
    getters: {
        getUsageData: state => {
            return state.usageData
        },
        getUsageDataItemCount: state =>{
            return state.usageDataItemCount
;
        }
    },
    actions: {
        async verifyUsageData(context, id) {
            try {
                let payload = {id: id}
                const { data: response } = await finAgent.post(`/front/clubs/verify/`, payload);
                return response;
            } catch (error) {
                console.error(error);
                return { result: false, error: error }
            }
        },
        async denyUsageData(context, id) {
            try {
                let payload = {id: id}
                const { data: response } = await finAgent.post(`/front/clubs/deny/`, payload);
                return response;
            } catch (error) {
                console.error(error);
                return { result: false, error: error }
            }
        },
        async fetchtUsageData(context, payload) {
            try{
                console.log(payload)
                context.commit('setIsLoading',true);
                const {data: responseData} = await finAgent.get(`/front/clubs?page=${payload.page}&per_page=${payload.itemsPerPage}&q[state_eq]=${payload.state}&q[club_user_data_card_code_cont]=${payload.cardCode}`);
                let usages = responseData.data;
                let itemCount = responseData.options.count
                context.commit('setUsageData',usages);
                context.commit('setUsageDataItemCount',itemCount);
                context.commit('setIsLoading',false);
            }catch(err){
                console.log(err)
            }
        },
        async findClubReportMobile(context, payload){
            try{
            const body = {mobile_number: payload}
            const response = await finAgent.post(`/v2/club/calculate_by_mobile_number`, body)  

            if (response.status == 200)
                return  {success: true, result:response.data}
            else 
                return  {success: false, result:response.data}
            
        }catch (err) {
            //console.log(err.response);
            // console.log("ssssssssssssssssssssssssssss")
            // console.log(err)
            return  {success: false, result: err.response.data}
         } 
    },
    async findClubReportCode(context, payload){
        try{
        const body = {card_code: payload}
        const response = await finAgent.post(`/v2/club/calculate_by_cardcode`, body)  

        if (response.status == 200)
            return  {success: true, result:response.data}
        else 
            return  {success: false, result:response.data}
        
    }catch (err) {
        //console.log(err.response);
        // console.log("ssssssssssssssssssssssssssss")
        // console.log(err)
        return  {success: false, result: err.response.data}
     } 
},
async findGetClubReportMobile(contex, payload){
    try{
        const body = {mobile_number: payload}
        const response = await finAgent.get(`/v2/club/calculate_by_mobile_number?mobile_number=${payload}`, body)  

        if (response.status == 200)
            return  {success: true, result:response.data}
        else 
            return  {success: false, result:response.data}
        
    }catch (err) {
        //console.log(err.response);
        // console.log("ssssssssssssssssssssssssssss")
        // console.log(err)
        return  {success: false, result: err.response.data}
     } 
}
}}