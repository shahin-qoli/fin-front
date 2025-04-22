import  {finAgent} from '@/services/agent'

export default {
    state(){
        return {
            attendanceRequest:[],
            attendanceRequestCount:null
        }
    },
    mutations:{
        setAttendanceRequest(state, payload){
            state.attendanceRequest = payload
    },
    setAttendanceRequestCount(state, payload){
        state.attendanceRequestCount = payload
}
    },
    getters:{        getAttendanceRequest: state => {
           
        return state.attendanceRequest
    },        getAttendanceRequestCount: state => {
        return state.attendanceRequestCount
    },},
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
        },
        async LoadAttendanceRequest(context, payload){
            try{
                const {data: responseData}  = await finAgent.get(`/front/hrm_attendance_requests?q[state_eq]=${payload.selectedState}`)
                let reqs = responseData.data
                let itemCount = responseData.options.count;
                context.commit('setAttendanceRequest',reqs);
                context.commit('setAttendanceRequestCount',itemCount);
            }catch(error){
                console.log(error)
            }          
        },
        async completeAttendanceRequest(context, payload){
            try{
                let id = payload.id
                let data = {
                    reject_extra_info: payload.reject_extra_info,
                    handle_by_id: localStorage.getItem("userId"),
                    request_extra_info: payload.request_extra_info
                }
                const response = await finAgent.post(`/front/hrm_attendance_requests/${id}/complete_request`,data)
                if(response.status == 200){
                    return {
                        success: true,
                    }
                }else{
                    return {
                        success: false,
                        message: response.data.error
                    }
                }
            }catch{
                return {
                    success: false,
                    error: error
                }
            }
        },
        async denyAttendanceRequest(context, payload){
            try{
                let id = payload.id
                let data = {
                    reject_extra_info: payload.reject_extra_info,
                    rejected_by: `U,${localStorage.getItem("userId")}`,
                    request_extra_info: payload.request_extra_info
                }
                const response = await finAgent.post(`/front/hrm_attendance_requests/${id}/deny_request`,data)
                if(response.status == 200){
                    return {
                        success: true,
                    }
                }else{
                    return {
                        success: false,
                        message: response.data.error
                    }
                }
            }catch{
                return {
                    success: false,
                    error: error
                }
            }
        },
    }
}