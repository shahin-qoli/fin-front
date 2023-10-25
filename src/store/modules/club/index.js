import  {finAgent} from '@/services/agent'

export default{
    state(){},
    mutations:{},
    getters:{},
    actions:{
        async findClubReport(context, payload){
            try{
            const body = {mobile_number: payload}
            const response = await finAgent.post(`/v2/club/calculate`, body)  

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