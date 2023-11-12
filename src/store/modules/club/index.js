import  {finAgent} from '@/services/agent'

export default{
    state(){},
    mutations:{},
    getters:{},
    actions:{
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