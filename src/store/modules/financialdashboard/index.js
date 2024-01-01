import  {finAgent} from '@/services/agent'

export default {
    data(){
        return {
            
        }
    },
    mutations:{

    },
    getters:{},
    actions:{
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