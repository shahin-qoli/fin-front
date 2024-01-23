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
        async findPersonnelByMobileAndId(context, payload){
            try{
                const response = await finAgent.get(`/front//hrm_personnels/get_personnel_data?national_id=${payload.id}&mobile_number=${payload.mobile}`)
                if(response.status == 200){
                    if(response.data.is_success){
                    return {
                        success: true,
                        data: response.data.result,
                        personnel: response.data.personnel
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
        async findPersonnelById(context,payload){
            try{
                const response = await finAgent.get(`/front//hrm_personnels/get_by_national_id?national_id=${payload.id}`)
                if(response.status == 200){
                    if(response.data.is_success){
                    return {
                        success: true,
                        data: response.data.result
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
        async updateMobileNumber(context,payload){
            try{
                const response = await finAgent.post(`/front//hrm_personnels/init_personnel`,payload)
                if(response.status == 200){
                    if(response.data.is_success){
                    return {
                        success: true,
                        message: response.data.result
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